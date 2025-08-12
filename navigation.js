// Navigation functionality
function initNavigation() {
  // Header scroll effect
  window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Navigation Toggle
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavClose = document.querySelector('.mobile-nav-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav a');

  // Debug logging
  if (window.__DEBUG__) {
    console.log('Mobile nav elements found:', {
      toggle: !!mobileNavToggle,
      nav: !!mobileNav,
      close: !!mobileNavClose,
      links: mobileNavLinks.length
    });
  }

  function toggleMobileNav() {
    if (window.__DEBUG__) console.log('Toggle mobile nav clicked');
    const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
    if (window.__DEBUG__) console.log('Current expanded state:', isExpanded);
    
    mobileNavToggle.setAttribute('aria-expanded', (!isExpanded).toString());
    
    if (!isExpanded) {
      if (window.__DEBUG__) console.log('Opening mobile nav');
      mobileNav.style.display = 'flex';
      mobileNav.classList.add('active');
      document.body.classList.add('mobile-nav-open');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      if (window.__DEBUG__) console.log('Closing mobile nav');
      mobileNav.classList.remove('active');
      document.body.classList.remove('mobile-nav-open');
      document.body.style.overflow = ''; // Restore scrolling
      // Hide nav after animation completes
      setTimeout(() => {
        if (!mobileNav.classList.contains('active')) {
          mobileNav.style.display = 'none';
        }
      }, 300);
    }
    
    if (window.__DEBUG__) console.log('Mobile nav classes after toggle:', mobileNav.className);
  }

  function closeMobileNav() {
    mobileNavToggle.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('active');
    document.body.classList.remove('mobile-nav-open');
    document.body.style.overflow = '';
    // Hide nav after animation completes
    setTimeout(() => {
      if (!mobileNav.classList.contains('active')) {
        mobileNav.style.display = 'none';
      }
    }, 300);
  }

  // Event listeners for mobile navigation
  mobileNavToggle.addEventListener('click', function(e) {
    // Call the main toggle function
    toggleMobileNav();
    
    // Track analytics
    const isExpanded = this.getAttribute('aria-expanded') === 'true';
    if (typeof trackEvent === 'function') {
      trackEvent('mobile_menu_toggle', {
        action: isExpanded ? 'close' : 'open',
        user_intent: 'navigation'
      });
    }
  });

  // Close button event listener
  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', function(e) {
      closeMobileNav();
      
      // Track analytics
      if (typeof trackEvent === 'function') {
        trackEvent('mobile_menu_close', {
          user_intent: 'navigation'
        });
      }
    });
  }

  // Close mobile nav when clicking on a link
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileNav();
    });
  });

  // Close mobile nav when clicking outside
  mobileNav.addEventListener('click', (e) => {
    if (e.target === mobileNav) {
      closeMobileNav();
    }
  });

  // Close mobile nav on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
      closeMobileNav();
    }
  });

  // Animated Active Nav Link on Scroll
  const navLinks = document.querySelectorAll('nav a');
  const sections = Array.from(navLinks).map(link => {
    const id = link.getAttribute('href').replace('#','');
    return document.getElementById(id);
  });
  
  function onScroll() {
    let scrollPos = window.scrollY + 120;
    let activeIndex = 0;
    sections.forEach((section, i) => {
      if (section && section.offsetTop <= scrollPos) {
        activeIndex = i;
      }
    });
    navLinks.forEach((link, i) => {
      if (i === activeIndex) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  
  window.addEventListener('scroll', onScroll);
  onScroll(); // Initial call
}

// Hero background slideshow
function initHeroSlideshow() {
  console.log('initHeroSlideshow called');
  const heroElement = document.querySelector('.hero');
  console.log('Hero element found:', !!heroElement);
  
  if (heroElement) {
    const heroImages = ['BG.webp','BG-2.webp','BG-3.webp','BG-4.webp'];
    let currentImageIndex = 0;
    console.log('Hero images array:', heroImages);

    // Preload all hero images up-front to avoid blurry first-paint
    heroImages.forEach(src => { 
      const i = new Image(); 
      i.decoding = 'async'; 
      i.loading = 'eager'; 
      i.src = src; 
      console.log('Preloading image:', src);
    });

    function applyHeroImage(src) {
      console.log('Applying hero image:', src);
      heroElement.style.backgroundImage = `url('${src}')`;
      heroElement.style.backgroundSize = 'cover';
      heroElement.style.backgroundPosition = 'center';
      heroElement.style.imageRendering = 'auto';
      heroElement.style.webkitImageRendering = 'auto';
    }
    
    function changeHeroImage() {
      currentImageIndex = (currentImageIndex + 1) % heroImages.length;
      const nextImage = heroImages[currentImageIndex];
      console.log('Changing to image:', nextImage, 'index:', currentImageIndex);
      const img = new Image();
      img.decoding = 'async';
      img.onload = function() { 
        console.log('Image loaded:', nextImage);
        applyHeroImage(nextImage); 
      };
      img.src = nextImage;
    }
    
    // Set initial image explicitly to ensure crispness
    console.log('Setting initial image:', heroImages[0]);
    applyHeroImage(heroImages[0]);
    console.log('Starting slideshow interval (6 seconds)');
    setInterval(changeHeroImage, 6000);
  } else {
    console.warn('Hero element not found - slideshow not initialized');
  }
}

// Scroll to Top functionality
function initScrollToTop() {
  const scrollToTopBtn = document.getElementById('scrollToTop');
  
  if (scrollToTopBtn) {
    // Show/hide scroll to top button based on scroll position
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('show');
      } else {
        scrollToTopBtn.classList.remove('show');
      }
    });
    
    // Smooth scroll to top when button is clicked
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}


