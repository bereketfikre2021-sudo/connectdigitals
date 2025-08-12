// Modal functionality
let modalLastFocusedElement = null;
let modalFocusableElements = [];

function openModal(title, text) {
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  
  // Set modal content
  modalTitle.innerText = title;
  modalDesc.innerText = text;
  
  // Store the element that had focus before opening modal
  modalLastFocusedElement = document.activeElement;
  
  // Show modal
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
  modal.setAttribute('aria-modal', 'true');
  
  // Get all focusable elements in the modal
  modalFocusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  // Focus the first focusable element (close button)
  if (modalFocusableElements.length > 0) {
    modalFocusableElements[0].focus();
  }
  
  // Add event listeners for accessibility
  document.addEventListener('keydown', handleModalKeydown);
  
  // Prevent body scroll
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('modal');
  
  // Hide modal
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  modal.removeAttribute('aria-modal');
  
  // Remove event listeners
  document.removeEventListener('keydown', handleModalKeydown);
  
  // Restore focus to the element that had focus before opening modal
  if (modalLastFocusedElement) {
    modalLastFocusedElement.focus();
    modalLastFocusedElement = null;
  }
  
  // Restore body scroll
  document.body.style.overflow = '';
  
  // Clear focusable elements array
  modalFocusableElements = [];
}

function handleModalKeydown(event) {
  const modal = document.getElementById('modal');
  
  // Close modal on Escape key
  if (event.key === 'Escape') {
    closeModal();
    return;
  }
  
  // Handle Tab key for focus trapping
  if (event.key === 'Tab') {
    if (modalFocusableElements.length === 0) return;
    
    const firstElement = modalFocusableElements[0];
    const lastElement = modalFocusableElements[modalFocusableElements.length - 1];
    
    // If Shift + Tab pressed and first element is focused, focus last element
    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    }
    // If Tab pressed and last element is focused, focus first element
    else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }
}

// Close modal when clicking outside (non-destructive listener)
document.addEventListener('click', function(e) {
  const modalEl = document.getElementById('modal');
  if (modalEl && e.target === modalEl) {
    closeModal();
  }
});

// Delegated event listeners for modal triggers
function initModalListeners() {
  // Handle service and portfolio card clicks
  document.addEventListener('click', function(e) {
    const target = e.target.closest('.service-card, .portfolio-card');
    if (target && target.hasAttribute('data-modal-title')) {
      e.preventDefault();
      
      const title = target.getAttribute('data-modal-title');
      const content = target.getAttribute('data-modal-content');
      
      // Track analytics if available
      if (typeof trackEvent === 'function') {
        trackEvent('modal_open', {
          modal_type: target.classList.contains('service-card') ? 'service' : 'portfolio',
          modal_title: title,
          user_intent: 'information'
        });
      }
      
      openModal(title, content);
    }
  });
}
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal-close')) {
    e.preventDefault();
    closeModal();
  }
  if (e.target.classList.contains('success-close')) {
    e.preventDefault();
    closeSuccessModal();
  }
  if (e.target.classList.contains('mobile-nav-close')) {
    e.preventDefault();
    closeMobileNav();
  }
});
