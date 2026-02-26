<UPDATED_CODE>/**
 * Teachers Management JavaScript
 * Franciscan Catholic Nursery & Primary School
 */

// Global variables
let teachers = [];
let currentPage = 1;
let itemsPerPage = 10;
let filteredTeachers = [];
let currentTeacherId = null;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize date display
    updateDateDisplay();
    
    // Initialize sidebar toggle for mobile
    initSidebarToggle();
    
    // Initialize tabs
    initTabs();
    
    // Initialize modals
    initModals();
    
    // Initialize form tabs
    initFormTabs();
    
    // Initialize form validations
    initFormValidations();
    
    // Initialize charts (empty state)
    initEmptyCharts();
    
    // Load teachers from API
    loadTeachers();
    
    // Initialize event listeners
    initEventListeners();
});

// Load teachers from API
async function loadTeachers() {
    try {
        teachers = await window.api.getTeachers();
        if (teachers.length === 0) {
            showEmptyState();
        } else {
            filterTeachers();
            updateTeacherStats();
        }
    } catch (error) {
        console.error('Error loading teachers:', error);
        showEmptyState();
    }
}

// Update date display
function updateDateDisplay() {
    const dateElement = document.getElementById('current-date');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    dateElement.textContent = today.toLocaleDateString('en-US', options);
}

// Initialize sidebar toggle for mobile
function initSidebarToggle() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.dashboard-sidebar');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function(event) {
            sidebar.classList.toggle('active');
            // Prevent the event from propagating to document
            event.stopPropagation();
        });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        const isClickInsideSidebar = sidebar.contains(event.target);
        const isClickOnToggle = sidebarToggle && sidebarToggle.contains(event.target);
        
        if (!isClickInsideSidebar && !isClickOnToggle && window.innerWidth <= 768 && sidebar.classList.contains('active')) {
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
    
    // Initialize profile tabs
    const profileTabs = document.querySelectorAll('.profile-tab');
    const profileTabContents = document.querySelectorAll('.profile-tab-content');
    
    profileTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and contents
            profileTabs.forEach(t => t.classList.remove('active'));
            profileTabContents.forEach(c => c.classList.remove('active'));
            
                        // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding tab content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab-content`).classList.add('active');
        });
    });
}

// Initialize modals
function initModals() {
    // Get all modals
    const modals = document.querySelectorAll('.modal');
    
    // Get all elements that open a modal
    const modalTriggers = document.querySelectorAll('[id$="-btn"]');
    
    // Get all elements that close a modal
    const closeButtons = document.querySelectorAll('.close-modal, .cancel-modal');
    
    // Add click event to all modal triggers
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const modalId = this.id.replace('-btn', '-modal');
            const modal = document.getElementById(modalId);
            
            if (modal) {
                modal.classList.add('active');
                
                // Special handling for specific modals
                if (modalId === 'add-teacher-modal') {
                    resetAddTeacherForm();
                } else if (modalId === 'edit-teacher-modal') {
                    // This will be handled by the edit button click event
                } else if (modalId === 'view-teacher-modal') {
                    // This will be handled by the view button click event
                }
            }
        });
    });
    
    // Add click event to all close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.classList.remove('active');
        });
    });
    
    // Close modal when clicking outside the modal content
    modals.forEach(modal => {
        modal.addEventListener('click', function(event) {
            if (event.target === this) {
                this.classList.remove('active');
            }
        });
    });
}

// Initialize form tabs
function initFormTabs() {
    const formTabs = document.querySelectorAll('.form-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const prevButtons = document.querySelectorAll('.prev-tab-btn');
    const nextButtons = document.querySelectorAll('.next-tab-btn');
    const submitButtons = document.querySelectorAll('.submit-form-btn');
    
    formTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchFormTab(tabId, this.closest('form').id);
        });
    });
    
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchFormTab(tabId, this.closest('form').id);
        });
    });
    
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchFormTab(tabId, this.closest('form').id);
        });
    });
}

// Switch form tab
function switchFormTab(tabId, formId) {
    const prefix = formId.includes('edit') ? 'edit-' : '';
    
    // Hide all tab contents
    const tabContents = document.querySelectorAll(`#${formId} .tab-content`);
    tabContents.forEach(content => {
        content.style.display = 'none';
    });
    
    // Show selected tab content
    const selectedContent = document.getElementById(`${prefix}${tabId}-tab-content`);
    if (selectedContent) {
        selectedContent.style.display = 'block';
    }
    
    // Update active tab
    const tabs = document.querySelectorAll(`#${formId} .form-tab`);
    tabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-tab') === tabId) {
            tab.classList.add('active');
        }
    });
    
    // Update navigation buttons
    const prevButton = document.querySelector(`#${formId} .prev-tab-btn`);
    const nextButton = document.querySelector(`#${formId} .next-tab-btn`);
    const submitButton = document.querySelector(`#${formId} .submit-form-btn`);
    
    if (tabId === 'personal') {
        prevButton.style.display = 'none';
        nextButton.style.display = 'block';
        nextButton.setAttribute('data-tab', 'professional');
        submitButton.style.display = 'none';
    } else if (tabId === 'professional') {
        prevButton.style.display = 'block';
        prevButton.setAttribute('data-tab', 'personal');
        nextButton.style.display = 'block';
        nextButton.setAttribute('data-tab', 'account');
        submitButton.style.display = 'none';
    } else if (tabId === 'account') {
        prevButton.style.display = 'block';
        prevButton.setAttribute('data-tab', 'professional');
        nextButton.style.display = 'none';
        submitButton.style.display = 'block';
    }
}

// Initialize form validations
function initFormValidations() {
    // Add Teacher Form
    const addTeacherForm = document.getElementById('add-teacher-form');
    if (addTeacherForm) {
        addTeacherForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Validate form
            if (validateTeacherForm(this)) {
                // Add teacher
                addTeacher();
                
                // Close modal
                document.getElementById('add-teacher-modal').classList.remove('active');
                
                // Show success notification
                showNotification('Teacher added successfully!', 'success');
            }
        });
    }
    
    // Edit Teacher Form
    const editTeacherForm = document.getElementById('edit-teacher-form');
    if (editTeacherForm) {
        editTeacherForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Validate form
            if (validateTeacherForm(this)) {
                // Update teacher
                updateTeacher();
                
                // Close modal
                document.getElementById('edit-teacher-modal').classList.remove('active');
                
                // Show success notification
                showNotification('Teacher updated successfully!', 'success');
            }
        });
    }
    
    // Assign Class Form
    const assignClassForm = document.getElementById('assign-class-form');
    if (assignClassForm) {
        assignClassForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Assign class
            assignClass();
            
            // Close modal
            document.getElementById('assign-class-modal').classList.remove('active');
            
            // Show success notification
            showNotification('Class assigned successfully!', 'success');
        });
    }
    
    // Assign Subject Form
    const assignSubjectForm = document.getElementById('assign-subject-form');
    if (assignSubjectForm) {
        assignSubjectForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Assign subject
            assignSubject();
            
            // Close modal
            document.getElementById('assign-subject-modal').classList.remove('active');
            
            // Show success notification
            showNotification('Subject assigned successfully!', 'success');
        });
    }
    
    // Notification Form
    const notificationForm = document.getElementById('notification-form');
    if (notificationForm) {
        notificationForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Send notification
            sendNotification();
            
            // Close modal
            document.getElementById('notification-modal').classList.remove('active');
            
            // Show success notification
            showNotification('Notification sent successfully!', 'success');
        });
    }
    
    // Handle notification recipients change
    const notificationRecipients = document.getElementById('notification-recipients');
    if (notificationRecipients) {
        notificationRecipients.addEventListener('change', function() {
            const specificTeachersGroup = document.getElementById('specific-teachers-group');
            
            if (this.value === 'specific') {
                specificTeachersGroup.style.display = 'block';
            } else {
                specificTeachersGroup.style.display = 'none';
            }
        });
    }
}

// Validate teacher form
function validateTeacherForm(form) {
    // Basic validation
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
        } else {
            field.classList.remove('error');
        }
    });
    
    // Password validation for add form
    if (form.id === 'add-teacher-form') {
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirm-password');
        
        if (password.value !== confirmPassword.value) {
            isValid = false;
            password.classList.add('error');
            confirmPassword.classList.add('error');
            showNotification('Passwords do not match!', 'error');
        }
    }
    
    // Password validation for edit form (only if password is provided)
    if (form.id === 'edit-teacher-form') {
        const password = document.getElementById('edit-password');
        const confirmPassword = document.getElementById('edit-confirm-password');
        
        if (password.value && password.value !== confirmPassword.value) {
            isValid = false;
            password.classList.add('error');
            confirmPassword.classList.add('error');
            showNotification('Passwords do not match!', 'error');
        }
    }
    
    if (!isValid) {
        showNotification('Please fill in all required fields correctly.', 'error');
    }
    
    return isValid;
}

// Initialize empty charts
function initEmptyCharts() {
    // Teacher distribution chart
    const teacherDistributionCtx = document.getElementById('teacher-distribution-chart');
    if (teacherDistributionCtx) {
        new Chart(teacherDistributionCtx, {
            type: 'doughnut',
            data: {
                labels: ['No Data Available'],
                datasets: [{
                    data: [1],
                    backgroundColor: ['#e0e0e0'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        enabled: false
                    }
                }
            }
        });
    }
    
    // Teacher experience chart
    const teacherExperienceCtx = document.getElementById('teacher-experience-chart');
    if (teacherExperienceCtx) {
        new Chart(teacherExperienceCtx, {
            type: 'bar',
            data: {
                labels: ['No Data Available'],
                datasets: [{
                    label: 'No Data',
                    data: [0],
                    backgroundColor: '#e0e0e0',
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    }
                }
            }
        });
    }
}

// Show empty state
function showEmptyState() {
    // Hide teachers table and show empty state
    const teachersTable = document.querySelector('.teachers-container');
    const noTeachersMessage = document.getElementById('no-teachers-message');
    
    if (teachersTable && noTeachersMessage) {
        teachersTable.style.display = 'none';
        noTeachersMessage.style.display = 'flex';
    }
    
    // Update stats with zeros
    updateStats(0, 0, 0, 0);
}

// Update stats
function updateStats(total, active, inactive, newTeachers) {
    document.getElementById('total-teachers').textContent = total;
    document.getElementById('active-teachers').textContent = active;
    document.getElementById('inactive-teachers').textContent = inactive;
    document.getElementById('new-teachers').textContent = newTeachers;
}

// Update teacher stats from teachers array
function updateTeacherStats() {
    const total = teachers.length;
    const active = teachers.filter(t => t.status === 'active').length;
    const newTeachers = teachers.filter(t => {
        const joinDate = new Date(t.joinDate || t.join_date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return joinDate >= thirtyDaysAgo;
    }).length;
    updateStats(total, active, total - active, newTeachers);
}

// Initialize event listeners
function initEventListeners() {
    // Search input
    const searchInput = document.getElementById('teacher-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterTeachers();
        });
    }
    
    // Status filter
    const statusFilter = document.getElementById('status-filter');
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            filterTeachers();
        });
    }
    
    // Subject filter
    const subjectFilter = document.getElementById('subject-filter');
    if (subjectFilter) {
        subjectFilter.addEventListener('change', function() {
            filterTeachers();
        });
    }
    
    // Delete confirmation
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function() {
            deleteTeacher(currentTeacherId);
            document.getElementById('delete-confirmation-modal').classList.remove('active');
        });
    }
    
    // Color options for profile picture
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            colorOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Update hidden input value
            const colorInput = this.closest('.form-group').querySelector('input[type="hidden"]');
            if (colorInput) {
                colorInput.value = this.getAttribute('data-color');
            }
        });
    });
    
    // Generate report button
    const generateReportBtn = document.getElementById('generate-report-btn');
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', function() {
            generateReport();
        });
    }
    
    // Report type change
    const reportType = document.getElementById('report-type');
    if (reportType) {
        reportType.addEventListener('change', function() {
            const teacherFilter = document.querySelector('.teacher-filter');
            
            if (this.value === 'summary' || this.value === 'performance') {
                teacherFilter.style.display = 'block';
            } else {
                teacherFilter.style.display = 'none';
            }
        });
    }
    
    // Print report button
    const printReportBtn = document.getElementById('print-report-btn');
    if (printReportBtn) {
        printReportBtn.addEventListener('click', function() {
            printReport();
        });
    }
    
    // Export PDF button
    const exportPdfBtn = document.getElementById('export-pdf-btn');
    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', function() {
            exportReportPdf();
        });
    }
    
        // Export Excel button
    const exportExcelBtn = document.getElementById('export-excel-btn');
    if (exportExcelBtn) {
        exportExcelBtn.addEventListener('click', function() {
            exportReportExcel();
        });
    }
    
    // Edit profile button in view modal
    const editProfileBtn = document.getElementById('edit-profile-btn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            // Close view modal
            document.getElementById('view-teacher-modal').classList.remove('active');
            
            // Open edit modal with current teacher data
            if (currentTeacherId) {
                openEditTeacherModal(currentTeacherId);
            }
        });
    }
    
    // Print profile button
    const printProfileBtn = document.getElementById('print-profile-btn');
    if (printProfileBtn) {
        printProfileBtn.addEventListener('click', function() {
            printTeacherProfile();
        });
    }
    
    // Notification toast close button
    const notificationClose = document.querySelector('.notification-close');
    if (notificationClose) {
        notificationClose.addEventListener('click', function() {
            document.getElementById('notification-toast').classList.remove('show');
        });
    }
}

// Reset add teacher form
function resetAddTeacherForm() {
    document.getElementById('add-teacher-form').reset();
    
    // Reset form tabs
    switchFormTab('personal', 'add-teacher-form');
    
    // Reset color selection
    const colorOptions = document.querySelectorAll('#add-teacher-form .color-option');
    colorOptions.forEach(option => {
        option.classList.remove('selected');
        if (option.getAttribute('data-color') === '#4CAF50') {
            option.classList.add('selected');
        }
    });
}

// Add teacher
async function addTeacher() {
    const form = document.getElementById('add-teacher-form');
    
    const teacher = {
        firstName: document.getElementById('first-name').value,
        lastName: document.getElementById('last-name').value,
        gender: document.getElementById('gender').value,
        dob: document.getElementById('dob').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        qualification: document.getElementById('qualification').value,
        specialization: document.getElementById('specialization').value,
        experience: document.getElementById('experience').value || '0',
        joinDate: document.getElementById('join-date').value,
        assignedClass: document.getElementById('assigned-class').value,
        employmentType: document.getElementById('employment-type').value,
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        role: document.getElementById('role').value,
        status: document.getElementById('status').value
    };
    
    try {
        await window.api.addTeacher(teacher);
        form.reset();
        teachers = await window.api.getTeachers();
        filterTeachers();
        updateTeacherStats();
    } catch (error) {
        console.error('Error adding teacher:', error);
        showNotification('Error adding teacher: ' + error.message, 'error');
    }
}

// Generate teacher ID
function generateTeacherId() {
    // Format: TCH001, TCH002, etc.
    const prefix = 'TCH';
    const nextNumber = (teachers.length + 1).toString().padStart(3, '0');
    return `${prefix}${nextNumber}`;
}

// Open edit teacher modal
function openEditTeacherModal(teacherId) {
    const teacher = teachers.find(t => t.id === teacherId);
    
    if (!teacher) return;
    
    // Set current teacher ID
    currentTeacherId = teacherId;
    
    // Populate form fields
    document.getElementById('edit-teacher-id').value = teacher.id;
    document.getElementById('edit-first-name').value = teacher.firstName;
    document.getElementById('edit-last-name').value = teacher.lastName;
    document.getElementById('edit-gender').value = teacher.gender;
    document.getElementById('edit-dob').value = teacher.dob;
    document.getElementById('edit-phone').value = teacher.phone;
    document.getElementById('edit-email').value = teacher.email;
    document.getElementById('edit-address').value = teacher.address;
    document.getElementById('edit-qualification').value = teacher.qualification;
    document.getElementById('edit-specialization').value = teacher.specialization;
    document.getElementById('edit-experience').value = teacher.experience;
    document.getElementById('edit-join-date').value = teacher.joinDate;
    document.getElementById('edit-assigned-class').value = teacher.assignedClass;
    document.getElementById('edit-employment-type').value = teacher.employmentType;
    document.getElementById('edit-username').value = teacher.username;
    document.getElementById('edit-role').value = teacher.role;
    document.getElementById('edit-status').value = teacher.status;
    document.getElementById('edit-profile-color').value = teacher.profileColor;
    
    // Reset password fields
    document.getElementById('edit-password').value = '';
    document.getElementById('edit-confirm-password').value = '';
    
    // Set color selection
    const colorOptions = document.querySelectorAll('#edit-teacher-form .color-option');
    colorOptions.forEach(option => {
        option.classList.remove('selected');
        if (option.getAttribute('data-color') === teacher.profileColor) {
            option.classList.add('selected');
        }
    });
    
    // Reset form tabs
    switchFormTab('personal', 'edit-teacher-form');
    
    // Show modal
    document.getElementById('edit-teacher-modal').classList.add('active');
}

// Update teacher
function updateTeacher() {
    const teacherId = document.getElementById('edit-teacher-id').value;
    const teacherIndex = teachers.findIndex(t => t.id === teacherId);
    
    if (teacherIndex === -1) return;
    
    // Update teacher data
    teachers[teacherIndex] = {
        ...teachers[teacherIndex],
        firstName: document.getElementById('edit-first-name').value,
        lastName: document.getElementById('edit-last-name').value,
        gender: document.getElementById('edit-gender').value,
        dob: document.getElementById('edit-dob').value,
        phone: document.getElementById('edit-phone').value,
        email: document.getElementById('edit-email').value,
        address: document.getElementById('edit-address').value,
        qualification: document.getElementById('edit-qualification').value,
        specialization: document.getElementById('edit-specialization').value,
        experience: document.getElementById('edit-experience').value || '0',
        joinDate: document.getElementById('edit-join-date').value,
        assignedClass: document.getElementById('edit-assigned-class').value,
        employmentType: document.getElementById('edit-employment-type').value,
        username: document.getElementById('edit-username').value,
        role: document.getElementById('edit-role').value,
        status: document.getElementById('edit-status').value,
        profileColor: document.getElementById('edit-profile-color').value,
        updatedAt: new Date().toISOString()
    };
    
    // Update password if provided
    const password = document.getElementById('edit-password').value;
    if (password) {
        teachers[teacherIndex].password = password; // In a real app, this would be hashed
    }
    
    // Save to localStorage (in a real app, this would be a server API call)
    localStorage.setItem('teachers', JSON.stringify(teachers));
    
    // Refresh the teachers list
    filterTeachers();
    
    // Update stats
    updateTeacherStats();
}

// Open view teacher modal
function openViewTeacherModal(teacherId) {
    const teacher = teachers.find(t => t.id === teacherId);
    
    if (!teacher) return;
    
    // Set current teacher ID
    currentTeacherId = teacherId;
    
    // Populate teacher profile
    document.getElementById('view-teacher-name').textContent = `${teacher.firstName} ${teacher.lastName}`;
    document.getElementById('view-teacher-subject').textContent = teacher.specialization;
    document.getElementById('view-teacher-id').textContent = `ID: ${teacher.id}`;
    
    // Set status badge
    const statusBadge = document.getElementById('view-teacher-status');
    statusBadge.textContent = teacher.status === 'active' ? 'Active' : 'Inactive';
    statusBadge.className = `status-badge status-${teacher.status}`;
    
    // Populate personal info
    document.getElementById('view-full-name').textContent = `${teacher.firstName} ${teacher.lastName}`;
    document.getElementById('view-gender').textContent = teacher.gender;
    document.getElementById('view-dob').textContent = formatDate(teacher.dob);
    document.getElementById('view-phone').textContent = teacher.phone;
    document.getElementById('view-email').textContent = teacher.email;
    document.getElementById('view-address').textContent = teacher.address;
    
    // Populate professional info
    document.getElementById('view-qualification').textContent = teacher.qualification;
    document.getElementById('view-specialization').textContent = teacher.specialization;
    document.getElementById('view-experience').textContent = `${teacher.experience} years`;
    document.getElementById('view-join-date').textContent = formatDate(teacher.joinDate);
    document.getElementById('view-employment-type').textContent = teacher.employmentType;
    document.getElementById('view-role').textContent = teacher.role;
    
    // Populate class info
    document.getElementById('view-assigned-class').textContent = teacher.assignedClass || 'Not Assigned';
    
    // Populate subjects list
    const subjectsList = document.getElementById('view-subjects-list');
    subjectsList.innerHTML = '';
    
    if (teacher.specialization) {
        const li = document.createElement('li');
        li.textContent = teacher.specialization;
        subjectsList.appendChild(li);
    } else {
        subjectsList.innerHTML = '<li>No subjects assigned</li>';
    }
    
    // Reset tabs
    const profileTabs = document.querySelectorAll('.profile-tab');
    const profileTabContents = document.querySelectorAll('.profile-tab-content');
    
    profileTabs.forEach(tab => tab.classList.remove('active'));
    profileTabContents.forEach(content => content.classList.remove('active'));
    
    // Activate first tab
    profileTabs[0].classList.add('active');
    profileTabContents[0].classList.add('active');
    
    // Show modal
    document.getElementById('view-teacher-modal').classList.add('active');
}

// Delete teacher
function deleteTeacher(teacherId) {
    // Filter out the teacher with the given ID
    teachers = teachers.filter(t => t.id !== teacherId);
    
    // Save to localStorage (in a real app, this would be a server API call)
    localStorage.setItem('teachers', JSON.stringify(teachers));
    
    // Refresh the teachers list
    filterTeachers();
    
    // Update stats
    updateTeacherStats();
    
    // Show success notification
    showNotification('Teacher deleted successfully!', 'success');
    
    // Show empty state if no teachers left
    if (teachers.length === 0) {
        showEmptyState();
    }
}

// Filter teachers
function filterTeachers() {
    const searchTerm = document.getElementById('teacher-search').value.toLowerCase();
    const statusFilter = document.getElementById('status-filter').value;
    const subjectFilter = document.getElementById('subject-filter').value;
    
    // Apply filters
    filteredTeachers = teachers.filter(teacher => {
        const nameMatch = `${teacher.firstName} ${teacher.lastName}`.toLowerCase().includes(searchTerm);
        const statusMatch = statusFilter ? teacher.status === statusFilter : true;
        const subjectMatch = subjectFilter ? teacher.specialization === subjectFilter : true;
        
        return nameMatch && statusMatch && subjectMatch;
    });
    
    // Sort by name
    filteredTeachers.sort((a, b) => {
        return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
    });
    
    // Update pagination
    currentPage = 1;
    updatePagination();
    
    // Render teachers
    renderTeachers();
}

// Render teachers
function renderTeachers() {
    const tableBody = document.querySelector('#teachers-table tbody');
    
    if (!tableBody) return;
    
    // Clear table
    tableBody.innerHTML = '';
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedTeachers = filteredTeachers.slice(startIndex, endIndex);
    
    // Check if we have teachers to display
    if (paginatedTeachers.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">
                    <div class="empty-state small">
                        <i class="fas fa-search"></i>
                        <p>No teachers found matching your criteria.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    // Render teachers
    paginatedTeachers.forEach(teacher => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${teacher.id}</td>
            <td>
                <div class="teacher-name">
                    <div class="teacher-avatar" style="background-color: ${teacher.profileColor || '#4CAF50'}">
                        <span>${getInitials(teacher.firstName, teacher.lastName)}</span>
                    </div>
                    <div class="teacher-info">
                        <span class="name">${teacher.firstName} ${teacher.lastName}</span>
                        <span class="role">${teacher.role}</span>
                    </div>
                </div>
            </td>
            <td>${teacher.specialization || '-'}</td>
            <td>${teacher.assignedClass || '-'}</td>
            <td>${teacher.phone}</td>
            <td><span class="status-badge status-${teacher.status}">${capitalizeFirstLetter(teacher.status)}</span></td>
            <td>
                <button class="action-icon view" onclick="openViewTeacherModal('${teacher.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                                <button class="action-icon edit" onclick="openEditTeacherModal('${teacher.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-icon delete" onclick="confirmDeleteTeacher('${teacher.id}')">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Update pagination
function updatePagination() {
    const paginationInfo = document.getElementById('pagination-info');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    
    if (!paginationInfo || !prevBtn || !nextBtn) return;
    
    const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
    
    // Update pagination info
    paginationInfo.textContent = `Page ${currentPage} of ${totalPages || 1}`;
    
    // Update buttons state
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}

// Go to previous page
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        updatePagination();
        renderTeachers();
    }
}

// Go to next page
function nextPage() {
    const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
    
    if (currentPage < totalPages) {
        currentPage++;
        updatePagination();
        renderTeachers();
    }
}

// Confirm delete teacher
function confirmDeleteTeacher(teacherId) {
    currentTeacherId = teacherId;
    
    // Get teacher name
    const teacher = teachers.find(t => t.id === teacherId);
    
    if (teacher) {
        // Update confirmation message
        document.getElementById('delete-confirmation-message').textContent = 
            `Are you sure you want to delete ${teacher.firstName} ${teacher.lastName}? This action cannot be undone.`;
        
        // Show confirmation modal
        document.getElementById('delete-confirmation-modal').classList.add('active');
    }
}

// Assign class
function assignClass() {
    const teacherId = document.getElementById('class-teacher-id').value;
    const className = document.getElementById('class-name').value;
    const academicYear = document.getElementById('class-academic-year').value;
    
    // Find teacher
    const teacherIndex = teachers.findIndex(t => t.id === teacherId);
    
    if (teacherIndex === -1) return;
    
    // Update teacher
    teachers[teacherIndex].assignedClass = className;
    
    // In a real app, you would also store the academic year and other details
    
    // Save to localStorage (in a real app, this would be a server API call)
    localStorage.setItem('teachers', JSON.stringify(teachers));
    
    // Refresh the teachers list
    filterTeachers();
}

// Assign subject
function assignSubject() {
    const teacherId = document.getElementById('subject-teacher-id').value;
    const subject = document.getElementById('subject-name').value;
    const academicYear = document.getElementById('subject-academic-year').value;
    
    // Get selected classes
    const selectedClasses = [];
    const classCheckboxes = document.querySelectorAll('input[name="classes"]:checked');
    classCheckboxes.forEach(checkbox => {
        selectedClasses.push(checkbox.value);
    });
    
    // Find teacher
    const teacherIndex = teachers.findIndex(t => t.id === teacherId);
    
    if (teacherIndex === -1) return;
    
    // Update teacher
    teachers[teacherIndex].specialization = subject;
    
    // In a real app, you would also store the classes, academic year, and other details
    
    // Save to localStorage (in a real app, this would be a server API call)
    localStorage.setItem('teachers', JSON.stringify(teachers));
    
    // Refresh the teachers list
    filterTeachers();
}

// Send notification
function sendNotification() {
    const recipients = document.getElementById('notification-recipients').value;
    const subject = document.getElementById('notification-subject').value;
    const message = document.getElementById('notification-message').value;
    const type = document.getElementById('notification-type').value;
    
    // In a real app, this would send notifications to the selected teachers
    
    // For demo purposes, just show a success message
    showNotification(`Notification sent to ${recipients === 'all' ? 'all teachers' : recipients === 'active' ? 'active teachers' : 'selected teachers'}.`, 'success');
}

// Generate report
function generateReport() {
    const reportType = document.getElementById('report-type').value;
    const startDate = document.getElementById('report-start-date').value;
    const endDate = document.getElementById('report-end-date').value;
    
    // Validate dates
    if (!startDate || !endDate) {
        showNotification('Please select both start and end dates.', 'error');
        return;
    }
    
    // Check if end date is after start date
    if (new Date(endDate) < new Date(startDate)) {
        showNotification('End date must be after start date.', 'error');
        return;
    }
    
    // Show loading state
    const reportContent = document.getElementById('report-content');
    reportContent.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Generating report...</p>
        </div>
    `;
    
    // Simulate API call delay
    setTimeout(() => {
        // Generate report based on type
        if (reportType === 'all') {
            generateAllTeachersReport(startDate, endDate);
        } else if (reportType === 'attendance') {
            generateAttendanceReport(startDate, endDate);
        } else if (reportType === 'performance') {
            generatePerformanceReport(startDate, endDate);
        } else if (reportType === 'summary') {
            generateSummaryReport(startDate, endDate);
        }
        
        // Enable report action buttons
        document.getElementById('print-report-btn').disabled = false;
        document.getElementById('export-pdf-btn').disabled = false;
        document.getElementById('export-excel-btn').disabled = false;
    }, 1500);
}

// Generate all teachers report
function generateAllTeachersReport(startDate, endDate) {
    const reportContent = document.getElementById('report-content');
    
    // Format dates for display
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    
    // Generate report HTML
    let html = `
        <div class="report-header">
            <h2>All Teachers Report</h2>
            <p>Period: ${formattedStartDate} to ${formattedEndDate}</p>
        </div>
        
        <div class="report-summary">
            <div class="summary-item">
                <span class="summary-label">Total Teachers:</span>
                <span class="summary-value">${teachers.length}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Active Teachers:</span>
                <span class="summary-value">${teachers.filter(t => t.status === 'active').length}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Inactive Teachers:</span>
                <span class="summary-value">${teachers.filter(t => t.status === 'inactive').length}</span>
            </div>
        </div>
        
        <div class="report-table-container">
            <table class="report-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Specialization</th>
                        <th>Assigned Class</th>
                        <th>Contact</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    // Add teachers to table
    if (teachers.length === 0) {
        html += `
            <tr>
                <td colspan="6" class="text-center">No teachers found.</td>
            </tr>
        `;
    } else {
        teachers.forEach(teacher => {
            html += `
                <tr>
                    <td>${teacher.id}</td>
                    <td>${teacher.firstName} ${teacher.lastName}</td>
                    <td>${teacher.specialization || '-'}</td>
                    <td>${teacher.assignedClass || '-'}</td>
                    <td>${teacher.phone}</td>
                    <td><span class="status-badge status-${teacher.status}">${capitalizeFirstLetter(teacher.status)}</span></td>
                </tr>
            `;
        });
    }
    
    html += `
                </tbody>
            </table>
        </div>
        
        <div class="report-footer">
            <p>Report generated on ${formatDate(new Date().toISOString().split('T')[0])}</p>
        </div>
    `;
    
    reportContent.innerHTML = html;
}

// Generate attendance report
function generateAttendanceReport(startDate, endDate) {
    const reportContent = document.getElementById('report-content');
    
    // Format dates for display
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    
    // In a real app, you would fetch attendance data from the server
    // For this demo, we'll generate random attendance data
    
    // Generate report HTML
    let html = `
        <div class="report-header">
            <h2>Teacher Attendance Report</h2>
            <p>Period: ${formattedStartDate} to ${formattedEndDate}</p>
        </div>
        
        <div class="report-summary">
            <p>This report shows the attendance records of all teachers for the selected period.</p>
            <p>Note: This is a demo with randomly generated data.</p>
        </div>
        
        <div class="report-table-container">
            <table class="report-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Present Days</th>
                        <th>Absent Days</th>
                        <th>Late Days</th>
                        <th>Attendance Rate</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    // Add teachers to table
    if (teachers.length === 0) {
        html += `
            <tr>
                <td colspan="6" class="text-center">No teachers found.</td>
            </tr>
        `;
    } else {
        // Calculate working days between start and end dates
        const workingDays = getWorkingDaysBetweenDates(new Date(startDate), new Date(endDate));
        
        teachers.forEach(teacher => {
            // Generate random attendance data
            const presentDays = Math.floor(Math.random() * (workingDays + 1));
            const lateDays = Math.floor(Math.random() * (workingDays - presentDays + 1));
            const absentDays = workingDays - presentDays - lateDays;
            const attendanceRate = Math.round((presentDays + lateDays) / workingDays * 100);
            
            html += `
                <tr>
                    <td>${teacher.id}</td>
                    <td>${teacher.firstName} ${teacher.lastName}</td>
                    <td>${presentDays}</td>
                    <td>${absentDays}</td>
                    <td>${lateDays}</td>
                    <td>${attendanceRate}%</td>
                </tr>
            `;
        });
    }
    
    html += `
                </tbody>
            </table>
        </div>
        
        <div class="report-footer">
            <p>Report generated on ${formatDate(new Date().toISOString().split('T')[0])}</p>
        </div>
    `;
    
    reportContent.innerHTML = html;
}

// Generate performance report
function generatePerformanceReport(startDate, endDate) {
    const reportContent = document.getElementById('report-content');
    
    // Format dates for display
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    
    // In a real app, you would fetch performance data from the server
    // For this demo, we'll generate random performance data
    
    // Generate report HTML
    let html = `
        <div class="report-header">
            <h2>Teacher Performance Report</h2>
            <p>Period: ${formattedStartDate} to ${formattedEndDate}</p>
        </div>
        
        <div class="report-summary">
            <p>This report shows the performance metrics of all teachers for the selected period.</p>
            <p>Note: This is a demo with randomly generated data.</p>
        </div>
        
        <div class="report-table-container">
            <table class="report-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Classes Taught</th>
                        <th>Students</th>
                        <th>Avg. Student Performance</th>
                        <th>Rating</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    // Add teachers to table
    if (teachers.length === 0) {
        html += `
            <tr>
                <td colspan="6" class="text-center">No teachers found.</td>
            </tr>
        `;
    } else {
        teachers.forEach(teacher => {
            // Generate random performance data
            const classesTaught = Math.floor(Math.random() * 5) + 1;
            const students = Math.floor(Math.random() * 150) + 20;
            const avgPerformance = Math.floor(Math.random() * 31) + 70; // 70-100%
            const rating = Math.floor(Math.random() * 2) + 4; // 4-5 stars
            
            html += `
                <tr>
                    <td>${teacher.id}</td>
                    <td>${teacher.firstName} ${teacher.lastName}</td>
                    <td>${classesTaught}</td>
                    <td>${students}</td>
                    <td>${avgPerformance}%</td>
                    <td>${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}</td>
                </tr>
            `;
        });
    }
    
    html += `
                </tbody>
            </table>
        </div>
        
        <div class="report-footer">
            <p>Report generated on ${formatDate(new Date().toISOString().split('T')[0])}</p>
        </div>
    `;
    
    reportContent.innerHTML = html;
}

// Generate summary report
function generateSummaryReport(startDate, endDate) {
    const reportContent = document.getElementById('report-content');
    
    // Format dates for display
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    
    // Generate report HTML
    let html = `
        <div class="report-header">
                        <h2>Teacher Summary Report</h2>
            <p>Period: ${formattedStartDate} to ${formattedEndDate}</p>
        </div>
        
        <div class="report-summary">
            <div class="summary-stats">
                <div class="stat-item">
                    <div class="stat-value">${teachers.length}</div>
                    <div class="stat-label">Total Teachers</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${teachers.filter(t => t.status === 'active').length}</div>
                    <div class="stat-label">Active Teachers</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${teachers.filter(t => t.status === 'inactive').length}</div>
                    <div class="stat-label">Inactive Teachers</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${teachers.filter(t => new Date(t.joinDate) >= new Date(startDate) && new Date(t.joinDate) <= new Date(endDate)).length}</div>
                    <div class="stat-label">New Hires</div>
                </div>
            </div>
        </div>
        
        <div class="report-section">
            <h3>Teacher Distribution by Specialization</h3>
            <div class="chart-placeholder">
                <p>Chart visualization would be displayed here in a real application.</p>
            </div>
        </div>
        
        <div class="report-section">
            <h3>Teacher Distribution by Experience</h3>
            <div class="chart-placeholder">
                <p>Chart visualization would be displayed here in a real application.</p>
            </div>
        </div>
        
        <div class="report-section">
            <h3>Recent Activities</h3>
            <ul class="activity-list">
                <li>Teacher evaluation completed for all staff - ${formatDate(new Date(endDate).toISOString().split('T')[0])}</li>
                <li>Professional development workshop conducted - ${formatDate(new Date(new Date(endDate).setDate(new Date(endDate).getDate() - 7)).toISOString().split('T')[0])}</li>
                <li>New curriculum training session - ${formatDate(new Date(new Date(endDate).setDate(new Date(endDate).getDate() - 14)).toISOString().split('T')[0])}</li>
            </ul>
        </div>
        
        <div class="report-footer">
            <p>Report generated on ${formatDate(new Date().toISOString().split('T')[0])}</p>
        </div>
    `;
    
    reportContent.innerHTML = html;
}

// Print report
function printReport() {
    const reportContent = document.getElementById('report-content');
    
    if (!reportContent.innerHTML) {
        showNotification('Please generate a report first.', 'error');
        return;
    }
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    // Write the report content to the new window
    printWindow.document.write(`
        <html>
        <head>
            <title>Teacher Report - Franciscan Catholic School</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                    color: #333;
                }
                .report-header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .report-header h2 {
                    margin-bottom: 5px;
                }
                .report-summary {
                    margin-bottom: 20px;
                }
                .summary-stats {
                    display: flex;
                    justify-content: space-around;
                    margin: 20px 0;
                    flex-wrap: wrap;
                }
                .stat-item {
                    text-align: center;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    min-width: 120px;
                }
                .stat-value {
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 5px;
                }
                .report-table-container {
                    margin-bottom: 20px;
                }
                .report-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .report-table th, .report-table td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                .report-table th {
                    background-color: #f2f2f2;
                }
                .report-footer {
                    margin-top: 30px;
                    text-align: center;
                    font-size: 12px;
                    color: #666;
                }
                .status-badge {
                    padding: 3px 8px;
                    border-radius: 12px;
                    font-size: 12px;
                }
                .status-active {
                    background-color: #E8F5E9;
                    color: #2E7D32;
                }
                .status-inactive {
                    background-color: #FFEBEE;
                    color: #C62828;
                }
                .chart-placeholder {
                    display: none;
                }
                .text-center {
                    text-align: center;
                }
                .report-section {
                    margin-bottom: 20px;
                }
                .activity-list {
                    padding-left: 20px;
                }
                .activity-list li {
                    margin-bottom: 5px;
                }
                @media print {
                    body {
                        margin: 0;
                        padding: 15px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="report-header">
                <h1>Franciscan Catholic Nursery & Primary School</h1>
                <h2>Teacher Report</h2>
            </div>
            ${reportContent.innerHTML}
        </body>
        </html>
    `);
    
    // Close the document for writing
    printWindow.document.close();
    
    // Focus on the new window
    printWindow.focus();
    
    // Print after a short delay to ensure content is loaded
    setTimeout(() => {
        printWindow.print();
    }, 500);
}

// Export report as PDF
function exportReportPdf() {
    // In a real application, this would use a library like jsPDF or call a server endpoint
    showNotification('PDF export functionality would be implemented in a real application.', 'info');
}

// Export report as Excel
function exportReportExcel() {
    // In a real application, this would use a library like SheetJS or call a server endpoint
    showNotification('Excel export functionality would be implemented in a real application.', 'info');
}

// Print teacher profile
function printTeacherProfile() {
    const teacher = teachers.find(t => t.id === currentTeacherId);
    
    if (!teacher) return;
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    // Write the profile content to the new window
    printWindow.document.write(`
        <html>
        <head>
            <title>Teacher Profile - ${teacher.firstName} ${teacher.lastName}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                    color: #333;
                }
                .profile-header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .profile-header h1 {
                    margin-bottom: 5px;
                }
                .profile-section {
                    margin-bottom: 30px;
                }
                .profile-section h2 {
                    border-bottom: 1px solid #ddd;
                    padding-bottom: 5px;
                    margin-bottom: 15px;
                }
                .info-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 15px;
                }
                .info-item {
                    margin-bottom: 10px;
                }
                .info-label {
                    font-weight: bold;
                    margin-bottom: 3px;
                }
                .status-badge {
                    padding: 3px 8px;
                    border-radius: 12px;
                    font-size: 12px;
                    display: inline-block;
                    margin-top: 5px;
                }
                .status-active {
                    background-color: #E8F5E9;
                    color: #2E7D32;
                }
                .status-inactive {
                    background-color: #FFEBEE;
                    color: #C62828;
                }
                .footer {
                    margin-top: 50px;
                    text-align: center;
                    font-size: 12px;
                    color: #666;
                }
                @media print {
                    body {
                        margin: 0;
                        padding: 15px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="profile-header">
                <h1>Franciscan Catholic Nursery & Primary School</h1>
                <h2>Teacher Profile</h2>
            </div>
            
            <div class="profile-section">
                <h2>Personal Information</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Full Name</div>
                        <div>${teacher.firstName} ${teacher.lastName}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Teacher ID</div>
                        <div>${teacher.id}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Gender</div>
                        <div>${teacher.gender}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Date of Birth</div>
                        <div>${formatDate(teacher.dob)}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Phone</div>
                        <div>${teacher.phone}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Email</div>
                        <div>${teacher.email}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Address</div>
                        <div>${teacher.address}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Status</div>
                        <div>
                            <span class="status-badge status-${teacher.status}">
                                ${capitalizeFirstLetter(teacher.status)}
                            </span>
                        </div>
                    </div