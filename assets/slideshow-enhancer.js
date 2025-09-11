/**
 * Professional Slideshow Component Enhancement
 * Fixes classList errors and improves slideshow functionality
 * 
 * @version 2.0.0
 * @author Professional Theme Development Team
 */

class SlideshowEnhancer {
  constructor() {
    this.initialized = false;
    this.slideshows = new Map();
    this.init();
  }

  init() {
    if (this.initialized) return;

    // Wait for SlideshowComponent to be defined
    if (typeof window.SlideshowComponent === 'undefined') {
      // Wait and retry
      setTimeout(() => this.init(), 100);
      return;
    }

    this.enhanceSlideshowComponent();
    this.initExistingSlideshows();
    this.watchForNewSlideshows();
    
    this.initialized = true;
    console.log('[SlideshowEnhancer] Initialized successfully');
  }

  /**
   * Enhance the global SlideshowComponent class
   */
  enhanceSlideshowComponent() {
    const originalPrototype = window.SlideshowComponent.prototype;
    
    // Store original methods
    const originalUpdate = originalPrototype.update;
    const originalSetSlideVisibility = originalPrototype.setSlideVisibility;

    // Enhanced update method with error handling
    originalPrototype.update = function() {
      try {
        // Validate component state
        if (!this.slider || !this.sliderItemsToShow) {
          console.warn('[SlideshowEnhancer] Invalid slideshow state, skipping update');
          return;
        }

        // Call original update with safety wrapper
        this.safeUpdate();
      } catch (error) {
        console.warn('[SlideshowEnhancer] Update failed, using fallback:', error.message);
        this.fallbackUpdate();
      }
    };

    /**
     * Safe update method with comprehensive error handling
     */
    originalPrototype.safeUpdate = function() {
      // Safely update current page
      if (this.slider && this.sliderItemsToShow && this.sliderItemsToShow.length > 0) {
        const scrollLeft = this.slider.scrollLeft || 0;
        const itemWidth = this.sliderItemsToShow[0]?.clientWidth || 0;
        
        if (itemWidth > 0) {
          this.currentPage = Math.max(1, Math.ceil(scrollLeft / itemWidth));
        }
      }

      // Safely update control buttons
      this.updateControlButtons();

      // Safely update slide visibility
      if (typeof this.setSlideVisibility === 'function') {
        this.setSlideVisibility();
      }
    };

    /**
     * Fallback update method for emergency situations
     */
    originalPrototype.fallbackUpdate = function() {
      console.log('[SlideshowEnhancer] Running fallback update');
      
      try {
        // Basic control button update
        this.updateControlButtons();
      } catch (error) {
        console.warn('[SlideshowEnhancer] Fallback update also failed:', error.message);
      }
    };

    /**
     * Safe control button update
     */
    originalPrototype.updateControlButtons = function() {
      // Get control buttons safely
      const controlButtons = this.querySelectorAll('.slider-counter__link');
      
      if (!controlButtons || controlButtons.length === 0) {
        return; // No control buttons to update
      }

      // Safe button state management
      if (this.prevButton && typeof this.prevButton.removeAttribute === 'function') {
        this.prevButton.removeAttribute('disabled');
      }

      if (this.nextButton && typeof this.nextButton.removeAttribute === 'function') {
        this.nextButton.removeAttribute('disabled');
      }

      // Update active states safely
      controlButtons.forEach((button, index) => {
        if (!button || !button.classList) return;

        try {
          // Remove active classes
          button.classList.remove('slider-counter__link--active');
          button.removeAttribute('aria-current');

          // Add active class to current page
          if (this.currentPage && index === (this.currentPage - 1)) {
            button.classList.add('slider-counter__link--active');
            button.setAttribute('aria-current', 'true');
          }
        } catch (error) {
          console.warn('[SlideshowEnhancer] Button update failed for button', index, error.message);
        }
      });
    };

    /**
     * Enhanced setSlideVisibility with error handling
     */
    if (originalSetSlideVisibility) {
      originalPrototype.setSlideVisibility = function() {
        try {
          originalSetSlideVisibility.call(this);
        } catch (error) {
          console.warn('[SlideshowEnhancer] setSlideVisibility failed:', error.message);
          // Continue without visibility updates
        }
      };
    }

    console.log('[SlideshowEnhancer] SlideshowComponent enhanced');
  }

  /**
   * Initialize existing slideshows
   */
  initExistingSlideshows() {
    const slideshows = document.querySelectorAll('slideshow-component');
    
    slideshows.forEach((slideshow, index) => {
      this.enhanceSlideshow(slideshow, index);
    });

    console.log(`[SlideshowEnhancer] Enhanced ${slideshows.length} existing slideshows`);
  }

  /**
   * Watch for new slideshows being added to the DOM
   */
  watchForNewSlideshows() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'SLIDESHOW-COMPONENT') {
              this.enhanceSlideshow(node);
            } else if (node.querySelector) {
              const slideshows = node.querySelectorAll('slideshow-component');
              slideshows.forEach(slideshow => this.enhanceSlideshow(slideshow));
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Enhance individual slideshow
   */
  enhanceSlideshow(slideshow, index = null) {
    if (!slideshow || slideshow.dataset.enhanced) return;

    const slideshowId = slideshow.id || `slideshow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    slideshow.dataset.enhanced = 'true';
    slideshow.dataset.slideshowId = slideshowId;

    // Store slideshow reference
    this.slideshows.set(slideshowId, slideshow);

    // Add error event listener
    slideshow.addEventListener('error', (event) => {
      console.warn('[SlideshowEnhancer] Slideshow error:', event.detail);
    });

    // Add safety wrapper for any custom methods
    this.addSafetyWrappers(slideshow);

    console.log(`[SlideshowEnhancer] Enhanced slideshow: ${slideshowId}`);
  }

  /**
   * Add safety wrappers to slideshow methods
   */
  addSafetyWrappers(slideshow) {
    // Wrap common methods that might fail
    const methodsToWrap = ['play', 'pause', 'goToSlide', 'next', 'previous'];

    methodsToWrap.forEach(methodName => {
      if (typeof slideshow[methodName] === 'function') {
        const originalMethod = slideshow[methodName];
        
        slideshow[methodName] = function(...args) {
          try {
            return originalMethod.apply(this, args);
          } catch (error) {
            console.warn(`[SlideshowEnhancer] ${methodName} failed:`, error.message);
            
            // Dispatch error event
            this.dispatchEvent(new CustomEvent('slideshow:error', {
              detail: { method: methodName, error: error.message }
            }));
          }
        };
      }
    });
  }

  /**
   * Get slideshow by ID
   */
  getSlideshow(id) {
    return this.slideshows.get(id);
  }

  /**
   * Get all enhanced slideshows
   */
  getAllSlideshows() {
    return Array.from(this.slideshows.values());
  }

  /**
   * Force update all slideshows safely
   */
  updateAllSlideshows() {
    this.slideshows.forEach(slideshow => {
      if (slideshow && typeof slideshow.update === 'function') {
        try {
          slideshow.update();
        } catch (error) {
          console.warn('[SlideshowEnhancer] Failed to update slideshow:', error.message);
        }
      }
    });
  }

  /**
   * Destroy enhancer
   */
  destroy() {
    this.slideshows.clear();
    this.initialized = false;
    console.log('[SlideshowEnhancer] Destroyed');
  }
}

// Initialize slideshow enhancer
let slideshowEnhancer;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    slideshowEnhancer = new SlideshowEnhancer();
    window.slideshowEnhancer = slideshowEnhancer;
  });
} else {
  slideshowEnhancer = new SlideshowEnhancer();
  window.slideshowEnhancer = slideshowEnhancer;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SlideshowEnhancer;
}
