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
    
    // Update teacher/admin information
    updateTeacherInfo(currentUser);
    
    // Initialize sidebar toggle functionality
    initSidebarToggle();
    
    // Initialize YouTube event videos
    initEventVideos();
    
    // Initialize document downloads
    initDocumentDownloads();
    
    // Navigation functionality - Updated to handle real page navigation
    initNavigation();
    
    // Initialize notification bell functionality
    initNotificationBell();
    
    // Initialize announcement creation
    initAnnouncementCreation();
    
    // Initialize class action buttons
    initClassActionButtons();
    
    // Initialize task management
    initTaskManagement();
    
    // Initialize schedule management
    initScheduleManagement();
});

// Update date display
function updateDateDisplay() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', options);
    
    const currentDateElements = document.querySelectorAll('#current-date');
    currentDateElements.forEach(element => {
        element.textContent = dateString;
    });
}

// Update teacher information
function updateTeacherInfo(currentUser) {
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
}

// Initialize sidebar toggle for mobile
function initSidebarToggle() {
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
}

// Initialize YouTube event videos
function initEventVideos() {
    const prevButton = document.getElementById('prev-video');
    const nextButton = document.getElementById('next-video');
    const videoFrame = document.getElementById('event-video');
    const videoTitle = document.getElementById('video-title');
    
    // Sample video data - would normally come from a database or API
    const videos = [
        { id: 'placeholder1', title: 'Annual Sports Day Highlights' },
        { id: 'placeholder2', title: 'School Cultural Festival' },
        { id: 'placeholder3', title: 'Science Fair Projects' },
        { id: 'placeholder4', title: 'Graduation Ceremony' }
    ];
    
    let currentVideoIndex = 0;
    
    // Function to update the video
    function updateVideo() {
        if (videoFrame && videoTitle) {
            videoFrame.src = `https://www.youtube.com/embed/${videos[currentVideoIndex].id}`;
            videoTitle.textContent = videos[currentVideoIndex].title;
        }
    }
    
    // Initialize with first video
    updateVideo();
    
    // Add event listeners for navigation buttons
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            currentVideoIndex = (currentVideoIndex - 1 + videos.length) % videos.length;
            updateVideo();
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            currentVideoIndex = (currentVideoIndex + 1) % videos.length;
            updateVideo();
        });
    }
}

// Initialize document downloads
function initDocumentDownloads() {
    const documentItems = document.querySelectorAll('.document-item');
    
    documentItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const documentName = this.querySelector('.document-name').textContent;
            
            // This would normally trigger a download from the server
            // For now, just show a notification
            alert(`Downloading ${documentName}... This feature will be available when the system launches.`);
        });
    });
}

// Initialize navigation
function initNavigation() {
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only prevent default if it's a placeholder link
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                // Get the section name from the href
                const section = this.getAttribute('href').substring(1);
                
                // Show alert for sections that don't have dedicated pages yet
                alert(`Navigating to ${this.textContent.trim()} page. This functionality will be implemented in the future.`);
            }
            // Otherwise, let the browser handle the navigation to the actual page
        });
    });
}

// Initialize notification bell functionality
function initNotificationBell() {
    const notificationBell = document.querySelector('.notification-bell');
    
    if (notificationBell) {
        notificationBell.addEventListener('click', function() {
            alert('Notifications feature will be implemented in the future.');
        });
    }
}

// Initialize announcement creation
function initAnnouncementCreation() {
    const createAnnouncementBtn = document.querySelector('.btn-create-announcement');
    
    if (createAnnouncementBtn) {
        createAnnouncementBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Create announcement feature will be implemented in the future.');
        });
    }
}

// Initialize class action buttons
function initClassActionButtons() {
    const classActionButtons = document.querySelectorAll('.btn-class-action');
    
    classActionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the class name from the parent element
            const classItem = this.closest('.class-item');
            const className = classItem.querySelector('h4').textContent;
            
            // Get the action text
            const actionText = this.textContent.trim();
            
            alert(`${actionText} feature for ${className} will be implemented in the future.`);
        });
    });
}

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
