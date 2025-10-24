// Global variables
let classes = [];

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateDateDisplay();
    initSidebarToggle();
    initModals();
    initFormSubmissions();
    initSearchAndFilters();
    initColorPickers();
    loadClasses();
    displayClasses();
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

// Initialize sidebar toggle
function initSidebarToggle() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.dashboard-sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
}

// Initialize modals
function initModals() {
    const modals = document.querySelectorAll('.modal');
    const addClassBtns = document.querySelectorAll('#add-class-btn, #add-first-class-btn');
    const closeButtons = document.querySelectorAll('.close-modal, .cancel-modal');
    
    // Add class buttons
    addClassBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            document.getElementById('add-class-modal').classList.add('active');
        });
    });
    
    // Close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', function(event) {
            if (event.target === this) {
                this.classList.remove('active');
            }
        });
    });
}

// Initialize form submissions
function initFormSubmissions() {
    // Add Class Form
    const addClassForm = document.getElementById('add-class-form');
    if (addClassForm) {
        addClassForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const className = document.getElementById('class-name').value;
            const classLevel = document.getElementById('class-level').value;
            const classCapacity = document.getElementById('class-capacity').value;
            const classColor = document.getElementById('class-color').value;
            
            const newClass = {
                id: 'cls_' + Date.now().toString(36),
                name: className,
                level: classLevel,
                capacity: parseInt(classCapacity),
                color: classColor,
                createdAt: new Date().toISOString()
            };
            
            classes.push(newClass);
            saveClasses();
            displayClasses();
            
            addClassForm.reset();
            document.getElementById('add-class-modal').classList.remove('active');
            showNotification('Class added successfully!', 'success');
        });
    }
    
    // Edit Class Form
    const editClassForm = document.getElementById('edit-class-form');
    if (editClassForm) {
        editClassForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const classId = document.getElementById('edit-class-id').value;
            const className = document.getElementById('edit-class-name').value;
            const classLevel = document.getElementById('edit-class-level').value;
            const classCapacity = document.getElementById('edit-class-capacity').value;
            const classColor = document.getElementById('edit-class-color').value;
            
            const classIndex = classes.findIndex(cls => cls.id === classId);
            
            if (classIndex !== -1) {
                classes[classIndex] = {
                    ...classes[classIndex],
                    name: className,
                    level: classLevel,
                    capacity: parseInt(classCapacity),
                    color: classColor
                };
                
                saveClasses();
                displayClasses();
                
                document.getElementById('edit-class-modal').classList.remove('active');
                showNotification('Class updated successfully!', 'success');
            }
        });
    }
}

// Initialize search and filters
function initSearchAndFilters() {
    const classSearch = document.getElementById('class-search');
    const levelFilter = document.getElementById('level-filter');
    
    if (classSearch) {
        classSearch.addEventListener('input', displayClasses);
    }
    
    if (levelFilter) {
        levelFilter.addEventListener('change', displayClasses);
    }
}

// Initialize color pickers
function initColorPickers() {
    const colorOptions = document.querySelectorAll('.color-option');
    
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            const colorValue = this.getAttribute('data-color');
            const colorInput = this.closest('.form-group').querySelector('input[type="hidden"]');
            
            // Remove selected class from all options
            this.parentElement.querySelectorAll('.color-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Set color value
            if (colorInput) {
                colorInput.value = colorValue;
            }
        });
    });
}

// Load classes from localStorage
function loadClasses() {
    const storedClasses = localStorage.getItem('classes');
    if (storedClasses) {
        classes = JSON.parse(storedClasses);
    }
}

// Save classes to localStorage
function saveClasses() {
    localStorage.setItem('classes', JSON.stringify(classes));
}

// Display classes
function displayClasses() {
    const classesGrid = document.getElementById('classes-grid');
    const noClassesMessage = document.getElementById('no-classes-message');
    
    if (!classesGrid || !noClassesMessage) return;
    
    // Get search and filter values
    const searchTerm = document.getElementById('class-search')?.value.toLowerCase() || '';
    const levelFilter = document.getElementById('level-filter')?.value || '';
    
    // Filter classes
    const filteredClasses = classes.filter(cls => {
        const matchesSearch = cls.name.toLowerCase().includes(searchTerm);
        const matchesLevel = !levelFilter || cls.level === levelFilter;
        return matchesSearch && matchesLevel;
    });
    
    // Show/hide no classes message
    if (filteredClasses.length === 0) {
        classesGrid.innerHTML = '';
        noClassesMessage.style.display = 'flex';
    } else {
        noClassesMessage.style.display = 'none';
        
        // Render classes
        classesGrid.innerHTML = '';
        
        filteredClasses.forEach(cls => {
            const classCard = document.createElement('div');
            classCard.className = 'class-card';
            classCard.innerHTML = `
                <div class="class-card-header" style="background-color: ${cls.color}">
                    <h3>${cls.name}</h3>
                    <p>${cls.level}</p>
                </div>
                <div class="class-card-body">
                    <div class="class-info">
                        <div class="info-item">
                            <i class="fas fa-users"></i>
                            <span>Capacity: ${cls.capacity}</span>
                        </div>
                    </div>
                    <div class="class-actions">
                        <button class="class-action-btn edit-class-btn" data-class-id="${cls.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="class-action-btn delete-class-btn" data-class-id="${cls.id}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            `;
            
            classesGrid.appendChild(classCard);
        });
    }
}

// Event delegation for dynamically added elements
document.addEventListener('click', function(event) {
    // Edit class button
    if (event.target.classList.contains('edit-class-btn') || 
        event.target.parentElement.classList.contains('edit-class-btn')) {
        
        const button = event.target.classList.contains('edit-class-btn') ? 
            event.target : event.target.parentElement;
        
        const classId = button.getAttribute('data-class-id');
        if (classId) {
            openEditClassModal(classId);
        }
    }
    
    // Delete class button
    if (event.target.classList.contains('delete-class-btn') || 
        event.target.parentElement.classList.contains('delete-class-btn')) {
        
        const button = event.target.classList.contains('delete-class-btn') ? 
            event.target : event.target.parentElement;
        
        const classId = button.getAttribute('data-class-id');
        if (classId) {
            openDeleteConfirmationModal(classId);
        }
    }
});

// Open edit class modal
function openEditClassModal(classId) {
    const cls = classes.find(c => c.id === classId);
    if (!cls) return;
    
    // Set form values
    document.getElementById('edit-class-id').value = cls.id;
    document.getElementById('edit-class-name').value = cls.name;
    document.getElementById('edit-class-level').value = cls.level;
    document.getElementById('edit-class-capacity').value = cls.capacity;
    document.getElementById('edit-class-color').value = cls.color;
    
    // Set color option
    const colorOptions = document.querySelectorAll('#edit-class-modal .color-option');
    colorOptions.forEach(option => {
        if (option.getAttribute('data-color') === cls.color) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
    
    // Show modal
    document.getElementById('edit-class-modal').classList.add('active');
}

// Open delete confirmation modal
function openDeleteConfirmationModal(classId) {
    const cls = classes.find(c => c.id === classId);
    if (!cls) return;
    
    const modal = document.getElementById('delete-confirmation-modal');
    const message = document.getElementById('delete-confirmation-message');
    const confirmBtn = document.getElementById('confirm-delete-btn');
    
    message.textContent = `Are you sure you want to delete the class "${cls.name}"? This action cannot be undone.`;
    
    confirmBtn.onclick = function() {
        deleteClass(classId);
        modal.classList.remove('active');
    };
    
    modal.classList.add('active');
}

// Delete class
function deleteClass(classId) {
    classes = classes.filter(c => c.id !== classId);
    saveClasses();
    displayClasses();
    showNotification('Class deleted successfully!', 'success');
}

// Show notification
function showNotification(message, type = 'info') {
    let notification = document.querySelector('.notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.className = `notification notification-${type}`;
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}