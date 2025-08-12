// Animations functionality

// Enhanced Scroll-triggered animations with IntersectionObserver
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Optional: unobserve after animation to improve performance
      // observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Utility function to add animation classes to elements
function addAnimationClass(selector, animationClass = 'fade-in') {
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
    // Skip testimonial pages as they have their own visibility logic
    if (el.classList.contains('testimonial-page')) {
      return;
    }
    el.classList.add(animationClass);
  });
  return elements.length;
}

// Utility function to observe elements for animations
function observeElements(selectors, animationClass = 'fade-in') {
  let totalObserved = 0;
  
  selectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      // Skip testimonial pages as they have their own visibility logic
      if (el.classList.contains('testimonial-page')) {
        return;
      }
      
      // Ensure elements start invisible
      el.classList.add('opacity-0');
      el.classList.add(animationClass);
      observer.observe(el);
      totalObserved++;
    });
  });
  
  return totalObserved;
}

// Observe all animation elements
function initObservers() {
  const animationSelectors = [
    '.fade-in',
    '.fade-in-left', 
    '.fade-in-right', 
    '.fade-in-scale', 
    '.about-fade-in', 
    '.portfolio-fade-in', 
    '.contact-fade-in', 
    '.services-fade-in'
  ];
  
  const totalObserved = observeElements(animationSelectors);
  
  if (window.__DEBUG__) {
    console.log(`Observing ${totalObserved} animation elements`);
  }
}

// Add animation classes to elements using utility functions
function initAnimationClasses() {
  const animationConfig = [
    { selector: '.portfolio-card', class: 'fade-in' },
    { selector: '.about-heading, .about-subheading, .about-text, .about-list, .about-image, .about-quote, .about-tagline, .about-story', class: 'fade-in' },
    { selector: '.contact-form, .contact-info', class: 'fade-in' },
    { selector: 'h2:not(.testimonials-heading)', class: 'fade-in' },
    { selector: '.portfolio-grid-3x3', class: 'fade-in' },
    { selector: '.service-card', class: 'fade-in' },
    { selector: '.services-heading, .services-subtitle', class: 'fade-in' }
  ];
  
  let totalElements = 0;
  
  animationConfig.forEach(config => {
    const count = addAnimationClass(config.selector, config.class);
    totalElements += count;
  });
  
  if (window.__DEBUG__) {
    console.log(`Added animation classes to ${totalElements} elements`);
  }
}
