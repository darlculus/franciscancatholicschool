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

let _currentUser = null;

document.addEventListener('DOMContentLoaded', async function () {
    _currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));

    if (!_currentUser) { window.location.href = 'portal.html'; return; }
    if (!['teacher','coordinator','admin','headteacher'].includes(_currentUser.role)) {
        window.location.href = 'portal.html'; return;
    }

    document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const sidebar = document.querySelector('.dashboard-sidebar');
    document.getElementById('sidebar-toggle')?.addEventListener('click', () => sidebar.classList.toggle('active'));

    document.getElementById('logout-btn')?.addEventListener('click', e => {
        e.preventDefault();
        localStorage.removeItem('currentUser'); sessionStorage.removeItem('currentUser');
        window.location.href = 'portal.html';
    });

    await ensureClasses();
    await loadMyClass(_currentUser);
});

// ── Shared biodata modal (same edit modal used by admin students page) ─────────
let _allClasses = [];

async function ensureClasses() {
    if (_allClasses.length) return;
    try {
        const r = await fetch('/api/classes');
        const d = await r.json();
        _allClasses = d.classes || [];
    } catch (e) { /* ignore */ }
}

function buildBiodataModal(student) {
    const existing = document.getElementById('biodata-modal');
    if (existing) existing.remove();

    const photoHtml = student.photo_url
        ? `<img src="${student.photo_url}" style="width:100%;height:100%;object-fit:cover">`
        : `<i class="fas fa-user" style="font-size:2rem;color:#bbb"></i>`;

    const classOpts = _allClasses.map(c =>
        `<option value="${c.class_key}" data-name="${c.name}" ${c.class_key === student.class_key ? 'selected' : ''}>${c.name}</option>`
    ).join('');

    const modal = document.createElement('div');
    modal.id = 'biodata-modal';
    modal.className = 'modal active';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px';
    modal.innerHTML = `
        <div style="background:#fff;border-radius:10px;width:100%;max-width:620px;max-height:90vh;overflow-y:auto;padding:28px;position:relative">
            <button onclick="document.getElementById('biodata-modal').remove()" style="position:absolute;top:14px;right:16px;background:none;border:none;font-size:1.4rem;cursor:pointer;color:#999">&times;</button>
            <h2 style="margin:0 0 20px">Edit Student Biodata</h2>
            <form id="biodata-form">
                <input type="hidden" id="bd-id" value="${student.id}">

                <!-- Photo -->
                <div style="text-align:center;margin-bottom:20px">
                    <div id="bd-photo-preview" data-photo-url="${student.photo_url || ''}" style="width:90px;height:90px;border-radius:50%;background:#f0f0f0;margin:0 auto 8px;display:flex;align-items:center;justify-content:center;overflow:hidden;border:2px dashed #ccc">${photoHtml}</div>
                    <label for="bd-photo-upload" style="cursor:pointer;color:#5c6bc0;font-size:0.85rem"><i class="fas fa-camera"></i> Change Photo</label>
                    <input type="file" id="bd-photo-upload" accept="image/*" style="display:none">
                </div>

                <p style="font-weight:600;margin:0 0 12px;color:#555;border-bottom:1px solid #eee;padding-bottom:6px">Personal Information</p>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                    <div><label style="font-size:.85rem">First Name *</label><input id="bd-first" value="${student.first_name}" required style="width:100%;padding:8px;border:1px solid #ddd;border-radius:5px;margin-top:4px"></div>
                    <div><label style="font-size:.85rem">Middle Name</label><input id="bd-middle" value="${student.middle_name || ''}" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:5px;margin-top:4px"></div>
                    <div><label style="font-size:.85rem">Last Name *</label><input id="bd-last" value="${student.last_name}" required style="width:100%;padding:8px;border:1px solid #ddd;border-radius:5px;margin-top:4px"></div>
                    <div><label style="font-size:.85rem">Gender *</label>
                        <select id="bd-gender" required style="width:100%;padding:8px;border:1px solid #ddd;border-radius:5px;margin-top:4px">
                            <option value="Male" ${student.gender==='Male'?'selected':''}>Male</option>
                            <option value="Female" ${student.gender==='Female'?'selected':''}>Female</option>
                        </select></div>
                    <div><label style="font-size:.85rem">Date of Birth *</label><input type="date" id="bd-dob" value="${student.date_of_birth || ''}" required style="width:100%;padding:8px;border:1px solid #ddd;border-radius:5px;margin-top:4px"></div>
                    <div><label style="font-size:.85rem">Religion</label>
                        <select id="bd-religion" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:5px;margin-top:4px">
                            <option value="">Select</option>
                            <option value="Christianity" ${student.religion==='Christianity'?'selected':''}>Christianity</option>
                            <option value="Islam" ${student.religion==='Islam'?'selected':''}>Islam</option>
                            <option value="Other" ${student.religion==='Other'?'selected':''}>Other</option>
                        </select></div>
                    <div><label style="font-size:.85rem">State of Origin</label><input id="bd-state" value="${student.state_of_origin || ''}" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:5px;margin-top:4px"></div>
                    <div><label style="font-size:.85rem">LGA</label><input id="bd-lga" value="${student.lga || ''}" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:5px;margin-top:4px"></div>
                </div>
                <div style="margin-top:12px"><label style="font-size:.85rem">Home Address</label><textarea id="bd-address" rows="2" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:5px;margin-top:4px">${student.address || ''}</textarea></div>

                <p style="font-weight:600;margin:18px 0 12px;color:#555;border-bottom:1px solid #eee;padding-bottom:6px">Academic</p>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                    <div><label style="font-size:.85rem">Class *</label>
                        <select id="bd-class" required style="width:100%;padding:8px;border:1px solid #ddd;border-radius:5px;margin-top:4px">
                            <option value="">Select Class</option>${classOpts}
                        </select></div>
                    <div><label style="font-size:.85rem">Enrollment Date</label><input type="date" id="bd-enroll" value="${student.enrollment_date || ''}" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:5px;margin-top:4px"></div>
                </div>

                <p style="font-weight:600;margin:18px 0 12px;color:#555;border-bottom:1px solid #eee;padding-bottom:6px">Parent / Guardian</p>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                    <div style="grid-column:1/-1"><label style="font-size:.85rem">Parent/Guardian Name</label><input id="bd-parent" value="${student.parent_name || ''}" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:5px;margin-top:4px"></div>
                    <div><label style="font-size:.85rem">Phone</label><input id="bd-parent-phone" value="${student.parent_phone || ''}" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:5px;margin-top:4px"></div>
                    <div><label style="font-size:.85rem">Email</label><input type="email" id="bd-parent-email" value="${student.parent_email || ''}" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:5px;margin-top:4px"></div>
                </div>
                <p style="font-size:.85rem;font-weight:600;margin:14px 0 8px;color:#777">Legal Guardian <span style="font-weight:400">(if different from parent)</span></p>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                    <div><label style="font-size:.85rem">Guardian Name</label><input id="bd-guardian" value="${student.guardian_name || ''}" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:5px;margin-top:4px"></div>
                    <div><label style="font-size:.85rem">Phone</label><input id="bd-guardian-phone" value="${student.guardian_phone || ''}" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:5px;margin-top:4px"></div>
                    <div><label style="font-size:.85rem">Relationship</label><input id="bd-guardian-rel" value="${student.guardian_relationship || ''}" placeholder="e.g. Uncle, Aunt" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:5px;margin-top:4px"></div>
                </div>

                <p style="font-weight:600;margin:18px 0 12px;color:#555;border-bottom:1px solid #eee;padding-bottom:6px">Medical</p>
                <div><label style="font-size:.85rem">Medical Conditions / Allergies</label><textarea id="bd-medical" rows="2" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:5px;margin-top:4px">${student.medical_conditions || ''}</textarea></div>

                <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:20px">
                    <button type="button" onclick="document.getElementById('biodata-modal').remove()" style="padding:9px 20px;border:1px solid #ddd;border-radius:5px;background:#fff;cursor:pointer">Cancel</button>
                    <button type="submit" style="padding:9px 20px;background:#5c6bc0;color:#fff;border:none;border-radius:5px;cursor:pointer">Save Changes</button>
                </div>
            </form>
        </div>`;

    // Photo upload inside modal
    modal.querySelector('#bd-photo-upload').addEventListener('change', function () {
        const file = this.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = e => {
            const p = document.getElementById('bd-photo-preview');
            p.innerHTML = `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover">`;
            p.dataset.photoUrl = e.target.result;
        };
        reader.readAsDataURL(file);
    });

    // Close on backdrop click
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });

    // Form submit
    modal.querySelector('#biodata-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        const classEl = document.getElementById('bd-class');
        const classKey = classEl.value;
        const classOpt = classEl.options[classEl.selectedIndex];
        const className = classOpt?.dataset.name || classOpt?.text || '';
        const payload = {
            id: document.getElementById('bd-id').value,
            first_name: document.getElementById('bd-first').value.trim(),
            middle_name: document.getElementById('bd-middle').value.trim(),
            last_name: document.getElementById('bd-last').value.trim(),
            gender: document.getElementById('bd-gender').value,
            date_of_birth: document.getElementById('bd-dob').value || null,
            religion: document.getElementById('bd-religion').value || null,
            state_of_origin: document.getElementById('bd-state').value.trim(),
            lga: document.getElementById('bd-lga').value.trim(),
            address: document.getElementById('bd-address').value.trim(),
            class_key: classKey,
            class_name: className,
            enrollment_date: document.getElementById('bd-enroll').value || null,
            parent_name: document.getElementById('bd-parent').value.trim(),
            parent_phone: document.getElementById('bd-parent-phone').value.trim(),
            parent_email: document.getElementById('bd-parent-email').value.trim(),
            guardian_name: document.getElementById('bd-guardian').value.trim(),
            guardian_phone: document.getElementById('bd-guardian-phone').value.trim(),
            guardian_relationship: document.getElementById('bd-guardian-rel').value.trim(),
            medical_conditions: document.getElementById('bd-medical').value.trim(),
            photo_url: document.getElementById('bd-photo-preview')?.dataset.photoUrl || student.photo_url || null
        };
        try {
            const res = await fetch('/api/students', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            modal.remove();
            alert(`${payload.first_name} ${payload.last_name} updated successfully.`);
            await loadMyClass(_currentUser);
        } catch (err) {
            alert('Error saving: ' + err.message);
        }
    });

    document.body.appendChild(modal);
}

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
                            <td style="padding:10px">
                                <div style="display:flex;align-items:center;gap:10px">
                                    <div style="width:36px;height:36px;border-radius:50%;overflow:hidden;background:#f0f0f0;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1px solid #eee">
                                        ${s.photo_url
                                            ? `<img src="${s.photo_url}" style="width:100%;height:100%;object-fit:cover">`
                                            : `<i class="fas fa-user" style="color:#bbb;font-size:1rem"></i>`}
                                    </div>
                                    <span>${s.first_name}${s.middle_name ? ' ' + s.middle_name : ''} ${s.last_name}</span>
                                </div>
                            </td>
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

                if (action === 'biodata') {
                    buildBiodataModal(student);
                    return;
                }

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
