// Main JavaScript file - initializes all modules
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM Content Loaded - Starting initialization...');
  
  // Test if all sections are visible
  const sections = ['home', 'about', 'services', 'portfolio', 'testimonials', 'contact'];
  sections.forEach(sectionId => {
    const section = document.getElementById(sectionId);
    if (section) {
      console.log(`Section ${sectionId}:`, {
        exists: true,
        visible: section.offsetParent !== null,
        display: window.getComputedStyle(section).display,
        height: section.offsetHeight
      });
    } else {
      console.error(`Section ${sectionId} not found!`);
    }
  });
  
  // Hero slideshow functionality
  function initHeroSlideshow() {
    const heroSection = document.querySelector('#home');
    if (!heroSection) return;
    
    // Add background rotation animation
    heroSection.style.backgroundImage = `
      linear-gradient(135deg, rgba(0, 15, 51, 0.8) 0%, rgba(26, 31, 58, 0.8) 50%, rgba(0, 15, 51, 0.8) 100%),
      url('BG.webp')
    `;
    
    // Optional: Add background image rotation
    const backgrounds = ['BG.webp', 'BG-2.webp', 'BG-3.webp', 'BG-4.webp'];
    let currentBg = 0;
    
    setInterval(() => {
      currentBg = (currentBg + 1) % backgrounds.length;
      heroSection.style.backgroundImage = `
        linear-gradient(135deg, rgba(0, 15, 51, 0.8) 0%, rgba(26, 31, 58, 0.8) 50%, rgba(0, 15, 51, 0.8) 100%),
        url('${backgrounds[currentBg]}')
      `;
    }, 5000); // Change every 5 seconds
  }

  // Modal listeners initialization
  function initModalListeners() {
    // Service and portfolio card click handlers
    document.addEventListener('click', function(e) {
      const target = e.target.closest('.service-card, .portfolio-card');
      if (target) {
        const title = target.getAttribute('data-modal-title');
        const content = target.getAttribute('data-modal-content');
        
        if (title && content) {
          openModal(title, content);
          
          // Track analytics
          if (typeof trackEvent === 'function') {
            trackEvent('modal_open', {
              modal_type: target.classList.contains('service-card') ? 'service' : 'portfolio',
              modal_title: title,
              user_intent: 'content_exploration'
            });
          }
        }
      }
    });
  }

  // Unified initialization entrypoint
  function init() {
    console.log('Initializing all modules...');
    
    // Ensure elements are ready
    try { 
      console.log('Initializing modal listeners...');
      initModalListeners(); 
      console.log('Modal listeners initialized successfully');
    } catch (e) { console.debug('initModalListeners skipped', e); }
    
    try { 
      console.log('Initializing testimonials...');
      initTestimonials(); 
      console.log('Testimonials initialized successfully');
    } catch (e) { console.debug('initTestimonials skipped', e); }
    
    try { 
      console.log('Initializing navigation...');
      initNavigation(); 
      console.log('Navigation initialized successfully');
    } catch (e) { console.debug('initNavigation skipped', e); }
    
    try { 
      console.log('Initializing hero slideshow...');
      initHeroSlideshow(); 
      console.log('Hero slideshow initialized successfully');
    } catch (e) { console.debug('initHeroSlideshow skipped', e); }
    
    try { 
      console.log('Initializing form...');
      initForm(); 
      console.log('Form initialized successfully');
    } catch (e) { console.debug('initForm skipped', e); }
    
    try { 
      console.log('Initializing form analytics...');
      initFormAnalytics(); 
      console.log('Form analytics initialized successfully');
    } catch (e) { console.debug('initFormAnalytics skipped', e); }
    
    try { 
      console.log('Initializing observers...');
      initObservers(); 
      console.log('Observers initialized successfully');
    } catch (e) { console.debug('initObservers skipped', e); }
    
    try { 
      console.log('Initializing animation classes...');
      initAnimationClasses(); 
      console.log('Animation classes initialized successfully');
    } catch (e) { console.debug('initAnimationClasses skipped', e); }
    
    try { 
      console.log('Initializing analytics...');
      initAnalytics(); 
      console.log('Analytics initialized successfully');
    } catch (e) { console.debug('initAnalytics skipped', e); }
    
    try { 
      console.log('Initializing scroll to top...');
      initScrollToTop(); 
      console.log('Scroll to top initialized successfully');
    } catch (e) { console.debug('initScrollToTop skipped', e); }
    

    
    console.log('All modules initialized!');
  }

  init();
});
