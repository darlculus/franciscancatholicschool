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
    
    // Form submission (for demonstration - would connect to backend in real app)
    const formElements = document.querySelectorAll('form');
    
    formElements.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form ID to determine if it's student or teacher login
            const formId = this.closest('.login-form').id;
            const isStudent = formId === 'student-login';
            
            // Get username and password
            const username = isStudent ? 
                document.getElementById('student-id').value : 
                document.getElementById('teacher-id').value;
                
            const password = isStudent ? 
                document.getElementById('student-password').value : 
                document.getElementById('teacher-password').value;
            
            // Simple validation
            if (!username || !password) {
                alert('Please enter both ID and password');
                return;
            }
            
            // In a real application, you would send this data to a server for authentication
            // For demonstration, just show an alert
            alert(`${isStudent ? 'Student' : 'Teacher'} login attempt with ID: ${username}`);
            
            // Redirect to appropriate dashboard (in a real app)
            // window.location.href = isStudent ? 'student-dashboard.html' : 'teacher-dashboard.html';
        });
    });
});