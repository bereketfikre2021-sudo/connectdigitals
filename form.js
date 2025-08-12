// Contact form functionality
let contactForm, submitBtn, btnText, btnLoading, successModal;
let nameField, emailField, messageField, charCount;

// Initialize form elements when DOM is loaded
function initializeFormElements() {
  contactForm = document.getElementById('contactForm');
  submitBtn = document.getElementById('submitBtn');
  btnText = submitBtn?.querySelector('.btn-text');
  btnLoading = submitBtn?.querySelector('.btn-loading');
  successModal = document.getElementById('successModal');
  
  // Form fields
  nameField = document.getElementById('name');
  emailField = document.getElementById('email');
  messageField = document.getElementById('message');
  charCount = document.getElementById('char-count');
}

// Simple form handling
function initForm() {
  if (window.__DEBUG__) console.log('DOM Content Loaded - Setting up form...');
  
  // Initialize form elements
  initializeFormElements();
  
  if (window.__DEBUG__) console.log('Form elements found:', {
    contactForm: !!contactForm,
    nameField: !!nameField,
    emailField: !!emailField,
    messageField: !!messageField,
    charCount: !!charCount,
    submitBtn: !!submitBtn,
    successModal: !!successModal
  });
  
  // Character count function
  function updateCharCount() {
    if (!messageField || !charCount) {
      console.warn('Form fields not initialized for character count');
      return;
    }
    const length = messageField.value.length;
    charCount.textContent = `${length}/1000`;
    charCount.classList.remove('warning', 'danger');
    if (length > 800) {
      charCount.classList.add('warning');
    }
    if (length > 950) {
      charCount.classList.add('danger');
    }
    if (window.__DEBUG__) console.log('Character count updated:', length);
  }

  // Expose for quickFill()
  window.updateCharCount = updateCharCount;
  
  // Simple validation
  function validateForm() {
    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const message = messageField.value.trim();
    
    let isValid = true;
    
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => {
      el.textContent = '';
      el.classList.remove('show');
    });
    
    // Name validation
    if (name.length < 2) {
      document.getElementById('name-error').textContent = 'Name must be at least 2 characters';
      document.getElementById('name-error').classList.add('show');
      isValid = false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      document.getElementById('email-error').textContent = 'Please enter a valid email address';
      document.getElementById('email-error').classList.add('show');
      isValid = false;
    }
    
    // Message validation
    if (message.length < 10) {
      document.getElementById('message-error').textContent = 'Message must be at least 10 characters';
      document.getElementById('message-error').classList.add('show');
      isValid = false;
    }
    
    return isValid;
  }
  
  // Form submission - Single event listener to avoid conflicts
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (window.__DEBUG__) console.log('Form submitted!');
    
    // Track form submission for analytics
    if (typeof trackEvent === 'function') {
      trackEvent('form_interaction', {
        action: 'form_submit',
        page_section: 'contact'
      });
    }
    
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => {
      el.textContent = '';
      el.classList.remove('show');
    });
    
    if (!validateForm()) {
      if (window.__DEBUG__) console.log('Form validation failed');
      return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';
    
    // Prepare and send form data to Formspree
    const formData = new FormData(contactForm);
    fetch(contactForm.action, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: formData
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (response.ok) {
          successModal.style.display = 'flex';
          // Accessible toast announcement
          let toast = document.getElementById('sr-toast');
          if (!toast) {
            toast = document.createElement('div');
            toast.id = 'sr-toast';
            toast.setAttribute('role', 'status');
            toast.setAttribute('aria-live', 'polite');
            toast.className = 'sr-toast';
            document.body.appendChild(toast);
          }
          toast.textContent = "Message sent successfully. We'll get back to you soon.";

          contactForm.reset();
          if (charCount) {
            charCount.textContent = '0/1000';
            charCount.classList.remove('warning', 'danger');
          }
          document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
            el.classList.remove('show');
          });
        } else {
          const errorMsg = (data.errors && data.errors.length && data.errors[0].message) || 'Sorry, there was an error sending your message. Please try again.';
          if (window.__DEBUG__) console.error('Formspree error:', errorMsg);
          alert(errorMsg);
        }
      })
      .catch((err) => {
        if (window.__DEBUG__) console.error('Fetch error:', err);
        alert('Sorry, there was an error sending your message. Please try again or contact us directly at digitalsconnect@gmail.com');
      })
      .finally(() => {
        submitBtn.disabled = false;
        if (btnText) btnText.style.display = 'inline';
        if (btnLoading) btnLoading.style.display = 'none';
      });
  });
  
  // Character count event listener
  messageField.addEventListener('input', updateCharCount);
  
  // Initialize character count
  updateCharCount();
  
  // Close success modal when clicking outside content
  if (successModal) {
    successModal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeSuccessModal();
      }
    });
  }

  if (window.__DEBUG__) console.log('Form setup complete!');
}

// Close success modal
function closeSuccessModal() {
  if (!successModal) {
    successModal = document.getElementById('successModal');
  }
  if (successModal) {
    successModal.style.display = 'none';
  }
  // Restore focus to a sensible control
  const submit = document.getElementById('submitBtn');
  if (submit) submit.focus();
}

// Enhanced form analytics tracking
function initFormAnalytics() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  // Focus tracking
  contactForm.addEventListener('focusin', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      if (typeof trackEvent === 'function') {
        trackEvent('form_interaction', {
          action: 'field_focus',
          field_name: e.target.name,
          page_section: 'contact'
        });
      }
    }
  });
  
  // Debounced input tracking
  let inputDebounceTimer = null;
  contactForm.addEventListener('input', function(e) {
    if (!(e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    if (inputDebounceTimer) clearTimeout(inputDebounceTimer);
    inputDebounceTimer = setTimeout(() => {
      if (typeof trackEvent === 'function') {
        trackEvent('form_interaction', {
          action: 'field_input',
          field_name: e.target.name,
          page_section: 'contact'
        });
      }
    }, 1000);
  });

  // Blur tracking
  contactForm.addEventListener('blur', function(e) {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
      if (typeof trackEvent === 'function') {
        trackEvent('form_interaction', {
          action: 'field_blur',
          field_name: e.target.name,
          page_section: 'contact'
        });
      }
    }
  }, true);

  // Validation error tracking
  contactForm.addEventListener('invalid', function(e) {
    if (typeof trackEvent === 'function') {
      trackEvent('form_interaction', {
        action: 'validation_error',
        field_name: e.target.name,
        page_section: 'contact'
      });
    }
  });
}
