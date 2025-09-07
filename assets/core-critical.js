/* ===================================================================
   CRITICAL JAVASCRIPT - Essential functionality only
   Loads immediately for core site functionality
   =================================================================== */

// Theme initialization flag
window.AlShariqahTheme = window.AlShariqahTheme || {};

// Essential utility functions
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction() {
    const context = this;
    const args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Essential DOM ready function
function domReady(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
}

// Critical accessibility - Focus management
function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      "summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"
    )
  );
}

// Essential keyboard navigation
function onKeyUpEscape(event) {
  if (event.code.toUpperCase() !== 'ESCAPE') return;
  const openDetailsElement = event.target.closest('details[open]');
  if (!openDetailsElement) return;
  const summaryElement = openDetailsElement.querySelector('summary');
  openDetailsElement.removeAttribute('open');
  summaryElement.setAttribute('aria-expanded', false);
  summaryElement.focus();
}

// Critical details/summary functionality
domReady(() => {
  document.querySelectorAll('[id^="Details-"] summary').forEach((summary) => {
    summary.setAttribute('role', 'button');
    summary.setAttribute('aria-expanded', summary.parentNode.hasAttribute('open'));

    if (summary.nextElementSibling.getAttribute('id')) {
      summary.setAttribute('aria-controls', summary.nextElementSibling.id);
    }

    summary.addEventListener('click', (event) => {
      event.currentTarget.setAttribute('aria-expanded', !event.currentTarget.closest('details').hasAttribute('open'));
    });

    if (!summary.closest('header-drawer, menu-drawer')) {
      summary.parentElement.addEventListener('keyup', onKeyUpEscape);
    }
  });
});

// Essential no-JS fallback removal
document.documentElement.className = document.documentElement.className.replace('no-js', 'js');
if (Shopify.designMode) {
  document.documentElement.classList.add('shopify-design-mode');
}

// Essential performance mark
if ('performance' in window && 'mark' in window.performance) {
  window.performance.mark('critical-js-loaded');
}
