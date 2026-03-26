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

        // Inject dropdown styles into head once
        if (!document.getElementById('dropdown-styles')) {
            const style = document.createElement('style');
            style.id = 'dropdown-styles';
            style.textContent = `
                .student-options-btn{background:none;border:1px solid #ddd;border-radius:5px;padding:4px 10px;cursor:pointer;font-size:0.85rem;color:#555;transition:background 0.2s}
                .student-options-btn:hover{background:#f5f5f5}
                .dropdown-wrapper{position:relative;display:inline-block}
                .dropdown-menu{display:none;position:absolute;right:0;top:100%;background:#fff;border:1px solid #ddd;border-radius:6px;box-shadow:0 4px 12px rgba(0,0,0,0.12);z-index:999;min-width:180px;padding:4px 0}
                .dropdown-menu.open{display:block}
                .dropdown-menu a{display:block;padding:9px 16px;font-size:0.88rem;color:#333;text-decoration:none;transition:background 0.15s}
                .dropdown-menu a:hover{background:#f0f4ff;color:#5c6bc0}
                .dropdown-menu a i{width:18px;margin-right:6px;color:#888}
            `;
            document.head.appendChild(style);
        }

        studentSection.innerHTML = `
            <table class="attendance-table" style="width:100%;border-collapse:collapse">
                <thead>
                    <tr>
                        <th style="padding:10px;text-align:left;border-bottom:2px solid #eee">#</th>
                        <th style="padding:10px;text-align:left;border-bottom:2px solid #eee">Admission No.</th>
                        <th style="padding:10px;text-align:left;border-bottom:2px solid #eee">Name</th>
                        <th style="padding:10px;text-align:left;border-bottom:2px solid #eee">Gender</th>
                        <th style="padding:10px;text-align:left;border-bottom:2px solid #eee">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${students.map((s, i) => `
                        <tr style="border-bottom:1px solid #f5f5f5">
                            <td style="padding:10px">${i + 1}</td>
                            <td style="padding:10px">${s.admission_number || '—'}</td>
                            <td style="padding:10px">${s.first_name} ${s.last_name}</td>
                            <td style="padding:10px">${s.gender}</td>
                            <td style="padding:10px">
                                <div class="dropdown-wrapper">
                                    <button class="student-options-btn" data-id="${s.id}">
                                        <i class="fas fa-ellipsis-v"></i> Options
                                    </button>
                                    <div class="dropdown-menu" id="drop-${s.id}">
                                        <a href="#" data-action="biodata" data-id="${s.id}"><i class="fas fa-user-edit"></i> Edit Biodata</a>
                                        <a href="#" data-action="subjects" data-id="${s.id}"><i class="fas fa-book"></i> Subjects</a>
                                        <a href="#" data-action="files" data-id="${s.id}"><i class="fas fa-folder"></i> Files</a>
                                        <a href="#" data-action="club" data-id="${s.id}"><i class="fas fa-users"></i> Club</a>
                                        <a href="#" data-action="mock-result" data-id="${s.id}"><i class="fas fa-file-alt"></i> Mock Result</a>
                                        <a href="#" data-action="update-result" data-id="${s.id}"><i class="fas fa-pen"></i> Update Result</a>
                                        <a href="#" data-action="update-mid-result" data-id="${s.id}"><i class="fas fa-pen-square"></i> Update Mid-Result</a>
                                        <a href="#" data-action="report-card" data-id="${s.id}"><i class="fas fa-id-card"></i> Report Card</a>
                                        <a href="#" data-action="result-archive" data-id="${s.id}"><i class="fas fa-archive"></i> Result Archive</a>
                                        <a href="#" data-action="medical" data-id="${s.id}"><i class="fas fa-heartbeat"></i> Medical</a>
                                        <a href="#" data-action="delete" data-id="${s.id}" style="color:#e53935"><i class="fas fa-trash-alt" style="color:#e53935"></i> Remove Student</a>
                                    </div>
                                </div>
                            </td>
                        </tr>`).join('')}
                </tbody>
            </table>`;

        // Dropdown toggle logic
        studentSection.querySelectorAll('.student-options-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const id = this.dataset.id;
                const menu = document.getElementById('drop-' + id);
                // Close all others
                studentSection.querySelectorAll('.dropdown-menu').forEach(m => {
                    if (m !== menu) m.classList.remove('open');
                });
                menu.classList.toggle('open');
            });
        });

        // Close dropdowns on outside click
        document.addEventListener('click', () => {
            studentSection.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('open'));
        });

        // Action handler
        studentSection.querySelectorAll('.dropdown-menu a').forEach(link => {
            link.addEventListener('click', async function (e) {
                e.preventDefault();
                const action = this.dataset.action;
                const sid = this.dataset.id;
                const student = students.find(s => s.id === sid);
                const name = student ? `${student.first_name} ${student.last_name}` : sid;

                if (action === 'delete') {
                    if (!confirm(`Remove ${name} from this class?\n\nThis will permanently delete the student record. This cannot be undone.`)) return;
                    try {
                        const res = await fetch(`/api/students?id=${sid}`, { method: 'DELETE' });
                        if (!res.ok) throw new Error((await res.json()).error);
                        alert(`${name} has been removed successfully.`);
                        await loadMyClass(currentUser);
                    } catch (err) {
                        alert('Error removing student: ' + err.message);
                    }
                    return;
                }

                alert(`${this.textContent.trim()} — ${name}\n\nThis feature is coming soon.`);
            });
        });

    } catch (e) {
        console.error(e);
        grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:#f44336">Failed to load class data. Please refresh.</div>`;
        studentSection.innerHTML = '';
    }
}
