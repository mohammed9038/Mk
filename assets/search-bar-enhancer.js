/**
 * Enhanced Search Bar Functionality
 * Handles responsive width behavior and interaction
 */
(function() {
  'use strict';

  class SearchBarEnhancer {
    constructor() {
      this.isExpanded = false;
      this.originalWidth = null;
      this.init();
    }

    init() {
      this.setupSearchBar();
      this.setupResizeObserver();
      console.log('✅ Search Bar Enhancer initialized');
    }

    setupSearchBar() {
      const searchForms = document.querySelectorAll('.header__search-form, .search-modal, .predictive-search');
      
      searchForms.forEach(form => {
        const input = form.querySelector('input[type="search"]');
        if (input) {
          this.enhanceSearchInput(input, form);
        }
      });
    }

    enhanceSearchInput(input, form) {
      // Store original width
      this.originalWidth = form.offsetWidth;

      // Focus event - expand search bar
      input.addEventListener('focus', () => {
        this.expandSearchBar(form, input);
      });

      // Blur event - collapse if empty
      input.addEventListener('blur', (e) => {
        // Delay to allow click events to process
        setTimeout(() => {
          if (!input.value.trim()) {
            this.collapseSearchBar(form, input);
          }
        }, 150);
      });

      // Input event - maintain expanded state while typing
      input.addEventListener('input', () => {
        if (input.value.trim()) {
          this.expandSearchBar(form, input);
        }
      });

      // Apply initial responsive styles
      this.applyResponsiveStyles(form, input);
    }

    expandSearchBar(form, input) {
      if (this.isExpanded) return;
      
      this.isExpanded = true;
      form.classList.add('search-expanded');
      
      // Apply expanded styles
      Object.assign(form.style, {
        maxWidth: '600px',
        minWidth: '400px',
        transition: 'all 0.3s ease-in-out',
        zIndex: '1000'
      });

      Object.assign(input.style, {
        width: '100%',
        transition: 'all 0.3s ease-in-out'
      });

      console.log('🔍 Search bar expanded');
    }

    collapseSearchBar(form, input) {
      if (!this.isExpanded) return;
      
      this.isExpanded = false;
      form.classList.remove('search-expanded');
      
      // Apply collapsed styles based on screen size
      const screenWidth = window.innerWidth;
      let collapsedWidth = screenWidth < 768 ? '280px' : '350px';
      
      Object.assign(form.style, {
        maxWidth: collapsedWidth,
        minWidth: '280px',
        transition: 'all 0.3s ease-in-out'
      });

      console.log('🔍 Search bar collapsed');
    }

    applyResponsiveStyles(form, input) {
      const applyStyles = () => {
        const screenWidth = window.innerWidth;
        
        if (screenWidth < 768) {
          // Mobile styles
          Object.assign(form.style, {
            maxWidth: this.isExpanded ? '90vw' : '280px',
            minWidth: '250px'
          });
        } else if (screenWidth < 1024) {
          // Tablet styles
          Object.assign(form.style, {
            maxWidth: this.isExpanded ? '500px' : '350px',
            minWidth: '300px'
          });
        } else {
          // Desktop styles
          Object.assign(form.style, {
            maxWidth: this.isExpanded ? '600px' : '400px',
            minWidth: '350px'
          });
        }
      };

      // Apply immediately
      applyStyles();
      
      // Apply on resize
      window.addEventListener('resize', applyStyles);
    }

    setupResizeObserver() {
      if ('ResizeObserver' in window) {
        const resizeObserver = new ResizeObserver((entries) => {
          entries.forEach(entry => {
            if (entry.target.matches('.header__search-form')) {
              this.handleResize(entry.target);
            }
          });
        });

        document.querySelectorAll('.header__search-form').forEach(form => {
          resizeObserver.observe(form);
        });
      }
    }

    handleResize(form) {
      // Ensure proper styling is maintained on resize
      const input = form.querySelector('input[type="search"]');
      if (input) {
        this.applyResponsiveStyles(form, input);
      }
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new SearchBarEnhancer();
    });
  } else {
    new SearchBarEnhancer();
  }

  // Expose for reinit if needed
  window.initSearchBarEnhancer = () => {
    new SearchBarEnhancer();
  };

})();
