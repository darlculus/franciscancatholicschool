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
    
    // Initialize compose message functionality
    initComposeMessage();
    
    // Initialize folder navigation
    initFolderNavigation();
    
    // Initialize message filter
    initMessageFilter();
    
    // Initialize file upload
    initFileUpload();
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
    const teacherNameElements = document.querySelectorAll('#teacher-name');
    const teacherSubjectElements = document.querySelectorAll('#teacher-subject');
    
    teacherNameElements.forEach(element => {
        element.textContent = currentUser.name || 'Teacher Name';
    });
    
    teacherSubjectElements.forEach(element => {
        element.textContent = currentUser.subject || 'Subject Teacher';
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
        const isClickInsideSidebar = sidebar.contains(event.target);
        const isClickOnToggle = sidebarToggle.contains(event.target);
        
        if (!isClickInsideSidebar && !isClickOnToggle && window.innerWidth <= 768) {
            sidebar.classList.remove('active');
        }
    });
}

// Initialize compose message functionality
function initComposeMessage() {
    const composeBtn = document.getElementById('compose-btn');
    const composeEmptyBtn = document.getElementById('compose-empty-btn');
    const composeModal = document.getElementById('compose-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const composeForm = document.getElementById('compose-form');
    const saveDraftBtn = document.getElementById('save-draft-btn');
    const discardBtn = document.getElementById('discard-btn');
    
    // Open compose modal
    function openComposeModal() {
        composeModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Close compose modal
    function closeComposeModal() {
        composeModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Event listeners for opening modal
    if (composeBtn) {
        composeBtn.addEventListener('click', openComposeModal);
    }
    
    if (composeEmptyBtn) {
        composeEmptyBtn.addEventListener('click', openComposeModal);
    }
    
    // Event listener for closing modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeComposeModal);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === composeModal) {
            closeComposeModal();
        }
    });
    
    // Escape key to close modal
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && composeModal.classList.contains('active')) {
            closeComposeModal();
        }
    });
    
    // Handle form submission
    if (composeForm) {
        composeForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form data
            const recipients = Array.from(document.getElementById('message-to').selectedOptions).map(option => option.value);
            const subject = document.getElementById('message-subject').value;
            const body = document.getElementById('message-body').value;
            
            // Validate form
            if (recipients.length === 0) {
                alert('Please select at least one recipient.');
                return;
            }
            
            if (!subject) {
                alert('Please enter a subject for your message.');
                return;
            }
            
            if (!body) {
                alert('Please enter a message body.');
                return;
            }
            
            // Since the school hasn't resumed yet, we'll just show a confirmation
            alert('Your message has been saved and will be sent when the school year begins.');
            
            // Reset form and close modal
            composeForm.reset();
            closeComposeModal();
        });
    }
    
    // Save draft functionality
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', function() {
            const recipients = Array.from(document.getElementById('message-to').selectedOptions).map(option => option.value);
            const subject = document.getElementById('message-subject').value;
            const body = document.getElementById('message-body').value;
            
            // Check if there's anything to save
            if (!recipients.length && !subject && !body) {
                alert('There is nothing to save as draft.');
                return;
            }
            
            // Save draft (in a real app, this would save to localStorage or server)
            alert('Your draft has been saved.');
            
            // Close modal
            closeComposeModal();
        });
    }
    
    // Discard message functionality
    if (discardBtn) {
        discardBtn.addEventListener('click', function() {
            const recipients = Array.from(document.getElementById('message-to').selectedOptions).map(option => option.value);
            const subject = document.getElementById('message-subject').value;
            const body = document.getElementById('message-body').value;
            
            // Check if there's anything to discard
            if (!recipients.length && !subject && !body) {
                closeComposeModal();
                return;
            }
            
            // Confirm before discarding
            if (confirm('Are you sure you want to discard this message?')) {
                composeForm.reset();
                closeComposeModal();
            }
        });
    }
}

// Initialize folder navigation
function initFolderNavigation() {
    const folderLinks = document.querySelectorAll('.messages-folders li a');
    
    folderLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            
            // Remove active class from all folder links
            folderLinks.forEach(item => {
                item.parentElement.classList.remove('active');
            });
            
            // Add active class to clicked folder link
            this.parentElement.classList.add('active');
            
            // In a real application, this would load messages from the selected folder
            // Since the school hasn't resumed yet, we'll just show the empty state
        });
    });
}

// Initialize message filter
function initMessageFilter() {
    const messageFilter = document.getElementById('message-filter');
    
    if (messageFilter) {
        messageFilter.addEventListener('change', function() {
            const selectedFilter = this.value;
            console.log(`Filter changed to: ${selectedFilter}`);
            
            // In a real application, this would filter the messages based on the selected option
            // Since the school hasn't resumed yet, we'll just log the selected filter
        });
    }
}

// Initialize file upload
function initFileUpload() {
    const fileUploadBtn = document.getElementById('file-upload-btn');
    const fileUploadInput = document.getElementById('file-upload');
    const fileInfo = document.querySelector('.file-info');
    
    if (fileUploadBtn && fileUploadInput) {
        fileUploadBtn.addEventListener('click', function() {
            fileUploadInput.click();
        });
        
        fileUploadInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                const fileCount = this.files.length;
                const fileSize = Array.from(this.files).reduce((total, file) => total + file.size, 0);
                const fileSizeFormatted = formatFileSize(fileSize);
                
                fileInfo.textContent = `${fileCount} file${fileCount !== 1 ? 's' : ''} selected (${fileSizeFormatted})`;
            } else {
                fileInfo.textContent = 'No files selected';
            }
        });
    }
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}