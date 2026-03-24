document.addEventListener('DOMContentLoaded', async function () {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser') || 'null');

    if (!currentUser || !['teacher', 'headteacher', 'coordinator', 'admin'].includes(currentUser.role)) {
        window.location.href = 'portal.html';
        return;
    }

    // Date
    document.getElementById('current-date').textContent =
        new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const displayName = currentUser.full_name || currentUser.username || 'Teacher';
    const firstName = displayName.split(' ')[0];

    document.getElementById('teacher-name').textContent = displayName;
    document.getElementById('welcome-name').textContent = firstName;

    // Avatar initials
    const initials = displayName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    document.getElementById('teacher-avatar').textContent = initials;

    // Role label
    const roleLabels = { teacher: 'Teacher', headteacher: 'Head Teacher', coordinator: 'Coordinator', admin: 'Administrator' };
    const roleLabel = roleLabels[currentUser.role] || 'Teacher';
    document.getElementById('stat-role').textContent = roleLabel;

    // Load teacher record from API
    let teacherRecord = null;
    try {
        const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken') || 'dummy-token';
        const res = await fetch('/api/teachers', { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
            const data = await res.json();
            teacherRecord = (data.teachers || []).find(
                t => t.teacher_id === currentUser.username || t.email === currentUser.email
            );
        }
    } catch (e) { /* fall through */ }

    const subject = teacherRecord?.subject || currentUser.subject || '';
    const assignedClass = teacherRecord?.assigned_class || currentUser.assigned_class || '';

    // Sidebar subject line
    document.getElementById('teacher-subject').textContent = subject ? `${subject} Teacher` : roleLabel;

    // Stats
    document.getElementById('stat-assigned-class').textContent = assignedClass || 'None';
    document.getElementById('stat-subject').textContent = subject || 'None';

    // Class info panel
    const panel = document.getElementById('class-info-panel');
    if (!assignedClass && !subject) {
        panel.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-school"></i>
                <h4>No Class Assigned</h4>
                <p>You have not been assigned to a class yet. Contact the administrator.</p>
            </div>`;
    } else {
        panel.innerHTML = `
            <div class="stat-card" style="margin-top:10px;">
                <div class="stat-icon" style="background-color:#4CAF50;">
                    <i class="fas fa-chalkboard-teacher"></i>
                </div>
                <div class="stat-details">
                    <h3>${assignedClass || 'No class assigned'}</h3>
                    <p class="stat-count" style="font-size:1rem;">${subject || ''}</p>
                    <p class="stat-label">${roleLabel}</p>
                </div>
            </div>`;
    }

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
