document.addEventListener('DOMContentLoaded', async function () {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));

    if (!currentUser) { window.location.href = 'portal.html'; return; }
    if (currentUser.role !== 'teacher' && currentUser.role !== 'coordinator' && currentUser.role !== 'admin' && currentUser.role !== 'headteacher') {
        window.location.href = 'portal.html'; return;
    }

    // Date
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    // Sidebar toggle
    const sidebar = document.querySelector('.dashboard-sidebar');
    document.getElementById('sidebar-toggle')?.addEventListener('click', () => sidebar.classList.toggle('active'));

    // Logout
    document.getElementById('logout-btn')?.addEventListener('click', e => {
        e.preventDefault();
        localStorage.removeItem('currentUser'); sessionStorage.removeItem('currentUser');
        window.location.href = 'portal.html';
    });

    await loadMyClass(currentUser);
});

async function loadMyClass(currentUser) {
    const grid = document.getElementById('classes-grid');
    const studentSection = document.getElementById('students-list-section');

    try {
        // Get teacher record to find assigned_class
        const tRes = await fetch('/api/teachers');
        const tData = await tRes.json();
        const teachers = tData.teachers || [];

        // Match by username or full_name
        const teacher = teachers.find(t =>
            t.teacher_id === currentUser.username ||
            t.full_name === currentUser.name ||
            t.email === currentUser.email
        );

        const assignedClassKey = teacher?.assigned_class || currentUser.assigned_class || null;

        if (!assignedClassKey) {
            grid.innerHTML = `
                <div style="grid-column:1/-1;text-align:center;padding:40px;color:#999">
                    <i class="fas fa-school" style="font-size:3rem;color:#ddd"></i>
                    <h3 style="margin:15px 0 8px">No Class Assigned</h3>
                    <p>You have not been assigned to a class yet. Please contact the administrator.</p>
                </div>`;
            studentSection.innerHTML = '';
            document.getElementById('total-classes').textContent = '0';
            document.getElementById('total-students').textContent = '0';
            return;
        }

        // Get class details
        const cRes = await fetch('/api/classes');
        const cData = await cRes.json();
        const classInfo = (cData.classes || []).find(c => c.class_key === assignedClassKey);
        const className = classInfo?.name || assignedClassKey;

        // Get students in this class
        const sRes = await fetch(`/api/students?class_key=${assignedClassKey}`);
        const sData = await sRes.json();
        const students = sData.students || [];

        document.getElementById('total-classes').textContent = '1';
        document.getElementById('total-students').textContent = students.length;

        // Render class card
        grid.innerHTML = `
            <div class="class-card">
                <div class="class-header">
                    <h3>${className}</h3>
                    <span class="class-badge" style="background:#e8f5e9;color:#2e7d32">Assigned Class</span>
                </div>
                <div class="class-info">
                    <div class="info-item">
                        <i class="fas fa-user-graduate"></i>
                        <span>${students.length} student${students.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-chalkboard-teacher"></i>
                        <span>${currentUser.name || 'You'}</span>
                    </div>
                </div>
            </div>`;

        // Render students table
        if (students.length === 0) {
            studentSection.innerHTML = `
                <div style="text-align:center;padding:40px;color:#999">
                    <i class="fas fa-user-graduate" style="font-size:3rem;color:#ddd"></i>
                    <h3 style="margin:15px 0 8px">No Students Yet</h3>
                    <p>No students have been enrolled in ${className} yet.</p>
                </div>`;
            return;
        }

        studentSection.innerHTML = `
            <table class="attendance-table" style="width:100%;border-collapse:collapse">
                <thead>
                    <tr>
                        <th style="padding:10px;text-align:left;border-bottom:2px solid #eee">#</th>
                        <th style="padding:10px;text-align:left;border-bottom:2px solid #eee">Admission No.</th>
                        <th style="padding:10px;text-align:left;border-bottom:2px solid #eee">Name</th>
                        <th style="padding:10px;text-align:left;border-bottom:2px solid #eee">Gender</th>
                    </tr>
                </thead>
                <tbody>
                    ${students.map((s, i) => `
                        <tr style="border-bottom:1px solid #f5f5f5">
                            <td style="padding:10px">${i + 1}</td>
                            <td style="padding:10px">${s.admission_number || '—'}</td>
                            <td style="padding:10px">${s.first_name} ${s.last_name}</td>
                            <td style="padding:10px">${s.gender}</td>
                        </tr>`).join('')}
                </tbody>
            </table>`;

    } catch (e) {
        console.error(e);
        grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:#f44336">Failed to load class data. Please refresh.</div>`;
        studentSection.innerHTML = '';
    }
}
