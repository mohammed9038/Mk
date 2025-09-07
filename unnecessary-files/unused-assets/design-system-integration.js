/* ===================================================================
   AL-SHARIQAH THEME - PHASE 5 DESIGN SYSTEM INTEGRATION
   Master integration file for design flexibility system
   =================================================================== */

class DesignSystemIntegration {
  constructor() {
    this.version = '5.0.0';
    this.isInitialized = false;
    this.components = new Set();
    this.init();
  }

  async init() {
    console.log(`🎨 AL-Shariqah Design System v${this.version} - Initializing...`);
    
    // Load core dependencies
    await this.loadCoreDependencies();
    
    // Initialize components
    this.initializeComponents();
    
    // Setup design system
    this.setupDesignSystem();
    
    // Enable live customization
    this.enableLiveCustomization();
    
    // Setup performance monitoring
    this.setupPerformanceMonitoring();
    
    this.isInitialized = true;
    console.log('✅ Design System initialized successfully');
    
    // Dispatch ready event
    document.dispatchEvent(new CustomEvent('designSystem:ready', {
      detail: { version: this.version }
    }));
  }

  async loadCoreDependencies() {
    const dependencies = [
      'advanced-component-manager.js',
      'enhanced-product-components.js',
      'live-customization-panel.js'
    ];

    // Check if dependencies are already loaded
    const loadPromises = dependencies.map(dep => {
      return new Promise((resolve) => {
        if (document.querySelector(`script[src*="${dep}"]`)) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = `/assets/${dep}`;
        script.onload = resolve;
        script.onerror = () => {
          console.warn(`Failed to load ${dep}, continuing...`);
          resolve();
        };
        document.head.appendChild(script);
      });
    });

    await Promise.all(loadPromises);
  }

  initializeComponents() {
    // Register enhanced navigation component
    if (window.AdvancedComponentManager) {
      this.registerNavigationComponent();
      this.registerFormComponents();
      this.registerUtilityComponents();
    }
  }

  registerNavigationComponent() {
    window.AdvancedComponentManager.registerComponent('enhanced-navigation', {
      name: 'enhanced-navigation',
      selector: '.enhanced-nav, .header__navigation',
      designTokens: {
        '--nav-background': '--color-background',
        '--nav-text': '--color-foreground',
        '--nav-hover': '--color-primary'
      },
      animations: [
        {
          trigger: 'scroll',
          name: 'fadeIn',
          once: true
        }
      ],
      init(element, tokens) {
        this.setupStickyNav(element);
        this.setupMobileToggle(element);
        this.setupSearchToggle(element);
      },

      setupStickyNav(nav) {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
          const currentScrollY = window.scrollY;
          
          if (currentScrollY > 100) {
            nav.classList.add('nav--sticky');
            
            if (currentScrollY > lastScrollY) {
              nav.classList.add('nav--hidden');
            } else {
              nav.classList.remove('nav--hidden');
            }
          } else {
            nav.classList.remove('nav--sticky', 'nav--hidden');
          }
          
          lastScrollY = currentScrollY;
        });
      },

      setupMobileToggle(nav) {
        const toggle = nav.querySelector('.mobile-nav-toggle');
        const menu = nav.querySelector('.nav__menu');
        
        if (toggle && menu) {
          toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
            toggle.classList.toggle('active');
            document.body.classList.toggle('nav-open');
          });
        }
      },

      setupSearchToggle(nav) {
        const searchToggle = nav.querySelector('.search-toggle');
        const searchForm = nav.querySelector('.search-form');
        
        if (searchToggle && searchForm) {
          searchToggle.addEventListener('click', () => {
            searchForm.classList.toggle('active');
            if (searchForm.classList.contains('active')) {
              searchForm.querySelector('input')?.focus();
            }
          });
        }
      }
    });
  }

  registerFormComponents() {
    window.AdvancedComponentManager.registerComponent('enhanced-forms', {
      name: 'enhanced-forms',
      selector: '.enhanced-form, .contact-form, .newsletter-form',
      designTokens: {
        '--form-background': '--color-background',
        '--form-border': '--color-border',
        '--form-focus': '--color-primary'
      },
      init(element, tokens) {
        this.setupFormValidation(element);
        this.setupFormAnimations(element);
      },

      setupFormValidation(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
          input.addEventListener('blur', () => {
            this.validateField(input);
          });
          
          input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
              this.validateField(input);
            }
          });
        });
        
        form.addEventListener('submit', (e) => {
          let isValid = true;
          
          inputs.forEach(input => {
            if (!this.validateField(input)) {
              isValid = false;
            }
          });
          
          if (!isValid) {
            e.preventDefault();
          }
        });
      },

      validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        // Remove existing error
        field.classList.remove('error');
        const existingError = field.parentElement.querySelector('.field-error');
        if (existingError) existingError.remove();

        // Required validation
        if (field.hasAttribute('required') && !value) {
          isValid = false;
          message = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            isValid = false;
            message = 'Please enter a valid email address';
          }
        }

        // Phone validation
        if (field.type === 'tel' && value) {
          const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
          if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            isValid = false;
            message = 'Please enter a valid phone number';
          }
        }

        if (!isValid) {
          field.classList.add('error');
          const errorElement = document.createElement('div');
          errorElement.className = 'field-error';
          errorElement.textContent = message;
          field.parentElement.appendChild(errorElement);
        }

        return isValid;
      },

      setupFormAnimations(form) {
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
          // Floating label effect
          if (input.nextElementSibling?.classList.contains('floating-label')) {
            const updateLabel = () => {
              if (input.value || input === document.activeElement) {
                input.nextElementSibling.classList.add('active');
              } else {
                input.nextElementSibling.classList.remove('active');
              }
            };
            
            input.addEventListener('focus', updateLabel);
            input.addEventListener('blur', updateLabel);
            input.addEventListener('input', updateLabel);
            updateLabel(); // Initial state
          }
        });
      }
    });
  }

  registerUtilityComponents() {
    // Scroll animations
    window.AdvancedComponentManager.registerComponent('scroll-animations', {
      name: 'scroll-animations',
      selector: '[data-animate]',
      lazy: true,
      animations: [
        {
          trigger: 'scroll',
          name: 'fadeIn',
          threshold: 0.2,
          once: true
        }
      ],
      init(element, tokens) {
        const animationType = element.dataset.animate || 'fadeIn';
        const delay = parseInt(element.dataset.delay) || 0;
        
        setTimeout(() => {
          window.AdvancedComponentManager.createAnimation(element, animationType);
        }, delay);
      }
    });

    // Lazy loading images
    window.AdvancedComponentManager.registerComponent('lazy-images', {
      name: 'lazy-images',
      selector: 'img[data-src], source[data-srcset]',
      lazy: true,
      init(element, tokens) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
              }
              
              if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
                img.removeAttribute('data-srcset');
              }
              
              img.classList.add('loaded');
              observer.unobserve(img);
            }
          });
        }, {
          rootMargin: '50px',
          threshold: 0.1
        });
        
        observer.observe(element);
      }
    });
  }

  setupDesignSystem() {
    // Load dynamic styles
    this.loadDynamicStyles();
    
    // Setup theme persistence
    this.setupThemePersistence();
    
    // Setup responsive design tokens
    this.setupResponsiveTokens();
  }

  loadDynamicStyles() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/assets/dynamic-styles.liquid';
    document.head.appendChild(link);

    const customizationLink = document.createElement('link');
    customizationLink.rel = 'stylesheet';
    customizationLink.href = '/assets/live-customization-panel.css';
    document.head.appendChild(customizationLink);
  }

  setupThemePersistence() {
    // Apply saved theme on page load
    const savedTheme = localStorage.getItem('al-shariqah-theme-settings');
    if (savedTheme) {
      try {
        const theme = JSON.parse(savedTheme);
        this.applyThemeTokens(theme);
      } catch (e) {
        console.warn('Failed to parse saved theme settings');
      }
    }
  }

  applyThemeTokens(theme) {
    const root = document.documentElement;
    
    Object.entries(theme).forEach(([key, value]) => {
      const cssProperty = `--theme-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssProperty, value);
    });
  }

  setupResponsiveTokens() {
    const updateTokens = () => {
      const root = document.documentElement;
      const width = window.innerWidth;
      
      // Responsive spacing
      if (width < 768) {
        root.style.setProperty('--responsive-spacing', '0.75');
        root.style.setProperty('--responsive-font-scale', '0.9');
      } else if (width < 1024) {
        root.style.setProperty('--responsive-spacing', '0.875');
        root.style.setProperty('--responsive-font-scale', '0.95');
      } else {
        root.style.setProperty('--responsive-spacing', '1');
        root.style.setProperty('--responsive-font-scale', '1');
      }
    };

    updateTokens();
    window.addEventListener('resize', updateTokens);
  }

  enableLiveCustomization() {
    // Live customization panel is loaded separately
    // This ensures it's available for users who want to customize
    if (window.LiveCustomizationPanel) {
      console.log('🎨 Live customization panel ready');
    }
  }

  setupPerformanceMonitoring() {
    // Monitor component initialization performance
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.name.includes('design-system')) {
          console.log(`⚡ ${entry.name}: ${entry.duration.toFixed(2)}ms`);
        }
      });
    });

    observer.observe({ entryTypes: ['measure', 'navigation'] });

    // Track component loading
    document.addEventListener('designSystem:componentLoaded', (e) => {
      console.log(`✅ Component loaded: ${e.detail.name}`);
    });
  }

  // Public API methods
  getVersion() {
    return this.version;
  }

  isReady() {
    return this.isInitialized;
  }

  registerCustomComponent(name, config) {
    if (window.AdvancedComponentManager) {
      window.AdvancedComponentManager.registerComponent(name, config);
      this.components.add(name);
    }
  }

  getDesignToken(path) {
    if (window.AdvancedComponentManager) {
      return window.AdvancedComponentManager.getDesignToken(path);
    }
    return null;
  }

  setDesignToken(path, value) {
    if (window.AdvancedComponentManager) {
      window.AdvancedComponentManager.setDesignToken(path, value);
    }
  }

  enableDebugMode() {
    if (window.AdvancedComponentManager) {
      window.AdvancedComponentManager.enableDebugMode();
    }
    console.log('🐛 Design System Debug Mode Enabled');
    console.log('Registered Components:', Array.from(this.components));
  }
}

// Initialize Design System
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.ALShariqahDesignSystem = new DesignSystemIntegration();
  });
} else {
  window.ALShariqahDesignSystem = new DesignSystemIntegration();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DesignSystemIntegration;
}
