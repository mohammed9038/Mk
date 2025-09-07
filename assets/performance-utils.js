/* ===================================================================
   PERFORMANCE UTILITIES - Essential performance optimization tools
   =================================================================== */

// Performance monitoring and optimization utilities
class PerformanceOptimizer {
  constructor() {
    this.metrics = {};
    this.observers = [];
    
    this.initPerformanceMonitoring();
    this.setupResourceHints();
    this.optimizeImages();
    this.initIntersectionObserver();
  }

  // Initialize performance monitoring
  initPerformanceMonitoring() {
    if (!('performance' in window)) return;

    // Mark critical moments
    window.performance.mark('theme-js-start');
    
    // Monitor page load
    window.addEventListener('load', () => {
      this.recordMetrics();
    });

    // Monitor largest contentful paint
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.lcp = lastEntry.startTime;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (e) {
        // Fail silently if not supported
      }
    }
  }

  // Record performance metrics
  recordMetrics() {
    if (!('performance' in window)) return;

    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
      this.metrics = {
        ...this.metrics,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        domInteractive: navigation.domInteractive - navigation.fetchStart,
        firstByte: navigation.responseStart - navigation.requestStart
      };
    }

    // Log metrics in development mode
    if (Shopify.designMode) {
      console.log('Al-Shariqah Theme Performance Metrics:', this.metrics);
    }
  }

  // Set up resource hints for better loading
  setupResourceHints() {
    // Preconnect to external domains
    const preconnectDomains = [
      'https://fonts.shopifycdn.com',
      'https://cdn.shopify.com',
      'https://firebasestorage.googleapis.com'
    ];

    preconnectDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }

  // Optimize images with lazy loading and WebP detection
  optimizeImages() {
    // Check WebP support
    this.supportsWebP = this.checkWebPSupport();
    
    // Set up lazy loading for images
    if ('IntersectionObserver' in window) {
      this.setupImageLazyLoading();
    }
  }

  // Check if browser supports WebP
  checkWebPSupport() {
    return new Promise(resolve => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  // Set up lazy loading for images
  setupImageLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          this.loadImage(img);
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px'
    });

    // Observe all images with data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });

    this.observers.push(imageObserver);
  }

  // Load image with optimization
  loadImage(img) {
    const src = img.dataset.src;
    if (!src) return;

    // Create a new image to preload
    const imageLoader = new Image();
    
    imageLoader.onload = () => {
      img.src = src;
      img.classList.remove('loading');
      img.classList.add('loaded');
      
      // Remove data-src to prevent re-processing
      delete img.dataset.src;
    };

    imageLoader.onerror = () => {
      img.classList.add('error');
    };

    // Start loading
    imageLoader.src = src;
  }

  // Initialize intersection observer for general use
  initIntersectionObserver() {
    if (!('IntersectionObserver' in window)) return;

    // Animation observer
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          animationObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    // Observe elements with animation classes
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      animationObserver.observe(el);
    });

    this.observers.push(animationObserver);
  }

  // Cleanup observers
  cleanup() {
    this.observers.forEach(observer => {
      if (observer.disconnect) {
        observer.disconnect();
      }
    });
    this.observers = [];
  }

  // Public method to get metrics
  getMetrics() {
    return { ...this.metrics };
  }
}

// Utility functions for performance
const PerformanceUtils = {
  // Debounce function for performance
  debounce(func, wait, immediate) {
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
  },

  // Throttle function for performance
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Request animation frame wrapper
  raf(callback) {
    if ('requestAnimationFrame' in window) {
      return requestAnimationFrame(callback);
    } else {
      return setTimeout(callback, 16);
    }
  },

  // Cancel animation frame wrapper
  cancelRaf(id) {
    if ('cancelAnimationFrame' in window) {
      cancelAnimationFrame(id);
    } else {
      clearTimeout(id);
    }
  }
};

// Initialize performance optimizer
domReady(() => {
  window.AlShariqahTheme.performanceOptimizer = new PerformanceOptimizer();
  window.AlShariqahTheme.PerformanceUtils = PerformanceUtils;
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (window.AlShariqahTheme.performanceOptimizer) {
    window.AlShariqahTheme.performanceOptimizer.cleanup();
  }
});
