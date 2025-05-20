/**
 * E-Learning Platform JavaScript
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
    
    // Update teacher information
    updateTeacherInfo(currentUser);
    
    // Initialize sidebar toggle functionality
    initSidebarToggle();
    
    // Initialize tabs
    initTabs();
    
    // Initialize modals
    initModals();
    
    // Initialize form validations
    initFormValidations();
    
    // Initialize preparation steps
    initPreparationSteps();
    
    // Initialize file uploads
    initFileUploads();
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
        if (window.innerWidth <= 768 && 
            sidebar && 
            sidebar.classList.contains('active') && 
            !sidebar.contains(event.target) && 
            event.target !== sidebarToggle) {
            sidebar.classList.remove('active');
        }
    });
}

// Initialize tabs
function initTabs() {
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
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
}

// Initialize modals
function initModals() {
    // Create Course Modal
    const createCourseBtn = document.getElementById('create-course-btn');
    const createFirstCourseBtn = document.getElementById('create-first-course-btn');
    const createCourseModal = document.getElementById('create-course-modal');
    const closeCourseModal = document.getElementById('close-course-modal');
    const cancelCourse = document.getElementById('cancel-course');
    
    // Tutorial Modal
    const viewTutorialBtn = document.getElementById('view-tutorial-btn');
    const tutorialModal = document.getElementById('tutorial-modal');
    const closeTutorialModal = document.getElementById('close-tutorial-modal');
    
    // Create Course Modal
    if (createCourseBtn && createCourseModal) {
        createCourseBtn.addEventListener('click', function() {
            createCourseModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (createFirstCourseBtn && createCourseModal) {
        createFirstCourseBtn.addEventListener('click', function() {
            createCourseModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeCourseModal && createCourseModal) {
        closeCourseModal.addEventListener('click', function() {
            createCourseModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    if (cancelCourse && createCourseModal) {
        cancelCourse.addEventListener('click', function() {
            createCourseModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Tutorial Modal
    if (viewTutorialBtn && tutorialModal) {
        viewTutorialBtn.addEventListener('click', function() {
            tutorialModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeTutorialModal && tutorialModal) {
        closeTutorialModal.addEventListener('click', function() {
            tutorialModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === createCourseModal) {
            createCourseModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        
        if (event.target === tutorialModal) {
            tutorialModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Initialize form validations
function initFormValidations() {
    const courseForm = document.getElementById('course-form');
    
    if (courseForm) {
        courseForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form values
            const courseTitle = document.getElementById('course-title').value;
            const courseDescription = document.getElementById('course-description').value;
            const courseSubject = document.getElementById('course-subject').value;
            const courseGrade = document.getElementById('course-grade').value;
            
            // Validate form
            if (!courseTitle || !courseDescription || !courseSubject || !courseGrade) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Show success message (since the school hasn't opened yet, we'll just show a message)
            alert('Course created successfully! It will be available when the school opens.');
            
            // Close modal
            document.getElementById('create-course-modal').style.display = 'none';
            document.body.style.overflow = 'auto';
            
            // Reset form
            courseForm.reset();
            
            // Update preparation steps
            updatePreparationStep(1, 20);
        });
    }
}

// Initialize preparation steps
function initPreparationSteps() {
    const stepButtons = document.querySelectorAll('.btn-step-action');
    
    stepButtons.forEach((button, index) => {
        if (!button.classList.contains('disabled')) {
            button.addEventListener('click', function() {
                // Different actions based on which step button was clicked
                switch (index) {
                    case 0: // Create Course
                        document.getElementById('create-course-modal').style.display = 'block';
                        document.body.style.overflow = 'hidden';
                        break;
                    case 1: // Upload Materials
                        alert('This feature will be fully functional when the school opens. For now, you can prepare your materials offline.');
                        updatePreparationStep(2, 10);
                        break;
                    case 2: // Create Assessment
                        alert('Assessment creation will be available when the school opens. You can start planning your assessments now.');
                        updatePreparationStep(3, 5);
                        break;
                    case 3: // Organize Content
                        alert('Content organization will be available after you create courses and upload materials.');
                        break;
                }
            });
        }
    });
}

// Update preparation step progress
function updatePreparationStep(stepIndex, progressPercentage) {
    const steps = document.querySelectorAll('.preparation-step');
    
    if (stepIndex < steps.length) {
        const progressBar = steps[stepIndex].querySelector('.progress');
        const progressText = steps[stepIndex].querySelector('.step-progress span');
        
        progressBar.style.width = `${progressPercentage}%`;
        progressText.textContent = `${progressPercentage}% Complete`;
    }
}

// Initialize file uploads
function initFileUploads() {
    const courseThumbnail = document.getElementById('course-thumbnail');
    const thumbnailPreview = document.getElementById('thumbnail-preview');
    
    if (courseThumbnail && thumbnailPreview) {
        courseThumbnail.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const file = this.files[0];
                
                // Check file size (max 2MB)
                if (file.size > 2 * 1024 * 1024) {
                    alert('File size exceeds 2MB. Please choose a smaller image.');
                    return;
                }
                
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    thumbnailPreview.innerHTML = `<img src="${e.target.result}" alt="Course Thumbnail Preview">`;
                };
                
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Initialize drag and drop for file upload areas
    const fileUploadAreas = document.querySelectorAll('.file-upload-area');
    
    fileUploadAreas.forEach(area => {
        area.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = '#4361ee';
        });
        
        area.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.borderColor = '#ced4da';
        });
        
        area.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = '#ced4da';
            
            const input = this.querySelector('input[type="file"]');
            if (input && e.dataTransfer.files.length > 0) {
                input.files = e.dataTransfer.files;
                
                // Trigger change event
                const event = new Event('change', { bubbles: true });
                input.dispatchEvent(event);
            }
        });
    });
}

// Logout functionality
document.addEventListener('DOMContentLoaded', function() {
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
});

// Handle preparation step buttons
document.addEventListener('DOMContentLoaded', function() {
    // Create Course button in preparation steps
    const createCourseStepBtn = document.querySelector('.preparation-step:nth-child(1) .btn-step-action');
    if (createCourseStepBtn) {
        createCourseStepBtn.addEventListener('click', function() {
            document.getElementById('create-course-modal').style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Upload Materials button in preparation steps
    const uploadMaterialsBtn = document.querySelector('.preparation-step:nth-child(2) .btn-step-action');
    if (uploadMaterialsBtn) {
        uploadMaterialsBtn.addEventListener('click', function() {
            // Since the school hasn't opened yet, show a message
            alert('This feature will be fully functional when the school opens. For now, you can prepare your materials offline.');
            
            // Update progress for demonstration purposes
            updatePreparationStep(1, 15);
        });
    }
    
    // Create Assessment button in preparation steps
    const createAssessmentBtn = document.querySelector('.preparation-step:nth-child(3) .btn-step-action');
    if (createAssessmentBtn) {
        createAssessmentBtn.addEventListener('click', function() {
            // Since the school hasn't opened yet, show a message
            alert('Assessment creation will be available when the school opens. You can start planning your assessments now.');
            
            // Update progress for demonstration purposes
            updatePreparationStep(2, 10);
        });
    }
    
    // Organize Content button in preparation steps
    const organizeContentBtn = document.querySelector('.preparation-step:nth-child(4) .btn-step-action');
    if (organizeContentBtn) {
        organizeContentBtn.addEventListener('click', function() {
            // Since the school hasn't opened yet, show a message
            alert('Content organization will be available after you create courses and upload materials.');
            
            // Update progress for demonstration purposes
            updatePreparationStep(3, 5);
        });
    }
});

// Handle resource card clicks
document.addEventListener('DOMContentLoaded', function() {
    const resourceCards = document.querySelectorAll('.resource-card');
    
    resourceCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get resource title
            const resourceTitle = this.querySelector('h4').textContent;
            
            // Show message since resources aren't available yet
            alert(`The "${resourceTitle}" resource will be available when the school opens. Please check back later.`);
        });
    });
});

// Handle settings form submission
document.addEventListener('DOMContentLoaded', function() {
    const settingsActions = document.querySelector('.settings-actions');
    
    if (settingsActions) {
        const saveSettingsBtn = settingsActions.querySelector('.btn-primary');
        
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', function() {
                // Since the school hasn't opened yet, show a message
                alert('Settings saved successfully! They will be applied when the e-learning platform launches.');
            });
        }
    }
});

// Handle download guide button in tutorial modal
document.addEventListener('DOMContentLoaded', function() {
    const downloadGuideBtn = document.getElementById('download-guide-btn');
    
    if (downloadGuideBtn) {
        downloadGuideBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Since the guide isn't available yet, show a message
            alert('The complete guide will be available for download when the school opens. For now, you can refer to the quick start guide shown here.');
        });
    }
});

// Handle import content button
document.addEventListener('DOMContentLoaded', function() {
    const importContentBtn = document.getElementById('import-content-btn');
    
    if (importContentBtn) {
        importContentBtn.addEventListener('click', function() {
            // Since the school hasn't opened yet, show a message
            alert('Content import will be available when the school opens. You can start preparing your content offline.');
        });
    }
});

// Handle view templates button
document.addEventListener('DOMContentLoaded', function() {
    const viewTemplatesBtn = document.getElementById('view-templates-btn');
    
    if (viewTemplatesBtn) {
        viewTemplatesBtn.addEventListener('click', function() {
            // Since the school hasn't opened yet, show a message
            alert('Course templates will be available when the school opens. You can start planning your course structure now.');
        });
    }
});

// Handle upload content button in empty state
document.addEventListener('DOMContentLoaded', function() {
    const uploadContentBtn = document.getElementById('upload-content-btn');
    
    if (uploadContentBtn) {
        uploadContentBtn.addEventListener('click', function() {
            // Since the school hasn't opened yet, show a message
            alert('Content upload will be available when the school opens. You can start preparing your content offline.');
        });
    }
});

// Handle browse templates button in empty state
document.addEventListener('DOMContentLoaded', function() {
    const browseTemplatesBtn = document.getElementById('browse-templates-btn');
    
    if (browseTemplatesBtn) {
        browseTemplatesBtn.addEventListener('click', function() {
            // Since the school hasn't opened yet, show a message
            alert('Course templates will be available when the school opens. You can start planning your course structure now.');
        });
    }
});

// Generate random teacher data for demonstration
function generateRandomTeacherData() {
    // Get random teacher name using the function from attendance.js
    const teacherName = getRandomStudentName();
    
    // Get random subject
    const subjects = ['Mathematics', 'English Language', 'Basic Science', 'Social Studies', 'Religious Studies', 'Computer Studies', 'Creative Arts', 'Physical Education'];
    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
    
    return {
        name: teacherName,
        subject: randomSubject + ' Teacher'
    };
}

// Helper function to get random student name (copied from attendance.js)
function getRandomStudentName() {
    const firstNames = ['John', 'Mary', 'David', 'Sarah', 'Michael', 'Emma', 'James', 'Olivia', 'Daniel', 'Sophia', 'Matthew', 'Ava', 'Joseph', 'Isabella', 'Andrew', 'Mia', 'William', 'Charlotte', 'Alexander', 'Amelia', 'Joshua', 'Harper', 'Christopher', 'Evelyn', 'Nicholas', 'Abigail', 'Ryan', 'Emily', 'Tyler', 'Elizabeth'];
    
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'Hernandez', 'King'];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return `${firstName} ${lastName}`;
}

// If no user is logged in, generate random teacher data for demonstration
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (!currentUser) {
        const randomTeacher = generateRandomTeacherData();
        
        const teacherNameElements = document.querySelectorAll('#teacher-name');
        const teacherSubjectElements = document.querySelectorAll('#teacher-subject');
        
        teacherNameElements.forEach(element => {
            element.textContent = randomTeacher.name;
        });
        
        teacherSubjectElements.forEach(element => {
            element.textContent = randomTeacher.subject;
        });
    }
});