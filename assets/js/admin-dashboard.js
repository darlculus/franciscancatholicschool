document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin dashboard script loaded');
    
    // Add hamburger menu functionality
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.dashboard-sidebar');
    
    if (sidebarToggle && sidebar) {
        console.log('Sidebar toggle button found');
        sidebarToggle.addEventListener('click', function(e) {
            console.log('Sidebar toggle clicked');
            sidebar.classList.toggle('active');
            e.stopPropagation(); // Prevent the click from bubbling to document
        });
    }
    
    // Close sidebar when clicking outside
    document.addEventListener('click', function(event) {
        if (sidebar && 
            sidebar.classList.contains('active') && 
            !sidebar.contains(event.target) && 
            event.target !== sidebarToggle && 
            !sidebarToggle.contains(event.target)) {
            sidebar.classList.remove('active');
        }
    });
    
    // Test button connections
    const addTeacherBtn = document.getElementById('add-teacher-btn');
    const addStudentBtn = document.getElementById('add-student-btn');
    const addClassBtn = document.getElementById('add-class-btn');
    const addSubjectBtn = document.getElementById('add-subject-btn');
    
    if (addTeacherBtn) {
        console.log('Add Teacher button found');
        addTeacherBtn.addEventListener('click', function() {
            console.log('Add Teacher button clicked');
            const modal = document.getElementById('add-teacher-modal');
            if (modal) {
                modal.classList.add('active');
            } else {
                console.error('Add Teacher modal not found');
            }
        });
    } else {
        console.error('Add Teacher button not found');
    }
    
    if (addStudentBtn) {
        console.log('Add Student button found');
        addStudentBtn.addEventListener('click', function() {
            console.log('Add Student button clicked');
            const modal = document.getElementById('add-student-modal');
            if (modal) {
                modal.classList.add('active');
            } else {
                console.error('Add Student modal not found');
            }
        });
    } else {
        console.error('Add Student button not found');
    }
    
    if (addClassBtn) {
        console.log('Add Class button found');
        addClassBtn.addEventListener('click', function() {
            console.log('Add Class button clicked');
            const modal = document.getElementById('add-class-modal');
            if (modal) {
                modal.classList.add('active');
            } else {
                console.error('Add Class modal not found');
            }
        });
    } else {
        console.error('Add Class button not found');
    }
    
    if (addSubjectBtn) {
        console.log('Add Subject button found');
        addSubjectBtn.addEventListener('click', function() {
            console.log('Add Subject button clicked');
            const modal = document.getElementById('add-subject-modal');
            if (modal) {
                modal.classList.add('active');
            } else {
                console.error('Add Subject modal not found');
            }
        });
    } else {
        console.error('Add Subject button not found');
    }
    
    // Close modals
    const closeButtons = document.querySelectorAll('.close-modal, .cancel-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // Close modal when clicking outside
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(event) {
            if (event.target === this) {
                this.classList.remove('active');
            }
        });
    });
    
    // Handle teacher role selection
    const teacherRoleSelect = document.getElementById('teacher-role');
    if (teacherRoleSelect) {
        teacherRoleSelect.addEventListener('change', function() {
            const subjectGroup = document.getElementById('teacher-subject-group');
            const classGroup = document.getElementById('teacher-class-group');
            
            if (this.value === 'admin') {
                // For administrative staff, hide subject and class fields
                if (subjectGroup) subjectGroup.style.display = 'none';
                if (classGroup) classGroup.style.display = 'none';
            } else {
                // For teachers, show subject and class fields
                if (subjectGroup) subjectGroup.style.display = 'block';
                if (classGroup) classGroup.style.display = 'block';
            }
        });
    }

    // Also update your form submission handler to account for the role
    const addTeacherForm = document.getElementById('add-teacher-form');
    if (addTeacherForm) {
        addTeacherForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const role = document.getElementById('teacher-role').value;
            
            // Get form data
            const teacherData = {
                id: Date.now(), // Use timestamp as ID
                name: document.getElementById('teacher-name').value,
                email: document.getElementById('teacher-email').value,
                phone: document.getElementById('teacher-phone').value,
                role: role,
                subject: role === 'teacher' ? document.getElementById('teacher-subject').value : '',
                classId: role === 'teacher' ? document.getElementById('teacher-class').value : '',
                password: document.getElementById('teacher-password').value,
                dateAdded: new Date().toISOString()
            };
            
            // Get existing teachers or initialize empty array
            const teachers = JSON.parse(localStorage.getItem('teachers')) || [];
            
            // Add new teacher
            teachers.push(teacherData);
            
            // Save to localStorage
            localStorage.setItem('teachers', JSON.stringify(teachers));
            
            // Close modal and reset form
            document.getElementById('add-teacher-modal').style.display = 'none';
            addTeacherForm.reset();
            
            // Show success message
            alert('Teacher added successfully!');
            
            // Update teacher count in dashboard
            const teacherCountElement = document.querySelector('.stat-card:nth-child(2) .stat-count');
            if (teacherCountElement) {
                teacherCountElement.textContent = teachers.length;
            }
            
            // Add to recent activities
            const activityList = document.querySelector('.activity-list');
            if (activityList) {
                const activityItem = document.createElement('div');
                activityItem.className = 'activity-item';
                activityItem.innerHTML = `
                    <div class="activity-icon">
                        <i class="fas fa-user-plus"></i>
                    </div>
                    <div class="activity-details">
                        <p>New ${role === 'admin' ? 'administrative staff' : 'teacher'} ${teacherData.name} added</p>
                        <span class="activity-time">Just now</span>
                    </div>
                `;
                activityList.insertBefore(activityItem, activityList.firstChild);
            }
        });
    }
    
    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Clear any authentication tokens/session data from localStorage
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        
        // Show logout message
        alert('You have been successfully logged out.');
        
        // Redirect to portal page instead of admin-login.html
        window.location.href = 'portal.html';
    });
});