document.addEventListener('DOMContentLoaded', function() {
    // Initialize date display
    updateDateDisplay();
    
    // Initialize sidebar toggle for mobile
    initSidebarToggle();
    
    // Initialize tabs
    initTabs();
    
    // Initialize modals
    initModals();
    
    // Initialize form submissions
    initFormSubmissions();
    
    // Initialize search and filters
    initSearchAndFilters();
    
    // Initialize color pickers
    initColorPickers();
    
    // Load data from localStorage or use sample data
    loadData();
    
    // Display data
    displayClasses();
    displayStudents();
    
    // Populate dropdowns
    populateClassDropdowns();
    populateTeacherDropdowns();
    
    // Set today's date as default
    setTodayAsDefault();
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
    const addClassBtns = document.querySelectorAll('#add-class-btn, #add-first-class-btn');
    const addStudentBtns = document.querySelectorAll('#add-student-btn, #add-first-student-btn');
    
    // Add click event to add class buttons
    addClassBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            document.getElementById('add-class-modal').classList.add('active');
        });
    });
    
    // Add click event to add student buttons
    addStudentBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            document.getElementById('add-student-modal').classList.add('active');
        });
    });
    
    // Get all elements that close a modal
    const closeButtons = document.querySelectorAll('.close-modal, .cancel-modal');
    
    // Add click event to all close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
            }
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
    
    // Initialize edit class functionality
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('edit-class-btn') || 
            event.target.parentElement.classList.contains('edit-class-btn')) {
            
            const button = event.target.classList.contains('edit-class-btn') ? 
                event.target : event.target.parentElement;
            
            const classId = button.getAttribute('data-class-id');
            if (classId) {
                openEditClassModal(classId);
            }
        }
    });
    
    // Initialize delete class functionality
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-class-btn') || 
            event.target.parentElement.classList.contains('delete-class-btn')) {
            
            const button = event.target.classList.contains('delete-class-btn') ? 
                event.target : event.target.parentElement;
            
            const classId = button.getAttribute('data-class-id');
            if (classId) {
                openDeleteConfirmationModal('class', classId);
            }
        }
    });
}

// Initialize form submissions
function initFormSubmissions() {
    // Add Class Form
    const addClassForm = document.getElementById('add-class-form');
    if (addClassForm) {
        addClassForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form data
            const className = document.getElementById('class-name').value;
            const classLevel = document.getElementById('class-level').value;
            const classCapacity = document.getElementById('class-capacity').value;
            const classTeacher = document.getElementById('class-teacher').value;
            const classColor = document.getElementById('class-color').value;
            const classDescription = document.getElementById('class-description').value;
            
            // Create new class object
            const newClass = {
                id: 'cls_' + Date.now().toString(36),
                name: className,
                level: classLevel,
                capacity: parseInt(classCapacity),
                teacherId: classTeacher || null,
                color: classColor,
                description: classDescription || '',
                createdAt: new Date().toISOString()
            };
            
            // Add new class
            classes.push(newClass);
            
            // Save to localStorage
            saveClasses();
            
            // Update display
            displayClasses();
            
            // Populate dropdowns
            populateClassDropdowns();
            
            // Reset form and close modal
            addClassForm.reset();
            document.getElementById('add-class-modal').classList.remove('active');
            
            // Show success message
            showNotification('Class added successfully!', 'success');
        });
    }
    
    // Edit Class Form
    const editClassForm = document.getElementById('edit-class-form');
    if (editClassForm) {
        editClassForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form data
            const classId = document.getElementById('edit-class-id').value;
            const className = document.getElementById('edit-class-name').value;
            const classLevel = document.getElementById('edit-class-level').value;
            const classCapacity = document.getElementById('edit-class-capacity').value;
            const classTeacher = document.getElementById('edit-class-teacher').value;
            const classColor = document.getElementById('edit-class-color').value;
            const classDescription = document.getElementById('edit-class-description').value;
            
            // Find class index
            const classIndex = classes.findIndex(cls => cls.id === classId);
            
            if (classIndex !== -1) {
                // Update class object
                classes[classIndex] = {
                    ...classes[classIndex],
                    name: className,
                    level: classLevel,
                    capacity: parseInt(classCapacity),
                    teacherId: classTeacher || null,
                    color: classColor,
                    description: classDescription || ''
                };
                
                // Save to localStorage
                saveClasses();
                
                // Update display
                displayClasses();
                
                // Populate dropdowns
                populateClassDropdowns();
                
                // Close modal
                document.getElementById('edit-class-modal').classList.remove('active');
                
                // Show success message
                showNotification('Class updated successfully!', 'success');
            }
        });
    }
    
    // Add Student Form
    const addStudentForm = document.getElementById('add-student-form');
    if (addStudentForm) {
        addStudentForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form data
            const studentName = document.getElementById('student-name').value;
            const studentGender = document.getElementById('student-gender').value;
            const studentDob = document.getElementById('student-dob').value;
            const studentClass = document.getElementById('student-class').value;
            const parentName = document.getElementById('parent-name').value;
            const parentPhone = document.getElementById('parent-phone').value;
            const parentEmail = document.getElementById('parent-email').value;
            const studentAddress = document.getElementById('student-address').value;
            
            // Create new student object
            const newStudent = {
                id: generateStudentId(studentClass),
                name: studentName,
                gender: studentGender,
                dob: studentDob,
                classId: studentClass,
                parentName: parentName,
                parentPhone: parentPhone,
                parentEmail: parentEmail || '',
                address: studentAddress || '',
                status: 'active',
                createdAt: new Date().toISOString()
            };
            
            // Add new student
            students.push(newStudent);
            
            // Save to localStorage
            saveStudents();
            
            // Update display
            displayStudents();
            
            // Reset form and close modal
            addStudentForm.reset();
            document.getElementById('add-student-modal').classList.remove('active');
            
            // Show success message
            showNotification('Student added successfully!', 'success');
        });
    }
}

// Initialize search and filters
function initSearchAndFilters() {
    // Class search
    const classSearch = document.getElementById('class-search');
    if (classSearch) {
        classSearch.addEventListener('input', function() {
            displayClasses();
        });
    }
    
    // Level filter
    const levelFilter = document.getElementById('level-filter');
    if (levelFilter) {
        levelFilter.addEventListener('change', function() {
            displayClasses();
        });
    }
    
    // Student search
    const studentSearch = document.getElementById('student-search');
    if (studentSearch) {
        studentSearch.addEventListener('input', function() {
            displayStudents();
        });
    }
    
    // Class filter for students
    const classFilter = document.getElementById('class-filter');
    if (classFilter) {
        classFilter.addEventListener('change', function() {
            displayStudents();
        });
    }
    
    // Status filter for students
    const statusFilter = document.getElementById('status-filter');
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            displayStudents();
        });
    }
    
    // Timetable class filter
    const timetableClassFilter = document.getElementById('timetable-class-filter');
    if (timetableClassFilter) {
        timetableClassFilter.addEventListener('change', function() {
            const classId = this.value;
            if (classId) {
                displayTimetable(classId);
                document.getElementById('edit-timetable-btn').disabled = false;
                document.getElementById('print-timetable-btn').disabled = false;
            } else {
                document.getElementById('class-timetable').innerHTML = '';
                document.getElementById('no-timetable-message').style.display = 'flex';
                document.getElementById('edit-timetable-btn').disabled = true;
                document.getElementById('print-timetable-btn').disabled = true;
            }
        });
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

// Load data from localStorage or use sample data
function loadData() {
    // Load classes
    const storedClasses = localStorage.getItem('classes');
    if (storedClasses) {
        classes = JSON.parse(storedClasses);
    } else {
        classes = getSampleClasses();
        saveClasses();
    }
    
    // Load students
    const storedStudents = localStorage.getItem('students');
    if (storedStudents) {
        students = JSON.parse(storedStudents);
    } else {
        students = getSampleStudents();
        saveStudents();
    }
    
    // Load teachers
    const storedTeachers = localStorage.getItem('teachers');
    if (storedTeachers) {
        teachers = JSON.parse(storedTeachers);
    } else {
        teachers = getSampleTeachers();
        localStorage.setItem('teachers', JSON.stringify(teachers));
    }
    
    // Load timetables
    const storedTimetables = localStorage.getItem('timetables');
    if (storedTimetables) {
        timetables = JSON.parse(storedTimetables);
    } else {
        generateSampleTimetables();
        saveTimetables();
    }
}

// Save classes to localStorage
function saveClasses() {
    localStorage.setItem('classes', JSON.stringify(classes));
}

// Save students to localStorage
function saveStudents() {
    localStorage.setItem('students', JSON.stringify(students));
}

// Save timetables to localStorage
function saveTimetables() {
    localStorage.setItem('timetables', JSON.stringify(timetables));
}

// Display classes
function displayClasses() {
    const classesGrid = document.querySelector('.classes-grid');
    const noClassesMessage = document.getElementById('no-classes-message');
    
    if (!classesGrid || !noClassesMessage) return;
    
    // Get search and filter values
    const searchTerm = document.getElementById('class-search')?.value.toLowerCase() || '';
    const levelFilter = document.getElementById('level-filter')?.value || '';
    
        // Filter classes
    const filteredClasses = classes.filter(cls => {
        const matchesSearch = cls.name.toLowerCase().includes(searchTerm) || 
                             cls.description.toLowerCase().includes(searchTerm);
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
            const teacherName = cls.teacherId ? getTeacherName(cls.teacherId) : 'Not Assigned';
            const studentCount = getStudentCountByClass(cls.id);
            
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
                            <i class="fas fa-user-graduate"></i>
                            <span>${studentCount} Students</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-chalkboard-teacher"></i>
                            <span>${teacherName}</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-users"></i>
                            <span>Capacity: ${cls.capacity}</span>
                        </div>
                    </div>
                    <div class="class-actions">
                        <button class="class-action-btn view-class-btn" data-class-id="${cls.id}">
                            <i class="fas fa-eye"></i>
                        </button>
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

// Display students
function displayStudents() {
    const studentsTable = document.getElementById('students-table');
    const noStudentsMessage = document.getElementById('no-students-message');
    
    if (!studentsTable || !noStudentsMessage) return;
    
    const tableBody = studentsTable.querySelector('tbody');
    
    // Get search and filter values
    const searchTerm = document.getElementById('student-search')?.value.toLowerCase() || '';
    const classFilter = document.getElementById('class-filter')?.value || '';
    const statusFilter = document.getElementById('status-filter')?.value || '';
    
    // Filter students
    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm) || 
                             student.id.toLowerCase().includes(searchTerm) ||
                             student.parentName.toLowerCase().includes(searchTerm);
        const matchesClass = !classFilter || student.classId === classFilter;
        const matchesStatus = !statusFilter || student.status === statusFilter;
        
        return matchesSearch && matchesClass && matchesStatus;
    });
    
    // Show/hide no students message
    if (filteredStudents.length === 0) {
        tableBody.innerHTML = '';
        noStudentsMessage.style.display = 'flex';
        studentsTable.style.display = 'none';
    } else {
        noStudentsMessage.style.display = 'none';
        studentsTable.style.display = 'table';
        
        // Render students
        tableBody.innerHTML = '';
        
        filteredStudents.forEach(student => {
            const className = getClassName(student.classId);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${className}</td>
                <td>${student.gender}</td>
                <td>${student.parentName}</td>
                <td>${student.parentPhone}</td>
                <td>
                    <span class="student-status status-${student.status}">
                        ${student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </span>
                </td>
                <td>
                    <button class="student-action-btn view-student-btn" data-student-id="${student.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="student-action-btn edit-student-btn" data-student-id="${student.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="student-action-btn delete-student-btn" data-student-id="${student.id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    }
}

// Display timetable
function displayTimetable(classId) {
    const timetableTable = document.getElementById('class-timetable');
    const noTimetableMessage = document.getElementById('no-timetable-message');
    
    if (!timetableTable || !noTimetableMessage) return;
    
    // Find timetable for the class
    const timetable = timetables.find(t => t.classId === classId);
    
    if (!timetable) {
        // No timetable found, create a default one
        const newTimetable = createDefaultTimetable(classId);
        timetables.push(newTimetable);
        saveTimetables();
        
        displayTimetable(classId); // Recursive call with the new timetable
        return;
    }
    
    // Show timetable and hide message
    noTimetableMessage.style.display = 'none';
    timetableTable.style.display = 'table';
    
    // Render timetable
    const tableBody = timetableTable.querySelector('tbody');
    tableBody.innerHTML = '';
    
    // Generate time slots
    const startTime = new Date(`2000-01-01T${timetable.startTime}`);
    const endTime = new Date(`2000-01-01T${timetable.endTime}`);
    const periodDuration = timetable.periodDuration;
    const breakTime = new Date(`2000-01-01T${timetable.breakTime}`);
    const breakDuration = timetable.breakDuration;
    
    const timeSlots = [];
    let currentTime = new Date(startTime);
    
    while (currentTime < endTime) {
        const slotStart = currentTime.toTimeString().substring(0, 5);
        
        // Add period duration
        currentTime.setMinutes(currentTime.getMinutes() + periodDuration);
        
        // Check if we've gone past the end time
        if (currentTime > endTime) {
            currentTime = new Date(endTime);
        }
        
        const slotEnd = currentTime.toTimeString().substring(0, 5);
        
        // Check if this is a break time
        const isBreak = (
            breakTime <= currentTime && 
            new Date(breakTime.getTime() + breakDuration * 60000) >= currentTime
        );
        
        timeSlots.push({
            start: slotStart,
            end: slotEnd,
            isBreak: isBreak
        });
        
        // If this was a break, skip ahead
        if (isBreak) {
            currentTime = new Date(breakTime.getTime() + breakDuration * 60000);
        }
    }
    
    // Render time slots
    timeSlots.forEach(slot => {
        const row = document.createElement('tr');
        
        if (slot.isBreak) {
            row.innerHTML = `
                <td class="time-cell">${slot.start} - ${slot.end}</td>
                <td class="break-cell" colspan="5">Break / Lunch</td>
            `;
        } else {
            row.innerHTML = `
                <td class="time-cell">${slot.start} - ${slot.end}</td>
                <td>${getSubjectForTimeSlot(timetable, 'Monday', slot.start)}</td>
                <td>${getSubjectForTimeSlot(timetable, 'Tuesday', slot.start)}</td>
                <td>${getSubjectForTimeSlot(timetable, 'Wednesday', slot.start)}</td>
                <td>${getSubjectForTimeSlot(timetable, 'Thursday', slot.start)}</td>
                <td>${getSubjectForTimeSlot(timetable, 'Friday', slot.start)}</td>
            `;
        }
        
        tableBody.appendChild(row);
    });
}

// Populate class dropdowns
function populateClassDropdowns() {
    // Class filter dropdown
    const classFilter = document.getElementById('class-filter');
    if (classFilter) {
        // Save selected value
        const selectedValue = classFilter.value;
        
        // Clear existing options except the first one
        const firstOption = classFilter.querySelector('option:first-child');
        classFilter.innerHTML = '';
        if (firstOption) {
            classFilter.appendChild(firstOption);
        }
        
        // Add class options
        classes.forEach(cls => {
            const option = document.createElement('option');
            option.value = cls.id;
            option.textContent = cls.name;
            classFilter.appendChild(option);
        });
        
        // Restore selected value
        if (selectedValue) {
            classFilter.value = selectedValue;
        }
    }
    
    // Student class dropdown
    const studentClass = document.getElementById('student-class');
    if (studentClass) {
        // Save selected value
        const selectedValue = studentClass.value;
        
        // Clear existing options except the first one
        const firstOption = studentClass.querySelector('option:first-child');
        studentClass.innerHTML = '';
        if (firstOption) {
            studentClass.appendChild(firstOption);
        }
        
        // Add class options
        classes.forEach(cls => {
            const option = document.createElement('option');
            option.value = cls.id;
            option.textContent = cls.name;
            studentClass.appendChild(option);
        });
        
        // Restore selected value
        if (selectedValue) {
            studentClass.value = selectedValue;
        }
    }
    
    // Edit student class dropdown
    const editStudentClass = document.getElementById('edit-student-class');
    if (editStudentClass) {
        // Save selected value
        const selectedValue = editStudentClass.value;
        
        // Clear existing options except the first one
        const firstOption = editStudentClass.querySelector('option:first-child');
        editStudentClass.innerHTML = '';
        if (firstOption) {
            editStudentClass.appendChild(firstOption);
        }
        
        // Add class options
        classes.forEach(cls => {
            const option = document.createElement('option');
            option.value = cls.id;
            option.textContent = cls.name;
            editStudentClass.appendChild(option);
        });
        
        // Restore selected value
        if (selectedValue) {
            editStudentClass.value = selectedValue;
        }
    }
    
    // Timetable class filter
    const timetableClassFilter = document.getElementById('timetable-class-filter');
    if (timetableClassFilter) {
        // Save selected value
        const selectedValue = timetableClassFilter.value;
        
        // Clear existing options except the first one
        const firstOption = timetableClassFilter.querySelector('option:first-child');
        timetableClassFilter.innerHTML = '';
        if (firstOption) {
            timetableClassFilter.appendChild(firstOption);
        }
        
        // Add class options
        classes.forEach(cls => {
            const option = document.createElement('option');
            option.value = cls.id;
            option.textContent = cls.name;
            timetableClassFilter.appendChild(option);
        });
        
        // Restore selected value
        if (selectedValue) {
            timetableClassFilter.value = selectedValue;
        }
    }
}

// Populate teacher dropdowns
function populateTeacherDropdowns() {
    // Class teacher dropdown
    const classTeacher = document.getElementById('class-teacher');
    if (classTeacher) {
        // Save selected value
        const selectedValue = classTeacher.value;
        
        // Clear existing options except the first one
        const firstOption = classTeacher.querySelector('option:first-child');
        classTeacher.innerHTML = '';
        if (firstOption) {
            classTeacher.appendChild(firstOption);
        }
        
        // Add teacher options
        teachers.forEach(teacher => {
            const option = document.createElement('option');
            option.value = teacher.id;
            option.textContent = teacher.name;
            classTeacher.appendChild(option);
        });
        
        // Restore selected value
        if (selectedValue) {
            classTeacher.value = selectedValue;
        }
    }
    
    // Edit class teacher dropdown
    const editClassTeacher = document.getElementById('edit-class-teacher');
    if (editClassTeacher) {
        // Save selected value
        const selectedValue = editClassTeacher.value;
        
        // Clear existing options except the first one
        const firstOption = editClassTeacher.querySelector('option:first-child');
        editClassTeacher.innerHTML = '';
        if (firstOption) {
            editClassTeacher.appendChild(firstOption);
        }
        
        // Add teacher options
        teachers.forEach(teacher => {
            const option = document.createElement('option');
            option.value = teacher.id;
            option.textContent = teacher.name;
            editClassTeacher.appendChild(option);
        });
        
        // Restore selected value
        if (selectedValue) {
            editClassTeacher.value = selectedValue;
        }
    }
}

// Set today's date as default
function setTodayAsDefault() {
    const today = new Date().toISOString().split('T')[0];
    
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        if (!input.value) {
            input.value = today;
        }
    });
}

// Helper Functions

// Get teacher name by ID
function getTeacherName(teacherId) {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? teacher.name : 'Unknown Teacher';
}

// Get class name by ID
function getClassName(classId) {
    const cls = classes.find(c => c.id === classId);
    return cls ? cls.name : 'Unknown Class';
}

// Get student count by class ID
function getStudentCountByClass(classId) {
    return students.filter(s => s.classId === classId).length;
}

// Get subject for time slot
function getSubjectForTimeSlot(timetable, day, time) {
    const slot = timetable.slots.find(s => 
        s.day === day && s.time === time
    );
    
    if (!slot || !slot.subjectId) {
        return '<em>Not assigned</em>';
    }
    
    const subject = getSubjectById(slot.subjectId);
    const teacher = slot.teacherId ? getTeacherName(slot.teacherId) : 'Not assigned';
    
    return `
        <div class="timetable-subject">
            <div class="subject-name">${subject.name}</div>
            <div class="subject-teacher">${teacher}</div>
        </div>
    `;
}

// Get subject by ID
function getSubjectById(subjectId) {
    // This would normally fetch from a subjects array
    // For now, return a placeholder
    return { name: 'Subject ' + subjectId.substring(0, 5) };
}

// Create default timetable
function createDefaultTimetable(classId) {
    return {
        id: 'tt_' + Date.now().toString(36),
        classId: classId,
        startTime: '08:00',
        endTime: '14:00',
        periodDuration: 45,
        breakTime: '10:30',
        breakDuration: 30,
        slots: []
    };
}

// Generate student ID
function generateStudentId(classId) {
    const cls = classes.find(c => c.id === classId);
    let prefix = 'STD';
    
    if (cls) {
        if (cls.level === 'Nursery') {
            prefix = 'NUR';
        } else if (cls.level === 'Primary') {
            prefix = 'PRI';
        } else if (cls.level === 'Junior Secondary') {
            prefix = 'JSS';
        } else if (cls.level === 'Senior Secondary') {
            prefix = 'SSS';
        }
    }
    
    const classStudents = students.filter(s => s.classId === classId);
    const nextNumber = classStudents.length + 1;
    
    return `${prefix}${nextNumber.toString().padStart(3, '0')}`;
}

// Open edit class modal
function openEditClassModal(classId) {
    const cls = classes.find(c => c.id === classId);
    if (!cls) return;
    
    // Set form values
    document.getElementById('edit-class-id').value = cls.id;
    document.getElementById('edit-class-name').value = cls.name;
    document.getElementById('edit-class-level').value = cls.level;
    document.getElementById('edit-class-capacity').value = cls.capacity;
    document.getElementById('edit-class-teacher').value = cls.teacherId || '';
    document.getElementById('edit-class-color').value = cls.color;
    document.getElementById('edit-class-description').value = cls.description;
    
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
function openDeleteConfirmationModal(type, id) {
    const modal = document.getElementById('delete-confirmation-modal');
    const message = document.getElementById('delete-confirmation-message');
    const confirmBtn = document.getElementById('confirm-delete-btn');
    
    if (type === 'class') {
        const cls = classes.find(c => c.id === id);
        if (!cls) return;
        
        message.textContent = `Are you sure you want to delete the class "${cls.name}"? This will also remove all students assigned to this class. This action cannot be undone.`;
        
        confirmBtn.onclick = function() {
            deleteClass(id);
            modal.classList.remove('active');
        };
    } else if (type === 'student') {
        const student = students.find(s => s.id === id);
        if (!student) return;
        
        message.textContent = `Are you sure you want to delete the student "${student.name}"? This action cannot be undone.`;
        
        confirmBtn.onclick = function() {
            deleteStudent(id);
            modal.classList.remove('active');
        };
    }
    
    modal.classList.add('active');
}

// Delete class
function deleteClass(classId) {
    // Remove class
    classes = classes.filter(c => c.id !== classId);
    saveClasses();
    
    // Remove students in this class
    students = students.filter(s => s.classId !== classId);
    saveStudents();
    
    // Remove timetable for this class
    timetables = timetables.filter(t => t.classId !== classId);
    saveTimetables();
    
    // Update display
    displayClasses();
    displayStudents();
    
    // Update dropdowns
    populateClassDropdowns();
    
    // Show success message
    showNotification('Class deleted successfully!', 'success');
}

// Delete student
function deleteStudent(studentId) {
    // Remove student
    students = students.filter(s => s.id !== studentId);
    saveStudents();
    
    // Update display
    displayStudents();
    
    // Show success message
    showNotification('Student deleted successfully!', 'success');
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
    
    // Set message and type
    notification.textContent = message;
    notification.className = `notification notification-${type}`;
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Sample Data

// Sample classes
function getSampleClasses() {
    return [
        {
            id: 'cls_nursery1',
            name: 'Nursery 1',
            level: 'Nursery',
            capacity: 25,
            teacherId: 'tchr_001',
            color: '#4CAF50',
            description: 'First level nursery class for children aged 3-4 years.',
            createdAt: new Date().toISOString()
        },
        {
            id: 'cls_nursery2',
            name: 'Nursery 2',
            level: 'Nursery',
            capacity: 25,
            teacherId: 'tchr_002',
            color: '#2196F3',
            description: 'Second level nursery class for children aged 4-5 years.',
            createdAt: new Date().toISOString()
        },
        {
            id: 'cls_primary1',
            name: 'Primary 1',
            level: 'Primary',
            capacity: 30,
            teacherId: 'tchr_003',
            color: '#FF9800',
            description: 'First level primary class for children aged 5-6 years.',
            createdAt: new Date().toISOString()
        },
        {
            id: 'cls_primary2',
            name: 'Primary 2',
            level: 'Primary',
            capacity: 30,
            teacherId: 'tchr_004',
            color: '#9C27B0',
            description: 'Second level primary class for children aged 6-7 years.',
            createdAt: new Date().toISOString()
        },
        {
            id: 'cls_primary3',
            name: 'Primary 3',
            level: 'Primary',
            capacity: 30,
            teacherId: 'tchr_005',
            color: '#F44336',
            description: 'Third level primary class for children aged 7-8 years.',
            createdAt: new Date().toISOString()
        },
        {
            id: 'cls_primary4',
            name: 'Primary 4',
            level: 'Primary',
            capacity: 30,
            teacherId: 'tchr_006',
            color: '#009688',
            description: 'Fourth level primary class for children aged 8-9 years.',
            createdAt: new Date().toISOString()
        },
        {
            id: 'cls_primary5',
            name: 'Primary 5',
            level: 'Primary',
            capacity: 30,
            teacherId: 'tchr_007',
            color: '#673AB7',
            description: 'Fifth level primary class for children aged 9-10 years.',
            createdAt: new Date().toISOString()
        },
        {
            id: 'cls_primary6',
            name: 'Primary 6',
            level: 'Primary',
            capacity: 30,
            teacherId: 'tchr_008',
            color: '#3F51B5',
            description: 'Sixth level primary class for children aged 10-11 years.',
            createdAt: new Date().toISOString()
        }
    ];
}

// Sample students
function getSampleStudents() {
    const sampleStudents = [];
    
    // Generate random students for each class
    classes.forEach(cls => {
        const studentCount = Math.floor(Math.random() * cls.capacity) + 5; // At least 5 students
        
        for (let i = 1; i <= studentCount; i++) {
            const gender = Math.random() > 0.5 ? 'Male' : 'Female';
            const firstName = gender === 'Male' ? getRandomMaleName() : getRandomFemaleName();
            const lastName = getRandomLastName();
            
            sampleStudents.push({
                id: `${cls.id.substring(4, 7).toUpperCase()}${i.toString().padStart(3, '0')}`,
                name: `${firstName} ${lastName}`,
                gender: gender,
                dob: getRandomDateOfBirth(cls.level),
                classId: cls.id,
                parentName: `Mr/Mrs ${lastName}`,
                parentPhone: `080${Math.floor(Math.random() * 100000000)}`,
                parentEmail: `parent_${lastName.toLowerCase()}@example.com`,
                address: '123 Sample Street, Lagos',
                status: 'active',
                createdAt: new Date().toISOString()
            });
        }
    });
    
    return sampleStudents;
}

// Sample teachers
function getSampleTeachers() {
    return [
        {
            id: 'tchr_001',
            name: 'Mrs. Sarah Johnson',
            email: 'sarah.johnson@example.com',
            phone: '08012345678',
            subject: 'Early Childhood Education',
            createdAt: new Date().toISOString()
        },
        {
            id: 'tchr_002',
            name: 'Mr. David Williams',
            email: 'david.williams@example.com',
            phone: '08023456789',
            subject: 'Mathematics',
            createdAt: new Date().toISOString()
        },
        {
            id: 'tchr_003',
            name: 'Mrs. Jennifer Brown',
            email: 'jennifer.brown@example.com',
            phone: '08034567890',
            subject: 'English Language',
            createdAt: new Date().toISOString()
        },
        {
            id: 'tchr_004',
            name: 'Mr. Michael Davis',
            email: 'michael.davis@example.com',
            phone: '08045678901',
            subject: 'Science',
            createdAt: new Date().toISOString()
        },
        {
            id: 'tchr_005',
            name: 'Mrs. Elizabeth Wilson',
            email: 'elizabeth.wilson@example.com',
            phone: '08056789012',
            subject: 'Social Studies',
            createdAt: new Date().toISOString()
        },
        {
            id: 'tchr_006',
            name: 'Mr. Robert Taylor',
            email: 'robert.taylor@example.com',
            phone: '08067890123',
            subject: 'Physical Education',
            createdAt: new Date().toISOString()
        },
        {
            id: 'tchr_007',
            name: 'Mrs. Patricia Anderson',
            email: 'patricia.anderson@example.com',
            phone: '08078901234',
            subject: 'Arts and Crafts',
            createdAt: new Date().toISOString()
        },
        {
            id: 'tchr_008',
            name: 'Mr. James Thomas',
            email: 'james.thomas@example.com',
            phone: '08089012345',
            subject: 'Religious Studies',
            createdAt: new Date().toISOString()
        }
    ];
}

// Generate sample timetables
function generateSampleTimetables() {
    timetables = [];
    
    classes.forEach(cls => {
        timetables.push(createDefaultTimetable(cls.id));
    });
}

// Random name generators
function getRandomMaleName() {
    const names = ['John', 'David', 'Michael', 'James', 'Robert', 'William', 'Joseph', 'Thomas', 'Charles', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua', 'Kenneth', 'Kevin'];
    return names[Math.floor(Math.random() * names.length)];
}

function getRandomFemaleName() {
    const names = ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Nancy', 'Lisa', 'Betty', 'Margaret', 'Sandra', 'Ashley', 'Kimberly', 'Emily', 'Donna', 'Michelle'];
    return names[Math.floor(Math.random() * names.length)];
}

function getRandomLastName() {
    const names = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Hernandez', 'Moore', 'Martin', 'Jackson', 'Thompson', 'White'];
    return names[Math.floor(Math.random() * names.length)];
}

// Generate random date of birth based on class level
function getRandomDateOfBirth(level) {
    const today = new Date();
    let years = 0;
    
    if (level === 'Nursery') {
        years = 3 + Math.floor(Math.random() * 2); // 3-4 years
    } else if (level === 'Primary') {
        years = 5 + Math.floor(Math.random() * 6); // 5-10 years
    } else if (level === 'Junior Secondary') {
        years = 11 + Math.floor(Math.random() * 3); // 11-13 years
    } else if (level === 'Senior Secondary') {
        years = 14 + Math.floor(Math.random() * 3); // 14-16 years
    } else {
        years = 5 + Math.floor(Math.random() * 12); // 5-16 years
    }
    
    const birthDate = new Date(today);
    birthDate.setFullYear(today.getFullYear() - years);
    
    // Randomize month and day
    birthDate.setMonth(Math.floor(Math.random() * 12));
    birthDate.setDate(Math.floor(Math.random() * 28) + 1);
    
    return birthDate.toISOString().split('T')[0];
}

// Initialize global variables
let classes = [];
let students = [];
let teachers = [];
let timetables = [];

// Event delegation for dynamically added elements
document.addEventListener('click', function(event) {
    // View class button
    if (event.target.classList.contains('view-class-btn') || 
        event.target.parentElement.classList.contains('view-class-btn')) {
        
        const button = event.target.classList.contains('view-class-btn') ? 
            event.target : event.target.parentElement;
        
        const classId = button.getAttribute('data-class-id');
        if (classId) {
            viewClassDetails(classId);
        }
    }
    
    // View student button
    if (event.target.classList.contains('view-student-btn') || 
        event.target.parentElement.classList.contains('view-student-btn')) {
        
        const button = event.target.classList.contains('view-student-btn') ? 
            event.target : event.target.parentElement;
        
        const studentId = button.getAttribute('data-student-id');
        if (studentId) {
            viewStudentDetails(studentId);
        }
    }
    
    // Edit student button
    if (event.target.classList.contains('edit-student-btn') || 
        event.target.parentElement.classList.contains('edit-student-btn')) {
        
        const button = event.target.classList.contains('edit-student-btn') ? 
            event.target : event.target.parentElement;
        
        const studentId = button.getAttribute('data-student-id');
        if (studentId) {
            openEditStudentModal(studentId);
        }
    }
    
    // Delete student button
    if (event.target.classList.contains('delete-student-btn') || 
        event.target.parentElement.classList.contains('delete-student-btn')) {
        
        const button = event.target.classList.contains('delete-student-btn') ? 
            event.target : event.target.parentElement;
        
        const studentId = button.getAttribute('data-student-id');
        if (studentId) {
            openDeleteConfirmationModal('student', studentId);
        }
    }
});

// View class details
function viewClassDetails(classId) {
    // This would normally navigate to a class details page
    // For now, just show a notification
    showNotification('Viewing class details is not implemented yet.', 'info');
}

// View student details
function viewStudentDetails(studentId) {
    // This would normally navigate to a student details page
    // For now, just show a notification
    showNotification('Viewing student details is not implemented yet.', 'info');
}

// Open edit student modal
function openEditStudentModal(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    // Set form values
    document.getElementById('edit-student-id').value = student.id;
    document.getElementById('edit-student-name').value = student.name;
    document.getElementById('edit-student-gender').value = student.gender;
    document.getElementById('edit-student-dob').value = student.dob;
    document.getElementById('edit-student-class').value = student.classId;
    document.getElementById('edit-parent-name').value = student.parentName;
    document.getElementById('edit-parent-phone').value = student.parentPhone;
    document.getElementById('edit-parent-email').value = student.parentEmail || '';
    document.getElementById('edit-student-address').value = student.address || '';
    document.getElementById('edit-student-status').value = student.status;
    
    // Show modal
    document.getElementById('edit-student-modal').classList.add('active');
}

// Initialize edit student form submission
document.addEventListener('DOMContentLoaded', function() {
    const editStudentForm = document.getElementById('edit-student-form');
    if (editStudentForm) {
        editStudentForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form data
            const studentId = document.getElementById('edit-student-id').value;
            const studentName = document.getElementById('edit-student-name').value;
            const studentGender = document.getElementById('edit-student-gender').value;
            const studentDob = document.getElementById('edit-student-dob').value;
            const studentClass = document.getElementById('edit-student-class').value;
            const parentName = document.getElementById('edit-parent-name').value;
            const parentPhone = document.getElementById('edit-parent-phone').value;
            const parentEmail = document.getElementById('edit-parent-email').value;
            const studentAddress = document.getElementById('edit-student-address').value;
            const studentStatus = document.getElementById('edit-student-status').value;
            
            // Find student index
            const studentIndex = students.findIndex(s => s.id === studentId);
            
            if (studentIndex !== -1) {
                // Update student object
                students[studentIndex] = {
                    ...students[studentIndex],
                    name: studentName,
                    gender: studentGender,
                    dob: studentDob,
                    classId: studentClass,
                    parentName: parentName,
                    parentPhone: parentPhone,
                    parentEmail: parentEmail || '',
                    address: studentAddress || '',
                    status: studentStatus
                };
                
                // Save to localStorage
                saveStudents();
                
                // Update display
                displayStudents();
                
                // Close modal
                document.getElementById('edit-student-modal').classList.remove('active');
                
                // Show success message
                showNotification('Student updated successfully!', 'success');
            }
        });
    }
    
    // Initialize edit timetable button
    const editTimetableBtn = document.getElementById('edit-timetable-btn');
    if (editTimetableBtn) {
        editTimetableBtn.addEventListener('click', function() {
            const classId = document.getElementById('timetable-class-filter').value;
            if (classId) {
                openEditTimetableModal(classId);
            }
        });
    }
    
    // Initialize print timetable button
    const printTimetableBtn = document.getElementById('print-timetable-btn');
    if (printTimetableBtn) {
        printTimetableBtn.addEventListener('click', function() {
            printTimetable();
        });
    }
    
    // Initialize settings forms
    const generalSettingsForm = document.getElementById('general-settings-form');
    if (generalSettingsForm) {
        generalSettingsForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form data
            const maxStudentsPerClass = document.getElementById('max-students-per-class').value;
            const defaultClassStartTime = document.getElementById('default-class-start-time').value;
            const defaultClassEndTime = document.getElementById('default-class-end-time').value;
            const defaultPeriodDuration = document.getElementById('default-period-duration').value;
            
            // Save settings to localStorage
            const settings = {
                maxStudentsPerClass: parseInt(maxStudentsPerClass),
                defaultClassStartTime,
                defaultClassEndTime,
                defaultPeriodDuration: parseInt(defaultPeriodDuration)
            };
            
            localStorage.setItem('classSettings', JSON.stringify(settings));
            
            // Show success message
            showNotification('Settings saved successfully!', 'success');
        });
    }
    
    // Initialize reset settings button
    const resetSettingsBtn = document.getElementById('reset-settings-btn');
    if (resetSettingsBtn) {
        resetSettingsBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to reset all settings to default values?')) {
                // Reset settings
                const defaultSettings = {
                    maxStudentsPerClass: 30,
                    defaultClassStartTime: '08:00',
                    defaultClassEndTime: '14:00',
                    defaultPeriodDuration: 45
                };
                
                // Update form values
                document.getElementById('max-students-per-class').value = defaultSettings.maxStudentsPerClass;
                document.getElementById('default-class-start-time').value = defaultSettings.defaultClassStartTime;
                document.getElementById('default-class-end-time').value = defaultSettings.defaultClassEndTime;
                document.getElementById('default-period-duration').value = defaultSettings.defaultPeriodDuration;
                
                // Save to localStorage
                localStorage.setItem('classSettings', JSON.stringify(defaultSettings));
                
                // Show success message
                showNotification('Settings have been reset to default values.', 'success');
            }
        });
    }
    
    // Load settings
    loadSettings();
});

// Open edit timetable modal
function openEditTimetableModal(classId) {
    const cls = classes.find(c => c.id === classId);
    if (!cls) return;
    
    const timetable = timetables.find(t => t.classId === classId);
    if (!timetable) return;
    
    // Set form values
    document.getElementById('timetable-class-id').value = classId;
    document.getElementById('timetable-class-name').value = cls.name;
    document.getElementById('timetable-start-time').value = timetable.startTime;
    document.getElementById('timetable-end-time').value = timetable.endTime;
    document.getElementById('timetable-period-duration').value = timetable.periodDuration;
    document.getElementById('timetable-break-time').value = timetable.breakTime;
    document.getElementById('timetable-break-duration').value = timetable.breakDuration;
    
    // Generate timetable slots
    generateTimetableSlots(timetable);
    
    // Show modal
    document.getElementById('edit-timetable-modal').classList.add('active');
}

// Generate timetable slots
function generateTimetableSlots(timetable) {
    const container = document.getElementById('timetable-slots-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Generate time slots
    const startTime = new Date(`2000-01-01T${timetable.startTime}`);
    const endTime = new Date(`2000-01-01T${timetable.endTime}`);
    const periodDuration = timetable.periodDuration;
    const breakTime = new Date(`2000-01-01T${timetable.breakTime}`);
    const breakDuration = timetable.breakDuration;
    
    const timeSlots = [];
    let currentTime = new Date(startTime);
    
    while (currentTime < endTime) {
        const slotStart = currentTime.toTimeString().substring(0, 5);
        
        // Add period duration
        currentTime.setMinutes(currentTime.getMinutes() + periodDuration);
        
        // Check if we've gone past the end time
        if (currentTime > endTime) {
            currentTime = new Date(endTime);
        }
        
        const slotEnd = currentTime.toTimeString().substring(0, 5);
        
        // Check if this is a break time
        const isBreak = (
            breakTime <= currentTime && 
            new Date(breakTime.getTime() + breakDuration * 60000) >= currentTime
        );
        
        if (!isBreak) {
            timeSlots.push({
                start: slotStart,
                end: slotEnd
            });
        } else {
            // Skip break time
            currentTime = new Date(breakTime.getTime() + breakDuration * 60000);
        }
    }
    
    // Create timetable grid
    const grid = document.createElement('div');
    grid.className = 'timetable-edit-grid';
    
    // Add header row
    grid.innerHTML = `
        <div class="timetable-edit-header">Time</div>
        <div class="timetable-edit-header">Monday</div>
        <div class="timetable-edit-header">Tuesday</div>
        <div class="timetable-edit-header">Wednesday</div>
        <div class="timetable-edit-header">Thursday</div>
        <div class="timetable-edit-header">Friday</div>
    `;
    
    // Add time slots
    timeSlots.forEach(slot => {
        grid.innerHTML += `
            <div class="timetable-edit-cell">${slot.start} - ${slot.end}</div>
            <div class="timetable-edit-cell">
                <select name="subject_Monday_${slot.start}">
                    <option value="">Select Subject</option>
                    <!-- Subjects will be populated dynamically -->
                </select>
            </div>
            <div class="timetable-edit-cell">
                <select name="subject_Tuesday_${slot.start}">
                    <option value="">Select Subject</option>
                    <!-- Subjects will be populated dynamically -->
                </select>
            </div>
            <div class="timetable-edit-cell">
                <select name="subject_Wednesday_${slot.start}">
                    <option value="">Select Subject</option>
                    <!-- Subjects will be populated dynamically -->
                </select>
            </div>
            <div class="timetable-edit-cell">
                <select name="subject_Thursday_${slot.start}">
                    <option value="">Select Subject</option>
                    <!-- Subjects will be populated dynamically -->
                </select>
            </div>
            <div class="timetable-edit-cell">
                <select name="subject_Friday_${slot.start}">
                    <option value="">Select Subject</option>
                    <!-- Subjects will be populated dynamically -->
                </select>
            </div>
        `;
    });
    
    container.appendChild(grid);
    
    // Add break time note
    const breakNote = document.createElement('div');
    breakNote.className = 'break-note';
    breakNote.innerHTML = `
        <p><strong>Note:</strong> Break time is set from ${timetable.breakTime} for ${timetable.breakDuration} minutes.</p>
    `;
    
    container.appendChild(breakNote);
}

// Print timetable
function printTimetable() {
    const classId = document.getElementById('timetable-class-filter').value;
    if (!classId) return;
    
    const cls = classes.find(c => c.id === classId);
    if (!cls) return;
    
    // Open a new window for printing
    const printWindow = window.open('', '_blank');
    
    // Write the HTML content
    printWindow.document.write(`
        <html>
        <head>
            <title>Class Timetable - ${cls.name}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                }
                h1 {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .school-info {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .timetable-info {
                    margin-bottom: 20px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 30px;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: center;
                }
                th {
                    background-color: #f2f2f2;
                }
                .time-cell {
                    font-weight: bold;
                    background-color: #f9f9f9;
                    width: 120px;
                }
                .break-cell {
                    background-color: #f5f5f5;
                    font-style: italic;
                }
                .subject-name {
                    font-weight: bold;
                    margin-bottom: 3px;
                }
                .subject-teacher {
                    font-size: 0.9rem;
                    color: #666;
                }
                .footer {
                    margin-top: 50px;
                    text-align: center;
                    font-size: 0.9rem;
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
            <div class="school-info">
                <h1>Franciscan Catholic Nursery & Primary School</h1>
                <h2>Class Timetable</h2>
            </div>
            
            <div class="timetable-info">
                <p><strong>Class:</strong> ${cls.name}</p>
                <p><strong>Class Teacher:</strong> ${cls.teacherId ? getTeacherName(cls.teacherId) : 'Not Assigned'}</p>
                <p><strong>Academic Year:</strong> ${new Date().getFullYear()}</p>
                <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Monday</th>
                        <th>Tuesday</th>
                        <th>Wednesday</th>
                        <th>Thursday</th>
                        <th>Friday</th>
                    </tr>
                </thead>
                <tbody>
                    ${document.getElementById('class-timetable').querySelector('tbody').innerHTML}
                </tbody>
            </table>
            
            <div class="footer">
                <p>This timetable is subject to change. Please check with the school administration for any updates.</p>
            </div>
        </body>
        </html>
    `);
    
    // Close the document for writing
    printWindow.document.close();
    
    // Wait for the page to load before printing
    setTimeout(() => {
        printWindow.print();
    }, 500);
}

// Load settings
function loadSettings() {
    const storedSettings = localStorage.getItem('classSettings');
    
    if (storedSettings) {
        const settings = JSON.parse(storedSettings);
        
        // Update form values
        const maxStudentsPerClass = document.getElementById('max-students-per-class');
        const defaultClassStartTime = document.getElementById('default-class-start-time');
        const defaultClassEndTime = document.getElementById('default-class-end-time');
        const defaultPeriodDuration = document.getElementById('default-period-duration');
        
        if (maxStudentsPerClass) maxStudentsPerClass.value = settings.maxStudentsPerClass;
        if (defaultClassStartTime) defaultClassStartTime.value = settings.defaultClassStartTime;
        if (defaultClassEndTime) defaultClassEndTime.value = settings.defaultClassEndTime;
        if (defaultPeriodDuration) defaultPeriodDuration.value = settings.defaultPeriodDuration;
    }
}

// Initialize edit timetable form submission
document.addEventListener('DOMContentLoaded', function() {
    const editTimetableForm = document.getElementById('edit-timetable-form');
    if (editTimetableForm) {
        editTimetableForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form data
            const classId = document.getElementById('timetable-class-id').value;
            const startTime = document.getElementById('timetable-start-time').value;
            const endTime = document.getElementById('timetable-end-time').value;
            const periodDuration = document.getElementById('timetable-period-duration').value;
            const breakTime = document.getElementById('timetable-break-time').value;
            const breakDuration = document.getElementById('timetable-break-duration').value;
            
            // Find timetable index
            const timetableIndex = timetables.findIndex(t => t.classId === classId);
            
            if (timetableIndex !== -1) {
                // Update timetable object
                timetables[timetableIndex] = {
                    ...timetables[timetableIndex],
                    startTime,
                    endTime,
                    periodDuration: parseInt(periodDuration),
                    breakTime,
                    breakDuration: parseInt(breakDuration)
                };
                
                // Save to localStorage
                saveTimetables();
                
                // Update display
                displayTimetable(classId);
                
                // Close modal
                document.getElementById('edit-timetable-modal').classList.remove('active');
                
                // Show success message
                showNotification('Timetable updated successfully!', 'success');
            }
        });
    }
});

// Initialize class levels form submission
document.addEventListener('DOMContentLoaded', function() {
    const classLevelsForm = document.getElementById('class-levels-form');
    if (classLevelsForm) {
        classLevelsForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form data
            const nurseryLevels = document.getElementById('nursery-levels').value;
            const primaryLevels = document.getElementById('primary-levels').value;
            const juniorSecondaryLevels = document.getElementById('junior-secondary-levels').value;
            const seniorSecondaryLevels = document.getElementById('senior-secondary-levels').value;
            
            // Save settings to localStorage
            const settings = {
                nurseryLevels: parseInt(nurseryLevels),
                primaryLevels: parseInt(primaryLevels),
                juniorSecondaryLevels: parseInt(juniorSecondaryLevels),
                seniorSecondaryLevels: parseInt(seniorSecondaryLevels)
            };
            
            localStorage.setItem('classLevelsSettings', JSON.stringify(settings));
            
            // Show success message
            showNotification('Class levels settings saved successfully!', 'success');
        });
    }
    
    // Load class levels settings
    loadClassLevelsSettings();
});

// Load class levels settings
function loadClassLevelsSettings() {
    const storedSettings = localStorage.getItem('classLevelsSettings');
    
    if (storedSettings) {
        const settings = JSON.parse(storedSettings);
        
        // Update form values
        const nurseryLevels = document.getElementById('nursery-levels');
        const primaryLevels = document.getElementById('primary-levels');
        const juniorSecondaryLevels = document.getElementById('junior-secondary-levels');
        const seniorSecondaryLevels = document.getElementById('senior-secondary-levels');
        
        if (nurseryLevels) nurseryLevels.value = settings.nurseryLevels;
        if (primaryLevels) primaryLevels.value = settings.primaryLevels;
        if (juniorSecondaryLevels) juniorSecondaryLevels.value = settings.juniorSecondaryLevels;
        if (seniorSecondaryLevels) seniorSecondaryLevels.value = settings.seniorSecondaryLevels;
    }
}

// Logout functionality
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(event) {
            event.preventDefault();
            
            if (confirm('Are you sure you want to logout?')) {
                // In a real application, this would clear session data and redirect to login page
                window.location.href = 'login.html';
            }
        });
    }
});

