document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (!currentUser) {
        // Redirect to login page if not logged in
        window.location.href = 'portal.html';
        return;
    }
    
    // Verify this is a student account
    if (currentUser.role !== 'student') {
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
    
    // Update student information
    const studentNameElements = document.querySelectorAll('#student-name, #welcome-name');
    const studentGradeElements = document.querySelectorAll('#student-grade');
    
    studentNameElements.forEach(element => {
        element.textContent = currentUser.name;
    });
    
    studentGradeElements.forEach(element => {
        element.textContent = currentUser.grade;
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
        const isClickInsideSidebar = dashboardSidebar && dashboardSidebar.contains(event.target);
        const isClickOnToggle = sidebarToggle && sidebarToggle.contains(event.target);
        
        if (!isClickInsideSidebar && !isClickOnToggle && window.innerWidth < 768 && dashboardSidebar && dashboardSidebar.classList.contains('active')) {
            dashboardSidebar.classList.remove('active');
            dashboardContainer.classList.remove('sidebar-open');
        }
    });
    
    // Initialize new functionality
    initVideoSection();
    initChecklistFunctionality();
    initResumptionCountdown();
    initNewsletterFunctionality();
    initQuickLinks();
    initSearchFunctionality();
    
    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (confirm('Are you sure you want to logout?')) {
                // Clear user data from storage
                localStorage.removeItem('currentUser');
                sessionStorage.removeItem('currentUser');
                
                // Redirect to login page
                window.location.href = 'portal.html';
            }
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
                
                // Handle specific navigation
                const target = this.getAttribute('href').substring(1);
                handleNavigation(target);
            }
        });
    });
    
    // Notification bell functionality
    const notificationBell = document.querySelector('.notification-bell');
    
    if (notificationBell) {
        notificationBell.addEventListener('click', function() {
            showNotification('You have 5 new notifications!', 'info');
        });
    }
});

// Initialize video section functionality
function initVideoSection() {
    const videoItems = document.querySelectorAll('.video-item');
    
    videoItems.forEach(item => {
        item.addEventListener('click', function() {
            const videoTitle = this.querySelector('h4').textContent;
            const videoSubject = this.querySelector('.video-subject').textContent;
            
            // Create a simple modal for video playback (placeholder)
            showVideoModal(videoTitle, videoSubject);
        });
    });
}

// Initialize checklist functionality
function initChecklistFunctionality() {
    const checklistItems = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    const progressBar = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    function updateProgress() {
        const totalItems = checklistItems.length;
        const checkedItems = document.querySelectorAll('.checklist-item input[type="checkbox"]:checked').length;
        const percentage = (checkedItems / totalItems) * 100;
        
        if (progressBar) {
            progressBar.style.width = percentage + '%';
        }
        
        if (progressText) {
            progressText.textContent = `${checkedItems} of ${totalItems} completed`;
        }
        
        // Save progress to localStorage
        const checklistProgress = {};
        checklistItems.forEach(item => {
            checklistProgress[item.id] = item.checked;
        });
        localStorage.setItem('studentChecklistProgress', JSON.stringify(checklistProgress));
        
        // Show completion message
        if (checkedItems === totalItems) {
            setTimeout(() => {
                showNotification('Congratulations! You\'re ready for school resumption!', 'success');
            }, 500);
        }
    }
    
    // Load saved progress
    const savedProgress = localStorage.getItem('studentChecklistProgress');
    if (savedProgress) {
        try {
            const progress = JSON.parse(savedProgress);
            checklistItems.forEach(item => {
                if (progress[item.id] !== undefined) {
                    item.checked = progress[item.id];
                }
            });
        } catch (error) {
            console.error('Error loading checklist progress:', error);
        }
    }
    
    // Add event listeners
    checklistItems.forEach(item => {
        item.addEventListener('change', function() {
            updateProgress();
            
            // Add visual feedback
            const label = this.nextElementSibling;
            if (this.checked) {
                label.style.transition = 'all 0.3s ease';
                setTimeout(() => {
                    label.style.opacity = '0.7';
                }, 100);
            } else {
                label.style.opacity = '1';
            }
        });
    });
    
    // Initial progress update
    updateProgress();
}

// Initialize countdown to resumption
function initResumptionCountdown() {
    // Set resumption date (you can modify this date)
    const resumptionDate = new Date('2024-01-15T08:00:00');
    const countdownElement = document.querySelector('.stat-card h3');
    
    function updateCountdown() {
        const now = new Date();
        const timeDiff = resumptionDate - now;
        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        
        if (countdownElement) {
            if (daysLeft > 0) {
                countdownElement.textContent = daysLeft;
            } else if (daysLeft === 0) {
                countdownElement.textContent = 'Today!';
                countdownElement.style.color = '#4caf50';
            } else {
                countdownElement.textContent = 'Started!';
                countdownElement.style.color = '#2196f3';
            }
        }
    }
    
    updateCountdown();
    // Update every hour
    setInterval(updateCountdown, 3600000);
}

// Initialize newsletter functionality
function initNewsletterFunctionality() {
    const newsletterItems = document.querySelectorAll('.newsletter-item');
    const viewAllLink = document.querySelector('.newsletter-preview .view-all');
    
    newsletterItems.forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('h4').textContent;
            const content = this.querySelector('p').textContent;
            showNewsletterModal(title, content);
        });
        
        // Add hover effect
        item.style.cursor = 'pointer';
    });
    
    if (viewAllLink) {
        viewAllLink.addEventListener('click', function(e) {
            e.preventDefault();
            showFullNewsletter();
        });
    }
}

// Initialize quick links functionality
function initQuickLinks() {
    const quickLinks = document.querySelectorAll('.quick-link');
    
    quickLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const linkText = this.querySelector('span').textContent;
            const href = this.getAttribute('href').substring(1);
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'translateY(-3px)';
            }, 150);
            
            handleNavigation(href, linkText);
        });
    });
}

// Initialize search functionality
function initSearchFunctionality() {
    const searchInput = document.querySelector('.header-search input');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            if (searchTerm.length > 2) {
                // Simulate search results
                console.log('Searching for:', searchTerm);
                // In a real implementation, this would search through assignments, videos, etc.
            }
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = this.value.trim();
                if (searchTerm) {
                    showNotification(`Searching for "${searchTerm}"...`, 'info');
                }
            }
        });
    }
}

// Handle navigation to different sections
function handleNavigation(target, linkText = '') {
    const messages = {
        'assignments': 'Holiday Assignments section will be available soon.',
        'videos': 'Learning Videos section - Educational content coming soon!',
        'newsletter': 'Full Newsletter will be displayed here.',
        'timetable': 'New academic session timetable will be published soon.',
        'resources': 'Study materials and resources will be available here.',
        'messages': 'Messages and communications section.',
        'grades': 'Grades from previous term will be available here.',
        'attendance': 'Attendance records will be shown here.',
        'settings': 'Account settings and preferences.'
    };
    
    const message = messages[target] || `${linkText || target} section will be implemented soon.`;
    showNotification(message, 'info');
}

// Show video modal (placeholder implementation)
function showVideoModal(title, subject) {
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="video-placeholder">
                        <i class="fab fa-youtube"></i>
                        <p>Video: ${title}</p>
                        <p>Subject: ${subject}</p>
                        <p>This video will be available when the learning platform is fully implemented.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.close-modal');
    const overlay = modal.querySelector('.modal-overlay');
    
    closeBtn.addEventListener('click', () => modal.remove());
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) modal.remove();
    });
    
    // Add modal styles
    addModalStyles();
}

// Show newsletter modal
function showNewsletterModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'newsletter-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <p>${content}</p>
                    <div class="newsletter-actions">
                        <button class="btn-primary">Read More</button>
                        <button class="btn-secondary">Share</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.close-modal');
    const overlay = modal.querySelector('.modal-overlay');
    
    closeBtn.addEventListener('click', () => modal.remove());
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) modal.remove();
    });
    
    addModalStyles();
}

// Show full newsletter
function showFullNewsletter() {
    showNotification('Full newsletter feature will be implemented soon!', 'info');
}

// Add modal styles dynamically
function addModalStyles() {
    if (!document.getElementById('modal-styles')) {
        const styles = document.createElement('style');
        styles.id = 'modal-styles';
        styles.textContent = `
            .video-modal, .newsletter-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1000;
            }
            
            .modal-overlay {
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            
            .modal-content {
                background: white;
                border-radius: 10px;
                max-width: 500px;
                width: 100%;
                max-height: 80vh;
                overflow-y: auto;
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid #eee;
            }
            
            .modal-header h3 {
                margin: 0;
                color: var(--primary);
            }
            
            .close-modal {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #999;
            }
            
            .modal-body {
                padding: 20px;
            }
            
            .video-placeholder {
                text-align: center;
                padding: 40px 20px;
                background-color: #f8f9fa;
                border-radius: 8px;
            }
            
            .video-placeholder i {
                font-size: 48px;
                color: #ff0000;
                margin-bottom: 15px;
            }
            
            .newsletter-actions {
                margin-top: 20px;
                display: flex;
                gap: 10px;
                justify-content: center;
            }
            
            .btn-primary {
                background-color: var(--primary);
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 0.9rem;
            }
            
            .btn-secondary {
                background-color: var(--medium-gray);
                color: var(--text-dark);
                border: none;
                padding: 8px 16px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 0.9rem;
            }
        `;
        document.head.appendChild(styles);
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Add notification styles if not already added
    if (!document.getElementById('notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                padding: 15px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-width: 300px;
                max-width: 400px;
                z-index: 1001;
                animation: slideIn 0.3s ease;
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .notification-info { border-left: 4px solid #2196f3; }
            .notification-success { border-left: 4px solid #4caf50; }
            .notification-warning { border-left: 4px solid #ff9800; }
            .notification-error { border-left: 4px solid #f44336; }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: #999;
                margin-left: 10px;
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Close notification
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => notification.remove());
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Get notification icon based on type
function getNotificationIcon(type) {
    const icons = {
        'info': 'info-circle',
        'success': 'check-circle',
        'warning': 'exclamation-triangle',
        'error': 'times-circle'
    };
    return icons[type] || 'info-circle';
}

// Utility functions for data management
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

function getFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
    }
}

// Assignment management functions
function loadAssignments() {
    const assignments = getFromLocalStorage('studentAssignments') || [
        {
            id: 1,
            title: 'Mathematics - Fractions Exercise',
            description: 'Complete exercises 1-10 on page 45',
            subject: 'Mathematics',
            dueDate: '2024-01-16',
            priority: 'high',
            completed: false
        },
        {
            id: 2,
            title: 'Science - Plant Life Cycle',
            description: 'Draw and label the stages of plant growth',
            subject: 'Science',
            dueDate: '2024-01-18',
            priority: 'medium',
            completed: false
        },
        {
            id: 3,
            title: 'English - Book Report',
            description: 'Write a 2-page report on "The Lion, the Witch and the Wardrobe"',
            subject: 'English',
            dueDate: '2024-01-22',
            priority: 'medium',
            completed: false
        }
    ];
    
    return assignments;
}

function updateAssignmentStatus(assignmentId, completed) {
    const assignments = loadAssignments();
    const assignment = assignments.find(a => a.id === assignmentId);
    if (assignment) {
        assignment.completed = completed;
        saveToLocalStorage('studentAssignments', assignments);
        showNotification(
            completed ? 'Assignment marked as completed!' : 'Assignment marked as pending',
            completed ? 'success' : 'info'
        );
    }
}

// Grade management functions
function loadGrades() {
    const grades = getFromLocalStorage('studentGrades') || [
        {
            id: 1,
            subject: 'Mathematics',
            assessment: 'Quiz',
            topic: 'Multiplication and Division',
            score: 92,
            maxScore: 100,
            date: '2023-12-15'
        },
        {
            id: 2,
            subject: 'English',
            assessment: 'Spelling Test',
            topic: 'Weekly vocabulary',
            score: 85,
            maxScore: 100,
            date: '2023-12-14'
        },
        {
            id: 3,
            subject: 'Science',
            assessment: 'Project',
            topic: 'Solar System Model',
            score: 95,
            maxScore: 100,
            date: '2023-12-13'
        }
    ];
    
    return grades;
}

function calculateAverageGrade() {
    const grades = loadGrades();
    if (grades.length === 0) return 0;
    
    const totalPercentage = grades.reduce((sum, grade) => {
        return sum + (grade.score / grade.maxScore) * 100;
    }, 0);
    
    return Math.round(totalPercentage / grades.length);
}

// Attendance management functions
function loadAttendance() {
    const attendance = getFromLocalStorage('studentAttendance') || {
        totalDays: 100,
        presentDays: 95,
        absentDays: 5,
        lateArrivals: 2
    };
    
    return attendance;
}

function calculateAttendanceRate() {
    const attendance = loadAttendance();
    return Math.round((attendance.presentDays / attendance.totalDays) * 100);
}

// Update dashboard statistics
function updateDashboardStats() {
    // Update assignments count
    const assignments = loadAssignments();
    const pendingAssignments = assignments.filter(a => !a.completed).length;
    const assignmentCountElement = document.querySelector('.stat-card h3');
    if (assignmentCountElement) {
        assignmentCountElement.textContent = pendingAssignments;
    }
    
    // Update average grade
    const averageGrade = calculateAverageGrade();
    const gradeElements = document.querySelectorAll('.stat-card h3');
    if (gradeElements[1]) {
        gradeElements[1].textContent = averageGrade + '%';
    }
    
    // Update attendance rate
    const attendanceRate = calculateAttendanceRate();
    if (gradeElements[2]) {
        gradeElements[2].textContent = attendanceRate + '%';
    }
}

// Theme management
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            showNotification(`Switched to ${newTheme} theme`, 'info');
        });
    }
}

// Performance tracking
function trackPagePerformance() {
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log(`Page loaded in ${Math.round(loadTime)}ms`);
        
        // Track user interactions
        let interactionCount = 0;
        document.addEventListener('click', function() {
            interactionCount++;
        });
        
        // Save session data
        const sessionData = {
            loginTime: new Date().toISOString(),
            loadTime: Math.round(loadTime),
            interactions: interactionCount
        };
        
        saveToLocalStorage('currentSession', sessionData);
    });
}

// Error handling
function setupErrorHandling() {
    window.addEventListener('error', function(event) {
        console.error('JavaScript error:', event.error);
        showNotification('An error occurred. Please refresh the page.', 'error');
    });
    
    window.addEventListener('unhandledrejection', function(event) {
        console.error('Unhandled promise rejection:', event.reason);
        showNotification('A network error occurred. Please check your connection.', 'warning');
    });
}

// Initialize all dashboard features
function initializeDashboard() {
    updateDashboardStats();
    initThemeToggle();
    trackPagePerformance();
    setupErrorHandling();
    
    // Show welcome message
    setTimeout(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
        if (currentUser) {
            showNotification(`Welcome back, ${currentUser.name}!`, 'success');
        }
    }, 1000);
}

// Call initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // ... existing DOMContentLoaded code ...
    initializeDashboard();
});

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + K for search
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        const searchInput = document.querySelector('.header-search input');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Escape to close modals
    if (event.key === 'Escape') {
        const modals = document.querySelectorAll('.video-modal, .newsletter-modal');
        modals.forEach(modal => modal.remove());
    }
});

// Auto-save functionality for forms
function setupAutoSave() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                saveToLocalStorage(`form_${form.id}`, data);
            });
        });
    });
}

// Network status monitoring
function monitorNetworkStatus() {
    function updateNetworkStatus() {
        if (navigator.onLine) {
            showNotification('Connection restored', 'success');
        } else {
            showNotification('No internet connection', 'warning');
        }
    }
    
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    setupAutoSave();
    monitorNetworkStatus();
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showNotification,
        loadAssignments,
        updateAssignmentStatus,
        calculateAverageGrade,
        calculateAttendanceRate
    };
}