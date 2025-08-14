// Analytics functionality
let startTime = Date.now();
let maxScrollDepth = 0;

// Enhanced Analytics Tracking with consent check
function hasAnalyticsConsent() {
  // Since we're using the official Google Analytics code, we'll allow analytics by default
  // Users can still opt out through browser settings or ad blockers
  const html = document.documentElement;
  return html.getAttribute('data-ga') === 'granted' || 
         window.__ANALYTICS_CONSENT__ === true || 
         html.getAttribute('data-ga') !== 'denied'; // Allow by default unless explicitly denied
}

function loadGAScript(measurementId) {
  return new Promise((resolve, reject) => {
    if (window.gtag) return resolve();
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

async function ensureGAInitialized() {
  // Since Google Analytics is already loaded via the official gtag script, we just need to check if it's available
  if (typeof gtag === 'function') {
    // Google Analytics is already initialized, just return true
    return true;
  }
  
  // Fallback to the old method if needed
  if (!hasAnalyticsConsent()) return false;
  const MEASUREMENT_ID = window.__GA_MEASUREMENT_ID__ || 'G-XN04SK4GT5';
  if (!MEASUREMENT_ID) return false;
  await loadGAScript(MEASUREMENT_ID);
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  gtag('js', new Date());
  // Minimal config with privacy defaults; no ad personalization/signals unless explicitly allowed
  gtag('config', MEASUREMENT_ID, {
    page_title: document.title,
    page_location: window.location.href,
    send_page_view: true,
    anonymize_ip: true
  });
  return true;
}

function trackEvent(eventName, parameters = {}) {
  if (typeof gtag === 'function' && hasAnalyticsConsent()) {
    gtag('event', eventName, parameters);
  }
}

// Track page views for different sections
function trackSectionView(sectionName) {
  trackEvent('section_view', {
    page_section: sectionName,
    user_intent: 'content_consumption'
  });
}

// Track button clicks
function trackButtonClick(buttonName, location) {
  trackEvent('button_click', {
    button_name: buttonName,
    page_section: location,
    user_intent: 'engagement'
  });
}

// Track form interactions
function trackFormInteraction(action, formType) {
  trackEvent('form_interaction', {
    action: action,
    form_type: formType,
    user_intent: 'conversion'
  });
}

// Track portfolio item views
function trackPortfolioView(itemName) {
  trackEvent('portfolio_view', {
    item_name: itemName,
    service_type: 'portfolio',
    user_intent: 'service_exploration'
  });
}

// Track scroll depth
function trackScrollDepth() {
  const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
  if (scrollPercent > maxScrollDepth) {
    maxScrollDepth = scrollPercent;
    if (maxScrollDepth % 25 === 0) { // Track at 25%, 50%, 75%, 100%
      trackEvent('scroll_depth', {
        depth_percentage: maxScrollDepth,
        user_intent: 'content_engagement'
      });
    }
  }
}

// Track time on page
function trackTimeOnPage() {
  const timeSpent = Math.round((Date.now() - startTime) / 1000);
  if (timeSpent % 30 === 0 && timeSpent > 0) { // Track every 30 seconds
    trackEvent('time_on_page', {
      time_spent_seconds: timeSpent,
      user_intent: 'content_engagement'
    });
  }
}

// Initialize analytics tracking
async function initAnalytics() {
  const initialized = await ensureGAInitialized();
  if (!initialized) {
    console.debug('Analytics not initialized (no consent or no ID)');
    return;
  }
  // Track initial page load
  trackEvent('page_view', {
    page_title: document.title,
    page_location: window.location.href,
    user_intent: 'initial_visit'
  });
  
  // Track section views using Intersection Observer
  const sections = document.querySelectorAll('section[id]');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        trackSectionView(entry.target.id);
      }
    });
  }, { threshold: 0.5 });
  
  sections.forEach(section => {
    sectionObserver.observe(section);
  });
  
  // Track button clicks
  document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.classList.contains('hero-btn')) {
      trackButtonClick('contact_us', 'hero');
    } else if (e.target.tagName === 'A' && e.target.href && e.target.href.includes('#')) {
      const section = e.target.href.split('#')[1];
      trackButtonClick('navigation', section);
    }
  });
  
  // Track portfolio modal opens
  const portfolioCards = document.querySelectorAll('.portfolio-card');
  portfolioCards.forEach(card => {
    card.addEventListener('click', function() {
      const title = this.querySelector('h3')?.textContent || 'Unknown';
      trackPortfolioView(title);
    });
  });
  
  // Track scroll depth
  window.addEventListener('scroll', trackScrollDepth);
  
  // Track time on page
  setInterval(trackTimeOnPage, 30000); // Check every 30 seconds
  
  // Track testimonial navigation
  const testimonialNavBtns = document.querySelectorAll('.testimonial-nav-btn');
  testimonialNavBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      trackEvent('testimonial_navigation', {
        direction: this.classList.contains('prev-btn') ? 'previous' : 'next',
        user_intent: 'content_exploration'
      });
    });
  });
  
  // Track scroll to top button
  const scrollToTopBtn = document.getElementById('scrollToTop');
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', function() {
      trackEvent('scroll_to_top', {
        user_intent: 'navigation'
      });
    });
  }
  
  // Track mobile scroll to home button
  const mobileScrollHomeBtn = document.getElementById('mobileScrollHome');
  if (mobileScrollHomeBtn) {
    mobileScrollHomeBtn.addEventListener('click', function() {
      trackEvent('mobile_scroll_to_home', {
        user_intent: 'navigation',
        page_section: 'mobile_navigation'
      });
    });
  }
}

// Track page visibility changes
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    trackEvent('page_hide', {
      time_spent_seconds: Math.round((Date.now() - startTime) / 1000),
      user_intent: 'session_end'
    });
  } else {
    trackEvent('page_show', {
      user_intent: 'session_resume'
    });
    startTime = Date.now(); // Reset timer
  }
});

// Track before unload
window.addEventListener('beforeunload', function() {
  const timeSpent = Math.round((Date.now() - startTime) / 1000);
  trackEvent('page_exit', {
    time_spent_seconds: timeSpent,
    user_intent: 'session_end'
  });
});
