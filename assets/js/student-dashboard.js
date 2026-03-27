document.addEventListener('DOMContentLoaded', async function () {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));

    if (!currentUser) { window.location.href = 'portal.html'; return; }
    if (currentUser.role !== 'student') { window.location.href = 'portal.html'; return; }

    // Date
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    // Name & class
    const firstName = (currentUser.name || currentUser.full_name || 'Student').split(' ').find(p => !['mr.','mrs.','ms.','dr.'].includes(p.toLowerCase())) || 'Student';
    const initials = (currentUser.name || currentUser.full_name || 'S').split(' ').filter(Boolean).map(w => w[0]).join('').substring(0, 2).toUpperCase();

    document.getElementById('welcome-name').textContent = firstName;
    document.getElementById('student-name').textContent = currentUser.name || currentUser.full_name || currentUser.username;
    document.getElementById('student-grade').textContent = currentUser.class_name || 'Student';
    document.getElementById('stat-class').textContent = currentUser.class_name || '—';
    document.getElementById('stat-admission').textContent = currentUser.admission_number || currentUser.username || '—';

    // Avatar — show photo if available, otherwise initials
    setStudentAvatar(document.getElementById('student-avatar'), currentUser, initials);

    // Sidebar toggle
    const sidebar = document.querySelector('.dashboard-sidebar');
    document.getElementById('sidebar-toggle')?.addEventListener('click', e => {
        sidebar.classList.toggle('active');
        e.stopPropagation();
    });
    document.addEventListener('click', e => {
        if (sidebar.classList.contains('active') && !sidebar.contains(e.target))
            sidebar.classList.remove('active');
    });

    // Logout
    document.getElementById('logout-btn')?.addEventListener('click', e => {
        e.preventDefault();
        ['currentUser', 'authToken'].forEach(k => {
            localStorage.removeItem(k);
            sessionStorage.removeItem(k);
        });
        window.location.href = 'portal.html';
    });

    // Check report card status
    await checkReportStatus(currentUser);

    // Report card button
    document.getElementById('view-report-btn')?.addEventListener('click', () => openStudentReportCard(currentUser));
    document.getElementById('report-card-link')?.addEventListener('click', e => {
        e.preventDefault();
        openStudentReportCard(currentUser);
    });
});

async function checkReportStatus(currentUser) {
    try {
        const res = await fetch('/api/students');
        const data = await res.json();
        const student = (data.students || []).find(s => s.id === currentUser.student_id);
        const statusEl = document.getElementById('stat-report');
        if (!student) { statusEl.textContent = '—'; return; }
        if (student.result_published) {
            statusEl.textContent = 'Ready';
            statusEl.style.color = '#2e7d32';
        } else {
            statusEl.textContent = 'Pending';
            statusEl.style.color = '#f57f17';
        }
    } catch (e) {
        document.getElementById('stat-report').textContent = '—';
    }
}

async function openStudentReportCard(currentUser) {
    const studentId = currentUser.student_id;
    const classKey = currentUser.class_key;

    if (!studentId) {
        showNotification('Student record not found. Please contact the school office.', 'error');
        return;
    }

    try {
        const res = await fetch('/api/students');
        const data = await res.json();
        const student = (data.students || []).find(s => s.id === studentId);

        if (!student) {
            showNotification('Student record not found. Please contact the school office.', 'error');
            return;
        }

        if (!student.result_published) {
            showNotification('Your report card has not been published yet. Please check back later.', 'info');
            return;
        }

        const term = encodeURIComponent('2nd Term');
        const session = encodeURIComponent('2025/2026');
        window.open(`report-card.html?id=${student.id}&class_key=${classKey || student.class_key}&term=${term}&session=${session}`, '_blank');
    } catch (e) {
        showNotification('Could not load report card. Please try again.', 'error');
    }
}

function setStudentAvatar(el, currentUser, initials) {
    if (!el) return;
    if (currentUser.photo_url) {
        el.innerHTML = `<img src="${currentUser.photo_url}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
        el.textContent = '';
    } else {
        el.textContent = initials || 'S';
    }
}

function showNotification(message, type = 'info') {
    let n = document.querySelector('.notification');
    if (!n) { n = document.createElement('div'); document.body.appendChild(n); }
    n.textContent = message;
    n.className = `notification notification-${type} show`;
    setTimeout(() => n.classList.remove('show'), 4000);
}
