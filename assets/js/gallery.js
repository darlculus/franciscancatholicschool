document.addEventListener('DOMContentLoaded', function() {
    // ===== COMMON FUNCTIONALITY FROM FRANCISCAN.JS =====
    
    // Current date display in navbar
    const currentDateElement = document.getElementById('currentDate');
    if (currentDateElement) {
        const now = new Date();
        const dayElement = currentDateElement.querySelector('.day');
        const monthElement = currentDateElement.querySelector('.month');
        const yearElement = currentDateElement.querySelector('.year');
        
        if (dayElement) dayElement.textContent = now.getDate();
        if (monthElement) {
            const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
            monthElement.textContent = monthNames[now.getMonth()];
        }
        if (yearElement) yearElement.textContent = now.getFullYear();
    }
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navItems = document.querySelector('.nav-items');
    
    if (hamburger && navItems) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navItems.classList.toggle('active');
        });
    }
    
    // Dropdown menus
    const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
    
    dropdownTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            // Only prevent default on mobile to allow navigation on desktop
            if (window.innerWidth < 992) {
                e.preventDefault();
                this.parentElement.classList.toggle('active');
            }
        });
    });
    
    // Nested dropdown menus
    const nestedTriggers = document.querySelectorAll('.nested-trigger');
    
    nestedTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            // Only prevent default on mobile
            if (window.innerWidth < 992) {
                e.preventDefault();
                this.parentElement.classList.toggle('active');
            }
        });
    });
    
    // Scroll to Top Button
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (scrollToTopBtn) {
      window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
          scrollToTopBtn.classList.add('active');
        } else {
          scrollToTopBtn.classList.remove('active');
        }
      });
      
      scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
    
    // ===== GALLERY-SPECIFIC FUNCTIONALITY =====
    
    // Gallery tab switching
    const galleryTabs = document.querySelectorAll('.gallery-tab');
    const gallerySections = document.querySelectorAll('.gallery-section');
    
    galleryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and sections
            galleryTabs.forEach(t => t.classList.remove('active'));
            gallerySections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding section
            const targetSection = document.getElementById(this.dataset.target);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
    
    // Gallery filtering
    const filterCategory = document.getElementById('filter-category');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (filterCategory) {
        filterCategory.addEventListener('change', function() {
            const selectedCategory = this.value;
            
            galleryItems.forEach(item => {
                if (selectedCategory === 'all' || item.dataset.category === selectedCategory) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
    
    // Past events filtering
    const pastEventsYear = document.getElementById('past-events-year');
    const pastEventsCategory = document.getElementById('past-events-category');
    const pastEventCards = document.querySelectorAll('.past-event-card');
    
    function filterPastEvents() {
        const selectedYear = pastEventsYear ? pastEventsYear.value : 'all';
        const selectedCategory = pastEventsCategory ? pastEventsCategory.value : 'all';
        
        pastEventCards.forEach(card => {
            const yearMatch = selectedYear === 'all' || card.dataset.year === selectedYear;
            const categoryMatch = selectedCategory === 'all' || card.dataset.category === selectedCategory;
            
            if (yearMatch && categoryMatch) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    if (pastEventsYear) {
        pastEventsYear.addEventListener('change', filterPastEvents);
    }
    
    if (pastEventsCategory) {
        pastEventsCategory.addEventListener('change', filterPastEvents);
    }
    
    // Pagination functionality
    function setupPagination(itemsSelector, paginationSelector, itemsPerPage = 6) {
        const items = document.querySelectorAll(itemsSelector);
        const pagination = document.querySelector(paginationSelector);
        
        if (!items.length || !pagination) return;
        
        const pageCount = Math.ceil(items.length / itemsPerPage);
        let currentPage = 1;
        
        // Initial setup
        updatePageDisplay();
        
        // Previous button
        const prevButton = pagination.querySelector('.pagination-prev');
        if (prevButton) {
            prevButton.addEventListener('click', function() {
                if (currentPage > 1) {
                    currentPage--;
                    updatePageDisplay();
                }
            });
        }
        
        // Next button
        const nextButton = pagination.querySelector('.pagination-next');
        if (nextButton) {
            nextButton.addEventListener('click', function() {
                if (currentPage < pageCount) {
                    currentPage++;
                    updatePageDisplay();
                }
            });
        }
        
        // Page number clicks
        const pageNumbers = pagination.querySelectorAll('.pagination-number');
        pageNumbers.forEach(number => {
            number.addEventListener('click', function() {
                const pageNum = parseInt(this.textContent);
                if (!isNaN(pageNum)) {
                    currentPage = pageNum;
                    updatePageDisplay();
                }
            });
        });
        
        function updatePageDisplay() {
            // Update visible items
            items.forEach((item, index) => {
                const startIndex = (currentPage - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage - 1;
                
                if (index >= startIndex && index <= endIndex) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Update active page number
            pageNumbers.forEach(number => {
                const pageNum = parseInt(number.textContent);
                if (pageNum === currentPage) {
                    number.classList.add('active');
                } else {
                    number.classList.remove('active');
                }
            });
            
            // Update button states
            if (prevButton) {
                prevButton.disabled = currentPage === 1;
            }
            
            if (nextButton) {
                nextButton.disabled = currentPage === pageCount;
            }
        }
    }
    
    // Set up pagination for different sections
    setupPagination('.gallery-grid .gallery-item', '.gallery-pagination');
    setupPagination('.past-events-grid .past-event-card', '.past-events-pagination');
    
    // Gallery modal functionality
    const galleryModal = document.getElementById('galleryModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalDate = document.getElementById('modalDate');
    const modalClose = document.querySelector('.modal-close');
    const modalPrev = document.querySelector('.modal-prev');
    const modalNext = document.querySelector('.modal-next');
    
    let currentImageIndex = 0;
    let galleryImages = [];
    
    // Open modal when clicking on gallery zoom buttons
    const galleryZoomButtons = document.querySelectorAll('.gallery-zoom');
    galleryZoomButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            // Get all currently visible gallery items
            galleryImages = Array.from(document.querySelectorAll('.gallery-item')).filter(
                item => item.style.display !== 'none'
            );
            
            // Find the index of the clicked image
            const galleryItem = this.closest('.gallery-item');
            currentImageIndex = galleryImages.indexOf(galleryItem);
            
            // Update modal with image details
            updateModalContent();
            
            // Show modal
            if (galleryModal) {
                galleryModal.style.display = 'flex';
            }
        });
    });
    
    // Close modal
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            galleryModal.style.display = 'none';
        });
    }
    
    // Click outside to close
    window.addEventListener('click', function(event) {
        if (galleryModal && event.target === galleryModal) {
            galleryModal.style.display = 'none';
        }
    });
    
    // Previous image
    if (modalPrev) {
        modalPrev.addEventListener('click', function() {
            if (currentImageIndex > 0) {
                currentImageIndex--;
                updateModalContent();
            }
        });
    }
    
    // Next image
    if (modalNext) {
        modalNext.addEventListener('click', function() {
            if (currentImageIndex < galleryImages.length - 1) {
                currentImageIndex++;
                updateModalContent();
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(event) {
        if (galleryModal && galleryModal.style.display === 'flex') {
            if (event.key === 'ArrowLeft' && currentImageIndex > 0) {
                currentImageIndex--;
                updateModalContent();
            } else if (event.key === 'ArrowRight' && currentImageIndex < galleryImages.length - 1) {
                currentImageIndex++;
                updateModalContent();
            } else if (event.key === 'Escape') {
                galleryModal.style.display = 'none';
            }
        }
    });
    
    function updateModalContent() {
        if (galleryImages.length === 0 || currentImageIndex < 0 || currentImageIndex >= galleryImages.length) {
            return;
        }
        
        const currentItem = galleryImages[currentImageIndex];
        const img = currentItem.querySelector('img');
        const info = currentItem.querySelector('.gallery-info');
        
        if (modalImage && img) {
            modalImage.src = img.src;
            modalImage.alt = img.alt;
        }
        
        if (info) {
            if (modalTitle) {
                const titleElement = info.querySelector('h3');
                if (titleElement) {
                    modalTitle.textContent = titleElement.textContent;
                }
            }
            
            if (modalDescription) {
                const descElement = info.querySelector('p');
                if (descElement) {
                    modalDescription.textContent = descElement.textContent;
                }
            }
            
            if (modalDate) {
                const dateElement = info.querySelector('.gallery-date');
                if (dateElement) {
                    modalDate.textContent = dateElement.textContent;
                }
            }
        }
        
        // Update navigation buttons
        if (modalPrev) {
            modalPrev.style.visibility = currentImageIndex > 0 ? 'visible' : 'hidden';
        }
        
        if (modalNext) {
            modalNext.style.visibility = currentImageIndex < galleryImages.length - 1 ? 'visible' : 'hidden';
        }
    }
    
    // Calendar functionality
    function generateCalendar() {
        const calendarDates = document.querySelector('.calendar-dates');
        if (!calendarDates) return;
        
        // Clear existing dates
        calendarDates.innerHTML = '';
        
        // Get current date
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        // Get first day of month and total days
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        // Add empty cells for days before first of month
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-date empty';
            calendarDates.appendChild(emptyCell);
        }
        
        // Add days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            const dateCell = document.createElement('div');
            dateCell.className = 'calendar-date';
            dateCell.textContent = i;
            
            // Mark current day
            if (i === now.getDate()) {
                dateCell.classList.add('today');
            }
            
            // Add sample events (in a real app, these would come from a database)
            if (i === 15) {
                dateCell.classList.add('has-event');
                dateCell.classList.add('academic');
                
                const eventIndicator = document.createElement('span');
                eventIndicator.className = 'event-indicator';
                dateCell.appendChild(eventIndicator);
                
                // Add tooltip
                dateCell.setAttribute('data-tooltip', 'Annual Science Fair');
            } else if (i === 22) {
                dateCell.classList.add('has-event');
                dateCell.classList.add('sports');
                
                const eventIndicator = document.createElement('span');
                eventIndicator.className = 'event-indicator';
                dateCell.appendChild(eventIndicator);
                
                // Add tooltip
                dateCell.setAttribute('data-tooltip', 'Sports Day 2025');
            }
            
            calendarDates.appendChild(dateCell);
        }
        
        // Update calendar month display
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];
        const calendarMonth = document.querySelector('.calendar-month');
        if (calendarMonth) {
            calendarMonth.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        }
    }
    
    generateCalendar();
    
    // Calendar navigation
    const calendarPrev = document.querySelector('.calendar-prev');
    const calendarNext = document.querySelector('.calendar-next');
    
    let currentCalendarMonth = new Date().getMonth();
    let currentCalendarYear = new Date().getFullYear();
    
    if (calendarPrev) {
        calendarPrev.addEventListener('click', function() {
            currentCalendarMonth--;
            if (currentCalendarMonth < 0) {
                currentCalendarMonth = 11;
                currentCalendarYear--;
            }
            updateCalendar();
        });
    }
    
    if (calendarNext) {
        calendarNext.addEventListener('click', function() {
            currentCalendarMonth++;
            if (currentCalendarMonth > 11) {
                currentCalendarMonth = 0;
                currentCalendarYear++;
            }
            updateCalendar();
        });
    }
    
    function updateCalendar() {
        // Update calendar month display
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];
        const calendarMonth = document.querySelector('.calendar-month');
        if (calendarMonth) {
            calendarMonth.textContent = `${monthNames[currentCalendarMonth]} ${currentCalendarYear}`;
        }
        
        // Regenerate calendar with new month/year
        generateCalendar();
    }
});