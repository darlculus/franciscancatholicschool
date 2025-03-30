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
    
    // Hero Carousel
    initCarousel();
    
    // Testimonial Slider
    initTestimonialSlider();
    
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
  
  // Hero Carousel
  function initCarousel() {
    const slides = document.querySelectorAll('.carousel-inner .slide');
    if (slides.length === 0) return;
    
    const prevBtn = document.querySelector('.carousel-arrow.prev');
    const nextBtn = document.querySelector('.carousel-arrow.next');
    const indicators = document.querySelectorAll('.carousel-indicators .indicator');
    let currentSlide = 0;
    let slideInterval;
    
    function updateSlide() {
      // Remove active class from all slides and indicators
      slides.forEach(slide => slide.classList.remove('active'));
      if (indicators.length > 0) {
        indicators.forEach(indicator => indicator.classList.remove('active'));
      }
      
      // Add active class to current slide and indicator
      slides[currentSlide].classList.add('active');
      if (indicators.length > 0 && indicators[currentSlide]) {
        indicators[currentSlide].classList.add('active');
      }
    }
    
    function startSlideshow() {
      // Clear any existing interval
      if (slideInterval) {
        clearInterval(slideInterval);
      }
      
      // Set new interval
      slideInterval = setInterval(function() {
        currentSlide = (currentSlide === slides.length - 1) ? 0 : currentSlide + 1;
        updateSlide();
      }, 5000);
    }
    
    // Start automatic slideshow
    startSlideshow();
    
    // Previous button click
    if (prevBtn) {
      prevBtn.addEventListener('click', function() {
        clearInterval(slideInterval);
        currentSlide = (currentSlide === 0) ? slides.length - 1 : currentSlide - 1;
        updateSlide();
        startSlideshow();
      });
    }
    
    // Next button click
    if (nextBtn) {
      nextBtn.addEventListener('click', function() {
        clearInterval(slideInterval);
        currentSlide = (currentSlide === slides.length - 1) ? 0 : currentSlide + 1;
        updateSlide();
        startSlideshow();
      });
    }
    
    // Indicator clicks
    if (indicators.length > 0) {
      indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
          clearInterval(slideInterval);
          currentSlide = index;
          updateSlide();
          startSlideshow();
        });
      });
    }
  }
  
  // Testimonial Slider
  function initTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    if (testimonials.length === 0) return;
    
    const prevBtn = document.querySelector('.testimonial-arrow.prev');
    const nextBtn = document.querySelector('.testimonial-arrow.next');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    let currentTestimonial = 0;
    
    function updateTestimonial() {
      // Remove active class from all testimonials and dots
      testimonials.forEach(testimonial => testimonial.classList.remove('active'));
      if (dots.length > 0) {
        dots.forEach(dot => dot.classList.remove('active'));
      }
      
      // Add active class to current testimonial and dot
      testimonials[currentTestimonial].classList.add('active');
      if (dots.length > 0 && dots[currentTestimonial]) {
        dots[currentTestimonial].classList.add('active');
      }
    }
    
    // Previous button click
    if (prevBtn) {
      prevBtn.addEventListener('click', function() {
        currentTestimonial = (currentTestimonial === 0) ? testimonials.length - 1 : currentTestimonial - 1;
        updateTestimonial();
      });
    }
    
    // Next button click
    if (nextBtn) {
      nextBtn.addEventListener('click', function() {
        currentTestimonial = (currentTestimonial === testimonials.length - 1) ? 0 : currentTestimonial + 1;
        updateTestimonial();
      });
    }
    
    // Dot clicks
    if (dots.length > 0) {
      dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
          currentTestimonial = index;
          updateTestimonial();
        });
      });
    }
    
    // Auto rotate testimonials
    setInterval(function() {
      currentTestimonial = (currentTestimonial === testimonials.length - 1) ? 0 : currentTestimonial + 1;
      updateTestimonial();
    }, 7000);
  }
  