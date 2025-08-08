// Modal functionality
function openModal(title,text){
  document.getElementById('modalTitle').innerText=title;
  document.getElementById('modalText').innerText=text;
  document.getElementById('modal').style.display='flex';
}
function closeModal(){
  document.getElementById('modal').style.display='none';
}
window.onclick=e=>{if(e.target.id==='modal')closeModal();};

// Animated Active Nav Link on Scroll
const navLinks=document.querySelectorAll('nav a');
const sections=Array.from(navLinks).map(link=>{
  const id=link.getAttribute('href').replace('#','');
  return document.getElementById(id);
});
function onScroll(){
  let scrollPos=window.scrollY+120;
  let activeIndex=0;
  sections.forEach((section,i)=>{
    if(section&&section.offsetTop<=scrollPos){
      activeIndex=i;
    }
  });
  navLinks.forEach((link,i)=>{
    if(i===activeIndex){
      link.classList.add('active');
    }else{
      link.classList.remove('active');
    }
  });
}
window.addEventListener('scroll',onScroll);
window.addEventListener('DOMContentLoaded',onScroll);



// Scroll to Top functionality
const scrollToTopBtn=document.getElementById('scrollToTop');

// Show/hide scroll to top button based on scroll position
window.addEventListener('scroll',()=>{
  if(window.pageYOffset>300){
    scrollToTopBtn.classList.add('show');
  }else{
    scrollToTopBtn.classList.remove('show');
  }
});

// Smooth scroll to top when button is clicked
scrollToTopBtn.addEventListener('click',()=>{
  window.scrollTo({
    top:0,
    behavior:'smooth'
  });
});

// Contact Form Handling
const contactForm=document.getElementById('contactForm');
const submitBtn=document.getElementById('submitBtn');
const btnText=submitBtn.querySelector('.btn-text');
const btnLoading=submitBtn.querySelector('.btn-loading');
const successModal=document.getElementById('successModal');

// --- FORM VALIDATION ENHANCEMENTS ---
function showFieldError(input, message) {
  let error = input.parentNode.querySelector('.field-error');
  if (!error) {
    error = document.createElement('div');
    error.className = 'field-error text-red-500 mt-1';
    input.parentNode.appendChild(error);
  }
  error.textContent = message;
  input.setAttribute('aria-invalid', 'true');
}
function clearFieldError(input) {
  let error = input.parentNode.querySelector('.field-error');
  if (error) error.remove();
  input.removeAttribute('aria-invalid');
}
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validateForm() {
  let valid = true;
  const name = contactForm.elements['name'];
  const email = contactForm.elements['email'];
  const message = contactForm.elements['message'];
  clearFieldError(name);
  clearFieldError(email);
  clearFieldError(message);
  if (!name.value.trim()) {
    showFieldError(name, 'Please enter your name.');
    valid = false;
  }
  if (!email.value.trim()) {
    showFieldError(email, 'Please enter your email.');
    valid = false;
  } else if (!validateEmail(email.value.trim())) {
    showFieldError(email, 'Please enter a valid email address.');
    valid = false;
  }
  if (!message.value.trim()) {
    showFieldError(message, 'Please enter your message.');
    valid = false;
  }
  return valid;
}
// Form submission is now handled in index.html to avoid conflicts

// Close success modal
function closeSuccessModal(){
  successModal.style.display='none';
}

// Close modal when clicking outside
successModal.addEventListener('click',function(e){
  if(e.target===this){
    closeSuccessModal();
  }
});

// Scroll-triggered animations
const observerOptions={
  threshold:0.1,
  rootMargin:'0px 0px -50px 0px'
};

const observer=new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
    }
  });
},observerOptions);

// Observe all animation elements
// About section
const aboutElements = document.querySelectorAll('.about-heading, .about-subheading, .about-text, .about-list, .about-image, .about-quote, .about-tagline, .about-story');
aboutElements.forEach(el => {
  el.classList.add('about-fade-in');
  observer.observe(el);
});
// Portfolio section
const portfolioCards = document.querySelectorAll('.portfolio-card');
portfolioCards.forEach(card => {
  card.classList.add('portfolio-fade-in');
  observer.observe(card);
});
// Contact section
const contactElements = document.querySelectorAll('.contact-form, .contact-info');
contactElements.forEach(el => {
  el.classList.add('contact-fade-in');
  observer.observe(el);
});
// Section headings
const headings = document.querySelectorAll('h2');
headings.forEach(heading => {
  heading.classList.add('about-fade-in');
  observer.observe(heading);
});
// Services grid
const servicesGrid = document.querySelector('.portfolio-grid-3x3');
if (servicesGrid) {
  servicesGrid.classList.add('services-fade-in');
  observer.observe(servicesGrid);
}
// Staggered testimonial animations
const testimonialCards = document.querySelectorAll('#testimonials .p-6');
testimonialCards.forEach((card, i) => {
  card.classList.add('testimonial-fade-in');
  observer.observe(card);
});
// Staggered contact animations
const contactSection = document.querySelectorAll('.contact-form, .contact-info');
contactSection.forEach((el, i) => {
  el.classList.add('contact-fade-in');
  observer.observe(el);
});

// Add animation classes to elements
document.addEventListener('DOMContentLoaded',()=>{
  // Portfolio cards
  const portfolioCards=document.querySelectorAll('.portfolio-card');
  portfolioCards.forEach(card=>{
    card.classList.add('fade-in');
  });

  // About section elements
  const aboutElements=document.querySelectorAll('.about-heading, .about-subheading, .about-text, .about-list, .about-image, .about-quote, .about-tagline, .about-story');
  aboutElements.forEach(el=>{
    el.classList.add('fade-in');
  });

  // Contact section elements
  const contactElements=document.querySelectorAll('.contact-form, .contact-info');
  contactElements.forEach(el=>{
    el.classList.add('fade-in');
  });

  // Section headings
  const headings=document.querySelectorAll('h2');
  headings.forEach(heading=>{
    heading.classList.add('fade-in');
  });

  // Services grid
  const servicesGrid=document.querySelector('.portfolio-grid-3x3');
  if(servicesGrid){
    servicesGrid.classList.add('fade-in');
  }
});

// --- MODAL ACCESSIBILITY: FOCUS TRAP & ESCAPE KEY ---
function trapFocus(modal) {
  const focusable = modal.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  modal.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    } else if (e.key === 'Escape') {
      closeModal();
      closeSuccessModal();
    }
  });
}
let lastFocusedElement = null;
function openModal(title, text) {
  lastFocusedElement = document.activeElement;
  document.getElementById('modalTitle').innerText = title;
  document.getElementById('modalText').innerText = text;
  const modal = document.getElementById('modal');
  modal.style.display = 'flex';
  modal.focus();
  trapFocus(modal);
}
function closeModal() {
  document.getElementById('modal').style.display = 'none';
  if (lastFocusedElement) lastFocusedElement.focus();
}
function closeSuccessModal() {
  const successModal = document.getElementById('successModal');
  if (successModal) {
    successModal.style.display = 'none';
    if (lastFocusedElement) lastFocusedElement.focus();
  }
}
// Focus trap for success modal
successModal.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeSuccessModal();
});

// Remove errors on input
['name','email','message'].forEach(field => {
  contactForm.elements[field].addEventListener('input', function() {
    clearFieldError(this);
  });
});

// Dark mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});
// On load, apply dark mode if previously set
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
}

document.addEventListener('DOMContentLoaded', function() {
  // Testimonial slider logic
  const pages = document.querySelectorAll('#testimonial-slider .testimonial-page');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');
  const dots = document.querySelectorAll('.testimonial-dots .dot');
  const seeMoreBtn = document.getElementById('see-more-reviews');
  let currentPage = 0;

  console.log('Testimonial pages found:', pages.length);
  console.log('Prev button found:', !!prevBtn);
  console.log('Next button found:', !!nextBtn);
  console.log('See more button found:', !!seeMoreBtn);

  function showPage(idx) {
    console.log('Showing page:', idx);
    
    // Hide all pages first
    pages.forEach((page, i) => {
      if (i === idx) {
        page.style.display = 'block';
        page.style.opacity = '1';
        page.style.transform = 'translateY(0)';
      } else {
        page.style.display = 'none';
        page.style.opacity = '0';
        page.style.transform = 'translateY(30px)';
      }
      console.log(`Page ${i}: display=${page.style.display}, opacity=${page.style.opacity}`);
    });
    
    // Update dots
    dots.forEach((dot, i) => {
      if (i === idx) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
    
    // Update button text based on current page
    if (seeMoreBtn) {
      const btnText = seeMoreBtn.querySelector('.fancy-btn-text');
      if (idx === 0) {
        btnText.textContent = 'See More Reviews';
      } else {
        btnText.textContent = 'See First Reviews';
      }
    }
  }

  // Add click event listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Prev button clicked');
      currentPage = (currentPage - 1 + pages.length) % pages.length;
      showPage(currentPage);
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Next button clicked');
      currentPage = (currentPage + 1) % pages.length;
      showPage(currentPage);
    });
  }

  // See More Reviews button functionality
  if (seeMoreBtn) {
    seeMoreBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('See more button clicked');
      currentPage = (currentPage + 1) % pages.length;
      showPage(currentPage);
    });
  }

  // Dot navigation
  dots.forEach((dot, i) => {
    dot.addEventListener('click', function() {
      console.log('Dot clicked:', i);
      currentPage = i;
      showPage(currentPage);
    });
  });

  // Optional: swipe support for mobile
  let startX = null;
  pages.forEach(page => {
    page.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
    });
    page.addEventListener('touchend', e => {
      if (startX === null) return;
      let endX = e.changedTouches[0].clientX;
      if (endX - startX > 50) {
        console.log('Swipe right detected');
        if (prevBtn) prevBtn.click();
      }
      if (startX - endX > 50) {
        console.log('Swipe left detected');
        if (nextBtn) nextBtn.click();
      }
      startX = null;
    });
  });

  // Initialize
  showPage(currentPage);
});
