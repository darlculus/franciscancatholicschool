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
    
    // Initialize tab switching
    initTabSwitching();
    
    // Initialize modals
    initModals();
    
    // Initialize file upload
    initFileUpload();
    
    // Initialize leave duration calculation
    initLeaveDurationCalculation();
    
    // Initialize calendar
    initCalendar();
    
    // Initialize logout functionality
    initLogout();
    
    // Initialize create application buttons
    initCreateApplicationButtons();
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
function updateTeacherInfo(user) {
    const teacherNameElements = document.querySelectorAll('#teacher-name');
    const teacherSubjectElements = document.querySelectorAll('#teacher-subject');
    
    teacherNameElements.forEach(element => {
        element.textContent = user.name || 'Teacher Name';
    });
    
    teacherSubjectElements.forEach(element => {
        element.textContent = user.subject || 'Mathematics Teacher';
    });
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

// Initialize tab switching
function initTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding tab pane
            const tabId = this.getAttribute('data-tab');
            const tabPane = document.getElementById(`${tabId}-tab`);
            if (tabPane) {
                tabPane.classList.add('active');
            }
        });
    });
}

// Initialize modals
function initModals() {
    // Leave application modal
    const newLeaveBtn = document.getElementById('new-leave-btn');
    const leaveModal = document.getElementById('leave-modal');
    const closeLeaveModal = document.getElementById('close-leave-modal');
    const cancelLeave = document.getElementById('cancel-leave');
    
    if (newLeaveBtn && leaveModal) {
        newLeaveBtn.addEventListener('click', function() {
            leaveModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeLeaveModal && leaveModal) {
        closeLeaveModal.addEventListener('click', function() {
            leaveModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    if (cancelLeave && leaveModal) {
        cancelLeave.addEventListener('click', function() {
            leaveModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Calendar modal
    const viewCalendarBtn = document.getElementById('view-calendar-btn');
    const calendarModal = document.getElementById('calendar-modal');
    const closeCalendarModal = document.getElementById('close-calendar-modal');
    
    if (viewCalendarBtn && calendarModal) {
        viewCalendarBtn.addEventListener('click', function() {
            calendarModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeCalendarModal && calendarModal) {
        closeCalendarModal.addEventListener('click', function() {
            calendarModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === leaveModal) {
            leaveModal.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        if (event.target === calendarModal) {
            calendarModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Initialize file upload
function initFileUpload() {
    const fileUpload = document.getElementById('document-upload');
    const fileList = document.getElementById('file-list');
    const uploadArea = document.querySelector('.file-upload-area');
    
    if (!fileUpload || !fileList || !uploadArea) return;
    
    // Handle file selection
    fileUpload.addEventListener('change', function() {
        handleFiles(this.files);
    });
    
    // Handle drag and drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        uploadArea.classList.add('dragover');
    }
    
    function unhighlight() {
        uploadArea.classList.remove('dragover');
    }
    
    uploadArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }
    
    function handleFiles(files) {
        fileList.innerHTML = '';
        
        if (files.length === 0) return;
        
        Array.from(files).forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            
            const fileIcon = document.createElement('i');
            fileIcon.className = 'fas fa-file file-icon';
            
            const fileName = document.createElement('span');
            fileName.className = 'file-name';
            fileName.textContent = file.name;
            
            const fileSize = document.createElement('span');
            fileSize.className = 'file-size';
            fileSize.textContent = formatFileSize(file.size);
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'file-remove';
            removeBtn.innerHTML = '<i class="fas fa-times"></i>';
            removeBtn.addEventListener('click', function() {
                fileItem.remove();
            });
            
            fileItem.appendChild(fileIcon);
            fileItem.appendChild(fileName);
            fileItem.appendChild(fileSize);
            fileItem.appendChild(removeBtn);
            
            fileList.appendChild(fileItem);
        });
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Initialize leave duration calculation
function initLeaveDurationCalculation() {
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const durationDisplay = document.getElementById('leave-duration');
    
    if (!startDateInput || !endDateInput || !durationDisplay) return;
    
    function calculateDuration() {
        const startDate = new Date(startDateInput.value);        const endDate = new Date(endDateInput.value);
        
        // Check if dates are valid
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            durationElement.textContent = '0';
            return;
        }
        
        // Check if end date is before start date
        if (endDate < startDate) {
            durationElement.textContent = '0';
            endDateInput.setCustomValidity('End date cannot be before start date');
            return;
        } else {
            endDateInput.setCustomValidity('');
        }
        
        // Calculate business days (excluding weekends)
        let duration = 0;
        let currentDate = new Date(startDate);
        
        while (currentDate <= endDate) {
            // Skip weekends (0 = Sunday, 6 = Saturday)
            const dayOfWeek = currentDate.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                duration++;
            }
            
            // Move to next day
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        durationElement.textContent = duration;
    }
    
    // Event listeners
    startDateInput.addEventListener('change', calculateDuration);
    endDateInput.addEventListener('change', calculateDuration);
}

// Initialize leave application actions
function initLeaveApplicationActions() {
    const editButtons = document.querySelectorAll('.btn-edit-application');
    const cancelButtons = document.querySelectorAll('.btn-cancel-application');
    
    // Edit application
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            // In a real app, this would open the leave modal with pre-filled data
            // For this demo, we'll just show an alert
            alert('This feature would allow you to edit your leave application.');
        });
    });
    
    // Cancel application
    cancelButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (confirm('Are you sure you want to cancel this leave application?')) {
                // In a real app, this would send a request to the server
                // For this demo, we'll just show an alert
                alert('Your leave application has been cancelled.');
                
                // Remove the application card (in a real app, this would be done after server confirmation)
                const card = this.closest('.leave-application-card');
                if (card) {
                    card.remove();
                    
                    // Check if there are any applications left
                    const activeTab = document.querySelector('.tab-pane.active');
                    if (activeTab && !activeTab.querySelector('.leave-application-card')) {
                        // Show empty state
                        const emptyState = activeTab.querySelector('.empty-state');
                        if (emptyState) {
                            emptyState.style.display = 'flex';
                        }
                    }
                }
            }
        });
    });
}

// Initialize logout functionality
function initLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear user data
            localStorage.removeItem('currentUser');
            sessionStorage.removeItem('currentUser');
            
            // Redirect to login page
            window.location.href = 'portal.html';
        });
    }
}