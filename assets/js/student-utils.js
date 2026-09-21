// Shared utilities for all student portal pages

let STUDENT_TERMS = [{ term: '3rd Term', session: '2025/2026' }];
let _termLoaded = false;

async function loadCurrentTerm() {
    if (_termLoaded) return;
    try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        const term = data.settings?.current_term;
        const session = data.settings?.current_session;
        if (term && session) STUDENT_TERMS = [{ term, session }];
    } catch (e) { /* use default */ }
    _termLoaded = true;
}

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
    await loadCurrentTerm();
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

    // Fetch archived results
    let archives = [];
    try {
        const aRes = await fetch(`/api/archive?student_id=${studentId}`);
        const aData = await aRes.json();
        archives = aData.archives || [];
    } catch (e) { /* ignore */ }

    const existing = document.getElementById('report-picker-modal');
    if (existing) existing.remove();

    const isPublished = !!student.result_published;

    // Current term card
    const { term, session } = STUDENT_TERMS[0];
    const currentUrl = `report-card.html?id=${student.id}&class_key=${student.class_key}&term=${encodeURIComponent(term)}&session=${encodeURIComponent(session)}`;
    const currentCard = `
        <div style="border:1px solid ${isPublished ? '#c5cae9' : '#eee'};border-radius:10px;padding:18px 20px;
            display:flex;align-items:center;justify-content:space-between;gap:12px;
            background:${isPublished ? '#f5f6ff' : '#fafafa'}">
            <div style="display:flex;align-items:center;gap:14px">
                <div style="width:44px;height:44px;border-radius:10px;background:${isPublished ? '#e8eaf6' : '#f0f0f0'};
                    display:flex;align-items:center;justify-content:center;flex-shrink:0">
                    <i class="fas fa-file-alt" style="color:${isPublished ? '#5c6bc0' : '#ccc'};font-size:1.1rem"></i>
                </div>
                <div>
                    <div style="font-weight:600;font-size:0.92rem;color:${isPublished ? '#333' : '#aaa'}">${term} &mdash; ${session} <span style="font-size:0.72rem;background:#e8eaf6;color:#3949ab;padding:2px 8px;border-radius:10px;margin-left:4px">Current</span></div>
                    <div style="font-size:0.78rem;margin-top:3px;color:${isPublished ? '#5c6bc0' : '#f57f17'}">
                        ${isPublished
                            ? '<i class="fas fa-check-circle"></i> Result published &mdash; ready to view'
                            : '<i class="fas fa-clock"></i> Result not yet published'}
                    </div>
                </div>
            </div>
            ${isPublished
                ? `<a href="${currentUrl}" target="_blank"
                    style="padding:8px 18px;background:#5c6bc0;color:#fff;border-radius:6px;font-size:0.82rem;
                    text-decoration:none;white-space:nowrap;font-weight:500">
                    <i class="fas fa-eye"></i> View
                   </a>`
                : `<span style="font-size:0.78rem;color:#ccc;font-style:italic;white-space:nowrap">Not available</span>`
            }
        </div>`;

    // Archived term cards
    const archiveCards = archives.map(a => {
        const url = `report-card.html?id=${student.id}&class_key=${a.class_key || student.class_key}&term=${encodeURIComponent(a.term)}&session=${encodeURIComponent(a.session)}&archived=1`;
        return `
        <div style="border:1px solid #c8e6c9;border-radius:10px;padding:18px 20px;
            display:flex;align-items:center;justify-content:space-between;gap:12px;background:#f9fff9">
            <div style="display:flex;align-items:center;gap:14px">
                <div style="width:44px;height:44px;border-radius:10px;background:#e8f5e9;
                    display:flex;align-items:center;justify-content:center;flex-shrink:0">
                    <i class="fas fa-archive" style="color:#2e7d32;font-size:1.1rem"></i>
                </div>
                <div>
                    <div style="font-weight:600;font-size:0.92rem;color:#333">${a.term} &mdash; ${a.session}</div>
                    <div style="font-size:0.78rem;margin-top:3px;color:#2e7d32">
                        <i class="fas fa-check-circle"></i> Archived result
                    </div>
                </div>
            </div>
            <a href="${url}" target="_blank"
                style="padding:8px 18px;background:#2e7d32;color:#fff;border-radius:6px;font-size:0.82rem;
                text-decoration:none;white-space:nowrap;font-weight:500">
                <i class="fas fa-eye"></i> View
            </a>
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
            <div style="display:flex;flex-direction:column;gap:12px">
                ${currentCard}
                ${archiveCards}
            </div>
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
