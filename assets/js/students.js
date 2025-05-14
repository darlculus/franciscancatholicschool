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
    
    // Load students data
    loadStudentsData();
    
    // Load classes for dropdowns
    loadClassesForDropdowns();
    
    // Initialize search and filters
    initSearchAndFilters();
    
    // Initialize enrollment chart
    initEnrollmentChart();
    
    // Initialize pagination
    initPagination();
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
            const tabPane = document.getElementById(`${tabId}-tab`);
            if (tabPane) {
                tabPane.classList.add('active');
            }
            
            // Load tab-specific data if needed
            if (tabId === 'enrollment') {
                loadEnrollmentData();
            } else if (tabId === 'reports') {
                // Initialize reports if needed
            }
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
        if (trigger.id.includes('add-student')) {
            trigger.addEventListener('click', function() {
                const modal = document.getElementById('add-student-modal');
                if (modal) {
                    resetForm('add-student-form');
                    showFormTab('personal', false);
                    modal.classList.add('active');
                }
            });
        } else if (trigger.id.includes('import-students')) {
            trigger.addEventListener('click', function() {
                const modal = document.getElementById('import-students-modal');
                if (modal) {
                    modal.classList.add('active');
                }
            });
        }
    });
    
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
    
    // Add event listeners for form submissions
    const addStudentForm = document.getElementById('add-student-form');
    if (addStudentForm) {
        addStudentForm.addEventListener('submit', function(event) {
            event.preventDefault();
            addStudent();
        });
    }
    
    const editStudentForm = document.getElementById('edit-student-form');
    if (editStudentForm) {
        editStudentForm.addEventListener('submit', function(event) {
            event.preventDefault();
            updateStudent();
        });
    }
    
    const importStudentsForm = document.getElementById('import-students-form');
    if (importStudentsForm) {
        importStudentsForm.addEventListener('submit', function(event) {
            event.preventDefault();
            importStudents();
        });
    }
    
    // Download template link
    const downloadTemplateLink = document.getElementById('download-template');
    if (downloadTemplateLink) {
        downloadTemplateLink.addEventListener('click', function(event) {
            event.preventDefault();
            downloadImportTemplate();
        });
    }
}

// Initialize form tabs
function initFormTabs() {
    // Add Student Form Tabs
    initFormTabsFor('add-student-form', 'personal', 'prev-tab-btn', 'next-tab-btn', 'submit-student-btn');
    
    // Edit Student Form Tabs
    initFormTabsFor('edit-student-form', 'edit-personal', 'edit-prev-tab-btn', 'edit-next-tab-btn', 'update-student-btn');
}

function initFormTabsFor(formId, initialTabId, prevBtnId, nextBtnId, submitBtnId) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    const tabs = form.querySelectorAll('.form-tab');
    const tabContents = form.querySelectorAll('.form-tab-content');
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    const submitBtn = document.getElementById(submitBtnId);
    
    let currentTabIndex = 0;
    
    // Set initial tab
    showFormTab(initialTabId, false);
    
    // Add click event to tabs
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', function() {
            currentTabIndex = index;
            updateFormTabButtons();
            
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            const tabContent = document.getElementById(`${tabId}-info-tab`);
            if (tabContent) {
                tabContent.classList.add('active');
            }
        });
    });
    
    // Previous button click
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentTabIndex > 0) {
                currentTabIndex--;
                const tabId = tabs[currentTabIndex].getAttribute('data-tab');
                showFormTab(tabId, false);
            }
        });
    }
    
    // Next button click
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (currentTabIndex < tabs.length - 1) {
                currentTabIndex++;
                const tabId = tabs[currentTabIndex].getAttribute('data-tab');
                showFormTab(tabId, false);
            }
        });
    }
    
    function updateFormTabButtons() {
        if (prevBtn) {
            prevBtn.disabled = currentTabIndex === 0;
        }
        
        if (nextBtn && submitBtn) {
            if (currentTabIndex === tabs.length - 1) {
                nextBtn.style.display = 'none';
                submitBtn.style.display = 'block';
            } else {
                nextBtn.style.display = 'block';
                submitBtn.style.display = 'none';
            }
        }
    }
}

// Show a specific form tab
function showFormTab(tabId, isEditForm = false) {
        const prefix = isEditForm ? 'edit-' : '';
    const tabSelector = `.form-tab[data-tab="${prefix}${tabId}"]`;
    const tabContentId = `${prefix}${tabId}-info-tab`;
    
    const tabs = document.querySelectorAll('.form-tab');
    const tabContents = document.querySelectorAll('.form-tab-content');
    
    // Remove active class from all tabs and contents
    tabs.forEach(tab => tab.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Add active class to the specified tab and content
    const selectedTab = document.querySelector(tabSelector);
    const selectedContent = document.getElementById(tabContentId);
    
    if (selectedTab && selectedContent) {
        selectedTab.classList.add('active');
        selectedContent.classList.add('active');
        
        // Update current tab index
        const tabIndex = Array.from(tabs).indexOf(selectedTab);
        
        // Update buttons
        const prevBtnId = isEditForm ? 'edit-prev-tab-btn' : 'prev-tab-btn';
        const nextBtnId = isEditForm ? 'edit-next-tab-btn' : 'next-tab-btn';
        const submitBtnId = isEditForm ? 'update-student-btn' : 'submit-student-btn';
        
        const prevBtn = document.getElementById(prevBtnId);
        const nextBtn = document.getElementById(nextBtnId);
        const submitBtn = document.getElementById(submitBtnId);
        
        if (prevBtn) {
            prevBtn.disabled = tabIndex === 0;
        }
        
        if (nextBtn && submitBtn) {
            if (tabIndex === tabs.length / 2 - 1) { // Divide by 2 because we have two sets of tabs (add and edit)
                nextBtn.style.display = 'none';
                submitBtn.style.display = 'block';
            } else {
                nextBtn.style.display = 'block';
                submitBtn.style.display = 'none';
            }
        }
    }
}

// Reset form
function resetForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
        
        // Reset any custom form elements if needed
        const colorOptions = form.querySelectorAll('.color-option');
        if (colorOptions.length > 0) {
            colorOptions.forEach(option => option.classList.remove('selected'));
            colorOptions[0].classList.add('selected');
        }
    }
}

// Load students data
function loadStudentsData() {
    // Show loading state
    const studentsTable = document.getElementById('students-table');
    if (studentsTable) {
        const tbody = studentsTable.querySelector('tbody');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center">
                        <div class="loading-spinner">
                            <i class="fas fa-spinner fa-spin"></i> Loading students...
                        </div>
                    </td>
                </tr>
            `;
        }
    }
    
    // In a real application, you would fetch data from a server
    // For this demo, we'll use sample data
    setTimeout(() => {
        // Generate sample students
        const students = generateSampleStudents(50);
        
        // Update stats
        updateStudentStats(students);
        
        // Populate the table
        populateStudentsTable(students);
    }, 1000);
}

// Generate sample students
function generateSampleStudents(count) {
    const students = [];
    const classes = [
        { id: 'nursery1', name: 'Nursery 1' },
        { id: 'nursery2', name: 'Nursery 2' },
        { id: 'primary1', name: 'Primary 1' },
        { id: 'primary2', name: 'Primary 2' },
        { id: 'primary3', name: 'Primary 3' },
        { id: 'primary4', name: 'Primary 4' },
        { id: 'primary5', name: 'Primary 5' },
        { id: 'primary6', name: 'Primary 6' }
    ];
    
    const firstNames = ['John', 'Mary', 'David', 'Sarah', 'Michael', 'Emma', 'James', 'Olivia', 'Daniel', 'Sophia', 'Matthew', 'Ava', 'Joseph', 'Isabella', 'Andrew', 'Mia', 'William', 'Charlotte', 'Alexander', 'Amelia'];
    
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson'];
    
    const genders = ['Male', 'Female'];
    
    for (let i = 1; i <= count; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const gender = genders[Math.floor(Math.random() * genders.length)];
        const classInfo = classes[Math.floor(Math.random() * classes.length)];
        
        // Generate random date in the past 5 years
        const enrollmentDate = new Date();
        enrollmentDate.setFullYear(enrollmentDate.getFullYear() - Math.floor(Math.random() * 5));
        enrollmentDate.setMonth(Math.floor(Math.random() * 12));
        enrollmentDate.setDate(Math.floor(Math.random() * 28) + 1);
        
        students.push({
            id: `STU${i.toString().padStart(4, '0')}`,
            firstName,
            lastName,
            fullName: `${firstName} ${lastName}`,
            gender,
            dob: new Date(enrollmentDate.getFullYear() - (5 + Math.floor(Math.random() * 7)), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
            classId: classInfo.id,
            className: classInfo.name,
            enrollmentDate,
            status: Math.random() > 0.1 ? 'active' : 'inactive',
            parentName: `${lastNames[Math.floor(Math.random() * lastNames.length)]} Parent`,
            parentPhone: `+234${Math.floor(Math.random() * 1000000000)}`,
            parentEmail: `parent${i}@example.com`,
            address: '123 Sample Street, Lagos, Nigeria'
        });
    }
    
    return students;
}

// Update student statistics
function updateStudentStats(students) {
    const studentCount = document.getElementById('student-count');
    const maleCount = document.getElementById('male-count');
    const femaleCount = document.getElementById('female-count');
    const classCount = document.getElementById('class-count');
    
    if (studentCount) {
        studentCount.textContent = students.length;
    }
    
    if (maleCount) {
        maleCount.textContent = students.filter(student => student.gender === 'Male').length;
    }
    
    if (femaleCount) {
        femaleCount.textContent = students.filter(student => student.gender === 'Female').length;
    }
    
    if (classCount) {
        // Count unique classes
        const uniqueClasses = new Set(students.map(student => student.classId));
        classCount.textContent = uniqueClasses.size;
    }
}

// Populate students table
function populateStudentsTable(students) {
    const studentsTable = document.getElementById('students-table');
    if (!studentsTable) return;
    
    const tbody = studentsTable.querySelector('tbody');
    if (!tbody) return;
    
    // Clear the table
    tbody.innerHTML = '';
    
    if (students.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-user-graduate"></i>
                        <h3>No Students Found</h3>
                        <p>There are no students matching your search criteria.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    // Add students to the table
    students.forEach(student => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${student.id}</td>
            <td>
                <div class="student-name">
                    <div class="student-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="student-info">
                        <span>${student.fullName}</span>
                        <span class="student-id">${student.gender}</span>
                    </div>
                </div>
            </td>
            <td>${student.className}</td>
            <td>
                <div class="parent-info">
                    <div>${student.parentName}</div>
                    <div class="parent-contact">${student.parentPhone}</div>
                </div>
            </td>
            <td>${formatDate(student.enrollmentDate)}</td>
            <td>
                <span class="status-badge status-${student.status}">
                    ${student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view" data-student-id="${student.id}" title="View Student">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" data-student-id="${student.id}" title="Edit Student">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" data-student-id="${student.id}" title="Delete Student">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </td>
        `;
        
        // Add event listeners for action buttons
        const viewBtn = row.querySelector('.action-btn.view');
        const editBtn = row.querySelector('.action-btn.edit');
        const deleteBtn = row.querySelector('.action-btn.delete');
        
        if (viewBtn) {
            viewBtn.addEventListener('click', function() {
                viewStudent(student.id);
            });
        }
        
        if (editBtn) {
            editBtn.addEventListener('click', function() {
                editStudent(student.id);
            });
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function() {
                deleteStudent(student.id);
            });
        }
        
        tbody.appendChild(row);
    });
}

// Load classes for dropdowns
function loadClassesForDropdowns() {
    // In a real application, you would fetch this data from a server
    // For this demo, we'll use sample data
    const classes = [
        { id: 'nursery1', name: 'Nursery 1' },
        { id: 'nursery2', name: 'Nursery 2' },
        { id: 'primary1', name: 'Primary 1' },
        { id: 'primary2', name: 'Primary 2' },
        { id: 'primary3', name: 'Primary 3' },
        { id: 'primary4', name: 'Primary 4' },
        { id: 'primary5', name: 'Primary 5' },
        { id: 'primary6', name: 'Primary 6' }
    ];
    
    // Populate class filter dropdown
    const classFilter = document.getElementById('class-filter');
    if (classFilter) {
        classes.forEach(cls => {
            const option = document.createElement('option');
            option.value = cls.id;
            option.textContent = cls.name;
            classFilter.appendChild(option);
        });
    }
    
    // Populate add student form class dropdown
    const studentClass = document.getElementById('class');
    if (studentClass) {
        classes.forEach(cls => {
            const option = document.createElement('option');
            option.value = cls.id;
            option.textContent = cls.name;
            studentClass.appendChild(option);
        });
    }
    
    // Populate edit student form class dropdown
    const editStudentClass = document.getElementById('edit-class');
    if (editStudentClass) {
        classes.forEach(cls => {
            const option = document.createElement('option');
            option.value = cls.id;
            option.textContent = cls.name;
            editStudentClass.appendChild(option);
        });
    }
    
    // Populate academic class filter dropdown
    const academicClassFilter = document.getElementById('academic-class-filter');
    if (academicClassFilter) {
        classes.forEach(cls => {
            const option = document.createElement('option');
            option.value = cls.id;
            option.textContent = cls.name;
            academicClassFilter.appendChild(option);
        });
    }
    
    // Populate report class filter dropdown
    const reportClassFilter = document.getElementById('report-class-filter');
    if (reportClassFilter) {
        classes.forEach(cls => {
            const option = document.createElement('option');
            option.value = cls.id;
            option.textContent = cls.name;
            reportClassFilter.appendChild(option);
        });
    }
}

// Initialize search and filters
function initSearchAndFilters() {
    const studentSearch = document.getElementById('student-search');
    const classFilter = document.getElementById('class-filter');
    const statusFilter = document.getElementById('status-filter');
    
    if (studentSearch) {
        studentSearch.addEventListener('input', function() {
            filterStudents();
        });
    }
    
    if (classFilter) {
        classFilter.addEventListener('change', function() {
            filterStudents();
        });
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            filterStudents();
        });
    }
}

// Filter students based on search and filter values
function filterStudents() {
    const searchValue = document.getElementById('student-search')?.value.toLowerCase() || '';
    const classValue = document.getElementById('class-filter')?.value || '';
    const statusValue = document.getElementById('status-filter')?.value || '';
    
    // In a real application, you would fetch filtered data from a server
    // For this demo, we'll filter the sample data
    const allStudents = generateSampleStudents(50);
    
    const filteredStudents = allStudents.filter(student => {
        // Search filter
        const matchesSearch = searchValue === '' || 
            student.fullName.toLowerCase().includes(searchValue) || 
            student.id.toLowerCase().includes(searchValue) || 
            student.parentName.toLowerCase().includes(searchValue);
        
        // Class filter
        const matchesClass = classValue === '' || student.classId === classValue;
        
        // Status filter
        const matchesStatus = statusValue === '' || student.status === statusValue;
        
        return matchesSearch && matchesClass && matchesStatus;
    });
    
        // Update the table with filtered students
    populateStudentsTable(filteredStudents);
}

// Initialize enrollment chart
function initEnrollmentChart() {
    const enrollmentChartCanvas = document.getElementById('enrollment-chart');
    if (!enrollmentChartCanvas) return;
    
    // In a real application, you would fetch this data from a server
    // For this demo, we'll use sample data
    const enrollmentData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'New Enrollments',
                data: [12, 8, 5, 7, 10, 15, 20, 25, 18, 12, 8, 10],
                backgroundColor: 'rgba(63, 81, 181, 0.2)',
                borderColor: 'rgba(63, 81, 181, 1)',
                borderWidth: 2,
                tension: 0.4
            },
            {
                label: 'Withdrawals',
                data: [2, 1, 3, 2, 1, 2, 3, 2, 1, 2, 1, 2],
                backgroundColor: 'rgba(244, 67, 54, 0.2)',
                borderColor: 'rgba(244, 67, 54, 1)',
                borderWidth: 2,
                tension: 0.4
            }
        ]
    };
    
    // Create the chart
    const enrollmentChart = new Chart(enrollmentChartCanvas, {
        type: 'line',
        data: enrollmentData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Students'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Month'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            }
        }
    });
    
    // Update enrollment summary
    updateEnrollmentSummary();
}

// Update enrollment summary
function updateEnrollmentSummary() {
    // In a real application, you would fetch this data from a server
    // For this demo, we'll use sample data
    const totalEnrollments = 150;
    const newEnrollments = 25;
    const withdrawals = 5;
    const netGrowth = newEnrollments - withdrawals;
    const growthRate = (netGrowth / (totalEnrollments - newEnrollments + withdrawals)) * 100;
    
    // Update summary cards
    const totalCard = document.getElementById('total-enrollments');
    const newCard = document.getElementById('new-enrollments');
    const withdrawalCard = document.getElementById('withdrawals');
    const growthCard = document.getElementById('enrollment-growth');
    
    if (totalCard) {
        totalCard.textContent = totalEnrollments;
    }
    
    if (newCard) {
        newCard.textContent = newEnrollments;
    }
    
    if (withdrawalCard) {
        withdrawalCard.textContent = withdrawals;
    }
    
    if (growthCard) {
        growthCard.textContent = `${netGrowth > 0 ? '+' : ''}${netGrowth}`;
        
        const growthChange = document.getElementById('growth-change');
        if (growthChange) {
            growthChange.textContent = `${growthRate.toFixed(1)}%`;
            growthChange.className = netGrowth >= 0 ? 'summary-change positive' : 'summary-change negative';
        }
    }
}

// Initialize pagination
function initPagination() {
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const paginationInfo = document.getElementById('pagination-info');
    
    if (prevPageBtn && nextPageBtn && paginationInfo) {
        // Set initial state
        let currentPage = 1;
        const totalPages = 5; // In a real app, this would be calculated based on total records
        
        updatePaginationInfo();
        
        prevPageBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                updatePaginationInfo();
                // In a real app, you would load the data for the new page
                loadStudentsData(); // This would include page parameter
            }
        });
        
        nextPageBtn.addEventListener('click', function() {
            if (currentPage < totalPages) {
                currentPage++;
                updatePaginationInfo();
                // In a real app, you would load the data for the new page
                loadStudentsData(); // This would include page parameter
            }
        });
        
        function updatePaginationInfo() {
            paginationInfo.textContent = `Page ${currentPage} of ${totalPages}`;
            prevPageBtn.disabled = currentPage === 1;
            nextPageBtn.disabled = currentPage === totalPages;
        }
    }
}

// Load enrollment data
function loadEnrollmentData() {
    // In a real application, you would fetch this data from a server
    // For this demo, we'll use the chart we already initialized
    
    // Update enrollment by class chart
    const enrollmentByClassCanvas = document.getElementById('enrollment-by-class-chart');
    if (!enrollmentByClassCanvas) return;
    
    // Sample data
    const classData = {
        labels: ['Nursery 1', 'Nursery 2', 'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6'],
        datasets: [
            {
                label: 'Number of Students',
                data: [15, 18, 25, 22, 20, 23, 21, 19],
                backgroundColor: [
                    'rgba(63, 81, 181, 0.7)',
                    'rgba(33, 150, 243, 0.7)',
                    'rgba(0, 150, 136, 0.7)',
                    'rgba(76, 175, 80, 0.7)',
                    'rgba(255, 152, 0, 0.7)',
                    'rgba(255, 87, 34, 0.7)',
                    'rgba(156, 39, 176, 0.7)',
                    'rgba(233, 30, 99, 0.7)'
                ],
                borderWidth: 1
            }
        ]
    };
    
    // Create the chart
    const enrollmentByClassChart = new Chart(enrollmentByClassCanvas, {
        type: 'bar',
        data: classData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Students'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Class'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Students: ${context.raw}`;
                        }
                    }
                }
            }
        }
    });
}

// View student details
function viewStudent(studentId) {
    // In a real application, you would fetch student data from a server
    // For this demo, we'll use sample data
    const students = generateSampleStudents(50);
    const student = students.find(s => s.id === studentId);
    
    if (!student) {
        showNotification('Student not found', 'error');
        return;
    }
    
    // Get the modal
    const modal = document.getElementById('view-student-modal');
    if (!modal) return;
    
    // Populate modal content
    const modalContent = modal.querySelector('.modal-content');
    if (!modalContent) return;
    
    // Format date of birth
    const dob = formatDate(student.dob);
    const age = calculateAge(student.dob);
    
    // Format enrollment date
    const enrollmentDate = formatDate(student.enrollmentDate);
    
    modalContent.innerHTML = `
        <span class="close-modal">&times;</span>
        <div class="student-profile">
            <div class="profile-header">
                <div class="profile-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="profile-info">
                    <h2 class="profile-name">${student.fullName}</h2>
                    <div class="profile-id">${student.id}</div>
                    <div class="profile-meta">
                        <div class="meta-item">
                            <i class="fas fa-user-graduate"></i> ${student.className}
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-venus-mars"></i> ${student.gender}
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-calendar-alt"></i> ${dob} (${age} years)
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-calendar-check"></i> Enrolled: ${enrollmentDate}
                        </div>
                    </div>
                    <div class="profile-actions">
                        <button class="btn-primary edit-student-btn" data-student-id="${student.id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-secondary print-profile-btn" data-student-id="${student.id}">
                            <i class="fas fa-print"></i> Print
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="profile-sections">
                <div class="profile-section">
                    <h3 class="section-title">Personal Information</h3>
                    <div class="section-content">
                        <div class="info-item">
                            <div class="info-label">Full Name</div>
                            <div class="info-value">${student.fullName}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Gender</div>
                            <div class="info-value">${student.gender}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Date of Birth</div>
                            <div class="info-value">${dob}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Age</div>
                            <div class="info-value">${age} years</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Address</div>
                            <div class="info-value">${student.address}</div>
                        </div>
                    </div>
                </div>
                
                <div class="profile-section">
                    <h3 class="section-title">Academic Information</h3>
                    <div class="section-content">
                        <div class="info-item">
                            <div class="info-label">Student ID</div>
                            <div class="info-value">${student.id}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Class</div>
                            <div class="info-value">${student.className}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Enrollment Date</div>
                            <div class="info-value">${enrollmentDate}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Status</div>
                            <div class="info-value">
                                <span class="status-badge status-${student.status}">
                                    ${student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="profile-section">
                    <h3 class="section-title">Parent/Guardian Information</h3>
                    <div class="section-content">
                        <div class="info-item">
                            <div class="info-label">Name</div>
                            <div class="info-value">${student.parentName}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Phone</div>
                            <div class="info-value">${student.parentPhone}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Email</div>
                            <div class="info-value">${student.parentEmail}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Relationship</div>
                            <div class="info-value">Parent</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners
    const closeBtn = modalContent.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.classList.remove('active');
        });
    }
    
    const editBtn = modalContent.querySelector('.edit-student-btn');
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            modal.classList.remove('active');
            editStudent(student.id);
        });
    }
    
    const printBtn = modalContent.querySelector('.print-profile-btn');
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            printStudentProfile(student.id);
        });
    }
    
    // Show the modal
    modal.classList.add('active');
}

// Edit student
function editStudent(studentId) {
    // In a real application, you would fetch student data from a server
    // For this demo, we'll use sample data
    const students = generateSampleStudents(50);
    const student = students.find(s => s.id === studentId);
    
    if (!student) {
        showNotification('Student not found', 'error');
        return;
    }
    
    // Get the modal
    const modal = document.getElementById('edit-student-modal');
    if (!modal) return;
    
    // Populate form fields
    document.getElementById('edit-student-id').value = student.id;
    document.getElementById('edit-first-name').value = student.firstName;
    document.getElementById('edit-last-name').value = student.lastName;
    document.getElementById('edit-gender').value = student.gender;
    document.getElementById('edit-dob').value = formatDateForInput(student.dob);
    document.getElementById('edit-address').value = student.address;
        document.getElementById('edit-class').value = student.classId;
    document.getElementById('edit-enrollment-date').value = formatDateForInput(student.enrollmentDate);
    document.getElementById('edit-status').value = student.status;
    document.getElementById('edit-parent-name').value = student.parentName;
    document.getElementById('edit-parent-phone').value = student.parentPhone;
    document.getElementById('edit-parent-email').value = student.parentEmail;
    
    // Show the first tab
    showFormTab('personal', true);
    
    // Show the modal
    modal.classList.add('active');
}

// Delete student
function deleteStudent(studentId) {
    // Get the confirmation modal
    const modal = document.getElementById('delete-confirmation-modal');
    if (!modal) return;
    
    // Set the confirmation message
    const message = document.getElementById('delete-confirmation-message');
    if (message) {
        message.textContent = `Are you sure you want to delete student with ID ${studentId}? This action cannot be undone.`;
    }
    
    // Set up the confirm button
    const confirmBtn = document.getElementById('confirm-delete-btn');
    if (confirmBtn) {
        // Remove any existing event listeners
        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
        
        // Add new event listener
        newConfirmBtn.addEventListener('click', function() {
            // In a real application, you would send a delete request to the server
            // For this demo, we'll just show a notification
            showNotification(`Student ${studentId} has been deleted successfully.`, 'success');
            
            // Close the modal
            modal.classList.remove('active');
            
            // Reload students data
            loadStudentsData();
        });
    }
    
    // Show the modal
    modal.classList.add('active');
}

// Add student
function addStudent() {
    // Get form data
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const gender = document.getElementById('gender').value;
    const dob = document.getElementById('dob').value;
    const address = document.getElementById('address').value;
    const classId = document.getElementById('class').value;
    const enrollmentDate = document.getElementById('enrollment-date').value;
    const parentName = document.getElementById('parent-name').value;
    const parentPhone = document.getElementById('parent-phone').value;
    const parentEmail = document.getElementById('parent-email').value;
    
    // Validate form data
    if (!firstName || !lastName || !gender || !dob || !classId || !parentName || !parentPhone) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    // In a real application, you would send this data to a server
    // For this demo, we'll just show a notification
    showNotification(`Student ${firstName} ${lastName} has been added successfully.`, 'success');
    
    // Close the modal
    const modal = document.getElementById('add-student-modal');
    if (modal) {
        modal.classList.remove('active');
    }
    
    // Reload students data
    loadStudentsData();
}

// Update student
function updateStudent() {
    // Get form data
    const studentId = document.getElementById('edit-student-id').value;
    const firstName = document.getElementById('edit-first-name').value;
    const lastName = document.getElementById('edit-last-name').value;
    const gender = document.getElementById('edit-gender').value;
    const dob = document.getElementById('edit-dob').value;
    const address = document.getElementById('edit-address').value;
    const classId = document.getElementById('edit-class').value;
    const enrollmentDate = document.getElementById('edit-enrollment-date').value;
    const status = document.getElementById('edit-status').value;
    const parentName = document.getElementById('edit-parent-name').value;
    const parentPhone = document.getElementById('edit-parent-phone').value;
    const parentEmail = document.getElementById('edit-parent-email').value;
    
    // Validate form data
    if (!firstName || !lastName || !gender || !dob || !classId || !parentName || !parentPhone) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    // In a real application, you would send this data to a server
    // For this demo, we'll just show a notification
    showNotification(`Student ${firstName} ${lastName} has been updated successfully.`, 'success');
    
    // Close the modal
    const modal = document.getElementById('edit-student-modal');
    if (modal) {
        modal.classList.remove('active');
    }
    
    // Reload students data
    loadStudentsData();
}

// Import students
function importStudents() {
    const fileInput = document.getElementById('import-file');
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        showNotification('Please select a file to import.', 'error');
        return;
    }
    
    const file = fileInput.files[0];
    
    // In a real application, you would send this file to a server for processing
    // For this demo, we'll just show a notification
    showNotification(`File ${file.name} has been uploaded for processing.`, 'success');
    
    // Close the modal
    const modal = document.getElementById('import-students-modal');
    if (modal) {
        modal.classList.remove('active');
    }
    
    // Reload students data after a delay to simulate processing
    setTimeout(() => {
        loadStudentsData();
        showNotification('Students have been imported successfully.', 'success');
    }, 2000);
}

// Download import template
function downloadImportTemplate() {
    // In a real application, you would generate a CSV template
    // For this demo, we'll create a simple CSV string
    const csvContent = 'First Name,Last Name,Gender,Date of Birth,Class,Parent Name,Parent Phone,Parent Email,Address\n' +
                      'John,Doe,Male,2015-05-15,Primary 1,Jane Doe,+2341234567890,parent@example.com,123 Sample Street\n' +
                      'Mary,Smith,Female,2016-03-20,Nursery 2,James Smith,+2349876543210,parent2@example.com,456 Another Street';
    
    // Create a Blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'student_import_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Print student profile
function printStudentProfile(studentId) {
    // In a real application, you would fetch student data from a server
    // For this demo, we'll use sample data
    const students = generateSampleStudents(50);
    const student = students.find(s => s.id === studentId);
    
    if (!student) {
        showNotification('Student not found', 'error');
        return;
    }
    
    // Format date of birth
    const dob = formatDate(student.dob);
    const age = calculateAge(student.dob);
    
    // Format enrollment date
    const enrollmentDate = formatDate(student.enrollmentDate);
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    // Write the HTML content
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Student Profile - ${student.fullName}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    color: #333;
                }
                .header {
                    text-align: center;
                    margin-bottom: 20px;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #3f51b5;
                }
                .school-name {
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 5px;
                }
                .document-title {
                    font-size: 18px;
                    color: #666;
                }
                .profile-header {
                    display: flex;
                    margin-bottom: 20px;
                }
                .profile-info {
                    flex: 1;
                }
                .profile-name {
                    font-size: 20px;
                    font-weight: bold;
                    margin-bottom: 5px;
                }
                .profile-id {
                    font-size: 16px;
                    color: #666;
                    margin-bottom: 10px;
                }
                .profile-meta {
                    margin-bottom: 15px;
                }
                .meta-item {
                    margin-bottom: 5px;
                }
                .section {
                    margin-bottom: 20px;
                }
                .section-title {
                    font-size: 18px;
                    font-weight: bold;
                    margin-bottom: 10px;
                    padding-bottom: 5px;
                    border-bottom: 1px solid #ddd;
                }
                .info-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 10px;
                }
                .info-item {
                    margin-bottom: 10px;
                }
                .info-label {
                    font-weight: bold;
                    margin-bottom: 3px;
                }
                .footer {
                    margin-top: 30px;
                    text-align: center;
                    font-size: 12px;
                    color: #666;
                }
                .status-badge {
                    display: inline-block;
                    padding: 3px 8px;
                    border-radius: 12px;
                    font-size: 14px;
                }
                .status-active {
                    background-color: #E8F5E9;
                    color: #2E7D32;
                }
                .status-inactive {
                    background-color: #FFEBEE;
                    color: #C62828;
                }
                @media print {
                    body {
                        padding: 0;
                    }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="school-name">Franciscan Catholic Nursery & Primary School</div>
                <div class="document-title">Student Profile</div>
            </div>
            
            <div class="profile-header">
                <div class="profile-info">
                    <div class="profile-name">${student.fullName}</div>
                    <div class="profile-id">Student ID: ${student.id}</div>
                    <div class="profile-meta">
                        <div class="meta-item">Class: ${student.className}</div>
                        <div class="meta-item">Gender: ${student.gender}</div>
                        <div class="meta-item">Date of Birth: ${dob} (${age} years)</div>
                        <div class="meta-item">Enrollment Date: ${enrollmentDate}</div>
                        <div class="meta-item">Status: 
                            <span class="status-badge status-${student.status}">
                                ${student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">Personal Information</div>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Full Name</div>
                        <div>${student.fullName}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Gender</div>
                        <div>${student.gender}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Date of Birth</div>
                        <div>${dob}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Age</div>
                        <div>${age} years</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Address</div>
                        <div>${student.address}</div>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">Academic Information</div>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Student ID</div>
                        <div>${student.id}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Class</div>
                        <div>${student.className}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Enrollment Date</div>
                        <div>${enrollmentDate}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Status</div>
                        <div>
                            <span class="status-badge status-${student.status}">
                                ${student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">Parent/Guardian Information</div>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Name</div>
                        <div>${student.parentName}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Phone</div>
                        <div>${student.parentPhone}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Email</div>
                        <div>${student.parentEmail}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Relationship</div>
                        <div>Parent</div>
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <p>This document was generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
                <p>Franciscan Catholic Nursery & Primary School - Student Management System</p>
            </div>
        </body>
        </html>
    `);
    
    // Close the document
    printWindow.document.close();
    
    // Focus on the new window
    printWindow.focus();
    
    // Print after a short delay to ensure the content is loaded
    setTimeout(() => {
        printWindow.print();
    }, 500);
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

// Format date for display
function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Format date for input fields (YYYY-MM-DD)
function formatDateForInput(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    return date.toISOString().split('T')[0];
}

// Calculate age from date of birth
function calculateAge(dateString) {
    if (!dateString) return '';
    
    const dob = new Date(dateString);
    if (isNaN(dob.getTime())) return '';
    
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    
    return age;
}

// Generate student ID
function generateStudentId(className, count) {
    // Get class prefix
    const classPrefix = className.substring(0, 1).toUpperCase();
    
    // Get current year
    const year = new Date().getFullYear().toString().substring(2);
    
    // Format count with leading zeros
    const formattedCount = count.toString().padStart(3, '0');
    
    // Return formatted ID
    return `${classPrefix}${year}${formattedCount}`;
}

// Export students to CSV
function exportStudentsToCSV() {
    // In a real application, you would fetch this data from a server
    // For this demo, we'll use sample data
    const students = generateSampleStudents(50);
    
    // Create CSV header
    let csvContent = 'Student ID,First Name,Last Name,Gender,Date of Birth,Class,Enrollment Date,Status,Parent Name,Parent Phone,Parent Email,Address\n';
    
    // Add student data
    students.forEach(student => {
        const dob = formatDateForInput(student.dob);
        const enrollmentDate = formatDateForInput(student.enrollmentDate);
        
        // Escape any commas in the fields
        const escapedFullName = `"${student.fullName.replace(/"/g, '""')}"`;
        const escapedParentName = `"${student.parentName.replace(/"/g, '""')}"`;
        const escapedAddress = `"${student.address.replace(/"/g, '""')}"`;
        
        csvContent += `${student.id},${student.firstName},${student.lastName},${student.gender},${dob},${student.className},${enrollmentDate},${student.status},${escapedParentName},${student.parentPhone},${student.parentEmail},${escapedAddress}\n`;
    });
    
    // Create a Blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'students_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show notification
    showNotification('Students exported successfully.', 'success');
}

// Generate student reports
function generateStudentReports() {
    const reportType = document.getElementById('report-type').value;
    const classFilter = document.getElementById('report-class-filter').value;
    const statusFilter = document.getElementById('report-status-filter').value;
    const dateRange = document.getElementById('report-date-range').value;
    
    // Validate inputs
    if (!reportType) {
        showNotification('Please select a report type.', 'error');
        return;
    }
    
    // Show loading state
    const reportContent = document.getElementById('report-content');
    if (reportContent) {
        reportContent.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i> Generating report...
            </div>
        `;
    }
    
    // In a real application, you would fetch this data from a server
    // For this demo, we'll use sample data and simulate a delay
    setTimeout(() => {
        if (reportType === 'enrollment') {
            generateEnrollmentReport(classFilter, statusFilter, dateRange);
        } else if (reportType === 'demographic') {
            generateDemographicReport(classFilter);
        } else if (reportType === 'attendance') {
            generateAttendanceReport(classFilter, dateRange);
        }
        
        // Enable report actions
        const reportActions = document.querySelector('.reports-actions');
        if (reportActions) {
            reportActions.classList.remove('disabled');
        }
        
        // Show notification
        showNotification('Report generated successfully.', 'success');
    }, 1500);
}

// Generate enrollment report
function generateEnrollmentReport(classFilter, statusFilter, dateRange) {
    const reportContent = document.getElementById('report-content');
    if (!reportContent) return;
    
    // Sample data
    const students = generateSampleStudents(50);
    
    // Filter students based on criteria
    const filteredStudents = students.filter(student => {
        const matchesClass = !classFilter || student.classId === classFilter;
        const matchesStatus = !statusFilter || student.status === statusFilter;
        
        // For demo purposes, we'll ignore date range filtering
        return matchesClass && matchesStatus;
    });
    
    // Group students by class
    const classCounts = {};
    filteredStudents.forEach(student => {
        if (!classCounts[student.className]) {
            classCounts[student.className] = 0;
        }
        classCounts[student.className]++;
    });
    
    // Group students by enrollment month
    const monthCounts = {};
    filteredStudents.forEach(student => {
        const month = new Date(student.enrollmentDate).toLocaleString('default', { month: 'long' });
        if (!monthCounts[month]) {
            monthCounts[month] = 0;
        }
        monthCounts[month]++;
    });
    
    // Sort months chronologically
    const months = Object.keys(monthCounts);
    months.sort((a, b) => {
        const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return monthOrder.indexOf(a) - monthOrder.indexOf(b);
    });
    
    // Generate report HTML
    reportContent.innerHTML = `
        <div class="report-header">
            <h3>Student Enrollment Report</h3>
            <p>Total Students: ${filteredStudents.length}</p>
        </div>
        
        <div class="report-section">
            <h4>Enrollment by Class</h4>
            <div class="chart-container">
                <canvas id="enrollment-by-class-chart"></canvas>
            </div>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Class</th>
                            <th>Number of Students</th>
                            <th>Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.entries(classCounts).map(([className, count]) => `
                            <tr>
                                <td>${className}</td>
                                <td>${count}</td>
                                <td>${((count / filteredStudents.length) * 100).toFixed(1)}%</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
        
        <div class="report-section">
            <h4>Enrollment by Month</h4>
            <div class="chart-container">
                <canvas id="enrollment-by-month-chart"></canvas>
            </div>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th>Number of Students</th>
                            <th>Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${months.map(month => `
                            <tr>
                                <td>${month}</td>
                                <td>${monthCounts[month]}</td>
                                <td>${((monthCounts[month] / filteredStudents.length) * 100).toFixed(1)}%</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
        
        <div class="report-section">
            <h4>Student List</h4>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Name</th>
                            <th>Class</th>
                            <th>Gender</th>
                            <th>Enrollment Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredStudents.map(student => `
                            <tr>
                                <td>${student.id}</td>
                                <td>${student.fullName}</td>
                                <td>${student.className}</td>
                                <td>${student.gender}</td>
                                <td>${formatDate(student.enrollmentDate)}</td>
                                <td>
                                    <span class="status-badge status-${student.status}">
                                        ${student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                                    </span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    // Create charts
    setTimeout(() => {
        // Enrollment by class chart
        const classByClassCanvas = document.getElementById('enrollment-by-class-chart');
        if (classByClassCanvas) {
            new Chart(classByClassCanvas, {
                type: 'bar',
                data: {
                    labels: Object.keys(classCounts),
                    datasets: [{
                        label: 'Number of Students',
                        data: Object.values(classCounts),
                        backgroundColor: 'rgba(63, 81, 181, 0.7)',
                        borderColor: 'rgba(63, 81, 181, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Number of Students'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Class'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }
        
        // Enrollment by month chart
        const enrollmentByMonthCanvas = document.getElementById('enrollment-by-month-chart');
        if (enrollmentByMonthCanvas) {
            new Chart(enrollmentByMonthCanvas, {
                type: 'line',
                data: {
                    labels: months,
                    datasets: [{
                        label: 'Number of Students',
                        data: months.map(month => monthCounts[month]),
                        backgroundColor: 'rgba(76, 175, 80, 0.2)',
                        borderColor: 'rgba(76, 175, 80, 1)',
                        borderWidth: 2,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Number of Students'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Month'
                            }
                        }
                    }
                }
            });
        }
    }, 100);
}

// Generate demographic report
function generateDemographicReport(classFilter) {
    const reportContent = document.getElementById('report-content');
    if (!reportContent) return;
    
    // Sample data
    const students = generateSampleStudents(50);
    
    // Filter students based on criteria
    const filteredStudents = students.filter(student => {
        return !classFilter || student.classId === classFilter;
    });
    
    // Gender distribution
    const genderCounts = {
        Male: filteredStudents.filter(student => student.gender === 'Male').length,
        Female: filteredStudents.filter(student => student.gender === 'Female').length
    };
    
    // Age distribution
    const ageCounts = {};
    filteredStudents.forEach(student => {
        const age = calculateAge(student.dob);
        if (!ageCounts[age]) {
            ageCounts[age] = 0;
        }
        ageCounts[age]++;
    });
    
    // Sort ages
    const ages = Object.keys(ageCounts).sort((a, b) => parseInt(a) - parseInt(b));
    
    // Generate report HTML
    reportContent.innerHTML = `
        <div class="report-header">
            <h3>Student Demographic Report</h3>
            <p>Total Students: ${filteredStudents.length}</p>
        </div>
        
        <div class="report-section">
            <h4>Gender Distribution</h4>
            <div class="chart-container">
                <canvas id="gender-distribution-chart"></canvas>
            </div>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Gender</th>
                            <th>Number of Students</th>
                            <th>Percentage</th>
                        </tr>
                    </thead>
                                        <tbody>
                        <tr>
                            <td>Male</td>
                            <td>${genderCounts.Male}</td>
                            <td>${((genderCounts.Male / filteredStudents.length) * 100).toFixed(1)}%</td>
                        </tr>
                        <tr>
                            <td>Female</td>
                            <td>${genderCounts.Female}</td>
                            <td>${((genderCounts.Female / filteredStudents.length) * 100).toFixed(1)}%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        
        <div class="report-section">
            <h4>Age Distribution</h4>
            <div class="chart-container">
                <canvas id="age-distribution-chart"></canvas>
            </div>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Age</th>
                            <th>Number of Students</th>
                            <th>Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${ages.map(age => `
                            <tr>
                                <td>${age} years</td>
                                <td>${ageCounts[age]}</td>
                                <td>${((ageCounts[age] / filteredStudents.length) * 100).toFixed(1)}%</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
        
        <div class="report-section">
            <h4>Student List</h4>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Name</th>
                            <th>Class</th>
                            <th>Gender</th>
                            <th>Age</th>
                            <th>Date of Birth</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredStudents.map(student => `
                            <tr>
                                <td>${student.id}</td>
                                <td>${student.fullName}</td>
                                <td>${student.className}</td>
                                <td>${student.gender}</td>
                                <td>${calculateAge(student.dob)} years</td>
                                <td>${formatDate(student.dob)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    // Create charts
    setTimeout(() => {
        // Gender distribution chart
        const genderChartCanvas = document.getElementById('gender-distribution-chart');
        if (genderChartCanvas) {
            new Chart(genderChartCanvas, {
                type: 'pie',
                data: {
                    labels: ['Male', 'Female'],
                    datasets: [{
                        data: [genderCounts.Male, genderCounts.Female],
                        backgroundColor: [
                            'rgba(54, 162, 235, 0.7)',
                            'rgba(255, 99, 132, 0.7)'
                        ],
                        borderColor: [
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 99, 132, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.raw || 0;
                                    const percentage = ((value / filteredStudents.length) * 100).toFixed(1);
                                    return `${label}: ${value} (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });
        }
        
        // Age distribution chart
        const ageChartCanvas = document.getElementById('age-distribution-chart');
        if (ageChartCanvas) {
            new Chart(ageChartCanvas, {
                type: 'bar',
                data: {
                    labels: ages.map(age => `${age} years`),
                    datasets: [{
                        label: 'Number of Students',
                        data: ages.map(age => ageCounts[age]),
                        backgroundColor: 'rgba(75, 192, 192, 0.7)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Number of Students'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Age'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }
    }, 100);
}

// Generate attendance report
function generateAttendanceReport(classFilter, dateRange) {
    const reportContent = document.getElementById('report-content');
    if (!reportContent) return;
    
    // Sample data
    const students = generateSampleStudents(50).filter(student => {
        return !classFilter || student.classId === classFilter;
    });
    
    // Generate random attendance data
    const attendanceData = students.map(student => {
        const presentDays = Math.floor(Math.random() * 20) + 10; // 10-29 days
        const absentDays = Math.floor(Math.random() * 5); // 0-4 days
        const lateDays = Math.floor(Math.random() * 3); // 0-2 days
        const totalDays = presentDays + absentDays + lateDays;
        const attendanceRate = ((presentDays + lateDays) / totalDays * 100).toFixed(1);
        
        return {
            ...student,
            presentDays,
            absentDays,
            lateDays,
            totalDays,
            attendanceRate
        };
    });
    
    // Calculate averages
    const avgPresentDays = (attendanceData.reduce((sum, student) => sum + student.presentDays, 0) / attendanceData.length).toFixed(1);
    const avgAbsentDays = (attendanceData.reduce((sum, student) => sum + student.absentDays, 0) / attendanceData.length).toFixed(1);
    const avgLateDays = (attendanceData.reduce((sum, student) => sum + student.lateDays, 0) / attendanceData.length).toFixed(1);
    const avgAttendanceRate = (attendanceData.reduce((sum, student) => sum + parseFloat(student.attendanceRate), 0) / attendanceData.length).toFixed(1);
    
    // Generate report HTML
    reportContent.innerHTML = `
        <div class="report-header">
            <h3>Student Attendance Report</h3>
            <p>Total Students: ${attendanceData.length}</p>
        </div>
        
        <div class="report-section">
            <h4>Attendance Summary</h4>
            <div class="summary-cards">
                <div class="summary-card">
                    <div class="summary-title">Average Attendance Rate</div>
                    <div class="summary-value">${avgAttendanceRate}%</div>
                </div>
                <div class="summary-card">
                    <div class="summary-title">Avg. Present Days</div>
                    <div class="summary-value">${avgPresentDays}</div>
                </div>
                <div class="summary-card">
                    <div class="summary-title">Avg. Absent Days</div>
                    <div class="summary-value">${avgAbsentDays}</div>
                </div>
                <div class="summary-card">
                    <div class="summary-title">Avg. Late Days</div>
                    <div class="summary-value">${avgLateDays}</div>
                </div>
            </div>
        </div>
        
        <div class="report-section">
            <h4>Attendance Distribution</h4>
            <div class="chart-container">
                <canvas id="attendance-distribution-chart"></canvas>
            </div>
        </div>
        
        <div class="report-section">
            <h4>Student Attendance Details</h4>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Name</th>
                            <th>Class</th>
                            <th>Present Days</th>
                            <th>Absent Days</th>
                            <th>Late Days</th>
                            <th>Attendance Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${attendanceData.map(student => `
                            <tr>
                                <td>${student.id}</td>
                                <td>${student.fullName}</td>
                                <td>${student.className}</td>
                                <td>${student.presentDays}</td>
                                <td>${student.absentDays}</td>
                                <td>${student.lateDays}</td>
                                <td>
                                    <div class="progress-bar">
                                        <div class="progress" style="width: ${student.attendanceRate}%; background-color: ${
                                            parseFloat(student.attendanceRate) >= 90 ? '#4CAF50' : 
                                            parseFloat(student.attendanceRate) >= 80 ? '#FFC107' : 
                                            '#F44336'
                                        }"></div>
                                        <span>${student.attendanceRate}%</span>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    // Create charts
    setTimeout(() => {
        // Attendance distribution chart
        const attendanceChartCanvas = document.getElementById('attendance-distribution-chart');
        if (attendanceChartCanvas) {
            new Chart(attendanceChartCanvas, {
                type: 'doughnut',
                data: {
                    labels: ['Present', 'Absent', 'Late'],
                    datasets: [{
                        data: [
                            attendanceData.reduce((sum, student) => sum + student.presentDays, 0),
                            attendanceData.reduce((sum, student) => sum + student.absentDays, 0),
                            attendanceData.reduce((sum, student) => sum + student.lateDays, 0)
                        ],
                        backgroundColor: [
                            'rgba(76, 175, 80, 0.7)',
                            'rgba(244, 67, 54, 0.7)',
                            'rgba(255, 152, 0, 0.7)'
                        ],
                        borderColor: [
                            'rgba(76, 175, 80, 1)',
                            'rgba(244, 67, 54, 1)',
                            'rgba(255, 152, 0, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right'
                        }
                    }
                }
            });
        }
    }, 100);
}

// Print report
function printReport() {
    const reportContent = document.getElementById('report-content');
    if (!reportContent || !reportContent.innerHTML.trim()) {
        showNotification('Please generate a report first.', 'error');
        return;
    }
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    // Write the HTML content
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Student Report</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    color: #333;
                }
                .header {
                    text-align: center;
                    margin-bottom: 20px;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #3f51b5;
                }
                .school-name {
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 5px;
                }
                .document-title {
                    font-size: 18px;
                    color: #666;
                }
                .report-header {
                    margin-bottom: 20px;
                }
                .report-header h3 {
                    margin-bottom: 5px;
                }
                .report-section {
                    margin-bottom: 30px;
                    page-break-inside: avoid;
                }
                .report-section h4 {
                    margin-bottom: 15px;
                    padding-bottom: 5px;
                    border-bottom: 1px solid #ddd;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f2f2f2;
                }
                .summary-cards {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 15px;
                    margin-bottom: 20px;
                }
                .summary-card {
                    border: 1px solid #ddd;
                    padding: 15px;
                    min-width: 150px;
                    text-align: center;
                }
                .summary-title {
                    font-weight: bold;
                    margin-bottom: 5px;
                }
                .summary-value {
                    font-size: 24px;
                    color: #3f51b5;
                }
                .status-badge {
                    display: inline-block;
                    padding: 3px 8px;
                    border-radius: 12px;
                    font-size: 14px;
                }
                .status-active {
                    background-color: #E8F5E9;
                    color: #2E7D32;
                }
                .status-inactive {
                    background-color: #FFEBEE;
                    color: #C62828;
                }
                .progress-bar {
                    height: 20px;
                    background-color: #f5f5f5;
                                        border-radius: 10px;
                    position: relative;
                    overflow: hidden;
                }
                .progress {
                    height: 100%;
                    position: absolute;
                    left: 0;
                    top: 0;
                }
                .progress-bar span {
                    position: absolute;
                    width: 100%;
                    text-align: center;
                    line-height: 20px;
                    color: #000;
                    font-size: 12px;
                    font-weight: bold;
                }
                .chart-container {
                    display: none;
                }
                .footer {
                    margin-top: 30px;
                    text-align: center;
                    font-size: 12px;
                    color: #666;
                }
                @media print {
                    body {
                        padding: 0;
                    }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="school-name">Franciscan Catholic Nursery & Primary School</div>
                <div class="document-title">Student Report</div>
                <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            </div>
            
            ${reportContent.innerHTML}
            
            <div class="footer">
                <p>This report was automatically generated by the School Management System</p>
                <p>Franciscan Catholic Nursery & Primary School</p>
            </div>
        </body>
        </html>
    `);
    
    // Close the document
    printWindow.document.close();
    
    // Focus on the new window
    printWindow.focus();
    
    // Print after a short delay to ensure the content is loaded
    setTimeout(() => {
        printWindow.print();
    }, 500);
}

// Export report to PDF
function exportReportToPDF() {
    showNotification('Exporting to PDF...', 'info');
    
    // In a real application, you would use a library like jsPDF or html2pdf
    // For this demo, we'll just show a notification
    setTimeout(() => {
        showNotification('Report exported to PDF successfully.', 'success');
    }, 1500);
}

// Export report to Excel
function exportReportToExcel() {
    showNotification('Exporting to Excel...', 'info');
    
    // In a real application, you would use a library like SheetJS
    // For this demo, we'll just show a notification
    setTimeout(() => {
        showNotification('Report exported to Excel successfully.', 'success');
    }, 1500);
}

// Show form tab
function showFormTab(tabId, isFirstLoad = false) {
    // Get all tabs and tab contents
    const tabs = document.querySelectorAll('.form-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Hide all tab contents
    tabContents.forEach(content => {
        content.style.display = 'none';
    });
    
    // Remove active class from all tabs
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show the selected tab content
    const selectedContent = document.getElementById(`${tabId}-tab-content`);
    if (selectedContent) {
        selectedContent.style.display = 'block';
    }
    
    // Add active class to the selected tab
    const selectedTab = document.querySelector(`.form-tab[data-tab="${tabId}"]`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Update next/prev buttons
    updateFormNavButtons(tabId, isFirstLoad);
}

// Update form navigation buttons
function updateFormNavButtons(currentTabId, isFirstLoad = false) {
    const tabs = ['personal', 'academic', 'parent'];
    const currentIndex = tabs.indexOf(currentTabId);
    
    const prevBtn = document.querySelector('.prev-tab-btn');
    const nextBtn = document.querySelector('.next-tab-btn');
    const submitBtn = document.querySelector('.submit-form-btn');
    
    if (prevBtn) {
        prevBtn.style.display = currentIndex === 0 ? 'none' : 'block';
    }
    
    if (nextBtn) {
        nextBtn.style.display = currentIndex === tabs.length - 1 ? 'none' : 'block';
    }
    
    if (submitBtn) {
        submitBtn.style.display = currentIndex === tabs.length - 1 ? 'block' : 'none';
    }
    
    // Set data attributes for next/prev buttons
    if (!isFirstLoad) {
        if (prevBtn && currentIndex > 0) {
            prevBtn.setAttribute('data-tab', tabs[currentIndex - 1]);
        }
        
        if (nextBtn && currentIndex < tabs.length - 1) {
            nextBtn.setAttribute('data-tab', tabs[currentIndex + 1]);
        }
    }
}

// Generate sample students
function generateSampleStudents(count = 10) {
    const students = [];
    
    const firstNames = ['John', 'Mary', 'David', 'Sarah', 'Michael', 'Emma', 'James', 'Olivia', 'Daniel', 'Sophia', 'Matthew', 'Ava', 'Joseph', 'Isabella', 'Andrew', 'Mia', 'William', 'Charlotte', 'Alexander', 'Amelia'];
    
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson'];
    
    const classes = [
        { id: 'nursery1', name: 'Nursery 1' },
        { id: 'nursery2', name: 'Nursery 2' },
        { id: 'primary1', name: 'Primary 1' },
        { id: 'primary2', name: 'Primary 2' },
        { id: 'primary3', name: 'Primary 3' },
        { id: 'primary4', name: 'Primary 4' },
        { id: 'primary5', name: 'Primary 5' },
        { id: 'primary6', name: 'Primary 6' }
    ];
    
    const statuses = ['active', 'inactive'];
    
    for (let i = 0; i < count; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const gender = Math.random() > 0.5 ? 'Male' : 'Female';
        
        // Generate random date of birth between 4 and 12 years ago
        const now = new Date();
        const yearOffset = Math.floor(Math.random() * 8) + 4; // 4-12 years
        const monthOffset = Math.floor(Math.random() * 12);
        const dayOffset = Math.floor(Math.random() * 28) + 1;
        const dob = new Date(now.getFullYear() - yearOffset, monthOffset, dayOffset);
        
        // Generate random enrollment date within the last 3 years
        const enrollYearOffset = Math.floor(Math.random() * 3); // 0-3 years
        const enrollMonthOffset = Math.floor(Math.random() * 12);
        const enrollDayOffset = Math.floor(Math.random() * 28) + 1;
        const enrollmentDate = new Date(now.getFullYear() - enrollYearOffset, enrollMonthOffset, enrollDayOffset);
        
        // Select random class
        const classIndex = Math.floor(Math.random() * classes.length);
        const classObj = classes[classIndex];
        
        // Generate student ID
        const id = generateStudentId(classObj.name, i + 1);
        
        // Select random status (mostly active)
        const status = Math.random() > 0.1 ? statuses[0] : statuses[1];
        
        students.push({
            id,
            firstName,
            lastName,
            fullName: `${firstName} ${lastName}`,
            gender,
            dob: dob.toISOString().split('T')[0],
            classId: classObj.id,
            className: classObj.name,
            enrollmentDate: enrollmentDate.toISOString().split('T')[0],
            status,
            parentName: `${lastNames[Math.floor(Math.random() * lastNames.length)]} ${Math.random() > 0.5 ? 'Father' : 'Mother'}`,
            parentPhone: `+234${Math.floor(Math.random() * 9000000000) + 1000000000}`,
            parentEmail: `parent${i + 1}@example.com`,
            address: `${Math.floor(Math.random() * 100) + 1} ${firstNames[Math.floor(Math.random() * firstNames.length)]} Street, Lagos`
        });
    }
    
    return students;
}

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
    
    // Load students data
    loadStudentsData();
    
    // Initialize search and filters
    initSearchAndFilters();
    
    // Initialize pagination
    initPagination();
    
    // Initialize enrollment chart
    initEnrollmentChart();
    
    // Load enrollment data
    loadEnrollmentData();
    
    // Set today's date as default for date inputs
    setTodayAsDefault();
});




