/* ===================================================================
   ADVANCED COMPONENT LOADER - Phase 4 Optimized
   Intelligent loading system for all optimized components
   =================================================================== */

class AdvancedComponentLoader {
  constructor() {
    this.loadedComponents = new Set();
    this.pendingComponents = new Map();
    this.componentMap = this.initializeComponentMap();
    
    this.setupIntersectionObserver();
    this.setupEventBasedLoading();
    this.loadCriticalComponents();
  }

  initializeComponentMap() {
    return {
      // Phase 3 optimized components
      'quantity-input': { bundle: 'global-optimized.js', critical: true },
      'modal-dialog': { bundle: 'global-optimized.js', critical: true },
      'modal-opener': { bundle: 'global-optimized.js', critical: true },
      'deferred-media': { bundle: 'global-optimized.js', critical: true },
      
      'slider-component': { bundle: 'slider-components.js', critical: false },
      'slideshow-component': { bundle: 'slider-components.js', critical: false },
      'product-recommendations': { bundle: 'slider-components.js', critical: false },
      
      'menu-drawer': { bundle: 'menu-components.js', critical: false },
      'header-drawer': { bundle: 'menu-components.js', critical: false },
      'details-disclosure': { bundle: 'menu-components.js', critical: false },
      'list-menu': { bundle: 'menu-components.js', critical: false },
      'localization-form': { bundle: 'menu-components.js', critical: false },
      
      'variant-selects': { bundle: 'product-components.js', critical: false },
      'product-form': { bundle: 'product-components.js', critical: false },
      
      // Phase 4 optimized components
      'facets-form': { bundle: 'facets-optimized.js', critical: false },
      'facet-filters-form': { bundle: 'facets-optimized.js', critical: false },
      'price-range': { bundle: 'facets-optimized.js', critical: false },
      
      'cart-items': { bundle: 'cart-optimized.js', critical: false },
      'cart-drawer': { bundle: 'cart-optimized.js', critical: false },
      
      'predictive-search': { bundle: 'search-optimized.js', critical: false },
      'search-form': { bundle: 'search-optimized.js', critical: false },
      
      'quick-order-list': { bundle: 'quick-order-optimized.js', critical: false },
      
      // Legacy components (to be optimized in future phases)
      'cart-notification': { bundle: 'cart-notification.js', critical: false },
      'quick-add': { bundle: 'quick-add.js', critical: false },
      'recipient-form': { bundle: 'recipient-form.js', critical: false },
      'pickup-availability': { bundle: 'pickup-availability.js', critical: false },
      'product-info': { bundle: 'product-info.js', critical: false },
      'details-modal': { bundle: 'details-modal.js', critical: false },
      'password-modal': { bundle: 'password-modal.js', critical: false },
      'product-model': { bundle: 'product-model.js', critical: false },
      'product-modal': { bundle: 'product-modal.js', critical: false },
      'media-gallery': { bundle: 'media-gallery.js', critical: false },
      'price-per-item': { bundle: 'price-per-item.js', critical: false },
      'magnify': { bundle: 'magnify.js', critical: false }
    };
  }

  loadCriticalComponents() {
    // Load critical components immediately
    Object.entries(this.componentMap).forEach(([component, config]) => {
      if (config.critical && this.shouldLoadComponent(component)) {
        this.loadComponent(component, true);
      }
    });
  }

  shouldLoadComponent(componentName) {
    // Check if component elements exist on page
    const selectors = {
      'quantity-input': 'quantity-input',
      'modal-dialog': 'modal-dialog',
      'modal-opener': 'modal-opener',
      'deferred-media': 'deferred-media',
      'slider-component': 'slider-component',
      'slideshow-component': 'slideshow-component',
      'product-recommendations': 'product-recommendations',
      'menu-drawer': 'menu-drawer',
      'header-drawer': 'header-drawer',
      'details-disclosure': 'details-disclosure',
      'list-menu': 'list-menu',
      'localization-form': 'localization-form',
      'variant-selects': 'variant-selects',
      'product-form': 'product-form',
      'facets-form': 'facets-form',
      'facet-filters-form': 'facet-filters-form',
      'price-range': 'price-range',
      'cart-items': 'cart-items',
      'cart-drawer': 'cart-drawer',
      'predictive-search': 'predictive-search',
      'search-form': 'search-form',
      'quick-order-list': 'quick-order-list'
    };

    const selector = selectors[componentName];
    return selector ? document.querySelector(selector) !== null : false;
  }

  setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) return;
    
    this.lazyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const component = this.getComponentFromElement(entry.target);
          if (component) {
            this.loadComponent(component);
            this.lazyObserver.unobserve(entry.target);
          }
        }
      });
    }, {
      rootMargin: '100px'
    });

    // Observe components that should load when visible
    this.observeLazyComponents();
  }

  observeLazyComponents() {
    const lazyComponents = [
      { selector: 'slider-component', component: 'slider-component' },
      { selector: 'slideshow-component', component: 'slideshow-component' },
      { selector: 'product-recommendations', component: 'product-recommendations' },
      { selector: 'facets-form', component: 'facets-form' },
      { selector: 'cart-drawer', component: 'cart-drawer' },
      { selector: 'predictive-search', component: 'predictive-search' },
      { selector: 'quick-order-list', component: 'quick-order-list' },
      { selector: '.product-media-gallery', component: 'media-gallery' },
      { selector: '.facets-container', component: 'facets-form' },
      { selector: '.cart-items', component: 'cart-items' }
    ];

    lazyComponents.forEach(({ selector, component }) => {
      document.querySelectorAll(selector).forEach(element => {
        element.dataset.component = component;
        if (this.lazyObserver) {
          this.lazyObserver.observe(element);
        }
      });
    });
  }

  getComponentFromElement(element) {
    return element.dataset.component || element.tagName.toLowerCase();
  }

  setupEventBasedLoading() {
    // Load components based on user interactions
    const eventMappings = {
      'click': [
        { selector: '.cart-drawer__toggle', component: 'cart-drawer' },
        { selector: '.search-modal__toggle', component: 'predictive-search' },
        { selector: '.menu-drawer__toggle', component: 'menu-drawer' },
        { selector: '.quick-add__submit', component: 'quick-add' }
      ],
      'focus': [
        { selector: 'input[type="search"]', component: 'predictive-search' },
        { selector: '.facets input', component: 'facets-form' }
      ],
      'mouseover': [
        { selector: '.product-card', component: 'quick-add' },
        { selector: '.media-gallery', component: 'media-gallery' }
      ]
    };

    Object.entries(eventMappings).forEach(([eventType, mappings]) => {
      mappings.forEach(({ selector, component }) => {
        this.addEventListener(eventType, selector, () => {
          this.loadComponent(component);
        });
      });
    });
  }

  addEventListener(eventType, selector, callback) {
    document.addEventListener(eventType, (event) => {
      if (event.target.matches(selector)) {
        callback(event);
      }
    }, { passive: true });
  }

  async loadComponent(componentName, isImmediate = false) {
    if (this.loadedComponents.has(componentName)) {
      return Promise.resolve();
    }

    if (this.pendingComponents.has(componentName)) {
      return this.pendingComponents.get(componentName);
    }

    const config = this.componentMap[componentName];
    if (!config) {
      console.warn(`Component ${componentName} not found in component map`);
      return Promise.resolve();
    }

    const loadPromise = this.loadBundle(config.bundle, isImmediate);
    this.pendingComponents.set(componentName, loadPromise);

    try {
      await loadPromise;
      this.loadedComponents.add(componentName);
      this.pendingComponents.delete(componentName);
      
      document.dispatchEvent(new CustomEvent(`component:${componentName}:loaded`));
      
      if ('performance' in window && 'mark' in window.performance) {
        window.performance.mark(`component-${componentName}-loaded`);
      }
      
    } catch (error) {
      console.warn(`Failed to load component: ${componentName}`, error);
      this.pendingComponents.delete(componentName);
    }

    return loadPromise;
  }

  loadBundle(bundleName, isImmediate = false) {
    return new Promise((resolve, reject) => {
      // Check if bundle is already loaded
      if (document.querySelector(`script[src*="${bundleName}"]`)) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `/assets/${bundleName}`;
      script.defer = !isImmediate;
      script.async = !isImmediate;
      
      script.onload = () => {
        resolve();
        if ('performance' in window && 'mark' in window.performance) {
          window.performance.mark(`bundle-${bundleName}-loaded`);
        }
      };
      
      script.onerror = () => {
        reject(new Error(`Failed to load bundle: ${bundleName}`));
      };
      
      document.head.appendChild(script);
    });
  }

  // Preload critical bundles for better performance
  preloadCriticalBundles() {
    const criticalBundles = ['global-optimized.js'];
    
    criticalBundles.forEach(bundle => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'script';
      link.href = `/assets/${bundle}`;
      document.head.appendChild(link);
    });
  }

  // Public API for manual component loading
  loadComponents(componentNames) {
    if (Array.isArray(componentNames)) {
      return Promise.all(componentNames.map(name => this.loadComponent(name)));
    }
    return this.loadComponent(componentNames);
  }

  getLoadedComponents() {
    return Array.from(this.loadedComponents);
  }

  isComponentLoaded(componentName) {
    return this.loadedComponents.has(componentName);
  }
}

// Initialize the advanced component loader
window.AlShariqahTheme = window.AlShariqahTheme || {};
window.AlShariqahTheme.ComponentLoader = new AdvancedComponentLoader();

// Legacy support
window.ComponentLoader = window.AlShariqahTheme.ComponentLoader;

// Performance mark
if ('performance' in window && 'mark' in window.performance) {
  window.performance.mark('advanced-component-loader-initialized');
}
