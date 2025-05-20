document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (!currentUser) {
        // Redirect to login page if not logged in
        window.location.href = 'portal.html';
        return;
    }
    
    // Verify this is a teacher account
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
    
    // Initialize modals
    initModals();
    
    // Initialize class actions
    initClassActions();
    
    // Initialize tabs in class details modal
    initClassDetailsTabs();
    
    // Initialize attendance functionality
    initAttendanceModal();
    
    // Initialize timetable functionality
    initTimetable();
    
    // Initialize class filter and sorting
    initClassFiltering();
});

// Update date display
function updateDateDisplay() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', options);
    
    const currentDateElements = document.querySelectorAll('#current-date');
    currentDateElements.forEach(element => {
        element.textContent = dateString;
    });
}

// Update teacher information
function updateTeacherInfo(currentUser) {
    const teacherNameElements = document.querySelectorAll('#teacher-name');
    const teacherSubjectElements = document.querySelectorAll('#teacher-subject');
    
    teacherNameElements.forEach(element => {
        element.textContent = currentUser.name;
    });
    
    teacherSubjectElements.forEach(element => {
        element.textContent = currentUser.subject || 'Mathematics Teacher';
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

// Initialize modals
function initModals() {
    // Timetable Modal
    const timetableModal = document.getElementById('timetable-modal');
    const viewTimetableBtn = document.getElementById('view-timetable-btn');
    const closeTimetableModal = document.getElementById('close-timetable-modal');
    
    if (viewTimetableBtn && timetableModal) {
        viewTimetableBtn.addEventListener('click', function() {
            timetableModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeTimetableModal && timetableModal) {
        closeTimetableModal.addEventListener('click', function() {
            timetableModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Attendance Modal
    const attendanceModal = document.getElementById('attendance-modal');
    const closeAttendanceModal = document.getElementById('close-attendance-modal');
    
    if (closeAttendanceModal && attendanceModal) {
        closeAttendanceModal.addEventListener('click', function() {
            attendanceModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Lesson Plan Modal
    const lessonPlanModal = document.getElementById('lesson-plan-modal');
    const closeLessonPlanModal = document.getElementById('close-lesson-plan-modal');
    
    if (closeLessonPlanModal && lessonPlanModal) {
        closeLessonPlanModal.addEventListener('click', function() {
            lessonPlanModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Class Details Modal
    const classDetailsModal = document.getElementById('class-details-modal');
    const closeClassDetailsModal = document.getElementById('close-class-details-modal');
    
    if (closeClassDetailsModal && classDetailsModal) {
        closeClassDetailsModal.addEventListener('click', function() {
            classDetailsModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === timetableModal) {
            timetableModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        
        if (event.target === attendanceModal) {
            attendanceModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        
        if (event.target === lessonPlanModal) {
            lessonPlanModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        
        if (event.target === classDetailsModal) {
            classDetailsModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Initialize class actions
function initClassActions() {
    const classActionButtons = document.querySelectorAll('.btn-class-action');
    const attendanceModal = document.getElementById('attendance-modal');
    const lessonPlanModal = document.getElementById('lesson-plan-modal');
    const classDetailsModal = document.getElementById('class-details-modal');
    
    classActionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            const classId = this.getAttribute('data-class');
            
            // Get class name for display in modals
            const classCard = this.closest('.class-card');
            const className = classCard.querySelector('h3').textContent;
            
            switch(action) {
                case 'attendance':
                    // Set class name in attendance modal
                    document.getElementById('attendance-class-name').textContent = className;
                    
                    // Set current date
                    const today = new Date();
                    const options = { year: 'numeric', month: 'long', day: 'numeric' };
                    document.getElementById('attendance-date').textContent = today.toLocaleDateString('en-US', options);
                    
                    // Show empty state since no students have resumed
                    showEmptyAttendanceState();
                    
                    // Show attendance modal
                    attendanceModal.style.display = 'block';
                    document.body.style.overflow = 'hidden';
                    break;
                    
                case 'lesson-plan':
                    // Set class name in lesson plan modal
                    document.getElementById('lesson-class-name').textContent = className;
                    
                    // Set current date
                    document.getElementById('lesson-date').textContent = new Date().toLocaleDateString('en-US', options);
                    
                    // Show lesson plan modal
                    lessonPlanModal.style.display = 'block';
                    document.body.style.overflow = 'hidden';
                    break;
                    
                case 'view-details':
                    // Set class name in details modal
                    document.getElementById('details-class-name').textContent = className;
                    
                    // Generate mock student list for details
                    generateMockStudentsForDetails();
                    
                    // Show class details modal
                    classDetailsModal.style.display = 'block';
                    document.body.style.overflow = 'hidden';
                    break;
            }
        });
    });
    
    // Timeline action buttons
    const timelineActionButtons = document.querySelectorAll('.btn-timeline-action');
    
    timelineActionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.querySelector('i').classList.contains('fa-clipboard-check') ? 'attendance' : 'lesson-plan';
            const timelineItem = this.closest('.timeline-item');
            const className = timelineItem.querySelector('h4').textContent;
            
            if (action === 'attendance') {
                // Set class name in attendance modal
                document.getElementById('attendance-class-name').textContent = className;
                
                // Set current date
                const today = new Date();
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                document.getElementById('attendance-date').textContent = today.toLocaleDateString('en-US', options);
                
                // Show empty state since no students have resumed
                showEmptyAttendanceState();
                
                // Show attendance modal
                attendanceModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            } else {
                // Set class name in lesson plan modal
                document.getElementById('lesson-class-name').textContent = className;
                
                // Set current date
                document.getElementById('lesson-date').textContent = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                
                // Show lesson plan modal
                lessonPlanModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    });
}

// Initialize tabs in class details modal
function initClassDetailsTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and buttons
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            document.querySelectorAll('.details-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Add active class to clicked button and corresponding tab
            this.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });
}

// Initialize attendance functionality
function initAttendanceModal() {
    const markAllPresentBtn = document.getElementById('mark-all-present');
    const clearAttendanceBtn = document.getElementById('clear-attendance');
    const saveAttendanceBtn = document.getElementById('save-attendance');
    const cancelAttendanceBtn = document.getElementById('cancel-attendance');
    const attendanceModal = document.getElementById('attendance-modal');
    
    if (markAllPresentBtn) {
        markAllPresentBtn.addEventListener('click', function() {
            // Since no students have resumed, show a message
            alert('No students available to mark as present. The school year has not begun yet.');
        });
    }
    
    if (clearAttendanceBtn) {
        clearAttendanceBtn.addEventListener('click', function() {
            // Since no students have resumed, show a message
            alert('No attendance records to clear. The school year has not begun yet.');
        });
    }
    
    if (saveAttendanceBtn) {
        saveAttendanceBtn.addEventListener('click', function() {
            // Since no students have resumed, show a message
            alert('No attendance records to save. The school year has not begun yet.');
            attendanceModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    if (cancelAttendanceBtn) {
        cancelAttendanceBtn.addEventListener('click', function() {
            attendanceModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Search functionality
    const searchStudentInput = document.getElementById('search-student');
    
    if (searchStudentInput) {
        searchStudentInput.addEventListener('input', function() {
            // Since no students have resumed, no search functionality needed
            if (this.value.trim() !== '') {
                this.value = '';
                alert('No students available to search. The school year has not begun yet.');
            }
        });
    }
}

// Show empty attendance state
function showEmptyAttendanceState() {
    const attendanceStudents = document.getElementById('attendance-students');
    const totalStudentsCount = document.getElementById('total-students-count');
    const presentCount = document.getElementById('present-count');
    const absentCount = document.getElementById('absent-count');
    const lateCount = document.getElementById('late-count');
    
    // Update counters
    if (totalStudentsCount) totalStudentsCount.textContent = '0';
    if (presentCount) presentCount.textContent = '0';
    if (absentCount) absentCount.textContent = '0';
    if (lateCount) lateCount.textContent = '0';
    
    // Clear any existing rows
    if (attendanceStudents) {
        attendanceStudents.innerHTML = '';
        
        // Add empty state message
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="4" class="empty-attendance">
                <div class="empty-state">
                    <i class="fas fa-user-graduate empty-icon"></i>
                    <h3>No Students Available</h3>
                    <p>The school year has not begun yet. Student attendance will be available once classes resume.</p>
                </div>
            </td>
        `;
        attendanceStudents.appendChild(emptyRow);
    }
}

// Initialize timetable functionality
function initTimetable() {
    const timetableView = document.getElementById('timetable-view');
    
    if (timetableView) {
        timetableView.addEventListener('change', function() {
            // Toggle between weekly and daily view
            // For now, we'll just show an alert since this is a demo
            alert(`Switched to ${this.value === 'week' ? 'weekly' : 'daily'} view.`);
        });
    }
}

// Initialize class filtering
function initClassFiltering() {
    const classFilter = document.getElementById('class-filter');
    const sortBy = document.getElementById('sort-by');
    
    if (classFilter) {
        classFilter.addEventListener('change', function() {
            filterClasses(this.value);
        });
    }
    
    if (sortBy) {
        sortBy.addEventListener('change', function() {
            sortClasses(this.value);
        });
    }
}

// Filter classes
function filterClasses(filterValue) {
    const classCards = document.querySelectorAll('.class-card');
    
    classCards.forEach(card => {
        const classBadge = card.querySelector('.class-badge');
        
        if (filterValue === 'all' || classBadge.classList.contains(filterValue)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Sort classes
function sortClasses(sortValue) {
    const classesGrid = document.querySelector('.classes-grid');
    const classCards = Array.from(document.querySelectorAll('.class-card'));
    
    switch(sortValue) {
        case 'name':
            classCards.sort((a, b) => {
                const nameA = a.querySelector('h3').textContent;
                const nameB = b.querySelector('h3').textContent;
                return nameA.localeCompare(nameB);
            });
            break;
            
        case 'students':
            classCards.sort((a, b) => {
                const studentsA = parseInt(a.querySelector('.info-item span').textContent);
                const studentsB = parseInt(b.querySelector('.info-item span').textContent);
                return studentsB - studentsA; // Sort by most students first
            });
            break;
            
        case 'recent':
            // In a real app, this would sort by last updated timestamp
            // For demo purposes, we'll just randomize the order
            classCards.sort(() => Math.random() - 0.5);
            break;
    }
    
    // Clear the grid and append sorted cards
    classesGrid.innerHTML = '';
    classCards.forEach(card => {
        classesGrid.appendChild(card);
    });
}

// Generate empty state for class details students tab
function generateMockStudentsForDetails() {
    const studentsTableBody = document.getElementById('students-table-body');
    
    if (studentsTableBody) {
        studentsTableBody.innerHTML = '';
        
        // Add empty state message
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="6" class="empty-students">
                <div class="empty-state">
                    <i class="fas fa-user-graduate empty-icon"></i>
                    <h3>No Students Enrolled</h3>
                    <p>The school year has not begun yet. Student information will be available once classes resume.</p>
                </div>
            </td>
        `;
        studentsTableBody.appendChild(emptyRow);
    }
}

// Update class statistics to show zero students
function updateClassStatistics() {
    // Update total students count
    const totalStudentsElement = document.getElementById('total-students');
    if (totalStudentsElement) {
        totalStudentsElement.textContent = '0';
    }
    
    // Update student counts in class cards
    const studentCountElements = document.querySelectorAll('.info-item span');
    studentCountElements.forEach(element => {
        if (element.textContent.includes('students')) {
            element.textContent = '0 students';
        }
    });
    
    // Update today's classes
    const todayClassesElement = document.getElementById('today-classes');
    if (todayClassesElement) {
        todayClassesElement.textContent = '0';
    }
}

// Initialize empty states for all student-related sections
function initEmptyStates() {
    // Update class statistics
    updateClassStatistics();
    
    // Replace schedule timeline with empty state
    const scheduleTimeline = document.querySelector('.schedule-timeline');
    if (scheduleTimeline) {
        scheduleTimeline.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-day empty-icon"></i>
                <h3>No Scheduled Classes</h3>
                <p>Your teaching schedule will appear here once the school year begins and classes are assigned.</p>
                <button class="btn-view-academic-calendar">View Academic Calendar</button>
            </div>
        `;
    }
    
    // Add event listener to the academic calendar button
    const academicCalendarBtn = document.querySelector('.btn-view-academic-calendar');
    if (academicCalendarBtn) {
        academicCalendarBtn.addEventListener('click', function() {
            alert('Academic calendar will be available soon.');
        });
    }
}

// Call this function when the page loads
// Add this to the existing initClassActions function or create a new function
function initScheduleActions() {
    const viewFullScheduleBtn = document.getElementById('view-full-schedule');
    
    if (viewFullScheduleBtn) {
        viewFullScheduleBtn.addEventListener('click', function() {
            const timetableModal = document.getElementById('timetable-modal');
            if (timetableModal) {
                timetableModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    }
}

// Add this to the existing initModals function or create a new function
function initLessonPlanActions() {
    const editLessonPlanBtn = document.getElementById('edit-lesson-plan');
    const printLessonPlanBtn = document.getElementById('print-lesson-plan');
    const downloadLessonPlanBtn = document.getElementById('download-lesson-plan');
    
    if (editLessonPlanBtn) {
        editLessonPlanBtn.addEventListener('click', function() {
            alert('Lesson plan editing will be available once the school year begins.');
        });
    }
    
    if (printLessonPlanBtn) {
        printLessonPlanBtn.addEventListener('click', function() {
            alert('Printing functionality will be available once the school year begins.');
        });
    }
    
    if (downloadLessonPlanBtn) {
        downloadLessonPlanBtn.addEventListener('click', function() {
            alert('Download functionality will be available once the school year begins.');
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize empty states
    initEmptyStates();
    
    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear user data from storage
            localStorage.removeItem('currentUser');
            sessionStorage.removeItem('currentUser');
            
            // Redirect to login page
            window.location.href = 'portal.html';
        });
    }
    
    // Initialize schedule and lesson plan actions
    initScheduleActions();
    initLessonPlanActions();
});