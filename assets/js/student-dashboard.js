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

    // Report card buttons — all open the term picker modal
    document.getElementById('view-report-btn')?.addEventListener('click', () => openStudentReportCard(currentUser));
    document.getElementById('report-card-link')?.addEventListener('click', e => { e.preventDefault(); openStudentReportCard(currentUser); });
    document.getElementById('report-card-stat')?.addEventListener('click', () => openStudentReportCard(currentUser));
});
