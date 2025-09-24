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
    
    // Initialize FAQ functionality
    initFAQs();
    
    // Contact Form Submission
    initContactForm();
    
    // Appointment Form Submission
    initAppointmentForm();
    
    // Newsletter Form Submission
    initNewsletterForm();
    
    // Success Modal
    initSuccessModal();
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
  
  // FAQ functionality
  function initFAQs() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length === 0) return;
    
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const toggle = item.querySelector('.faq-toggle');
      
      if (question) {
        question.addEventListener('click', function() {
          // Toggle active class on the FAQ item
          item.classList.toggle('active');
          
          // Update toggle icon if it exists
          if (toggle) {
            if (item.classList.contains('active')) {
              toggle.querySelector('.fa-plus').style.display = 'none';
              toggle.querySelector('.fa-minus').style.display = 'inline-block';
            } else {
              toggle.querySelector('.fa-plus').style.display = 'inline-block';
              toggle.querySelector('.fa-minus').style.display = 'none';
            }
          }
        });
      }
    });
  }
  
  // Contact Form Submission
  function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
      contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName');
        const email = document.getElementById('email');
        const subject = document.getElementById('subject');
        const message = document.getElementById('message');
        const submitBtn = contactForm.querySelector('.submit-btn');

        if (!fullName.value || !email.value || !subject.value || !message.value) {
          alert('Please fill in all required fields.');
          return;
        }

        // Disable button and show loading state
        const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = 'Sending...'; }

        try {
          const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fullName: fullName.value.trim(),
              email: email.value.trim(),
              subject: subject.value.trim(),
              message: message.value.trim()
            })
          });

          if (res.ok) {
            showSuccessModal('Message Sent Successfully!', 'Thank you for contacting us. We will get back to you as soon as possible.');
            contactForm.reset();
          } else {
            let errMsg = 'Failed to send message. Please try again later.';
            try { const data = await res.json(); if (data && data.error) errMsg = data.error; } catch (_) {}
            alert(errMsg);
          }
        } catch (err) {
          alert('Network error. Please check your connection and try again.');
        } finally {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalBtnHtml; }
        }
      });
    }
  }
  
  // Appointment Form Submission
  function initAppointmentForm() {
    const appointmentForm = document.getElementById('appointmentForm');
    
    if (appointmentForm) {
      appointmentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simple validation - check if all required fields have values
        const requiredFields = appointmentForm.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
          if (!field.value.trim()) {
            isValid = false;
          }
        });
        
        if (isValid) {
          // Show success modal
          showSuccessModal('Appointment Booked Successfully!', 'Thank you for booking an appointment. We will confirm your appointment shortly.');
          
          // Reset form
          appointmentForm.reset();
        }
      });
    }
  }
  
  // Newsletter Form Submission
  function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = document.getElementById('newsletterEmail');
        
        if (emailInput && emailInput.value.trim()) {
          // Show success modal
          showSuccessModal('Subscription Successful!', 'Thank you for subscribing to our newsletter. You will now receive updates from us.');
          
          // Reset form
          newsletterForm.reset();
        }
      });
    }
  }
  
  // Success Modal
  function initSuccessModal() {
    const modal = document.getElementById('successModal');
    const closeModal = document.querySelector('.close-modal');
    const modalBtn = document.getElementById('modalBtn');
    
    if (closeModal && modal) {
      closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
      });
    }
    
    if (modalBtn && modal) {
      modalBtn.addEventListener('click', function() {
        modal.style.display = 'none';
      });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
      if (modal && e.target === modal) {
        modal.style.display = 'none';
      }
    });
  }
  
  // Helper function to show success modal
  function showSuccessModal(title, message) {
    const modal = document.getElementById('successModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    
    if (modal && modalTitle && modalMessage) {
      modalTitle.textContent = title;
      modalMessage.textContent = message;
      modal.style.display = 'flex';
    }
  }
  
  // Fix for dropdown menus in mobile view (from dropdown-fix.js)
  document.addEventListener('DOMContentLoaded', function() {
    // Fix for dropdown menus in mobile view
    const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
    
    dropdownTriggers.forEach(function(trigger) {
      trigger.addEventListener('click', function(e) {
        // Only handle clicks in mobile view
        if (window.innerWidth <= 768) {
          e.preventDefault();
          
          // Toggle dropdown content
          const dropdownContent = this.parentElement.querySelector('.dropdown-content');
          if (dropdownContent) {
            // Close all other dropdowns first
            document.querySelectorAll('.dropdown-content.active').forEach(function(content) {
              if (content !== dropdownContent) {
                content.classList.remove('active');
              }
            });
            
            // Toggle this dropdown
            dropdownContent.classList.toggle('active');
          }
        }
      });
    });
    
    // Fix for nested dropdowns
    const nestedTriggers = document.querySelectorAll('.nested-trigger');
    
    nestedTriggers.forEach(function(trigger) {
      trigger.addEventListener('click', function(e) {
        // Only handle clicks in mobile view
        if (window.innerWidth <= 768) {
          e.preventDefault();
          e.stopPropagation(); // Prevent parent dropdown from closing
          
          // Toggle nested content
          const nestedContent = this.nextElementSibling;
          if (nestedContent) {
            nestedContent.classList.toggle('active');
          }
        }
      });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        // Check if click is outside any dropdown
        if (!e.target.closest('.dropdown')) {
          document.querySelectorAll('.dropdown-content.active, .nested-content.active').forEach(function(content) {
            content.classList.remove('active');
          });
        }
      }
    });
  });
  
  // Add CSS for contact header fallback
  document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
      .contact-header {
        background-color: #3a5a40; /* Fallback color if image is missing */
      }
    `;
    document.head.appendChild(style);
  });
  