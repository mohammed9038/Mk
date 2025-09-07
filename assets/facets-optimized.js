/* ===================================================================
   OPTIMIZED FACETS AND SEARCH COMPONENTS
   Replaces heavy facets.js and search functionality
   =================================================================== */

// Optimized Facets Form with performance improvements
class FacetsForm extends HTMLElement {
  constructor() {
    super();
    
    this.cacheDOM();
    this.bindEvents();
    this.setupIntersectionObserver();
  }

  cacheDOM() {
    this.form = this.querySelector('form');
    this.debouncedOnSubmit = this.debounce((event) => {
      this.onSubmitHandler(event);
    }, 500);
  }

  bindEvents() {
    if (this.form) {
      this.form.addEventListener('input', this.debouncedOnSubmit.bind(this));
      this.addEventListener('keyup', this.onKeyUpHandler.bind(this));
    }
  }

  setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) return;

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadFacetContent();
          this.observer.disconnect();
        }
      });
    }, {
      rootMargin: '100px'
    });

    this.observer.observe(this);
  }

  loadFacetContent() {
    // Load facet content if not already loaded
    const content = this.querySelector('.facets__disclosure-vertical');
    if (content && !content.dataset.loaded) {
      content.dataset.loaded = 'true';
      this.initializeFacets();
    }
  }

  onSubmitHandler(event) {
    event.preventDefault();
    const formData = new FormData(this.form);
    const searchParams = new URLSearchParams(formData).toString();
    
    // Show loading state
    this.toggleLoadingState(true);
    
    this.renderPage(searchParams, event);
  }

  onKeyUpHandler(event) {
    event.preventDefault();
    const searchParams = new URLSearchParams(new FormData(this.form)).toString();
    this.renderPage(searchParams, event, false);
  }

  renderPage(searchParams, event, updateURLHash = true) {
    const url = `${window.location.pathname}?section_id=${this.dataset.sectionId}&${searchParams}`;
    const filterDataUrl = element => element.url === url;

    this.filterData = this.filterData || [];
    this.filterData.filter(filterDataUrl).length === 0 && this.filterData.push({ url });
    
    fetch(url)
      .then(response => response.text())
      .then(responseText => {
        const resultsMarkup = new DOMParser()
          .parseFromString(responseText, 'text/html')
          .getElementById('ProductGridContainer').innerHTML;

        this.renderProductGridContainer(resultsMarkup);
        this.renderProductCount(responseText);

        if (updateURLHash) this.updateURLHash(searchParams);
      })
      .catch(error => {
        console.error('Facets error:', error);
      })
      .finally(() => {
        this.toggleLoadingState(false);
      });
  }

  renderProductGridContainer(resultsMarkup) {
    const container = document.getElementById('ProductGridContainer');
    if (container) {
      container.innerHTML = resultsMarkup;
      
      // Trigger reinitialization of product components
      document.dispatchEvent(new CustomEvent('facets:updated'));
    }
  }

  renderProductCount(responseText) {
    const countElement = document.getElementById('ProductCount');
    if (!countElement) return;

    const html = new DOMParser().parseFromString(responseText, 'text/html');
    const newCount = html.getElementById('ProductCount');
    
    if (newCount) {
      countElement.innerHTML = newCount.innerHTML;
    }
  }

  updateURLHash(searchParams) {
    history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`);
  }

  toggleLoadingState(isLoading) {
    const spinner = this.querySelector('.facets__loading');
    const content = this.querySelector('.facets__content');
    
    if (spinner) spinner.classList.toggle('hidden', !isLoading);
    if (content) content.style.opacity = isLoading ? '0.5' : '1';
  }

  initializeFacets() {
    // Initialize facet-specific functionality
    this.querySelectorAll('.facets__disclosure').forEach(disclosure => {
      this.setupFacetDisclosure(disclosure);
    });
  }

  setupFacetDisclosure(disclosure) {
    const summary = disclosure.querySelector('summary');
    if (!summary) return;

    summary.addEventListener('click', (event) => {
      event.preventDefault();
      const isOpen = disclosure.hasAttribute('open');
      
      if (isOpen) {
        disclosure.removeAttribute('open');
      } else {
        disclosure.setAttribute('open', '');
      }
    });
  }

  debounce(fn, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        fn(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  disconnectedCallback() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Optimized Facet Filters Remove
class FacetFiltersForm extends HTMLElement {
  constructor() {
    super();
    
    this.bindEvents();
  }

  bindEvents() {
    this.addEventListener('click', this.onFilterRemove.bind(this));
  }

  onFilterRemove(event) {
    event.preventDefault();
    
    if (!event.target.closest('.facets__selected')) return;
    
    const form = document.querySelector('facets-form form') || document.querySelector('#FacetFiltersForm');
    if (!form) return;

    const searchParams = new URLSearchParams(form.serialize || new FormData(form));
    
    // Remove the specific filter
    this.removeFilter(event.target, searchParams);
    
    // Update the form
    this.updateForm(searchParams);
  }

  removeFilter(target, searchParams) {
    const filterType = target.dataset.filterType;
    const filterValue = target.dataset.filterValue;
    
    if (filterType && filterValue) {
      searchParams.delete(filterType, filterValue);
    }
  }

  updateForm(searchParams) {
    const facetsForm = document.querySelector('facets-form');
    if (facetsForm && facetsForm.renderPage) {
      facetsForm.renderPage(searchParams.toString(), null);
    }
  }
}

// Optimized Price Range Component
class PriceRange extends HTMLElement {
  constructor() {
    super();
    
    this.cacheDOM();
    this.bindEvents();
    this.adjustToValidValues();
  }

  cacheDOM() {
    this.inputs = this.querySelectorAll('input[type="range"]');
    this.numberInputs = this.querySelectorAll('input[type="number"]');
  }

  bindEvents() {
    this.inputs.forEach(input => {
      input.addEventListener('input', this.onRangeChange.bind(this));
    });

    this.numberInputs.forEach(input => {
      input.addEventListener('input', this.onNumberChange.bind(this));
    });
  }

  onRangeChange(event) {
    this.adjustToValidValues();
    this.updateNumberInputs();
    this.triggerFormSubmit();
  }

  onNumberChange(event) {
    this.updateRangeInputs();
    this.triggerFormSubmit();
  }

  adjustToValidValues() {
    const minInput = this.querySelector('.field__range--min');
    const maxInput = this.querySelector('.field__range--max');
    
    if (!minInput || !maxInput) return;

    if (parseFloat(maxInput.value) < parseFloat(minInput.value)) {
      maxInput.value = minInput.value;
    }

    if (parseFloat(minInput.value) > parseFloat(maxInput.value)) {
      minInput.value = maxInput.value;
    }
  }

  updateNumberInputs() {
    const minRange = this.querySelector('.field__range--min');
    const maxRange = this.querySelector('.field__range--max');
    const minNumber = this.querySelector('.field__number--min');
    const maxNumber = this.querySelector('.field__number--max');

    if (minRange && minNumber) minNumber.value = minRange.value;
    if (maxRange && maxNumber) maxNumber.value = maxRange.value;
  }

  updateRangeInputs() {
    const minRange = this.querySelector('.field__range--min');
    const maxRange = this.querySelector('.field__range--max');
    const minNumber = this.querySelector('.field__number--min');
    const maxNumber = this.querySelector('.field__number--max');

    if (minNumber && minRange) minRange.value = minNumber.value;
    if (maxNumber && maxRange) maxRange.value = maxNumber.value;
  }

  triggerFormSubmit() {
    const facetsForm = this.closest('facets-form') || document.querySelector('facets-form');
    if (facetsForm && facetsForm.debouncedOnSubmit) {
      facetsForm.debouncedOnSubmit(new Event('input'));
    }
  }
}

// Register optimized facets components
if ('customElements' in window) {
  customElements.define('facets-form', FacetsForm);
  customElements.define('facet-filters-form', FacetFiltersForm);
  customElements.define('price-range', PriceRange);
}

// Performance mark
if ('performance' in window && 'mark' in window.performance) {
  window.performance.mark('facets-components-loaded');
}
