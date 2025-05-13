document.addEventListener('DOMContentLoaded', function() {
    // Sample data for demonstration
    const sampleExams = [
        {
            id: 1,
            name: "First Term Mathematics CA Test",
            class: "Primary 3",
            subject: "Mathematics",
            type: "CA Test",
            term: "First Term",
            academicYear: "2023/2024",
            date: "2023-10-15",
            time: "09:00",
            duration: 60,
            maxScore: 40,
            status: "scheduled",
            instructions: "Answer all questions. Show your working clearly. No calculators allowed.",
            lastUpdated: "2023-09-20"
        },
        {
            id: 2,
            name: "English Language Mid-Term Exam",
            class: "Primary 4",
            subject: "English Language",
            type: "Mid-Term",
            term: "First Term",
            academicYear: "2023/2024",
            date: "2023-10-18",
            time: "10:30",
            duration: 90,
            maxScore: 60,
            status: "scheduled",
            instructions: "Section A: Grammar (20 marks), Section B: Comprehension (20 marks), Section C: Essay Writing (20 marks). Answer all questions.",
            lastUpdated: "2023-09-22"
        },
        {
            id: 3,
            name: "Science Final Examination",
            class: "Primary 5",
            subject: "Science",
            type: "Final Exam",
            term: "First Term",
            academicYear: "2023/2024",
            date: "2023-12-05",
            time: "09:00",
            duration: 120,
            maxScore: 100,
            status: "scheduled",
            instructions: "Answer all questions in Sections A and B. Choose any two questions from Section C. Diagrams should be drawn with pencil and labeled with pen.",
            lastUpdated: "2023-09-25"
        },
        {
            id: 4,
            name: "Social Studies CA Test",
            class: "Primary 6",
            subject: "Social Studies",
            type: "CA Test",
            term: "First Term",
            academicYear: "2023/2024",
            date: "2023-10-10",
            time: "11:00",
            duration: 45,
            maxScore: 30,
            status: "ongoing",
            instructions: "Answer all questions. Each question carries equal marks.",
            lastUpdated: "2023-10-10",
            progress: 65
        },
        {
            id: 5,
            name: "Religious Studies Mid-Term",
            class: "Primary 2",
            subject: "Religious Studies",
            type: "Mid-Term",
            term: "First Term",
            academicYear: "2023/2024",
            date: "2023-10-12",
            time: "09:30",
            duration: 60,
            maxScore: 50,
            status: "ongoing",
            instructions: "Answer all questions. Bible references should be quoted where necessary.",
            lastUpdated: "2023-10-12",
            progress: 30
        },
        {
            id: 6,
            name: "Mathematics CA Test",
            class: "Primary 3",
            subject: "Mathematics",
            type: "CA Test",
            term: "Third Term",
            academicYear: "2022/2023",
            date: "2023-06-10",
            time: "09:00",
            duration: 60,
            maxScore: 40,
            status: "completed",
            instructions: "Answer all questions. Show your working clearly. No calculators allowed.",
            lastUpdated: "2023-06-15",
            resultsStatus: "published"
        },
        {
            id: 7,
            name: "English Language Final Exam",
            class: "Primary 4",
            subject: "English Language",
            type: "Final Exam",
            term: "Third Term",
            academicYear: "2022/2023",
            date: "2023-07-15",
            time: "10:30",
            duration: 120,
            maxScore: 100,
            status: "completed",
            instructions: "Section A: Grammar (30 marks), Section B: Comprehension (30 marks), Section C: Essay Writing (40 marks). Answer all questions.",
            lastUpdated: "2023-07-20",
            resultsStatus: "published"
        }
    ];

    // Sample archive data
    const archiveData = [
        {
            id: 101,
            name: "Mathematics Final Exam",
            type: "exam",
            class: "Primary 3",
            term: "Third Term",
            academicYear: "2021/2022",
            date: "2022-07-10",
            lastAccessed: "2023-01-15",
            student: null
        },
        {
            id: 102,
            name: "English Language Final Exam",
            type: "exam",
            class: "Primary 4",
            term: "Third Term",
            academicYear: "2021/2022",
            date: "2022-07-12",
            lastAccessed: "2023-02-20",
            student: null
        },
        {
            id: 103,
            name: "End of Year Report",
            type: "report",
            class: "Primary 3",
            term: "Third Term",
            academicYear: "2021/2022",
            date: "2022-07-25",
            lastAccessed: "2023-03-05",
            student: "John Adewale"
        },
        {
            id: 104,
            name: "End of Year Report",
            type: "report",
            class: "Primary 4",
            term: "Third Term",
            academicYear: "2021/2022",
            date: "2022-07-25",
            lastAccessed: "2023-04-10",
            student: "Mary Okonkwo"
        },
        {
            id: 105,
            name: "Mathematics Final Exam",
            type: "exam",
            class: "Primary 5",
            term: "Third Term",
            academicYear: "2020/2021",
            date: "2021-07-15",
            lastAccessed: "2022-09-20",
            student: null
        },
        {
            id: 106,
            name: "End of Year Report",
            type: "report",
            class: "Primary 5",
            term: "Third Term",
            academicYear: "2020/2021",
            date: "2021-07-30",
            lastAccessed: "2022-10-15",
            student: "Emmanuel Okafor"
        },
        {
            id: 107,
            name: "First Term Report",
            type: "report",
            class: "Primary 2",
            term: "First Term",
            academicYear: "2020/2021",
            date: "2020-12-18",
            lastAccessed: "2022-11-05",
            student: "Sarah Adeyemi"
        }
    ];

    // DOM Elements
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const createExamBtn = document.getElementById('create-exam-btn');
    const createExamModal = document.getElementById('create-exam-modal');
    const createExamForm = document.getElementById('create-exam-form');
    const examDetailsModal = document.getElementById('exam-details-modal');
    const archiveItemModal = document.getElementById('archive-item-modal');
    const searchArchiveBtn = document.getElementById('search-archive-btn');
    const selectAllArchives = document.getElementById('select-all-archives');
    const exportArchiveBtn = document.getElementById('export-archive-btn');
    
    // Tab navigation
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to current button and pane
            this.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    // Initialize the page
    function init() {
        // Display current date
        displayCurrentDate();
        
        // Populate exam lists
        populateUpcomingExams();
        populateOngoingExams();
        populateCompletedExams();
        
        // Setup event listeners
        setupEventListeners();
        
        // Populate class dropdowns
        populateClassDropdowns();
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Create exam button
        createExamBtn.addEventListener('click', function() {
            openCreateExamModal();
        });
        
        // Close modals when clicking on close button or outside
        document.querySelectorAll('.close-modal').forEach(closeBtn => {
            closeBtn.addEventListener('click', function() {
                closeAllModals();
            });
        });
        
        // Close modals when clicking cancel button
        document.querySelectorAll('.btn-secondary.close-modal').forEach(cancelBtn => {
            cancelBtn.addEventListener('click', function() {
                closeAllModals();
            });
        });
        
        // Create exam form submission
        createExamForm.addEventListener('submit', function(e) {
            e.preventDefault();
            createNewExam();
        });
        
        // Search archive button
        searchArchiveBtn.addEventListener('click', function() {
            searchArchives();
        });
        
        // Select all archives checkbox
        selectAllArchives.addEventListener('change', function() {
            toggleSelectAllArchives();
        });
        
        // Export archive button
        exportArchiveBtn.addEventListener('click', function() {
            exportSelectedArchives();
        });
        
        // Filter change events
        document.getElementById('upcoming-term-filter').addEventListener('change', populateUpcomingExams);
        document.getElementById('upcoming-class-filter').addEventListener('change', populateUpcomingExams);
        document.getElementById('upcoming-type-filter').addEventListener('change', populateUpcomingExams);
        
        document.getElementById('ongoing-term-filter').addEventListener('change', populateOngoingExams);
        document.getElementById('ongoing-class-filter').addEventListener('change', populateOngoingExams);
        
        document.getElementById('completed-term-filter').addEventListener('change', populateCompletedExams);
        document.getElementById('completed-class-filter').addEventListener('change', populateCompletedExams);
        document.getElementById('completed-year-filter').addEventListener('change', populateCompletedExams);
    }
    
    // Populate class dropdowns
    function populateClassDropdowns() {
        const classes = [
            "Nursery 1", "Nursery 2", "Nursery 3",
            "Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6"
        ];
        
        const classDropdowns = [
            'upcoming-class-filter', 'ongoing-class-filter', 'completed-class-filter',
            'archive-class', 'exam-class'
        ];
        
        classDropdowns.forEach(dropdownId => {
            const dropdown = document.getElementById(dropdownId);
            if (dropdown) {
                classes.forEach(className => {
                    const option = document.createElement('option');
                    option.value = className;
                    option.textContent = className;
                    dropdown.appendChild(option);
                });
            }
        });
        
        // Populate subject dropdown
        const subjects = [
            "Mathematics", "English Language", "Science", "Social Studies",
            "Religious Studies", "Creative Arts", "Physical Education", "Computer Studies"
        ];
        
        const subjectDropdown = document.getElementById('exam-subject');
        if (subjectDropdown) {
            subjects.forEach(subject => {
                const option = document.createElement('option');
                option.value = subject;
                option.textContent = subject;
                subjectDropdown.appendChild(option);
            });
        }
    }
    
    // Display current date
    function displayCurrentDate() {
        const currentDateElement = document.getElementById('current-date');
        if (currentDateElement) {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            currentDateElement.textContent = new Date().toLocaleDateString('en-US', options);
        }
    }
    
    // Populate upcoming exams
    function populateUpcomingExams() {
        const termFilter = document.getElementById('upcoming-term-filter').value;
        const classFilter = document.getElementById('upcoming-class-filter').value;
        const typeFilter = document.getElementById('upcoming-type-filter').value;
        
        const filteredExams = sampleExams.filter(exam => {
            return exam.status === 'scheduled' &&
                   (termFilter === '' || exam.term === termFilter) &&
                   (classFilter === '' || exam.class === classFilter) &&
                   (typeFilter === '' || exam.type === typeFilter);
        });
        
        const upcomingExamsList = document.getElementById('upcoming-exams-list');
        upcomingExamsList.innerHTML = '';
        
        if (filteredExams.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="8" class="text-center">No upcoming exams found</td>
            `;
            upcomingExamsList.appendChild(emptyRow);
            return;
        }
        
        filteredExams.forEach(exam => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${exam.name}</td>
                <td>${exam.class}</td>
                <td>${exam.subject}</td>
                <td>${exam.type}</td>
                <td>${formatDate(exam.date)} ${formatTime(exam.time)}</td>
                <td>${exam.duration} mins</td>
                <td><span class="status-badge scheduled">Scheduled</span></td>
                <td>
                    <button class="action-btn view-btn" data-id="${exam.id}">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="action-btn edit-btn" data-id="${exam.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="action-btn delete-btn" data-id="${exam.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            `;
            upcomingExamsList.appendChild(row);
        });
        
        // Add event listeners to buttons
        upcomingExamsList.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const examId = parseInt(this.getAttribute('data-id'));
                openExamDetailsModal(examId);
            });
        });
        
        upcomingExamsList.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const examId = parseInt(this.getAttribute('data-id'));
                editExam(examId);
            });
        });
        
        upcomingExamsList.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const examId = parseInt(this.getAttribute('data-id'));
                deleteExam(examId);
            });
        });
    }
    
    // Populate ongoing exams
    function populateOngoingExams() {
        const termFilter = document.getElementById('ongoing-term-filter').value;
        const classFilter = document.getElementById('ongoing-class-filter').value;
        
        const filteredExams = sampleExams.filter(exam => {
            return exam.status === 'ongoing' &&
                   (termFilter === '' || exam.term === termFilter) &&
                   (classFilter === '' || exam.class === classFilter);
        });
        
        const ongoingExamsList = document.getElementById('ongoing-exams-list');
        ongoingExamsList.innerHTML = '';
        
        if (filteredExams.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="8" class="text-center">No ongoing exams found</td>
            `;
            ongoingExamsList.appendChild(emptyRow);
            return;
        }
        
        filteredExams.forEach(exam => {
            // Calculate end date and time
            const examDate = new Date(`${exam.date}T${exam.time}`);
            const endDate = new Date(examDate.getTime() + exam.duration * 60000);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${exam.name}</td>
                <td>${exam.class}</td>
                <td>${exam.subject}</td>
                <td>${exam.type}</td>
                <td>${formatDate(exam.date)} ${formatTime(exam.time)}</td>
                <td>${formatDate(endDate.toISOString().split('T')[0])} ${formatTime(endDate.toTimeString().slice(0, 5))}</td>
                <td>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${exam.progress}%"></div>
                    </div>
                    <div class="progress-text">${exam.progress}% completed</div>
                </td>
                <td>
                    <button class="action-btn view-btn" data-id="${exam.id}">
                        <i class="fas fa-eye"></i> View
                    </button>
                </td>
            `;
            ongoingExamsList.appendChild(row);
        });
        
        // Add event listeners to view buttons
        ongoingExamsList.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const examId = parseInt(this.getAttribute('data-id'));
                openExamDetailsModal(examId);
            });
        });
    }
    
    // Populate completed exams
    function populateCompletedExams() {
        const termFilter = document.getElementById('completed-term-filter').value;
        const classFilter = document.getElementById('completed-class-filter').value;
        const yearFilter = document.getElementById('completed-year-filter').value;
        
        const filteredExams = sampleExams.filter(exam => {
            return exam.status === 'completed' &&
                   (termFilter === '' || exam.term === termFilter) &&
                   (classFilter === '' || exam.class === classFilter) &&
                   (yearFilter === '' || exam.academicYear === yearFilter);
        });
        
        const completedExamsList = document.getElementById('completed-exams-list');
        completedExamsList.innerHTML = '';
        
        if (filteredExams.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="8" class="text-center">No completed exams found</td>
            `;
            completedExamsList.appendChild(emptyRow);
            return;
        }
        
        filteredExams.forEach(exam => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${exam.name}</td>
                <td>${exam.class}</td>
                <td>${exam.subject}</td>
                <td>${exam.type}</td>
                <td>${formatDate(exam.date)}</td>
                <td>${exam.academicYear}</td>
                <td>
                    <span class="status-badge ${exam.resultsStatus === 'published' ? 'published' : 'pending'}">
                        ${exam.resultsStatus === 'published' ? 'Published' : 'Pending'}
                    </span>
                </td>
                <td>
                    <button class="action-btn view-btn" data-id="${exam.id}">
                        <i class="fas fa-eye"></i> View
                    </button>
                    ${exam.resultsStatus !== 'published' ? `
                    <button class="action-btn edit-btn" data-id="${exam.id}">
                        <i class="fas fa-edit"></i> Edit Results
                    </button>
                    ` : ''}
                </td>
            `;
            completedExamsList.appendChild(row);
        });
        
        // Add event listeners to buttons
        completedExamsList.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const examId = parseInt(this.getAttribute('data-id'));
                openExamDetailsModal(examId);
            });
        });
        
        completedExamsList.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const examId = parseInt(this.getAttribute('data-id'));
                editExamResults(examId);
            });
        });
    }
    
    // Search archives
    function searchArchives() {
        const yearFilter = document.getElementById('archive-year').value;
        const termFilter = document.getElementById('archive-term').value;
        const classFilter = document.getElementById('archive-class').value;
        const typeFilter = document.getElementById('archive-type').value;
        const studentFilter = document.getElementById('archive-student').value.toLowerCase();
        
        if (!yearFilter) {
            alert('Please select an academic year to search archives');
            return;
        }
        
        const filteredArchives = archiveData.filter(item => {
            return item.academicYear === yearFilter &&
                   (termFilter === '' || item.term === termFilter) &&
                   (classFilter === '' || item.class === classFilter) &&
                   (typeFilter === '' || item.type === typeFilter) &&
                   (studentFilter === '' || 
                    (item.student && item.student.toLowerCase().includes(studentFilter)));
        });
        
        const archiveResultsList = document.getElementById('archive-results-list');
        archiveResultsList.innerHTML = '';
        
        if (filteredArchives.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="9" class="text-center">
                    <div class="empty-state-container">
                        <i class="fas fa-search empty-icon"></i>
                        <p>No archive items found matching your search criteria</p>
                    </div>
                </td>
            `;
            archiveResultsList.appendChild(emptyRow);
            exportArchiveBtn.disabled = true;
            return;
        }
        
        filteredArchives.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <input type="checkbox" class="archive-checkbox" data-id="${item.id}">
                </td>
                <td>${item.name}</td>
                <td><span class="badge ${item.type}">${capitalizeFirstLetter(item.type)}</span></td>
                <td>${item.class}</td>
                <td>${item.term}</td>
                <td>${item.academicYear}</td>
                <td>${formatDate(item.date)}</td>
                <td>
                    <button class="action-btn view-btn" data-id="${item.id}">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="action-btn" data-id="${item.id}">
                        <i class="fas fa-download"></i> Download
                    </button>
                </td>
            `;
            archiveResultsList.appendChild(row);
        });
        
        // Add event listeners to checkboxes
        archiveResultsList.querySelectorAll('.archive-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', updateExportButton);
        });
        
        // Add event listeners to view buttons
        archiveResultsList.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = parseInt(this.getAttribute('data-id'));
                openArchiveItemModal(itemId);
            });
        });
    }
    
    // Toggle select all archives
    function toggleSelectAllArchives() {
        const isChecked = selectAllArchives.checked;
        document.querySelectorAll('.archive-checkbox').forEach(checkbox => {
            checkbox.checked = isChecked;
        });
        updateExportButton();
    }
    
    // Update export button state
    function updateExportButton() {
        const selectedCheckboxes = document.querySelectorAll('.archive-checkbox:checked');
        exportArchiveBtn.disabled = selectedCheckboxes.length === 0;
    }
    
    // Export selected archives
    function exportSelectedArchives() {
        const selectedCheckboxes = document.querySelectorAll('.archive-checkbox:checked');
        const selectedIds = Array.from(selectedCheckboxes).map(checkbox => 
            parseInt(checkbox.getAttribute('data-id'))
        );
        
        alert(`Exporting ${selectedIds.length} archive items. In a real application, this would download the selected items.`);
    }
    
    // Open create exam modal
    function openCreateExamModal() {
        createExamModal.classList.add('active');
    }
    
    // Create new exam
    function createNewExam() {
        // Get form values
        const name = document.getElementById('exam-name').value;
        const type = document.getElementById('exam-type').value;
        const className = document.getElementById('exam-class').value;
        const subject = document.getElementById('exam-subject').value;
        const term = document.getElementById('exam-term').value;
        const academicYear = document.getElementById('academic-year').value;
        const date = document.getElementById('exam-date').value;
        const time = document.getElementById('exam-time').value;
        const duration = parseInt(document.getElementById('exam-duration').value);
        const maxScore = parseInt(document.getElementById('max-score').value);
        const instructions = document.getElementById('exam-instructions').value;
        
        // Create new exam object
        const newExam = {
            id: sampleExams.length + 1,
            name,
            class: className,
            subject,
            type,
            term,
            academicYear,
            date,
            time,
            duration,
            maxScore,
            status: 'scheduled',
            instructions,
            lastUpdated: new Date().toISOString().split('T')[0]
        };
        
        // Add to sample exams
        sampleExams.push(newExam);
        
        // Close modal and refresh list
        closeAllModals();
        populateUpcomingExams();
        
        // Reset form
        createExamForm.reset();
        
        // Show success message
        alert('Exam created successfully!');
    }
    
    // Open exam details modal
    function openExamDetailsModal(examId) {
        const exam = sampleExams.find(e => e.id === examId);
        if (!exam) return;
        
        // Populate modal with exam details
        document.getElementById('detail-exam-name').textContent = exam.name;
        document.getElementById('detail-exam-status').textContent = capitalizeFirstLetter(exam.status);
        document.getElementById('detail-exam-status').className = `status-badge ${exam.status}`;
        document.getElementById('detail-exam-class').textContent = exam.class;
        document.getElementById('detail-exam-subject').textContent = exam.subject;
        document.getElementById('detail-exam-type').textContent = exam.type;
        document.getElementById('detail-exam-term').textContent = exam.term;
        document.getElementById('detail-exam-year').textContent = exam.academicYear;
        document.getElementById('detail-exam-max-score').textContent = `${exam.maxScore} points`;
        document.getElementById('detail-exam-date').textContent = formatDate(exam.date);
        document.getElementById('detail-exam-time').textContent = formatTime(exam.time);
        document.getElementById('detail-exam-duration').textContent = `${exam.duration} minutes`;
        document.getElementById('detail-exam-instructions').textContent = exam.instructions || 'No specific instructions provided.';
        
        // Show/hide edit and delete buttons based on exam status
        const editBtn = document.getElementById('edit-exam-btn');
        const deleteBtn = document.getElementById('delete-exam-btn');
        
        if (exam.status === 'scheduled') {
            editBtn.style.display = 'block';
            deleteBtn.style.display = 'block';
        } else {
            editBtn.style.display = 'none';
            deleteBtn.style.display = 'none';
        }
        
        // Add event listeners to buttons
        editBtn.onclick = function() {
            closeAllModals();
            editExam(examId);
        };
        
        deleteBtn.onclick = function() {
            closeAllModals();
            deleteExam(examId);
        };
        
        // Show modal
        examDetailsModal.classList.add('active');
    }
    
    // Open archive item modal
    function openArchiveItemModal(itemId) {
        const item = archiveData.find(i => i.id === itemId);
        if (!item) return;
        
        // Populate modal with item details
        document.getElementById('archive-item-title').textContent = item.name;
        document.getElementById('archive-item-type').textContent = capitalizeFirstLetter(item.type);
        document.getElementById('archive-item-type').className = `badge ${item.type}`;
        document.getElementById('archive-item-student').textContent = item.student || 'N/A';
        document.getElementById('archive-item-class').textContent = item.class;
        document.getElementById('archive-item-term').textContent = item.term;
        document.getElementById('archive-item-year').textContent = item.academicYear;
        document.getElementById('archive-item-date').textContent = formatDate(item.date);
        document.getElementById('archive-item-accessed').textContent = formatDate(item.lastAccessed);
        
        // Show loading spinner in content area
        document.getElementById('archive-item-content').innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Loading archive content...</span>
            </div>
        `;
        
        // Simulate loading content (in a real app, this would fetch from server)
        setTimeout(() => {
            if (item.type === 'exam') {
                document.getElementById('archive-item-content').innerHTML = generateExamContent(item);
            } else if (item.type === 'report') {
                document.getElementById('archive-item-content').innerHTML = generateReportContent(item);
            }
        }, 1500);
        
        // Add event listeners to buttons
        document.getElementById('download-archive-btn').onclick = function() {
            alert(`Downloading ${item.name} for ${item.academicYear}`);
        };
        
        document.getElementById('print-archive-btn').onclick = function() {
            alert(`Printing ${item.name} for ${item.academicYear}`);
        };
        
        // Show modal
        archiveItemModal.classList.add('active');
    }
    
    // Generate exam content for archive view
    function generateExamContent(item) {
        return `
            <div class="archived-exam">
                <div class="exam-header">
                    <h3>${item.name}</h3>
                    <div class="exam-meta">
                        <span>Class: ${item.class}</span>
                        <span>Term: ${item.term}</span>
                        <span>Academic Year: ${item.academicYear}</span>
                    </div>
                </div>
                
                <div class="exam-sections">
                    <div class="exam-section">
                        <h4>Section A: Multiple Choice Questions</h4>
                        <ol class="question-list">
                            <li>
                                <div class="question-text">What is the capital of Nigeria?</div>
                                <div class="options">
                                    <div class="option">A. Lagos</div>
                                    <div class="option">B. Abuja</div>
                                    <div class="option">C. Kano</div>
                                    <div class="option">D. Port Harcourt</div>
                                </div>
                            </li>
                            <li>
                                <div class="question-text">Which of these is NOT a primary color?</div>
                                <div class="options">
                                    <div class="option">A. Red</div>
                                    <div class="option">B. Blue</div>
                                    <div class="option">C. Green</div>
                                    <div class="option">D. Yellow</div>
                                </div>
                            </li>
                        </ol>
                    </div>
                    
                    <div class="exam-section">
                        <h4>Section B: Theory Questions</h4>
                        <ol class="question-list">
                            <li>
                                <div class="question-text">Explain the water cycle and its importance to the environment.</div>
                                <div class="answer-space">
                                    <p><em>Answer space would be provided here...</em></p>
                                </div>
                            </li>
                        </ol>
                    </div>
                </div>
                
                <div class="exam-footer">
                    <p>This is an archived copy of the original examination paper.</p>
                </div>
            </div>
        `;
    }
    
    // Generate report content for archive view
    function generateReportContent(item) {
        // Simulate a student report card
        const studentName = item.student || 'Student Name';
        
        return `
            <div class="archived-report">
                <div class="report-header">
                    <div class="school-info">
                        <h3>Franciscan Catholic Nursery & Primary School</h3>
                        <p>123 School Road, Lagos, Nigeria</p>
                    </div>
                    <div class="report-title">
                        <h2>${item.term} Report Card</h2>
                        <p>Academic Year: ${item.academicYear}</p>
                    </div>
                </div>
                
                <div class="student-info">
                    <div class="info-row">
                        <div class="info-group">
                            <span class="info-label">Student Name:</span>
                            <span class="info-value">${studentName}</span>
                        </div>
                        <div class="info-group">
                            <span class="info-label">Class:</span>
                            <span class="info-value">${item.class}</span>
                        </div>
                    </div>
                    <div class="info-row">
                        <div class="info-group">
                            <span class="info-label">Admission Number:</span>
                            <span class="info-value">FCS/2020/001</span>
                        </div>
                        <div class="info-group">
                            <span class="info-label">Term:</span>
                            <span class="info-value">${item.term}</span>
                        </div>
                    </div>
                </div>
                
                <div class="report-table-container">
                    <table class="report-table">
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>CA Score (40%)</th>
                                <th>Exam Score (60%)</th>
                                <th>Total Score (100%)</th>
                                <th>Grade</th>
                                <th>Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Mathematics</td>
                                <td>32</td>
                                <td>45</td>
                                <td>77</td>
                                <td>A</td>
                                <td>Excellent</td>
                            </tr>
                            <tr>
                                <td>English Language</td>
                                <td>30</td>
                                <td>48</td>
                                <td>78</td>
                                <td>A</td>
                                <td>Excellent</td>
                            </tr>
                            <tr>
                                <td>Science</td>
                                <td>28</td>
                                <td>42</td>
                                <td>70</td>
                                <td>B</td>
                                <td>Very Good</td>
                            </tr>
                            <tr>
                                <td>Social Studies</td>
                                <td>25</td>
                                <td>40</td>
                                <td>65</td>
                                <td>B</td>
                                <td>Good</td>
                            </tr>
                            <tr>
                                <td>Religious Studies</td>
                                <td>35</td>
                                <td>50</td>
                                <td>85</td>
                                <td>A</td>
                                <td>Excellent</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="3"><strong>Total</strong></td>
                                <td>375</td>
                                <td colspan="2"></td>
                            </tr>
                            <tr>
                                <td colspan="3"><strong>Average</strong></td>
                                <td>75.0</td>
                                <td>A</td>
                                <td>Excellent</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                
                <div class="report-comments">
                    <div class="comment-section">
                        <h4>Class Teacher's Comment:</h4>
                        <p>${studentName} is a hardworking student who has shown significant improvement this term. Keep up the good work!</p>
                        <div class="signature">
                            <span>Signature: _______________</span>
                            <span>Date: ${formatDate(item.date)}</span>
                        </div>
                    </div>
                    <div class="comment-section">
                        <h4>Head Teacher's Comment:</h4>
                        <p>An excellent performance. ${studentName} has demonstrated great academic potential. Well done!</p>
                        <div class="signature">
                            <span>Signature: _______________</span>
                            <span>Date: ${formatDate(item.date)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="report-footer">
                    <p>This is an archived copy of the original report card.</p>
                    <p>Next Term Begins: ${getNextTermDate(item.term, item.academicYear)}</p>
                </div>
            </div>
        `;
    }
    
    // Get next term date based on current term and academic year
    function getNextTermDate(term, academicYear) {
        if (term === "First Term") {
            return "January 10, " + academicYear.split('/')[1];
        } else if (term === "Second Term") {
            return "April 15, " + academicYear.split('/')[1];
        } else {
            return "September 5, " + academicYear.split('/')[1];
        }
    }
    
    // Edit exam
    function editExam(examId) {
        const exam = sampleExams.find(e => e.id === examId);
        if (!exam) return;
        
        // In a real application, this would populate a form with the exam details
        alert(`Editing exam: ${exam.name}`);
    }
    
    // Delete exam
    function deleteExam(examId) {
        if (confirm('Are you sure you want to delete this exam?')) {
            const index = sampleExams.findIndex(e => e.id === examId);
            if (index !== -1) {
                sampleExams.splice(index, 1);
                populateUpcomingExams();
                alert('Exam deleted successfully!');
            }
        }
    }
    
    // Edit exam results
    function editExamResults(examId) {
        const exam = sampleExams.find(e => e.id === examId);
        if (!exam) return;
        
        // In a real application, this would open a form to input student results
        alert(`Editing results for exam: ${exam.name}`);
    }
    
    // Close all modals
    function closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }
    
    // Format date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }
    
    // Format time
    function formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const period = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minutes} ${period}`;
    }
    
    // Capitalize first letter
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        document.querySelectorAll('.modal').forEach(modal => {
            if (event.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // Initialize the page
    init();
});