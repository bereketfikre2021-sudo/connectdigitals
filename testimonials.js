// Testimonial slider functionality
function initTestimonials() {
  console.log('initTestimonials function called');
  const pages = document.querySelectorAll('#testimonial-slider .testimonial-page');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');
  const dots = document.querySelectorAll('.testimonial-dots .dot');
  const seeMoreBtn = document.getElementById('see-more-reviews');
  const slider = document.getElementById('testimonial-slider');
  
  // Check if testimonials section exists
  if (!slider || pages.length === 0) {
    console.warn('Testimonials section not found or no testimonial pages');
    return;
  }
  
  console.log('Found testimonial pages:', pages.length);
  pages.forEach((page, index) => {
    console.log(`Page ${index}:`, {
      display: page.style.display,
      opacity: page.style.opacity,
      visibility: page.style.visibility,
      transform: page.style.transform
    });
  });
  let currentPage = 0;
  let autoPlayInterval = null;
  let touchStartX = 0;
  let touchEndX = 0;
  
  // Responsive testimonial handling
  function updateTestimonialLayout() {
    const isMobile = window.innerWidth <= 480;
    const isSmallMobile = window.innerWidth <= 320;
    
    // Adjust testimonial grid for mobile
    const testimonialGrids = document.querySelectorAll('.testimonial-grid');
    testimonialGrids.forEach(grid => {
      if (isSmallMobile) {
        grid.style.gridTemplateColumns = '1fr';
        grid.style.gap = '0.5rem';
      } else if (isMobile) {
        grid.style.gridTemplateColumns = '1fr';
        grid.style.gap = '1rem';
      } else {
        grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
        grid.style.gap = '2rem';
      }
    });
    
    // Adjust navigation button positioning for small screens
    if (isSmallMobile) {
      if (prevBtn) prevBtn.style.left = '-16px';
      if (nextBtn) nextBtn.style.right = '-16px';
    } else if (isMobile) {
      if (prevBtn) prevBtn.style.left = '-20px';
      if (nextBtn) nextBtn.style.right = '-20px';
    } else {
      if (prevBtn) prevBtn.style.left = '-24px';
      if (nextBtn) nextBtn.style.right = '-24px';
    }
  }
  
  // Initialize responsive layout
  updateTestimonialLayout();
  
  // Update layout on window resize
  window.addEventListener('resize', updateTestimonialLayout);

  if (window.__DEBUG__) {
    console.log('Testimonial pages found:', pages.length);
    console.log('Prev button found:', !!prevBtn);
    console.log('Next button found:', !!nextBtn);
    console.log('See more button found:', !!seeMoreBtn);
    console.log('Slider element found:', !!slider);
    
    // Check if testimonials section is visible
    const testimonialsSection = document.getElementById('testimonials');
    if (testimonialsSection) {
      console.log('Testimonials section display:', window.getComputedStyle(testimonialsSection).display);
      console.log('Testimonials section visibility:', window.getComputedStyle(testimonialsSection).visibility);
      console.log('Testimonials section opacity:', window.getComputedStyle(testimonialsSection).opacity);
    }
  }

  function showPage(idx) {
    console.log('Showing page:', idx);
    
    // Hide all pages first
    pages.forEach((page, i) => {
      if (i === idx) {
        // Show current page with !important to override CSS
        page.style.setProperty('display', 'block', 'important');
        page.style.setProperty('opacity', '1', 'important');
        page.style.setProperty('transform', 'translateY(0)', 'important');
        page.style.setProperty('visibility', 'visible', 'important');
      } else {
        // Hide other pages with !important to override CSS
        page.style.setProperty('display', 'none', 'important');
        page.style.setProperty('opacity', '0', 'important');
        page.style.setProperty('transform', 'translateY(30px)', 'important');
        page.style.setProperty('visibility', 'hidden', 'important');
      }
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
      if (btnText) {
        if (idx === 0) {
          btnText.textContent = 'See More Reviews';
        } else {
          btnText.textContent = 'See First Reviews';
        }
      }
    }
    
    // Reset auto-play timer
    resetAutoPlay();
  }
  
  // Auto-play functionality
  function startAutoPlay() {
    if (autoPlayInterval) clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(() => {
      currentPage = (currentPage + 1) % pages.length;
      showPage(currentPage);
    }, 5000); // Change page every 5 seconds
  }
  
  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
  }
  
  function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }
  
  // Touch/swipe functionality
  function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
  }
  
  function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }
  
  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next page
        currentPage = (currentPage + 1) % pages.length;
      } else {
        // Swipe right - previous page
        currentPage = (currentPage - 1 + pages.length) % pages.length;
      }
      showPage(currentPage);
    }
  }

  // Add click event listeners
  if (prevBtn) {
    console.log('Adding event listener to prev button');
    prevBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Prev button clicked - current page:', currentPage);
      currentPage = (currentPage - 1 + pages.length) % pages.length;
      console.log('Switching to page:', currentPage);
      showPage(currentPage);
    });
  } else {
    console.error('Prev button not found!');
  }
  
  if (nextBtn) {
    console.log('Adding event listener to next button');
    nextBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Next button clicked - current page:', currentPage);
      currentPage = (currentPage + 1) % pages.length;
      console.log('Switching to page:', currentPage);
      showPage(currentPage);
    });
  } else {
    console.error('Next button not found!');
  }
  
  // Add touch/swipe event listeners
  if (slider) {
    slider.addEventListener('touchstart', handleTouchStart, { passive: true });
    slider.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // Pause auto-play on hover/touch
    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);
    slider.addEventListener('touchstart', stopAutoPlay);
    slider.addEventListener('touchend', () => setTimeout(startAutoPlay, 1000));
  }

  // See More Reviews button functionality
  if (seeMoreBtn) {
    console.log('Adding event listener to see more button');
    seeMoreBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('See more button clicked - current page:', currentPage);
      currentPage = (currentPage + 1) % pages.length;
      console.log('Switching to page:', currentPage);
      showPage(currentPage);
    });
  } else {
    console.error('See more button not found!');
  }

  // Dot navigation
  dots.forEach((dot, i) => {
    dot.addEventListener('click', function() {
      if (window.__DEBUG__) console.log('Dot clicked:', i);
      currentPage = i;
      showPage(currentPage);
    });
  });

  // Initialize the first page
  showPage(0);
  
  // Start auto-play
  startAutoPlay();
  
  // Debug: Check button elements after a short delay
  setTimeout(() => {
    console.log('=== TESTIMONIAL BUTTON DEBUG ===');
    console.log('Prev button element:', prevBtn);
    console.log('Next button element:', nextBtn);
    console.log('See more button element:', seeMoreBtn);
    
    if (prevBtn) {
      console.log('Prev button clickable:', prevBtn.offsetParent !== null);
      console.log('Prev button styles:', window.getComputedStyle(prevBtn));
    }
    
    if (nextBtn) {
      console.log('Next button clickable:', nextBtn.offsetParent !== null);
      console.log('Next button styles:', window.getComputedStyle(nextBtn));
    }
    
    if (seeMoreBtn) {
      console.log('See more button clickable:', seeMoreBtn.offsetParent !== null);
      console.log('See more button styles:', window.getComputedStyle(seeMoreBtn));
    }
  }, 1000);
  
  // Debug logging
  if (window.__DEBUG__) {
    console.log('Testimonials initialized successfully');
    console.log('Current page:', currentPage);
    console.log('Total pages:', pages.length);
    console.log('Auto-play started');
    
    // Check if first page is visible
    const firstPage = pages[0];
    if (firstPage) {
      console.log('First page display:', firstPage.style.display);
      console.log('First page opacity:', firstPage.style.opacity);
      console.log('First page transform:', firstPage.style.transform);
    }
    
    // Check second page
    const secondPage = pages[1];
    if (secondPage) {
      console.log('Second page display:', secondPage.style.display);
      console.log('Second page opacity:', secondPage.style.opacity);
      console.log('Second page transform:', secondPage.style.transform);
    }
  }
}
