document.addEventListener('DOMContentLoaded', function() {
    // Initialize the dashboard
    initializeDashboard();
});

// Initialize all dashboard components
function initializeDashboard() {
    // Set current date
    updateCurrentDate();
    
    // Setup sidebar toggle for mobile
    setupSidebarToggle();
    
    // Setup modals
    setupModals();
    
    // Setup form submissions
    setupForms();
    
    // Update dashboard counts
    updateAllCounts();
    
    // Add initial activity log
    addActivityLog('Admin dashboard initialized');
}

// Update the current date display
function updateCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', options);
    
    const currentDateElement = document.getElementById('current-date');
    if (currentDateElement) {
        currentDateElement.textContent = dateString;
    }
}

// Setup sidebar toggle for mobile
function setupSidebarToggle() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const dashboardSidebar = document.querySelector('.dashboard-sidebar');
    const dashboardContainer = document.querySelector('.dashboard-container');
    
    if (sidebarToggle && dashboardSidebar) {
        sidebarToggle.addEventListener('click', function() {
            dashboardSidebar.classList.toggle('active');
            dashboardContainer.classList.toggle('sidebar-open');
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(event) {
            if (window.innerWidth <= 768 && 
                sidebar.classList.contains('active') && 
                !sidebar.contains(event.target) && 
                event.target !== sidebarToggle) {
                sidebar.classList.remove('active');
            }
        });
    }
}

// Setup all modals
function setupModals() {
    // Teacher Modal
    setupModal('add-teacher-btn', 'add-teacher-modal');
    
    // Student Modal
    setupModal('add-student-btn', 'add-student-modal', function() {
        populateClassDropdown();
    });
    
    // Class Modal
    setupModal('add-class-btn', 'add-class-modal', function() {
        populateTeacherDropdown();
    });
    
    // Subject Modal
    setupModal('add-subject-btn', 'add-subject-modal');
}

// Generic function to setup a modal
function setupModal(btnId, modalId, beforeOpenCallback) {
    const btn = document.getElementById(btnId);
    const modal = document.getElementById(modalId);
    
    if (!btn || !modal) return;
    
    // Open modal when button is clicked
    btn.addEventListener('click', function() {
        if (beforeOpenCallback) {
            beforeOpenCallback();
        }
        modal.classList.add('active');
    });
    
    // Close modal when X is clicked
    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.classList.remove('active');
        });
    }
    
<<<<<<< HEAD
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        if (dashboardSidebar && sidebarToggle) {
            const isClickInsideSidebar = dashboardSidebar.contains(event.target);
            const isClickOnToggle = sidebarToggle.contains(event.target);
            
            if (!isClickInsideSidebar && !isClickOnToggle && window.innerWidth < 768 && dashboardSidebar.classList.contains('active')) {
                dashboardSidebar.classList.remove('active');
                dashboardContainer.classList.remove('sidebar-open');
            }
=======
    // Close modal when Cancel button is clicked
    const cancelBtn = modal.querySelector('.cancel-modal');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            modal.classList.remove('active');
        });
    }
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.classList.remove('active');
>>>>>>> portal
        }
    });
}

// Populate class dropdown for student form
function populateClassDropdown() {
    const classDropdown = document.getElementById('student-class');
    if (!classDropdown) return;
    
    // Clear existing options except the first one
    while (classDropdown.options.length > 1) {
        classDropdown.remove(1);
    }
    
    // Get classes from local storage
    const classes = JSON.parse(localStorage.getItem('classes')) || [];
    
    // Add classes to dropdown
    classes.forEach(cls => {
        const option = document.createElement('option');
        option.value = cls.id;
        option.textContent = cls.name;
        classDropdown.appendChild(option);
    });
}

// Populate teacher dropdown for class form
function populateTeacherDropdown() {
    const teacherDropdown = document.getElementById('class-teacher');
    if (!teacherDropdown) return;
    
<<<<<<< HEAD
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
    
    // Notification bell functionality
    const notificationBell = document.querySelector('.notification-bell');
    
    if (notificationBell) {
        notificationBell.addEventListener('click', function() {
            alert('Notifications feature will be implemented in the future.');
        });
    }
    
    // Add animation to the welcome banner
    const welcomeBanner = document.querySelector('.welcome-banner');
    
    if (welcomeBanner) {
        welcomeBanner.classList.add('animate');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            welcomeBanner.classList.remove('animate');
        }, 1000);
=======
    // Clear existing options except the first one
    while (teacherDropdown.options.length > 1) {
        teacherDropdown.remove(1);
>>>>>>> portal
    }
    
    // Get teachers from local storage
    const teachers = JSON.parse(localStorage.getItem('teachers')) || [];
    
    // Add teachers to dropdown
    teachers.forEach(teacher => {
        const option = document.createElement('option');
        option.value = teacher.id;
        option.textContent = teacher.name;
        teacherDropdown.appendChild(option);
    });
}

// Setup all form submissions
function setupForms() {
    // Teacher Form
    setupTeacherForm();
    
    // Student Form
    setupStudentForm();
    
    // Class Form
    setupClassForm();
    
    // Subject Form
    setupSubjectForm();
}

// Setup teacher form submission
function setupTeacherForm() {
    const form = document.getElementById('add-teacher-form');
    if (!form) return;
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form data
        const name = document.getElementById('teacher-name').value;
        const email = document.getElementById('teacher-email').value;
        const phone = document.getElementById('teacher-phone').value;
        const subject = document.getElementById('teacher-subject').value;
        const password = document.getElementById('teacher-password').value;
        
        // Create teacher object
        const teacher = {
            id: generateId('TCH'),
            name: name,
            email: email,
            phone: phone,
            subject: subject,
            password: password,
            role: 'teacher',
            dateAdded: new Date().toISOString()
        };
        
        // Save to local storage
        saveItem('teachers', teacher);
        
        // Update UI
        updateCount('teachers');
        addActivityLog(`Added new teacher: ${name}`);
        
        // Close modal and reset form
        document.getElementById('add-teacher-modal').classList.remove('active');
        form.reset();
    });
}

// Setup student form submission
function setupStudentForm() {
    const form = document.getElementById('add-student-form');
    if (!form) return;
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form data
        const name = document.getElementById('student-name').value;
        const gender = document.getElementById('student-gender').value;
        const dob = document.getElementById('student-dob').value;
        const classId = document.getElementById('student-class').value;
        const parentName = document.getElementById('parent-name').value;
        const parentPhone = document.getElementById('parent-phone').value;
        const parentEmail = document.getElementById('parent-email').value;
        const password = document.getElementById('student-password').value;
        
        // Get class name
        const classes = JSON.parse(localStorage.getItem('classes')) || [];
        const selectedClass = classes.find(c => c.id === classId);
        const className = selectedClass ? selectedClass.name : '';
        
        // Create student object
        const student = {
            id: generateId('STU'),
            name: name,
            gender: gender,
            dob: dob,
            classId: classId,
            className: className,
            parentName: parentName,
            parentPhone: parentPhone,
            parentEmail: parentEmail,
            password: password,
            role: 'student',
            dateAdded: new Date().toISOString()
        };
        
        // Save to local storage
        saveItem('students', student);
        
        // Update UI
        updateCount('students');
        addActivityLog(`Added new student: ${name}`);
        
        // Close modal and reset form
        document.getElementById('add-student-modal').classList.remove('active');
        form.reset();
    });
}

// Setup class form submission
function setupClassForm() {
    const form = document.getElementById('add-class-form');
    if (!form) return;
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form data
        const name = document.getElementById('class-name').value;
        const level = document.getElementById('class-level').value;
        const capacity = document.getElementById('class-capacity').value;
        const teacherId = document.getElementById('class-teacher').value;
        const description = document.getElementById('class-description').value;
        
        // Get teacher name
        const teachers = JSON.parse(localStorage.getItem('teachers')) || [];
        const selectedTeacher = teachers.find(t => t.id === teacherId);
        const teacherName = selectedTeacher ? selectedTeacher.name : '';
        
        // Create class object
        const classObj = {
            id: generateId('CLS'),
            name: name,
            level: level,
            capacity: capacity,
            teacherId: teacherId,
            teacherName: teacherName,
            description: description,
            dateAdded: new Date().toISOString()
        };
        
        // Save to local storage
        saveItem('classes', classObj);
        
        // Update UI
        updateCount('classes');
        addActivityLog(`Added new class: ${name}`);
        
        // Close modal and reset form
        document.getElementById('add-class-modal').classList.remove('active');
        form.reset();
    });
}

// Setup subject form submission
function setupSubjectForm() {
    const form = document.getElementById('add-subject-form');
    if (!form) return;
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form data
        const name = document.getElementById('subject-name').value;
        const code = document.getElementById('subject-code').value;
        const level = document.getElementById('subject-level').value;
        const description = document.getElementById('subject-description').value;
        
        // Create subject object
        const subject = {
            id: generateId('SUB'),
            name: name,
            code: code,
            level: level,
            description: description,
            dateAdded: new Date().toISOString()
        };
        
        // Save to local storage
        saveItem('subjects', subject);
        
        // Update UI
        updateCount('subjects');
        addActivityLog(`Added new subject: ${name}`);
        
        // Close modal and reset form
        document.getElementById('add-subject-modal').classList.remove('active');
        form.reset();
    });
}

// Generate a unique ID
function generateId(prefix) {
    const timestamp = new Date().getTime().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
}

// Save item to local storage
function saveItem(key, item) {
    // Get existing items
    const items = JSON.parse(localStorage.getItem(key)) || [];
    
    // Add new item
    items.push(item);
    
    // Save back to local storage
    localStorage.setItem(key, JSON.stringify(items));
}

// Update count in the UI
function updateCount(key) {
    const items = JSON.parse(localStorage.getItem(key)) || [];
    let countElement;
    
    switch(key) {
        case 'students':
            countElement = document.querySelector('.stat-card:nth-child(1) .stat-count');
            break;
        case 'teachers':
            countElement = document.querySelector('.stat-card:nth-child(2) .stat-count');
            break;
        case 'classes':
            countElement = document.querySelector('.stat-card:nth-child(3) .stat-count');
            break;
        case 'subjects':
            countElement = document.querySelector('.stat-card:nth-child(4) .stat-count');
            break;
    }
    
    if (countElement) {
        countElement.textContent = items.length;
    }
}

// Update all counts in the dashboard
function updateAllCounts() {
    updateCount('students');
    updateCount('teachers');
    updateCount('classes');
    updateCount('subjects');
}

// Add activity log entry
function addActivityLog(activity) {
    const activityList = document.querySelector('.activity-list');
    if (!activityList) return;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    
    const activityItem = document.createElement('div');
    activityItem.classList.add('activity-item');
    
    activityItem.innerHTML = `
        <div class="activity-icon">
            <i class="fas fa-history"></i>
        </div>
        <div class="activity-details">
            <p>${activity}</p>
            <span class="activity-time">${timeString}</span>
        </div>
    `;
    
    // Add to the beginning of the list
    activityList.insertBefore(activityItem, activityList.firstChild);
}

// Logout functionality
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function(event) {
        event.preventDefault();
        
        // Clear user session
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        
        // Redirect to login page
        window.location.href = 'portal.html';
    });
}