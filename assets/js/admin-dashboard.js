document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (!currentUser) {
        // Redirect to login page if not logged in
        window.location.href = 'portal.html';
        return;
    }
    
    // Verify this is an admin account
    if (currentUser.role !== 'admin') {
        alert('You are not authorized to access this page.');
        window.location.href = 'portal.html';
        return;
    }
    
    // Set current date
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', options);
    
    const currentDateElement = document.getElementById('current-date');
    if (currentDateElement) {
        currentDateElement.querySelector('span').textContent = dateString;
    }
    
    // Update admin information
    const adminNameElements = document.querySelectorAll('#admin-name, #welcome-name');
    const adminPositionElements = document.querySelectorAll('#admin-position');
    
    adminNameElements.forEach(element => {
        if (currentUser.name) {
            element.textContent = currentUser.name;
        }
    });
    
    adminPositionElements.forEach(element => {
        if (currentUser.position) {
            element.textContent = currentUser.position;
        }
    });
    
    // Mobile sidebar toggle
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
    
    // Add hover effects to chart bars
    const chartBars = document.querySelectorAll('.chart-bar');
    chartBars.forEach(bar => {
        bar.addEventListener('mouseenter', function() {
            this.style.opacity = '0.8';
            const value = this.querySelector('.bar-value');
            if (value) {
                value.style.visibility = 'visible';
            }
        });
        
        bar.addEventListener('mouseleave', function() {
            this.style.opacity = '1';
            const value = this.querySelector('.bar-value');
            if (value) {
                value.style.visibility = 'hidden';
            }
        });
    });
    
    // Action buttons functionality
    const actionButtons = document.querySelectorAll('.btn-staff-action, .btn-student-action, .btn-event-action, .btn-finance-action, .btn-add-event, .btn-create-announcement, .announcement-actions a, .view-all');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            alert(`${this.textContent.trim()} feature will be implemented in the future.`);
        });
    });
    
    // Add animation to the welcome banner
    const welcomeBanner = document.querySelector('.welcome-banner');
    
    if (welcomeBanner) {
        welcomeBanner.classList.add('animate');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            welcomeBanner.classList.remove('animate');
        }, 1000);
    }
});
