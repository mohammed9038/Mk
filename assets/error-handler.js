/**
 * Error Handler and Component Fixes
 * Handles missing components and JavaScript errors
 */

(function() {
  'use strict';

  // Error handler for missing components
  window.addEventListener('error', function(event) {
    const error = event.error;
    const message = event.message;
    
    // Handle specific component errors
    if (message && message.includes('slider-component')) {
      console.warn('Slider component error handled:', message);
      initializeFallbackSlider();
    }
    
    if (message && message.includes('cart-drawer')) {
      console.warn('Cart drawer error handled:', message);
      initializeFallbackCart();
    }
    
    if (message && message.includes('predictive-search')) {
      console.warn('Search component error handled:', message);
      initializeFallbackSearch();
    }
  });

  // Initialize fallback slider if slider-component fails
  function initializeFallbackSlider() {
    const sliders = document.querySelectorAll('slider-component');
    
    sliders.forEach(slider => {
      if (!slider.initialized) {
        slider.initialized = true;
        
        // Basic slider functionality
        const slides = slider.querySelectorAll('.slider__slide, .grid__item');
        const prevButton = slider.querySelector('.slider-button--prev');
        const nextButton = slider.querySelector('.slider-button--next');
        
        if (slides.length > 0) {
          let currentSlide = 0;
          
          if (prevButton) {
            prevButton.addEventListener('click', () => {
              currentSlide = Math.max(0, currentSlide - 1);
              updateSlider();
            });
          }
          
          if (nextButton) {
            nextButton.addEventListener('click', () => {
              currentSlide = Math.min(slides.length - 1, currentSlide + 1);
              updateSlider();
            });
          }
          
          function updateSlider() {
            slides.forEach((slide, index) => {
              if (index === currentSlide) {
                slide.style.display = 'block';
              } else {
                slide.style.display = 'none';
              }
            });
          }
        }
      }
    });
  }

  // Initialize fallback cart if cart drawer fails
  function initializeFallbackCart() {
    const cartIcon = document.querySelector('.cart-count-bubble, .cart-icon');
    
    if (cartIcon && !cartIcon.hasEventListener) {
      cartIcon.hasEventListener = true;
      cartIcon.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = '/cart';
      });
    }
  }

  // Initialize fallback search if predictive search fails
  function initializeFallbackSearch() {
    const searchForms = document.querySelectorAll('form[action*="/search"]');
    
    searchForms.forEach(form => {
      if (!form.hasBasicValidation) {
        form.hasBasicValidation = true;
        
        form.addEventListener('submit', function(e) {
          const input = form.querySelector('input[name="q"]');
          if (input && input.value.trim() === '') {
            e.preventDefault();
            input.focus();
          }
        });
      }
    });
  }

  // Fix image loading issues
  function fixImageLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    images.forEach(img => {
      if (!img.dataset.fixedLoading) {
        img.dataset.fixedLoading = 'true';
        
        // Fallback for lazy loading
        if ('IntersectionObserver' in window) {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                  img.src = img.dataset.src;
                  img.removeAttribute('data-src');
                }
                observer.unobserve(img);
              }
            });
          });
          
          observer.observe(img);
        } else {
          // Fallback for browsers without IntersectionObserver
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
        }
      }
    });
  }

  // Fix CSP issues by removing inline styles where possible
  function fixCSPIssues() {
    // Move inline styles to CSS classes where possible
    const elementsWithInlineStyles = document.querySelectorAll('[style]');
    
    elementsWithInlineStyles.forEach(element => {
      const style = element.getAttribute('style');
      
      // Handle common inline styles
      if (style && style.includes('display: none')) {
        element.classList.add('hidden');
        element.removeAttribute('style');
      }
    });
  }

  // Initialize error fixes
  function initializeErrorFixes() {
    try {
      fixImageLoading();
      fixCSPIssues();
      
      // Initialize fallback components
      initializeFallbackSlider();
      initializeFallbackCart();
      initializeFallbackSearch();
      
      console.log('✅ Error fixes applied successfully');
    } catch (error) {
      console.warn('Error in error fixes:', error);
    }
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeErrorFixes);
  } else {
    initializeErrorFixes();
  }

  // Re-run when sections are loaded
  document.addEventListener('shopify:section:load', initializeErrorFixes);

})();
