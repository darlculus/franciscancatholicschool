document.addEventListener('DOMContentLoaded', async function () {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser') || 'null');

    if (!currentUser || !['teacher', 'headteacher', 'coordinator', 'admin'].includes(currentUser.role)) {
        window.location.href = 'portal.html';
        return;
    }

    // Date
    document.getElementById('current-date').textContent =
        new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Name in sidebar + welcome
    const displayName = currentUser.full_name || currentUser.username || 'Teacher';
    document.getElementById('teacher-name').textContent = displayName;
    document.getElementById('welcome-name').textContent = displayName.split(' ')[0];

    // Load teacher record from API to get subject, assigned_class etc.
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
    } catch (e) { /* silently fall through */ }

    const subject = teacherRecord?.subject || currentUser.subject || '';
    const assignedClass = teacherRecord?.assigned_class || currentUser.assigned_class || '';

    // Sidebar subject line
    document.getElementById('teacher-subject').textContent =
        subject ? `${subject} Teacher` : (currentUser.role === 'headteacher' ? 'Head Teacher' : 'Teacher');

    // ── Stats ──────────────────────────────────────────────────────────────────
    // Active classes: 1 if assigned, else 0
    const activeClasses = assignedClass ? 1 : 0;
    document.getElementById('stat-active-classes').textContent = activeClasses;
    document.getElementById('stat-pending-assignments').textContent = '0';
    document.getElementById('stat-submissions').textContent = '0';
    document.getElementById('stat-classes-today').textContent = activeClasses;

    // ── My Classes card ────────────────────────────────────────────────────────
    const classList = document.getElementById('class-list');
    if (activeClasses === 0) {
        classList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-school empty-icon"></i>
                <h3>No Classes Assigned</h3>
                <p>You have not been assigned to any class yet. Contact the administrator.</p>
            </div>`;
    } else {
        classList.innerHTML = `
            <li class="class-item">
                <div class="class-info">
                    <h4>${assignedClass}${subject ? ' — ' + subject : ''}</h4>
                    <p>Assigned class</p>
                </div>
                <div class="class-actions">
                    <a href="attendance.html" class="btn-class-action"><i class="fas fa-clipboard-check"></i> Attendance</a>
                    <a href="assignments.html" class="btn-class-action"><i class="fas fa-book"></i> Assignments</a>
                </div>
            </li>`;
    }

    // ── Sidebar toggle ─────────────────────────────────────────────────────────
    const toggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.dashboard-sidebar');
    if (toggle && sidebar) {
        toggle.addEventListener('click', e => { sidebar.classList.toggle('active'); e.stopPropagation(); });
        document.addEventListener('click', e => {
            if (sidebar.classList.contains('active') && !sidebar.contains(e.target) && e.target !== toggle)
                sidebar.classList.remove('active');
        });
    }

    // ── Logout ─────────────────────────────────────────────────────────────────
    document.getElementById('logout-btn')?.addEventListener('click', e => {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        window.location.href = 'portal.html';
    });
});
