document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (!currentUser) {
        // Redirect to login page if not logged in
        window.location.href = 'portal.html';
        return;
    }
    
    // Verify this is a teacher account
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
    
    // Initialize compose modal
    initComposeModal();
    
    // Initialize folder selection
    initFolderSelection();
    
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
        element.textContent = currentUser.name;
    });
    
    teacherSubjectElements.forEach(element => {
        element.textContent = currentUser.subject || 'Mathematics Teacher';
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

// Initialize compose modal
function initComposeModal() {
    const composeModal = document.getElementById('compose-modal');
    const composeBtn = document.getElementById('compose-btn');
    const emptyComposeBtn = document.getElementById('empty-compose-btn');
    const closeModal = document.getElementById('close-modal');
    const composeForm = document.getElementById('compose-form');
    const saveDraftBtn = document.getElementById('save-draft');
    
    // Open compose modal from main button
    if (composeBtn && composeModal) {
        composeBtn.addEventListener('click', function() {
            composeModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Open compose modal from empty state button
    if (emptyComposeBtn && composeModal) {
        emptyComposeBtn.addEventListener('click', function() {
            composeModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Close compose modal
    if (closeModal && composeModal) {
        closeModal.addEventListener('click', function() {
            composeModal.style.display = 'none';
            document.body.style.overflow = '';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === composeModal) {
            composeModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    
    // File attachment functionality
    initFileUpload();
    
    // Save draft functionality
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', function() {
            alert('Draft saved successfully. You can access it from the Drafts folder when the school year begins.');
            composeModal.style.display = 'none';
            document.body.style.overflow = '';
        });
    }
    
    // Form submission
    if (composeForm) {
        composeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const messageData = {
                to: formData.get('message-to'),
                subject: formData.get('message-subject'),
                body: formData.get('message-body')
            };
            
            // In a real application, you would send this data to the server
            console.log('Message sent:', messageData);
            
            // Show success message
            alert('Your message has been sent successfully.');
            
            // Close modal and reset form
            composeModal.style.display = 'none';
            document.body.style.overflow = '';
            composeForm.reset();
            
            // Clear attachment list
            const attachmentList = document.getElementById('attachment-list');
            if (attachmentList) {
                attachmentList.innerHTML = '';
            }
        });
    }
}

// Initialize file upload
function initFileUpload() {
    const fileUpload = document.getElementById('message-attachment');
    const attachmentList = document.getElementById('attachment-list');
    const fileUploadArea = document.querySelector('.file-upload-area');
    
    if (!fileUpload || !attachmentList || !fileUploadArea) return;
    
    // Handle file selection
    fileUpload.addEventListener('change', function() {
        handleFiles(this.files);
    });
    
    // Handle drag and drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        fileUploadArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        fileUploadArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        fileUploadArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        fileUploadArea.classList.add('dragover');
    }
    
    function unhighlight() {
        fileUploadArea.classList.remove('dragover');
    }
    
    fileUploadArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }
    
    function handleFiles(files) {
        attachmentList.innerHTML = '';
        
        if (files.length === 0) return;
        
        Array.from(files).forEach(file => {
            const attachmentItem = document.createElement('div');
            attachmentItem.className = 'attachment-item';
            
            // Determine file icon based on type
            let fileIcon = 'fa-file';
            if (file.type.includes('image')) {
                fileIcon = 'fa-file-image';
            } else if (file.type.includes('pdf')) {
                fileIcon = 'fa-file-pdf';
            } else if (file.type.includes('word')) {
                fileIcon = 'fa-file-word';
            } else if (file.type.includes('excel') || file.type.includes('sheet')) {
                fileIcon = 'fa-file-excel';
            }
            
            attachmentItem.innerHTML = `
                <i class="fas ${fileIcon}"></i>
                <span class="attachment-name">${file.name}</span>
                <span class="attachment-size">${formatFileSize(file.size)}</span>
                <button type="button" class="remove-attachment">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            attachmentList.appendChild(attachmentItem);
        });
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-attachment').forEach(button => {
            button.addEventListener('click', function() {
                this.closest('.attachment-item').remove();
            });
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

// Initialize folder selection
function initFolderSelection() {
    const folderItems = document.querySelectorAll('.folder-item');
    
    folderItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all folders
            folderItems.forEach(folder => folder.classList.remove('active'));
            
            // Add active class to clicked folder
            this.classList.add('active');
            
            // In a real application, you would load messages for the selected folder
            // For this demo, we'll just show the empty state
            showEmptyState(this.querySelector('span').textContent);
        });
    });
}

// Show empty state with customized message
function showEmptyState(folderName) {
    const messagesContent = document.querySelector('.messages-content');
    
    if (messagesContent) {
        let emptyMessage = 'Your inbox is empty. Messages from students, parents, and staff will appear here once the school year begins.';
        
        if (folderName === 'Sent') {
            emptyMessage = 'You haven\'t sent any messages yet. Sent messages will appear here.';
        } else if (folderName === 'Starred') {
            emptyMessage = 'You haven\'t starred any messages yet. Starred messages will appear here.';
        } else if (folderName === 'Drafts') {
            emptyMessage = 'You don\'t have any draft messages. Saved drafts will appear here.';
        } else if (folderName === 'Trash') {
            emptyMessage = 'Your trash is empty. Deleted messages will appear here.';
        }
        
        messagesContent.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-envelope-open"></i>
                </div>
                <h3>No Messages Yet</h3>
                <p>${emptyMessage}</p>
                <p class="empty-subtext">You can still compose messages to the administrative staff if you have any questions before the school year starts.</p>
                <button id="empty-compose-btn" class="compose-button">
                    <i class="fas fa-pen"></i> Compose a Message
                </button>
            </div>
        `;
        
        // Re-initialize the compose button in the empty state
        const emptyComposeBtn = document.getElementById('empty-compose-btn');
        const composeModal = document.getElementById('compose-modal');
        
        if (emptyComposeBtn && composeModal) {
            emptyComposeBtn.addEventListener('click', function() {
                composeModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            });
        }
    }
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
