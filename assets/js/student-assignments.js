/**
 * Student Assignments JavaScript
 * Franciscan Catholic Nursery & Primary School
 */

// Global variables
let assignments = [];
let currentTab = 'holiday';
let assignmentStats = {
    total: 8,
    completed: 3,
    pending: 4,
    upcoming: 1
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (!currentUser) {
        window.location.href = 'portal.html';
        return;
    }
    
    if (currentUser.role !== 'student') {
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
    
    // Update student information
    const studentNameElements = document.querySelectorAll('#student-name');
    const studentGradeElements = document.querySelectorAll('#student-grade');
    
    studentNameElements.forEach(element => {
        element.textContent = currentUser.name;
    });
    
    studentGradeElements.forEach(element => {
        element.textContent = currentUser.grade;
    });
    
    // Initialize mobile sidebar
    initMobileSidebar();
    
    // Initialize tab functionality
    initTabFunctionality();
    
    // Initialize filters
    initFilters();
    
    // Initialize countdown timer
    initCountdownTimer();
    
    // Initialize search functionality
    initSearchFunctionality();
    
    // Load saved progress
    loadSavedProgress();
    
    // Initialize checklist functionality
    initChecklistFunctionality();
    
    // Update assignment statistics
    updateAssignmentStats();
    
    // Initialize logout functionality
    initLogoutFunctionality();
    
    console.log('Student assignments page initialized');
});

// Mobile sidebar functionality
function initMobileSidebar() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const dashboardSidebar = document.querySelector('.dashboard-sidebar');
    const dashboardContainer = document.querySelector('.dashboard-container');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            dashboardSidebar.classList.toggle('active');
            dashboardContainer.classList.toggle('sidebar-open');
        });
    }
    
    // Close sidebar when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideSidebar = dashboardSidebar && dashboardSidebar.contains(event.target);
        const isClickOnToggle = sidebarToggle && sidebarToggle.contains(event.target);
        
        if (!isClickInsideSidebar && !isClickOnToggle && window.innerWidth < 768 && dashboardSidebar && dashboardSidebar.classList.contains('active')) {
            dashboardSidebar.classList.remove('active');
            dashboardContainer.classList.remove('sidebar-open');
        }
    });
}

// Tab functionality
function initTabFunctionality() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Remove active class from all tabs and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding content
            const targetContent = document.getElementById(`${category}-tab`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
            
            currentTab = category;
        });
    });
}

// Filter functionality
function initFilters() {
    const filterBtn = document.getElementById('filter-btn');
    const filtersContainer = document.getElementById('assignment-filters');
    const clearFiltersBtn = document.getElementById('clear-filters');
    
    if (filterBtn) {
        filterBtn.addEventListener('click', function() {
            filtersContainer.style.display = filtersContainer.style.display === 'none' ? 'flex' : 'none';
        });
    }
    
    // Filter event listeners
    const filterSelects = document.querySelectorAll('.filter-select');
    filterSelects.forEach(select => {
        select.addEventListener('change', applyFilters);
    });
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFilters);
    }
}

// Apply filters to assignments
function applyFilters() {
    const subjectFilter = document.getElementById('subject-filter').value;
    const statusFilter = document.getElementById('status-filter').value;
    const typeFilter = document.getElementById('type-filter').value;
    
    const assignmentCards = document.querySelectorAll('.assignment-card');
    
    assignmentCards.forEach(card => {
        const cardSubject = card.dataset.subject;
        const cardStatus = card.dataset.status;
        const cardType = card.dataset.type;
        
        const subjectMatch = subjectFilter === 'all' || cardSubject === subjectFilter;
        const statusMatch = statusFilter === 'all' || cardStatus === statusFilter;
        const typeMatch = typeFilter === 'all' || cardType === typeFilter;
        
        if (subjectMatch && statusMatch && typeMatch) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Clear all filters
function clearFilters() {
    const filterSelects = document.querySelectorAll('.filter-select');
    filterSelects.forEach(select => {
        select.value = 'all';
    });
    
    const assignmentCards = document.querySelectorAll('.assignment-card');
    assignmentCards.forEach(card => {
        card.style.display = 'block';
    });
}

// Assignment action functions
function openAssignment(assignmentId) {
    showNotification(`Opening ${assignmentId} assignment...`, 'info');
    setTimeout(() => {
        showNotification('Assignment opened successfully!', 'success');
    }, 1500);
}

function startAssignment(assignmentId) {
    showNotification(`Starting ${assignmentId} assignment...`, 'info');
    setTimeout(() => {
        showNotification('Assignment started! Good luck!', 'success');
        updateAssignmentStatus(assignmentId, 'in-progress');
    }, 1500);
}

function downloadAssignment(assignmentId) {
    showNotification(`Downloading ${assignmentId}...`, 'info');
    setTimeout(() => {
        showNotification('Assignment downloaded successfully!', 'success');
    }, 1000);
}

function viewDetails(assignmentId) {
    const modal = document.getElementById('assignment-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalActionBtn = document.getElementById('modal-action-btn');
    
    if (!modal) return;
    
    modalTitle.textContent = 'Assignment Details';
    modalBody.innerHTML = getAssignmentDetails(assignmentId);
    
    modalActionBtn.textContent = 'Start Assignment';
    modalActionBtn.onclick = () => {
        startAssignment(assignmentId);
        closeModal();
    };
    
    modal.classList.add('active');
}

function viewSubmission(assignmentId) {
    const modal = document.getElementById('assignment-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalActionBtn = document.getElementById('modal-action-btn');
    
    if (!modal) return;
    
    modalTitle.textContent = 'Submission Details';
    modalBody.innerHTML = getSubmissionDetails(assignmentId);
    
    modalActionBtn.textContent = 'Close';
    modalActionBtn.onclick = closeModal;
    
    modal.classList.add('active');
}

function downloadFeedback(assignmentId) {
    showNotification('Downloading teacher feedback...', 'info');
    setTimeout(() => {
        showNotification('Feedback downloaded successfully!', 'success');
    }, 1000);
}

function saveProgress(assignmentId) {
    showNotification(`Saving progress for ${assignmentId}...`, 'info');
    setTimeout(() => {
        showNotification('Progress saved successfully!', 'success');
        saveProgressToStorage();
    }, 1000);
}

// Modal functions
function closeModal() {
    const modal = document.getElementById('assignment-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function getAssignmentDetails(assignmentId) {
    const details = {
        'math-fractions': {
            subject: 'Mathematics',
            title: 'Fractions and Decimals Practice',
            description: 'Complete exercises on converting fractions to decimals and vice versa. Practice word problems involving fractions in real-life scenarios.',
            instructions: [
                'Read Chapter 5 in your Mathematics textbook',
                'Complete exercises 1-20 on page 45',
                'Show all working steps clearly',
                'Practice converting fractions to decimals',
                'Submit your work in neat handwriting'
            ],
            resources: ['Mathematics Textbook Chapter 5', 'Calculator (optional)', 'Graph paper', 'Practice worksheets'],
            dueDate: 'January 10, 2024',
            estimatedTime: '3 hours'
        },
        'english-writing': {
            subject: 'English Language',
            title: 'Creative Writing Portfolio',
            description: 'Write three short stories based on the themes: friendship, adventure, and family. Each story should be 200-300 words with proper grammar and punctuation.',
            instructions: [
                'Choose one theme: friendship, adventure, or family',
                'Write a story of 200-300 words',
                'Include descriptive language and dialogue',
                'Check spelling and grammar carefully',
                'Submit typed or neatly handwritten'
            ],
            resources: ['Dictionary', 'Thesaurus', 'Writing guidelines handout', 'Story planning template'],
            dueDate: 'January 8, 2024',
            estimatedTime: '4 hours'
        },
        'science-plant': {
            subject: 'Basic Science',
            title: 'Plant Life Cycle Project',
            description: 'Create a detailed diagram showing the life cycle of a flowering plant. Include labels and write a short explanation for each stage.',
            instructions: [
                'Draw the complete life cycle of a flowering plant',
                'Label each stage clearly',
                'Write a 2-3 sentence explanation for each stage',
                'Use colors to make your diagram attractive',
                'Include the following stages: seed, germination, seedling, adult plant, flowering, fruit formation'
            ],
            resources: ['Science textbook Chapter 3', 'Colored pencils', 'Drawing paper', 'Plant life cycle reference sheet'],
            dueDate: 'January 12, 2024',
            estimatedTime: '2 hours'
        },
        'social-heritage': {
            subject: 'Social Studies',
            title: 'Nigerian Cultural Heritage Research',
            description: 'Research and write about three major cultural festivals in Nigeria. Include their origins, significance, and how they are celebrated today.',
            instructions: [
                'Choose 3 major Nigerian cultural festivals',
                'Research the origin of each festival',
                'Explain the significance and meaning',
                'Describe how they are celebrated today',
                'Write 150-200 words for each festival',
                'Include pictures or drawings if possible'
            ],
            resources: ['Social Studies textbook', 'Internet research', 'Library books on Nigerian culture', 'Interview family members'],
            dueDate: 'January 8, 2024',
            estimatedTime: '4 hours'
        }
    };
    
    const detail = details[assignmentId] || details['math-fractions'];
    
    return `
        <div class="assignment-detail-content">
            <div class="detail-section">
                <h4><i class="fas fa-info-circle"></i> Assignment Information</h4>
                <p><strong>Subject:</strong> ${detail.subject}</p>
                <p><strong>Title:</strong> ${detail.title}</p>
                <p><strong>Due Date:</strong> ${detail.dueDate}</p>
                <p><strong>Estimated Time:</strong> ${detail.estimatedTime}</p>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-file-alt"></i> Description</h4>
                <p>${detail.description}</p>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-tasks"></i> Instructions</h4>
                <ol>
                    ${detail.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
                </ol>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-book"></i> Required Resources</h4>
                <ul>
                    ${detail.resources.map(resource => `<li>${resource}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
}

function getSubmissionDetails(assignmentId) {
    return `
        <div class="submission-detail-content">
            <div class="submission-info">
                <h4><i class="fas fa-check-circle"></i> Submission Status</h4>
                <p><strong>Submitted:</strong> December 28, 2023</p>
                <p><strong>Status:</strong> <span class="status-completed">Completed</span></p>
                <p><strong>Grade:</strong> <span class="grade-excellent">A (95%)</span></p>
                <p><strong>Submission Time:</strong> 2:30 PM</p>
            </div>
            
            <div class="teacher-feedback">
                <h4><i class="fas fa-comment"></i> Teacher Feedback</h4>
                <div class="feedback-content">
                    <p>Excellent work! Your creative story was engaging and well-written. 
                    You demonstrated good use of descriptive language and dialogue. 
                    Your grammar and punctuation were nearly perfect. Keep up the great work!</p>
                    
                    <p><strong>Strengths:</strong> Creative plot, good character development, excellent grammar</p>
                    <p><strong>Areas for improvement:</strong> Could add more descriptive details about the setting</p>
                </div>
                <div class="feedback-score">
                    <span class="score-label">Overall Score:</span>
                    <span class="score-value">95/100</span>
                </div>
            </div>
            
            <div class="submission-files">
                <h4><i class="fas fa-file"></i> Submitted Files</h4>
                <div class="file-list">
                    <div class="file-item">
                        <i class="fas fa-file-word"></i>
                        <span>Creative_Writing_Portfolio.docx</span>
                        <button class="btn-secondary btn-sm">Download</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Reading log functionality
function openReadingLog() {
    const modal = document.getElementById('assignment-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalActionBtn = document.getElementById('modal-action-btn');
    
    if (!modal) return;
    
    modalTitle.textContent = 'Add Book Review';
    modalBody.innerHTML = `
        <div class="reading-log-form">
            <div class="form-group">
                <label for="book-title">Book Title:</label>
                <input type="text" id="book-title" placeholder="Enter book title">
            </div>
            
            <div class="form-group">
                <label for="book-author">Author:</label>
                <input type="text" id="book-author" placeholder="Enter author name">
            </div>
            
            <div class="form-group">
                <label for="reading-status">Reading Status:</label>
                <select id="reading-status">
                    <option value="completed">Completed</option>
                    <option value="in-progress">Currently Reading</option>
                    <option value="planned">Plan to Read</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="book-summary">Summary (50-100 words):</label>
                <textarea id="book-summary" rows="4" placeholder="Write a brief summary of the book"></textarea>
            </div>
            
            <div class="form-group">
                <label for="favorite-part">Favorite Part:</label>
                <textarea id="favorite-part" rows="3" placeholder="What was your favorite part and why?"></textarea>
            </div>
            
            <div class="form-group">
                <label for="book-rating">Rating:</label>
                <select id="book-rating">
                    <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                    <option value="4">⭐⭐⭐⭐ Good</option>
                    <option value="3">⭐⭐⭐ Average</option>
                    <option value="2">⭐⭐ Below Average</option>
                    <option value="1">⭐ Poor</option>
                </select>
            </div>
        </div>
    `;
    
    modalActionBtn.textContent = 'Save Review';
    modalActionBtn.onclick = () => {
        saveBookReview();
        closeModal();
    };
    
    modal.classList.add('active');
}

function saveBookReview() {
    const title = document.getElementById('book-title')?.value;
    const author = document.getElementById('book-author')?.value;
    const status = document.getElementById('reading-status')?.value;
    const summary = document.getElementById('book-summary')?.value;
    const favoritePart = document.getElementById('favorite-part')?.value;
    const rating = document.getElementById('book-rating')?.value;
    
    if (title && author && summary && favoritePart) {
        const reviews = JSON.parse(localStorage.getItem('bookReviews') || '[]');
        const review = {
            title,
            author,
            status,
            summary,
            favoritePart,
            rating,
            dateAdded: new Date().toISOString()
        };
        
        reviews.push(review);
        localStorage.setItem('bookReviews', JSON.stringify(reviews));
        
        showNotification('Book review saved successfully!', 'success');
        updateReadingProgress();
    } else {
        showNotification('Please fill in all required fields', 'warning');
    }
}

function viewReadingList() {
    const modal = document.getElementById('assignment-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalActionBtn = document.getElementById('modal-action-btn');
    
    if (!modal) return;
    
    modalTitle.textContent = 'Holiday Reading List';
    modalBody.innerHTML = `
        <div class="reading-list-content">
            <div class="reading-instructions">
                <h4><i class="fas fa-info-circle"></i> Reading Challenge Instructions</h4>
                <p>Read at least 5 books from the list below during the holiday. Write a brief summary and your favorite part for each book you complete.</p>
            </div>
            
            <div class="book-list">
                <h4><i class="fas fa-book"></i> Recommended Books</h4>
                <div class="book-grid">
                    <div class="book-card completed">
                        <div class="book-cover">📖</div>
                        <div class="book-info">
                            <h5>Charlotte's Web</h5>
                            <p>by E.B. White</p>
                            <span class="book-status completed">✅ Completed</span>
                        </div>
                    </div>
                    
                    <div class="book-card completed">
                        <div class="book-cover">📚</div>
                        <div class="book-info">
                            <h5>The Lion, the Witch and the Wardrobe</h5>
                            <p>by C.S. Lewis</p>
                            <span class="book-status completed">✅ Completed</span>
                        </div>
                    </div>
                    
                    <div class="book-card in-progress">
                        <div class="book-cover">📘</div>
                        <div class="book-info">
                            <h5>Matilda</h5>
                            <p>by Roald Dahl</p>
                            <span class="book-status in-progress">📖 Reading</span>
                        </div>
                    </div>
                    
                    <div class="book-card">
                        <div class="book-cover">📗</div>
                        <div class="book-info">
                            <h5>The Secret Garden</h5>
                            <p>by Frances Hodgson Burnett</p>
                            <span class="book-status">⏳ Not Started</span>
                        </div>
                    </div>
                    
                    <div class="book-card">
                        <div class="book-cover">📙</div>
                        <div class="book-info">
                            <h5>Bridge to Terabithia</h5>
                            <p>by Katherine Paterson</p>
                            <span class="book-status">⏳ Not Started</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modalActionBtn.textContent = 'Close';
    modalActionBtn.onclick = closeModal;
    
    modal.classList.add('active');
}

function updateReadingProgress() {
    const completedBooks = document.querySelectorAll('.book-item.completed').length;
    const totalBooks = document.querySelectorAll('.book-item').length;
    const percentage = totalBooks > 0 ? (completedBooks / totalBooks) * 100 : 0;
    
    const progressBar = document.querySelector('.reading-progress .progress-fill');
    const progressLabel = document.querySelector('.reading-progress .progress-label');
    
    if (progressBar) {
        progressBar.style.width = percentage + '%';
    }
    
    if (progressLabel) {
        progressLabel.textContent = `Books Read: ${completedBooks} of ${totalBooks}`;
    }
}

// Checklist functionality
function initChecklistFunctionality() {
    const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateChecklist);
    });
    
    // Load saved checklist progress
    loadChecklistProgress();
}

function updateChecklist() {
    const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    const totalItems = checkboxes.length;
    const checkedItems = document.querySelectorAll('.checklist-item input[type="checkbox"]:checked').length;
    const percentage = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;
    
    // Update progress bar
    const progressBar = document.querySelector('.supplies-checklist + .assignment-progress .progress-fill');
    const progressLabel = document.querySelector('.supplies-checklist + .assignment-progress .progress-label');
    
    if (progressBar) {
        progressBar.style.width = percentage + '%';
    }
    
    if (progressLabel) {
        progressLabel.textContent = `Items Acquired: ${checkedItems} of ${totalItems}`;
    }
    
    // Save progress
    saveChecklistProgress();
    
    if (checkedItems === totalItems && totalItems > 0) {
        setTimeout(() => {
            showNotification('Congratulations! You have all your school supplies ready!', 'success');
        }, 500);
    }
}

function saveChecklistProgress() {
    const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    const progress = {};
    
    checkboxes.forEach((checkbox, index) => {
        progress[`item_${index}`] = checkbox.checked;
    });
    
    localStorage.setItem('checklistProgress', JSON.stringify(progress));
}

function loadChecklistProgress() {
    const savedProgress = localStorage.getItem('checklistProgress');
    if (savedProgress) {
        try {
            const progress = JSON.parse(savedProgress);
            const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
            
            checkboxes.forEach((checkbox, index) => {
                if (progress[`item_${index}`] !== undefined) {
                    checkbox.checked = progress[`item_${index}`];
                }
            });
            
            updateChecklist();
        } catch (error) {
            console.error('Error loading checklist progress:', error);
        }
    }
}

function downloadSuppliesList() {
    showNotification('Downloading school supplies list...', 'info');
    setTimeout(() => {
        showNotification('School supplies list downloaded successfully!', 'success');
    }, 1000);
}

// Review functionality
function startReview() {
    const modal = document.getElementById('assignment-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalActionBtn = document.getElementById('modal-action-btn');
    
    if (!modal) return;
    
    modalTitle.textContent = 'Previous Term Review';
    modalBody.innerHTML = `
        <div class="review-content">
            <div class="review-intro">
                <h4><i class="fas fa-brain"></i> Review Instructions</h4>
                <p>Review key concepts from the previous term to prepare for the new session. Complete practice exercises in each subject area.</p>
            </div>
            
            <div class="review-subjects">
                <div class="subject-review-card" onclick="startSubjectReview('mathematics')">
                    <div class="subject-icon">
                        <i class="fas fa-calculator"></i>
                    </div>
                    <div class="subject-info">
                        <h5>Mathematics Review</h5>
                        <p>Fractions, decimals, and basic geometry</p>
                        <span class="review-status">Click to start</span>
                    </div>
                </div>
                
                <div class="subject-review-card" onclick="startSubjectReview('english')">
                    <div class="subject-icon">
                        <i class="fas fa-pen-fancy"></i>
                    </div>
                    <div class="subject-info">
                        <h5>English Review</h5>
                        <p>Grammar, vocabulary, and reading comprehension</p>
                        <span class="review-status">Click to start</span>
                    </div>
                </div>
                
                <div class="subject-review-card" onclick="startSubjectReview('science')">
                    <div class="subject-icon">
                        <i class="fas fa-flask"></i>
                    </div>
                    <div class="subject-info">
                        <h5>Science Review</h5>
                        <p>Plants, animals, and basic experiments</p>
                        <span class="review-status">Click to start</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modalActionBtn.textContent = 'Close';
    modalActionBtn.onclick = closeModal;
    
    modal.classList.add('active');
}

function startSubjectReview(subject) {
    closeModal();
    showNotification(`Starting ${subject} review...`, 'info');
    setTimeout(() => {
        showNotification(`${subject.charAt(0).toUpperCase() + subject.slice(1)} review materials loaded!`, 'success');
    }, 1500);
}

function viewReviewMaterials() {
    showNotification('Loading review materials...', 'info');
    setTimeout(() => {
        showNotification('Review materials are available in your textbooks and online resources.', 'info');
    }, 1000);
}

// Reminder functionality
function setReminder(assignmentId) {
    const modal = document.getElementById('assignment-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalActionBtn = document.getElementById('modal-action-btn');
    
    if (!modal) return;
    
    modalTitle.textContent = 'Set Assignment Reminder';
    modalBody.innerHTML = `
        <div class="reminder-content">
            <div class="reminder-form">
                <h4><i class="fas fa-bell"></i> Reminder Settings</h4>
                <p>Set a reminder for when this assignment becomes available.</p>
                
                <div class="form-group">
                    <label for="reminder-date">Reminder Date:</label>
                    <input type="date" id="reminder-date" value="2024-01-14">
                </div>
                
                <div class="form-group">
                    <label for="reminder-time">Reminder Time:</label>
                    <input type="time" id="reminder-time" value="09:00">
                </div>
                
                <div class="form-group">
                    <label for="reminder-method">Notification Method:</label>
                    <select id="reminder-method">
                        <option value="browser">Browser Notification</option>
                        <option value="email">Email Reminder</option>
                        <option value="both">Both</option>
                    </select>
                </div>
                
                <div class="reminder-preview">
                    <h5>Reminder Preview:</h5>
                    <p>You will be reminded about "<strong>${assignmentId}</strong>" on the selected date and time.</p>
                </div>
            </div>
        </div>
    `;
    
    modalActionBtn.textContent = 'Set Reminder';
    modalActionBtn.onclick = () => {
        saveReminder(assignmentId);
        closeModal();
    };
    
    modal.classList.add('active');
}

function saveReminder(assignmentId) {
    const reminderDate = document.getElementById('reminder-date')?.value;
    const reminderTime = document.getElementById('reminder-time')?.value;
    const reminderMethod = document.getElementById('reminder-method')?.value;
    
    if (reminderDate && reminderTime) {
        const reminders = JSON.parse(localStorage.getItem('assignmentReminders') || '[]');
        const reminder = {
            assignmentId,
            date: reminderDate,
            time: reminderTime,
            method: reminderMethod,
            created: new Date().toISOString()
        };
        
        reminders.push(reminder);
        localStorage.setItem('assignmentReminders', JSON.stringify(reminders));
        
        showNotification('Reminder set successfully!', 'success');
    } else {
        showNotification('Please select both date and time for the reminder', 'warning');
    }
}

// Download functionality
function downloadAll() {
    showNotification('Preparing download package...', 'info');
    setTimeout(() => {
        showNotification('All assignments downloaded successfully!', 'success');
    }, 2000);
}

// Assignment status update
function updateAssignmentStatus(assignmentId, newStatus) {
    const assignmentCard = document.querySelector(`[onclick*="${assignmentId}"]`)?.closest('.assignment-card');
    if (assignmentCard) {
        const statusElement = assignmentCard.querySelector('.assignment-status');
        if (statusElement) {
            statusElement.className = `assignment-status ${newStatus}`;
            statusElement.innerHTML = `<i class="fas fa-${getStatusIcon(newStatus)}"></i> ${getStatusText(newStatus)}`;
        }
        
        assignmentCard.dataset.status = newStatus;
        updateAssignmentStats();
    }
}

function getStatusIcon(status) {
    const icons = {
        'completed': 'check-circle',
        'in-progress': 'clock',
        'not-started': 'exclamation-circle',
        'upcoming': 'calendar-plus'
    };
    return icons[status] || 'clock';
}

function getStatusText(status) {
    const texts = {
        'completed': 'Completed',
        'in-progress': 'In Progress',
        'not-started': 'Not Started',
        'upcoming': 'Upcoming'
    };
    return texts[status] || 'In Progress';
}

// Update assignment statistics
function updateAssignmentStats() {
    const assignmentCards = document.querySelectorAll('.assignment-card');
    const stats = {
        total: assignmentCards.length,
        completed: 0,
        pending: 0,
        upcoming: 0
    };
    
    assignmentCards.forEach(card => {
        const status = card.dataset.status;
        if (status === 'completed') {
            stats.completed++;
        } else if (status === 'in-progress' || status === 'not-started') {
            stats.pending++;
        } else if (status === 'upcoming') {
            stats.upcoming++;
        }
    });
    
    // Update stat cards
    const totalElement = document.getElementById('total-assignments');
    const completedElement = document.getElementById('completed-assignments');
    const pendingElement = document.getElementById('pending-assignments');
    const upcomingElement = document.getElementById('upcoming-assignments');
    
    if (totalElement) totalElement.textContent = stats.total;
    if (completedElement) completedElement.textContent = stats.completed;
    if (pendingElement) pendingElement.textContent = stats.pending;
    if (upcomingElement) upcomingElement.textContent = stats.upcoming;
    
    // Update holiday progress
    const holidayProgress = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
    const holidayProgressElement = document.getElementById('holiday-progress');
    const progressText = document.querySelector('.banner-progress .progress-text');
    
    if (holidayProgressElement) {
        holidayProgressElement.style.width = holidayProgress + '%';
    }
    
    if (progressText) {
        progressText.textContent = `${holidayProgress}% Complete`;
    }
}

// Save and load progress
function saveProgressToStorage() {
    const progress = {
        assignmentStats,
        checklistProgress: getChecklistProgress(),
        readingProgress: getReadingProgress(),
        lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('studentProgress', JSON.stringify(progress));
}

function loadSavedProgress() {
    const savedProgress = localStorage.getItem('studentProgress');
    if (savedProgress) {
        try {
            const progress = JSON.parse(savedProgress);
            if (progress.assignmentStats) {
                assignmentStats = progress.assignmentStats;
            }
            console.log('Progress loaded successfully');
        } catch (error) {
            console.error('Error loading saved progress:', error);
        }
    }
}

function getChecklistProgress() {
    const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    const progress = {};
    
    checkboxes.forEach((checkbox, index) => {
        progress[`item_${index}`] = checkbox.checked;
    });
    
    return progress;
}

function getReadingProgress() {
    const completedBooks = document.querySelectorAll('.book-item.completed').length;
    const totalBooks = document.querySelectorAll('.book-item').length;
    
    return {
        completed: completedBooks,
        total: totalBooks,
        percentage: totalBooks > 0 ? (completedBooks / totalBooks) * 100 : 0
    };
}

// Countdown timer functionality
function initCountdownTimer() {
    const resumptionDate = new Date('2024-01-15T08:00:00');
    
    function updateCountdown() {
        const now = new Date();
        const timeDiff = resumptionDate - now;
        
        if (timeDiff > 0) {
            const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            
            const daysElement = document.getElementById('days');
            const hoursElement = document.getElementById('hours');
            const minutesElement = document.getElementById('minutes');
            const daysRemainingElement = document.getElementById('days-remaining');
            
            if (daysElement) daysElement.textContent = days;
            if (hoursElement) hoursElement.textContent = hours;
            if (minutesElement) minutesElement.textContent = minutes;
            if (daysRemainingElement) daysRemainingElement.textContent = days;
            
        } else {
            const countdownElements = document.querySelectorAll('#days, #hours, #minutes');
            countdownElements.forEach(el => {
                if (el) el.textContent = '0';
            });
            
            const daysRemainingElement = document.getElementById('days-remaining');
            if (daysRemainingElement) {
                daysRemainingElement.textContent = '0';
                daysRemainingElement.parentElement.innerHTML = 'School has resumed! Welcome back!';
            }
        }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 60000);
}

// Search functionality
function initSearchFunctionality() {
    const searchInput = document.getElementById('assignment-search');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            const assignmentCards = document.querySelectorAll('.assignment-card');
            let visibleCount = 0;
            
            assignmentCards.forEach(card => {
                const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
                const description = card.querySelector('.assignment-description')?.textContent.toLowerCase() || '';
                const subject = card.dataset.subject || '';
                
                const isMatch = title.includes(searchTerm) || 
                               description.includes(searchTerm) || 
                               subject.includes(searchTerm);
                
                if (searchTerm === '' || isMatch) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.3s ease';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });
            
            showNoResultsMessage(visibleCount === 0 && searchTerm !== '');
        });
    }
}

function showNoResultsMessage(show) {
    let noResultsMsg = document.querySelector('.no-results-message');
    
    if (show && !noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.className = 'no-results-message';
        noResultsMsg.innerHTML = `
            <div class="no-results-content">
                <i class="fas fa-search"></i>
                <h3>No assignments found</h3>
                <p>Try adjusting your search terms or filters</p>
            </div>
        `;
        
        const assignmentContent = document.querySelector('.assignment-content');
        if (assignmentContent) {
            assignmentContent.appendChild(noResultsMsg);
        }
    } else if (!show && noResultsMsg) {
        noResultsMsg.remove();
    }
}

// Logout functionality
function initLogoutFunctionality() {
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('currentUser');
                sessionStorage.removeItem('currentUser');
                window.location.href = 'portal.html';
            }
        });
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    if (!document.getElementById('notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 15px;
                right: 20px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
                padding: 16px 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-width: 320px;
                max-width: 420px;
                z-index: 1001;
                animation: slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            @keyframes slideInRight {
                from { 
                    transform: translateX(100%) scale(0.8); 
                    opacity: 0; 
                }
                to { 
                    transform: translateX(0) scale(1); 
                    opacity: 1; 
                }
            }
            
            @keyframes slideOutRight {
                from { transform: translateX(0) scale(1); opacity: 1; }
                to { transform: translateX(100%) scale(0.8); opacity: 0; }
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
                flex: 1;
            }
            
            .notification-info { 
                background: linear-gradient(135deg, rgba(33, 150, 243, 0.1), rgba(33, 150, 243, 0.05));
                border-left: 4px solid #2196f3; 
                color: #1976d2;
            }
            .notification-success { 
                background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.05));
                border-left: 4px solid #4caf50; 
                color: #388e3c;
            }
            .notification-warning { 
                background: linear-gradient(135deg, rgba(255, 152, 0, 0.1), rgba(255, 152, 0, 0.05));
                border-left: 4px solid #ff9800; 
                color: #f57c00;
            }
            .notification-error { 
                background: linear-gradient(135deg, rgba(244, 67, 54, 0.1), rgba(244, 67, 54, 0.05));
                border-left: 4px solid #f44336; 
                color: #d32f2f;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: #999;
                margin-left: 15px;
                padding: 5px;
                border-radius: 50%;
                transition: all 0.2s ease;
            }
            
            .notification-close:hover {
                background: rgba(0, 0, 0, 0.1);
                color: #666;
            }
            
            .no-results-message {
                text-align: center;
                padding: 60px 20px;
                color: var(--dark-gray);
            }
            
            .no-results-content i {
                font-size: 3rem;
                margin-bottom: 20px;
                opacity: 0.5;
            }
            
            .no-results-content h3 {
                margin: 0 0 10px;
                font-size: 1.5rem;
            }
            
            .no-results-content p {
                margin: 0;
                opacity: 0.7;
            }
            
            .detail-section {
                margin-bottom: 25px;
                padding-bottom: 20px;
                border-bottom: 1px solid var(--medium-gray);
            }
            
            .detail-section:last-child {
                border-bottom: none;
            }
            
            .detail-section h4 {
                color: var(--primary);
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .book-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin
            }
            
            .book-card {
                border: 1px solid var(--medium-gray);
                border-radius: 8px;
                padding: 15px;
                text-align: center;
                transition: all 0.3s ease;
            }
            
            .book-card:hover {
                transform: translateY(-3px);
                box-shadow: var(--shadow);
            }
            
            .book-cover {
                font-size: 2rem;
                margin-bottom: 10px;
            }
            
            .book-info h5 {
                margin: 0 0 5px;
                font-size: 1rem;
                color: var(--text-dark);
            }
            
            .book-info p {
                margin: 0 0 10px;
                font-size: 0.85rem;
                color: var(--dark-gray);
            }
            
            .book-status {
                display: inline-block;
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 0.75rem;
                font-weight: 500;
            }
            
            .book-status.completed {
                background: rgba(76, 175, 80, 0.1);
                color: #4caf50;
            }
            
            .book-status.in-progress {
                background: rgba(255, 152, 0, 0.1);
                color: #ff9800;
            }
            
            .subject-review-card {
                border: 1px solid var(--medium-gray);
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 15px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 15px;
            }
            
            .subject-review-card:hover {
                background: rgba(20, 22, 63, 0.05);
                border-color: var(--primary);
            }
            
            .subject-icon {
                width: 50px;
                height: 50px;
                background: var(--primary);
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
            }
            
            .subject-info h5 {
                margin: 0 0 5px;
                color: var(--text-dark);
            }
            
            .subject-info p {
                margin: 0 0 8px;
                color: var(--dark-gray);
                font-size: 0.9rem;
            }
            
            .review-status {
                font-size: 0.8rem;
                color: var(--primary);
                font-weight: 500;
            }
            
            .modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1000;
            }
            
            .modal.active {
                display: flex;
            }
            
            .modal-overlay {
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            
            .modal-content {
                background: white;
                border-radius: 10px;
                max-width: 600px;
                width: 100%;
                max-height: 80vh;
                overflow-y: auto;
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid #eee;
            }
            
            .modal-header h3 {
                margin: 0;
                color: var(--primary);
            }
            
            .close-modal {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #999;
            }
            
            .modal-body {
                padding: 20px;
            }
            
            .modal-footer {
                padding: 20px;
                border-top: 1px solid #eee;
                display: flex;
                justify-content: flex-end;
                gap: 10px;
            }
            
            .form-group {
                margin-bottom: 15px;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: 500;
                color: var(--text-dark);
            }
            
            .form-group input,
            .form-group select,
            .form-group textarea {
                width: 100%;
                padding: 8px 12px;
                border: 1px solid var(--medium-gray);
                border-radius: 5px;
                font-size: 0.9rem;
                font-family: inherit;
            }
            
            .form-group input:focus,
            .form-group select:focus,
            .form-group textarea:focus {
                outline: none;
                border-color: var(--primary);
                box-shadow: 0 0 0 3px rgba(20, 22, 63, 0.1);
            }
            
            .btn-sm {
                padding: 5px 10px;
                font-size: 0.8rem;
            }
            
            .btn-success {
                background-color: #4caf50;
                color: white;
                border: none;
                padding: 10px 15px;
                border-radius: 5px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .btn-success:hover {
                background-color: #45a049;
            }
            
            .status-completed {
                color: #4caf50;
                font-weight: 600;
            }
            
            .grade-excellent {
                color: #4caf50;
                font-weight: 600;
            }
            
            .feedback-content {
                background: rgba(20, 22, 63, 0.05);
                padding: 15px;
                border-radius: 8px;
                margin: 10px 0;
            }
            
            .feedback-score {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 15px;
                padding-top: 15px;
                border-top: 1px solid var(--medium-gray);
            }
            
            .score-value {
                font-size: 1.2rem;
                font-weight: 700;
                color: var(--primary);
            }
            
            .file-list {
                margin-top: 10px;
            }
            
            .file-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px;
                border: 1px solid var(--medium-gray);
                border-radius: 5px;
                margin-bottom: 5px;
            }
            
            .file-item i {
                color: var(--primary);
                font-size: 1.2rem;
            }
            
            .file-item span {
                flex: 1;
                font-size: 0.9rem;
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    });
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        'info': 'info-circle',
        'success': 'check-circle',
        'warning': 'exclamation-triangle',
        'error': 'times-circle'
    };
    return icons[type] || 'info-circle';
}

// Event listeners for download button
document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.getElementById('download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadAll);
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('assignment-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }
    
    // Initialize notification bell
    const notificationBell = document.querySelector('.notification-bell');
    if (notificationBell) {
        notificationBell.addEventListener('click', function() {
            showNotification('You have 3 new notifications!', 'info');
        });
    }
});

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function calculateDaysUntil(dateString) {
    const targetDate = new Date(dateString);
    const today = new Date();
    const timeDiff = targetDate - today;
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
}

function getProgressColor(percentage) {
    if (percentage >= 80) return '#4caf50';
    if (percentage >= 60) return '#2196f3';
    if (percentage >= 40) return '#ff9800';
    return '#f44336';
}

// Auto-save functionality
setInterval(() => {
    saveProgressToStorage();
}, 30000); // Save every 30 seconds

// Check for reminders
function checkReminders() {
    const reminders = JSON.parse(localStorage.getItem('assignmentReminders') || '[]');
    const now = new Date();
    
    reminders.forEach((reminder, index) => {
        const reminderDateTime = new Date(`${reminder.date}T${reminder.time}`);
        const timeDiff = reminderDateTime - now;
        
        // Show reminder if it's within 5 minutes
        if (timeDiff > 0 && timeDiff <= 300000) {
            showNotification(`Reminder: ${reminder.assignmentId} assignment is available!`, 'info');
            
            // Remove the reminder after showing
            reminders.splice(index, 1);
            localStorage.setItem('assignmentReminders', JSON.stringify(reminders));
        }
    });
}

// Check reminders every minute
setInterval(checkReminders, 60000);

// Initialize reminder check on load
checkReminders();

console.log('Student assignments JavaScript loaded successfully');