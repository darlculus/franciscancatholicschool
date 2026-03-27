document.addEventListener('DOMContentLoaded', async function () {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'student') { window.location.href = 'portal.html'; return; }

    // Nav info
    const initials = (currentUser.name || currentUser.full_name || 'S').split(' ').filter(Boolean).map(w => w[0]).join('').substring(0, 2).toUpperCase();
    document.getElementById('student-name').textContent = currentUser.name || currentUser.full_name || currentUser.username;
    document.getElementById('student-grade').textContent = currentUser.class_name || 'Student';
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
    setStudentAvatar(document.getElementById('student-avatar'), currentUser, initials);

    // Sidebar toggle
    const sidebar = document.querySelector('.dashboard-sidebar');
    document.getElementById('sidebar-toggle')?.addEventListener('click', e => {
        sidebar.classList.toggle('active');
        e.stopPropagation();
    });
    document.addEventListener('click', e => {
        if (sidebar.classList.contains('active') && !sidebar.contains(e.target))
            sidebar.classList.remove('active');
    });

    // Logout
    document.getElementById('logout-btn')?.addEventListener('click', e => {
        e.preventDefault();
        ['currentUser', 'authToken'].forEach(k => {
            localStorage.removeItem(k);
            sessionStorage.removeItem(k);
        });
        window.location.href = 'portal.html';
    });

    // Report card link
    document.getElementById('report-card-link')?.addEventListener('click', e => {
        e.preventDefault();
        openStudentReportCard(currentUser);
    });

    let allMessages = [];
    let currentFolder = 'inbox';
    let starred = JSON.parse(localStorage.getItem('student-starred-msgs') || '[]');

    await loadMessages(currentUser);

    // Folder switching
    document.querySelectorAll('.messages-folders li[data-folder]').forEach(li => {
        li.addEventListener('click', e => {
            e.preventDefault();
            document.querySelectorAll('.messages-folders li').forEach(l => l.classList.remove('active'));
            li.classList.add('active');
            currentFolder = li.dataset.folder;
            renderList();
        });
    });

    // Filter
    document.getElementById('message-filter').addEventListener('change', renderList);

    async function loadMessages(user) {
        try {
            const res = await fetch('/api/messages');
            const data = await res.json();
            // Messages sent to 'all-students' or to this student's class or admission number
            allMessages = (data.messages || []).filter(m =>
                m.recipient === 'all-students' ||
                m.recipient === user.class_key ||
                m.recipient === user.admission_number
            ).sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at));
        } catch (e) {
            allMessages = [];
        }
        renderList();
    }

    function renderList() {
        const filter = document.getElementById('message-filter').value;
        const readIds = JSON.parse(localStorage.getItem('student-read-msgs') || '[]');

        let msgs = currentFolder === 'starred'
            ? allMessages.filter(m => starred.includes(m.id))
            : allMessages;

        if (filter === 'unread') msgs = msgs.filter(m => !readIds.includes(m.id));
        if (filter === 'teacher') msgs = msgs.filter(m => m.sender_role === 'teacher' || m.sender_role === 'coordinator');
        if (filter === 'admin') msgs = msgs.filter(m => m.sender_role === 'admin' || m.sender_role === 'headteacher');

        const unread = allMessages.filter(m => !readIds.includes(m.id)).length;
        const badge = document.getElementById('unread-badge');
        if (unread > 0) { badge.textContent = unread; badge.style.display = 'inline-block'; }
        else { badge.style.display = 'none'; }

        const list = document.getElementById('message-list');

        if (!msgs.length) {
            list.innerHTML = `<div style="text-align:center;padding:30px 16px;color:#aaa;font-size:0.85rem">
                <i class="fas fa-inbox" style="font-size:2rem;display:block;margin-bottom:8px;opacity:0.3"></i>
                ${currentFolder === 'starred' ? 'No starred messages' : 'No messages yet'}
            </div>`;
            return;
        }

        list.innerHTML = msgs.map(m => {
            const isRead = readIds.includes(m.id);
            const isStarred = starred.includes(m.id);
            const date = formatDate(m.sent_at);
            return `
            <div class="msg-item" data-id="${m.id}" style="
                padding:12px 16px;cursor:pointer;border-bottom:1px solid #f0f0f0;
                background:${isRead ? '#fff' : '#f0f4ff'};
                transition:background 0.15s
            ">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
                    <span style="font-weight:${isRead ? '500' : '700'};font-size:0.85rem;color:#333;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:160px">
                        ${escHtml(m.sender_name || 'School')}
                    </span>
                    <span style="font-size:0.72rem;color:#aaa;flex-shrink:0;margin-left:6px">${date}</span>
                </div>
                <div style="font-size:0.82rem;font-weight:${isRead ? '400' : '600'};color:#444;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                    ${escHtml(m.subject || '(No subject)')}
                </div>
                <div style="font-size:0.78rem;color:#999;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px">
                    ${escHtml((m.body || '').substring(0, 60))}${(m.body || '').length > 60 ? '…' : ''}
                </div>
                ${!isRead ? '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#5c6bc0;margin-top:4px"></span>' : ''}
            </div>`;
        }).join('');

        list.querySelectorAll('.msg-item').forEach(item => {
            item.addEventListener('mouseenter', () => { if (!item.style.background.includes('f0f4ff')) item.style.background = '#f9f9f9'; });
            item.addEventListener('mouseleave', () => {
                const readIds = JSON.parse(localStorage.getItem('student-read-msgs') || '[]');
                item.style.background = readIds.includes(item.dataset.id) ? '#fff' : '#f0f4ff';
            });
            item.addEventListener('click', () => openMessage(item.dataset.id));
        });
    }

    function openMessage(id) {
        const msg = allMessages.find(m => m.id === id);
        if (!msg) return;

        // Mark as read
        const readIds = JSON.parse(localStorage.getItem('student-read-msgs') || '[]');
        if (!readIds.includes(id)) { readIds.push(id); localStorage.setItem('student-read-msgs', JSON.stringify(readIds)); }

        const isStarred = starred.includes(id);
        const view = document.getElementById('message-view');
        view.innerHTML = `
            <div style="padding:28px;height:100%;overflow-y:auto;box-sizing:border-box">
                <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:20px;gap:12px">
                    <h2 style="margin:0;font-size:1.1rem;color:#1a237e;font-weight:700;line-height:1.3">${escHtml(msg.subject || '(No subject)')}</h2>
                    <button id="star-btn" title="${isStarred ? 'Unstar' : 'Star'}" style="background:none;border:none;cursor:pointer;font-size:1.3rem;color:${isStarred ? '#f59e0b' : '#ccc'};flex-shrink:0">
                        <i class="fas fa-star"></i>
                    </button>
                </div>

                <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid #eee">
                    <div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#5c6bc0,#3949ab);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:0.9rem;flex-shrink:0">
                        ${(msg.sender_name || 'S').split(' ').map(w => w[0]).join('').substring(0,2).toUpperCase()}
                    </div>
                    <div>
                        <div style="font-weight:600;font-size:0.9rem;color:#333">${escHtml(msg.sender_name || 'School')}</div>
                        <div style="font-size:0.78rem;color:#999">${escHtml(msg.sender_role ? capitalize(msg.sender_role) : 'Staff')} &bull; ${formatDateFull(msg.sent_at)}</div>
                    </div>
                </div>

                <div style="font-size:0.92rem;color:#333;line-height:1.8;white-space:pre-wrap">${escHtml(msg.body || '')}</div>
            </div>`;

        document.getElementById('star-btn').addEventListener('click', function () {
            if (starred.includes(id)) {
                starred = starred.filter(s => s !== id);
                this.style.color = '#ccc';
                this.title = 'Star';
            } else {
                starred.push(id);
                this.style.color = '#f59e0b';
                this.title = 'Unstar';
            }
            localStorage.setItem('student-starred-msgs', JSON.stringify(starred));
            renderList();
        });

        renderList(); // refresh to update read state
    }

    function formatDate(iso) {
        if (!iso) return '';
        const d = new Date(iso);
        const now = new Date();
        if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    }

    function formatDateFull(iso) {
        if (!iso) return '';
        return new Date(iso).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    function escHtml(str) {
        return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    function capitalize(str) { return str.charAt(0).toUpperCase() + str.slice(1); }
});
