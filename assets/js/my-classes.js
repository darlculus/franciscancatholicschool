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

// ── Subjects modal ────────────────────────────────────────────────────────────
const CLASS_SUBJECTS = {
    'Early Year 3': ['English Language', 'Arithmetic', 'Social Norms', 'Nature Study', 'Handwriting', 'Creative Art', 'Religion'],
    'Early Year 2': ['Letters', 'Arithmetic', 'Social Norms', 'Nature Study', 'Religion', 'Creative Art', 'Handwriting', 'Rhyme'],
    'Early Year 1': ['Letters', 'Numbers', 'Social Norms', 'Nature Study', 'Creative Art', 'Religion', 'Rhyme', 'Handwriting'],
    'Creche':       ['Letters', 'Numbers', 'Social Norms', 'Nature Study', 'Religion', 'Rhyme', 'Handwriting', 'Colouring'],
};

function getSubjectsForClass(className) {
    return CLASS_SUBJECTS[className] || CLASS_SUBJECTS['Early Year 1'];
}

function buildSubjectsModal(student) {
    const existing = document.getElementById('subjects-modal');
    if (existing) existing.remove();

    let selected = Array.isArray(student.subjects) && student.subjects.length
        ? [...student.subjects]
        : [...getSubjectsForClass(student.class_name)];

    const classSubjects = getSubjectsForClass(student.class_name);

    const modal = document.createElement('div');
    modal.id = 'subjects-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px';

    function render() {
        const selectedHtml = selected.length
            ? selected.map(s => `
                <span style="display:inline-flex;align-items:center;gap:6px;background:#e8eaf6;color:#3949ab;border-radius:20px;padding:4px 10px;font-size:0.82rem;margin:3px">
                    ${s}
                    <button data-remove="${s}" style="background:none;border:none;cursor:pointer;color:#e53935;font-size:1rem;line-height:1;padding:0" title="Remove">&times;</button>
                </span>`).join('')
            : '<span style="color:#aaa;font-size:0.85rem">No subjects selected yet</span>';

        const checkboxHtml = classSubjects.map(s => `
            <label style="display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:6px;cursor:pointer;${selected.includes(s) ? 'background:#e8eaf6' : ''}">
                <input type="checkbox" value="${s}" ${selected.includes(s) ? 'checked' : ''} style="width:16px;height:16px;accent-color:#5c6bc0;cursor:pointer">
                <span style="font-size:0.9rem">${s}</span>
            </label>`).join('');

        modal.innerHTML = `
            <div style="background:#fff;border-radius:10px;width:100%;max-width:520px;max-height:90vh;overflow-y:auto;padding:28px;position:relative">
                <button id="subj-close" style="position:absolute;top:14px;right:16px;background:none;border:none;font-size:1.4rem;cursor:pointer;color:#999">&times;</button>
                <h2 style="margin:0 0 4px">Edit Subjects</h2>
                <p style="margin:0 0 16px;color:#888;font-size:0.88rem">${student.first_name} ${student.last_name}</p>

                <p style="font-weight:600;font-size:0.85rem;color:#555;margin:0 0 8px">Selected Subjects</p>
                <div id="subj-selected" style="min-height:36px;margin-bottom:18px;padding:6px;border:1px dashed #ddd;border-radius:6px">${selectedHtml}</div>

                <p style="font-weight:600;font-size:0.85rem;color:#555;margin:0 0 8px;border-top:1px solid #eee;padding-top:14px">Choose Subjects</p>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:2px;max-height:280px;overflow-y:auto;border:1px solid #eee;border-radius:6px;padding:6px">
                    ${checkboxHtml}
                </div>

                <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:20px">
                    <button id="subj-cancel" style="padding:9px 20px;border:1px solid #ddd;border-radius:5px;background:#fff;cursor:pointer">Cancel</button>
                    <button id="subj-save" style="padding:9px 20px;background:#5c6bc0;color:#fff;border:none;border-radius:5px;cursor:pointer">Save Subjects</button>
                </div>
            </div>`;

        modal.querySelector('#subj-close').onclick = () => modal.remove();
        modal.querySelector('#subj-cancel').onclick = () => modal.remove();

        modal.querySelectorAll('[data-remove]').forEach(btn => {
            btn.onclick = () => {
                selected = selected.filter(s => s !== btn.dataset.remove);
                render();
            };
        });

        modal.querySelectorAll('input[type=checkbox]').forEach(cb => {
            cb.onchange = () => {
                if (cb.checked) { if (!selected.includes(cb.value)) selected.push(cb.value); }
                else { selected = selected.filter(s => s !== cb.value); }
                render();
            };
        });

        modal.querySelector('#subj-save').onclick = async () => {
            const saveBtn = modal.querySelector('#subj-save');
            saveBtn.disabled = true;
            saveBtn.textContent = 'Saving...';
            try {
                const res = await fetch('/api/students', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: student.id, subjects: selected })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error);
                student.subjects = selected;
                modal.remove();
                alert(`Subjects saved for ${student.first_name} ${student.last_name}.`);
            } catch (err) {
                alert('Error saving subjects: ' + err.message);
                saveBtn.disabled = false;
                saveBtn.textContent = 'Save Subjects';
            }
        };

        modal.onclick = e => { if (e.target === modal) modal.remove(); };
    }

    render();
    document.body.appendChild(modal);
}

// ── Files modal ───────────────────────────────────────────────────────────────
function buildFilesModal(student) {
    const existing = document.getElementById('files-modal');
    if (existing) existing.remove();

    let files = Array.isArray(student.files) ? [...student.files] : [];

    const modal = document.createElement('div');
    modal.id = 'files-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px';

    function render() {
        const filesHtml = files.length
            ? files.map((f, i) => `
                <div style="display:flex;align-items:center;justify-content:space-between;padding:9px 12px;border:1px solid #eee;border-radius:6px;margin-bottom:6px">
                    <div style="display:flex;align-items:center;gap:10px;overflow:hidden">
                        <i class="fas fa-file-alt" style="color:#5c6bc0;flex-shrink:0"></i>
                        <div style="overflow:hidden">
                            <div style="font-size:0.88rem;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${f.title}</div>
                            <div style="font-size:0.75rem;color:#aaa">${f.uploaded_at || ''}</div>
                        </div>
                    </div>
                    <div style="display:flex;gap:8px;flex-shrink:0">
                        <a href="${f.url}" target="_blank" style="color:#5c6bc0;font-size:0.82rem;text-decoration:none" title="View"><i class="fas fa-external-link-alt"></i></a>
                        <button data-del="${i}" style="background:none;border:none;cursor:pointer;color:#e53935;font-size:0.9rem" title="Remove"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>`).join('')
            : '<p style="color:#aaa;font-size:0.85rem;text-align:center;padding:16px 0">No files uploaded yet</p>';

        modal.innerHTML = `
            <div style="background:#fff;border-radius:10px;width:100%;max-width:520px;max-height:90vh;overflow-y:auto;padding:28px;position:relative">
                <button id="files-close" style="position:absolute;top:14px;right:16px;background:none;border:none;font-size:1.4rem;cursor:pointer;color:#999">&times;</button>
                <h2 style="margin:0 0 4px">Student Files</h2>
                <p style="margin:0 0 20px;color:#888;font-size:0.88rem">${student.first_name} ${student.last_name}</p>

                <div id="files-list">${filesHtml}</div>

                <div style="border-top:1px solid #eee;padding-top:16px;margin-top:10px">
                    <p style="font-weight:600;font-size:0.85rem;color:#555;margin:0 0 10px">Add New File</p>
                    <div style="display:flex;flex-direction:column;gap:10px">
                        <div>
                            <label style="font-size:0.82rem;color:#666">File Title / Name *</label>
                            <input id="file-title" placeholder="e.g. Birth Certificate" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:5px;margin-top:4px;box-sizing:border-box">
                        </div>
                        <div>
                            <label style="font-size:0.82rem;color:#666">Upload File *</label>
                            <input type="file" id="file-input" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:5px;margin-top:4px;box-sizing:border-box">
                        </div>
                        <button id="file-add-btn" style="padding:9px 18px;background:#5c6bc0;color:#fff;border:none;border-radius:5px;cursor:pointer;align-self:flex-end">
                            <i class="fas fa-upload"></i> Upload & Add
                        </button>
                    </div>
                </div>

                <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:20px">
                    <button id="files-cancel" style="padding:9px 20px;border:1px solid #ddd;border-radius:5px;background:#fff;cursor:pointer">Cancel</button>
                    <button id="files-save" style="padding:9px 20px;background:#5c6bc0;color:#fff;border:none;border-radius:5px;cursor:pointer">Save</button>
                </div>
            </div>`;

        modal.querySelector('#files-close').onclick = () => modal.remove();
        modal.querySelector('#files-cancel').onclick = () => modal.remove();
        modal.onclick = e => { if (e.target === modal) modal.remove(); };

        // Delete a file entry
        modal.querySelectorAll('[data-del]').forEach(btn => {
            btn.onclick = () => {
                files.splice(parseInt(btn.dataset.del), 1);
                render();
            };
        });

        // Upload file → convert to base64 data URL and add to list
        modal.querySelector('#file-add-btn').onclick = () => {
            const title = modal.querySelector('#file-title').value.trim();
            const fileInput = modal.querySelector('#file-input');
            const file = fileInput.files[0];
            if (!title) { alert('Please enter a file title.'); return; }
            if (!file) { alert('Please select a file to upload.'); return; }

            const reader = new FileReader();
            reader.onload = e => {
                files.push({
                    title,
                    url: e.target.result,
                    uploaded_at: new Date().toLocaleDateString('en-GB')
                });
                render();
            };
            reader.readAsDataURL(file);
        };

        // Save to Supabase
        modal.querySelector('#files-save').onclick = async () => {
            const saveBtn = modal.querySelector('#files-save');
            saveBtn.disabled = true;
            saveBtn.textContent = 'Saving...';
            try {
                const res = await fetch('/api/students', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: student.id, files })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error);
                student.files = files;
                modal.remove();
                alert(`Files saved for ${student.first_name} ${student.last_name}.`);
            } catch (err) {
                alert('Error saving files: ' + err.message);
                saveBtn.disabled = false;
                saveBtn.textContent = 'Save';
            }
        };
    }

    render();
    document.body.appendChild(modal);
}

// ── Update Result modal ───────────────────────────────────────────────────────
const PSD_TRAITS = ['Teamwork', 'Attendance', 'Presentation of Work', 'Punctuality', 'Neatness', 'Respect'];

async function buildUpdateResultModal(student, classKey) {
    const existing = document.getElementById('update-result-modal');
    if (existing) existing.remove();

    const subjects = Array.isArray(student.subjects) && student.subjects.length
        ? student.subjects : getSubjectsForClass(student.class_name);

    const midResult = (typeof student.mid_result === 'object' && student.mid_result) ? student.mid_result : {};
    const saved = (typeof student.result === 'object' && student.result) ? student.result : {};
    const psd = saved.psd || {};

    // Fetch attendance count for this student
    let timesPresent = '—';
    try {
        const aRes = await fetch(`/api/admin-attendance?class_key=${classKey}`);
        const aData = await aRes.json();
        const rec = (aData.students || []).find(s => s.student_id === student.id);
        if (rec) timesPresent = rec.present + (rec.late || 0);
    } catch (e) { /* ignore */ }

    const modal = document.createElement('div');
    modal.id = 'update-result-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px';

    const subjectRows = subjects.map(subj => {
        const ca1   = midResult[subj]?.ca1 ?? '—';
        const ca2   = midResult[subj]?.ca2 ?? '—';
        const caTotal = midResult[subj]?.total ?? null;
        const exam  = saved[subj]?.exam ?? '';
        const total = (caTotal !== null && exam !== '') ? (caTotal + parseFloat(exam)) : '';
        const remark = saved[subj]?.remark ?? '';
        return `
        <tr style="border-bottom:1px solid #f5f5f5">
            <td style="padding:8px 10px;font-size:0.85rem;font-weight:500">${subj}</td>
            <td style="padding:8px 6px;text-align:center;font-size:0.85rem;color:#888">${ca1}</td>
            <td style="padding:8px 6px;text-align:center;font-size:0.85rem;color:#888">${ca2}</td>
            <td style="padding:8px 6px;text-align:center;font-size:0.85rem;color:#5c6bc0;font-weight:600">${caTotal !== null ? caTotal : '—'}</td>
            <td style="padding:8px 6px">
                <input type="number" min="0" max="60" data-subj="${subj}" data-field="exam"
                    value="${exam}" placeholder="0"
                    style="width:60px;padding:6px;border:1px solid #ddd;border-radius:4px;text-align:center">
            </td>
            <td style="padding:8px 6px;text-align:center">
                <span class="res-total" data-subj="${subj}" style="font-weight:700;color:#2e7d32;font-size:0.9rem">${total !== '' ? total : '—'}</span>
            </td>
            <td style="padding:8px 6px">
                <input type="text" data-subj="${subj}" data-field="remark"
                    value="${remark}" placeholder="e.g. Excellent"
                    style="width:110px;padding:6px;border:1px solid #ddd;border-radius:4px;font-size:0.82rem">
            </td>
        </tr>`;
    }).join('');

    const psdRatingHtml = PSD_TRAITS.map(trait => {
        const val = psd[trait] ?? 0;
        const stars = [1,2,3,4,5].map(n => `
            <label style="cursor:pointer;font-size:1.2rem;color:${n <= val ? '#f59e0b' : '#ddd'}" title="${n}">
                <input type="radio" name="psd-${trait}" value="${n}" ${n === val ? 'checked' : ''} style="display:none">&#9733;
            </label>`).join('');
        return `
        <tr style="border-bottom:1px solid #f5f5f5">
            <td style="padding:8px 10px;font-size:0.85rem">${trait}</td>
            <td style="padding:8px 10px">
                <div class="psd-stars" data-trait="${trait}" style="display:flex;gap:2px">${stars}</div>
            </td>
        </tr>`;
    }).join('');

    modal.innerHTML = `
        <div style="background:#fff;border-radius:10px;width:100%;max-width:820px;max-height:90vh;overflow-y:auto;padding:28px;position:relative">
            <button id="ur-close" style="position:absolute;top:14px;right:16px;background:none;border:none;font-size:1.4rem;cursor:pointer;color:#999">&times;</button>
            <h2 style="margin:0 0 4px">Update Result</h2>
            <p style="margin:0 0 18px;color:#888;font-size:0.88rem">${student.first_name} ${student.last_name}</p>

            <!-- Subject scores -->
            <p style="font-weight:600;font-size:0.85rem;color:#555;margin:0 0 8px;border-bottom:1px solid #eee;padding-bottom:6px">Subject Scores</p>
            <div style="overflow-x:auto">
                <table style="width:100%;border-collapse:collapse">
                    <thead>
                        <tr style="background:#f5f6fa">
                            <th style="padding:9px 10px;text-align:left;font-size:0.8rem;color:#555">Subject</th>
                            <th style="padding:9px 6px;text-align:center;font-size:0.8rem;color:#555">1st CA<br><span style="font-weight:400;color:#aaa">(20%)</span></th>
                            <th style="padding:9px 6px;text-align:center;font-size:0.8rem;color:#555">2nd CA<br><span style="font-weight:400;color:#aaa">(20%)</span></th>
                            <th style="padding:9px 6px;text-align:center;font-size:0.8rem;color:#555">CA Total<br><span style="font-weight:400;color:#aaa">(40%)</span></th>
                            <th style="padding:9px 6px;text-align:center;font-size:0.8rem;color:#555">Exam<br><span style="font-weight:400;color:#aaa">(60%)</span></th>
                            <th style="padding:9px 6px;text-align:center;font-size:0.8rem;color:#555">Total<br><span style="font-weight:400;color:#aaa">(100%)</span></th>
                            <th style="padding:9px 6px;text-align:center;font-size:0.8rem;color:#555">Remark</th>
                        </tr>
                    </thead>
                    <tbody>${subjectRows}</tbody>
                </table>
            </div>

            <!-- Attendance -->
            <div style="margin-top:22px;display:flex;align-items:center;gap:12px;padding:12px 16px;background:#f5f6fa;border-radius:8px">
                <i class="fas fa-calendar-check" style="color:#5c6bc0;font-size:1.2rem"></i>
                <span style="font-size:0.88rem;color:#555">Times Present This Term:</span>
                <span style="font-weight:700;font-size:1rem;color:#2e7d32">${timesPresent}</span>
            </div>

            <!-- Comments -->
            <div style="margin-top:22px;display:grid;grid-template-columns:1fr 1fr;gap:14px">
                <div>
                    <label style="font-size:0.85rem;font-weight:600;color:#555">Class Teacher's Comment</label>
                    <div style="margin-top:6px;padding:8px 10px;background:#f0f9f0;border:1px solid #c8e6c9;border-radius:6px;font-size:0.78rem;color:#2e7d32;margin-bottom:6px">
                        <strong>Doing well:</strong> <span id="ur-doing-well">${subjects.filter(subj => { const t = (midResult[subj]?.total ?? 0) + (saved[subj]?.exam ?? 0); return t >= 60; }).join(', ') || 'Enter exam scores to see'}</span>
                    </div>
                    <div style="margin-bottom:6px;padding:8px 10px;background:#fff8e1;border:1px solid #ffe082;border-radius:6px;font-size:0.78rem;color:#f57f17">
                        <strong>Needs improvement:</strong> <span id="ur-needs-improvement">${subjects.filter(subj => { const ca = midResult[subj]?.total ?? null; const ex = saved[subj]?.exam ?? null; return ca !== null && ex !== null && (ca + ex) < 60; }).join(', ') || 'Enter exam scores to see'}</span>
                    </div>
                    <textarea id="ur-teacher-comment" rows="3" placeholder="Enter comment..." style="width:100%;padding:8px;border:1px solid #ddd;border-radius:5px;margin-top:2px;font-size:0.85rem;box-sizing:border-box">${saved.teacher_comment || ''}</textarea>
                </div>
                <div>
                    <label style="font-size:0.85rem;font-weight:600;color:#555">Head Teacher's Comment</label>
                    <textarea id="ur-head-comment" rows="3" placeholder="Enter comment..." style="width:100%;padding:8px;border:1px solid #ddd;border-radius:5px;margin-top:6px;font-size:0.85rem;box-sizing:border-box">${saved.head_comment || ''}</textarea>
                </div>
            </div>

            <!-- PSD -->
            <p style="font-weight:600;font-size:0.85rem;color:#555;margin:22px 0 8px;border-bottom:1px solid #eee;padding-bottom:6px">Personal Social Development</p>
            <table style="width:100%;border-collapse:collapse;max-width:420px">
                <thead>
                    <tr style="background:#f5f6fa">
                        <th style="padding:8px 10px;text-align:left;font-size:0.8rem;color:#555">Trait</th>
                        <th style="padding:8px 10px;text-align:left;font-size:0.8rem;color:#555">Rating (1–5)</th>
                    </tr>
                </thead>
                <tbody>${psdRatingHtml}</tbody>
            </table>
            <div style="margin-top:12px">
                <label style="font-size:0.85rem;font-weight:600;color:#555">P.S.D Comment</label>
                <textarea id="ur-psd-comment" rows="2" placeholder="Enter PSD comment..." style="width:100%;padding:8px;border:1px solid #ddd;border-radius:5px;margin-top:6px;font-size:0.85rem;box-sizing:border-box">${psd.comment || ''}</textarea>
            </div>

            <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:24px">
                <button id="ur-cancel" style="padding:9px 20px;border:1px solid #ddd;border-radius:5px;background:#fff;cursor:pointer">Cancel</button>
                <button id="ur-save" style="padding:9px 24px;background:#5c6bc0;color:#fff;border:none;border-radius:5px;cursor:pointer;font-weight:600">Save Result</button>
            </div>
        </div>`;

    modal.querySelector('#ur-close').onclick = () => modal.remove();
    modal.querySelector('#ur-cancel').onclick = () => modal.remove();
    modal.onclick = e => { if (e.target === modal) modal.remove(); };

    // Live total calculation
    modal.querySelectorAll('input[data-field="exam"]').forEach(input => {
        input.addEventListener('input', () => {
            const subj = input.dataset.subj;
            const caTotal = midResult[subj]?.total ?? null;
            const exam = parseFloat(input.value);
            const totalEl = modal.querySelector(`.res-total[data-subj="${subj}"]`);
            totalEl.textContent = (caTotal !== null && !isNaN(exam)) ? (caTotal + exam) : '—';
            // Refresh performance summary
            const wellEl = modal.querySelector('#ur-doing-well');
            const needsEl = modal.querySelector('#ur-needs-improvement');
            if (wellEl && needsEl) {
                const well = [], needs = [];
                subjects.forEach(s => {
                    const ca = midResult[s]?.total ?? null;
                    const ex = parseFloat(modal.querySelector(`input[data-subj="${s}"][data-field="exam"]`)?.value);
                    if (ca !== null && !isNaN(ex)) {
                        (ca + ex >= 60 ? well : needs).push(s);
                    }
                });
                wellEl.textContent = well.join(', ') || 'None yet';
                needsEl.textContent = needs.join(', ') || 'None yet';
            }
        });
    });

    // Star rating interaction
    modal.querySelectorAll('.psd-stars').forEach(starGroup => {
        starGroup.querySelectorAll('label').forEach(label => {
            label.addEventListener('click', () => {
                const val = parseInt(label.querySelector('input').value);
                starGroup.querySelectorAll('label').forEach((l, idx) => {
                    l.style.color = (idx + 1) <= val ? '#f59e0b' : '#ddd';
                });
            });
        });
    });

    // Save
    modal.querySelector('#ur-save').onclick = async () => {
        const saveBtn = modal.querySelector('#ur-save');
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';

        const result = {
            teacher_comment: modal.querySelector('#ur-teacher-comment').value.trim(),
            head_comment: modal.querySelector('#ur-head-comment').value.trim(),
            psd: { comment: modal.querySelector('#ur-psd-comment').value.trim() }
        };

        // Collect subject scores
        subjects.forEach(subj => {
            const exam = parseFloat(modal.querySelector(`input[data-subj="${subj}"][data-field="exam"]`).value);
            const remark = modal.querySelector(`input[data-subj="${subj}"][data-field="remark"]`).value.trim();
            const caTotal = midResult[subj]?.total ?? null;
            result[subj] = {
                ca1: midResult[subj]?.ca1 ?? null,
                ca2: midResult[subj]?.ca2 ?? null,
                ca_total: caTotal,
                exam: isNaN(exam) ? null : exam,
                total: (caTotal !== null && !isNaN(exam)) ? caTotal + exam : null,
                remark
            };
        });

        // Collect PSD ratings
        PSD_TRAITS.forEach(trait => {
            const checked = modal.querySelector(`input[name="psd-${trait}"]:checked`);
            result.psd[trait] = checked ? parseInt(checked.value) : null;
        });

        try {
            const res = await fetch('/api/students', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: student.id, result })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            student.result = result;
            modal.remove();
            alert(`Result saved for ${student.first_name} ${student.last_name}.`);
        } catch (err) {
            alert('Error saving result: ' + err.message);
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save Result';
        }
    };

    document.body.appendChild(modal);
}

// ── Mid-Result modal ─────────────────────────────────────────────────────────
function buildMidResultModal(student) {
    const existing = document.getElementById('mid-result-modal');
    if (existing) existing.remove();

    const subjects = Array.isArray(student.subjects) && student.subjects.length
        ? student.subjects
        : getSubjectsForClass(student.class_name);

    // mid_result stored as { subjectName: { ca1, ca2 }, ... }
    const saved = (typeof student.mid_result === 'object' && student.mid_result !== null)
        ? student.mid_result : {};

    const modal = document.createElement('div');
    modal.id = 'mid-result-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px';

    const rowsHtml = subjects.map(subj => {
        const ca1 = saved[subj]?.ca1 ?? '';
        const ca2 = saved[subj]?.ca2 ?? '';
        const total = (ca1 !== '' && ca2 !== '') ? (parseFloat(ca1) + parseFloat(ca2)) : '';
        return `
        <tr>
            <td style="padding:8px 10px;font-size:0.88rem">${subj}</td>
            <td style="padding:8px 6px">
                <input type="number" min="0" max="20" data-subj="${subj}" data-ca="1"
                    value="${ca1}" placeholder="0"
                    style="width:60px;padding:6px;border:1px solid #ddd;border-radius:4px;text-align:center">
            </td>
            <td style="padding:8px 6px">
                <input type="number" min="0" max="20" data-subj="${subj}" data-ca="2"
                    value="${ca2}" placeholder="0"
                    style="width:60px;padding:6px;border:1px solid #ddd;border-radius:4px;text-align:center">
            </td>
            <td style="padding:8px 10px;text-align:center">
                <span class="ca-total" data-subj="${subj}"
                    style="font-weight:600;color:#5c6bc0;font-size:0.9rem">${total !== '' ? total : '—'}</span>
            </td>
        </tr>`;
    }).join('');

    modal.innerHTML = `
        <div style="background:#fff;border-radius:10px;width:100%;max-width:640px;max-height:90vh;overflow-y:auto;padding:28px;position:relative">
            <button id="mr-close" style="position:absolute;top:14px;right:16px;background:none;border:none;font-size:1.4rem;cursor:pointer;color:#999">&times;</button>
            <h2 style="margin:0 0 4px">Update Mid-Term Result</h2>
            <p style="margin:0 0 18px;color:#888;font-size:0.88rem">${student.first_name} ${student.last_name}</p>

            <div style="overflow-x:auto">
                <table style="width:100%;border-collapse:collapse">
                    <thead>
                        <tr style="background:#f5f6fa">
                            <th style="padding:10px;text-align:left;font-size:0.82rem;color:#555;border-bottom:2px solid #eee">Subject</th>
                            <th style="padding:10px;text-align:center;font-size:0.82rem;color:#555;border-bottom:2px solid #eee">1st CA<br><span style="font-weight:400;color:#aaa">(20%)</span></th>
                            <th style="padding:10px;text-align:center;font-size:0.82rem;color:#555;border-bottom:2px solid #eee">2nd CA<br><span style="font-weight:400;color:#aaa">(20%)</span></th>
                            <th style="padding:10px;text-align:center;font-size:0.82rem;color:#555;border-bottom:2px solid #eee">Total<br><span style="font-weight:400;color:#aaa">(40%)</span></th>
                        </tr>
                    </thead>
                    <tbody id="mr-tbody">${rowsHtml}</tbody>
                </table>
            </div>

            <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:20px">
                <button id="mr-cancel" style="padding:9px 20px;border:1px solid #ddd;border-radius:5px;background:#fff;cursor:pointer">Cancel</button>
                <button id="mr-save" style="padding:9px 20px;background:#5c6bc0;color:#fff;border:none;border-radius:5px;cursor:pointer">Save Results</button>
            </div>
        </div>`;

    modal.querySelector('#mr-close').onclick = () => modal.remove();
    modal.querySelector('#mr-cancel').onclick = () => modal.remove();
    modal.onclick = e => { if (e.target === modal) modal.remove(); };

    // Auto-compute total on input
    modal.querySelectorAll('input[type=number]').forEach(input => {
        input.addEventListener('input', () => {
            const subj = input.dataset.subj;
            const ca1Input = modal.querySelector(`input[data-subj="${subj}"][data-ca="1"]`);
            const ca2Input = modal.querySelector(`input[data-subj="${subj}"][data-ca="2"]`);
            const totalEl = modal.querySelector(`.ca-total[data-subj="${subj}"]`);
            const v1 = parseFloat(ca1Input.value);
            const v2 = parseFloat(ca2Input.value);
            totalEl.textContent = (!isNaN(v1) && !isNaN(v2)) ? (v1 + v2) : '—';
        });
    });

    // Save to Supabase
    modal.querySelector('#mr-save').onclick = async () => {
        const saveBtn = modal.querySelector('#mr-save');
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';

        const mid_result = {};
        subjects.forEach(subj => {
            const ca1 = parseFloat(modal.querySelector(`input[data-subj="${subj}"][data-ca="1"]`).value);
            const ca2 = parseFloat(modal.querySelector(`input[data-subj="${subj}"][data-ca="2"]`).value);
            if (!isNaN(ca1) || !isNaN(ca2)) {
                mid_result[subj] = {
                    ca1: isNaN(ca1) ? null : ca1,
                    ca2: isNaN(ca2) ? null : ca2,
                    total: (!isNaN(ca1) && !isNaN(ca2)) ? ca1 + ca2 : null
                };
            }
        });

        try {
            const res = await fetch('/api/students', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: student.id, mid_result })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            student.mid_result = mid_result;
            modal.remove();
            alert(`Mid-term results saved for ${student.first_name} ${student.last_name}.`);
        } catch (err) {
            alert('Error saving results: ' + err.message);
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save Results';
        }
    };

    document.body.appendChild(modal);
}

// ── Result Archive modal ─────────────────────────────────────────────────────
function buildResultArchiveModal(student, classKey) {
    const existing = document.getElementById('archive-modal');
    if (existing) existing.remove();

    const fullName = [student.first_name, student.middle_name, student.last_name].filter(Boolean).join(' ');

    const TERMS = [
        { term: '2nd Term', session: '2025/2026' },
        { term: '3rd Term', session: '2025/2026' },
    ];

    // Determine which terms have result data
    const result = (typeof student.result === 'object' && student.result) ? student.result : null;
    const hasCurrentResult = result && Object.keys(result).some(k => !['psd','teacher_comment','head_comment'].includes(k));

    const cardsHtml = TERMS.map(({ term, session }) => {
        const isCurrent = term === '2nd Term' && session === '2025/2026';
        const hasData = isCurrent && hasCurrentResult;
        const url = `report-card.html?id=${student.id}&class_key=${classKey}&term=${encodeURIComponent(term)}&session=${encodeURIComponent(session)}`;

        return `
        <div style="border:1px solid ${hasData ? '#c5cae9' : '#eee'};border-radius:8px;padding:16px 18px;display:flex;align-items:center;justify-content:space-between;background:${hasData ? '#f5f6ff' : '#fafafa'}">
            <div style="display:flex;align-items:center;gap:14px">
                <div style="width:40px;height:40px;border-radius:8px;background:${hasData ? '#e8eaf6' : '#f0f0f0'};display:flex;align-items:center;justify-content:center">
                    <i class="fas fa-file-alt" style="color:${hasData ? '#5c6bc0' : '#ccc'};font-size:1.1rem"></i>
                </div>
                <div>
                    <div style="font-weight:600;font-size:0.9rem;color:${hasData ? '#333' : '#aaa'}">${term} &mdash; ${session}</div>
                    <div style="font-size:0.78rem;color:${hasData ? '#5c6bc0' : '#bbb'};margin-top:2px">${hasData ? 'Report card available' : 'No record yet'}</div>
                </div>
            </div>
            ${hasData
                ? `<a href="${url}" target="_blank" style="padding:7px 16px;background:#5c6bc0;color:#fff;border-radius:5px;font-size:0.82rem;text-decoration:none;white-space:nowrap"><i class="fas fa-eye"></i> View</a>`
                : `<span style="font-size:0.78rem;color:#ccc;font-style:italic">Not available</span>`
            }
        </div>`;
    }).join('');

    const modal = document.createElement('div');
    modal.id = 'archive-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px';
    modal.innerHTML = `
        <div style="background:#fff;border-radius:10px;width:100%;max-width:560px;max-height:90vh;overflow-y:auto;padding:28px;position:relative">
            <button id="archive-close" style="position:absolute;top:14px;right:16px;background:none;border:none;font-size:1.4rem;cursor:pointer;color:#999">&times;</button>
            <h2 style="margin:0 0 4px">Result Archive</h2>
            <p style="margin:0 0 20px;color:#888;font-size:0.88rem">${fullName} &mdash; ${student.class_name || classKey}</p>
            <div style="display:flex;flex-direction:column;gap:10px">${cardsHtml}</div>
            <p style="margin-top:18px;font-size:0.78rem;color:#bbb;text-align:center">Report cards are generated from saved term results. Past terms will appear here once results are recorded.</p>
        </div>`;

    modal.querySelector('#archive-close').onclick = () => modal.remove();
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
    document.body.appendChild(modal);
}

// ── Add Student modal (teacher) ─────────────────────────────────────────────
function buildAddStudentModal(classKey, className, currentUser) {
    const existing = document.getElementById('add-student-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'add-student-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px';
    modal.innerHTML = `
        <div style="background:#fff;border-radius:10px;width:100%;max-width:620px;max-height:90vh;overflow-y:auto;padding:28px;position:relative">
            <button id="asm-close" style="position:absolute;top:14px;right:16px;background:none;border:none;font-size:1.4rem;cursor:pointer;color:#999">&times;</button>
            <h2 style="margin:0 0 4px">Add Student</h2>
            <p style="margin:0 0 20px;color:#888;font-size:0.88rem">Enrolling into: <strong>${className}</strong></p>
            <form id="asm-form">
                <p style="font-weight:600;margin:0 0 12px;color:#555;border-bottom:1px solid #eee;padding-bottom:6px">Personal Information</p>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                    <div><label style="font-size:.85rem">First Name *</label><input id="asm-first" required style="width:100%;padding:8px;border:1px solid #ddd;border-radius:5px;margin-top:4px;box-sizing:border-box"></div>
                    <div><label style="font-size:.85rem">Middle Name</label><input id="asm-middle" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:5px;margin-top:4px;box-sizing:border-box"></div>
                    <div><label style="font-size:.85rem">Last Name *</label><input id="asm-last" required style="width:100%;padding:8px;border:1px solid #ddd;border-radius:5px;margin-top:4px;box-sizing:border-box"></div>
                    <div><label style="font-size:.85rem">Gender *</label>
                        <select id="asm-gender" required style="width:100%;padding:8px;border:1px solid #ddd;border-radius:5px;margin-top:4px">
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select></div>
                    <div><label style="font-size:.85rem">Date of Birth</label><input type="date" id="asm-dob" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:5px;margin-top:4px;box-sizing:border-box"></div>
                    <div><label style="font-size:.85rem">Enrollment Date</label><input type="date" id="asm-enroll" value="${new Date().toISOString().split('T')[0]}" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:5px;margin-top:4px;box-sizing:border-box"></div>
                </div>

                <p style="font-weight:600;margin:18px 0 12px;color:#555;border-bottom:1px solid #eee;padding-bottom:6px">Parent / Guardian</p>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                    <div style="grid-column:1/-1"><label style="font-size:.85rem">Parent/Guardian Name</label><input id="asm-parent" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:5px;margin-top:4px;box-sizing:border-box"></div>
                    <div><label style="font-size:.85rem">Phone</label><input id="asm-parent-phone" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:5px;margin-top:4px;box-sizing:border-box"></div>
                    <div><label style="font-size:.85rem">Email</label><input type="email" id="asm-parent-email" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:5px;margin-top:4px;box-sizing:border-box"></div>
                </div>

                <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:24px">
                    <button type="button" id="asm-cancel" style="padding:9px 20px;border:1px solid #ddd;border-radius:5px;background:#fff;cursor:pointer">Cancel</button>
                    <button type="submit" id="asm-submit" style="padding:9px 24px;background:#4CAF50;color:#fff;border:none;border-radius:5px;cursor:pointer;font-weight:600">Enrol Student</button>
                </div>
            </form>
        </div>`;

    modal.querySelector('#asm-close').onclick = () => modal.remove();
    modal.querySelector('#asm-cancel').onclick = () => modal.remove();
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });

    modal.querySelector('#asm-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        const btn = modal.querySelector('#asm-submit');
        btn.disabled = true; btn.textContent = 'Enrolling...';

        const payload = {
            first_name: document.getElementById('asm-first').value.trim(),
            middle_name: document.getElementById('asm-middle').value.trim(),
            last_name: document.getElementById('asm-last').value.trim(),
            gender: document.getElementById('asm-gender').value,
            date_of_birth: document.getElementById('asm-dob').value || null,
            enrollment_date: document.getElementById('asm-enroll').value || null,
            parent_name: document.getElementById('asm-parent').value.trim(),
            parent_phone: document.getElementById('asm-parent-phone').value.trim(),
            parent_email: document.getElementById('asm-parent-email').value.trim(),
            class_key: classKey,
            class_name: className
        };

        try {
            const res = await fetch('/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            modal.remove();
            // Show credentials
            const credModal = document.createElement('div');
            credModal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1001;display:flex;align-items:center;justify-content:center;padding:20px';
            credModal.innerHTML = `
                <div style="background:#fff;border-radius:10px;max-width:400px;width:100%;padding:28px;text-align:center">
                    <div style="color:#4CAF50;font-size:2.5rem;margin-bottom:12px"><i class="fas fa-check-circle"></i></div>
                    <h2 style="margin:0 0 8px">Student Enrolled!</h2>
                    <p style="color:#666;margin:0 0 20px">${payload.first_name} ${payload.last_name} has been added to ${className}.</p>
                    <div style="background:#f0f9f0;border:2px solid #4CAF50;border-radius:8px;padding:16px;margin-bottom:20px">
                        <p style="margin:0 0 6px;font-weight:600">Login Credentials</p>
                        <p style="margin:4px 0"><span style="color:#666">Username:</span> <strong>${data.student.admission_number}</strong></p>
                        <p style="margin:4px 0"><span style="color:#666">Password:</span> <strong>${data.default_password}</strong></p>
                        <p style="margin:10px 0 0;font-size:0.78rem;color:#888">Password is the student's date of birth (DDMMYYYY).<br>Please share with the parent/guardian.</p>
                    </div>
                    <button style="width:100%;padding:10px;background:#4CAF50;color:#fff;border:none;border-radius:5px;cursor:pointer;font-size:1rem" onclick="this.closest('div[style]').remove()">Done</button>
                </div>`;
            credModal.addEventListener('click', e => { if (e.target === credModal) credModal.remove(); });
            document.body.appendChild(credModal);
            await loadMyClass(currentUser);
        } catch (err) {
            alert('Error enrolling student: ' + err.message);
            btn.disabled = false; btn.textContent = 'Enrol Student';
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

        document.getElementById('add-student-to-class-btn')?.remove();
        const addBtn = document.createElement('button');
        addBtn.id = 'add-student-to-class-btn';
        addBtn.innerHTML = '<i class="fas fa-user-plus"></i> Add Student to Class';
        addBtn.style.cssText = 'margin-top:16px;padding:10px 20px;background:#4CAF50;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:0.95rem;display:flex;align-items:center;gap:8px';
        addBtn.onclick = () => buildAddStudentModal(assignedClassKey, className, currentUser);
        grid.appendChild(addBtn);

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
                                        <a href="#" data-action="update-mid-result" data-id="${s.id}"><i class="fas fa-pen-square"></i> Update Mid-Result</a>
                                        <a href="#" data-action="update-result" data-id="${s.id}"><i class="fas fa-pen"></i> Update Result</a>
                                        <a href="#" data-action="report-card" data-id="${s.id}"><i class="fas fa-id-card"></i> Report Card</a>
                                        <a href="#" data-action="result-archive" data-id="${s.id}"><i class="fas fa-archive"></i> Result Archive</a>
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

                if (action === 'subjects') {
                    buildSubjectsModal(student);
                    return;
                }

                if (action === 'files') {
                    buildFilesModal(student);
                    return;
                }

                if (action === 'update-mid-result') {
                    buildMidResultModal(student);
                    return;
                }

                if (action === 'update-result') {
                    buildUpdateResultModal(student, assignedClassKey);
                    return;
                }

                if (action === 'report-card') {
                    const term = encodeURIComponent('2nd Term');
                    const session = encodeURIComponent('2025/2026');
                    window.open(`report-card.html?id=${student.id}&class_key=${assignedClassKey}&term=${term}&session=${session}`, '_blank');
                    return;
                }

                if (action === 'result-archive') {
                    buildResultArchiveModal(student, assignedClassKey);
                    return;
                }

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
