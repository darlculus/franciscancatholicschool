document.addEventListener('DOMContentLoaded', async function () {
    updateDateDisplay();
    initTabs();
    initModals();
    initAttendance();
    await setTodayAsDefault();
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function getElement(id) { return document.getElementById(id); }

function updateDateDisplay() {
    const el = getElement('current-date');
    if (el) el.textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
}

async function setTodayAsDefault() {
    const today = new Date().toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"]').forEach(i => { if (i) i.value = today; });

    // Auto-select teacher's assigned class then load students
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser') || 'null');

    // Try to get assigned class from teacher record
    let assignedClass = currentUser?.assigned_class || null;

    if (!assignedClass && currentUser) {
        try {
            const tRes = await fetch('/api/teachers');
            const tData = await tRes.json();
            const teacher = (tData.teachers || []).find(t =>
                t.teacher_id === currentUser.username ||
                t.email === currentUser.email
            );
            assignedClass = teacher?.assigned_class || null;
        } catch (e) { /* ignore */ }
    }

    if (assignedClass) {
        ['attendance-class', 'modal-attendance-class'].forEach(id => {
            const el = getElement(id);
            if (el) el.value = assignedClass;
        });
        // Auto-load today's attendance
        await loadAttendanceData(today, assignedClass);
    }
}

function showNotification(message, type = 'info') {
    let n = document.querySelector('.notification');
    if (!n) { n = document.createElement('div'); document.body.appendChild(n); }
    n.textContent = message;
    n.className = `notification notification-${type} show`;
    setTimeout(() => n.classList.remove('show'), 4000);
}

function formatDate(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function getCurrentTime() {
    return new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            getElement(this.dataset.tab + '-tab')?.classList.add('active');
        });
    });
}

// ── Modals ────────────────────────────────────────────────────────────────────
function initModals() {
    // Open take-attendance modal
    getElement('take-attendance-btn')?.addEventListener('click', () => {
        const today = new Date().toISOString().split('T')[0];
        const dateEl = getElement('modal-attendance-date');
        if (dateEl) dateEl.value = today;
        getElement('take-attendance-modal')?.classList.add('active');
    });

    // Close buttons
    document.querySelectorAll('.close-modal, .cancel-modal').forEach(btn => {
        btn.addEventListener('click', () => btn.closest('.modal')?.classList.remove('active'));
    });
    document.querySelectorAll('.modal').forEach(m => {
        m.addEventListener('click', e => { if (e.target === m) m.classList.remove('active'); });
    });

    // Take attendance form submit → load students into table
    getElement('take-attendance-form')?.addEventListener('submit', async function (e) {
        e.preventDefault();
        const date = getElement('modal-attendance-date').value;
        const classKey = getElement('modal-attendance-class').value;
        const defaultStatus = document.querySelector('input[name="default-status"]:checked')?.value || 'none';

        if (!date || !classKey) { showNotification('Please select a date and class.', 'warning'); return; }

        // Sync to main filters
        const mainDate = getElement('attendance-date');
        const mainClass = getElement('attendance-class');
        if (mainDate) mainDate.value = date;
        if (mainClass) mainClass.value = classKey;

        getElement('take-attendance-modal')?.classList.remove('active');
        await loadAttendanceData(date, classKey, defaultStatus);
    });

    // Edit attendance form submit
    getElement('edit-attendance-form')?.addEventListener('submit', function (e) {
        e.preventDefault();
        const studentId = getElement('edit-student-id').value;
        const status = document.querySelector('input[name="edit-status"]:checked')?.value;
        const timeIn = getElement('edit-time-in').value;
        const notes = getElement('edit-notes').value;
        const absenceReason = getElement('edit-absence-reason').value;

        if (!status) { showNotification('Please select a status.', 'warning'); return; }

        updateAttendanceRecord(studentId, status, timeIn, notes, absenceReason);
        getElement('edit-attendance-modal')?.classList.remove('active');
        getElement('save-attendance-btn').disabled = false;
        showNotification('Record updated.', 'success');
    });

    // Show/hide absence reason
    document.querySelectorAll('input[name="edit-status"]').forEach(r => {
        r.addEventListener('change', function () {
            const grp = getElement('absence-reason-group');
            if (grp) grp.style.display = this.value === 'absent' ? 'block' : 'none';
        });
    });

    // Edit button delegation
    document.addEventListener('click', function (e) {
        const btn = e.target.closest('.edit-attendance-btn');
        if (!btn) return;
        getElement('edit-student-id').value = btn.dataset.studentId;
        getElement('edit-student-name').textContent = btn.dataset.studentName;
        getElement('edit-student-class').textContent = btn.dataset.studentClass;
        getElement('edit-attendance-date').textContent = formatDate(getElement('attendance-date')?.value);
        const statusRadio = getElement(`edit-status-${btn.dataset.status}`);
        if (statusRadio) statusRadio.checked = true;
        getElement('edit-time-in').value = btn.dataset.timeIn || '';
        getElement('edit-notes').value = btn.dataset.notes || '';
        const grp = getElement('absence-reason-group');
        if (grp) grp.style.display = btn.dataset.status === 'absent' ? 'block' : 'none';
        getElement('edit-attendance-modal')?.classList.add('active');
    });
}

// ── Attendance Core ───────────────────────────────────────────────────────────
function initAttendance() {
    // Load button
    getElement('load-attendance-btn')?.addEventListener('click', async () => {
        const date = getElement('attendance-date')?.value;
        const classKey = getElement('attendance-class')?.value;
        if (!date || !classKey) { showNotification('Please select a date and class.', 'warning'); return; }
        await loadAttendanceData(date, classKey);
    });

    // Save button
    getElement('save-attendance-btn')?.addEventListener('click', saveAttendanceData);

    // Print button
    getElement('print-attendance-btn')?.addEventListener('click', printAttendance);

    // Export button
    getElement('export-attendance-btn')?.addEventListener('click', exportAttendance);

    // Select all
    getElement('select-all-header')?.addEventListener('change', function () {
        document.querySelectorAll('.student-checkbox').forEach(cb => cb.checked = this.checked);
    });

    // Bulk status buttons
    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const status = this.dataset.status;
            const checked = document.querySelectorAll('.student-checkbox:checked');
            if (!checked.length) { showNotification('Select at least one student.', 'warning'); return; }
            checked.forEach(cb => updateAttendanceStatus(cb.value, status));
            getElement('save-attendance-btn').disabled = false;
            updateAttendanceSummary();
            showNotification(`${checked.length} student(s) marked as ${status}.`, 'success');
        });
    });

    // Search
    document.querySelector('.search-box input')?.addEventListener('input', function () {
        const term = this.value.toLowerCase();
        document.querySelectorAll('#attendance-list tr[data-student-id]').forEach(row => {
            const name = row.querySelector('td:nth-child(3)')?.textContent.toLowerCase() || '';
            row.style.display = name.includes(term) ? '' : 'none';
        });
    });
}

// ── Load students + saved attendance from Supabase ────────────────────────────
async function loadAttendanceData(date, classKey, defaultStatus = 'none') {
    const tbody = getElement('attendance-list');
    tbody.innerHTML = `<tr><td colspan="7" class="text-center"><div class="empty-state-container"><i class="fas fa-spinner fa-spin"></i><p>Loading...</p></div></td></tr>`;

    try {
        // 1. Fetch students in this class
        const sRes = await fetch(`/api/students?class_key=${encodeURIComponent(classKey)}`);
        const sData = await sRes.json();
        const students = sData.students || [];

        if (!students.length) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center"><div class="empty-state-container"><i class="fas fa-users empty-icon"></i><p>No students found in this class.</p></div></td></tr>`;
            return;
        }

        // 2. Fetch any already-saved attendance for this date+class
        let saved = {};
        try {
            const aRes = await fetch(`/api/attendance?date=${date}&class_key=${encodeURIComponent(classKey)}`);
            if (aRes.ok) {
                const aData = await aRes.json();
                (aData.records || []).forEach(r => { saved[r.student_id] = r; });
            }
        } catch (e) { /* no saved records yet */ }

        // 3. Render rows
        tbody.innerHTML = '';
        students.forEach(s => {
            const fullName = [s.first_name, s.middle_name, s.last_name].filter(Boolean).join(' ');
            const rec = saved[s.id];
            const status = rec?.status || (defaultStatus !== 'none' ? defaultStatus : '');
            const timeIn = rec?.time_in || (status === 'present' || status === 'late' ? getCurrentTime() : '');
            const notes = rec?.notes || '';

            const statusHtml = statusBadge(status);
            const row = document.createElement('tr');
            row.dataset.studentId = s.id;
            row.innerHTML = `
                <td><input type="checkbox" class="student-checkbox" value="${s.id}"></td>
                <td>${s.admission_number || '—'}</td>
                <td>
                    <div style="display:flex;align-items:center;gap:8px">
                        <div style="width:32px;height:32px;border-radius:50%;overflow:hidden;background:#f0f0f0;display:flex;align-items:center;justify-content:center;flex-shrink:0">
                            ${s.photo_url ? `<img src="${s.photo_url}" style="width:100%;height:100%;object-fit:cover">` : `<i class="fas fa-user" style="color:#bbb;font-size:0.85rem"></i>`}
                        </div>
                        ${fullName}
                    </div>
                </td>
                <td>${statusHtml}</td>
                <td>${timeIn || '—'}</td>
                <td>${notes || '—'}</td>
                <td>
                    <button class="action-btn edit-attendance-btn"
                        data-student-id="${s.id}"
                        data-student-name="${fullName}"
                        data-student-class="${s.class_name || classKey}"
                        data-status="${status}"
                        data-time-in="${timeIn}"
                        data-notes="${notes}"
                        title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>`;
            tbody.appendChild(row);
        });

        updateAttendanceSummary();
        ['save-attendance-btn', 'print-attendance-btn', 'export-attendance-btn'].forEach(id => {
            const el = getElement(id);
            if (el) el.disabled = false;
        });
        showNotification(`Loaded ${students.length} student(s).`, 'success');

    } catch (err) {
        console.error(err);
        tbody.innerHTML = `<tr><td colspan="7" class="text-center"><div class="empty-state-container"><i class="fas fa-exclamation-triangle"></i><p>Failed to load. Please try again.</p></div></td></tr>`;
        showNotification('Failed to load attendance data.', 'error');
    }
}

function statusBadge(status) {
    if (status === 'present') return `<span class="status-indicator status-present"><i class="fas fa-check-circle"></i> Present</span>`;
    if (status === 'absent')  return `<span class="status-indicator status-absent"><i class="fas fa-times-circle"></i> Absent</span>`;
    if (status === 'late')    return `<span class="status-indicator status-late"><i class="fas fa-clock"></i> Late</span>`;
    return `<span class="status-indicator" style="color:#aaa">Not marked</span>`;
}

function updateAttendanceStatus(studentId, status) {
    const row = document.querySelector(`tr[data-student-id="${studentId}"]`);
    if (!row) return;
    const timeIn = (status === 'present' || status === 'late') ? getCurrentTime() : '';
    row.querySelector('td:nth-child(4)').innerHTML = statusBadge(status);
    row.querySelector('td:nth-child(5)').textContent = timeIn || '—';
    const btn = row.querySelector('.edit-attendance-btn');
    if (btn) { btn.dataset.status = status; btn.dataset.timeIn = timeIn; }
}

function updateAttendanceRecord(studentId, status, timeIn, notes, absenceReason) {
    const row = document.querySelector(`tr[data-student-id="${studentId}"]`);
    if (!row) return;
    const fullNotes = absenceReason && status === 'absent' ? (notes ? `${notes} (${absenceReason})` : absenceReason) : notes;
    row.querySelector('td:nth-child(4)').innerHTML = statusBadge(status);
    row.querySelector('td:nth-child(5)').textContent = timeIn || '—';
    row.querySelector('td:nth-child(6)').textContent = fullNotes || '—';
    const btn = row.querySelector('.edit-attendance-btn');
    if (btn) { btn.dataset.status = status; btn.dataset.timeIn = timeIn; btn.dataset.notes = fullNotes; }
    updateAttendanceSummary();
}

function updateAttendanceSummary() {
    let present = 0, absent = 0, late = 0;
    document.querySelectorAll('#attendance-list tr[data-student-id]').forEach(row => {
        const text = row.querySelector('td:nth-child(4)')?.textContent.trim() || '';
        if (text.includes('Present')) present++;
        else if (text.includes('Absent')) absent++;
        else if (text.includes('Late')) late++;
    });
    const total = present + absent + late;
    getElement('present-count').textContent = present;
    getElement('absent-count').textContent = absent;
    getElement('late-count').textContent = late;
    getElement('attendance-rate').textContent = total > 0 ? `${Math.round((present + late) / total * 100)}%` : '0%';
}

// ── Save to Supabase ──────────────────────────────────────────────────────────
async function saveAttendanceData() {
    const date = getElement('attendance-date')?.value;
    const classKey = getElement('attendance-class')?.value;
    const classSelect = getElement('attendance-class');
    const className = classSelect?.options[classSelect.selectedIndex]?.text || classKey;

    if (!date || !classKey) { showNotification('Please select a date and class.', 'warning'); return; }

    const rows = document.querySelectorAll('#attendance-list tr[data-student-id]');
    if (!rows.length) { showNotification('No attendance data to save.', 'warning'); return; }

    const saveBtn = getElement('save-attendance-btn');
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

    const records = [];
    rows.forEach(row => {
        const studentId = row.dataset.studentId;
        const studentName = row.querySelector('td:nth-child(3)')?.textContent.trim() || '';
        const statusText = row.querySelector('td:nth-child(4)')?.textContent.trim() || '';
        const timeIn = row.querySelector('td:nth-child(5)')?.textContent.trim();
        const notes = row.querySelector('td:nth-child(6)')?.textContent.trim();
        let status = '';
        if (statusText.includes('Present')) status = 'present';
        else if (statusText.includes('Absent')) status = 'absent';
        else if (statusText.includes('Late')) status = 'late';
        records.push({
            studentId,
            studentName,
            status,
            timeIn: timeIn === '—' ? '' : timeIn,
            notes: notes === '—' ? '' : notes
        });
    });

    try {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser') || 'null');
        const res = await fetch('/api/attendance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date, class_key: classKey, class_name: className, teacher_id: currentUser?.username || null, records })
        });
        if (!res.ok) throw new Error((await res.json()).error || 'Save failed');
        showNotification('Attendance saved successfully!', 'success');
        saveBtn.disabled = true;
    } catch (err) {
        showNotification('Failed to save: ' + err.message, 'error');
        saveBtn.disabled = false;
    } finally {
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Attendance';
    }
}

// ── Print ─────────────────────────────────────────────────────────────────────
function printAttendance() {
    const date = getElement('attendance-date')?.value;
    const classSelect = getElement('attendance-class');
    const classText = classSelect?.options[classSelect?.selectedIndex]?.text || '';
    const rows = document.querySelectorAll('#attendance-list tr[data-student-id]');
    if (!rows.length) { showNotification('No data to print.', 'warning'); return; }

    const win = window.open('', '_blank');
    if (!win) { showNotification('Pop-up blocked. Please allow pop-ups.', 'warning'); return; }

    let tableRows = '';
    rows.forEach((row, i) => {
        const admNo = row.querySelector('td:nth-child(2)')?.textContent || '';
        const name  = row.querySelector('td:nth-child(3)')?.textContent.trim() || '';
        const status = row.querySelector('td:nth-child(4)')?.textContent.trim() || '';
        const timeIn = row.querySelector('td:nth-child(5)')?.textContent || '';
        const notes  = row.querySelector('td:nth-child(6)')?.textContent || '';
        const cls = status.includes('Present') ? 'present' : status.includes('Absent') ? 'absent' : status.includes('Late') ? 'late' : '';
        tableRows += `<tr><td>${i+1}</td><td>${admNo}</td><td>${name}</td><td class="${cls}">${status}</td><td>${timeIn}</td><td>${notes}</td></tr>`;
    });

    win.document.write(`<!DOCTYPE html><html><head><title>Attendance — ${classText} — ${formatDate(date)}</title>
    <style>body{font-family:Arial,sans-serif;margin:20px}h1,h2{color:#3f51b5}table{width:100%;border-collapse:collapse;margin-top:20px}
    th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f5f5f5}
    .present{color:#2e7d32;font-weight:600}.absent{color:#c62828;font-weight:600}.late{color:#f57f17;font-weight:600}
    .sig{margin-top:60px;display:flex;justify-content:space-between}
    .sig-line{width:200px;border-top:1px solid #000;padding-top:6px;text-align:center;font-size:0.9rem}
    @media print{@page{margin:1cm}}</style></head><body>
    <div style="text-align:center;border-bottom:2px solid #3f51b5;padding-bottom:16px;margin-bottom:20px">
        <img src="assets/img/logo.jpg" style="height:60px;margin-bottom:8px"><br>
        <strong style="font-size:1.1rem">Franciscan Catholic Nursery & Primary School</strong><br>
        <span>Daily Attendance Register</span>
    </div>
    <p><strong>Class:</strong> ${classText} &nbsp;&nbsp; <strong>Date:</strong> ${formatDate(date)}</p>
    <table><thead><tr><th>#</th><th>Adm. No.</th><th>Student Name</th><th>Status</th><th>Time In</th><th>Notes</th></tr></thead>
    <tbody>${tableRows}</tbody></table>
    <p><strong>Present:</strong> ${getElement('present-count').textContent} &nbsp;
       <strong>Absent:</strong> ${getElement('absent-count').textContent} &nbsp;
       <strong>Late:</strong> ${getElement('late-count').textContent} &nbsp;
       <strong>Rate:</strong> ${getElement('attendance-rate').textContent}</p>
    <div class="sig">
        <div class="sig-line">Class Teacher</div>
        <div class="sig-line">Head Teacher</div>
    </div>
    </body></html>`);
    win.document.close();
    setTimeout(() => { win.focus(); win.print(); }, 400);
}

// ── Export CSV ────────────────────────────────────────────────────────────────
function exportAttendance() {
    const date = getElement('attendance-date')?.value;
    const classKey = getElement('attendance-class')?.value;
    const rows = document.querySelectorAll('#attendance-list tr[data-student-id]');
    if (!rows.length) { showNotification('No data to export.', 'warning'); return; }

    let csv = 'Admission No.,Student Name,Status,Time In,Notes\n';
    rows.forEach(row => {
        const admNo  = row.querySelector('td:nth-child(2)')?.textContent || '';
        const name   = `"${(row.querySelector('td:nth-child(3)')?.textContent.trim() || '').replace(/"/g,'""')}"`;
        const status = row.querySelector('td:nth-child(4)')?.textContent.trim() || '';
        const timeIn = row.querySelector('td:nth-child(5)')?.textContent || '';
        const notes  = `"${(row.querySelector('td:nth-child(6)')?.textContent || '').replace(/"/g,'""')}"`;
        csv += `${admNo},${name},${status},${timeIn},${notes}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `Attendance_${classKey}_${date}.csv`;
    a.style.display = 'none';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    showNotification('Exported successfully.', 'success');
}
