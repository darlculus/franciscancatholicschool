/**
 * Assignments Management JavaScript
 * Franciscan Catholic Nursery & Primary School
 */

// Global variables
let assignments = [];
let templates = [];
let currentTab = 'preparation';
let currentMonth = new Date();

// Initialize the page
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
    
    // Initialize date display
    updateDateDisplay();
    
    // Initialize sidebar toggle for mobile
    initSidebarToggle();
    
    // Initialize tabs
    initTabs();
    
    // Initialize modals
    initModals();
    
    // Initialize calendar
    initCalendar();
    
    // Initialize form validations
    initFormValidations();
    
    // Initialize file uploads
    initFileUploads();
    
    // Initialize event listeners
    initEventListeners();
});

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

// Initialize tabs
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to current button and pane
            this.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
            
            // Update current tab
            currentTab = tabId;
        });
    });
}

// Initialize modals
function initModals() {
    // Create Assignment Modal
    const createAssignmentBtn = document.getElementById('create-assignment-btn');
    const closeAssignmentModal = document.getElementById('close-assignment-modal');
    const assignmentModal = document.getElementById('create-assignment-modal');
    const cancelAssignment = document.getElementById('cancel-assignment');
    
    if (createAssignmentBtn) {
        createAssignmentBtn.addEventListener('click', function() {
            assignmentModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeAssignmentModal) {
        closeAssignmentModal.addEventListener('click', function() {
            assignmentModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    if (cancelAssignment) {
        cancelAssignment.addEventListener('click', function() {
            assignmentModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Guide Modal
    const viewGuideBtn = document.getElementById('view-guide-btn');
    const closeGuideModal = document.getElementById('close-guide-modal');
    const guideModal = document.getElementById('guide-modal');
    
    if (viewGuideBtn) {
        viewGuideBtn.addEventListener('click', function() {
            guideModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeGuideModal) {
        closeGuideModal.addEventListener('click', function() {
            guideModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Template Modal
    const createTemplateBtn = document.getElementById('create-template-btn');
    const closeTemplateModal = document.getElementById('close-template-modal');
    const templateModal = document.getElementById('template-modal');
    
    if (createTemplateBtn) {
        createTemplateBtn.addEventListener('click', function() {
            templateModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeTemplateModal) {
        closeTemplateModal.addEventListener('click', function() {
            templateModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Rubric Modal
    const createRubricBtn = document.getElementById('create-rubric-btn');
    const closeRubricModal = document.getElementById('close-rubric-modal');
    const rubricModal = document.getElementById('rubric-modal');
    const cancelRubric = document.getElementById('cancel-rubric');
    
    if (createRubricBtn) {
        createRubricBtn.addEventListener('click', function() {
            rubricModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeRubricModal) {
        closeRubricModal.addEventListener('click', function() {
            rubricModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    if (cancelRubric) {
        cancelRubric.addEventListener('click', function() {
            rubricModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === assignmentModal) {
            assignmentModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        
        if (event.target === guideModal) {
            guideModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        
        if (event.target === templateModal) {
            templateModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        
        if (event.target === rubricModal) {
            rubricModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Initialize calendar
function initCalendar() {
    const calendarDays = document.getElementById('calendar-days');
    const calendarMonth = document.getElementById('calendar-month');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    
    if (!calendarDays || !calendarMonth) return;
    
    // Render calendar
    renderCalendar();
    
    // Previous month button
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', function() {
            currentMonth.setMonth(currentMonth.getMonth() - 1);
            renderCalendar();
        });
    }
    
    // Next month button
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', function() {
            currentMonth.setMonth(currentMonth.getMonth() + 1);
            renderCalendar();
        });
    }
    
    function renderCalendar() {
        if (!calendarDays || !calendarMonth) return;
        
        calendarDays.innerHTML = '';
        
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        
        // Set calendar month title
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        calendarMonth.textContent = `${monthNames[month]} ${year}`;
        
        // Get first day of month and last day of month
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        // Get day of week for first day (0 = Sunday, 6 = Saturday)
        const firstDayIndex = firstDay.getDay();
        
        // Get total days in month
        const totalDays = lastDay.getDate();
        
        // Get total days in previous month
        const prevLastDay = new Date(year, month, 0);
        const prevDays = prevLastDay.getDate();
        
        // Get total days to display (max 42 = 6 rows x 7 columns)
        const totalCells = 42;
        
        // Current date for highlighting today
        const today = new Date();
        
        // Sample assignment dates (replace with actual data)
        const assignmentDates = [
            new Date(year, month, 5),
            new Date(year, month, 12),
            new Date(year, month, 20),
            new Date(year, month, 25)
        ];
        
        // Generate calendar cells
        for (let i = 0; i < totalCells; i++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('calendar-day');
            
            // Previous month days
            if (i < firstDayIndex) {
                const prevDate = prevDays - firstDayIndex + i + 1;
                dayCell.textContent = prevDate;
                dayCell.classList.add('other-month');
                
                // Set data attribute for date
                const prevMonthDate = new Date(year, month - 1, prevDate);
                dayCell.setAttribute('data-date', prevMonthDate.toISOString().split('T')[0]);
            }
            // Current month days
            else if (i < firstDayIndex + totalDays) {
                const date = i - firstDayIndex + 1;
                dayCell.textContent = date;
                
                // Set data attribute for date
                const currentDate = new Date(year, month, date);
                dayCell.setAttribute('data-date', currentDate.toISOString().split('T')[0]);
                
                // Highlight today
                if (date === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                    dayCell.classList.add('today');
                }
                
                // Mark days with assignments
                const hasAssignment = assignmentDates.some(assignmentDate => 
                    assignmentDate.getDate() === date && 
                    assignmentDate.getMonth() === month && 
                    assignmentDate.getFullYear() === year
                );
                
                if (hasAssignment) {
                    dayCell.classList.add('has-event');
                }
                
                // Add click event to show assignments for this day
                dayCell.addEventListener('click', function() {
                    const clickedDate = this.getAttribute('data-date');
                    showAssignmentsForDate(clickedDate);
                });
            }
            // Next month days
            else {
                const nextDate = i - firstDayIndex - totalDays + 1;
                dayCell.textContent = nextDate;
                dayCell.classList.add('other-month');
                
                // Set data attribute for date
                const nextMonthDate = new Date(year, month + 1, nextDate);
                dayCell.setAttribute('data-date', nextMonthDate.toISOString().split('T')[0]);
            }
            
            calendarDays.appendChild(dayCell);
        }
    }
    
    function showAssignmentsForDate(dateString) {
        // This function would show assignments for the selected date
        // For now, just log to console
        console.log(`Showing assignments for ${dateString}`);
        
        // In a real implementation, you would:
        // 1. Filter assignments by the selected date
        // 2. Display them in a modal or panel
    }
}

// Initialize form validations
function initFormValidations() {
    const assignmentForm = document.getElementById('assignment-form');
    const rubricForm = document.getElementById('rubric-form');
    
    if (assignmentForm) {
        assignmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (validateAssignmentForm()) {
                // Save assignment
                saveAssignment();
                
                // Close modal
                document.getElementById('create-assignment-modal').style.display = 'none';
                document.body.style.overflow = 'auto';
                
                // Reset form
                this.reset();
            }
        });
    }
    
    if (rubricForm) {
        rubricForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (validateRubricForm()) {
                // Save rubric
                saveRubric();
                
                // Close modal
                document.getElementById('rubric-modal').style.display = 'none';
                document.body.style.overflow = 'auto';
                
                // Reset form
                this.reset();
            }
        });
    }
    
    // Due date validation
    const dueDateInput = document.getElementById('due-date');
    if (dueDateInput) {
        dueDateInput.addEventListener('change', function() {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const selectedDate = new Date(this.value);
            
            if (selectedDate < today) {
                alert('Due date cannot be in the past.');
                this.value = '';
            }
        });
    }
    
    // Assignment type selection
    const assignmentTypeInputs = document.querySelectorAll('input[name="assignment-type"]');
    if (assignmentTypeInputs.length > 0) {
        assignmentTypeInputs.forEach(input => {
            input.addEventListener('change', function() {
                // Show/hide fields based on assignment type
                const type = this.value;
                toggleAssignmentTypeFields(type);
            });
        });
    }
}

// Toggle fields based on assignment type
function toggleAssignmentTypeFields(type) {
    const quizFields = document.getElementById('quiz-fields');
    const projectFields = document.getElementById('project-fields');
    const testFields = document.getElementById('test-fields');
    
    if (quizFields) quizFields.style.display = type === 'quiz' ? 'block' : 'none';
    if (projectFields) projectFields.style.display = type === 'project' ? 'block' : 'none';
    if (testFields) testFields.style.display = type === 'test' ? 'block' : 'none';
}

// Validate assignment form
function validateAssignmentForm() {
    const title = document.getElementById('assignment-title').value.trim();
    const description = document.getElementById('assignment-description').value.trim();
    const dueDate = document.getElementById('due-date').value;
    
    if (!title) {
        alert('Please enter an assignment title.');
        return false;
    }
    
    if (!description) {
        alert('Please enter an assignment description.');
        return false;
    }
    
    if (!dueDate) {
        alert('Please select a due date.');
        return false;
    }
    
    return true;
}

// Validate rubric form
function validateRubricForm() {
    const title = document.getElementById('rubric-title').value.trim();
    const criteriaItems = document.querySelectorAll('.criteria-item');
    
    if (!title) {
        alert('Please enter a rubric title.');
        return false;
    }
    
    if (criteriaItems.length === 0) {
        alert('Please add at least one criteria.');
        return false;
    }
    
    return true;
}

// Save assignment
function saveAssignment() {
    // Get form values
    const title = document.getElementById('assignment-title').value.trim();
    const description = document.getElementById('assignment-description').value.trim();
    const dueDate = document.getElementById('due-date').value;
    const classSelect = document.getElementById('assignment-class');
    const className = classSelect.options[classSelect.selectedIndex].text;
    
    // Get assignment type
    let assignmentType = '';
    const typeInputs = document.querySelectorAll('input[name="assignment-type"]');
    typeInputs.forEach(input => {
        if (input.checked) {
            assignmentType = input.value;
        }
    });
    
    // Create assignment object
    const assignment = {
        id: Date.now(),
        title,
        description,
        dueDate,
        class: className,
        type: assignmentType,
        createdAt: new Date().toISOString(),
        status: 'draft'
    };
    
    // Add to assignments array
    assignments.push(assignment);
    
    // Save to localStorage (in a real app, this would be saved to a database)
    localStorage.setItem('assignments', JSON.stringify(assignments));
    
    // Show success message
    alert('Assignment created successfully!');
}

// Save rubric
function saveRubric() {
    // Get form values
    const title = document.getElementById('rubric-title').value.trim();
    const description = document.getElementById('rubric-description').value.trim();
    
    // Get criteria
    const criteriaItems = document.querySelectorAll('.criteria-item');
    const criteria = [];
    
    criteriaItems.forEach(item => {
        const criteriaName = item.querySelector('.criteria-name').value.trim();
        const criteriaPoints = item.querySelector('.criteria-points').value;
        
        const levels = [];
        const levelItems = item.querySelectorAll('.level-item');
        
        levelItems.forEach(levelItem => {
            const levelName = levelItem.querySelector('.level-name').value.trim();
            const levelPoints = levelItem.querySelector('.level-points').value;
            const levelDescription = levelItem.querySelector('.level-description').value.trim();
            
            levels.push({
                name: levelName,
                points: levelPoints,
                description: levelDescription
            });
        });
        
        criteria.push({
            name: criteriaName,
            points: criteriaPoints,
            levels
        });
    });
    
    // Create rubric object
    const rubric = {
        id: Date.now(),
        title,
        description,
        criteria,
        createdAt: new Date().toISOString()
    };
    
    // Save to localStorage (in a real app, this would be saved to a database)
    const rubrics = JSON.parse(localStorage.getItem('rubrics')) || [];
    rubrics.push(rubric);
    localStorage.setItem('rubrics', JSON.stringify(rubrics));
    
    // Show success message
    alert('Rubric created successfully!');
}

// Initialize file uploads
function initFileUploads() {
    const fileUpload = document.getElementById('document-upload');
    const fileList = document.getElementById('file-list');
    
    if (fileUpload && fileList) {
        fileUpload.addEventListener('change', function() {
            // Clear file list
            fileList.innerHTML = '';
            
            // Add files to list
            for (let i = 0; i < this.files.length; i++) {
                const file = this.files[i];
                
                // Create file item
                const fileItem = document.createElement('div');
                fileItem.classList.add('file-item');
                
                // Get file icon based on type
                let fileIcon = 'fa-file';
                if (file.type.includes('image')) {
                    fileIcon = 'fa-file-image';
                } else if (file.type.includes('pdf')) {
                    fileIcon = 'fa-file-pdf';
                } else if (file.type.includes('word')) {
                    fileIcon = 'fa-file-word';
                } else if (file.type.includes('excel') || file.type.includes('sheet')) {
                    fileIcon = 'fa-file-excel';
                } else if (file.type.includes('powerpoint') || file.type.includes('presentation')) {
                    fileIcon = 'fa-file-powerpoint';
                }
                
                // Format file size
                let fileSize = file.size;
                let fileSizeFormatted = '';
                
                if (fileSize < 1024) {
                    fileSizeFormatted = fileSize + ' B';
                } else if (fileSize < 1024 * 1024) {
                    fileSizeFormatted = (fileSize / 1024).toFixed(1) + ' KB';
                } else {
                    fileSizeFormatted = (fileSize / (1024 * 1024)).toFixed(1) + ' MB';
                }
                
                // Set file item HTML
                fileItem.innerHTML = `
                    <i class="fas ${fileIcon}"></i>
                    <span class="file-name">${file.name}</span>
                    <span class="file-size">${fileSizeFormatted}</span>
                    <button type="button" class="btn-remove-file" data-index="${i}">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                
                fileList.appendChild(fileItem);
            }
            
            // Add event listeners to remove buttons
            const removeButtons = document.querySelectorAll('.btn-remove-file');
            removeButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const index = this.getAttribute('data-index');
                    removeFile(index);
                });
            });
        });
    }
    
    // Handle drag and drop
    const fileUploadArea = document.querySelector('.file-upload-area');
    if (fileUploadArea) {
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            fileUploadArea.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        // Highlight drop area when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            fileUploadArea.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            fileUploadArea.addEventListener(eventName, unhighlight, false);
        });
        
        function highlight() {
            fileUploadArea.classList.add('highlight');
        }
        
        function unhighlight() {
            fileUploadArea.classList.remove('highlight');
        }
        
        // Handle dropped files
        fileUploadArea.addEventListener('drop', handleDrop, false);
        
        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            
            if (fileUpload) {
                fileUpload.files = files;
                
                // Trigger change event
                const event = new Event('change');
                fileUpload.dispatchEvent(event);
            }
        }
    }
    
    // Remove file from list
    function removeFile(index) {
        // Create a new FileList without the removed file
        // Note: FileList is immutable, so we need to create a new input
        const newFileInput = document.createElement('input');
        newFileInput.type = 'file';
        newFileInput.multiple = true;
        
        // Create a DataTransfer object
        const dt = new DataTransfer();
        
        // Add all files except the one to remove
        for (let i = 0; i < fileUpload.files.length; i++) {
            if (i != index) {
                dt.items.add(fileUpload.files[i]);
            }
        }
        
        // Set the new files
        fileUpload.files = dt.files;
        
        // Trigger change event
        const event = new Event('change');
        fileUpload.dispatchEvent(event);
    }
}

// Initialize event listeners
function initEventListeners() {
    // Add criteria button
    const addCriteriaBtn = document.getElementById('add-criteria-btn');
    if (addCriteriaBtn) {
        addCriteriaBtn.addEventListener('click', function() {
            addCriteria();
        });
    }
    
    // Template category buttons
    const templateCategories = document.querySelectorAll('.template-category');
    if (templateCategories.length > 0) {
        templateCategories.forEach(category => {
            category.addEventListener('click', function() {
                // Remove active class from all categories
                templateCategories.forEach(cat => cat.classList.remove('active'));
                
                // Add active class to clicked category
                this.classList.add('active');
                
                // Filter templates by category
                const categoryId = this.getAttribute('data-category');
                filterTemplatesByCategory(categoryId);
            });
        });
    }
    
    // Preparation step buttons
    const stepButtons = document.querySelectorAll('.btn-step-action');
    if (stepButtons.length > 0) {
        stepButtons.forEach(button => {
            button.addEventListener('click', function() {
                const stepId = this.getAttribute('data-step');
                const action = this.getAttribute('data-action');
                
                if (action === 'start') {
                    startStep(stepId);
                } else if (action === 'complete') {
                    completeStep(stepId);
                }
            });
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Clear user data
            localStorage.removeItem('currentUser');
            sessionStorage.removeItem('currentUser');
            
            // Redirect to login page
            window.location.href = 'portal.html';
        });
    }
}

// Add criteria to rubric
function addCriteria() {
    const criteriaList = document.querySelector('.criteria-list');
    
    if (!criteriaList) return;
    
    const criteriaItem = document.createElement('div');
    criteriaItem.classList.add('criteria-item');
    
    criteriaItem.innerHTML = `
        <div class="criteria-header">
            <input type="text" class="criteria-name" placeholder="Criteria Name" required>
            <input type="number" class="criteria-points" min="1" max="100" value="10" required>
            <button type="button" class="btn-remove-criteria">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="criteria-levels">
            <div class="level-item">
                <div class="level-header">
                    <input type="text" class="level-name" placeholder="Excellent" required>
                    <input type="number" class="level-points" min="1" max="100" value="10" required>
                </div>
                <textarea class="level-description" placeholder="Description of this achievement level" required></textarea>
            </div>
            <div class="level-item">
                <div class="level-header">
                    <input type="text" class="level-name" placeholder="Good" required>
                    <input type="number" class="level-points" min="1" max="100" value="8" required>
                </div>
                <textarea class="level-description" placeholder="Description of this achievement level" required></textarea>
            </div>
            <div class="level-item">
                <div class="level-header">
                    <input type="text" class="level-name" placeholder="Satisfactory" required>
                    <input type="number" class="level-points" min="1" max="100" value="6" required>
                </div>
                <textarea class="level-description" placeholder="Description of this achievement level" required></textarea>
            </div>
            <div class="level-item">
                <div class="level-header">
                    <input type="text" class="level-name" placeholder="Needs Improvement" required>
                    <input type="number" class="level-points" min="1" max="100" value="4" required>
                </div>
                <textarea class="level-description" placeholder="Description of this achievement level" required></textarea>
            </div>
        </div>
        <div class="criteria-actions">
            <button type="button" class="btn-add-level">
                <i class="fas fa-plus"></i> Add Level
            </button>
        </div>
    `;
    
    criteriaList.appendChild(criteriaItem);
    
    // Add event listener to remove button
    const removeBtn = criteriaItem.querySelector('.btn-remove-criteria');
    removeBtn.addEventListener('click', function() {
        criteriaList.removeChild(criteriaItem);
    });
    
    // Add event listener to add level button
    const addLevelBtn = criteriaItem.querySelector('.btn-add-level');
    addLevelBtn.addEventListener('click', function() {
        addLevel(criteriaItem);
    });
}

// Add level to criteria
function addLevel(criteriaItem) {
    const levelsContainer = criteriaItem.querySelector('.criteria-levels');
    
    const levelItem = document.createElement('div');
    levelItem.classList.add('level-item');
    
    levelItem.innerHTML = `
        <div class="level-header">
            <input type="text" class="level-name" placeholder="Level Name" required>
            <input type="number" class="level-points" min="1" max="100" value="5" required>
        </div>
        <textarea class="level-description" placeholder="Description of this achievement level" required></textarea>
    `;
    
    levelsContainer.appendChild(levelItem);
}

// Filter templates by category
function filterTemplatesByCategory(categoryId) {
    const templateCards = document.querySelectorAll('.template-card');
    
    if (categoryId === 'all') {
        // Show all templates
        templateCards.forEach(card => {
            card.style.display = 'block';
        });
    } else {
        // Show only templates with matching category
        templateCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            
            if (cardCategory === categoryId) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// Start preparation step
function startStep(stepId) {
    const step = document.getElementById(`step-${stepId}`);
    
    if (!step) return;
    
    // Update progress
    const progressBar = step.querySelector('.progress');
    progressBar.style.width = '25%';
    
    // Update progress text
    const progressText = step.querySelector('.step-progress span');
    progressText.textContent = 'In Progress (25%)';
    
    // Update button
    const startButton = step.querySelector(`[data-action="start"]`);
    startButton.style.display = 'none';
    
    const completeButton = step.querySelector(`[data-action="complete"]`);
    completeButton.style.display = 'inline-flex';
    
    // Save progress to localStorage
    saveStepProgress(stepId, 25);
}

// Complete preparation step
function completeStep(stepId) {
    const step = document.getElementById(`step-${stepId}`);
    
    if (!step) return;
    
    // Update progress
    const progressBar = step.querySelector('.progress');
    progressBar.style.width = '100%';
    
    // Update progress text
    const progressText = step.querySelector('.step-progress span');
    progressText.textContent = 'Completed (100%)';
    
    // Update button
    const completeButton = step.querySelector(`[data-action="complete"]`);
    completeButton.textContent = 'Completed';
    completeButton.classList.add('disabled');
    completeButton.disabled = true;
    
    // Save progress to localStorage
    saveStepProgress(stepId, 100);
    
    // Check if all steps are completed
    checkAllStepsCompleted();
}

// Save step progress to localStorage
function saveStepProgress(stepId, progress) {
    const stepProgress = JSON.parse(localStorage.getItem('stepProgress')) || {};
    stepProgress[stepId] = progress;
    localStorage.setItem('stepProgress', JSON.stringify(stepProgress));
}

// Check if all preparation steps are completed
function checkAllStepsCompleted() {
    const stepProgress = JSON.parse(localStorage.getItem('stepProgress')) || {};
    const steps = ['1', '2', '3', '4'];
    
    const allCompleted = steps.every(stepId => stepProgress[stepId] === 100);
    
    if (allCompleted) {
        // Show success message
        alert('Congratulations! You have completed all preparation steps. You can now create assignments.');
        
        // Enable create assignment button
        const createAssignmentBtn = document.getElementById('create-assignment-btn');
        if (createAssignmentBtn) {
            createAssignmentBtn.classList.remove('disabled');
            createAssignmentBtn.disabled = false;
        }
    }
}

// Get random class name for demo purposes
function getRandomClassName() {
    const classes = ['Nursery 1', 'Nursery 2', 'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6'];
    return classes[Math.floor(Math.random() * classes.length)];
}

// Update teacher information
function updateTeacherInfo(currentUser) {
    const teacherNameElements = document.querySelectorAll('#teacher-name, #welcome-name');
    const teacherSubjectElements = document.querySelectorAll('#teacher-subject');
    
    teacherNameElements.forEach(element => {
        element.textContent = currentUser.name;
    });
    
    teacherSubjectElements.forEach(element => {
        element.textContent = currentUser.subject || 'Mathematics Teacher';
    });
}