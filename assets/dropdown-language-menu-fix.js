// Fix for dropdown menu and language selector issues
(function() {
  'use strict';

  // Prevent multiple initializations
  if (typeof window.dropdownLanguageFixInitialized !== 'undefined') {
    console.log('[dropdown-language-fix] Already initialized, skipping...');
    return;
  }
  window.dropdownLanguageFixInitialized = true;

  const DEBUG = true;

  function log() {
    if (DEBUG) console.log('[dropdown-language-fix]', ...arguments);
  }

  // Fix for SlideShowComponent classList errors
  function fixSlideshowComponent() {
    const originalUpdate = window.SlideshowComponent?.prototype?.update;
    
    if (originalUpdate) {
      window.SlideshowComponent.prototype.update = function() {
        try {
          // Call parent update with safety checks
          if (this.slider && this.sliderItemsToShow) {
            this.currentPage = Math.ceil(this.slider.scrollLeft / this.sliderItemsToShow[0]?.clientWidth || 1);
          }

          this.sliderControlButtons = this.querySelectorAll('.slider-counter__link');
          
          if (this.prevButton) {
            this.prevButton.removeAttribute('disabled');
          }

          if (!this.sliderControlButtons.length) return;

          this.sliderControlButtons.forEach((link) => {
            if (link && link.classList) {
              link.classList.remove('slider-counter__link--active');
              link.removeAttribute('aria-current');
            }
          });

          const activeButton = this.sliderControlButtons[this.currentPage - 1];
          if (activeButton && activeButton.classList) {
            activeButton.classList.add('slider-counter__link--active');
            activeButton.setAttribute('aria-current', true);
          }

          if (this.nextButton) {
            this.nextButton.removeAttribute('disabled');
          }

          this.setSlideVisibility();
        } catch (error) {
          console.warn('[slideshow-fix] Error in update method:', error);
        }
      };
      
      log('SlideShowComponent update method patched');
    }
  }

  // Fix dropdown hover functionality
  function initDropdownHoverFix() {
    const dropdownElements = document.querySelectorAll('[dropdown-hover], .header__inline-menu details, .gtranslate-trigger');
    
    dropdownElements.forEach(dropdown => {
      // Ensure proper structure
      const summary = dropdown.querySelector('summary');
      const menu = dropdown.querySelector('.header__submenu, ul.list-menu--disclosure, ul, .gtranslate-wrapper');
      
      if (!summary || !menu) {
        log('Missing required elements for dropdown:', dropdown);
        return;
      }

      // Add click handler for mobile/desktop compatibility
      summary.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Close other dropdowns
        dropdownElements.forEach(otherDropdown => {
          if (otherDropdown !== dropdown) {
            const otherMenu = otherDropdown.querySelector('.header__submenu, ul.list-menu--disclosure, ul, .gtranslate-wrapper');
            if (otherMenu && otherMenu.classList) {
              otherMenu.classList.remove('open', 'active');
            }
            if (otherDropdown.hasAttribute && otherDropdown.hasAttribute('open')) {
              otherDropdown.removeAttribute('open');
            }
          }
        });
        
        // Toggle current dropdown
        if (dropdown.hasAttribute('open')) {
          dropdown.removeAttribute('open');
          if (menu.classList) {
            menu.classList.remove('open', 'active');
          }
        } else {
          dropdown.setAttribute('open', '');
          if (menu.classList) {
            menu.classList.add('open', 'active');
          }
        }
      });

      // Keyboard support
      summary.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          dropdown.removeAttribute('open');
          if (menu.classList) {
            menu.classList.remove('open', 'active');
          }
          summary.blur();
        }
        
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          summary.click();
        }
      });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
      const clickedDropdown = e.target.closest('[dropdown-hover], .header__inline-menu details, .gtranslate-trigger');
      
      if (!clickedDropdown) {
        dropdownElements.forEach(dropdown => {
          const menu = dropdown.querySelector('.header__submenu, ul.list-menu--disclosure, ul, .gtranslate-wrapper');
          dropdown.removeAttribute('open');
          if (menu && menu.classList) {
            menu.classList.remove('open', 'active');
          }
        });
      }
    });

    log('Dropdown hover fix initialized for', dropdownElements.length, 'elements');
  }

  // Fix GTranslate language selector
  function initGTranslateFix() {
    function setupGTranslate() {
      const triggers = document.querySelectorAll('.gtranslate-trigger, [data-gtranslate-trigger], .gtranslate_wrapper');
      const drawers = document.querySelectorAll('.gtranslate-drawer, .gtranslate_wrapper');
      
      triggers.forEach(trigger => {
        if (trigger.dataset.gtranslateFixed) return;
        trigger.dataset.gtranslateFixed = 'true';
        
        trigger.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          drawers.forEach(drawer => {
            if (drawer && drawer.classList) {
              drawer.classList.toggle('active');
              drawer.classList.toggle('open');
            }
          });
        });
      });

      // Close when clicking outside
      document.addEventListener('click', function(e) {
        if (!e.target.closest('.gtranslate-trigger, .gtranslate-drawer, .gtranslate_wrapper')) {
          drawers.forEach(drawer => {
            if (drawer && drawer.classList) {
              drawer.classList.remove('active', 'open');
            }
          });
        }
      });

      log('GTranslate fix applied to', triggers.length, 'triggers and', drawers.length, 'drawers');
    }

    // Try immediate setup
    setupGTranslate();

    // Watch for dynamically added GTranslate elements
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes) {
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1) {
              if (node.matches && (
                node.matches('.gtranslate-trigger, .gtranslate_wrapper') ||
                node.querySelector('.gtranslate-trigger, .gtranslate_wrapper')
              )) {
                setupGTranslate();
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Initialize fixes when DOM is ready
  function initialize() {
    log('Initializing dropdown and language selector fixes');
    
    // Fix slideshow component
    fixSlideshowComponent();
    
    // Fix dropdown functionality
    initDropdownHoverFix();
    
    // Fix GTranslate
    initGTranslateFix();
    
    log('All fixes initialized');
  }

  // Wait for DOM and other scripts to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    // DOM already loaded, wait a bit for other scripts
    setTimeout(initialize, 100);
  }

  // Also initialize on load event as fallback
  window.addEventListener('load', function() {
    setTimeout(initialize, 200);
  });

})();
