document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const portalTabs = document.querySelectorAll('.portal-tab');
    const loginFormElements = document.querySelectorAll('.login-form');
    const portalContent = document.querySelector('.portal-content');

    const handleTabActivation = (tabElement) => {
        portalTabs.forEach(t => t.classList.remove('active'));
        loginFormElements.forEach(form => form.classList.remove('active'));

        tabElement.classList.add('active');
        const targetForm = document.getElementById(tabElement.dataset.target);
        if (targetForm) {
            targetForm.classList.add('active');
            if (portalContent) {
                portalContent.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    };
    
    portalTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            handleTabActivation(this);
        });
    });
    
    // Support keyboard navigation
    portalTabs.forEach(tab => {
        tab.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleTabActivation(this);
            }
        });
    });
    
    // Password visibility toggle
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            // Toggle password visibility
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
            {
                id: 'BUR001',
                password: 'bursar123',
                name: 'Sr. Clare Ohagwa, OSF',
                role: 'bursar',
                contact: 'bursar@franciscancatholicschool.edu.ng'
            }
        ]
    };
    
    // Form submission (for demonstration - would connect to backend in real app)
    const formElements = document.querySelectorAll('form');
    
    formElements.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formElement = this.closest('.login-form');
            const formId = formElement.id;
            const isStudent = formId === 'student-login';
            const isTeacher = formId === 'teacher-login';
            const isBursar = formId === 'bursar-login';
            
            let userId = '';
            let password = '';
            let rememberMe = false;
            
            if (isStudent) {
                userId = document.getElementById('student-id').value.trim();
                password = document.getElementById('student-password').value;
                rememberMe = document.getElementById('student-remember').checked;
            } else if (isTeacher) {
                userId = document.getElementById('teacher-id').value.trim();
                password = document.getElementById('teacher-password').value;
                rememberMe = document.getElementById('teacher-remember').checked;
            } else if (isBursar) {
                userId = document.getElementById('bursar-id').value.trim();
                password = document.getElementById('bursar-password').value;
                rememberMe = document.getElementById('bursar-remember').checked;
            }
            
            if (!userId || !password) {
                alert('Please enter both ID and password');
                return;
            }
            
            const authenticateStudent = () => {
                const student = testUsers.students.find(user => user.id === userId);
                if (student && student.password === password) {
                    const storage = rememberMe ? localStorage : sessionStorage;
                    storage.setItem('currentUser', JSON.stringify({
                        id: student.id,
                        name: student.name,
                        grade: student.grade,
                        role: student.role
                    }));
                    window.location.href = 'student-dashboard.html';
                } else {
                    alert('Invalid student ID or password. Please try again.');
                }
            };
            
            const authenticateTeacherOrAdmin = () => {
                const teacher = testUsers.teachers.find(user => user.id === userId);
                const admin = testUsers.admin.find(user => user.id === userId);
                const user = teacher || admin;
                
                if (user && user.password === password) {
                    const storage = rememberMe ? localStorage : sessionStorage;
                    storage.setItem('currentUser', JSON.stringify({
                        id: user.id,
                        name: user.name,
                        role: user.role,
                        ...(user.role === 'teacher' ? { subject: user.subject } : { position: user.position })
                    }));
                    
                    if (user.role === 'teacher') {
                        window.location.href = 'teacher-dashboard.html';
                    } else {
                        window.location.href = 'admin-dashboard.html';
                    }
                } else {
                    alert('Invalid staff ID or password. Please try again.');
                }
            };
            
            const authenticateBursar = () => {
                const bursar = testUsers.bursar.find(user => user.id === userId);
                if (bursar && bursar.password === password) {
                    const storage = rememberMe ? localStorage : sessionStorage;
                    storage.setItem('currentUser', JSON.stringify({
                        id: bursar.id,
                        name: bursar.name,
                        role: bursar.role,
                        contact: bursar.contact
                    }));
                    window.location.href = 'bursar-dashboard.html';
                } else {
                    alert('Invalid bursar credentials. Kindly try again.');
                }
            };
            
            if (isStudent) {
                authenticateStudent();
            } else if (isTeacher) {
                authenticateTeacherOrAdmin();
            } else if (isBursar) {
                authenticateBursar();
            }
        });
    });
});