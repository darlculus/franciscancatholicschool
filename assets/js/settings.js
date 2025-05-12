document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
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
    
    // Profile picture upload functionality
    const profilePicture = document.getElementById('profile-image');
    const uploadBtn = document.getElementById('upload-picture-btn');
    const removeBtn = document.getElementById('remove-picture-btn');
    const fileInput = document.getElementById('profile-picture-upload');
    const navProfileImage = document.getElementById('nav-profile-image');
    
    // Open file dialog when upload button is clicked
    uploadBtn.addEventListener('click', function() {
        fileInput.click();
    });
    
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
                navProfileImage.src = e.target.result;
                
                // Save to localStorage for persistence
                localStorage.setItem('adminProfilePicture', e.target.result);
                
                // Show success message
                alert('Profile picture updated successfully!');
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    // Remove profile picture
    removeBtn.addEventListener('click', function() {
        // Reset to default avatar
        profilePicture.src = 'assets/images/admin-avatar.png';
        navProfileImage.src = 'assets/images/admin-avatar.png';
        
        // Remove from localStorage
        localStorage.removeItem('adminProfilePicture');
        
        // Reset file input
        fileInput.value = '';
        
        // Show success message
        alert('Profile picture removed.');
    });
    
    // Load profile picture from localStorage if available
    const savedProfilePicture = localStorage.getItem('adminProfilePicture');
    if (savedProfilePicture) {
        profilePicture.src = savedProfilePicture;
        navProfileImage.src = savedProfilePicture;
    }
    
    // Profile form submission
    const profileForm = document.getElementById('profile-form');
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const fullName = document.getElementById('admin-fullname').value;
        const title = document.getElementById('admin-title').value;
        const email = document.getElementById('admin-email').value;
        const phone = document.getElementById('admin-phone').value;
        const bio = document.getElementById('admin-bio').value;
        
        // Save to localStorage
        const adminProfile = {
            fullName,
            title,
            email,
            phone,
            bio
        };
        
        localStorage.setItem('adminProfile', JSON.stringify(adminProfile));
        
        // Update displayed name in navbar and welcome section
        document.getElementById('admin-name').textContent = fullName;
        
        // Show success message
        alert('Profile updated successfully!');
    });
    
    // Load profile data from localStorage if available
    const savedProfile = localStorage.getItem('adminProfile');
    if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        document.getElementById('admin-fullname').value = profile.fullName || '';
        document.getElementById('admin-title').value = profile.title || '';
        document.getElementById('admin-email').value = profile.email || '';
        document.getElementById('admin-phone').value = profile.phone || '';
        document.getElementById('admin-bio').value = profile.bio || '';
        
        // Update displayed name
        document.getElementById('admin-name').textContent = profile.fullName || 'Admin User';
    }
    
    // Account form submission (password change)
    const accountForm = document.getElementById('account-form');
    accountForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Simple validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('Please fill in all password fields.');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            alert('New password and confirmation do not match.');
            return;
        }
        
        // Password strength validation
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            alert('Password does not meet the requirements. Please ensure it has at least 8 characters, one uppercase letter, one number, and one special character.');
            return;
        }
        
        // In a real application, you would verify the current password and update with the new one
        // For this demo, we'll just show a success message
        alert('Password updated successfully!');
        
        // Reset form
        accountForm.reset();
    });
    
    // Notifications form submission
    const notificationsForm = document.getElementById('notifications-form');
    notificationsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get all toggle states
        const toggles = notificationsForm.querySelectorAll('input[type="checkbox"]');
        const notificationSettings = {};
        
        toggles.forEach((toggle, index) => {
            notificationSettings[`setting${index}`] = toggle.checked;
        });
        
        // Save to localStorage
        localStorage.setItem('adminNotifications', JSON.stringify(notificationSettings));
        
        // Show success message
        alert('Notification preferences saved successfully!');
    });
    
    // Load notification settings from localStorage if available
    const savedNotifications = localStorage.getItem('adminNotifications');
    if (savedNotifications) {
        const settings = JSON.parse(savedNotifications);
        const toggles = notificationsForm.querySelectorAll('input[type="checkbox"]');
        
        toggles.forEach((toggle, index) => {
            if (settings[`setting${index}`] !== undefined) {
                toggle.checked = settings[`setting${index}`];
            }
        });
    }
    
   
    
    // Logout functionality (same as in admin-dashboard.js)
    const logoutBtn = document.getElementById('logout-btn');
    
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Clear any authentication tokens/session data from localStorage
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        
        // Show logout message
        alert('You have been successfully logged out.');
        
        // Redirect to portal page
        window.location.href = 'portal.html';
    });
    
    // Display current date in the top navigation
    const currentDateElement = document.getElementById('current-date');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    currentDateElement.textContent = today.toLocaleDateString('en-US', options);
    
    // Mobile sidebar toggle
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const dashboardContainer = document.querySelector('.dashboard-container');
    
    sidebarToggle.addEventListener('click', function() {
        dashboardContainer.classList.toggle('sidebar-collapsed');
    });
});