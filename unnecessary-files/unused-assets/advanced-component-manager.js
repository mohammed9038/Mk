/* ===================================================================
   AL-SHARIQAH THEME - ADVANCED COMPONENT MANAGER
   Smart component loader with design system integration
   =================================================================== */

class AdvancedComponentManager {
  constructor() {
    this.components = new Map();
    this.loadedModules = new Set();
    this.designTokens = this.initializeDesignTokens();
    this.observeDesignChanges();
    this.setupAnimationSystem();
  }

  // Initialize design tokens from CSS custom properties
  initializeDesignTokens() {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    return {
      colors: {
        primary: computedStyle.getPropertyValue('--color-primary').trim(),
        secondary: computedStyle.getPropertyValue('--color-secondary').trim(),
        background: computedStyle.getPropertyValue('--color-background').trim(),
        foreground: computedStyle.getPropertyValue('--color-foreground').trim()
      },
      typography: {
        headingFont: computedStyle.getPropertyValue('--font-heading').trim(),
        bodyFont: computedStyle.getPropertyValue('--font-body').trim()
      },
      layout: {
        containerWidth: computedStyle.getPropertyValue('--container-max-width').trim(),
        sectionPadding: computedStyle.getPropertyValue('--section-padding').trim(),
        gridGap: computedStyle.getPropertyValue('--grid-gap').trim()
      },
      animation: {
        duration: computedStyle.getPropertyValue('--animation-duration').trim()
      }
    };
  }

  // Observe design token changes and update components
  observeDesignChanges() {
    const observer = new MutationObserver(() => {
      this.designTokens = this.initializeDesignTokens();
      this.updateComponents();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  }

  // Enhanced component registration with design system integration
  registerComponent(name, config) {
    const enhancedConfig = {
      ...config,
      designTokens: this.designTokens,
      applyDesignTokens: this.applyDesignTokens.bind(this),
      animate: this.createAnimation.bind(this)
    };

    this.components.set(name, enhancedConfig);
    
    // Auto-initialize if DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.initializeComponent(name);
      });
    } else {
      this.initializeComponent(name);
    }
  }

  // Smart component initialization with performance optimization
  async initializeComponent(name) {
    const config = this.components.get(name);
    if (!config) return;

    const elements = document.querySelectorAll(config.selector);
    if (elements.length === 0) return;

    // Lazy load component dependencies
    if (config.dependencies) {
      await this.loadDependencies(config.dependencies);
    }

    // Initialize with intersection observer for performance
    if (config.lazy) {
      this.setupLazyInitialization(elements, config);
    } else {
      this.initializeElements(elements, config);
    }
  }

  // Setup intersection observer for lazy component initialization
  setupLazyInitialization(elements, config) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.initializeElement(entry.target, config);
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '50px',
      threshold: 0.1
    });

    elements.forEach(element => observer.observe(element));
  }

  // Initialize multiple elements
  initializeElements(elements, config) {
    elements.forEach(element => this.initializeElement(element, config));
  }

  // Initialize single element with enhanced features
  initializeElement(element, config) {
    // Apply design tokens
    this.applyDesignTokens(element, config.designTokens || {});
    
    // Add accessibility features
    this.enhanceAccessibility(element, config);
    
    // Setup animations
    if (config.animations) {
      this.setupElementAnimations(element, config.animations);
    }
    
    // Initialize component logic
    if (config.init) {
      config.init.call(this, element, this.designTokens);
    }

    // Mark as initialized
    element.classList.add(`${config.name}--initialized`);
  }

  // Apply design tokens to element
  applyDesignTokens(element, tokens) {
    Object.entries(tokens).forEach(([property, value]) => {
      if (typeof value === 'string' && value.startsWith('--')) {
        // CSS custom property reference
        element.style.setProperty(property, `var(${value})`);
      } else {
        element.style.setProperty(property, value);
      }
    });
  }

  // Enhanced accessibility features
  enhanceAccessibility(element, config) {
    if (config.accessible !== false) {
      // Add ARIA attributes
      if (!element.getAttribute('role') && config.role) {
        element.setAttribute('role', config.role);
      }

      // Add keyboard navigation
      if (config.focusable) {
        element.setAttribute('tabindex', '0');
      }

      // Add reduced motion support
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        element.classList.add('reduce-motion');
      }
    }
  }

  // Setup animation system
  setupAnimationSystem() {
    // Create animation utilities
    this.animations = {
      fadeIn: {
        keyframes: [
          { opacity: 0, transform: 'translateY(20px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ],
        options: { duration: 600, easing: 'ease-out', fill: 'forwards' }
      },
      fadeInLeft: {
        keyframes: [
          { opacity: 0, transform: 'translateX(-20px)' },
          { opacity: 1, transform: 'translateX(0)' }
        ],
        options: { duration: 600, easing: 'ease-out', fill: 'forwards' }
      },
      slideIn: {
        keyframes: [
          { transform: 'translateX(-100%)' },
          { transform: 'translateX(0)' }
        ],
        options: { duration: 400, easing: 'ease-out', fill: 'forwards' }
      },
      bounce: {
        keyframes: [
          { transform: 'scale(1)' },
          { transform: 'scale(1.1)' },
          { transform: 'scale(1)' }
        ],
        options: { duration: 300, easing: 'ease-out' }
      }
    };
  }

  // Create animation with design system integration
  createAnimation(element, animationName, options = {}) {
    const animation = this.animations[animationName];
    if (!animation) return null;

    const mergedOptions = {
      ...animation.options,
      ...options,
      duration: parseInt(this.designTokens.animation.duration) || animation.options.duration
    };

    return element.animate(animation.keyframes, mergedOptions);
  }

  // Setup element animations
  setupElementAnimations(element, animations) {
    animations.forEach(animConfig => {
      if (animConfig.trigger === 'scroll') {
        this.setupScrollAnimation(element, animConfig);
      } else if (animConfig.trigger === 'hover') {
        this.setupHoverAnimation(element, animConfig);
      } else if (animConfig.trigger === 'click') {
        this.setupClickAnimation(element, animConfig);
      }
    });
  }

  // Setup scroll-triggered animations
  setupScrollAnimation(element, config) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.createAnimation(element, config.name, config.options);
          if (config.once) {
            observer.unobserve(element);
          }
        }
      });
    }, {
      threshold: config.threshold || 0.2,
      rootMargin: config.rootMargin || '0px'
    });

    observer.observe(element);
  }

  // Setup hover animations
  setupHoverAnimation(element, config) {
    element.addEventListener('mouseenter', () => {
      this.createAnimation(element, config.name, config.options);
    });

    if (config.reverse) {
      element.addEventListener('mouseleave', () => {
        this.createAnimation(element, config.reverse, config.options);
      });
    }
  }

  // Setup click animations
  setupClickAnimation(element, config) {
    element.addEventListener('click', (e) => {
      this.createAnimation(element, config.name, config.options);
      
      if (config.preventDefault) {
        e.preventDefault();
      }
    });
  }

  // Load component dependencies
  async loadDependencies(dependencies) {
    const loadPromises = dependencies.map(dep => {
      if (this.loadedModules.has(dep)) {
        return Promise.resolve();
      }

      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `/assets/${dep}.js`;
        script.onload = () => {
          this.loadedModules.add(dep);
          resolve();
        };
        script.onerror = reject;
        document.head.appendChild(script);
      });
    });

    await Promise.all(loadPromises);
  }

  // Update all components when design tokens change
  updateComponents() {
    this.components.forEach((config, name) => {
      const elements = document.querySelectorAll(`${config.selector}.${config.name}--initialized`);
      elements.forEach(element => {
        this.applyDesignTokens(element, config.designTokens || {});
      });
    });
  }

  // Get design token value
  getDesignToken(path) {
    return path.split('.').reduce((obj, key) => obj?.[key], this.designTokens);
  }

  // Set design token value
  setDesignToken(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((obj, key) => obj[key] = obj[key] || {}, this.designTokens);
    target[lastKey] = value;

    // Update CSS custom property
    const cssProperty = `--${path.replace(/\./g, '-')}`;
    document.documentElement.style.setProperty(cssProperty, value);
  }

  // Performance monitoring
  measurePerformance(componentName, fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    console.log(`Component ${componentName} initialized in ${end - start}ms`);
    return result;
  }

  // Debug mode
  enableDebugMode() {
    this.debugMode = true;
    console.log('Advanced Component Manager - Debug Mode Enabled');
    console.log('Registered Components:', Array.from(this.components.keys()));
    console.log('Design Tokens:', this.designTokens);
    console.log('Loaded Modules:', Array.from(this.loadedModules));
  }
}

// Initialize the component manager
window.AdvancedComponentManager = new AdvancedComponentManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdvancedComponentManager;
}
