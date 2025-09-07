/* ===================================================================
   OPTIMIZED SEARCH COMPONENTS BUNDLE
   Replaces heavy predictive-search.js and search functionality
   =================================================================== */

// Optimized Predictive Search with performance improvements
class PredictiveSearchOptimized extends HTMLElement {
  constructor() {
    super();
    
    this.cacheDOM();
    this.bindEvents();
    this.setupPerformanceOptimizations();
  }

  cacheDOM() {
    this.cachedResults = {};
    this.input = this.querySelector('input[type="search"]');
    this.predictiveSearchResults = this.querySelector('[data-predictive-search]');
    this.isOpen = false;
    this.allPredictiveSearchInstances = document.querySelectorAll('predictive-search');
  }

  bindEvents() {
    if (!this.input) return;

    this.input.addEventListener('input', this.debouncedSearch);
    this.input.addEventListener('focus', this.onFocus.bind(this));
    this.input.addEventListener('blur', this.onBlur.bind(this));
    this.addEventListener('keyup', this.onKeyup.bind(this));
    this.addEventListener('keydown', this.onKeydown.bind(this));
  }

  setupPerformanceOptimizations() {
    // Debounce search to avoid excessive API calls
    this.debouncedSearch = this.debounce(this.search.bind(this), 300);
    
    // Throttle result rendering
    this.throttledRender = this.throttle(this.renderSearchResults.bind(this), 100);
    
    // Setup intersection observer for lazy loading
    this.setupIntersectionObserver();
  }

  setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) return;

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.preloadSearchAssets();
          this.observer.disconnect();
        }
      });
    }, {
      rootMargin: '100px'
    });

    this.observer.observe(this);
  }

  preloadSearchAssets() {
    // Preload search-related resources
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = `${window.routes.predictive_search_url}?q=&resources[type]=product&resources[limit]=4&section_id=predictive-search`;
    document.head.appendChild(link);
  }

  search() {
    const query = this.input.value.trim();
    
    if (query.length < 2) {
      this.close(true);
      return;
    }

    // Check cache first
    if (this.cachedResults[query]) {
      this.throttledRender(this.cachedResults[query]);
      return;
    }

    this.getSearchResults(query);
  }

  getSearchResults(searchTerm) {
    const queryKey = searchTerm.replace(' ', '-').toLowerCase();
    
    // Show loading state
    this.showLoadingState();
    
    fetch(`${routes.predictive_search_url}?q=${encodeURIComponent(searchTerm)}&resources[type]=product&resources[limit]=4&section_id=predictive-search`)
      .then((response) => {
        if (!response.ok) {
          const error = new Error(response.status);
          this.close();
          throw error;
        }
        return response.text();
      })
      .then((text) => {
        const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#shopify-section-predictive-search').innerHTML;
        
        // Cache the results
        this.cachedResults[searchTerm] = resultsMarkup;
        
        this.throttledRender(resultsMarkup);
      })
      .catch((error) => {
        console.error('Search error:', error);
        this.close();
        throw error;
      });
  }

  renderSearchResults(resultsMarkup) {
    if (!this.predictiveSearchResults) return;
    
    this.predictiveSearchResults.innerHTML = resultsMarkup;

    this.setAttribute('results', true);
    this.setLiveRegionResults();
    this.open();
  }

  showLoadingState() {
    if (!this.predictiveSearchResults) return;
    
    this.predictiveSearchResults.innerHTML = `
      <div class="predictive-search__loading">
        <div class="loading__spinner">
          <svg aria-hidden="true" focusable="false" class="spinner" viewBox="0 0 66 66">
            <circle class="path" fill="none" stroke-width="6" cx="33" cy="33" r="30"></circle>
          </svg>
        </div>
      </div>
    `;
    
    this.setAttribute('loading', true);
    this.open();
  }

  setLiveRegionResults() {
    this.removeAttribute('loading');
    this.setLiveRegionText(this.input.value.trim());
  }

  setLiveRegionText(searchTerm) {
    if (!this.liveRegion) {
      this.liveRegion = document.getElementById('predictive-search-live-region-countup');
    }
    
    if (!this.liveRegion) return;

    const count = this.predictiveSearchResults.querySelectorAll('[data-predictive-search-item]').length;
    this.liveRegion.textContent = window.accessibilityStrings?.loading_updated?.replace('[count]', count);
  }

  open() {
    if (this.isOpen) return;
    
    this.isOpen = true;
    this.setAttribute('open', true);
    this.input.setAttribute('aria-expanded', true);

    // Close other search instances
    this.allPredictiveSearchInstances.forEach(instance => {
      if (instance !== this && instance.isOpen) {
        instance.close();
      }
    });
  }

  close(clearResults = false) {
    if (clearResults) {
      this.reset();
    }

    this.isOpen = false;
    this.removeAttribute('open');
    this.removeAttribute('loading');
    this.input.setAttribute('aria-expanded', false);
    this.removeAttribute('results');
  }

  reset() {
    if (this.predictiveSearchResults) {
      this.predictiveSearchResults.innerHTML = '';
    }
  }

  onFocus() {
    const searchTerm = this.input.value.trim();
    if (!searchTerm) return;

    if (this.getAttribute('results') === 'true') {
      this.open();
    } else {
      this.search();
    }
  }

  onBlur() {
    // Delay close to allow clicking on results
    setTimeout(() => {
      if (!this.contains(document.activeElement)) {
        this.close();
      }
    }, 150);
  }

  onKeyup(event) {
    if (!this.input.value) this.close(true);
    event.preventDefault();

    switch (event.code) {
      case 'ArrowUp':
        this.switchOption('up');
        break;
      case 'ArrowDown':
        this.switchOption('down');
        break;
      case 'Enter':
        this.selectOption();
        break;
    }
  }

  onKeydown(event) {
    // Prevent the cursor from moving in the input when using the up and down arrow keys
    if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
      event.preventDefault();
    }
  }

  switchOption(direction) {
    if (!this.getAttribute('open')) return;

    const moveUp = direction === 'up';
    const selectedElement = this.querySelector('[aria-selected="true"]');

    // Remove previous selection
    const allOptions = this.querySelectorAll('li, .predictive-search__item');
    allOptions.forEach(element => element.setAttribute('aria-selected', false));

    if (!moveUp && !selectedElement) {
      // Select first option when moving down
      const firstOption = allOptions[0];
      if (firstOption) {
        firstOption.setAttribute('aria-selected', true);
        firstOption.focus();
      }
      return;
    }

    if (moveUp && !selectedElement) {
      // Select last option when moving up
      const lastOption = allOptions[allOptions.length - 1];
      if (lastOption) {
        lastOption.setAttribute('aria-selected', true);
        lastOption.focus();
      }
      return;
    }

    // Find next/previous option
    const selectedIndex = Array.from(allOptions).indexOf(selectedElement);
    const nextIndex = moveUp ? selectedIndex - 1 : selectedIndex + 1;
    const nextOption = allOptions[nextIndex];

    if (nextOption) {
      nextOption.setAttribute('aria-selected', true);
      nextOption.focus();
    } else {
      // Return focus to input if no more options
      selectedElement?.setAttribute('aria-selected', false);
      this.input.focus();
      this.input.setAttribute('aria-activedescendant', '');
    }
  }

  selectOption() {
    const selectedOption = this.querySelector('[aria-selected="true"]');
    if (!selectedOption) return;

    const link = selectedOption.querySelector('a');
    if (link) {
      link.click();
    }
  }

  // Utility functions
  debounce(fn, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  throttle(fn, delay) {
    let lastCall = 0;
    return (...args) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        fn.apply(this, args);
      }
    };
  }

  disconnectedCallback() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Optimized Search Form
class SearchFormOptimized extends HTMLElement {
  constructor() {
    super();
    
    this.input = this.querySelector('input[type="search"]');
    this.resetButton = this.querySelector('.search__button.reset');

    if (this.input) {
      this.input.addEventListener('input', this.onInputChange.bind(this));
    }

    if (this.resetButton) {
      this.resetButton.addEventListener('click', this.onFormReset.bind(this));
    }
  }

  onInputChange() {
    this.toggleResetButton();
  }

  toggleResetButton() {
    const resetIsHidden = this.resetButton?.classList.contains('hidden');
    if (this.input?.value.length > 0 && resetIsHidden) {
      this.resetButton?.classList.remove('hidden');
    } else if (this.input?.value.length === 0 && !resetIsHidden) {
      this.resetButton?.classList.add('hidden');
    }
  }

  onFormReset() {
    this.input.value = '';
    this.input.focus();
    this.toggleResetButton();
  }
}

// Register optimized search components
if ('customElements' in window) {
  customElements.define('predictive-search', PredictiveSearchOptimized);
  customElements.define('search-form', SearchFormOptimized);
}

// Performance mark
if ('performance' in window && 'mark' in window.performance) {
  window.performance.mark('search-components-loaded');
}
