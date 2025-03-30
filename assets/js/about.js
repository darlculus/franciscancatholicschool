document.addEventListener('DOMContentLoaded', function() {
    // Current Date Display
    updateDateDisplay();
    
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navItems = document.querySelector('.nav-items');
    
    if (hamburger) {
      hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navItems.classList.toggle('active');
      });
    }
    
    // Dropdown Menu for Mobile
    const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
    
    dropdownTriggers.forEach(trigger => {
      trigger.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          const parent = this.parentElement;
          parent.classList.toggle('active');
        }
      });
    });
    
    // Nested Dropdown for Mobile
    const nestedTriggers = document.querySelectorAll('.nested-trigger');
    
    nestedTriggers.forEach(trigger => {
      trigger.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          const parent = this.parentElement;
          parent.classList.toggle('active');
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
    
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      window.addEventListener('scroll', function() {
        if (window.pageYOffset > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      });
    }
    
    // Initialize Accordion for Ethos section
    initAccordion();
  });
  
  // Update Date Display
  function updateDateDisplay() {
    const dateElement = document.getElementById('currentDate');
    if (!dateElement) return;
    
    const now = new Date();
    const day = now.getDate();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();
    
    const dayElement = dateElement.querySelector('.day');
    const monthElement = dateElement.querySelector('.month');
    const yearElement = dateElement.querySelector('.year');
    
    if (dayElement) dayElement.textContent = day;
    if (monthElement) monthElement.textContent = month + ',';
    if (yearElement) yearElement.textContent = year;
  }
  
  // Accordion functionality for Ethos section
  function initAccordion() {
    const accordionItems = document.querySelectorAll('.ethos-item');
    
    if (accordionItems.length === 0) return;
    
    accordionItems.forEach(item => {
      const header = item.querySelector('.ethos-header');
      
      if (header) {
        header.addEventListener('click', function() {
          const isActive = item.classList.contains('active');
          
          // Close all items
          accordionItems.forEach(accItem => {
            accItem.classList.remove('active');
          });
          
          // If the clicked item wasn't active, open it
          if (!isActive) {
            item.classList.add('active');
          }
        });
      }
    });
    
    // Open the first item by default
    if (accordionItems.length > 0) {
      accordionItems[0].classList.add('active');
    }
  }
  