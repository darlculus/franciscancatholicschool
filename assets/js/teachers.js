let teachers = [];
let currentTeacherId = null;

document.addEventListener('DOMContentLoaded', function () {
    updateDateDisplay();
    initSidebarToggle();
    initTabs();
    initModals();
    initFormTabs();
    loadTeachers();
    initSearch();
});

// ── Data ──────────────────────────────────────────────────────────────────────

async function loadTeachers() {
    try {
        teachers = await window.api.getTeachers();
    } catch (e) {
        teachers = [];
    }
    renderTeachers();
    updateStats();
}

// ── Render ────────────────────────────────────────────────────────────────────

function renderTeachers() {
    const search = (document.getElementById('teacher-search')?.value || '').toLowerCase();
    const statusFilter = document.getElementById('status-filter')?.value || '';
    const subjectFilter = document.getElementById('subject-filter')?.value || '';

    const filtered = teachers.filter(t => {
        const name = (t.full_name || '').toLowerCase();
        const matchSearch = !search || name.includes(search);
        const matchStatus = !statusFilter || (t.status || 'active') === statusFilter;
        const matchSubject = !subjectFilter || t.subject === subjectFilter;
        return matchSearch && matchStatus && matchSubject;
    });

    const tbody = document.querySelector('#teachers-table tbody');
    const emptyState = document.getElementById('no-teachers-message');
    const tableContainer = document.querySelector('.teachers-container');

    if (!tbody) return;
    tbody.innerHTML = '';

    if (filtered.length === 0) {
        if (tableContainer) tableContainer.style.display = 'none';
        if (emptyState) emptyState.style.display = 'flex';
        return;
    }

    if (tableContainer) tableContainer.style.display = 'block';
    if (emptyState) emptyState.style.display = 'none';

    filtered.forEach(t => {
        const status = t.status || 'active';
        const initials = (t.full_name || '?').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
        const row = document.createElement('tr');
        const safeId = String(t.id);
        row.innerHTML = `
            <td>${t.teacher_id || t.id}</td>
            <td>
                <div class="teacher-name">
                    <div class="teacher-avatar" style="background:#4CAF50;color:#fff;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:0.85rem;">${initials}</div>
                    <div class="teacher-info">
                        <span class="name">${t.full_name || '-'}</span>
                        <span class="role" style="font-size:0.75rem;color:#888;">${t.role || 'teacher'}</span>
                    </div>
                </div>
            </td>
            <td>${t.subject || '-'}</td>
            <td>${t.assigned_class || '-'}</td>
            <td>${t.phone || '-'}</td>
            <td>${t.join_date ? new Date(t.join_date).toLocaleDateString() : (t.created_at ? new Date(t.created_at).toLocaleDateString() : '-')}</td>
            <td><span class="status-badge status-${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span></td>
            <td>
                <button class="action-icon view" data-id="${safeId}" title="View"><i class="fas fa-eye"></i></button>
                <button class="action-icon edit" data-id="${safeId}" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="action-icon delete" data-id="${safeId}" title="Delete"><i class="fas fa-trash-alt"></i></button>
            </td>`;
        row.querySelector('.action-icon.view').addEventListener('click', () => openViewModal(safeId));
        row.querySelector('.action-icon.edit').addEventListener('click', () => openEditModal(safeId));
        row.querySelector('.action-icon.delete').addEventListener('click', () => confirmDelete(safeId));
        tbody.appendChild(row);
    });
}

function updateStats() {
    const total = teachers.length;
    const active = teachers.filter(t => (t.status || 'active') === 'active').length;
    const subjects = [...new Set(teachers.map(t => t.subject).filter(Boolean))].length;
    const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newCount = teachers.filter(t => new Date(t.created_at) >= thirtyDaysAgo).length;

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('total-teachers', total);
    set('active-teachers', active);
    set('inactive-teachers', total - active);
    set('subjects-covered', subjects);
    set('new-teachers', newCount);
}

// ── Add Teacher ───────────────────────────────────────────────────────────────

async function addTeacher() {
    const title = document.getElementById('title')?.value || '';
    const firstName = document.getElementById('first-name')?.value?.trim() || '';
    const lastName = document.getElementById('last-name')?.value?.trim() || '';
    const full_name = `${title} ${firstName} ${lastName}`.trim();

    const teacher = {
        teacher_id: document.getElementById('username')?.value?.trim(),
        full_name,
        email: document.getElementById('email')?.value?.trim(),
        phone: document.getElementById('phone')?.value?.trim(),
        subject: document.getElementById('specialization')?.value,
        qualification: document.getElementById('qualification')?.value,
        password: document.getElementById('password')?.value,
        status: document.getElementById('status')?.value || 'active',
        role: document.getElementById('role')?.value || 'teacher',
        assigned_class: document.getElementById('assigned-class')?.value || '',
        join_date: document.getElementById('join-date')?.value || null,
        gender: document.getElementById('gender')?.value || '',
        dob: document.getElementById('dob')?.value || null,
        address: document.getElementById('address')?.value?.trim() || '',
        experience: document.getElementById('experience')?.value || '0',
        employment_type: document.getElementById('employment-type')?.value || 'Full-time',
    };

    if (!teacher.teacher_id || !teacher.full_name || !teacher.email) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }

    try {
        await window.api.addTeacher({
            username: teacher.teacher_id,
            firstName: full_name,
            lastName: '',
            email: teacher.email,
            phone: teacher.phone,
            specialization: teacher.subject,
            qualification: teacher.qualification,
            password: teacher.password,
            status: teacher.status,
            role: teacher.role,
            assignedClass: teacher.assigned_class,
            joinDate: teacher.join_date,
            gender: teacher.gender,
            dob: teacher.dob,
            address: teacher.address,
            experience: teacher.experience,
            employmentType: teacher.employment_type,
        });
        document.getElementById('add-teacher-modal').classList.remove('active');
        document.getElementById('add-teacher-form').reset();
        showNotification('Teacher added successfully!', 'success');
        await loadTeachers();
    } catch (err) {
        console.error(err);
        showNotification('Failed to add teacher. Please try again.', 'error');
    }
}

// ── View Modal ────────────────────────────────────────────────────────────────

function openViewModal(id) {
    const t = teachers.find(x => String(x.id) === String(id));
    if (!t) return;
    currentTeacherId = id;

    const set = (elId, val) => { const el = document.getElementById(elId); if (el) el.textContent = val || '-'; };
    set('view-teacher-name', t.full_name);
    set('view-teacher-subject', t.subject);
    set('view-teacher-id', `ID: ${t.teacher_id || t.id}`);
    set('view-full-name', t.full_name);
    set('view-gender', t.gender);
    set('view-dob', t.dob ? new Date(t.dob).toLocaleDateString() : '-');
    set('view-phone', t.phone);
    set('view-email', t.email);
    set('view-address', t.address);
    set('view-qualification', t.qualification);
    set('view-specialization', t.subject);
    set('view-experience', t.experience ? `${t.experience} years` : '-');
    set('view-join-date', t.join_date ? new Date(t.join_date).toLocaleDateString() : '-');
    set('view-employment-type', t.employment_type);
    set('view-role', t.role);
    set('view-assigned-class', t.assigned_class);

    const statusBadge = document.getElementById('view-teacher-status');
    if (statusBadge) {
        const s = t.status || 'active';
        statusBadge.textContent = s.charAt(0).toUpperCase() + s.slice(1);
        statusBadge.className = `status-badge status-${s}`;
    }

    const subjectsList = document.getElementById('view-subjects-list');
    if (subjectsList) subjectsList.innerHTML = t.subject ? `<li>${t.subject}</li>` : '<li>No subjects assigned</li>';

    document.getElementById('view-teacher-modal')?.classList.add('active');
}

// ── Edit Modal ────────────────────────────────────────────────────────────────

function openEditModal(id) {
    const t = teachers.find(x => String(x.id) === String(id));
    if (!t) return;
    currentTeacherId = id;

    const nameParts = (t.full_name || '').split(' ');
    const setVal = (elId, val) => { const el = document.getElementById(elId); if (el) el.value = val || ''; };

    setVal('edit-teacher-id', t.id);
    setVal('edit-first-name', nameParts[0] || '');
    setVal('edit-last-name', nameParts.slice(1).join(' ') || '');
    setVal('edit-gender', t.gender);
    setVal('edit-dob', t.dob ? t.dob.split('T')[0] : '');
    setVal('edit-phone', t.phone);
    setVal('edit-email', t.email);
    setVal('edit-address', t.address);
    setVal('edit-qualification', t.qualification);
    setVal('edit-specialization', t.subject);
    setVal('edit-experience', t.experience);
    setVal('edit-join-date', t.join_date ? t.join_date.split('T')[0] : '');
    setVal('edit-assigned-class', t.assigned_class);
    setVal('edit-employment-type', t.employment_type);
    setVal('edit-username', t.teacher_id);
    setVal('edit-role', t.role || 'teacher');
    setVal('edit-status', t.status || 'active');
    setVal('edit-password', '');
    setVal('edit-confirm-password', '');

    document.getElementById('edit-teacher-modal')?.classList.add('active');
}

async function updateTeacher() {
    const id = document.getElementById('edit-teacher-id')?.value;
    const firstName = document.getElementById('edit-first-name')?.value?.trim();
    const lastName = document.getElementById('edit-last-name')?.value?.trim();
    const password = document.getElementById('edit-password')?.value;
    const confirmPassword = document.getElementById('edit-confirm-password')?.value;

    if (password && password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }

    const updates = {
        full_name: `${firstName} ${lastName}`.trim(),
        email: document.getElementById('edit-email')?.value?.trim(),
        phone: document.getElementById('edit-phone')?.value?.trim(),
        subject: document.getElementById('edit-specialization')?.value,
        qualification: document.getElementById('edit-qualification')?.value,
        assigned_class: document.getElementById('edit-assigned-class')?.value,
        status: document.getElementById('edit-status')?.value,
        role: document.getElementById('edit-role')?.value,
        gender: document.getElementById('edit-gender')?.value,
        dob: document.getElementById('edit-dob')?.value || null,
        address: document.getElementById('edit-address')?.value?.trim(),
        experience: document.getElementById('edit-experience')?.value,
        employment_type: document.getElementById('edit-employment-type')?.value,
        join_date: document.getElementById('edit-join-date')?.value || null,
    };

    try {
        await window.api.updateTeacher(id, updates);
        document.getElementById('edit-teacher-modal')?.classList.remove('active');
        showNotification('Teacher updated successfully!', 'success');
        await loadTeachers();
    } catch (err) {
        console.error(err);
        showNotification('Failed to update teacher.', 'error');
    }
}

// ── Delete ────────────────────────────────────────────────────────────────────

function confirmDelete(id) {
    currentTeacherId = id;
    const t = teachers.find(x => String(x.id) === String(id));
    const msg = document.getElementById('delete-confirmation-message');
    if (msg) msg.textContent = `Are you sure you want to delete ${t?.full_name || 'this teacher'}? This cannot be undone.`;
    document.getElementById('delete-confirmation-modal')?.classList.add('active');
}

async function deleteTeacher(id) {
    try {
        await window.api.deleteTeacher(id);
        showNotification('Teacher deleted successfully!', 'success');
        await loadTeachers();
    } catch (err) {
        console.error(err);
        showNotification('Failed to delete teacher.', 'error');
    }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function showNotification(message, type = 'info') {
    const toast = document.getElementById('notification-toast');
    if (!toast) { alert(message); return; }
    const msgEl = toast.querySelector('.notification-message');
    const icon = toast.querySelector('.notification-icon');
    if (msgEl) msgEl.textContent = message;
    if (icon) icon.className = `notification-icon fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}`;
    toast.className = `notification-toast show ${type}`;
    setTimeout(() => toast.classList.remove('show'), 4000);
}

function updateDateDisplay() {
    const el = document.getElementById('current-date');
    if (el) el.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function initSidebarToggle() {
    const toggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.dashboard-sidebar');
    if (toggle && sidebar) {
        toggle.addEventListener('click', e => { sidebar.classList.toggle('active'); e.stopPropagation(); });
        document.addEventListener('click', e => {
            if (sidebar.classList.contains('active') && !sidebar.contains(e.target) && e.target !== toggle) {
                sidebar.classList.remove('active');
            }
        });
    }
}

function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(`${this.dataset.tab}-tab`)?.classList.add('active');
        });
    });
    document.querySelectorAll('.profile-tab').forEach(tab => {
        tab.addEventListener('click', function () {
            document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.profile-tab-content').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(`${this.dataset.tab}-tab-content`)?.classList.add('active');
        });
    });
}

function initModals() {
    // Close buttons
    document.querySelectorAll('.close-modal, .cancel-modal').forEach(btn => {
        btn.addEventListener('click', () => btn.closest('.modal')?.classList.remove('active'));
    });
    // Click outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('active'); });
    });
    // Add teacher buttons
    ['add-teacher-btn', 'add-teacher-quick-btn', 'add-first-teacher-btn'].forEach(id => {
        document.getElementById(id)?.addEventListener('click', () => {
            document.getElementById('add-teacher-form')?.reset();
            switchFormTab('personal', 'add-teacher-form');
            document.getElementById('add-teacher-modal')?.classList.add('active');
        });
    });
    // Form submit
    document.getElementById('add-teacher-form')?.addEventListener('submit', e => { e.preventDefault(); addTeacher(); });
    document.getElementById('edit-teacher-form')?.addEventListener('submit', e => { e.preventDefault(); updateTeacher(); });
    // Delete confirm
    document.getElementById('confirm-delete-btn')?.addEventListener('click', () => {
        deleteTeacher(currentTeacherId);
        document.getElementById('delete-confirmation-modal')?.classList.remove('active');
    });
    // Edit profile from view modal
    document.getElementById('edit-profile-btn')?.addEventListener('click', () => {
        document.getElementById('view-teacher-modal')?.classList.remove('active');
        if (currentTeacherId) openEditModal(currentTeacherId);
    });
    // Notification close
    document.querySelector('.notification-close')?.addEventListener('click', () => {
        document.getElementById('notification-toast')?.classList.remove('show');
    });
}

function initSearch() {
    document.getElementById('teacher-search')?.addEventListener('input', renderTeachers);
    document.getElementById('status-filter')?.addEventListener('change', renderTeachers);
    document.getElementById('subject-filter')?.addEventListener('change', renderTeachers);
}

function initFormTabs() {
    document.querySelectorAll('.form-tab').forEach(tab => {
        tab.addEventListener('click', function () {
            switchFormTab(this.dataset.tab, this.closest('form').id);
        });
    });
    document.querySelectorAll('.prev-tab-btn, .next-tab-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            switchFormTab(this.dataset.tab, this.closest('form').id);
        });
    });
}

function switchFormTab(tabId, formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    const prefix = formId.includes('edit') ? 'edit-' : '';

    form.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
    const target = document.getElementById(`${prefix}${tabId}-tab-content`);
    if (target) target.style.display = 'block';

    form.querySelectorAll('.form-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.tab === tabId);
    });

    const prev = form.querySelector('.prev-tab-btn');
    const next = form.querySelector('.next-tab-btn');
    const submit = form.querySelector('.submit-form-btn');

    if (tabId === 'personal') {
        if (prev) prev.style.display = 'none';
        if (next) { next.style.display = 'block'; next.dataset.tab = 'professional'; }
        if (submit) submit.style.display = 'none';
    } else if (tabId === 'professional') {
        if (prev) { prev.style.display = 'block'; prev.dataset.tab = 'personal'; }
        if (next) { next.style.display = 'block'; next.dataset.tab = 'account'; }
        if (submit) submit.style.display = 'none';
    } else if (tabId === 'account') {
        if (prev) { prev.style.display = 'block'; prev.dataset.tab = 'professional'; }
        if (next) next.style.display = 'none';
        if (submit) submit.style.display = 'block';
    }
}
