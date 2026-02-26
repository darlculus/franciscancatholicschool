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
    
    // Authentication will now use the backend API
    
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
            
            // Real authentication using backend API
            const authenticateUser = async () => {
                try {
                    const role = isStudent ? 'student' : isTeacher ? 'teacher' : isBursar ? 'bursar' : 'admin';
                    
                    const user = await window.api.login(userId, password, role);
                    
                    const storage = rememberMe ? localStorage : sessionStorage;
                    storage.setItem('currentUser', JSON.stringify(user));
                    
                    // Store auth token with same preference as user data
                    window.api.setToken(window.api.token, rememberMe);
                    
                    // Redirect based on role
                    switch (user.role) {
                        case 'student':
                            window.location.href = 'student-dashboard.html';
                            break;
                        case 'teacher':
                        case 'coordinator':
                            window.location.href = 'teacher-dashboard.html';
                            break;
                        case 'admin':
                        case 'headteacher':
                            window.location.href = 'admin-dashboard.html';
                            break;
                        case 'bursar':
                            window.location.href = 'bursar-dashboard.html';
                            break;
                        default:
                            alert('Unknown user role');
                    }
                    
                } catch (error) {
                    console.error('Authentication error:', error);
                    alert('Invalid credentials. Please try again.');
                }
            };
            
            authenticateUser();
        });
    });
    
    // Check if user is already logged in (but not if they just logged out)
    const justLoggedOut = sessionStorage.getItem('justLoggedOut');
    if (justLoggedOut) {
        sessionStorage.removeItem('justLoggedOut');
        return; // Don't auto-redirect if user just logged out
    }
    
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser') || '{}');
    if (currentUser.role) {
        // Redirect to appropriate dashboard if already logged in
        switch (currentUser.role) {
            case 'student':
                window.location.href = 'student-dashboard.html';
                break;
            case 'teacher':
            case 'coordinator':
                window.location.href = 'teacher-dashboard.html';
                break;
            case 'admin':
            case 'headteacher':
                window.location.href = 'admin-dashboard.html';
                break;
            case 'bursar':
                window.location.href = 'bursar-dashboard.html';
                break;
        }
    }
});