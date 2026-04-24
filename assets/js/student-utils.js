// Shared utilities for all student portal pages

const STUDENT_TERMS = [
    { term: '2nd Term', session: '2025/2026' },
];

function setStudentAvatar(el, currentUser, initials) {
    if (!el) return;
    if (currentUser.photo_url) {
        el.style.background = 'none';
        el.style.padding = '0';
        el.innerHTML = `<img src="${currentUser.photo_url}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block">`;
    } else {
        el.textContent = initials || 'S';
    }
}

async function openStudentReportCard(currentUser) {
    const studentId = currentUser.student_id;
    if (!studentId) {
        showStudentNotification('Student record not found. Please contact the school office.', 'error');
        return;
    }

    let student;
    try {
        const res = await fetch('/api/students');
        const data = await res.json();
        student = (data.students || []).find(s => s.id === studentId);
        if (!student) throw new Error('not found');
    } catch (e) {
        showStudentNotification('Could not load your record. Please try again.', 'error');
        return;
    }

    // Build the term picker modal
    const existing = document.getElementById('report-picker-modal');
    if (existing) existing.remove();

    const isPublished = !!student.result_published;

    const cardsHtml = STUDENT_TERMS.map(({ term, session }) => {
        // Only the current term can ever be published at this stage
        const isCurrent = term === '2nd Term' && session === '2025/2026';
        const available = isCurrent && isPublished;
        const url = `report-card.html?id=${student.id}&class_key=${student.class_key}&term=${encodeURIComponent(term)}&session=${encodeURIComponent(session)}`;

        return `
        <div style="border:1px solid ${available ? '#c5cae9' : '#eee'};border-radius:10px;padding:18px 20px;
            display:flex;align-items:center;justify-content:space-between;gap:12px;
            background:${available ? '#f5f6ff' : '#fafafa'}">
            <div style="display:flex;align-items:center;gap:14px">
                <div style="width:44px;height:44px;border-radius:10px;background:${available ? '#e8eaf6' : '#f0f0f0'};
                    display:flex;align-items:center;justify-content:center;flex-shrink:0">
                    <i class="fas fa-file-alt" style="color:${available ? '#5c6bc0' : '#ccc'};font-size:1.1rem"></i>
                </div>
                <div>
                    <div style="font-weight:600;font-size:0.92rem;color:${available ? '#333' : '#aaa'}">${term} &mdash; ${session}</div>
                    <div style="font-size:0.78rem;margin-top:3px;color:${available ? '#5c6bc0' : '#f57f17'}">
                        ${available
                            ? '<i class="fas fa-check-circle"></i> Result published &mdash; ready to view'
                            : '<i class="fas fa-clock"></i> Result not yet published'}
                    </div>
                </div>
            </div>
            ${available
                ? `<a href="${url}" target="_blank"
                    style="padding:8px 18px;background:#5c6bc0;color:#fff;border-radius:6px;font-size:0.82rem;
                    text-decoration:none;white-space:nowrap;font-weight:500">
                    <i class="fas fa-eye"></i> View
                   </a>`
                : `<span style="font-size:0.78rem;color:#ccc;font-style:italic;white-space:nowrap">Not available</span>`
            }
        </div>`;
    }).join('');

    const modal = document.createElement('div');
    modal.id = 'report-picker-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px';
    modal.innerHTML = `
        <div style="background:#fff;border-radius:12px;width:100%;max-width:500px;max-height:90vh;overflow-y:auto;padding:28px;position:relative">
            <button id="rp-close" style="position:absolute;top:14px;right:16px;background:none;border:none;font-size:1.4rem;cursor:pointer;color:#999">&times;</button>
            <h2 style="margin:0 0 4px;font-size:1.1rem">My Report Cards</h2>
            <p style="margin:0 0 20px;color:#888;font-size:0.88rem">${currentUser.name || currentUser.full_name || ''} &mdash; ${currentUser.class_name || ''}</p>
            <div style="display:flex;flex-direction:column;gap:12px">${cardsHtml}</div>
            <p style="margin-top:16px;font-size:0.75rem;color:#bbb;text-align:center">
                Results are published by the head teacher at the end of each term.
            </p>
        </div>`;

    modal.querySelector('#rp-close').onclick = () => modal.remove();
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
    document.body.appendChild(modal);
}

function showStudentNotification(message, type = 'info') {
    let n = document.querySelector('.notification');
    if (!n) { n = document.createElement('div'); document.body.appendChild(n); }
    n.textContent = message;
    n.className = `notification notification-${type} show`;
    setTimeout(() => n.classList.remove('show'), 4000);
}
