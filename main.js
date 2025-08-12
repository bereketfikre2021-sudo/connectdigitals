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
