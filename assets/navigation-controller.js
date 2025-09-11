/**
 * Professional Navigation Controller
 * Handles dropdown menus, language selectors, and mobile navigation
 * 
 * @version 2.0.0
 * @author Professional Theme Development Team
 */

class NavigationController {
  constructor() {
    this.initialized = false;
    this.config = {
      breakpoint: 990,
      animationDuration: 200,
      closeOnOutsideClick: true,
      enableKeyboardNavigation: true,
      enableHoverOnDesktop: true,
      touchSupport: true
    };
    
    this.state = {
      activeDropdowns: new Set(),
      touchDevice: false,
      currentBreakpoint: 'desktop'
    };

    this.selectors = {
      navigation: '.header__inline-menu',
      dropdownTrigger: 'details[id^="Details-HeaderMenu-"], details[id^="Details-HeaderLanguage-"]',
      dropdownMenu: '.header__submenu',
      languageSelector: '.gtranslate_wrapper, .header__language-selector',
      languageTrigger: '.gtranslate-trigger, [data-gtranslate-trigger], .header__language-selector summary',
      mobileMenu: '.menu-drawer'
    };

    this.init();
  }

  /**
   * Initialize the navigation controller
   */
  init() {
    if (this.initialized) {
      console.warn('[NavigationController] Already initialized');
      return;
    }

    try {
      this.detectDevice();
      this.setupEventListeners();
      this.initDropdowns();
      this.initLanguageSelector();
      this.handleResize();
      
      this.initialized = true;
      console.log('[NavigationController] Initialized successfully');
    } catch (error) {
      console.error('[NavigationController] Initialization failed:', error);
    }
  }

  /**
   * Detect device capabilities
   */
  detectDevice() {
    this.state.touchDevice = (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );

    this.updateBreakpoint();
  }

  /**
   * Update current breakpoint
   */
  updateBreakpoint() {
    const width = window.innerWidth;
    this.state.currentBreakpoint = width >= this.config.breakpoint ? 'desktop' : 'mobile';
  }

  /**
   * Setup global event listeners
   */
  setupEventListeners() {
    // Resize handler with debouncing
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => this.handleResize(), 100);
    });

    // Global click handler for closing dropdowns
    if (this.config.closeOnOutsideClick) {
      document.addEventListener('click', (e) => this.handleGlobalClick(e));
    }

    // Global keyboard handler
    if (this.config.enableKeyboardNavigation) {
      document.addEventListener('keydown', (e) => this.handleGlobalKeydown(e));
    }

    // Focus management
    document.addEventListener('focusin', (e) => this.handleFocusIn(e));
    document.addEventListener('focusout', (e) => this.handleFocusOut(e));
  }

  /**
   * Initialize dropdown menus
   */
  initDropdowns() {
    const dropdowns = document.querySelectorAll(this.selectors.dropdownTrigger);
    
    dropdowns.forEach((dropdown, index) => {
      this.setupDropdown(dropdown, index);
    });

    console.log(`[NavigationController] Initialized ${dropdowns.length} dropdown menus`);
  }

  /**
   * Setup individual dropdown
   */
  setupDropdown(dropdown, index) {
    if (!dropdown || dropdown.dataset.navigationSetup) return;

    const summary = dropdown.querySelector('summary');
    const submenu = dropdown.querySelector(this.selectors.dropdownMenu);
    
    if (!summary || !submenu) {
      console.warn('[NavigationController] Invalid dropdown structure:', dropdown);
      return;
    }

    // Mark as setup
    dropdown.dataset.navigationSetup = 'true';
    dropdown.dataset.dropdownIndex = index;

    // Setup click handler
    summary.addEventListener('click', (e) => this.handleDropdownClick(e, dropdown));

    // Setup hover handlers for desktop
    if (this.config.enableHoverOnDesktop) {
      dropdown.addEventListener('mouseenter', (e) => this.handleDropdownHover(e, dropdown, 'enter'));
      dropdown.addEventListener('mouseleave', (e) => this.handleDropdownHover(e, dropdown, 'leave'));
    }

    // Setup keyboard navigation
    summary.addEventListener('keydown', (e) => this.handleDropdownKeydown(e, dropdown));

    // Setup ARIA attributes
    this.setupDropdownAria(dropdown, summary, submenu);
  }

  /**
   * Setup ARIA attributes for accessibility
   */
  setupDropdownAria(dropdown, summary, submenu) {
    const dropdownId = dropdown.id || `dropdown-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const submenuId = submenu.id || `${dropdownId}-submenu`;

    dropdown.id = dropdownId;
    submenu.id = submenuId;
    
    summary.setAttribute('aria-expanded', 'false');
    summary.setAttribute('aria-controls', submenuId);
    summary.setAttribute('aria-haspopup', 'true');
    
    submenu.setAttribute('aria-labelledby', dropdownId);
    submenu.setAttribute('role', 'menu');
  }

  /**
   * Handle dropdown click events
   */
  handleDropdownClick(event, dropdown) {
    event.preventDefault();
    event.stopPropagation();

    const isOpen = dropdown.hasAttribute('open');
    
    if (this.state.currentBreakpoint === 'desktop' && !this.state.touchDevice) {
      // Desktop: prevent default click, use hover instead
      return;
    }

    // Mobile or touch device: handle click
    if (isOpen) {
      this.closeDropdown(dropdown);
    } else {
      this.openDropdown(dropdown);
    }
  }

  /**
   * Handle dropdown hover events
   */
  handleDropdownHover(event, dropdown, action) {
    if (this.state.currentBreakpoint !== 'desktop' || this.state.touchDevice) {
      return; // Only handle hover on desktop non-touch devices
    }

    if (action === 'enter') {
      this.openDropdown(dropdown);
    } else if (action === 'leave') {
      // Add small delay to prevent accidental closes
      setTimeout(() => {
        if (!dropdown.matches(':hover')) {
          this.closeDropdown(dropdown);
        }
      }, 100);
    }
  }

  /**
   * Handle dropdown keyboard navigation
   */
  handleDropdownKeydown(event, dropdown) {
    const { key } = event;
    
    switch (key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.toggleDropdown(dropdown);
        break;
      
      case 'Escape':
        this.closeDropdown(dropdown);
        dropdown.querySelector('summary').focus();
        break;
      
      case 'ArrowDown':
        event.preventDefault();
        this.openDropdown(dropdown);
        this.focusFirstMenuItem(dropdown);
        break;
      
      case 'ArrowUp':
        event.preventDefault();
        this.openDropdown(dropdown);
        this.focusLastMenuItem(dropdown);
        break;
    }
  }

  /**
   * Open dropdown menu
   */
  openDropdown(dropdown) {
    if (!dropdown || dropdown.hasAttribute('open')) return;

    // Close other dropdowns first
    this.closeAllDropdowns(dropdown);

    // Open this dropdown
    dropdown.setAttribute('open', '');
    this.state.activeDropdowns.add(dropdown);

    // Update ARIA
    const summary = dropdown.querySelector('summary');
    if (summary) {
      summary.setAttribute('aria-expanded', 'true');
    }

    // Dispatch custom event
    dropdown.dispatchEvent(new CustomEvent('navigation:dropdown:open', {
      bubbles: true,
      detail: { dropdown }
    }));

    console.log('[NavigationController] Dropdown opened:', dropdown.id);
  }

  /**
   * Close dropdown menu
   */
  closeDropdown(dropdown) {
    if (!dropdown || !dropdown.hasAttribute('open')) return;

    dropdown.removeAttribute('open');
    this.state.activeDropdowns.delete(dropdown);

    // Update ARIA
    const summary = dropdown.querySelector('summary');
    if (summary) {
      summary.setAttribute('aria-expanded', 'false');
    }

    // Dispatch custom event
    dropdown.dispatchEvent(new CustomEvent('navigation:dropdown:close', {
      bubbles: true,
      detail: { dropdown }
    }));

    console.log('[NavigationController] Dropdown closed:', dropdown.id);
  }

  /**
   * Toggle dropdown menu
   */
  toggleDropdown(dropdown) {
    if (dropdown.hasAttribute('open')) {
      this.closeDropdown(dropdown);
    } else {
      this.openDropdown(dropdown);
    }
  }

  /**
   * Close all dropdown menus
   */
  closeAllDropdowns(except = null) {
    this.state.activeDropdowns.forEach(dropdown => {
      if (dropdown !== except) {
        this.closeDropdown(dropdown);
      }
    });
  }

  /**
   * Focus first menu item in dropdown
   */
  focusFirstMenuItem(dropdown) {
    const firstItem = dropdown.querySelector('.header__submenu a, .header__submenu button');
    if (firstItem) {
      firstItem.focus();
    }
  }

  /**
   * Focus last menu item in dropdown
   */
  focusLastMenuItem(dropdown) {
    const menuItems = dropdown.querySelectorAll('.header__submenu a, .header__submenu button');
    const lastItem = menuItems[menuItems.length - 1];
    if (lastItem) {
      lastItem.focus();
    }
  }

  /**
   * Initialize language selector
   */
  initLanguageSelector() {
    const triggers = document.querySelectorAll(this.selectors.languageTrigger);
    const wrappers = document.querySelectorAll(this.selectors.languageSelector);

    if (triggers.length === 0 && wrappers.length === 0) {
      console.log('[NavigationController] No language selector found');
      return;
    }

    // Setup language selector triggers
    triggers.forEach(trigger => {
      if (trigger.dataset.navigationSetup) return;
      trigger.dataset.navigationSetup = 'true';
      
      trigger.addEventListener('click', (e) => this.handleLanguageClick(e));
    });

    // Watch for GTranslate initialization
    this.watchGTranslateInit();

    console.log(`[NavigationController] Language selector initialized with ${triggers.length} triggers`);
  }

  /**
   * Handle language selector click
   */
  handleLanguageClick(event) {
    event.preventDefault();
    event.stopPropagation();

    const wrapper = document.querySelector(this.selectors.languageSelector);
    if (!wrapper) return;

    const isActive = wrapper.classList.contains('active');
    
    // Close any open dropdowns
    this.closeAllDropdowns();

    // Toggle language selector
    if (isActive) {
      wrapper.classList.remove('active', 'open');
    } else {
      wrapper.classList.add('active', 'open');
    }

    console.log('[NavigationController] Language selector toggled:', !isActive);
  }

  /**
   * Watch for GTranslate initialization
   */
  watchGTranslateInit() {
    // Check if GTranslate is already loaded
    if (window.gt_widget_script || window.gtranslateSettings) {
      this.enhanceGTranslate();
      return;
    }

    // Watch for GTranslate loading
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.matches('.gtranslate_wrapper') || 
                  node.querySelector('.gtranslate_wrapper')) {
                this.enhanceGTranslate();
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Stop observing after 10 seconds
    setTimeout(() => observer.disconnect(), 10000);
  }

  /**
   * Enhance GTranslate functionality
   */
  enhanceGTranslate() {
    const wrappers = document.querySelectorAll(this.selectors.languageSelector);
    
    wrappers.forEach(wrapper => {
      if (wrapper.dataset.enhanced) return;
      wrapper.dataset.enhanced = 'true';

      // Add custom styling and behavior
      wrapper.style.transition = 'all 0.3s ease';
      
      // Ensure it closes when clicking outside
      wrapper.addEventListener('click', (e) => e.stopPropagation());
    });

    console.log('[NavigationController] GTranslate enhanced');
  }

  /**
   * Handle global click events
   */
  handleGlobalClick(event) {
    const clickedDropdown = event.target.closest(this.selectors.dropdownTrigger);
    const clickedLanguage = event.target.closest(this.selectors.languageSelector + ', ' + this.selectors.languageTrigger);

    // Close dropdowns if clicked outside
    if (!clickedDropdown) {
      this.closeAllDropdowns();
    }

    // Close language selector if clicked outside
    if (!clickedLanguage) {
      const languageWrappers = document.querySelectorAll(this.selectors.languageSelector);
      languageWrappers.forEach(wrapper => {
        wrapper.classList.remove('active', 'open');
      });
    }
  }

  /**
   * Handle global keyboard events
   */
  handleGlobalKeydown(event) {
    if (event.key === 'Escape') {
      this.closeAllDropdowns();
      
      // Close language selector
      const languageWrappers = document.querySelectorAll(this.selectors.languageSelector);
      languageWrappers.forEach(wrapper => {
        wrapper.classList.remove('active', 'open');
      });
    }
  }

  /**
   * Handle focus in events
   */
  handleFocusIn(event) {
    // Keep dropdown open when focusing inside it
    const dropdown = event.target.closest(this.selectors.dropdownTrigger);
    if (dropdown && this.state.activeDropdowns.has(dropdown)) {
      // Dropdown should stay open
    }
  }

  /**
   * Handle focus out events
   */
  handleFocusOut(event) {
    // Close dropdown when focus leaves it entirely
    setTimeout(() => {
      const dropdown = event.target.closest(this.selectors.dropdownTrigger);
      if (dropdown && this.state.activeDropdowns.has(dropdown)) {
        const focusedElement = document.activeElement;
        if (!dropdown.contains(focusedElement)) {
          this.closeDropdown(dropdown);
        }
      }
    }, 100);
  }

  /**
   * Handle window resize
   */
  handleResize() {
    const oldBreakpoint = this.state.currentBreakpoint;
    this.updateBreakpoint();

    if (oldBreakpoint !== this.state.currentBreakpoint) {
      console.log('[NavigationController] Breakpoint changed:', this.state.currentBreakpoint);
      
      // Close all dropdowns on breakpoint change
      this.closeAllDropdowns();
      
      // Close language selector
      const languageWrappers = document.querySelectorAll(this.selectors.languageSelector);
      languageWrappers.forEach(wrapper => {
        wrapper.classList.remove('active', 'open');
      });
    }
  }

  /**
   * Destroy the navigation controller
   */
  destroy() {
    this.closeAllDropdowns();
    
    // Remove all event listeners would require storing them
    // For now, just mark as not initialized
    this.initialized = false;
    this.state.activeDropdowns.clear();
    
    console.log('[NavigationController] Destroyed');
  }

  /**
   * Get current state
   */
  getState() {
    return {
      initialized: this.initialized,
      activeDropdowns: Array.from(this.state.activeDropdowns),
      currentBreakpoint: this.state.currentBreakpoint,
      touchDevice: this.state.touchDevice
    };
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.navigationController = new NavigationController();
  });
} else {
  window.navigationController = new NavigationController();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NavigationController;
}
