document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let currentTab = 'generate';
    const tabs = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const generateReportModal = document.getElementById('generate-report-modal');
    const viewReportModal = document.getElementById('view-report-modal');
    const templatePreviewModal = document.getElementById('template-preview-modal');
    const archiveItemModal = document.getElementById('archive-item-modal');
    
    // Sample data for demonstration
    const sampleClasses = [
        { id: 1, name: 'Nursery 1' },
        { id: 2, name: 'Nursery 2' },
        { id: 3, name: 'Primary 1' },
        { id: 4, name: 'Primary 2' },
        { id: 5, name: 'Primary 3' },
        { id: 6, name: 'Primary 4' },
        { id: 7, name: 'Primary 5' },
        { id: 8, name: 'Primary 6' }
    ];
    
    const sampleStudents = [
        { id: 'FCS/2023/001', name: 'John Doe', gender: 'Male', class: 'Primary 3', reportStatus: 'pending' },
        { id: 'FCS/2023/002', name: 'Jane Smith', gender: 'Female', class: 'Primary 3', reportStatus: 'generated' },
        { id: 'FCS/2023/003', name: 'Michael Johnson', gender: 'Male', class: 'Primary 3', reportStatus: 'published' },
        { id: 'FCS/2023/004', name: 'Sarah Williams', gender: 'Female', class: 'Primary 3', reportStatus: 'pending' },
        { id: 'FCS/2023/005', name: 'David Brown', gender: 'Male', class: 'Primary 3', reportStatus: 'pending' }
    ];
    
    const sampleSubjects = [
        { id: 1, name: 'Mathematics' },
        { id: 2, name: 'English Language' },
        { id: 3, name: 'Science' },
        { id: 4, name: 'Social Studies' },
        { id: 5, name: 'Religious Studies' },
        { id: 6, name: 'Creative Arts' },
        { id: 7, name: 'Physical Education' },
        { id: 8, name: 'Computer Studies' }
    ];
    
    const sampleReports = [
        { id: 1, studentName: 'John Doe', studentId: 'FCS/2023/001', class: 'Primary 3', term: 'First Term', academicYear: '2023/2024', date: '2023-12-15', status: 'published' },
        { id: 2, studentName: 'Jane Smith', studentId: 'FCS/2023/002', class: 'Primary 3', term: 'First Term', academicYear: '2023/2024', date: '2023-12-15', status: 'published' },
        { id: 3, studentName: 'Michael Johnson', studentId: 'FCS/2023/003', class: 'Primary 3', term: 'First Term', academicYear: '2023/2024', date: '2023-12-15', status: 'published' },
        { id: 4, studentName: 'Sarah Williams', studentId: 'FCS/2023/004', class: 'Primary 3', term: 'First Term', academicYear: '2023/2024', date: '2023-12-15', status: 'draft' },
        { id: 5, studentName: 'David Brown', studentId: 'FCS/2023/005', class: 'Primary 3', term: 'First Term', academicYear: '2023/2024', date: '2023-12-15', status: 'draft' }
    ];
    
    const sampleArchiveItems = [
        { id: 1, name: 'First Term Report Card', type: 'report', student: 'John Doe', class: 'Primary 2', term: 'First Term', academicYear: '2022/2023', date: '2022-12-10', lastAccessed: '2023-01-15' },
        { id: 2, name: 'Second Term Report Card', type: 'report', student: 'John Doe', class: 'Primary 2', term: 'Second Term', academicYear: '2022/2023', date: '2023-03-25', lastAccessed: '2023-04-05' },
        { id: 3, name: 'Third Term Report Card', type: 'report', student: 'John Doe', class: 'Primary 2', term: 'Third Term', academicYear: '2022/2023', date: '2023-07-15', lastAccessed: '2023-07-20' },
        { id: 4, name: 'First Term Examination', type: 'exam', class: 'Primary 2', term: 'First Term', academicYear: '2022/2023', date: '2022-11-25', lastAccessed: '2022-12-05' },
        { id: 5, name: 'Second Term Examination', type: 'exam', class: 'Primary 2', term: 'Second Term', academicYear: '2022/2023', date: '2023-03-10', lastAccessed: '2023-03-15' },
        { id: 6, name: 'Third Term Examination', type: 'exam', class: 'Primary 2', term: 'Third Term', academicYear: '2022/2023', date: '2023-07-01', lastAccessed: '2023-07-10' }
    ];
    
    // Initialize the page
    function init() {
        // Set current date
        document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        // Populate class dropdowns
        populateClassDropdowns();
        
        // Set up tab navigation
        setupTabs();
        
        // Set up event listeners
        setupEventListeners();
    }
    
    // Populate class dropdowns
    function populateClassDropdowns() {
        const classDropdowns = document.querySelectorAll('#report-class, #view-class, #archive-class');
        
        classDropdowns.forEach(dropdown => {
            if (!dropdown) return;
            
            // Get current options
            const currentOptions = dropdown.innerHTML;
            
            // Add class options
            let options = currentOptions;
            sampleClasses.forEach(cls => {
                options += `<option value="${cls.name}">${cls.name}</option>`;
            });
            
            dropdown.innerHTML = options;
        });
    }
    
    // Set up tab navigation
    function setupTabs() {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and panes
                tabs.forEach(t => t.classList.remove('active'));
                tabPanes.forEach(p => p.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding pane
                tab.classList.add('active');
                currentTab = tab.getAttribute('data-tab');
                document.getElementById(`${currentTab}-tab`).classList.add('active');
            });
        });
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Mobile sidebar toggle
        document.getElementById('sidebar-toggle').addEventListener('click', function() {
            document.querySelector('.dashboard-sidebar').classList.toggle('active');
        });
        
        // Close modal buttons
        document.querySelectorAll('.close-modal, .cancel-modal').forEach(button => {
            button.addEventListener('click', closeAllModals);
        });
        
        // Load students button
        const loadStudentsBtn = document.getElementById('load-students-btn');
        if (loadStudentsBtn) {
            loadStudentsBtn.addEventListener('click', loadStudents);
        }
        
        // Search reports button
        const searchReportsBtn = document.getElementById('search-reports-btn');
        if (searchReportsBtn) {
            searchReportsBtn.addEventListener('click', searchReports);
        }
        
        // Search archive button
        const searchArchiveBtn = document.getElementById('search-archive-btn');
        if (searchArchiveBtn) {
            searchArchiveBtn.addEventListener('click', searchArchive);
        }
        
        // Template preview buttons
        document.querySelectorAll('.preview-template').forEach(button => {
            button.addEventListener('click', function() {
                const templateId = this.getAttribute('data-id');
                previewTemplate(templateId);
            });
        });
        
        // Create template button
        const createTemplateBtn = document.getElementById('create-template-btn');
        if (createTemplateBtn) {
            createTemplateBtn.addEventListener('click', function() {
                alert('Template editor would open here');
            });
        }
        
        // Batch generate button
        const batchGenerateBtn = document.getElementById('batch-generate-btn');
        if (batchGenerateBtn) {
            batchGenerateBtn.addEventListener('click', function() {
                alert('Batch report generation would start here');
            });
        }
        
        // Select all checkboxes
        setupSelectAllCheckboxes();
    }
    
    // Set up select all checkboxes
    function setupSelectAllCheckboxes() {
        const selectAllStudents = document.getElementById('select-all-students');
        const selectAllHeader = document.getElementById('select-all-header');
        const selectAllReports = document.getElementById('select-all-reports');
        const selectAllArchives = document.getElementById('select-all-archives');
        
        if (selectAllStudents) {
            selectAllStudents.addEventListener('change', function() {
                const checkboxes = document.querySelectorAll('#students-list input[type="checkbox"]');
                checkboxes.forEach(checkbox => {
                    checkbox.checked = this.checked;
                });
            });
        }
        
        if (selectAllHeader) {
            selectAllHeader.addEventListener('change', function() {
                const checkboxes = document.querySelectorAll('#students-list input[type="checkbox"]');
                checkboxes.forEach(checkbox => {
                    checkbox.checked = this.checked;
                });
                if (selectAllStudents) {
                    selectAllStudents.checked = this.checked;
                }
            });
        }
        
        if (selectAllReports) {
            selectAllReports.addEventListener('change', function() {
                const checkboxes = document.querySelectorAll('#reports-list input[type="checkbox"]');
                checkboxes.forEach(checkbox => {
                    checkbox.checked = this.checked;
                });
                
                // Enable/disable bulk action buttons
                const bulkDownloadBtn = document.getElementById('bulk-download-btn');
                const bulkPrintBtn = document.getElementById('bulk-print-btn');
                
                if (bulkDownloadBtn) bulkDownloadBtn.disabled = !this.checked;
                if (bulkPrintBtn) bulkPrintBtn.disabled = !this.checked;
            });
        }
        
        if (selectAllArchives) {
            selectAllArchives.addEventListener('change', function() {
                const checkboxes = document.querySelectorAll('#archive-results-list input[type="checkbox"]');
                checkboxes.forEach(checkbox => {
                    checkbox.checked = this.checked;
                });
                
                // Enable/disable export button
                const exportArchiveBtn = document.getElementById('export-archive-btn');
                if (exportArchiveBtn) exportArchiveBtn.disabled = !this.checked;
            });
        }
    }
    
    // Load students based on selected class and term
    function loadStudents() {
        const classSelect = document.getElementById('report-class');
        const termSelect = document.getElementById('report-term');
        const yearSelect = document.getElementById('report-year');
        
        if (!classSelect.value) {
            alert('Please select a class');
            return;
        }
        
        if (!termSelect.value) {
            alert('Please select a term');
            return;
        }
        
        // In a real application, you would fetch students from the server
        // For demonstration, we'll use the sample data
        const studentsList = document.getElementById('students-list');
        
        // Clear current list
        studentsList.innerHTML = '';
        
        // Filter students by class
        const filteredStudents = sampleStudents.filter(student => student.class === classSelect.value);
        
        if (filteredStudents.length === 0) {
            studentsList.innerHTML = `
                <tr class="empty-state">
                    <td colspan="6" class="text-center">
                        <div class="empty-state-container">
                            <i class="fas fa-user-graduate empty-icon"></i>
                            <p>No students found in this class</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        
        // Populate students list
        filteredStudents.forEach(student => {
            const statusClass = student.reportStatus === 'pending' ? 'pending' : 
                               student.reportStatus === 'generated' ? 'generated' : 'published';
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="checkbox" class="student-checkbox" data-id="${student.id}"></td>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.gender}</td>
                <td><span class="status-badge ${statusClass}">${student.reportStatus}</span></td>
                <td>
                    <button class="action-btn generate-report-btn" data-id="${student.id}">
                        <i class="fas fa-file-alt"></i> Generate Report
                    </button>
                </td>
            `;
            studentsList.appendChild(row);
        });
        
        // Add event listeners to generate report buttons
        document.querySelectorAll('.generate-report-btn').forEach(button => {
            button.addEventListener('click', function() {
                const studentId = this.getAttribute('data-id');
                openGenerateReportModal(studentId);
            });
        });
    }
    
    // Search reports based on filters
    function searchReports() {
        const termSelect = document.getElementById('view-term');
        const classSelect = document.getElementById('view-class');
        const yearSelect = document.getElementById('view-year');
        const searchInput = document.getElementById('view-search');
        
        // In a real application, you would fetch reports from the server
        // For demonstration, we'll use the sample data
        const reportsList = document.getElementById('reports-list');
        
        // Clear current list
        reportsList.innerHTML = '';
        
        // Filter reports based on selected filters
        let filteredReports = [...sampleReports];
        
        if (termSelect.value) {
            filteredReports = filteredReports.filter(report => report.term === termSelect.value);
        }
        
        if (classSelect.value) {
            filteredReports = filteredReports.filter(report => report.class === classSelect.value);
        }
        
        if (yearSelect.value) {
            filteredReports = filteredReports.filter(report => report.academicYear === yearSelect.value);
        }
        
        if (searchInput.value) {
            const searchTerm = searchInput.value.toLowerCase();
            filteredReports = filteredReports.filter(report => 
                report.studentName.toLowerCase().includes(searchTerm) || 
                report.studentId.toLowerCase().includes(searchTerm)
            );
        }
        
        if (filteredReports.length === 0) {
            reportsList.innerHTML = `
                <tr class="empty-state">
                    <td colspan="8" class="text-center">
                        <div class="empty-state-container">
                            <i class="fas fa-file-alt empty-icon"></i>
                            <p>No reports found matching your criteria</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        
        // Populate reports list
        filteredReports.forEach(report => {
            const statusClass = report.status === 'draft' ? 'pending' : 'published';
            const formattedDate = new Date(report.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="checkbox" class="report-checkbox" data-id="${report.id}"></td>
                <td>${report.studentName}</td>
                <td>${report.class}</td>
                <td>${report.term}</td>
                <td>${report.academicYear}</td>
                <td>${formattedDate}</td>
                <td><span class="status-badge ${statusClass}">${report.status}</span></td>
                <td>
                    <button class="action-btn view-report-btn" data-id="${report.id}">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="action-btn download-report-btn" data-id="${report.id}">
                        <i class="fas fa-download"></i> Download
                    </button>
                    <button class="action-btn print-report-btn" data-id="${report.id}">
                        <i class="fas fa-print"></i> Print
                    </button>
                </td>
            `;
            reportsList.appendChild(row);
        });
        
        // Add event listeners to report action buttons
        document.querySelectorAll('.view-report-btn').forEach(button => {
            button.addEventListener('click', function() {
                const reportId = this.getAttribute('data-id');
                openViewReportModal(reportId);
            });
        });
        
        document.querySelectorAll('.download-report-btn').forEach(button => {
            button.addEventListener('click', function() {
                const reportId = this.getAttribute('data-id');
                downloadReport(reportId);
            });
        });
        
        document.querySelectorAll('.print-report-btn').forEach(button => {
            button.addEventListener('click', function() {
                const reportId = this.getAttribute('data-id');
                printReport(reportId);
            });
        });
        
        // Enable/disable bulk action buttons based on checkbox selections
        document.querySelectorAll('.report-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', updateBulkActionButtons);
        });
    }
    
    // Update bulk action buttons based on checkbox selections
    function updateBulkActionButtons() {
        const checkboxes = document.querySelectorAll('#reports-list input[type="checkbox"]:checked');
        const bulkDownloadBtn = document.getElementById('bulk-download-btn');
        const bulkPrintBtn = document.getElementById('bulk-print-btn');
        
        if (bulkDownloadBtn) bulkDownloadBtn.disabled = checkboxes.length === 0;
        if (bulkPrintBtn) bulkPrintBtn.disabled = checkboxes.length === 0;
    }
    
    // Search archive based on filters
    function searchArchive() {
        const yearSelect = document.getElementById('archive-year');
        const termSelect = document.getElementById('archive-term');
        const classSelect = document.getElementById('archive-class');
        const studentInput = document.getElementById('archive-student');
        
        if (!yearSelect.value) {
            alert('Please select an academic year');
            return;
        }
        
        // In a real application, you would fetch archive items from the server
        // For demonstration, we'll use the sample data
        const archiveResultsList = document.getElementById('archive-results-list');
        
        // Clear current list
        archiveResultsList.innerHTML = '';
        
        // Filter archive items based on selected filters
        let filteredItems = [...sampleArchiveItems];
        
        filteredItems = filteredItems.filter(item => item.academicYear === yearSelect.value);
        
        if (termSelect.value) {
            filteredItems = filteredItems.filter(item => item.term === termSelect.value);
        }
        
        if (classSelect.value) {
            filteredItems = filteredItems.filter(item => item.class === classSelect.value);
        }
        
        if (studentInput.value) {
            const searchTerm = studentInput.value.toLowerCase();
            filteredItems = filteredItems.filter(item => 
                (item.student && item.student.toLowerCase().includes(searchTerm))
            );
        }
        
        if (filteredItems.length === 0) {
            archiveResultsList.innerHTML = `
                <tr class="empty-state">
                    <td colspan="9" class="text-center">
                        <div class="empty-state-container">
                            <i class="fas fa-archive empty-icon"></i>
                            <p>No archive items found matching your criteria</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        
        // Populate archive results list
        filteredItems.forEach(item => {
            const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="checkbox" class="archive-checkbox" data-id="${item.id}"></td>
                <td>${item.name}</td>
                <td><span class="badge ${item.type}">${item.type}</span></td>
                <td>${item.student || '-'}</td>
                <td>${item.class}</td>
                <td>${item.term}</td>
                <td>${item.academicYear}</td>
                <td>${formattedDate}</td>
                <td>
                    <button class="action-btn view-archive-btn" data-id="${item.id}">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="action-btn download-archive-btn" data-id="${item.id}">
                        <i class="fas fa-download"></i> Download
                    </button>
                </td>
            `;
            archiveResultsList.appendChild(row);
        });
        
        // Add event listeners to archive action buttons
        document.querySelectorAll('.view-archive-btn').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = this.getAttribute('data-id');
                openArchiveItemModal(itemId);
            });
        });
        
        document.querySelectorAll('.download-archive-btn').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = this.getAttribute('data-id');
                downloadArchiveItem(itemId);
            });
        });
        
        // Enable/disable export button based on checkbox selections
        document.querySelectorAll('.archive-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', updateExportButton);
        });
        
        // Enable export button
        const exportArchiveBtn = document.getElementById('export-archive-btn');
        if (exportArchiveBtn) exportArchiveBtn.disabled = true;
    }
    
    // Update export button based on checkbox selections
    function updateExportButton() {
        const checkboxes = document.querySelectorAll('#archive-results-list input[type="checkbox"]:checked');
        const exportArchiveBtn = document.getElementById('export-archive-btn');
        
        if (exportArchiveBtn) exportArchiveBtn.disabled = checkboxes.length === 0;
    }
    
    // Open generate report modal
    function openGenerateReportModal(studentId) {
        // Find student by ID
        const student = sampleStudents.find(s => s.id === studentId);
        
        if (!student) {
            alert('Student not found');
            return;
        }
        
        // Set student information in modal
        document.getElementById('student-name-title').textContent = student.name;
        document.getElementById('student-id-display').textContent = student.id;
        document.getElementById('student-class-display').textContent = student.class;
        document.getElementById('student-term-display').textContent = document.getElementById('report-term').value;
        
        // Populate subjects
        const subjectsList = document.getElementById('subjects-list');
        subjectsList.innerHTML = '';
        
        sampleSubjects.forEach(subject => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${subject.name}</td>
                <td><input type="number" name="ca-${subject.id}" min="0" max="40" class="ca-score" data-subject="${subject.id}" required></td>
                <td><input type="number" name="exam-${subject.id}" min="0" max="60" class="exam-score" data-subject="${subject.id}" required></td>
                <td class="total-score" id="total-${subject.id}">0</td>
                <td class="grade" id="grade-${subject.id}">-</td>
                <td class="remarks" id="remarks-${subject.id}">-</td>
            `;
            subjectsList.appendChild(row);
        });
        
        // Add event listeners to score inputs
        document.querySelectorAll('.ca-score, .exam-score').forEach(input => {
            input.addEventListener('input', updateScores);
        });
        
        // Set up form submission
        const reportForm = document.getElementById('report-form');
        reportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            generateReport(studentId);
        });
        
        // Show modal
        generateReportModal.classList.add('active');
        
        // Add event listener for preview button
        document.querySelector('.preview-report').addEventListener('click', function() {
            previewReport(studentId);
        });
    }
    
    // Update scores, grades, and remarks
    function updateScores() {
        const subjectId = this.getAttribute('data-subject');
        const caInput = document.querySelector(`.ca-score[data-subject="${subjectId}"]`);
        const examInput = document.querySelector(`.exam-score[data-subject="${subjectId}"]`);
        
        const caScore = parseInt(caInput.value) || 0;
        const examScore = parseInt(examInput.value) || 0;
        const totalScore = caScore + examScore;
        
        // Update total score
        document.getElementById(`total-${subjectId}`).textContent = totalScore;
        
        // Update grade
        let grade = '';
        if (totalScore >= 80) {
            grade = 'A';
        } else if (totalScore >= 70) {
            grade = 'B';
        } else if (totalScore >= 60) {
            grade = 'C';
        } else if (totalScore >= 50) {
            grade = 'D';
        } else if (totalScore >= 40) {
            grade = 'E';
        } else {
            grade = 'F';
        }
        
        document.getElementById(`grade-${subjectId}`).textContent = grade;
        
        // Update remarks
        let remarks = '';
        if (totalScore >= 80) {
            remarks = 'Excellent';
        } else if (totalScore >= 70) {
            remarks = 'Very Good';
        } else if (totalScore >= 60) {
            remarks = 'Good';
        } else if (totalScore >= 50) {
            remarks = 'Fair';
        } else if (totalScore >= 40) {
            remarks = 'Pass';
        } else {
            remarks = 'Fail';
        }
        
        document.getElementById(`remarks-${subjectId}`).textContent = remarks;
    }
    
    // Generate report
    function generateReport(studentId) {
        // In a real application, you would send the form data to the server
        // For demonstration, we'll just show a success message
        alert('Report generated successfully!');
        
        // Close modal
        closeAllModals();
        
        // Update student status
        const student = sampleStudents.find(s => s.id === studentId);
        if (student) {
            student.reportStatus = 'generated';
            
            // Update status in the table
            const statusCell = document.querySelector(`button[data-id="${studentId}"]`).closest('tr').querySelector('.status-badge');
            statusCell.textContent = 'generated';
            statusCell.className = 'status-badge generated';
        }
    }
    
    // Preview report
    function previewReport(studentId) {
        // In a real application, you would generate a preview based on the form data
        // For demonstration, we'll just open the view report modal
        openViewReportModal(studentId);
    }
    
    // Open view report modal
    function openViewReportModal(reportId) {
        // In a real application, you would fetch the report from the server
        // For demonstration, we'll use a sample report
        
        const reportContainer = document.getElementById('report-view-container');
        
        // Show loading spinner
        reportContainer.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Loading report...</span>
            </div>
        `;
        
        // Simulate loading delay
        setTimeout(() => {
            // Generate sample report HTML
            reportContainer.innerHTML = `
                <div class="archived-report">
                    <div class="report-header">
                        <div class="school-info">
                            <h3>Franciscan Catholic Nursery & Primary School</h3>
                            <p>123 School Road, Lagos, Nigeria</p>
                            <p>Tel: +234 123 456 7890 | Email: info@franciscancatholicschool.edu.ng</p>
                        </div>
                        <div class="report-title">
                            <h2>Student Report Card</h2>
                            <p>First Term, 2023/2024 Academic Year</p>
                        </div>
                    </div>
                    
                    <div class="student-info">
                        <div class="info-row">
                            <div class="info-group">
                                <span class="info-label">Student Name:</span>
                                <span class="info-value">John Doe</span>
                            </div>
                            <div class="info-group">
                                <span class="info-label">Student ID:</span>
                                <span class="info-value">FCS/2023/001</span>
                            </div>
                            <div class="info-group">
                                <span class="info-label">Class:</span>
                                <span class="info-value">Primary 3</span>
                            </div>
                        </div>
                        <div class="info-row">
                            <div class="info-group">
                                <span class="info-label">Term:</span>
                                <span class="info-value">First Term</span>
                            </div>
                            <div class="info-group">
                                <span class="info-label">Academic Year:</span>
                                <span class="info-value">2023/2024</span>
                            </div>
                            <div class="info-group">
                                <span class="info-label">Date:</span>
                                <span class="info-value">December 15, 2023</span>
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
                                    <th>Total Score</th>
                                    <th>Grade</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Mathematics</td>
                                    <td>35</td>
                                    <td>52</td>
                                    <td>87</td>
                                    <td>A</td>
                                    <td>Excellent</td>
                                </tr>
                                <tr>
                                    <td>English Language</td>
                                    <td>32</td>
                                    <td>48</td>
                                    <td>80</td>
                                    <td>A</td>
                                    <td>Excellent</td>
                                </tr>
                                <tr>
                                    <td>Science</td>
                                    <td>30</td>
                                    <td>45</td>
                                    <td>75</td>
                                    <td>B</td>
                                    <td>Very Good</td>
                                </tr>
                                <tr>
                                    <td>Social Studies</td>
                                    <td>28</td>
                                    <td>42</td>
                                    <td>70</td>
                                    <td>B</td>
                                    <td>Very Good</td>
                                </tr>
                                <tr>
                                    <td>Religious Studies</td>
                                    <td>33</td>
                                    <td>50</td>
                                    <td>83</td>
                                    <td>A</td>
                                    <td>Excellent</td>
                                </tr>
                                <tr>
                                    <td>Creative Arts</td>
                                    <td>34</td>
                                    <td>51</td>
                                    <td>85</td>
                                    <td>A</td>
                                    <td>Excellent</td>
                                </tr>
                                <tr>
                                    <td>Physical Education</td>
                                    <td>36</td>
                                    <td>54</td>
                                    <td>90</td>
                                    <td>A</td>
                                    <td>Excellent</td>
                                </tr>
                                <tr>
                                    <td>Computer Studies</td>
                                    <td>31</td>
                                    <td>47</td>
                                    <td>78</td>
                                    <td>B</td>
                                    <td>Very Good</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="3">Total</td>
                                    <td>648</td>
                                    <td colspan="2">Average: 81.0 (A)</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    
                    <div class="report-comments">
                        <div class="comment-section">
                            <h4>Character Development</h4>
                            <div class="traits-grid">
                                <div class="trait-item">
                                    <span class="info-label">Punctuality:</span>
                                    <span class="info-value">Excellent</span>
                                </div>
                                <div class="trait-item">
                                    <span class="info-label">Neatness:</span>
                                    <span class="info-value">Very Good</span>
                                </div>
                                <div class="trait-item">
                                    <span class="info-label">Behavior:</span>
                                    <span class="info-value">Excellent</span>
                                </div>
                                <div class="trait-item">
                                    <span class="info-label">Leadership:</span>
                                    <span class="info-value">Very Good</span>
                                </div>
                                <div class="trait-item">
                                    <span class="info-label">Cooperation:</span>
                                    <span class="info-value">Excellent</span>
                                </div>
                                <div class="trait-item">
                                    <span class="info-label">Creativity:</span>
                                    <span class="info-value">Excellent</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="comment-section">
                            <h4>Class Teacher's Comment</h4>
                            <p>John is an exceptional student who consistently demonstrates a strong work ethic and a positive attitude towards learning. He actively participates in class discussions and shows great potential in all subjects. Keep up the excellent work!</p>
                            <div class="signature">
                                <span>Mrs. Sarah Johnson</span>
                                <span>Class Teacher</span>
                            </div>
                        </div>
                        
                        <div class="comment-section">
                            <h4>Head Teacher's Comment</h4>
                            <p>John has shown remarkable academic progress and character development this term. His dedication to excellence is commendable. We encourage him to maintain this outstanding performance in the coming terms.</p>
                            <div class="signature">
                                <span>Mr. David Williams</span>
                                <span>Head Teacher</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="report-footer">
                        <p>This report was generated on December 15, 2023. If you have any questions, please contact the school administration.</p>
                    </div>
                </div>
            `;
        }, 1000);
        
        // Show modal
        viewReportModal.classList.add('active');
        
        // Add event listeners for report actions
        document.getElementById('download-report-btn').addEventListener('click', function() {
            downloadReport(reportId);
        });
        
        document.getElementById('print-report-btn').addEventListener('click', function() {
            printReport(reportId);
        });
        
        document.getElementById('share-report-btn').addEventListener('click', function() {
            shareReport(reportId);
        });
    }
    
    // Preview template
    function previewTemplate(templateId) {
        const templatePreviewContainer = document.getElementById('template-preview-container');
        
        // Show loading spinner
        templatePreviewContainer.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Loading template preview...</span>
            </div>
        `;
        
        // Set template name
        document.getElementById('template-name').textContent = 'Standard Report Card';
        
        // Simulate loading delay
        setTimeout(() => {
            // Generate sample template preview HTML
            templatePreviewContainer.innerHTML = `
                <div class="archived-report">
                    <div class="report-header">
                        <div class="school-info">
                            <h3>Franciscan Catholic Nursery & Primary School</h3>
                            <p>123 School Road, Lagos, Nigeria</p>
                            <p>Tel: +234 123 456 7890 | Email: info@franciscancatholicschool.edu.ng</p>
                        </div>
                        <div class="report-title">
                            <h2>Student Report Card</h2>
                            <p>[Term], [Academic Year] Academic Year</p>
                        </div>
                    </div>
                    
                    <div class="student-info">
                        <div class="info-row">
                            <div class="info-group">
                                <span class="info-label">Student Name:</span>
                                <span class="info-value">[Student Name]</span>
                            </div>
                            <div class="info-group">
                                <span class="info-label">Student ID:</span>
                                <span class="info-value">[Student ID]</span>
                            </div>
                            <div class="info-group">
                                <span class="info-label">Class:</span>
                                <span class="info-value">[Class]</span>
                            </div>
                        </div>
                        <div class="info-row">
                            <div class="info-group">
                                <span class="info-label">Term:</span>
                                <span class="info-value">[Term]</span>
                            </div>
                            <div class="info-group">
                                <span class="info-label">Academic Year:</span>
                                <span class="info-value">[Academic Year]</span>
                            </div>
                            <div class="info-group">
                                <span class="info-label">Date:</span>
                                <span class="info-value">[Date]</span>
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
                                    <th>Total Score</th>
                                    <th>Grade</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>[Subject Name]</td>
                                    <td>[CA Score]</td>
                                    <td>[Exam Score]</td>
                                    <td>[Total Score]</td>
                                    <td>[Grade]</td>
                                    <td>[Remarks]</td>
                                </tr>
                                <!-- More subject rows would be dynamically generated -->
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="3">Total</td>
                                    <td>[Total]</td>
                                    <td colspan="2">Average: [Average] ([Grade])</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    
                    <div class="report-comments">
                        <div class="comment-section">
                            <h4>Character Development</h4>
                            <div class="traits-grid">
                                <div class="trait-item">
                                    <span class="info-label">Punctuality:</span>
                                    <span class="info-value">[Rating]</span>
                                </div>
                                <div class="trait-item">
                                    <span class="info-label">Neatness:</span>
                                    <span class="info-value">[Rating]</span>
                                </div>
                                <div class="trait-item">
                                    <span class="info-label">Behavior:</span>
                                    <span class="info-value">[Rating]</span>
                                </div>
                                <div class="trait-item">
                                    <span class="info-label">Leadership:</span>
                                    <span class="info-value">[Rating]</span>
                                </div>
                                <div class="trait-item">
                                    <span class="info-label">Cooperation:</span>
                                    <span class="info-value">[Rating]</span>
                                </div>
                                <div class="trait-item">
                                    <span class="info-label">Creativity:</span>
                                    <span class="info-value">[Rating]</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="comment-section">
                            <h4>Class Teacher's Comment</h4>
                            <p>[Class Teacher's Comment]</p>
                            <div class="signature">
                                <span>[Teacher Name]</span>
                                <span>Class Teacher</span>
                            </div>
                        </div>
                        
                        <div class="comment-section">
                            <h4>Head Teacher's Comment</h4>
                            <p>[Head Teacher's Comment]</p>
                            <div class="signature">
                                <span>[Head Teacher Name]</span>
                                <span>Head Teacher</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="report-footer">
                        <p>This report was generated on [Date]. If you have any questions, please contact the school administration.</p>
                    </div>
                </div>
            `;
        }, 1000);
        
        // Show modal
        templatePreviewModal.classList.add('active');
        
        // Add event listeners for template actions
        document.getElementById('use-template-btn').addEventListener('click', function() {
            useTemplate(templateId);
        });
        
        document.getElementById('edit-template-btn').addEventListener('click', function() {
            editTemplate(templateId);
        });
    }
    
    // Open archive item modal
    function openArchiveItemModal(itemId) {
        // Find archive item by ID
        const item = sampleArchiveItems.find(i => i.id === parseInt(itemId));
        
        if (!item) {
            alert('Archive item not found');
            return;
        }
        
        // Set item information in modal
        document.getElementById('archive-item-title').textContent = item.name;
        document.getElementById('archive-item-type').textContent = item.type;
        document.getElementById('archive-item-type').className = `badge ${item.type}`;
        
        const archiveItemInfo = document.getElementById('archive-item-info');
        archiveItemInfo.innerHTML = `
            <div class="info-row">
                ${item.student ? `
                <div class="info-group">
                    <span class="info-label">Student:</span>
                    <span class="info-value">${item.student}</span>
                </div>
                ` : ''}
                <div class="info-group">
                    <span class="info-label">Class:</span>
                    <span class="info-value">${item.class}</span>
                </div>
                <div class="info-group">
                    <span class="info-label">Term:</span>
                    <span class="info-value">${item.term}</span>
                </div>
                <div class="info-group">
                    <span class="info-label">Academic Year:</span>
                    <span class="info-value">${item.academicYear}</span>
                </div>
            </div>
            <div class="info-row">
                <div class="info-group">
                    <span class="info-label">Created:</span>
                    <span class="info-value">${new Date(item.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}</span>
                </div>
                <div class="info-group">
                    <span class="info-label">Last Accessed:</span>
                    <span class="info-value">${new Date(item.lastAccessed).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}</span>
                </div>
            </div>
        `;
        
        const archiveItemContent = document.getElementById('archive-item-content');
        
        // Show loading spinner
        archiveItemContent.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Loading archive item...</span>
            </div>
        `;
        
        // Simulate loading delay
        setTimeout(() => {
            // Generate sample content based on item type
            if (item.type === 'report') {
                archiveItemContent.innerHTML = `
                    <div class="archived-report">
                        <div class="report-header">
                            <div class="school-info">
                                <h3>Franciscan Catholic Nursery & Primary School</h3>
                                <p>123 School Road, Lagos, Nigeria</p>
                                <p>Tel: +234 123 456 7890 | Email: info@franciscancatholicschool.edu.ng</p>
                            </div>
                            <div class="report-title">
                                <h2>Student Report Card</h2>
                                <p>${item.term}, ${item.academicYear} Academic Year</p>
                            </div>
                        </div>
                        
                        <div class="student-info">
                            <div class="info-row">
                                <div class="info-group">
                                    <span class="info-label">Student Name:</span>
                                    <span class="info-value">${item.student}</span>
                                </div>
                                <div class="info-group">
                                    <span class="info-label">Student ID:</span>
                                    <span class="info-value">FCS/2022/001</span>
                                </div>
                                <div class="info-group">
                                    <span class="info-label">Class:</span>
                                    <span class="info-value">${item.class}</span>
                                </div>
                            </div>
                            <div class="info-row">
                                <div class="info-group">
                                    <span class="info-label">Term:</span>
                                    <span class="info-value">${item.term}</span>
                                </div>
                                <div class="info-group">
                                    <span class="info-label">Academic Year:</span>
                                    <span class="info-value">${item.academicYear}</span>
                                </div>
                                <div class="info-group">
                                    <span class="info-label">Date:</span>
                                    <span class="info-value">${new Date(item.date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Sample report content -->
                        <div class="report-table-container">
                            <table class="report-table">
                                <thead>
                                    <tr>
                                        <th>Subject</th>
                                        <th>CA Score (40%)</th>
                                        <th>Exam Score (60%)</th>
                                        <th>Total Score</th>
                                        <th>Grade</th>
                                        <th>Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Mathematics</td>
                                        <td>32</td>
                                        <td>48</td>
                                        <td>80</td>
                                        <td>A</td>
                                        <td>Excellent</td>
                                    </tr>
                                    <tr>
                                        <td>English Language</td>
                                        <td>30</td>
                                        <td>45</td>
                                        <td>75</td>
                                        <td>B</td>
                                        <td>Very Good</td>
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
                                        <td>30</td>
                                        <td>45</td>
                                        <td>75</td>
                                        <td>B</td>
                                        <td>Very Good</td>
                                    </tr>
                                    <tr>
                                        <td>Religious Studies</td>
                                        <td>35</td>
                                        <td>52</td>
                                        <td>87</td>
                                        <td>A</td>
                                        <td>Excellent</td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colspan="3">Total</td>
                                        <td>387</td>
                                        <td colspan="2">Average: 77.4 (B)</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        
                        <div class="report-comments">
                            <div class="comment-section">
                                <h4>Class Teacher's Comment</h4>
                                <p>${item.student} has performed well this term. Keep up the good work!</p>
                            </div>
                            
                            <div class="comment-section">
                                <h4>Head Teacher's Comment</h4>
                                <p>Good performance. Continue to work hard.</p>
                            </div>
                        </div>
                    </div>
                `;
            } else if (item.type === 'exam') {
                archiveItemContent.innerHTML = `
                    <div class="archived-exam">
                        <div class="exam-header">
                            <h3>Franciscan Catholic Nursery & Primary School</h3>
                            <div class="exam-meta">
                                <span><strong>Class:</strong> ${item.class}</span>
                                <span><strong>Term:</strong> ${item.term}</span>
                                <span><strong>Academic Year:</strong> ${item.academicYear}</span>
                                <span><strong>Date:</strong> ${new Date(item.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</span>
                            </div>
                        </div>
                        
                        <div class="exam-sections">
                            <div class="exam-section">
                                <h4>Mathematics</h4>
                                <ol class="question-list">
                                    <li>
                                        <div class="question-text">Solve for x: 2x + 5 = 15</div>
                                        <div class="answer-space">x = 5</div>
                                    </li>
                                    <li>
                                        <div class="question-text">Calculate the area of a rectangle with length 8cm and width 5cm.</div>
                                        <div class="answer-space">Area = 40 square cm</div>
                                    </li>
                                    <li>
                                        <div class="question-text">What is 15% of 80?</div>
                                        <div class="answer-space">12</div>
                                    </li>
                                </ol>
                            </div>
                            
                            <div class="exam-section">
                                <h4>English Language</h4>
                                <ol class="question-list">
                                    <li>
                                        <div class="question-text">Write a short paragraph about your favorite hobby.</div>
                                        <div class="answer-space">My favorite hobby is reading books. I enjoy reading adventure stories and learning new things. Reading helps me improve my vocabulary and takes me to different worlds without leaving my room.</div>
                                    </li>
                                    <li>
                                        <div class="question-text">Identify the nouns in the following sentence: "The teacher gave the students homework on Monday."</div>
                                        <div class="answer-space">Nouns: teacher, students, homework, Monday</div>
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </div>
                `;
            }
        }, 1000);
        
        // Show modal
        archiveItemModal.classList.add('active');
        
        // Add event listeners for archive item actions
        document.getElementById('download-item-btn').addEventListener('click', function() {
            downloadArchiveItem(itemId);
        });
        
        document.getElementById('print-item-btn').addEventListener('click', function() {
            printArchiveItem(itemId);
        });
    }
    
    // Download report
    function downloadReport(reportId) {
        // In a real application, you would generate a PDF and trigger a download
        alert(`Downloading report ${reportId}...`);
    }
    
    // Print report
    function printReport(reportId) {
        // In a real application, you would open a print dialog
        alert(`Printing report ${reportId}...`);
    }
    
    // Share report
    function shareReport(reportId) {
        // In a real application, you would show sharing options
        alert(`Sharing report ${reportId}...`);
    }
    
    // Use template
    function useTemplate(templateId) {
        // In a real application, you would set this template as the active template
        alert(`Template ${templateId} set as active template`);
        closeAllModals();
    }
    
    // Edit template
    function editTemplate(templateId) {
        // In a real application, you would open the template editor
        alert(`Opening template editor for template ${templateId}`);
        closeAllModals();
    }
    
    // Download archive item
    function downloadArchiveItem(itemId) {
        // In a real application, you would generate a PDF and trigger a download
        alert(`Downloading archive item ${itemId}...`);
    }
    
    // Print archive item
    function printArchiveItem(itemId) {
        // In a real application, you would open a print dialog
        alert(`Printing archive item ${itemId}...`);
    }
    
    // Close all modals
    function closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
    }
    
    // Initialize the page
    init();
});