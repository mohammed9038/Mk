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
      return; // Already initialized
    }

    try {
      this.detectDevice();
      this.setupEventListeners();
      this.initDropdowns();
      this.initLanguageSelector();
      this.handleResize();
      
      this.initialized = true;
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
    // Use more flexible selectors to catch any dropdown structure
    const dropdownSelectors = [
      'details[id^="Details-HeaderMenu-"]',
      'details[id^="Details-HeaderLanguage-"]', 
      'header-menu details',
      '.header__inline-menu details',
      'nav details'
    ];
    
    let allDropdowns = [];
    dropdownSelectors.forEach(selector => {
      const found = document.querySelectorAll(selector);
      found.forEach(dropdown => {
        if (!allDropdowns.includes(dropdown)) {
          allDropdowns.push(dropdown);
        }
      });
    });
    
    // Filter to only navigation-related dropdowns (not other details elements)
    const navigationDropdowns = allDropdowns.filter(dropdown => {
      return dropdown.closest('.header__inline-menu') || 
             dropdown.closest('nav') ||
             dropdown.id.includes('HeaderMenu') ||
             dropdown.id.includes('HeaderLanguage') ||
             dropdown.querySelector('.header__submenu');
    });
    
    navigationDropdowns.forEach((dropdown, index) => {
      this.setupDropdown(dropdown, index);
    });

    // Initialized ${navigationDropdowns.length} dropdown menus
    
    if (navigationDropdowns.length === 0) {
      console.warn('[NavigationController] No dropdown menus found. This might indicate:');
      console.warn('  - No menu is selected in theme settings');
      console.warn('  - Selected menu has no dropdown items'); 
      console.warn('  - Menu structure has changed');
      
      // Try to re-initialize after a short delay in case menus are loading dynamically
      setTimeout(() => {
        console.log('[NavigationController] Retrying dropdown initialization...');
        this.initDropdowns();
      }, 1000);
    }
  }

  /**
   * Setup individual dropdown
   */
  setupDropdown(dropdown, index) {
    if (!dropdown || dropdown.dataset.navigationSetup) return;

    const summary = dropdown.querySelector('summary');
    const submenu = dropdown.querySelector(this.selectors.dropdownMenu);
    
    if (!summary || !submenu) {
      return; // Skip invalid dropdown structure
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
    
    // FIXED: Allow clicks on desktop for proper dropdown functionality
    // The hover functionality will still work, but clicks are now supported too
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
      // Clear any pending close timeout
      if (dropdown._closeTimeout) {
        clearTimeout(dropdown._closeTimeout);
        dropdown._closeTimeout = null;
      }
      this.openDropdown(dropdown);
    } else if (action === 'leave') {
      // Add small delay to prevent accidental closes
      dropdown._closeTimeout = setTimeout(() => {
        if (!dropdown.matches(':hover')) {
          this.closeDropdown(dropdown);
        }
      }, 150); // Increased delay for better UX
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

    // Watch for GTranslate loading with improved detection
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.matches('.gtranslate_wrapper, .gt-widget-dropdown') || 
                  node.querySelector('.gtranslate_wrapper, .gt-widget-dropdown') ||
                  (node.classList && node.classList.contains('gt-widget-dropdown'))) {
                console.log('[NavigationController] GTranslate widget detected, enhancing...');
                this.enhanceGTranslate();
                observer.disconnect(); // Stop observing once found
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

    // Also check periodically for GTranslate script availability
    let checkCount = 0;
    const checkScript = () => {
      checkCount++;
      if (window.gt_widget_script || document.querySelector('.gt-widget-dropdown')) {
        console.log('[NavigationController] GTranslate script detected via polling');
        this.enhanceGTranslate();
        observer.disconnect();
      } else if (checkCount < 50) { // Check for 5 seconds
        setTimeout(checkScript, 100);
      } else {
        observer.disconnect();
        console.warn('[NavigationController] GTranslate initialization timeout after 5 seconds');
      }
    };
    
    setTimeout(checkScript, 100);
  }

  /**
   * Enhance GTranslate functionality
   */
  enhanceGTranslate() {
    const wrappers = document.querySelectorAll(this.selectors.languageSelector);
    const gtWidgets = document.querySelectorAll('.gt-widget-dropdown, .gtranslate_wrapper');
    
    // Process both our selectors and actual GTranslate widgets
    const allLanguageElements = [...wrappers, ...gtWidgets];
    
    allLanguageElements.forEach(wrapper => {
      if (wrapper.dataset.enhanced) return;
      wrapper.dataset.enhanced = 'true';

      // Add custom styling and behavior
      wrapper.style.transition = 'all 0.3s ease';
      
      // Ensure it closes when clicking outside
      wrapper.addEventListener('click', (e) => e.stopPropagation());
      
      // Add specific handling for GTranslate widgets
      if (wrapper.classList.contains('gt-widget-dropdown')) {
        wrapper.style.position = 'relative';
        wrapper.style.zIndex = '1000';
        
        // Fix dropdown positioning issues
        const dropdown = wrapper.querySelector('.gt-dropdown');
        if (dropdown) {
          dropdown.style.position = 'absolute';
          dropdown.style.top = '100%';
          dropdown.style.right = '0';
        }
      }
    });

    console.log(`[NavigationController] Enhanced ${allLanguageElements.length} language selector elements`);
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

  /**
   * Validate GTranslate integration
   */
  validateGTranslateIntegration() {
    console.log('[NavigationController] Validating GTranslate integration...');
    
    const gtWidgets = document.querySelectorAll('.gt-widget-dropdown');
    const wrappers = document.querySelectorAll('.gtranslate_wrapper');
    const headerContainers = document.querySelectorAll('.header-gtranslate');
    
    console.log(`Found ${gtWidgets.length} GTranslate widgets`);
    console.log(`Found ${wrappers.length} GTranslate wrappers`);
    console.log(`Found ${headerContainers.length} header containers`);
    
    if (gtWidgets.length > 0) {
      this.enhanceGTranslate();
      return true;
    }
    
    return false;
  }

  /**
   * Refresh/re-scan navigation elements
   * Call this when menus might have changed dynamically
   */
  refreshNavigation() {
    console.log('[NavigationController] Refreshing navigation...');
    
    // Clear existing state
    this.state.activeDropdowns.clear();
    
    // Re-initialize dropdowns and language selectors
    this.initDropdowns();
    this.initLanguageSelector();
    
    console.log('[NavigationController] Navigation refresh complete');
  }

  /**
   * Debug current navigation state
   */
  debugNavigation() {
    console.log('[NavigationController] === DEBUG INFORMATION ===');
    console.log('Initialized:', this.initialized);
    console.log('Current breakpoint:', this.state.currentBreakpoint);
    console.log('Touch device:', this.state.touchDevice);
    console.log('Active dropdowns:', this.state.activeDropdowns.size);
    
    // Check for navigation elements
    const navContainers = document.querySelectorAll('.header__inline-menu');
    const allDetails = document.querySelectorAll('details');
    const headerMenus = document.querySelectorAll('header-menu');
    const gtWidgets = document.querySelectorAll('.gt-widget-dropdown, .gtranslate_wrapper');
    
    console.log('Navigation containers found:', navContainers.length);
    console.log('Total details elements:', allDetails.length);
    console.log('Header menu elements:', headerMenus.length);
    console.log('GTranslate widgets:', gtWidgets.length);
    
    // Test selectors
    const detectedDropdowns = document.querySelectorAll(this.selectors.dropdownTrigger);
    console.log('Detected dropdown triggers:', detectedDropdowns.length);
    
    console.log('[NavigationController] === END DEBUG ===');
    
    return {
      initialized: this.initialized,
      breakpoint: this.state.currentBreakpoint,
      touchDevice: this.state.touchDevice,
      activeDropdowns: this.state.activeDropdowns.size,
      navContainers: navContainers.length,
      detailsElements: allDetails.length,
      headerMenus: headerMenus.length,
      gtWidgets: gtWidgets.length,
      detectedDropdowns: detectedDropdowns.length
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
