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
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', options);
    
    const currentDateElements = document.querySelectorAll('#current-date');
    currentDateElements.forEach(element => {
        element.textContent = dateString;
    });
    
    // Update teacher/admin information
    const teacherNameElements = document.querySelectorAll('#teacher-name, #welcome-name');
    const teacherSubjectElements = document.querySelectorAll('#teacher-subject');
    
    teacherNameElements.forEach(element => {
        element.textContent = currentUser.name;
    });
    
    teacherSubjectElements.forEach(element => {
        if (currentUser.role === 'teacher') {
            element.textContent = currentUser.subject || 'Subject Teacher';
        } else {
            element.textContent = currentUser.position;
        }
    });
    
    // Mobile sidebar toggle functionality
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const dashboardSidebar = document.querySelector('.dashboard-sidebar');
    const dashboardContainer = document.querySelector('.dashboard-container');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            dashboardSidebar.classList.toggle('active');
            dashboardContainer.classList.toggle('sidebar-open');
        });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        const isClickInsideSidebar = dashboardSidebar.contains(event.target);
        const isClickOnToggle = sidebarToggle.contains(event.target);
        
        if (!isClickInsideSidebar && !isClickOnToggle && window.innerWidth < 768 && dashboardSidebar.classList.contains('active')) {
            dashboardSidebar.classList.remove('active');
            dashboardContainer.classList.remove('sidebar-open');
        }
    });
    
    // Logout functionality
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
    
    // Navigation functionality
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only prevent default if it's a placeholder link
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                // Remove active class from all links
                navLinks.forEach(l => l.parentElement.classList.remove('active'));
                
                // Add active class to clicked link
                this.parentElement.classList.add('active');
                
                // Here you would typically load the corresponding content
                // For now, we'll just show an alert
                alert(`Navigating to ${this.textContent.trim()} page. This functionality will be implemented in the future.`);
            }
        });
    });
    
    // Notification bell functionality
    const notificationBell = document.querySelector('.notification-bell');
    
    if (notificationBell) {
        notificationBell.addEventListener('click', function() {
            alert('Notifications feature will be implemented in the future.');
        });
    }
    
    // Create announcement button (for teacher dashboard)
    const createAnnouncementBtn = document.querySelector('.btn-create-announcement');
    
    if (createAnnouncementBtn) {
        createAnnouncementBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Create announcement feature will be implemented in the future.');
        });
    }
    
    // Class action buttons (for teacher dashboard)
    const classActionButtons = document.querySelectorAll('.btn-class-action');
    
    classActionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            alert(`${this.textContent.trim()} feature will be implemented in the future.`);
        });
    });
});
