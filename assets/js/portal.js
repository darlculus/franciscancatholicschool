document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const portalTabs = document.querySelectorAll('.portal-tab');
    const loginFormElements = document.querySelectorAll('.login-form');
    
    portalTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and forms
            portalTabs.forEach(t => t.classList.remove('active'));
            loginFormElements.forEach(form => form.classList.remove('active'));
            
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
        ]
    };
    
    // Form submission (for demonstration - would connect to backend in real app)
    const formElements = document.querySelectorAll('form');
    
    formElements.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form ID to determine if it's student or teacher login
            const formId = this.closest('.login-form').id;
            const isStudent = formId === 'student-login';
            
            // Get username and password
            const userId = isStudent ? 
                document.getElementById('student-id').value : 
                document.getElementById('teacher-id').value;
                
            const password = isStudent ? 
                document.getElementById('student-password').value : 
                document.getElementById('teacher-password').value;
                
            const rememberMe = isStudent ?
                document.getElementById('student-remember').checked :
                document.getElementById('teacher-remember').checked;
            
            // Simple validation
            if (!userId || !password) {
                alert('Please enter both ID and password');
                return;
            }
            
            // Authenticate user
            if (isStudent) {
                // Find student in test database
                const student = testUsers.students.find(user => user.id === userId);
                
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
            } else {
                // Find teacher or admin in test database
                const teacher = testUsers.teachers.find(user => user.id === userId);
                const admin = testUsers.admin.find(user => user.id === userId);
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
            }
        });
    });
});