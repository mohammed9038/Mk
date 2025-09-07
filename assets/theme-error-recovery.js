/**
 * Theme Error Recovery Script
 * Prevents theme crashes from JavaScript errors and provides fallbacks
 */
(function() {
  'use strict';

  // Global error handler
  window.addEventListener('error', function(event) {
    console.warn('Theme Error Caught:', event.error);
    // Don't let errors break the theme
    event.preventDefault();
    return true;
  });

  // Unhandled promise rejection handler
  window.addEventListener('unhandledrejection', function(event) {
    console.warn('Unhandled Promise Rejection:', event.reason);
    event.preventDefault();
  });

  // Ensure critical DOM elements exist
  document.addEventListener('DOMContentLoaded', function() {
    // Ensure body has proper classes
    if (!document.body.className.includes('gradient')) {
      document.body.classList.add('gradient');
    }

    // Check for missing icons and provide fallbacks
    const missingIcons = document.querySelectorAll('use[href^="#icon-"]:not([href*="://"])');
    missingIcons.forEach(function(use) {
      const href = use.getAttribute('href');
      if (href && !document.querySelector(href)) {
        // Create a basic fallback icon
        const svg = use.closest('svg');
        if (svg) {
          svg.innerHTML = '<rect x="2" y="2" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"/>';
        }
      }
    });

    // Ensure search functionality doesn't break
    const searchInputs = document.querySelectorAll('input[type="search"]');
    searchInputs.forEach(function(input) {
      if (!input.form) {
        console.warn('Search input without form detected, wrapping...');
        const form = document.createElement('form');
        form.action = '/search';
        form.method = 'get';
        input.parentNode.insertBefore(form, input);
        form.appendChild(input);
      }
    });
  });

  console.log('Theme Error Recovery loaded');
})();
