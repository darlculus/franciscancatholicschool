/**
 * Staff Appraisal JavaScript
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
    
    // Initialize charts (empty state)
    initEmptyCharts();
    
    // Initialize event listeners
    initEventListeners();
    
    // Initialize form validation
    initFormValidation();
    
    // Initialize date calculations
    calculateDates();
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
    const teacherNameElements = document.querySelectorAll('#teacher-name, #welcome-name');
    const teacherSubjectElements = document.querySelectorAll('#teacher-subject');
    
    teacherNameElements.forEach(element => {
        element.textContent = currentUser.name || 'Teacher';
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
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding tab content
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
    // Self-appraisal modal
    const selfAppraisalBtn = document.getElementById('start-self-appraisal-btn');
    const selfAppraisalModal = document.getElementById('self-appraisal-modal');
    const closeSelfAppraisalModal = document.getElementById('close-self-appraisal-modal');
    
    if (selfAppraisalBtn && selfAppraisalModal && closeSelfAppraisalModal) {
        selfAppraisalBtn.addEventListener('click', function() {
            selfAppraisalModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        closeSelfAppraisalModal.addEventListener('click', function() {
            selfAppraisalModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Guidelines modal
    const guidelinesBtn = document.getElementById('view-guidelines-btn');
    const guidelinesModal = document.getElementById('guidelines-modal');
    const closeGuidelinesModal = document.getElementById('close-guidelines-modal');
    
    if (guidelinesBtn && guidelinesModal && closeGuidelinesModal) {
        guidelinesBtn.addEventListener('click', function() {
            guidelinesModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        closeGuidelinesModal.addEventListener('click', function() {
            guidelinesModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Sample form modal
    const sampleFormBtn = document.querySelector('.btn-view-sample');
    const sampleFormModal = document.getElementById('sample-form-modal');
    const closeSampleFormModal = document.getElementById('close-sample-form-modal');
    const closeSampleBtn = document.getElementById('close-sample-btn');
    
    if (sampleFormBtn && sampleFormModal && closeSampleFormModal) {
        sampleFormBtn.addEventListener('click', function() {
            sampleFormModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        closeSampleFormModal.addEventListener('click', function() {
            sampleFormModal.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        if (closeSampleBtn) {
            closeSampleBtn.addEventListener('click', function() {
                sampleFormModal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === selfAppraisalModal) {
            selfAppraisalModal.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        if (event.target === guidelinesModal) {
            guidelinesModal.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        if (event.target === sampleFormModal) {
            sampleFormModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Initialize empty charts
function initEmptyCharts() {
    // This function would normally initialize charts with real data
    // Since the school hasn't resumed yet, we're using empty states instead
    // When real data becomes available, this function can be updated
}

// Initialize event listeners
function initEventListeners() {
    // Save draft button
    const saveDraftBtn = document.getElementById('save-draft-btn');
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', function() {
            alert('Your appraisal has been saved as a draft.');
        });
    }
    
    // Submit appraisal button
    const submitAppraisalBtn = document.getElementById('submit-appraisal-btn');
    if (submitAppraisalBtn) {
        submitAppraisalBtn.addEventListener('click', function() {
            if (validateForm()) {
                alert('Your appraisal has been submitted successfully.');
                document.getElementById('self-appraisal-modal').classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Download guidelines PDF
    const downloadGuidelinesBtn = document.getElementById('download-guidelines-btn');
    if (downloadGuidelinesBtn) {
        downloadGuidelinesBtn.addEventListener('click', function() {
            alert('Guidelines PDF download started.');
            // In a real implementation, this would trigger a file download
        });
    }
    
    // Logout button
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

// Initialize form validation
function initFormValidation() {
    // This is a simple validation example
    // In a real application, you would have more comprehensive validation
}

// Validate the appraisal form
function validateForm() {
    // This is a placeholder for form validation
    // In a real application, you would check all required fields
    return true;
}

// Calculate dates for the appraisal cycle
function calculateDates() {
    // This function would calculate important dates based on the current academic year
    // Since we're showing empty states, we're using placeholder dates
}