/* ===================================================================
   AL-SHARIQAH THEME - OPTIMIZATION TEST SUITE
   Comprehensive testing for all optimized components
   =================================================================== */

class OptimizationTestSuite {
  constructor() {
    this.testResults = {
      passed: 0,
      failed: 0,
      warnings: 0,
      details: []
    };
    
    this.requiredComponents = [
      'quantity-input',
      'modal-dialog', 
      'modal-opener',
      'deferred-media',
      'slider-component',
      'slideshow-component',
      'menu-drawer',
      'header-drawer',
      'details-disclosure',
      'variant-selects',
      'product-form',
      'facets-form',
      'cart-items',
      'cart-drawer',
      'predictive-search',
      'search-form',
      'quick-order-list'
    ];
    
    this.init();
  }

  init() {
    console.log('🧪 Starting Al-Shariqah Theme Optimization Tests...\n');
    this.runAllTests();
  }

  async runAllTests() {
    await this.testCriticalJavaScript();
    await this.testComponentLoader();
    await this.testPerformanceUtils();
    await this.testOptimizedComponents();
    await this.testResponsiveDesign();
    await this.testAccessibility();
    await this.testPerformanceMetrics();
    
    this.displayResults();
  }

  // Test 1: Critical JavaScript Loading
  async testCriticalJavaScript() {
    this.log('📦 Testing Critical JavaScript Loading...');
    
    try {
      // Test global utilities
      if (typeof window.AlShariqahTheme !== 'undefined') {
        this.pass('AlShariqahTheme namespace loaded');
      } else {
        this.fail('AlShariqahTheme namespace not found');
        return;
      }

      // Test ThemeUtils
      if (window.AlShariqahTheme.ThemeUtils) {
        if (typeof window.AlShariqahTheme.ThemeUtils.debounce === 'function') {
          this.pass('ThemeUtils.debounce loaded');
        } else {
          this.fail('ThemeUtils.debounce not found');
        }

        if (typeof window.AlShariqahTheme.ThemeUtils.throttle === 'function') {
          this.pass('ThemeUtils.throttle loaded');
        } else {
          this.fail('ThemeUtils.throttle not found');
        }
      } else {
        this.fail('ThemeUtils not loaded');
      }

      // Test FocusManager
      if (window.AlShariqahTheme.FocusManager) {
        this.pass('FocusManager loaded');
      } else {
        this.fail('FocusManager not loaded');
      }

      // Test MediaController
      if (window.AlShariqahTheme.MediaController) {
        this.pass('MediaController loaded');
      } else {
        this.fail('MediaController not loaded');
      }

    } catch (error) {
      this.fail(`Critical JavaScript error: ${error.message}`);
    }
  }

  // Test 2: Component Loader
  async testComponentLoader() {
    this.log('🔄 Testing Component Loader...');
    
    try {
      if (window.AlShariqahTheme.ComponentLoader) {
        this.pass('ComponentLoader initialized');
        
        // Test component loading methods
        if (typeof window.AlShariqahTheme.ComponentLoader.loadComponent === 'function') {
          this.pass('loadComponent method available');
        } else {
          this.fail('loadComponent method not found');
        }

        if (typeof window.AlShariqahTheme.ComponentLoader.isComponentLoaded === 'function') {
          this.pass('isComponentLoaded method available');
        } else {
          this.fail('isComponentLoaded method not found');
        }

      } else {
        this.fail('ComponentLoader not initialized');
      }
    } catch (error) {
      this.fail(`ComponentLoader error: ${error.message}`);
    }
  }

  // Test 3: Performance Utils
  async testPerformanceUtils() {
    this.log('⚡ Testing Performance Utils...');
    
    try {
      if (window.AlShariqahTheme.PerformanceOptimizer) {
        this.pass('PerformanceOptimizer loaded');
        
        // Test WebP support detection
        if (typeof window.AlShariqahTheme.PerformanceOptimizer.supportsWebP === 'function') {
          const webpSupport = await window.AlShariqahTheme.PerformanceOptimizer.supportsWebP();
          this.pass(`WebP support detected: ${webpSupport}`);
        } else {
          this.warn('WebP detection not available');
        }

        // Test performance metrics
        if (typeof window.AlShariqahTheme.PerformanceOptimizer.getLCPMetrics === 'function') {
          this.pass('Performance metrics available');
        } else {
          this.warn('Performance metrics not available');
        }

      } else {
        this.fail('PerformanceOptimizer not loaded');
      }
    } catch (error) {
      this.fail(`PerformanceOptimizer error: ${error.message}`);
    }
  }

  // Test 4: Optimized Components
  async testOptimizedComponents() {
    this.log('🧩 Testing Optimized Components...');
    
    this.requiredComponents.forEach(componentName => {
      try {
        const elements = document.querySelectorAll(componentName);
        
        if (elements.length > 0) {
          // Component elements found on page
          if (customElements.get(componentName)) {
            this.pass(`${componentName} custom element defined`);
            
            // Test if components are properly initialized
            let initialized = 0;
            elements.forEach(element => {
              if (element.constructor.name !== 'HTMLElement') {
                initialized++;
              }
            });
            
            if (initialized === elements.length) {
              this.pass(`${componentName} components initialized (${initialized}/${elements.length})`);
            } else {
              this.warn(`${componentName} partially initialized (${initialized}/${elements.length})`);
            }
          } else {
            this.warn(`${componentName} custom element not yet defined (${elements.length} elements waiting)`);
          }
        } else {
          this.log(`${componentName} not present on this page`);
        }
      } catch (error) {
        this.fail(`${componentName} test error: ${error.message}`);
      }
    });
  }

  // Test 5: Responsive Design
  async testResponsiveDesign() {
    this.log('📱 Testing Responsive Design...');
    
    try {
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta) {
        this.pass('Viewport meta tag present');
      } else {
        this.fail('Viewport meta tag missing');
      }

      // Test CSS custom properties
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      
      if (styles.getPropertyValue('--color-foreground')) {
        this.pass('CSS custom properties loaded');
      } else {
        this.warn('CSS custom properties not detected');
      }

      // Test media queries
      if (window.matchMedia && window.matchMedia('(max-width: 768px)')) {
        this.pass('Media query support available');
      } else {
        this.fail('Media query support not available');
      }

    } catch (error) {
      this.fail(`Responsive design error: ${error.message}`);
    }
  }

  // Test 6: Accessibility
  async testAccessibility() {
    this.log('♿ Testing Accessibility Features...');
    
    try {
      // Test focus management
      if (window.AlShariqahTheme.FocusManager.trapFocus) {
        this.pass('Focus management available');
      } else {
        this.fail('Focus management not available');
      }

      // Test ARIA labels
      const ariaElements = document.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby]');
      if (ariaElements.length > 0) {
        this.pass(`ARIA labels found (${ariaElements.length} elements)`);
      } else {
        this.warn('No ARIA labels detected');
      }

      // Test keyboard navigation
      const focusableElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]');
      let tabbableCount = 0;
      focusableElements.forEach(el => {
        if (el.tabIndex >= 0) tabbableCount++;
      });
      
      if (tabbableCount > 0) {
        this.pass(`Keyboard navigation available (${tabbableCount} tabbable elements)`);
      } else {
        this.warn('Limited keyboard navigation detected');
      }

    } catch (error) {
      this.fail(`Accessibility error: ${error.message}`);
    }
  }

  // Test 7: Performance Metrics
  async testPerformanceMetrics() {
    this.log('📊 Testing Performance Metrics...');
    
    try {
      if ('performance' in window) {
        this.pass('Performance API available');
        
        // Test performance marks
        const marks = performance.getEntriesByType('mark');
        const optimizationMarks = marks.filter(mark => 
          mark.name.includes('optimized') || 
          mark.name.includes('component') ||
          mark.name.includes('bundle')
        );
        
        if (optimizationMarks.length > 0) {
          this.pass(`Performance marks found (${optimizationMarks.length})`);
          optimizationMarks.forEach(mark => {
            this.log(`  ✓ ${mark.name}: ${Math.round(mark.startTime)}ms`);
          });
        } else {
          this.warn('No optimization performance marks found');
        }

        // Test resource loading
        const resources = performance.getEntriesByType('resource');
        const jsResources = resources.filter(resource => resource.name.includes('.js'));
        const optimizedResources = jsResources.filter(resource => 
          resource.name.includes('optimized') || 
          resource.name.includes('advanced')
        );
        
        if (optimizedResources.length > 0) {
          this.pass(`Optimized resources loaded (${optimizedResources.length})`);
        } else {
          this.warn('No optimized resources detected');
        }

      } else {
        this.fail('Performance API not available');
      }
    } catch (error) {
      this.fail(`Performance metrics error: ${error.message}`);
    }
  }

  // Test utility functions
  pass(message) {
    this.testResults.passed++;
    this.testResults.details.push({ type: 'pass', message });
    console.log(`✅ ${message}`);
  }

  fail(message) {
    this.testResults.failed++;
    this.testResults.details.push({ type: 'fail', message });
    console.error(`❌ ${message}`);
  }

  warn(message) {
    this.testResults.warnings++;
    this.testResults.details.push({ type: 'warn', message });
    console.warn(`⚠️ ${message}`);
  }

  log(message) {
    console.log(`📝 ${message}`);
  }

  displayResults() {
    const total = this.testResults.passed + this.testResults.failed + this.testResults.warnings;
    const successRate = ((this.testResults.passed / total) * 100).toFixed(1);
    
    console.log('\n' + '='.repeat(60));
    console.log('🧪 AL-SHARIQAH THEME OPTIMIZATION TEST RESULTS');
    console.log('='.repeat(60));
    console.log(`✅ Passed: ${this.testResults.passed}`);
    console.log(`❌ Failed: ${this.testResults.failed}`);
    console.log(`⚠️ Warnings: ${this.testResults.warnings}`);
    console.log(`📊 Success Rate: ${successRate}%`);
    console.log('='.repeat(60));
    
    if (this.testResults.failed === 0) {
      console.log('🎉 ALL CRITICAL TESTS PASSED! Theme optimization is working correctly.');
    } else if (this.testResults.failed <= 2) {
      console.log('✨ Most tests passed with minor issues. Check failed tests above.');
    } else {
      console.log('⚠️ Several tests failed. Review the issues above before deployment.');
    }
    
    // Store results globally for debugging
    window.AlShariqahTheme = window.AlShariqahTheme || {};
    window.AlShariqahTheme.TestResults = this.testResults;
  }
}

// Auto-run tests when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => new OptimizationTestSuite(), 1000);
  });
} else {
  setTimeout(() => new OptimizationTestSuite(), 1000);
}
