/* ===================================================================
   SMART COMPONENT LOADER - Intelligent JavaScript loading system
   Loads components only when needed for optimal performance
   =================================================================== */

class ComponentLoader {
  constructor() {
    this.loadedComponents = new Set();
    this.pendingComponents = new Map();
    this.observers = new Map();
    
    // Initialize immediately needed components
    this.initCriticalComponents();
    
    // Set up intersection observer for lazy loading
    this.setupIntersectionObserver();
    
    // Set up event-based loading
    this.setupEventBasedLoading();
  }

  // Load components that are critical for initial page functionality
  initCriticalComponents() {
    // Always load these immediately
    const criticalComponents = [
      'pubsub',
      'constants'
    ];
    
    criticalComponents.forEach(component => {
      this.loadComponent(component, true);
    });
  }

  // Set up intersection observer for components that should load when visible
  setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) return;
    
    this.lazyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const component = entry.target.dataset.component;
          if (component) {
            this.loadComponent(component);
            this.lazyObserver.unobserve(entry.target);
          }
        }
      });
    }, {
      rootMargin: '50px' // Load slightly before element comes into view
    });

    // Observe elements that need lazy-loaded components
    this.observeLazyComponents();
  }

  // Set up event-based loading for interactive components
  setupEventBasedLoading() {
    const eventMappings = {
      'search-input': ['predictive-search'],
      'cart-drawer-trigger': ['cart-drawer', 'cart'],
      'product-form': ['product-form', 'product-info'],
      'facet-filters': ['facets'],
      'quick-add-button': ['quick-add'],
      'media-gallery': ['media-gallery'],
      'localization-form': ['localization-form']
    };

    Object.entries(eventMappings).forEach(([selector, components]) => {
      document.addEventListener('click', (e) => {
        if (e.target.closest(`[data-trigger="${selector}"]`)) {
          components.forEach(component => this.loadComponent(component));
        }
      }, { once: false });

      document.addEventListener('focus', (e) => {
        if (e.target.closest(`[data-trigger="${selector}"]`)) {
          components.forEach(component => this.loadComponent(component));
        }
      }, { once: false });
    });
  }

  // Observe elements that need components when they become visible
  observeLazyComponents() {
    const lazySelectors = [
      '[data-component="slideshow"]',
      '[data-component="product-recommendations"]',
      '[data-component="recently-viewed"]',
      '[data-component="newsletter"]',
      '.product-media-gallery',
      '.facets-container',
      '.cart-drawer'
    ];

    lazySelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        if (this.lazyObserver) {
          this.lazyObserver.observe(element);
        }
      });
    });
  }

  // Load a component dynamically
  async loadComponent(componentName, isImmediate = false) {
    // Prevent duplicate loading
    if (this.loadedComponents.has(componentName)) {
      return Promise.resolve();
    }

    // Check if already pending
    if (this.pendingComponents.has(componentName)) {
      return this.pendingComponents.get(componentName);
    }

    // Create loading promise
    const loadPromise = this.createLoadPromise(componentName, isImmediate);
    this.pendingComponents.set(componentName, loadPromise);

    try {
      await loadPromise;
      this.loadedComponents.add(componentName);
      this.pendingComponents.delete(componentName);
      
      // Dispatch loaded event
      document.dispatchEvent(new CustomEvent(`component:${componentName}:loaded`));
      
    } catch (error) {
      console.warn(`Failed to load component: ${componentName}`, error);
      this.pendingComponents.delete(componentName);
    }

    return loadPromise;
  }

  // Create the actual loading promise for a component
  createLoadPromise(componentName, isImmediate) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `/assets/${componentName}.js`;
      script.defer = !isImmediate;
      script.async = !isImmediate;
      
      script.onload = () => {
        resolve();
        if ('performance' in window && 'mark' in window.performance) {
          window.performance.mark(`component-${componentName}-loaded`);
        }
      };
      
      script.onerror = () => {
        reject(new Error(`Failed to load ${componentName}.js`));
      };

      document.head.appendChild(script);
    });
  }

  // Public method to manually load components
  load(componentName) {
    return this.loadComponent(componentName);
  }

  // Public method to check if component is loaded
  isLoaded(componentName) {
    return this.loadedComponents.has(componentName);
  }
}

// Initialize the component loader
domReady(() => {
  window.AlShariqahTheme.componentLoader = new ComponentLoader();
  
  // Performance timing
  if ('performance' in window && 'mark' in window.performance) {
    window.performance.mark('component-loader-initialized');
  }
});

// Expose global load function for manual component loading
window.loadComponent = (componentName) => {
  if (window.AlShariqahTheme.componentLoader) {
    return window.AlShariqahTheme.componentLoader.load(componentName);
  }
  return Promise.reject(new Error('Component loader not initialized'));
};
