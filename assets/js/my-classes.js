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
    
    // Set current date
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', options);
    
    const currentDateElements = document.querySelectorAll('#current-date');
    currentDateElements.forEach(element => {
        element.textContent = dateString;
    });
    
    // Update teacher/admin information
    const teacherNameElements = document.querySelectorAll('#teacher-name');
    const teacherSubjectElements = document.querySelectorAll('#teacher-subject');
    
    teacherNameElements.forEach(element => {
        element.textContent = currentUser.name;
    });
    
    teacherSubjectElements.forEach(element => {
        if (currentUser.role === 'teacher') {
            element.textContent = currentUser.subject || 'Subject Teacher';
        } else {
            element.textContent = currentUser.position;
        }
    });
    
    // Mobile sidebar toggle functionality
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const dashboardSidebar = document.querySelector('.dashboard-sidebar');
    const dashboardContainer = document.querySelector('.dashboard-container');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            dashboardSidebar.classList.toggle('active');
            dashboardContainer.classList.toggle('sidebar-open');
        });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        const isClickInsideSidebar = dashboardSidebar.contains(event.target);
        const isClickOnToggle = sidebarToggle.contains(event.target);
        
        if (!isClickInsideSidebar && !isClickOnToggle && window.innerWidth < 768 && dashboardSidebar.classList.contains('active')) {
            dashboardSidebar.classList.remove('active');
            dashboardContainer.classList.remove('sidebar-open');
        }
    });
    
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
    
    // Filter functionality
    const gradeFilter = document.getElementById('grade-filter');
    const dayFilter = document.getElementById('day-filter');
    const classCards = document.querySelectorAll('.class-card');
    
    function applyFilters() {
        const gradeValue = gradeFilter.value;
        const dayValue = dayFilter.value;
        
        classCards.forEach(card => {
            let showCard = true;
            
            // Apply grade filter
            if (gradeValue !== 'all') {
                if (!card.dataset.grade.includes(gradeValue)) {
                    showCard = false;
                }
            }
            
            // Apply day filter
            if (dayValue !== 'all' && showCard) {
                if (!card.dataset.days.includes(dayValue)) {
                    showCard = false;
                }
            }
            
            // Show or hide card based on filters
            if (showCard) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    if (gradeFilter) {
        gradeFilter.addEventListener('change', applyFilters);
    }
    
    if (dayFilter) {
        dayFilter.addEventListener('change', applyFilters);
    }
    
    // Class Details Modal
    const classDetailsModal = document.getElementById('class-details-modal');
    const classDetailsButtons = document.querySelectorAll('.btn-class-action[data-action="details"]');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    
    // Open class details modal
    classDetailsButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get class information from the parent card
            const classCard = this.closest('.class-card');
            const className = classCard.querySelector('h3').textContent;
            
            // Update modal with class information
            document.getElementById('modal-class-title').textContent = className;
            document.getElementById('detail-class-name').textContent = className.split(' - ')[0];
            document.getElementById('detail-subject').textContent = className.split(' - ')[1];
            document.getElementById('detail-students').textContent = classCard.querySelector('.class-badge').textContent;
            
            // Get schedule information
            const days = classCard.querySelector('.schedule-item:first-child span').textContent;
            const time = classCard.querySelector('.schedule-item:nth-child(2) span').textContent;
            document.getElementById('detail-schedule').textContent = `${days} (${time})`;
            
            // Show the modal
            classDetailsModal.classList.add('active');
        });
    });
    
    // Close modals
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.classList.remove('active');
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.classList.remove('active');
        }
    });
    
    // Add Class Modal
    const addClassBtn = document.getElementById('add-class-btn');
    const addClassModal = document.getElementById('add-class-modal');
    const addClassForm = document.getElementById('add-class-form');
    const cancelAddClassBtn = document.getElementById('cancel-add-class');
    
    // Make sure the button exists and add the event listener
    if (addClassBtn) {
        addClassBtn.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default button behavior
            // Show the modal
            if (addClassModal) {
                addClassModal.classList.add('active');
            } else {
                console.error('Add Class Modal not found');
            }
        });
    } else {
        console.error('Add Class Button not found');
    }
    
    // Make sure the cancel button works
    if (cancelAddClassBtn) {
        cancelAddClassBtn.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default button behavior
            // Hide the modal
            if (addClassModal) {
                addClassModal.classList.remove('active');
            }
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.classList.remove('active');
        }
    });
    
    // Handle form submission
    if (addClassForm) {
        addClassForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const grade = document.getElementById('class-grade').value;
            const subject = document.getElementById('class-subject').value;
            const room = document.getElementById('class-room').value;
            const startTime = document.getElementById('class-start-time').value;
            const endTime = document.getElementById('class-end-time').value;
            const students = document.getElementById('class-students').value;
            
            // Get selected days
            const selectedDays = [];
            const dayCheckboxes = document.querySelectorAll('input[name="class-days"]:checked');
            dayCheckboxes.forEach(checkbox => {
                selectedDays.push(checkbox.value);
            });
            
            // Validate form
            if (grade && subject && room && startTime && endTime && students && selectedDays.length > 0) {
                // Format times for display
                const formattedStartTime = formatTime(startTime);
                const formattedEndTime = formatTime(endTime);
                
                // Create new class card
                const newClassCard = createClassCard(grade, subject, room, selectedDays, formattedStartTime, formattedEndTime, students);
                
                // Add the new class card to the grid
                const classesGrid = document.querySelector('.classes-grid');
                if (classesGrid) {
                    classesGrid.appendChild(newClassCard);
                } else {
                    console.error('Classes grid not found');
                }
                
                // Close the modal and reset form
                addClassModal.classList.remove('active');
                addClassForm.reset();
                
                // Show success message
                alert(`New class "${grade} - ${subject}" has been added successfully.`);
            } else {
                alert('Please fill in all required fields.');
            }
        });
    } else {
        console.error('Add Class Form not found');
    }
    
    // Class action buttons
    const classActionButtons = document.querySelectorAll('.btn-class-action:not([data-action="details"])');
    
    classActionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const action = this.dataset.action;
            const className = this.closest('.class-card').querySelector('h3').textContent;
            
            // Handle different actions
            switch(action) {
                case 'attendance':
                    alert(`Taking attendance for ${className}. This feature will be implemented soon.`);
                    break;
                case 'assignments':
                    alert(`Managing assignments for ${className}. This feature will be implemented soon.`);
                    break;
                case 'grades':
                    alert(`Viewing grades for ${className}. This feature will be implemented soon.`);
                    break;
                default:
                    alert(`Action ${action} for ${className} will be implemented soon.`);
            }
        });
    });
    
    // Modal action buttons
    const modalActionButtons = document.querySelectorAll('.btn-modal-action');
    
    modalActionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const className = document.getElementById('detail-class-name').textContent;
            const subject = document.getElementById('detail-subject').textContent;
            
            switch(this.id) {
                case 'btn-take-attendance':
                    alert(`Taking attendance for ${className} - ${subject}. This feature will be implemented soon.`);
                    break;
                case 'btn-view-lesson':
                    alert(`Viewing lesson plan for ${className} - ${subject}. This feature will be implemented soon.`);
                    break;
                case 'btn-create-assignment':
                    alert(`Creating assignment for ${className} - ${subject}. This feature will be implemented soon.`);
                    break;
            }
        });
    });
    
    // Helper function to format time (24h to 12h)
    function formatTime(time24h) {
        const [hours, minutes] = time24h.split(':');
        const period = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12;
        return `${hours12}:${minutes} ${period}`;
    }
    
    // Helper function to create a new class card
    function createClassCard(grade, subject, room, days, startTime, endTime, students) {
        // Create a data-days attribute value
        const daysLower = days.map(day => day.toLowerCase()).join(',');
        
        // Create a data-grade attribute value
        const gradeForData = grade.toLowerCase().replace(' ', '-');
        
        // Create the class card element
        const card = document.createElement('div');
        card.className = 'class-card';
        card.dataset.grade = gradeForData;
        card.dataset.days = daysLower;
        
        // Generate a random progress percentage
        const progress = Math.floor(Math.random() * 100);
        
        card.innerHTML = `
            <div class="class-card-header">
                <h3>${grade} - ${subject}</h3>
                <span class="class-badge">${students} Students</span>
            </div>
            <div class="class-card-body">
                <div class="class-schedule">
                    <div class="schedule-item">
                        <i class="fas fa-calendar-day"></i>
                        <span>${days.join(', ')}</span>
                    </div>
                    <div class="schedule-item">
                        <i class="fas fa-clock"></i>
                        <span>${startTime} - ${endTime}</span>
                    </div>
                    <div class="schedule-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${room}</span>
                    </div>
                </div>
                <div class="class-progress">
                    <div class="progress-label">
                        <span>Curriculum Progress</span>
                        <span>${progress}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${progress}%"></div>
                    </div>
                </div>
            </div>
            <div class="class-card-footer">
                <a href="#" class="btn-class-action" data-action="attendance">
                    <i class="fas fa-clipboard-check"></i> Attendance
                </a>
                <a href="#" class="btn-class-action" data-action="assignments">
                    <i class="fas fa-tasks"></i> Assignments
                </a>
                <a href="#" class="btn-class-action" data-action="grades">
                    <i class="fas fa-chart-bar"></i> Grades
                </a>
                <a href="#" class="btn-class-action btn-class-details" data-action="details">
                    <i class="fas fa-info-circle"></i> Details
                </a>
            </div>
        `;
        
        // Add event listener to the details button
        const detailsButton = card.querySelector('.btn-class-details');
        detailsButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update modal with class information
            document.getElementById('modal-class-title').textContent = `${grade} - ${subject}`;
            document.getElementById('detail-class-name').textContent = grade;
            document.getElementById('detail-subject').textContent = subject;
            document.getElementById('detail-students').textContent = `${students} students`;
            document.getElementById('detail-schedule').textContent = `${days.join(', ')} (${startTime} - ${endTime})`;
            
                        // Show the modal
                        classDetailsModal.classList.add('active');
                    });
                    
                    // Add event listeners to other action buttons
                    const actionButtons = card.querySelectorAll('.btn-class-action:not([data-action="details"])');
                    actionButtons.forEach(button => {
                        button.addEventListener('click', function(e) {
                            e.preventDefault();
                            
                            const action = this.dataset.action;
                            
                            // Handle different actions
                            switch(action) {
                                case 'attendance':
                                    alert(`Taking attendance for ${grade} - ${subject}. This feature will be implemented soon.`);
                                    break;
                                case 'assignments':
                                    alert(`Managing assignments for ${grade} - ${subject}. This feature will be implemented soon.`);
                                    break;
                                case 'grades':
                                    alert(`Viewing grades for ${grade} - ${subject}. This feature will be implemented soon.`);
                                    break;
                                default:
                                    alert(`Action ${action} for ${grade} - ${subject} will be implemented soon.`);
                            }
                        });
                    });
                    
                    return card;
                }
            });
            