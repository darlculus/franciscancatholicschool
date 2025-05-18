document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (!currentUser) {
        // Redirect to login page if not logged in
        window.location.href = 'portal.html';
        return;
    }
    
    // Verify this is a teacher or admin account
    if (currentUser.role !== 'teacher' && currentUser.role !== 'admin') {
        alert('You are not authorized to access this page.');
        window.location.href = 'portal.html';
        return;
    }
    
    // Set current date
    updateDateDisplay();
    
    // Update teacher information
    updateTeacherInfo(currentUser);
    
    // Initialize sidebar toggle functionality
    initSidebarToggle();
    
    // Initialize settings tabs
    initSettingsTabs();
    
    // Initialize profile picture upload
    initProfilePictureUpload();
    
    // Initialize password visibility toggle
    initPasswordToggle();
    
    // Initialize password strength meter
    initPasswordStrengthMeter();
    
    // Initialize theme selection
    initThemeSelection();
    
    // Initialize form submission handlers
    initFormSubmissionHandlers();
    
    // Initialize logout functionality
    initLogout();
});

// Update date display
function updateDateDisplay() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', options);
    
    const currentDateElement = document.getElementById('current-date');
    if (currentDateElement) {
        currentDateElement.textContent = dateString;
    }
}

// Update teacher information
function updateTeacherInfo(currentUser) {
    const teacherNameElements = document.querySelectorAll('#teacher-name');
    const teacherSubjectElements = document.querySelectorAll('#teacher-subject');
    
    teacherNameElements.forEach(element => {
        element.textContent = currentUser.name || 'Teacher Name';
    });
    
    teacherSubjectElements.forEach(element => {
        element.textContent = currentUser.subject || 'Subject Teacher';
    });
    
    // Pre-fill profile form with user data if available
    if (currentUser.firstName) {
        document.getElementById('first-name').value = currentUser.firstName;
    }
    
    if (currentUser.lastName) {
        document.getElementById('last-name').value = currentUser.lastName;
    }
    
    if (currentUser.email) {
        document.getElementById('email').value = currentUser.email;
    }
    
    if (currentUser.phone) {
        document.getElementById('phone').value = currentUser.phone;
    }
    
    if (currentUser.bio) {
        document.getElementById('bio').value = currentUser.bio;
    }
    
    if (currentUser.qualifications) {
        document.getElementById('qualifications').value = currentUser.qualifications;
    }
}

// Initialize sidebar toggle functionality
function initSidebarToggle() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.dashboard-sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768 && 
            sidebar && 
            sidebar.classList.contains('active') && 
            !sidebar.contains(event.target) && 
            event.target !== sidebarToggle) {
            sidebar.classList.remove('active');
        }
    });
}

// Initialize settings tabs
function initSettingsTabs() {
    const tabLinks = document.querySelectorAll('.settings-nav li');
    const tabContents = document.querySelectorAll('.settings-tab');
    
    tabLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Remove active class from all tabs
            tabLinks.forEach(item => item.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
}

// Initialize profile picture upload
function initProfilePictureUpload() {
    const profilePicture = document.getElementById('profile-image');
    const uploadBtn = document.getElementById('upload-picture-btn');
    const removeBtn = document.getElementById('remove-picture-btn');
    const fileInput = document.getElementById('profile-picture-upload');
    
    if (uploadBtn && fileInput) {
        // Open file dialog when upload button is clicked
        uploadBtn.addEventListener('click', function() {
            fileInput.click();
        });
    }
    
    if (fileInput && profilePicture) {
        // Handle file selection
        fileInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const file = this.files[0];
                
                // Check file size (max 2MB)
                if (file.size > 2 * 1024 * 1024) {
                    alert('File size exceeds 2MB. Please choose a smaller image.');
                    return;
                }
                
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    // Update profile picture
                    profilePicture.src = e.target.result;
                };
                
                reader.readAsDataURL(file);
            }
        });
    }
    
    if (removeBtn && profilePicture) {
        // Handle remove button click
        removeBtn.addEventListener('click', function() {
            // Reset to default profile picture
            profilePicture.src = 'assets/img/team-3.jpg';
            // Clear file input
            if (fileInput) {
                fileInput.value = '';
            }
        });
    }
}

// Initialize password visibility toggle
function initPasswordToggle() {
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
}

// Initialize password strength meter
function initPasswordStrengthMeter() {
    const passwordInput = document.getElementById('new-password');
    const strengthMeter = document.querySelector('.strength-meter');
    const strengthText = document.querySelector('.strength-text');
    const strengthSegments = document.querySelectorAll('.strength-segment');
    
    if (passwordInput && strengthMeter && strengthText) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            let strength = 0;
            
            // Calculate password strength
            if (password.length >= 8) strength += 1;
            if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 1;
            if (password.match(/\d/)) strength += 1;
            if (password.match(/[^a-zA-Z\d]/)) strength += 1;
            
            // Update strength meter
            strengthSegments.forEach((segment, index) => {
                if (index < strength) {
                    segment.classList.add('active');
                } else {
                    segment.classList.remove('active');
                }
            });
            
            // Update strength text
            let strengthLabel = 'Weak';
            if (strength === 2) strengthLabel = 'Moderate';
            if (strength === 3) strengthLabel = 'Good';
            if (strength === 4) strengthLabel = 'Strong';
            
            strengthText.textContent = `Password strength: ${strengthLabel}`;
            
            // Update strength meter color
            strengthMeter.className = 'strength-meter';
            if (strength === 1) strengthMeter.classList.add('weak');
            if (strength === 2) strengthMeter.classList.add('moderate');
            if (strength === 3) strengthMeter.classList.add('good');
            if (strength === 4) strengthMeter.classList.add('strong');
        });
    }
}

// Initialize theme selection
function initThemeSelection() {
    const themeOptions = document.querySelectorAll('.theme-option');
    const colorOptions = document.querySelectorAll('.color-option');
    const layoutOptions = document.querySelectorAll('.layout-option');
    const fontSizeSlider = document.getElementById('font-size-slider');
    
    // Theme options
    if (themeOptions.length > 0) {
        themeOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove active class from all options
                themeOptions.forEach(opt => opt.classList.remove('active'));
                
                // Add active class to clicked option
                this.classList.add('active');
                
                // Apply theme (in a real implementation, this would save to localStorage and apply CSS)
                const theme = this.querySelector('span').textContent.toLowerCase();
                console.log(`Theme changed to: ${theme}`);
                
                // Example of applying theme
                if (theme === 'dark') {
                    document.body.classList.add('dark-mode');
                } else {
                    document.body.classList.remove('dark-mode');
                }
            });
        });
    }
    
    // Color options
    if (colorOptions.length > 0) {
        colorOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove active class from all options
                colorOptions.forEach(opt => opt.classList.remove('active'));
                
                // Add active class to clicked option
                this.classList.add('active');
                
                // Apply color (in a real implementation, this would save to localStorage and apply CSS)
                const color = this.querySelector('span').textContent.toLowerCase();
                const colorValue = this.style.getPropertyValue('--color');
                console.log(`Accent color changed to: ${color} (${colorValue})`);
                
                // Example of applying color
                document.documentElement.style.setProperty('--primary-color', colorValue);
            });
        });
    }
    
    // Layout options
    if (layoutOptions.length > 0) {
        layoutOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove active class from all options
                layoutOptions.forEach(opt => opt.classList.remove('active'));
                
                // Add active class to clicked option
                this.classList.add('active');
                
                // Apply layout (in a real implementation, this would save to localStorage and apply CSS)
                const layout = this.querySelector('span').textContent.toLowerCase();
                console.log(`Dashboard layout changed to: ${layout}`);
            });
        });
    }
    
    // Font size slider
    if (fontSizeSlider) {
        fontSizeSlider.addEventListener('input', function() {
            const fontSize = this.value;
            console.log(`Font size changed to: ${fontSize}`);
            
            // Example of applying font size
            const fontSizeValues = ['12px', '14px', '16px', '18px', '20px'];
            document.documentElement.style.setProperty('--base-font-size', fontSizeValues[fontSize - 1]);
        });
    }
}

// Initialize form submission handlers
function initFormSubmissionHandlers() {
    // Profile form
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                firstName: document.getElementById('first-name').value,
                lastName: document.getElementById('last-name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                bio: document.getElementById('bio').value,
                qualifications: document.getElementById('qualifications').value
            };
            
            // Validate form data
            if (!formData.firstName || !formData.lastName || !formData.email) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Get current user data
            let currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
            
            // Update user data
            currentUser = { ...currentUser, ...formData };
            
            // Save updated user data
            if (localStorage.getItem('currentUser')) {
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            } else {
                sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
            
            // Update display name
            const teacherNameElements = document.querySelectorAll('#teacher-name');
            teacherNameElements.forEach(element => {
                element.textContent = `${formData.firstName} ${formData.lastName}`;
            });
            
            alert('Profile updated successfully!');
        });
    }
    
    // Password form
    const passwordForm = document.getElementById('password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            // Validate form data
            if (!currentPassword || !newPassword || !confirmPassword) {
                alert('Please fill in all password fields.');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                alert('New password and confirm password do not match.');
                return;
            }
            
            // In a real implementation, you would verify the current password against the stored password
            // and then update the password in the database
            
            alert('Password updated successfully!');
            passwordForm.reset();
        });
    }
    
    // Teaching preferences form
    const teachingPreferencesForm = document.getElementById('teaching-preferences-form');
    if (teachingPreferencesForm) {
        teachingPreferencesForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const preferredSubjects = Array.from(document.getElementById('preferred-subjects').selectedOptions).map(option => option.value);
            const preferredClasses = Array.from(document.getElementById('preferred-classes').selectedOptions).map(option => option.value);
            const schedulePreferences = Array.from(document.querySelectorAll('input[name="schedule-preference"]:checked')).map(checkbox => checkbox.value);
            const extracurricular = Array.from(document.querySelectorAll('input[name="extracurricular"]:checked')).map(checkbox => checkbox.value);
            const teachingPhilosophy = document.getElementById('teaching-philosophy').value;
            const professionalGoals = document.getElementById('professional-goals').value;
            
            // Get current user data
            let currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
            
            // Update user data
            currentUser = { 
                ...currentUser, 
                preferredSubjects,
                preferredClasses,
                schedulePreferences,
                extracurricular,
                teachingPhilosophy,
                professionalGoals
            };
            
            // Save updated user data
            if (localStorage.getItem('currentUser')) {
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            } else {
                sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
            
            alert('Teaching preferences updated successfully!');
        });
    }
}

// Initialize logout functionality
function initLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear user data from storage
            localStorage.removeItem('currentUser');
            sessionStorage.removeItem('currentUser');
            
            // Redirect to login page
            window.location.href = 'portal.html';
        });
    }
}