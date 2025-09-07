/**
 * ==================================================================================================
 * ADVANCED SEARCH BAR CONTROLLER
 * This script provides a robust, dynamic, and responsive search bar experience.
 * It overrides theme defaults to ensure consistent behavior.
 * ==================================================================================================
 */
(function() {
  'use strict';

  const SEARCH_INPUT_SELECTOR = 'input[type="search"], input.search__input';
  const SEARCH_FORM_SELECTOR = '.header__search-form, .search-modal__form';

  class AdvancedSearchBarController {
    constructor(searchForm) {
      this.form = searchForm;
      this.input = this.form.querySelector(SEARCH_INPUT_SELECTOR);
      this.isFocused = false;

      if (!this.input) {
        console.error('Search input not found in form:', this.form);
        return;
      }

      this.bindEvents();
      this.applyResponsiveStyles();
      console.log('✅ Advanced Search Controller initialized for:', this.form);
    }

    bindEvents() {
      this.input.addEventListener('focus', this.handleFocus.bind(this));
      this.input.addEventListener('blur', this.handleBlur.bind(this));
      window.addEventListener('resize', this.applyResponsiveStyles.bind(this));
    }

    handleFocus() {
      this.isFocused = true;
      this.form.classList.add('search-is-active');
      this.applyResponsiveStyles();
    }

    handleBlur() {
      this.isFocused = false;
      // Only collapse if the input is empty
      if (!this.input.value.trim()) {
        this.form.classList.remove('search-is-active');
        this.applyResponsiveStyles();
      }
    }

    applyResponsiveStyles() {
      const screenWidth = window.innerWidth;
      let maxWidth = '400px'; // Default desktop collapsed width

      if (this.isFocused || this.input.value.trim()) {
        // Expanded styles
        if (screenWidth < 750) {
          maxWidth = 'calc(100vw - 40px)'; // Full width on mobile
        } else {
          maxWidth = '600px'; // Desktop expanded width
        }
      } else {
        // Collapsed styles
        if (screenWidth < 750) {
          maxWidth = '280px';
        } else if (screenWidth < 990) {
          maxWidth = '320px';
        }
      }
      
      this.form.style.setProperty('max-width', maxWidth, 'important');
    }
  }

  function initializeSearchBars() {
    document.querySelectorAll(SEARCH_FORM_SELECTOR).forEach(form => {
      // Avoid re-initializing
      if (!form.dataset.searchControllerInitialized) {
        new AdvancedSearchBarController(form);
        form.dataset.searchControllerInitialized = 'true';
      }
    });
  }

  // Initialize on DOM ready and handle Shopify theme editor events
  document.addEventListener('DOMContentLoaded', initializeSearchBars);
  if (window.Shopify && window.Shopify.designMode) {
    document.addEventListener('shopify:section:load', initializeSearchBars);
  }

  // Expose for external calls if needed
  window.initAdvancedSearch = initializeSearchBars;
})();
