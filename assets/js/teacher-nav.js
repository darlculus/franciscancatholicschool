// Shared nav loader for all teacher portal pages
(function () {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser') || 'null');

    if (!currentUser) {
        window.location.href = 'portal.html';
        return;
    }

    const roleLabels = { teacher: 'Teacher', headteacher: 'Head Teacher', coordinator: 'Coordinator', admin: 'Administrator' };

    // Extract first name (skip title like Mr./Mrs./Dr.)
    const nameParts = (currentUser.full_name || currentUser.username || '').split(' ').filter(Boolean);
    const titleWords = ['mr.', 'mrs.', 'ms.', 'dr.', 'prof.', 'rev.'];
    const firstName = nameParts.find(p => !titleWords.includes(p.toLowerCase())) || nameParts[0] || 'Teacher';
    const displayName = currentUser.full_name || currentUser.username || 'Teacher';
    const roleLabel = roleLabels[currentUser.role] || 'Teacher';
    const initials = nameParts.filter(p => !titleWords.includes(p.toLowerCase())).map(w => w[0]).join('').substring(0, 2).toUpperCase() || 'T';

    document.addEventListener('DOMContentLoaded', function () {
        const navName = document.getElementById('nav-name');
        const navRole = document.getElementById('nav-role');
        const navAvatar = document.getElementById('nav-avatar');
        const sidebarName = document.getElementById('teacher-name');
        const sidebarSubject = document.getElementById('teacher-subject');

        if (navName) navName.textContent = displayName;
        if (navRole) navRole.textContent = roleLabel;
        if (navAvatar) navAvatar.textContent = initials;
        if (sidebarName) sidebarName.textContent = displayName;
        if (sidebarSubject) sidebarSubject.textContent = roleLabel;

        // Sidebar toggle
        const toggle = document.getElementById('sidebar-toggle');
        const sidebar = document.querySelector('.dashboard-sidebar');
        if (toggle && sidebar) {
            toggle.addEventListener('click', e => { sidebar.classList.toggle('active'); e.stopPropagation(); });
            document.addEventListener('click', e => {
                if (sidebar.classList.contains('active') && !sidebar.contains(e.target) && e.target !== toggle)
                    sidebar.classList.remove('active');
            });
        }

        // Logout
        document.getElementById('logout-btn')?.addEventListener('click', e => {
            e.preventDefault();
            ['currentUser', 'authToken'].forEach(k => {
                localStorage.removeItem(k);
                sessionStorage.removeItem(k);
            });
            window.location.href = 'portal.html';
        });
    });
})();
