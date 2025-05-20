/**
 * Resources JavaScript
 * Franciscan Catholic Nursery & Primary School
 */

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
    
    // Initialize resource navigation
    initResourceNavigation();
    
    // Initialize view options
    initViewOptions();
    
    // Initialize filter dropdown
    initFilterDropdown();
    
    // Initialize upload modal
    initUploadModal();
    
    // Initialize folder modal
    initFolderModal();
    
    // Initialize templates modal
    initTemplatesModal();
    
    // Initialize drag and drop upload
    initDragAndDrop();
    
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
    const teacherNameElement = document.getElementById('teacher-name');
    const teacherSubjectElement = document.getElementById('teacher-subject');
    
    if (teacherNameElement) {
        teacherNameElement.textContent = currentUser.name || 'Teacher Name';
    }
    
    if (teacherSubjectElement) {
        teacherSubjectElement.textContent = currentUser.subject || 'Subject Teacher';
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
        if (sidebar && sidebarToggle) {
            const isClickInsideSidebar = sidebar.contains(event.target);
            const isClickOnToggle = sidebarToggle.contains(event.target);
            
            if (!isClickInsideSidebar && !isClickOnToggle && window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        }
    });
}

// Initialize resource navigation
function initResourceNavigation() {
    const navLinks = document.querySelectorAll('.resources-navigation li a, .resources-categories li a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            
            // Remove active class from all navigation links
            document.querySelectorAll('.resources-navigation li').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to parent li of clicked link
            this.closest('li').classList.add('active');
            
            // Update breadcrumb
            const linkText = this.querySelector('span').textContent;
            updateBreadcrumb(linkText);
            
            // Since the school hasn't resumed yet, we'll just show the empty state
            // In a real application, this would load resources based on the selected category
        });
    });
}

// Update breadcrumb
function updateBreadcrumb(category) {
    const breadcrumbList = document.querySelector('.resources-breadcrumb ul');
    
    if (breadcrumbList) {
        // Clear existing breadcrumb items except home
        while (breadcrumbList.children.length > 1) {
            breadcrumbList.removeChild(breadcrumbList.lastChild);
        }
        
        // Add new category to breadcrumb
        const newItem = document.createElement('li');
        const newLink = document.createElement('a');
        newLink.href = '#';
        newLink.textContent = category;
        newItem.appendChild(newLink);
        breadcrumbList.appendChild(newItem);
    }
}

// Initialize view options
function initViewOptions() {
    const viewOptions = document.querySelectorAll('.view-option');
    
    viewOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all view options
            viewOptions.forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Get view type
            const viewType = this.getAttribute('data-view');
            
            // In a real application, this would change the view of resources
            console.log(`View changed to: ${viewType}`);
        });
    });
}

// Initialize filter dropdown
function initFilterDropdown() {
    const filterBtn = document.getElementById('filter-btn');
    const filterMenu = document.getElementById('filter-menu');
    
    if (filterBtn && filterMenu) {
        filterBtn.addEventListener('click', function(event) {
            event.stopPropagation();
            filterMenu.classList.toggle('active');
        });
        
        // Close filter menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!filterMenu.contains(event.target) && !filterBtn.contains(event.target)) {
                filterMenu.classList.remove('active');
            }
        });
        
        // Apply filter button
        const applyFilterBtn = document.querySelector('.btn-apply-filter');
        if (applyFilterBtn) {
            applyFilterBtn.addEventListener('click', function() {
                // Get selected filters
                const selectedFileTypes = Array.from(document.querySelectorAll('.filter-group:nth-child(1) input:checked')).map(input => input.value);
                const selectedDates = Array.from(document.querySelectorAll('.filter-group:nth-child(2) input:checked')).map(input => input.value);
                
                console.log('Selected file types:', selectedFileTypes);
                console.log('Selected dates:', selectedDates);
                
                // In a real application, this would filter resources based on selections
                
                // Close filter menu
                filterMenu.classList.remove('active');
            });
        }
        
        // Clear filter button
        const clearFilterBtn = document.querySelector('.btn-clear-filter');
        if (clearFilterBtn) {
            clearFilterBtn.addEventListener('click', function() {
                // Uncheck all filter checkboxes
                document.querySelectorAll('.filter-checkbox input').forEach(checkbox => {
                    checkbox.checked = false;
                });
            });
        }
    }
}

// Initialize upload modal
function initUploadModal() {
    const uploadBtn = document.getElementById('upload-btn');
    const uploadEmptyBtn = document.getElementById('upload-empty-btn');
    const uploadModal = document.getElementById('upload-modal');
    const closeUploadModal = document.getElementById('close-upload-modal');
    const cancelUpload = document.getElementById('cancel-upload');
    const browseFilesBtn = document.getElementById('browse-files-btn');
    const fileUpload = document.getElementById('file-upload');
    const uploadForm = document.getElementById('upload-form');
    
    // Open upload modal
    function openUploadModal() {
        if (uploadModal) {
            uploadModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    // Close upload modal
    function closeUploadModalFunc() {
        if (uploadModal) {
            uploadModal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Reset form
            if (uploadForm) {
                uploadForm.reset();
            }
            
            // Clear file list
            const fileList = document.getElementById('file-list');
            if (fileList) {
                fileList.innerHTML = '';
            }
            
            // Hide upload preview
            const uploadPreview = document.getElementById('upload-preview');
            if (uploadPreview) {
                uploadPreview.classList.remove('active');
            }
        }
    }
    
    // Event listeners for opening modal
    if (uploadBtn) {
        uploadBtn.addEventListener('click', openUploadModal);
    }
    
    if (uploadEmptyBtn) {
        uploadEmptyBtn.addEventListener('click', openUploadModal);
    }
    
    // Event listeners for closing modal
    if (closeUploadModal) {
        closeUploadModal.addEventListener('click', closeUploadModalFunc);
    }
    
    if (cancelUpload) {
        cancelUpload.addEventListener('click', closeUploadModalFunc);
    }
    
    // Close modal when clicking outside
    if (uploadModal) {
        uploadModal.addEventListener('click', function(event) {
            if (event.target === uploadModal) {
                closeUploadModalFunc();
            }
        });
    }
    
    // Escape key to close modal
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && uploadModal && uploadModal.classList.contains('active')) {
            closeUploadModalFunc();
        }
    });
    
    // Browse files button
    if (browseFilesBtn && fileUpload) {
        browseFilesBtn.addEventListener('click', function() {
            fileUpload.click();
        });
    }
    
    // File selection
    if (fileUpload) {
        fileUpload.addEventListener('change', function() {
            handleFileSelection(this.files);
        });
    }
    
    // Form submission
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form data
            const category = document.getElementById('resource-category').value;
            const description = document.getElementById('resource-description').value;
            const sharing = document.querySelector('input[name="sharing"]:checked').value;
            
            // Validate form
            if (!category) {
                alert('Please select a category for your resource.');
                return;
            }
            
            // Check if files are selected
            const fileList = document.getElementById('file-list');
            if (!fileList || fileList.children.length === 0) {
                alert('Please select at least one file to upload.');
                return;
            }
            
            // Since the school hasn't resumed yet, we'll just show a confirmation
            alert('Your resources have been saved and will be available when the school year begins.');
            
            // Close modal
            closeUploadModalFunc();
        });
    }
}

// Handle file selection
function handleFileSelection(files) {
    if (!files || files.length === 0) return;
    
    const fileList = document.getElementById('file-list');
    const uploadPreview = document.getElementById('upload-preview');
    
    if (fileList && uploadPreview) {
        // Clear existing file list
        fileList.innerHTML = '';
        
        // Show upload preview
        uploadPreview.classList.add('active');
        
        // Add files to list
        Array.from(files).forEach(file => {
            const fileItem = document.createElement('li');
            fileItem.className = 'file-item';
            
            // Determine file icon based on type
            let iconClass = 'fas fa-file';
            if (file.type.startsWith('image/')) {
                iconClass = 'fas fa-file-image';
            } else if (file.type.startsWith('video/')) {
                iconClass = 'fas fa-file-video';
            } else if (file.type.startsWith('audio/')) {
                iconClass = 'fas fa-file-audio';
            } else if (file.type === 'application/pdf') {
                iconClass = 'fas fa-file-pdf';
            } else if (file.type.includes('spreadsheet') || file.type.includes('excel')) {
                iconClass = 'fas fa-file-excel';
            } else if (file.type.includes('presentation') || file.type.includes('powerpoint')) {
                iconClass = 'fas fa-file-powerpoint';
            } else if (file.type.includes('document') || file.type.includes('word')) {
                iconClass = 'fas fa-file-word';
            }
            
            fileItem.innerHTML = `
                <i class="${iconClass} file-icon"></i>
                <div class="file-info">
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${formatFileSize(file.size)}</div>
                </div>
                <div class="file-actions">
                    <button type="button" class="btn-remove-file"><i class="fas fa-times"></i></button>
                </div>
            `;
            
            fileList.appendChild(fileItem);
            
            // Add remove file functionality
            const removeBtn = fileItem.querySelector('.btn-remove-file');
            if (removeBtn) {
                removeBtn.addEventListener('click', function() {
                    fileItem.remove();
                    
                    // Hide upload preview if no files left
                    if (fileList.children.length === 0) {
                        uploadPreview.classList.remove('active');
                    }
                });
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

// Initialize folder modal
function initFolderModal() {
    const createFolderBtn = document.getElementById('create-folder-btn');
    const folderModal = document.getElementById('folder-modal');
    const closeFolderModal = document.getElementById('close-folder-modal');
    const cancelFolder = document.getElementById('cancel-folder');
    const folderForm = document.getElementById('folder-form');
    
    // Open folder modal
    function openFolderModal() {
        if (folderModal) {
            folderModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    // Close folder modal
    function closeFolderModalFunc() {
        if (folderModal) {
            folderModal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Reset form
            if (folderForm) {
                folderForm.reset();
            }
        }
    }
    
    // Event listener for opening modal
    if (createFolderBtn) {
        createFolderBtn.addEventListener('click', openFolderModal);
    }
    
    // Event listeners for closing modal
    if (closeFolderModal) {
        closeFolderModal.addEventListener('click', closeFolderModalFunc);
    }
    
    if (cancelFolder) {
        cancelFolder.addEventListener('click', closeFolderModalFunc);
    }
    
    // Close modal when clicking outside
    if (folderModal) {
        folderModal.addEventListener('click', function(event) {
            if (event.target === folderModal) {
                closeFolderModalFunc();
            }
        });
    }
    
    // Escape key to close modal
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && folderModal && folderModal.classList.contains('active')) {
            closeFolderModalFunc();
        }
    });
    
    // Form submission
    if (folderForm) {
        folderForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form data
            const folderName = document.getElementById('folder-name').value;
            const folderDescription = document.getElementById('folder-description').value;
            const folderColor = document.querySelector('input[name="folder-color"]:checked').value;
            
            // Validate form
            if (!folderName) {
                alert('Please enter a folder name.');
                return;
            }
            
            // Since the school hasn't resumed yet, we'll just show a confirmation
            alert(`Folder "${folderName}" has been created and will be available when the school year begins.`);
            
            // Close modal
            closeFolderModalFunc();
        });
    }
}

// Initialize templates modal
function initTemplatesModal() {
    const exploreTemplatesBtn = document.getElementById('explore-templates-btn');
    const templatesModal = document.getElementById('templates-modal');
    const closeTemplatesModal = document.getElementById('close-templates-modal');
    
    // Open templates modal
    function openTemplatesModal() {
        if (templatesModal) {
            templatesModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    // Close templates modal
    function closeTemplatesModalFunc() {
        if (templatesModal) {
            templatesModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    // Event listener for opening modal
    if (exploreTemplatesBtn) {
        exploreTemplatesBtn.addEventListener('click', openTemplatesModal);
    }
    
    // Event listener for closing modal
    if (closeTemplatesModal) {
        closeTemplatesModal.addEventListener('click', closeTemplatesModalFunc);
    }
    
    // Close modal when clicking outside
    if (templatesModal) {
        templatesModal.addEventListener('click', function(event) {
            if (event.target === templatesModal) {
                closeTemplatesModalFunc();
            }
        });
    }
    
    // Escape key to close modal
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && templatesModal && templatesModal.classList.contains('active')) {
            closeTemplatesModalFunc();
        }
    });
    
    // Template category filtering
    const templateCategories = document.querySelectorAll('.template-category');
    const templateCards = document.querySelectorAll('.template-card');
    
    templateCategories.forEach(category => {
        category.addEventListener('click', function() {
            // Remove active class from all categories
            templateCategories.forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to clicked category
            this.classList.add('active');
            
            // Get category value
            const categoryValue = this.getAttribute('data-category');
            
            // Filter template cards
            templateCards.forEach(card => {
                if (categoryValue === 'all' || card.getAttribute('data-category') === categoryValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Template usage
    const useTemplateButtons = document.querySelectorAll('.btn-use-template');
    
    useTemplateButtons.forEach(button => {
        button.addEventListener('click', function() {
            const templateName = this.closest('.template-card').querySelector('h3').textContent;
            
            // Since the school hasn't resumed yet, we'll just show a confirmation
            alert(`Template "${templateName}" will be available for use when the school year begins.`);
            
            // Close modal
            closeTemplatesModalFunc();
        });
    });
}

// Initialize drag and drop upload
function initDragAndDrop() {
    const uploadArea = document.querySelector('.upload-area');
    
    if (uploadArea) {
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });
        
        // Highlight drop area when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, highlight, false);
        });
        
        // Remove highlight when item is dragged out or dropped
        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, unhighlight, false);
        });
        
        // Handle dropped files
        uploadArea.addEventListener('drop', handleDrop, false);
    }
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function highlight() {
        uploadArea.classList.add('dragover');
    }
    
    function unhighlight() {
        uploadArea.classList.remove('dragover');
    }
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        handleFileSelection(files);
    }
}

// Initialize logout functionality
function initLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Clear user data from storage
            localStorage.removeItem('currentUser');
            sessionStorage.removeItem('currentUser');
            
            // Redirect to login page
            window.location.href = 'portal.html';
        });
    }
}

// Generate random resource data (for demonstration purposes)
function generateRandomResources() {
    const resourceTypes = ['document', 'image', 'video', 'audio', 'pdf', 'spreadsheet', 'presentation'];
    const categories = ['Lesson Plans', 'Worksheets', 'Assessments', 'Presentations', 'Images', 'Videos', 'Audio'];
    const subjects = ['Mathematics', 'English', 'Science', 'Social Studies', 'Art', 'Music', 'Physical Education'];
    const fileExtensions = {
        document: ['doc', 'docx', 'txt'],
        image: ['jpg', 'png', 'gif'],
        video: ['mp4', 'mov', 'avi'],
        audio: ['mp3', 'wav', 'ogg'],
        pdf: ['pdf'],
        spreadsheet: ['xls', 'xlsx', 'csv'],
        presentation: ['ppt', 'pptx']
    };
    
    const resources = [];
    
    // Generate 20 random resources
    for (let i = 0; i < 20; i++) {
        const type = resourceTypes[Math.floor(Math.random() * resourceTypes.length)];
        const category = categories[Math.floor(Math.random() * categories.length)];
        const subject = subjects[Math.floor(Math.random() * subjects.length)];
        const extension = fileExtensions[type][Math.floor(Math.random() * fileExtensions[type].length)];
        
        const resource = {
            id: i + 1,
            name: `${category} - ${subject} ${i + 1}.${extension}`,
            type: type,
            category: category,
            subject: subject,
            size: Math.floor(Math.random() * 10000000) + 100000, // Random size between 100KB and 10MB
            dateCreated: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000), // Random date within the last 30 days
            createdBy: 'Current Teacher',
            shared: Math.random() > 0.5
        };
        
        resources.push(resource);
    }
    
    return resources;
}

// Get random student names (for demonstration purposes)
function getRandomStudentNames(count) {
    const firstNames = ['John', 'Mary', 'David', 'Sarah', 'Michael', 'Emma', 'James', 'Olivia', 'Daniel', 'Sophia', 'Matthew', 'Ava', 'Joseph', 'Isabella', 'Andrew', 'Mia', 'William', 'Charlotte', 'Alexander', 'Amelia'];
    
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson'];
    
    const names = [];
    
    for (let i = 0; i < count; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        names.push(`${firstName} ${lastName}`);
    }
    
    return names;
}

// Get random class name (for demonstration purposes)
function getRandomClassName() {
    const classes = ['Nursery 1', 'Nursery 2', 'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6'];
    return classes[Math.floor(Math.random() * classes.length)];
}