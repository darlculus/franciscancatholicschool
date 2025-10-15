document.addEventListener('DOMContentLoaded', function() {
    // Mobile sidebar toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const sidebar = document.querySelector('.dashboard-sidebar');

    // Avoid double-toggling on pages with their own sidebar logic (e.g., bursar dashboard)
    if (!isBursarPage && mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768 &&
            sidebar &&
            sidebar.classList.contains('active') &&
            !sidebar.contains(event.target) &&
            event.target !== mobileToggle) {
            sidebar.classList.remove('active');
            if (dashboardContainer) {
                dashboardContainer.classList.remove('sidebar-open');
            }
            if (mobileToggle) {
                mobileToggle.classList.remove('active');
            }
        }
    });

    // Tab switching functionality
    const portalTabs = document.querySelectorAll('.portal-tab');
    const loginForms = document.querySelectorAll('.login-form');

    portalTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and forms
            portalTabs.forEach(t => t.classList.remove('active'));
            loginForms.forEach(form => form.classList.remove('active'));

            // Add active class to clicked tab
            this.classList.add('active');

            // Show corresponding form
            const targetForm = document.getElementById(this.dataset.target);
            if (targetForm) {
                targetForm.classList.add('active');
            }
        });
    });

    // Password visibility toggle
    const toggleButtons = document.querySelectorAll('.toggle-password');

    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const passwordInput = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');

            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Test user database (in a real application, this would be server-side)
    const testUsers = {
        students: [
            { id: 'STU001', password: 'password123', name: 'John Doe', grade: 'Primary 5', role: 'student' },
            { id: 'STU002', password: 'password123', name: 'Jane Smith', grade: 'Primary 6', role: 'student' },
            { id: 'STU003', password: 'password123', name: 'Michael Johnson', grade: 'Primary 4', role: 'student' }
        ],
        teachers: [
            { id: 'TCH001', password: 'teacher123', name: 'Mrs. Elizabeth Brown', subject: 'Mathematics', role: 'teacher' },
            { id: 'TCH002', password: 'teacher123', name: 'Mr. Robert Wilson', subject: 'Science', role: 'teacher' },
            { id: 'TCH003', password: 'teacher123', name: 'Ms. Sarah Davis', subject: 'English', role: 'teacher' }
        ],
        admin: [
            { id: 'ADM001', password: 'admin123', name: 'Dr. James Anderson', position: 'Principal', role: 'admin' }
        ],
        bursar: [
            { id: 'BUR001', password: 'bursar123', name: 'Sr. Clare Ohagwa, OSF', role: 'bursar', contact: 'bursar@franciscancatholicschool.edu.ng' }
        ]
    };

    // Student login form submission
    const studentForm = document.querySelector('#student-login form');
    if (studentForm) {
        studentForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const studentId = document.getElementById('student-id').value;
            const password = document.getElementById('student-password').value;
            const rememberMe = document.getElementById('student-remember').checked;

            // Find student in test database
            const student = testUsers.students.find(user => user.id === studentId);

            if (student && student.password === password) {
                // Store user info in session storage or local storage based on remember me
                const storage = rememberMe ? localStorage : sessionStorage;
                storage.setItem('currentUser', JSON.stringify({
                    id: student.id,
                    name: student.name,
                    grade: student.grade,
                    role: student.role
                }));

                // Redirect to student dashboard
                window.location.href = 'student-dashboard.html';
            } else {
                alert('Invalid student ID or password. Please try again.');
            }
        });
    }

    // Teacher login form submission
    const teacherForm = document.querySelector('#teacher-login form');
    if (teacherForm) {
        teacherForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const teacherId = document.getElementById('teacher-id').value;
            const password = document.getElementById('teacher-password').value;
            const rememberMe = document.getElementById('teacher-remember').checked;

            // Find teacher in test database
            const teacher = testUsers.teachers.find(user => user.id === teacherId);

            // Also check admin (they can login through teacher portal)
            const admin = testUsers.admin.find(user => user.id === teacherId);
            const user = teacher || admin;

            if (user && user.password === password) {
                // Store user info in session storage or local storage based on remember me
                const storage = rememberMe ? localStorage : sessionStorage;
                storage.setItem('currentUser', JSON.stringify({
                    id: user.id,
                    name: user.name,
                    role: user.role,
                    ...(user.role === 'teacher' ? { subject: user.subject } : { position: user.position })
                }));

                // Redirect to appropriate dashboard
                if (user.role === 'teacher') {
                    window.location.href = 'teacher-dashboard.html';
                } else {
                    window.location.href = 'admin-dashboard.html';
                }
            } else {
                alert('Invalid staff ID or password. Please try again.');
            }
        });
    }

    // Bursar login form submission
    const bursarForm = document.querySelector('#bursar-login form');
    if (bursarForm) {
        bursarForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const bursarId = document.getElementById('bursar-id').value;
            const password = document.getElementById('bursar-password').value;
            const rememberMe = document.getElementById('bursar-remember').checked;

            // Find bursar in test database
            const bursar = testUsers.bursar.find(user => user.id === bursarId);

            if (bursar && bursar.password === password) {
                // Store user info in session storage or local storage based on remember me
                const storage = rememberMe ? localStorage : sessionStorage;
                storage.setItem('currentUser', JSON.stringify({
                    id: bursar.id,
                    name: bursar.name,
                    role: bursar.role,
                    contact: bursar.contact
                }));

                // Redirect to bursar dashboard
                window.location.href = 'bursar-dashboard.html';
            } else {
                alert('Invalid bursar credentials. Kindly try again.');
            }
        });
    }
});
