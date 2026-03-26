let allStudents = [];
let allClasses = [];

document.addEventListener('DOMContentLoaded', async function () {
    updateDateDisplay();
    initTabs();
    initModals();
    await loadClasses();
    await loadStudents();
    initSearchAndFilters();
});

function updateDateDisplay() {
    const el = document.getElementById('current-date');
    if (el) el.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(this.dataset.tab + '-tab')?.classList.add('active');
        });
    });
}

// ── Modals ────────────────────────────────────────────────────────────────────
function initModals() {
    document.getElementById('add-student-btn')?.addEventListener('click', () => openModal('add-student-modal'));

    document.querySelectorAll('.close-modal, .cancel-modal').forEach(btn => {
        btn.addEventListener('click', () => btn.closest('.modal')?.classList.remove('active'));
    });
    document.querySelectorAll('.modal').forEach(m => {
        m.addEventListener('click', e => { if (e.target === m) m.classList.remove('active'); });
    });

    // Multi-step form tabs
    initFormSteps('add-student-form', ['personal', 'academic', 'parent', 'medical'], 'prev-tab-btn', 'next-tab-btn', 'submit-student-btn');
    initFormSteps('edit-student-form', ['edit-personal', 'edit-academic', 'edit-parent', 'edit-medical'], 'edit-prev-tab-btn', 'edit-next-tab-btn', 'update-student-btn');

    document.getElementById('add-student-form')?.addEventListener('submit', async e => {
        e.preventDefault();
        await addStudent();
    });
    document.getElementById('edit-student-form')?.addEventListener('submit', async e => {
        e.preventDefault();
        await updateStudent();
    });
}

function openModal(id) {
    document.getElementById(id)?.classList.add('active');
}
function closeModal(id) {
    document.getElementById(id)?.classList.remove('active');
}

function initFormSteps(formId, steps, prevId, nextId, submitId) {
    let current = 0;
    const show = () => {
        steps.forEach((s, i) => {
            document.getElementById(s + '-info-tab')?.classList.toggle('active', i === current);
            document.querySelector(`[data-tab="${s}"]`)?.classList.toggle('active', i === current);
        });
        document.getElementById(prevId).disabled = current === 0;
        const isLast = current === steps.length - 1;
        document.getElementById(nextId).style.display = isLast ? 'none' : 'inline-block';
        document.getElementById(submitId).style.display = isLast ? 'inline-block' : 'none';
    };
    document.getElementById(prevId)?.addEventListener('click', () => { if (current > 0) { current--; show(); } });
    document.getElementById(nextId)?.addEventListener('click', () => { if (current < steps.length - 1) { current++; show(); } });
    show();
}

// ── Load classes from Supabase ────────────────────────────────────────────────
async function loadClasses() {
    try {
        const res = await fetch('/api/classes');
        const data = await res.json();
        allClasses = data.classes || [];
        const opts = allClasses.map(c => `<option value="${c.class_key}" data-name="${c.name}">${c.name}</option>`).join('');
        ['class-filter', 'class', 'edit-class'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerHTML += opts;
        });
        document.getElementById('class-count').textContent = allClasses.length;
    } catch (e) { console.warn('Could not load classes', e); }
}

// ── Load students ─────────────────────────────────────────────────────────────
async function loadStudents() {
    const tbody = document.querySelector('#students-table tbody');
    if (tbody) tbody.innerHTML = `<tr><td colspan="7" class="text-center"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr>`;
    try {
        const res = await fetch('/api/students');
        const data = await res.json();
        allStudents = data.students || [];
        renderStudents(allStudents);
        updateStats(allStudents);
    } catch (e) {
        console.error(e);
        if (tbody) tbody.innerHTML = `<tr><td colspan="7" class="text-center">Failed to load students.</td></tr>`;
    }
}

function updateStats(students) {
    document.getElementById('student-count').textContent = students.length;
    document.getElementById('male-count').textContent = students.filter(s => s.gender === 'Male').length;
    document.getElementById('female-count').textContent = students.filter(s => s.gender === 'Female').length;
}

function renderStudents(students) {
    const tbody = document.querySelector('#students-table tbody');
    if (!tbody) return;
    if (students.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center"><div class="empty-state"><i class="fas fa-user-graduate"></i><h3>No Students Yet</h3><p>Click "Add Student" to enrol the first student.</p></div></td></tr>`;
        return;
    }
    tbody.innerHTML = students.map(s => `
        <tr>
            <td>${s.admission_number || '—'}</td>
            <td>
                <div class="student-name">
                    <div class="student-avatar"><i class="fas fa-user"></i></div>
                    <div class="student-info">
                        <span>${s.first_name} ${s.last_name}</span>
                        <span class="student-id">${s.gender}</span>
                    </div>
                </div>
            </td>
            <td>${s.class_name}</td>
            <td>
                <div class="parent-info">
                    <div>${s.parent_name || '—'}</div>
                    <div class="parent-contact">${s.parent_phone || ''}</div>
                </div>
            </td>
            <td>${s.enrollment_date ? new Date(s.enrollment_date).toLocaleDateString('en-GB') : '—'}</td>
            <td><span class="status-badge status-${s.status}">${s.status === 'active' ? 'Active' : 'Inactive'}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit" onclick="openEditModal('${s.id}')" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete" onclick="confirmDelete('${s.id}', '${s.first_name} ${s.last_name}')" title="Delete"><i class="fas fa-trash-alt"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ── Search & Filter ───────────────────────────────────────────────────────────
function initSearchAndFilters() {
    ['student-search', 'class-filter', 'status-filter'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', filterStudents);
        document.getElementById(id)?.addEventListener('change', filterStudents);
    });
}

function filterStudents() {
    const search = document.getElementById('student-search')?.value.toLowerCase() || '';
    const cls = document.getElementById('class-filter')?.value || '';
    const status = document.getElementById('status-filter')?.value || '';
    const filtered = allStudents.filter(s => {
        const name = `${s.first_name} ${s.last_name}`.toLowerCase();
        return (!search || name.includes(search) || (s.admission_number || '').toLowerCase().includes(search) || (s.parent_name || '').toLowerCase().includes(search))
            && (!cls || s.class_key === cls)
            && (!status || s.status === status);
    });
    renderStudents(filtered);
}

// ── Add Student ───────────────────────────────────────────────────────────────
async function addStudent() {
    const classEl = document.getElementById('class');
    const classKey = classEl?.value;
    const className = classEl?.options[classEl.selectedIndex]?.dataset.name || classEl?.options[classEl.selectedIndex]?.text || '';

    const payload = {
        first_name: document.getElementById('first-name').value.trim(),
        last_name: document.getElementById('last-name').value.trim(),
        gender: document.getElementById('gender').value,
        date_of_birth: document.getElementById('dob').value || null,
        class_key: classKey,
        class_name: className,
        enrollment_date: document.getElementById('enrollment-date').value || null,
        parent_name: document.getElementById('parent-name').value.trim(),
        parent_phone: document.getElementById('parent-phone').value.trim(),
        parent_email: document.getElementById('parent-email').value.trim(),
        address: document.getElementById('address').value.trim(),
        medical_conditions: document.getElementById('medical-conditions').value.trim()
    };

    try {
        const res = await fetch('/api/students', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        closeModal('add-student-modal');
        document.getElementById('add-student-form').reset();
        showNotification(`${payload.first_name} ${payload.last_name} enrolled successfully. Admission No: ${data.student.admission_number}`, 'success');
        await loadStudents();
    } catch (e) {
        showNotification('Error: ' + e.message, 'error');
    }
}

// ── Edit Student ──────────────────────────────────────────────────────────────
function openEditModal(id) {
    const s = allStudents.find(x => x.id === id);
    if (!s) return;
    document.getElementById('edit-student-id').value = s.id;
    document.getElementById('edit-first-name').value = s.first_name;
    document.getElementById('edit-last-name').value = s.last_name;
    document.getElementById('edit-gender').value = s.gender;
    document.getElementById('edit-dob').value = s.date_of_birth || '';
    document.getElementById('edit-class').value = s.class_key;
    document.getElementById('edit-enrollment-date').value = s.enrollment_date || '';
    document.getElementById('edit-status').value = s.status;
    document.getElementById('edit-parent-name').value = s.parent_name || '';
    document.getElementById('edit-parent-phone').value = s.parent_phone || '';
    document.getElementById('edit-parent-email').value = s.parent_email || '';
    document.getElementById('edit-address').value = s.address || '';
    document.getElementById('edit-medical-conditions').value = s.medical_conditions || '';
    openModal('edit-student-modal');
}

async function updateStudent() {
    const classEl = document.getElementById('edit-class');
    const classKey = classEl?.value;
    const classOpt = classEl?.options[classEl.selectedIndex];
    const className = classOpt?.dataset.name || classOpt?.text || '';

    const payload = {
        id: document.getElementById('edit-student-id').value,
        first_name: document.getElementById('edit-first-name').value.trim(),
        last_name: document.getElementById('edit-last-name').value.trim(),
        gender: document.getElementById('edit-gender').value,
        date_of_birth: document.getElementById('edit-dob').value || null,
        class_key: classKey,
        class_name: className,
        enrollment_date: document.getElementById('edit-enrollment-date').value || null,
        status: document.getElementById('edit-status').value,
        parent_name: document.getElementById('edit-parent-name').value.trim(),
        parent_phone: document.getElementById('edit-parent-phone').value.trim(),
        parent_email: document.getElementById('edit-parent-email').value.trim(),
        address: document.getElementById('edit-address').value.trim(),
        medical_conditions: document.getElementById('edit-medical-conditions').value.trim()
    };

    try {
        const res = await fetch('/api/students', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        closeModal('edit-student-modal');
        showNotification(`${payload.first_name} ${payload.last_name} updated successfully.`, 'success');
        await loadStudents();
    } catch (e) {
        showNotification('Error: ' + e.message, 'error');
    }
}

// ── Delete Student ────────────────────────────────────────────────────────────
function confirmDelete(id, name) {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;
    deleteStudent(id, name);
}

async function deleteStudent(id, name) {
    try {
        const res = await fetch(`/api/students?id=${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error((await res.json()).error);
        showNotification(`${name} removed successfully.`, 'success');
        await loadStudents();
    } catch (e) {
        showNotification('Error: ' + e.message, 'error');
    }
}

// ── Notification ──────────────────────────────────────────────────────────────
function showNotification(message, type = 'info') {
    let n = document.querySelector('.notification');
    if (!n) { n = document.createElement('div'); document.body.appendChild(n); }
    n.textContent = message;
    n.className = `notification notification-${type} show`;
    setTimeout(() => n.classList.remove('show'), 4000);
}
