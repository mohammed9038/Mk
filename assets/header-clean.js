/**
 * Clean Header JavaScript
 * Professional, modular header functionality
 * 
 * @version 3.0.0 - Professional Rebuild
 * @author Professional Development Team
 */

/* =============================================================================
   Professional Header Controller Class
   ============================================================================= */

class HeaderController {
  constructor() {
    this.header = null;
    this.mobileDrawer = null;
    this.isSticky = false;
    this.lastScrollY = 0;
    this.scrollThreshold = 100;
    this.isInitialized = false;
    
    // State management
    this.state = {
      isDrawerOpen: false,
      activeDropdown: null,
      isMobile: this.checkMobile(),
      scrollDirection: 'up'
    };
    
    // Bind methods
    this.handleScroll = this.handleScroll.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    
    this.init();
  }
  
  /* ---------------------------------------------------------------------------
     Initialization
     --------------------------------------------------------------------------- */
  
  init() {
    if (this.isInitialized) return;
    
    try {
      this.cacheElements();
      this.bindEvents();
      this.setupAccessibility();
      this.initializeComponents();
      
      this.isInitialized = true;
      
      // Dispatch ready event
      document.dispatchEvent(new CustomEvent('headerReady', {
        detail: { controller: this }
      }));
      
    } catch (error) {
      console.error('Header initialization failed:', error);
    }
  }
  
  cacheElements() {
    this.header = document.querySelector('.header-professional');
    this.mobileDrawer = document.querySelector('.mobile-drawer');
    this.mobileToggle = document.querySelector('.header-utilities__mobile-toggle');
    this.mobileClose = document.querySelector('.mobile-drawer__close');
    this.drawerOverlay = document.querySelector('.mobile-drawer__overlay');
    this.dropdowns = document.querySelectorAll('.header-nav__dropdown, .header-utilities__dropdown');
    this.cartCounter = document.querySelector('.header-utilities__cart-count');
    
    if (!this.header) {
      throw new Error('Header element not found');
    }
  }
  
  bindEvents() {
    // Scroll events for sticky header
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    window.addEventListener('resize', this.handleResize, { passive: true });
    
    // Global keyboard navigation
    document.addEventListener('keydown', this.handleKeydown);
    
    // Click outside to close dropdowns
    document.addEventListener('click', this.handleClickOutside);
    
    // Mobile drawer events
    if (this.mobileToggle) {
      this.mobileToggle.addEventListener('click', () => this.openDrawer());
    }
    
    if (this.mobileClose) {
      this.mobileClose.addEventListener('click', () => this.closeDrawer());
    }
    
    if (this.drawerOverlay) {
      this.drawerOverlay.addEventListener('click', () => this.closeDrawer());
    }
    
    // Dropdown events
    this.dropdowns.forEach(dropdown => {
      const summary = dropdown.querySelector('summary');
      if (summary) {
        summary.addEventListener('click', (e) => this.handleDropdownClick(e, dropdown));
      }
    });
  }
  
  setupAccessibility() {
    // Add ARIA attributes
    if (this.mobileToggle) {
      this.mobileToggle.setAttribute('aria-expanded', 'false');
      this.mobileToggle.setAttribute('aria-controls', 'mobile-drawer');
      this.mobileToggle.setAttribute('aria-label', 'Open navigation menu');
    }
    
    if (this.mobileDrawer) {
      this.mobileDrawer.setAttribute('id', 'mobile-drawer');
      this.mobileDrawer.setAttribute('aria-modal', 'true');
      this.mobileDrawer.setAttribute('role', 'dialog');
      this.mobileDrawer.setAttribute('aria-labelledby', 'mobile-drawer-title');
    }
    
    // Dropdown accessibility
    this.dropdowns.forEach((dropdown, index) => {
      const summary = dropdown.querySelector('summary');
      const submenu = dropdown.querySelector('ul');
      
      if (summary && submenu) {
        const id = `dropdown-${index}`;
        summary.setAttribute('aria-expanded', 'false');
        summary.setAttribute('aria-controls', id);
        submenu.setAttribute('id', id);
      }
    });
  }
  
  initializeComponents() {
    // Initialize cart counter
    this.updateCartCounter();
    
    // Set initial mobile state
    this.handleResize();
    
    // Initialize sticky header if needed
    this.handleScroll();
  }
  
  /* ---------------------------------------------------------------------------
     Mobile Detection
     --------------------------------------------------------------------------- */
  
  checkMobile() {
    return window.innerWidth <= 989;
  }
  
  /* ---------------------------------------------------------------------------
     Scroll Handling
     --------------------------------------------------------------------------- */
  
  handleScroll() {
    const currentScrollY = window.scrollY;
    const scrollDirection = currentScrollY > this.lastScrollY ? 'down' : 'up';
    
    this.state.scrollDirection = scrollDirection;
    
    // Sticky header logic
    if (currentScrollY > this.scrollThreshold) {
      if (!this.isSticky) {
        this.enableStickyHeader();
      }
      
      // Hide/show header based on scroll direction
      if (scrollDirection === 'down' && currentScrollY > this.lastScrollY + 50) {
        this.hideHeader();
      } else if (scrollDirection === 'up') {
        this.showHeader();
      }
    } else {
      if (this.isSticky) {
        this.disableStickyHeader();
      }
    }
    
    this.lastScrollY = currentScrollY;
  }
  
  enableStickyHeader() {
    this.isSticky = true;
    this.header.classList.add('header-professional--sticky');
    document.body.style.paddingTop = `${this.header.offsetHeight}px`;
  }
  
  disableStickyHeader() {
    this.isSticky = false;
    this.header.classList.remove('header-professional--sticky', 'header-professional--hidden');
    document.body.style.paddingTop = '';
  }
  
  hideHeader() {
    this.header.classList.add('header-professional--hidden');
  }
  
  showHeader() {
    this.header.classList.remove('header-professional--hidden');
  }
  
  /* ---------------------------------------------------------------------------
     Responsive Handling
     --------------------------------------------------------------------------- */
  
  handleResize() {
    const wasMobile = this.state.isMobile;
    this.state.isMobile = this.checkMobile();
    
    // Close drawer if switching from mobile to desktop
    if (wasMobile && !this.state.isMobile && this.state.isDrawerOpen) {
      this.closeDrawer();
    }
    
    // Close dropdowns on resize
    this.closeAllDropdowns();
  }
  
  /* ---------------------------------------------------------------------------
     Keyboard Navigation
     --------------------------------------------------------------------------- */
  
  handleKeydown(event) {
    switch (event.key) {
      case 'Escape':
        if (this.state.isDrawerOpen) {
          this.closeDrawer();
        } else if (this.state.activeDropdown) {
          this.closeDropdown(this.state.activeDropdown);
        }
        break;
        
      case 'Tab':
        this.handleTabNavigation(event);
        break;
    }
  }
  
  handleTabNavigation(event) {
    // Trap focus in mobile drawer when open
    if (this.state.isDrawerOpen && this.mobileDrawer) {
      const focusableElements = this.mobileDrawer.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }
  
  /* ---------------------------------------------------------------------------
     Mobile Drawer
     --------------------------------------------------------------------------- */
  
  openDrawer() {
    this.state.isDrawerOpen = true;
    this.mobileDrawer?.classList.add('mobile-drawer--open');
    
    if (this.mobileToggle) {
      this.mobileToggle.setAttribute('aria-expanded', 'true');
    }
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Focus first focusable element
    const firstFocusable = this.mobileDrawer?.querySelector('a, button, input');
    firstFocusable?.focus();
    
    // Dispatch event
    document.dispatchEvent(new CustomEvent('drawerOpen'));
  }
  
  closeDrawer() {
    this.state.isDrawerOpen = false;
    this.mobileDrawer?.classList.remove('mobile-drawer--open');
    
    if (this.mobileToggle) {
      this.mobileToggle.setAttribute('aria-expanded', 'false');
      this.mobileToggle.focus();
    }
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Dispatch event
    document.dispatchEvent(new CustomEvent('drawerClose'));
  }
  
  /* ---------------------------------------------------------------------------
     Dropdown Management
     --------------------------------------------------------------------------- */
  
  handleDropdownClick(event, dropdown) {
    event.preventDefault();
    
    if (dropdown.hasAttribute('open')) {
      this.closeDropdown(dropdown);
    } else {
      this.openDropdown(dropdown);
    }
  }
  
  openDropdown(dropdown) {
    // Close other dropdowns first
    this.closeAllDropdowns();
    
    dropdown.setAttribute('open', '');
    this.state.activeDropdown = dropdown;
    
    const summary = dropdown.querySelector('summary');
    if (summary) {
      summary.setAttribute('aria-expanded', 'true');
    }
    
    // Dispatch event
    document.dispatchEvent(new CustomEvent('dropdownOpen', {
      detail: { dropdown }
    }));
  }
  
  closeDropdown(dropdown) {
    dropdown.removeAttribute('open');
    
    if (this.state.activeDropdown === dropdown) {
      this.state.activeDropdown = null;
    }
    
    const summary = dropdown.querySelector('summary');
    if (summary) {
      summary.setAttribute('aria-expanded', 'false');
    }
    
    // Dispatch event
    document.dispatchEvent(new CustomEvent('dropdownClose', {
      detail: { dropdown }
    }));
  }
  
  closeAllDropdowns() {
    this.dropdowns.forEach(dropdown => {
      if (dropdown.hasAttribute('open')) {
        this.closeDropdown(dropdown);
      }
    });
  }
  
  handleClickOutside(event) {
    // Close dropdowns if clicking outside
    if (this.state.activeDropdown && !this.state.activeDropdown.contains(event.target)) {
      this.closeDropdown(this.state.activeDropdown);
    }
  }
  
  /* ---------------------------------------------------------------------------
     Cart Integration
     --------------------------------------------------------------------------- */
  
  updateCartCounter(count) {
    if (!this.cartCounter) return;
    
    if (count === undefined) {
      // Fetch cart count from Shopify
      fetch('/cart.json')
        .then(response => response.json())
        .then(cart => {
          this.setCartCount(cart.item_count);
        })
        .catch(error => {
          console.warn('Failed to fetch cart count:', error);
        });
    } else {
      this.setCartCount(count);
    }
  }
  
  setCartCount(count) {
    if (!this.cartCounter) return;
    
    this.cartCounter.textContent = count;
    this.cartCounter.style.display = count > 0 ? 'flex' : 'none';
    
    // Update aria-label for accessibility
    const cartLink = this.cartCounter.closest('a');
    if (cartLink) {
      cartLink.setAttribute('aria-label', `Shopping cart with ${count} items`);
    }
  }
  
  /* ---------------------------------------------------------------------------
     Public API
     --------------------------------------------------------------------------- */
  
  // Public methods for external integration
  getState() {
    return { ...this.state };
  }
  
  refresh() {
    this.cacheElements();
    this.setupAccessibility();
    this.updateCartCounter();
  }
  
  destroy() {
    // Remove event listeners
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('keydown', this.handleKeydown);
    document.removeEventListener('click', this.handleClickOutside);
    
    // Reset styles
    this.disableStickyHeader();
    document.body.style.overflow = '';
    
    this.isInitialized = false;
  }
}

/* =============================================================================
   Search Enhancement Module
   ============================================================================= */

class SearchEnhancement {
  constructor() {
    this.searchForms = document.querySelectorAll('.mobile-search-form, .header-search-form');
    this.init();
  }
  
  init() {
    this.searchForms.forEach(form => {
      this.enhanceSearchForm(form);
    });
  }
  
  enhanceSearchForm(form) {
    const input = form.querySelector('input[type="search"]');
    if (!input) return;
    
    // Add search suggestions if predictive search is available
    if (window.theme && window.theme.settings && window.theme.settings.predictive_search_enabled) {
      this.enablePredictiveSearch(form, input);
    }
    
    // Enhance mobile search
    if (form.classList.contains('mobile-search-form')) {
      this.enhanceMobileSearch(form, input);
    }
  }
  
  enablePredictiveSearch(form, input) {
    let timeout;
    
    input.addEventListener('input', (e) => {
      clearTimeout(timeout);
      const query = e.target.value.trim();
      
      if (query.length >= 2) {
        timeout = setTimeout(() => {
          this.fetchSearchSuggestions(query, form);
        }, 300);
      } else {
        this.clearSuggestions(form);
      }
    });
  }
  
  enhanceMobileSearch(form, input) {
    // Prevent zoom on iOS
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('autocorrect', 'off');
    input.setAttribute('autocapitalize', 'off');
    input.setAttribute('spellcheck', 'false');
  }
  
  fetchSearchSuggestions(query, form) {
    const url = `${window.theme.routes.predictive_search_url}?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=5`;
    
    fetch(url)
      .then(response => response.text())
      .then(html => {
        this.displaySuggestions(html, form);
      })
      .catch(error => {
        console.warn('Predictive search error:', error);
      });
  }
  
  displaySuggestions(html, form) {
    let suggestionsContainer = form.querySelector('.search-suggestions');
    
    if (!suggestionsContainer) {
      suggestionsContainer = document.createElement('div');
      suggestionsContainer.className = 'search-suggestions';
      form.appendChild(suggestionsContainer);
    }
    
    suggestionsContainer.innerHTML = html;
    suggestionsContainer.style.display = 'block';
  }
  
  clearSuggestions(form) {
    const suggestionsContainer = form.querySelector('.search-suggestions');
    if (suggestionsContainer) {
      suggestionsContainer.style.display = 'none';
    }
  }
}

/* =============================================================================
   Localization Enhancement Module
   ============================================================================= */

class LocalizationEnhancement {
  constructor() {
    this.localizationForms = document.querySelectorAll('.localization-form');
    this.init();
  }
  
  init() {
    this.localizationForms.forEach(form => {
      this.enhanceLocalizationForm(form);
    });
  }
  
  enhanceLocalizationForm(form) {
    const selects = form.querySelectorAll('select');
    
    selects.forEach(select => {
      select.addEventListener('change', () => {
        form.submit();
      });
    });
    
    // Add loading state
    form.addEventListener('submit', () => {
      form.classList.add('localization-form--loading');
    });
  }
}

/* =============================================================================
   Performance Monitoring Module
   ============================================================================= */

class PerformanceMonitor {
  constructor() {
    this.startTime = performance.now();
    this.metrics = {};
    this.init();
  }
  
  init() {
    this.trackLoadTime();
    this.trackInteractionTime();
  }
  
  trackLoadTime() {
    window.addEventListener('load', () => {
      this.metrics.loadTime = performance.now() - this.startTime;
      this.reportMetrics();
    });
  }
  
  trackInteractionTime() {
    let firstInteraction = false;
    
    const trackFirstInteraction = () => {
      if (!firstInteraction) {
        this.metrics.timeToInteractive = performance.now() - this.startTime;
        firstInteraction = true;
        document.removeEventListener('click', trackFirstInteraction);
        document.removeEventListener('keydown', trackFirstInteraction);
      }
    };
    
    document.addEventListener('click', trackFirstInteraction);
    document.addEventListener('keydown', trackFirstInteraction);
  }
  
  reportMetrics() {
    if (window.theme && window.theme.debug) {
      console.log('Header Performance Metrics:', this.metrics);
    }
    
    // Send to analytics if available
    if (window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: 'header_load',
        value: Math.round(this.metrics.loadTime)
      });
    }
  }
}

/* =============================================================================
   Initialization
   ============================================================================= */

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeHeader);
} else {
  initializeHeader();
}

function initializeHeader() {
  try {
    // Initialize main header controller
    window.headerController = new HeaderController();
    
    // Initialize enhancement modules
    if (window.theme?.settings?.enable_search_enhancements) {
      window.searchEnhancement = new SearchEnhancement();
    }
    
    if (window.theme?.settings?.enable_localization_enhancements) {
      window.localizationEnhancement = new LocalizationEnhancement();
    }
    
    if (window.theme?.debug) {
      window.performanceMonitor = new PerformanceMonitor();
    }
    
    // Global API for theme integration
    window.theme = window.theme || {};
    window.theme.header = {
      controller: window.headerController,
      openDrawer: () => window.headerController.openDrawer(),
      closeDrawer: () => window.headerController.closeDrawer(),
      updateCartCount: (count) => window.headerController.updateCartCounter(count),
      getState: () => window.headerController.getState()
    };
    
  } catch (error) {
    console.error('Header initialization failed:', error);
  }
}

/* =============================================================================
   Cart Integration Event Listeners
   ============================================================================= */

// Listen for cart changes
document.addEventListener('cart:changed', (event) => {
  if (window.headerController && event.detail) {
    window.headerController.updateCartCounter(event.detail.cart?.item_count);
  }
});

// Listen for Shopify cart drawer events
document.addEventListener('shopify:section:load', (event) => {
  if (event.target.querySelector('.header-professional')) {
    window.headerController?.refresh();
  }
});

/* =============================================================================
   Theme Integration Helpers
   ============================================================================= */

// Expose utilities for theme developers
window.HeaderUtils = {
  // Utility to check if header is ready
  isReady: () => window.headerController?.isInitialized || false,
  
  // Wait for header to be ready
  onReady: (callback) => {
    if (window.HeaderUtils.isReady()) {
      callback(window.headerController);
    } else {
      document.addEventListener('headerReady', (event) => {
        callback(event.detail.controller);
      });
    }
  },
  
  // Get current header state
  getState: () => window.headerController?.getState() || {},
  
  // Force refresh of header components
  refresh: () => window.headerController?.refresh()
};