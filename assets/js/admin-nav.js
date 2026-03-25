// Shared nav loader for all admin portal pages
(function () {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser') || 'null');

    if (!currentUser || !['admin', 'headteacher'].includes(currentUser.role)) {
        window.location.href = 'portal.html';
        return;
    }

    const roleLabels = { admin: 'Administrator', headteacher: 'Head Teacher' };
    const displayName = currentUser.full_name || currentUser.username || 'Admin';
    const roleLabel = roleLabels[currentUser.role] || 'Administrator';

    document.addEventListener('DOMContentLoaded', function () {
        const nameEl = document.getElementById('admin-name');
        const roleEl = document.getElementById('admin-role');

        if (nameEl) nameEl.textContent = displayName;
        if (roleEl) roleEl.textContent = roleLabel;

        document.getElementById('current-date').textContent =
            new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

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
