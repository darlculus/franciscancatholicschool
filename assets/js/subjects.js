/**
 * Subjects Management JavaScript
 * Franciscan Catholic Nursery & Primary School
 */

// Global variables
let subjects = [];
let categories = [];
let assignments = [];
let teachers = [];
let classes = [];
let currentSubjectId = null;
let currentCategoryId = null;
let currentAssignmentId = null;

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize date display
    updateDateDisplay();
    
    // Initialize sidebar toggle for mobile
    initSidebarToggle();
    
    // Initialize tabs
    initTabs();
    
    // Initialize modals
    initModals();
    
    // Initialize color pickers
    initColorPickers();
    
    // Initialize form submissions
    initFormSubmissions();
    
    // Load initial data
    loadSubjects();
    loadCategories();
    loadAssignments();
    loadTeachers();
    loadClasses();
    
    // Initialize search and filters
    initSearchAndFilters();
    
    // Show welcome notification
    setTimeout(() => {
        showNotification('Welcome to Subject Management', 'info');
    }, 1000);
});

// Update date display
function updateDateDisplay() {
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date();
        dateElement.textContent = today.toLocaleDateString('en-US', options);
    }
}

// Initialize sidebar toggle for mobile
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
    // Get all modals
    const modals = document.querySelectorAll('.modal');
    
    // Get all elements that open a modal
    const modalTriggers = document.querySelectorAll('[id$="-btn"]');
    
    // Get all elements that close a modal
    const closeButtons = document.querySelectorAll('.close-modal, .cancel-modal');
    
    // Add click event to all modal triggers
    modalTriggers.forEach(trigger => {
        if (trigger.id.includes('add-subject')) {
            trigger.addEventListener('click', function() {
                document.getElementById('add-subject-modal').classList.add('active');
            });
        } else if (trigger.id.includes('add-category')) {
            trigger.addEventListener('click', function() {
                document.getElementById('add-category-modal').classList.add('active');
            });
        } else if (trigger.id.includes('assign-subject')) {
            trigger.addEventListener('click', function() {
                document.getElementById('assign-subject-modal').classList.add('active');
                populateAssignmentDropdowns();
            });
        } else if (trigger.id.includes('add-first-subject')) {
            trigger.addEventListener('click', function() {
                document.getElementById('add-subject-modal').classList.add('active');
            });
        } else if (trigger.id.includes('add-first-category')) {
            trigger.addEventListener('click', function() {
                document.getElementById('add-category-modal').classList.add('active');
            });
        } else if (trigger.id.includes('create-first-assignment')) {
            trigger.addEventListener('click', function() {
                document.getElementById('assign-subject-modal').classList.add('active');
                populateAssignmentDropdowns();
            });
        }
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

// Initialize color pickers
function initColorPickers() {
    const colorOptions = document.querySelectorAll('.color-option');
    
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            const color = this.getAttribute('data-color');
            const container = this.closest('.form-group');
            
            // Remove selected class from all options in this container
            container.querySelectorAll('.color-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Update hidden input value
            const hiddenInput = container.querySelector('input[type="hidden"]');
            if (hiddenInput) {
                hiddenInput.value = color;
            }
        });
    });
}

// Initialize form submissions
function initFormSubmissions() {
    // Add Subject Form
    const addSubjectForm = document.getElementById('add-subject-form');
    if (addSubjectForm) {
        addSubjectForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form data
            const subjectName = document.getElementById('subject-name').value;
            const subjectCode = document.getElementById('subject-code').value;
            const subjectCategory = document.getElementById('subject-category').value;
            const subjectLevel = document.getElementById('subject-level').value;
            const subjectDescription = document.getElementById('subject-description').value;
            const subjectColor = document.getElementById('subject-color').value;
            
            // Create new subject object
            const newSubject = {
                id: generateId(),
                name: subjectName,
                code: subjectCode,
                category: subjectCategory,
                level: subjectLevel,
                description: subjectDescription,
                color: subjectColor,
                teacherCount: 0,
                classCount: 0,
                createdAt: new Date().toISOString()
            };
            
            // Add to subjects array
            subjects.push(newSubject);
            
            // Save to localStorage
            saveSubjects();
            
            // Reset form
            addSubjectForm.reset();
            
            // Close modal
            document.getElementById('add-subject-modal').classList.remove('active');
            
            // Refresh subjects list
            displaySubjects();
            
            // Show success notification
            showNotification(`Subject "${subjectName}" has been added successfully.`, 'success');
        });
    }
    
    // Edit Subject Form
    const editSubjectForm = document.getElementById('edit-subject-form');
    if (editSubjectForm) {
        editSubjectForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            if (!currentSubjectId) return;
            
            // Get form data
            const subjectName = document.getElementById('edit-subject-name').value;
            const subjectCode = document.getElementById('edit-subject-code').value;
            const subjectCategory = document.getElementById('edit-subject-category').value;
            const subjectLevel = document.getElementById('edit-subject-level').value;
            const subjectDescription = document.getElementById('edit-subject-description').value;
            const subjectColor = document.getElementById('edit-subject-color').value;
            
            // Find subject index
            const subjectIndex = subjects.findIndex(subject => subject.id === currentSubjectId);
            
            if (subjectIndex !== -1) {
                // Update subject
                subjects[subjectIndex] = {
                    ...subjects[subjectIndex],
                    name: subjectName,
                    code: subjectCode,
                    category: subjectCategory,
                    level: subjectLevel,
                    description: subjectDescription,
                    color: subjectColor,
                    updatedAt: new Date().toISOString()
                };
                
                // Save to localStorage
                saveSubjects();
                
                // Reset form
                editSubjectForm.reset();
                
                // Close modal
                document.getElementById('edit-subject-modal').classList.remove('active');
                
                // Refresh subjects list
                displaySubjects();
                
                // Show success notification
                showNotification(`Subject "${subjectName}" has been updated successfully.`, 'success');
            }
        });
    }
    
    // Add Category Form
    const addCategoryForm = document.getElementById('add-category-form');
    if (addCategoryForm) {
        addCategoryForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form data
            const categoryName = document.getElementById('category-name').value;
            const categoryDescription = document.getElementById('category-description').value;
            const categoryWeight = document.getElementById('category-weight').value;
            
            // Create new category object
            const newCategory = {
                id: generateId(),
                name: categoryName,
                description: categoryDescription,
                weight: parseFloat(categoryWeight),
                subjectCount: 0,
                createdAt: new Date().toISOString()
            };
            
            // Add to categories array
            categories.push(newCategory);
            
            // Save to localStorage
            saveCategories();
            
            // Reset form
            addCategoryForm.reset();
            
            // Close modal
            document.getElementById('add-category-modal').classList.remove('active');
            
            // Refresh categories list
            displayCategories();
            
            // Show success notification
            showNotification(`Category "${categoryName}" has been added successfully.`, 'success');
        });
    }
    
    // Assign Subject Form
    const assignSubjectForm = document.getElementById('assign-subject-form');
    if (assignSubjectForm) {
        assignSubjectForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form data
            const subjectId = document.getElementById('assign-subject').value;
            const classId = document.getElementById('assign-class').value;
            const teacherId = document.getElementById('assign-teacher').value;
            const notes = document.getElementById('assignment-notes').value;
            
            // Get schedule data
            const scheduleDays = document.querySelectorAll('input[name="schedule-day"]:checked');
            const schedule = [];
            
            scheduleDays.forEach(day => {
                const dayValue = day.value;
                const timeValue = document.querySelector(`select[name="${dayValue}-time"]`).value;
                
                if (timeValue) {
                    schedule.push({
                        day: dayValue,
                        time: timeValue
                    });
                }
            });
            
            // Find subject, class and teacher
            const subject = subjects.find(s => s.id === subjectId);
            const classObj = classes.find(c => c.id === classId);
            const teacher = teachers.find(t => t.id === teacherId);
            
            if (!subject || !classObj || !teacher) {
                showNotification('Please select a valid subject, class and teacher.', 'error');
                return;
            }
            
            // Create new assignment object
            const newAssignment = {
                id: generateId(),
                subjectId,
                subjectName: subject.name,
                classId,
                className: classObj.name,
                teacherId,
                teacherName: teacher.name,
                schedule,
                notes,
                status: 'active',
                createdAt: new Date().toISOString()
            };
            
            // Add to assignments array
            assignments.push(newAssignment);
            
            // Update subject stats
            updateSubjectStats();
            
            // Save to localStorage
            saveAssignments();
            
            // Reset form
            assignSubjectForm.reset();
            
            // Close modal
            document.getElementById('assign-subject-modal').classList.remove('active');
            
            // Refresh assignments list
            displayAssignments();
            
            // Show success notification
            showNotification(`Subject "${subject.name}" has been assigned to ${teacher.name} for ${classObj.name}.`, 'success');
        });
    }
    
    // General Settings Form
    const generalSettingsForm = document.getElementById('general-settings-form');
    if (generalSettingsForm) {
        generalSettingsForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form data
            const maxSubjectsPerClass = document.getElementById('max-subjects-per-class').value;
            const minSubjectsPerClass = document.getElementById('min-subjects-per-class').value;
            const defaultSubjectDuration = document.getElementById('default-subject-duration').value;
            const gradingSystem = document.getElementById('grading-system').value;
            
            // Create settings object
            const settings = {
                maxSubjectsPerClass: parseInt(maxSubjectsPerClass),
                minSubjectsPerClass: parseInt(minSubjectsPerClass),
                defaultSubjectDuration: parseInt(defaultSubjectDuration),
                gradingSystem
            };
            
            // Save to localStorage
            localStorage.setItem('subjectSettings', JSON.stringify(settings));
            
            // Show success notification
            showNotification('Subject settings have been saved successfully.', 'success');
        });
    }
    
    // Subject Weighting Form
    const subjectWeightingForm = document.getElementById('subject-weighting-form');
    if (subjectWeightingForm) {
        subjectWeightingForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form data
            const coreSubjectWeight = document.getElementById('core-subject-weight').value;
            const electiveSubjectWeight = document.getElementById('elective-subject-weight').value;
            const vocationalSubjectWeight = document.getElementById('vocational-subject-weight').value;
            
            // Create weights object
            const weights = {
                Core: parseFloat(coreSubjectWeight),
                Elective: parseFloat(electiveSubjectWeight),
                Vocational: parseFloat(vocationalSubjectWeight)
            };
            
            // Save to localStorage
            localStorage.setItem('subjectWeights', JSON.stringify(weights));
            
            // Show success notification
            showNotification('Subject weights have been saved successfully.', 'success');
        });
    }
    
    // Reset Settings Button
    const resetSettingsBtn = document.getElementById('reset-settings-btn');
    if (resetSettingsBtn) {
        resetSettingsBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to reset all subject settings to default values?')) {
                // Default settings
                const defaultSettings = {
                    maxSubjectsPerClass: 12,
                    minSubjectsPerClass: 6,
                    defaultSubjectDuration: 45,
                    gradingSystem: 'percentage'
                };
                
                // Save to localStorage
                localStorage.setItem('subjectSettings', JSON.stringify(defaultSettings));
                
                // Update form values
                document.getElementById('max-subjects-per-class').value = defaultSettings.maxSubjectsPerClass;
                document.getElementById('min-subjects-per-class').value = defaultSettings.minSubjectsPerClass;
                document.getElementById('default-subject-duration').value = defaultSettings.defaultSubjectDuration;
                document.getElementById('grading-system').value = defaultSettings.gradingSystem;
                
                // Show success notification
                showNotification('Settings have been reset to default values.', 'success');
            }
        });
    }
}

// Initialize search and filters
function initSearchAndFilters() {
    // Subject Search
    const subjectSearch = document.getElementById('subject-search');
    if (subjectSearch) {
        subjectSearch.addEventListener('input', function() {
            filterSubjects();
        });
    }
    
    // Level Filter
    const levelFilter = document.getElementById('level-filter');
    if (levelFilter) {
        levelFilter.addEventListener('change', function() {
            filterSubjects();
        });
    }
    
    // Category Filter
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            filterSubjects();
        });
    }
    
    // Category Search
    const categorySearch = document.getElementById('category-search');
    if (categorySearch) {
        categorySearch.addEventListener('input', function() {
            filterCategories();
        });
    }
    
        // Assignment Search
    const assignmentSearch = document.getElementById('assignment-search');
    if (assignmentSearch) {
        assignmentSearch.addEventListener('input', function() {
            filterAssignments();
        });
    }
    
    // Class Filter
    const classFilter = document.getElementById('class-filter');
    if (classFilter) {
        classFilter.addEventListener('change', function() {
            filterAssignments();
        });
    }
    
    // Teacher Filter
    const teacherFilter = document.getElementById('teacher-filter');
    if (teacherFilter) {
        teacherFilter.addEventListener('change', function() {
            filterAssignments();
        });
    }
}

// Load subjects from localStorage
function loadSubjects() {
    const storedSubjects = localStorage.getItem('subjects');
    if (storedSubjects) {
        subjects = JSON.parse(storedSubjects);
    } else {
        // Load sample subjects if none exist
        subjects = getSampleSubjects();
        saveSubjects();
    }
    
    displaySubjects();
}

// Load categories from localStorage
function loadCategories() {
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
        categories = JSON.parse(storedCategories);
    } else {
        // Load sample categories if none exist
        categories = getSampleCategories();
        saveCategories();
    }
    
    displayCategories();
}

// Load assignments from localStorage
function loadAssignments() {
    const storedAssignments = localStorage.getItem('subjectAssignments');
    if (storedAssignments) {
        assignments = JSON.parse(storedAssignments);
    } else {
        // Initialize empty array
        assignments = [];
    }
    
    displayAssignments();
}

// Load teachers from localStorage
function loadTeachers() {
    const storedTeachers = localStorage.getItem('teachers');
    if (storedTeachers) {
        teachers = JSON.parse(storedTeachers);
    } else {
        // Load sample teachers if none exist
        teachers = getSampleTeachers();
        localStorage.setItem('teachers', JSON.stringify(teachers));
    }
}

// Load classes from localStorage
function loadClasses() {
    const storedClasses = localStorage.getItem('classes');
    if (storedClasses) {
        classes = JSON.parse(storedClasses);
    } else {
        // Load sample classes if none exist
        classes = getSampleClasses();
        localStorage.setItem('classes', JSON.stringify(classes));
    }
}

// Save subjects to localStorage
function saveSubjects() {
    localStorage.setItem('subjects', JSON.stringify(subjects));
}

// Save categories to localStorage
function saveCategories() {
    localStorage.setItem('categories', JSON.stringify(categories));
}

// Save assignments to localStorage
function saveAssignments() {
    localStorage.setItem('subjectAssignments', JSON.stringify(assignments));
}

// Display subjects in the grid
function displaySubjects() {
    const subjectsGrid = document.querySelector('.subjects-grid');
    const noSubjectsMessage = document.getElementById('no-subjects-message');
    
    if (!subjectsGrid) return;
    
    if (subjects.length === 0) {
        subjectsGrid.innerHTML = '';
        if (noSubjectsMessage) {
            noSubjectsMessage.style.display = 'block';
        }
        return;
    }
    
    if (noSubjectsMessage) {
        noSubjectsMessage.style.display = 'none';
    }
    
    // Sort subjects by name
    const sortedSubjects = [...subjects].sort((a, b) => a.name.localeCompare(b.name));
    
    subjectsGrid.innerHTML = '';
    
    sortedSubjects.forEach(subject => {
        const subjectCard = document.createElement('div');
        subjectCard.className = 'subject-card';
        
        subjectCard.innerHTML = `
            <div class="subject-header" style="background-color: ${subject.color};">
                <div class="subject-actions">
                    <button class="subject-action-btn edit-subject-btn" data-id="${subject.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="subject-action-btn delete-subject-btn" data-id="${subject.id}" data-name="${subject.name}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
                <div class="subject-name">${subject.name}</div>
                <div class="subject-code">${subject.code}</div>
            </div>
            <div class="subject-body">
                <div class="subject-info">
                    <span class="subject-level">${subject.level}</span>
                    <span class="subject-category">${subject.category}</span>
                </div>
                <div class="subject-description">${subject.description || 'No description available.'}</div>
            </div>
            <div class="subject-footer">
                <div class="subject-teachers">
                    <i class="fas fa-chalkboard-teacher"></i> ${subject.teacherCount || 0} Teachers
                </div>
                <div class="subject-classes">
                    <i class="fas fa-school"></i> ${subject.classCount || 0} Classes
                </div>
            </div>
        `;
        
        subjectsGrid.appendChild(subjectCard);
    });
    
    // Add event listeners to edit and delete buttons
    addSubjectCardEventListeners();
}

// Display categories in the container
function displayCategories() {
    const categoriesContainer = document.querySelector('.categories-container');
    const noCategoriesMessage = document.getElementById('no-categories-message');
    
    if (!categoriesContainer) return;
    
    if (categories.length === 0) {
        categoriesContainer.innerHTML = '';
        if (noCategoriesMessage) {
            noCategoriesMessage.style.display = 'block';
        }
        return;
    }
    
    if (noCategoriesMessage) {
        noCategoriesMessage.style.display = 'none';
    }
    
    // Sort categories by name
    const sortedCategories = [...categories].sort((a, b) => a.name.localeCompare(b.name));
    
    categoriesContainer.innerHTML = '';
    
    sortedCategories.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        
        categoryCard.innerHTML = `
            <div class="category-header">
                <div class="category-name">${category.name}</div>
                <div class="category-actions">
                    <button class="category-action-btn edit-category-btn" data-id="${category.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="category-action-btn delete-category-btn" data-id="${category.id}" data-name="${category.name}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
            <div class="category-body">
                <div class="category-description">${category.description || 'No description available.'}</div>
                <div class="category-stats">
                    <div class="category-stat">
                        <div class="stat-value">${category.subjectCount || 0}</div>
                        <div class="stat-label">Subjects</div>
                    </div>
                </div>
                <div class="category-weight">
                    <div class="weight-label">Weight Factor:</div>
                    <div class="weight-value">${category.weight}</div>
                </div>
            </div>
        `;
        
        categoriesContainer.appendChild(categoryCard);
    });
    
    // Add event listeners to edit and delete buttons
    addCategoryCardEventListeners();
}

// Display assignments in the table
function displayAssignments() {
    const assignmentsTable = document.getElementById('assignments-table');
    const noAssignmentsMessage = document.getElementById('no-assignments-message');
    
    if (!assignmentsTable) return;
    
    const tableBody = assignmentsTable.querySelector('tbody');
    
    if (assignments.length === 0) {
        tableBody.innerHTML = '';
        if (noAssignmentsMessage) {
            noAssignmentsMessage.style.display = 'block';
        }
        assignmentsTable.style.display = 'none';
        return;
    }
    
    if (noAssignmentsMessage) {
        noAssignmentsMessage.style.display = 'none';
    }
    assignmentsTable.style.display = 'table';
    
    // Sort assignments by subject name
    const sortedAssignments = [...assignments].sort((a, b) => a.subjectName.localeCompare(b.subjectName));
    
    tableBody.innerHTML = '';
    
    sortedAssignments.forEach(assignment => {
        const scheduleText = assignment.schedule.map(s => `${capitalizeFirstLetter(s.day)}: ${s.time}`).join('<br>');
        
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${assignment.subjectName}</td>
            <td>${assignment.className}</td>
            <td>${assignment.teacherName}</td>
            <td>${scheduleText || 'Not scheduled'}</td>
            <td>
                <span class="assignment-status status-${assignment.status}">
                    ${capitalizeFirstLetter(assignment.status)}
                </span>
            </td>
            <td>
                <div class="assignment-actions">
                    <button class="assignment-action-btn edit-assignment-btn" data-id="${assignment.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="assignment-action-btn delete-assignment-btn" data-id="${assignment.id}" data-subject="${assignment.subjectName}" data-class="${assignment.className}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listeners to edit and delete buttons
    addAssignmentRowEventListeners();
}

// Add event listeners to subject card buttons
function addSubjectCardEventListeners() {
    // Edit Subject Buttons
    const editButtons = document.querySelectorAll('.edit-subject-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const subjectId = this.getAttribute('data-id');
            openEditSubjectModal(subjectId);
        });
    });
    
    // Delete Subject Buttons
    const deleteButtons = document.querySelectorAll('.delete-subject-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const subjectId = this.getAttribute('data-id');
            const subjectName = this.getAttribute('data-name');
            openDeleteConfirmationModal('subject', subjectId, subjectName);
        });
    });
}

// Add event listeners to category card buttons
function addCategoryCardEventListeners() {
    // Edit Category Buttons
    const editButtons = document.querySelectorAll('.edit-category-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const categoryId = this.getAttribute('data-id');
            // Implement edit category functionality
            console.log('Edit category:', categoryId);
        });
    });
    
    // Delete Category Buttons
    const deleteButtons = document.querySelectorAll('.delete-category-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const categoryId = this.getAttribute('data-id');
            const categoryName = this.getAttribute('data-name');
            openDeleteConfirmationModal('category', categoryId, categoryName);
        });
    });
}

// Add event listeners to assignment row buttons
function addAssignmentRowEventListeners() {
    // Edit Assignment Buttons
    const editButtons = document.querySelectorAll('.edit-assignment-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const assignmentId = this.getAttribute('data-id');
            // Implement edit assignment functionality
            console.log('Edit assignment:', assignmentId);
        });
    });
    
    // Delete Assignment Buttons
    const deleteButtons = document.querySelectorAll('.delete-assignment-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const assignmentId = this.getAttribute('data-id');
            const subjectName = this.getAttribute('data-subject');
            const className = this.getAttribute('data-class');
            openDeleteConfirmationModal('assignment', assignmentId, `${subjectName} for ${className}`);
        });
    });
}

// Open edit subject modal
function openEditSubjectModal(subjectId) {
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return;
    
    // Set current subject ID
    currentSubjectId = subjectId;
    
    // Populate form fields
    document.getElementById('edit-subject-name').value = subject.name;
    document.getElementById('edit-subject-code').value = subject.code;
    document.getElementById('edit-subject-category').value = subject.category;
    document.getElementById('edit-subject-level').value = subject.level;
    document.getElementById('edit-subject-description').value = subject.description || '';
    document.getElementById('edit-subject-color').value = subject.color;
    
    // Select the color option
    const colorOptions = document.querySelectorAll('#edit-subject-modal .color-option');
    colorOptions.forEach(option => {
        option.classList.remove('selected');
        if (option.getAttribute('data-color') === subject.color) {
            option.classList.add('selected');
        }
    });
    
    // Open the modal
    document.getElementById('edit-subject-modal').classList.add('active');
}

// Open delete confirmation modal
function openDeleteConfirmationModal(type, id, name) {
    const modal = document.getElementById('delete-confirmation-modal');
    const message = document.getElementById('delete-confirmation-message');
    const confirmButton = document.getElementById('confirm-delete-btn');
    
    // Set message based on type
    message.textContent = `Are you sure you want to delete the ${type} "${name}"? This action cannot be undone.`;
    
    // Set up confirm button
    confirmButton.onclick = function() {
        if (type === 'subject') {
            deleteSubject(id);
        } else if (type === 'category') {
            deleteCategory(id);
        } else if (type === 'assignment') {
            deleteAssignment(id);
        }
        
        // Close modal
        modal.classList.remove('active');
    };
    
    // Open the modal
    modal.classList.add('active');
}

// Delete subject
function deleteSubject(subjectId) {
    const subjectIndex = subjects.findIndex(s => s.id === subjectId);
    if (subjectIndex === -1) return;
    
    const subjectName = subjects[subjectIndex].name;
    
    // Remove subject
    subjects.splice(subjectIndex, 1);
    
    // Remove related assignments
    assignments = assignments.filter(a => a.subjectId !== subjectId);
    
    // Save changes
    saveSubjects();
    saveAssignments();
    
    // Update displays
    displaySubjects();
    displayAssignments();
    
        // Show notification
    showNotification(`Subject "${subjectName}" has been deleted successfully.`, 'success');
}

// Delete category
function deleteCategory(categoryId) {
    const categoryIndex = categories.findIndex(c => c.id === categoryId);
    if (categoryIndex === -1) return;
    
    const categoryName = categories[categoryIndex].name;
    
    // Remove category
    categories.splice(categoryIndex, 1);
    
    // Save changes
    saveCategories();
    
    // Update displays
    displayCategories();
    
    // Show notification
    showNotification(`Category "${categoryName}" has been deleted successfully.`, 'success');
}

// Delete assignment
function deleteAssignment(assignmentId) {
    const assignmentIndex = assignments.findIndex(a => a.id === assignmentId);
    if (assignmentIndex === -1) return;
    
    const assignment = assignments[assignmentIndex];
    
    // Remove assignment
    assignments.splice(assignmentIndex, 1);
    
    // Update subject stats
    updateSubjectStats();
    
    // Save changes
    saveAssignments();
    
    // Update displays
    displayAssignments();
    displaySubjects();
    
    // Show notification
    showNotification(`Assignment for "${assignment.subjectName}" in ${assignment.className} has been deleted successfully.`, 'success');
}

// Filter subjects based on search and filters
function filterSubjects() {
    const searchTerm = document.getElementById('subject-search').value.toLowerCase();
    const levelFilter = document.getElementById('level-filter').value;
    const categoryFilter = document.getElementById('category-filter').value;
    
    const subjectCards = document.querySelectorAll('.subject-card');
    
    subjectCards.forEach(card => {
        const subjectName = card.querySelector('.subject-name').textContent.toLowerCase();
        const subjectCode = card.querySelector('.subject-code').textContent.toLowerCase();
        const subjectLevel = card.querySelector('.subject-level').textContent;
        const subjectCategory = card.querySelector('.subject-category').textContent;
        
        const matchesSearch = subjectName.includes(searchTerm) || subjectCode.includes(searchTerm);
        const matchesLevel = levelFilter === '' || subjectLevel === levelFilter;
        const matchesCategory = categoryFilter === '' || subjectCategory === categoryFilter;
        
        if (matchesSearch && matchesLevel && matchesCategory) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Filter categories based on search
function filterCategories() {
    const searchTerm = document.getElementById('category-search').value.toLowerCase();
    
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        const categoryName = card.querySelector('.category-name').textContent.toLowerCase();
        const categoryDescription = card.querySelector('.category-description').textContent.toLowerCase();
        
        if (categoryName.includes(searchTerm) || categoryDescription.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Filter assignments based on search and filters
function filterAssignments() {
    const searchTerm = document.getElementById('assignment-search').value.toLowerCase();
    const classFilter = document.getElementById('class-filter').value;
    const teacherFilter = document.getElementById('teacher-filter').value;
    
    const assignmentRows = document.querySelectorAll('#assignments-table tbody tr');
    
    assignmentRows.forEach(row => {
        const subjectName = row.cells[0].textContent.toLowerCase();
        const className = row.cells[1].textContent;
        const teacherName = row.cells[2].textContent;
        
        const matchesSearch = subjectName.includes(searchTerm);
        const matchesClass = classFilter === '' || className === classFilter;
        const matchesTeacher = teacherFilter === '' || teacherName === teacherFilter;
        
        if (matchesSearch && matchesClass && matchesTeacher) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Populate assignment dropdowns
function populateAssignmentDropdowns() {
    const subjectSelect = document.getElementById('assign-subject');
    const classSelect = document.getElementById('assign-class');
    const teacherSelect = document.getElementById('assign-teacher');
    
    if (!subjectSelect || !classSelect || !teacherSelect) return;
    
    // Clear existing options
    subjectSelect.innerHTML = '<option value="">Select Subject</option>';
    classSelect.innerHTML = '<option value="">Select Class</option>';
    teacherSelect.innerHTML = '<option value="">Select Teacher</option>';
    
    // Add subject options
    subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject.id;
        option.textContent = `${subject.name} (${subject.code})`;
        subjectSelect.appendChild(option);
    });
    
    // Add class options
    classes.forEach(cls => {
        const option = document.createElement('option');
        option.value = cls.id;
        option.textContent = cls.name;
        classSelect.appendChild(option);
    });
    
    // Add teacher options
    teachers.forEach(teacher => {
        const option = document.createElement('option');
        option.value = teacher.id;
        option.textContent = teacher.name;
        teacherSelect.appendChild(option);
    });
}

// Update subject statistics
function updateSubjectStats() {
    // Reset counts
    subjects.forEach(subject => {
        subject.teacherCount = 0;
        subject.classCount = 0;
    });
    
        // Count assignments
    assignments.forEach(assignment => {
        const subject = subjects.find(s => s.id === assignment.subjectId);
        if (subject) {
            // Count unique teachers
            if (!subject.teachers) subject.teachers = [];
            if (!subject.teachers.includes(assignment.teacherId)) {
                subject.teachers.push(assignment.teacherId);
                subject.teacherCount = subject.teachers.length;
            }
            
            // Count unique classes
            if (!subject.classes) subject.classes = [];
            if (!subject.classes.includes(assignment.classId)) {
                subject.classes.push(assignment.classId);
                subject.classCount = subject.classes.length;
            }
        }
    });
    
    // Update category counts
    categories.forEach(category => {
        category.subjectCount = subjects.filter(s => s.category === category.name).length;
    });
    
    // Save changes
    saveSubjects();
    saveCategories();
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    // Set notification content and type
    notification.textContent = message;
    notification.className = `notification notification-${type}`;
    
    // Show notification
    notification.classList.add('show');
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Generate a unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Capitalize first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Get sample subjects
function getSampleSubjects() {
    return [
        {
            id: 'sub1',
            name: 'Mathematics',
            code: 'MATH101',
            category: 'Core',
            level: 'All Levels',
                        description: 'Basic mathematics including arithmetic, algebra, geometry, and problem-solving skills.',
            color: '#4CAF50',
            teacherCount: 3,
            classCount: 6,
            createdAt: new Date().toISOString()
        },
        {
            id: 'sub2',
            name: 'English Language',
            code: 'ENG101',
            category: 'Core',
            level: 'All Levels',
            description: 'Reading, writing, speaking, and listening skills in English language.',
            color: '#2196F3',
            teacherCount: 4,
            classCount: 6,
            createdAt: new Date().toISOString()
        },
        {
            id: 'sub3',
            name: 'Science',
            code: 'SCI101',
            category: 'Core',
            level: 'Primary',
            description: 'Introduction to basic scientific concepts and principles.',
            color: '#FF9800',
            teacherCount: 2,
            classCount: 4,
            createdAt: new Date().toISOString()
        },
        {
            id: 'sub4',
            name: 'Social Studies',
            code: 'SOC101',
            category: 'Core',
            level: 'Primary',
            description: 'Study of society, relationships, and the development of skills to participate in society.',
            color: '#9C27B0',
            teacherCount: 2,
            classCount: 4,
            createdAt: new Date().toISOString()
        },
        {
            id: 'sub5',
            name: 'Religious Studies',
            code: 'REL101',
            category: 'Core',
            level: 'All Levels',
            description: 'Catholic religious education and moral values.',
            color: '#F44336',
            teacherCount: 2,
            classCount: 6,
            createdAt: new Date().toISOString()
        },
        {
            id: 'sub6',
            name: 'Physical Education',
            code: 'PE101',
            category: 'Core',
            level: 'All Levels',
            description: 'Physical activities, games, and sports to promote health and fitness.',
            color: '#009688',
            teacherCount: 1,
            classCount: 6,
            createdAt: new Date().toISOString()
        },
        {
            id: 'sub7',
            name: 'Art & Craft',
            code: 'ART101',
            category: 'Elective',
            level: 'All Levels',
            description: 'Creative expression through various art forms and crafts.',
            color: '#673AB7',
            teacherCount: 1,
            classCount: 6,
            createdAt: new Date().toISOString()
        },
        {
            id: 'sub8',
            name: 'Music',
            code: 'MUS101',
            category: 'Elective',
            level: 'All Levels',
            description: 'Music appreciation, singing, and basic instrument playing.',
            color: '#3F51B5',
            teacherCount: 1,
            classCount: 6,
            createdAt: new Date().toISOString()
        }
    ];
}

// Get sample categories
function getSampleCategories() {
    return [
        {
            id: 'cat1',
            name: 'Core',
            description: 'Essential subjects that form the foundation of the curriculum.',
            weight: 1.5,
            subjectCount: 5,
            createdAt: new Date().toISOString()
        },
        {
            id: 'cat2',
            name: 'Elective',
            description: 'Optional subjects that students can choose based on their interests.',
            weight: 1.0,
            subjectCount: 2,
            createdAt: new Date().toISOString()
        },
        {
            id: 'cat3',
            name: 'Vocational',
            description: 'Practical subjects that teach specific skills for future careers.',
            weight: 1.2,
            subjectCount: 0,
            createdAt: new Date().toISOString()
        }
    ];
}

// Get sample teachers
function getSampleTeachers() {
    return [
        {
            id: 'teacher1',
            name: 'Mrs. Johnson',
            email: 'johnson@example.com',
            phone: '08012345678',
            subject: 'Mathematics',
            createdAt: new Date().toISOString()
        },
        {
            id: 'teacher2',
            name: 'Mr. Smith',
            email: 'smith@example.com',
            phone: '08023456789',
            subject: 'English Language',
            createdAt: new Date().toISOString()
        },
        {
            id: 'teacher3',
            name: 'Ms. Williams',
            email: 'williams@example.com',
            phone: '08034567890',
            subject: 'Science',
            createdAt: new Date().toISOString()
        },
        {
            id: 'teacher4',
            name: 'Mr. Brown',
            email: 'brown@example.com',
            phone: '08045678901',
            subject: 'Social Studies',
            createdAt: new Date().toISOString()
        },
        {
            id: 'teacher5',
            name: 'Sister Mary',
            email: 'mary@example.com',
            phone: '08056789012',
            subject: 'Religious Studies',
            createdAt: new Date().toISOString()
        }
    ];
}

// Get sample classes
function getSampleClasses() {
    return [
        {
            id: 'class1',
            name: 'Nursery 1',
            level: 'Nursery',
            capacity: 20,
            teacher: 'Mrs. Johnson',
            createdAt: new Date().toISOString()
        },
        {
            id: 'class2',
            name: 'Nursery 2',
            level: 'Nursery',
            capacity: 20,
            teacher: 'Ms. Williams',
            createdAt: new Date().toISOString()
        },
        {
            id: 'class3',
            name: 'Primary 1',
            level: 'Primary',
            capacity: 25,
            teacher: 'Mr. Smith',
            createdAt: new Date().toISOString()
        },
        {
            id: 'class4',
            name: 'Primary 2',
            level: 'Primary',
            capacity: 25,
            teacher: 'Mr. Brown',
            createdAt: new Date().toISOString()
        },
        {
            id: 'class5',
            name: 'Primary 3',
            level: 'Primary',
            capacity: 25,
            teacher: 'Sister Mary',
            createdAt: new Date().toISOString()
        },
        {
            id: 'class6',
            name: 'Primary 4',
            level: 'Primary',
            capacity: 25,
            teacher: 'Mrs. Johnson',
            createdAt: new Date().toISOString()
        }
    ];
}

// Load settings when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Load subject settings
    const storedSettings = localStorage.getItem('subjectSettings');
    if (storedSettings) {
        const settings = JSON.parse(storedSettings);
        
        // Update form values
        const maxSubjectsInput = document.getElementById('max-subjects-per-class');
        const minSubjectsInput = document.getElementById('min-subjects-per-class');
        const defaultDurationInput = document.getElementById('default-subject-duration');
        const gradingSystemSelect = document.getElementById('grading-system');
        
        if (maxSubjectsInput) maxSubjectsInput.value = settings.maxSubjectsPerClass;
        if (minSubjectsInput) minSubjectsInput.value = settings.minSubjectsPerClass;
        if (defaultDurationInput) defaultDurationInput.value = settings.defaultSubjectDuration;
        if (gradingSystemSelect) gradingSystemSelect.value = settings.gradingSystem;
    }
    
    // Load subject weights
    const storedWeights = localStorage.getItem('subjectWeights');
    if (storedWeights) {
        const weights = JSON.parse(storedWeights);
        
        // Update form values
        const coreWeightInput = document.getElementById('core-subject-weight');
        const electiveWeightInput = document.getElementById('elective-subject-weight');
        const vocationalWeightInput = document.getElementById('vocational-subject-weight');
        
        if (coreWeightInput) coreWeightInput.value = weights.Core;
        if (electiveWeightInput) electiveWeightInput.value = weights.Elective;
        if (vocationalWeightInput) vocationalWeightInput.value = weights.Vocational;
    }
});



