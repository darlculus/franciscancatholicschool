// Shared utilities for all student portal pages

function setStudentAvatar(el, currentUser, initials) {
    if (!el) return;
    if (currentUser.photo_url) {
        el.style.background = 'none';
        el.style.padding = '0';
        el.innerHTML = `<img src="${currentUser.photo_url}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block">`;
    } else {
        el.textContent = initials || 'S';
    }
}

async function openStudentReportCard(currentUser) {
    const studentId = currentUser.student_id;
    const classKey = currentUser.class_key;

    if (!studentId) {
        showStudentNotification('Student record not found. Please contact the school office.', 'error');
        return;
    }

    try {
        const res = await fetch('/api/students');
        const data = await res.json();
        const student = (data.students || []).find(s => s.id === studentId);

        if (!student) {
            showStudentNotification('Student record not found. Please contact the school office.', 'error');
            return;
        }

        if (!student.result_published) {
            showStudentNotification('Your report card has not been published yet. Please check back later.', 'info');
            return;
        }

        const term = encodeURIComponent('2nd Term');
        const session = encodeURIComponent('2025/2026');
        window.open(`report-card.html?id=${student.id}&class_key=${classKey || student.class_key}&term=${term}&session=${session}`, '_blank');
    } catch (e) {
        showStudentNotification('Could not load report card. Please try again.', 'error');
    }
}

function showStudentNotification(message, type = 'info') {
    let n = document.querySelector('.notification');
    if (!n) { n = document.createElement('div'); document.body.appendChild(n); }
    n.textContent = message;
    n.className = `notification notification-${type} show`;
    setTimeout(() => n.classList.remove('show'), 4000);
}
