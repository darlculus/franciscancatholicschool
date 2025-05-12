document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin dashboard script loaded');
    
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
    
    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Clear any authentication tokens/session data from localStorage
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        
        // Show logout message
        alert('You have been successfully logged out.');
        
        // Redirect to login page
        window.location.href = 'admin-login.html';
    });
});