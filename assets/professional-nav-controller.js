// Professional Navigation Dropdown Controller
// Modern, smooth, and responsive dropdown functionality

class ProfessionalNavigation {
  constructor() {
    this.topNav = null;
    this.mainDropdowns = [];
    this.nestedDropdowns = [];
    this.activeDropdown = null;
    this.hoverTimer = null;
    this.isMobile = window.innerWidth < 990;
    
    this.init();
  }
  
  init() {
    console.log('🎯 Initializing Professional Navigation...');
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }
  
  setup() {
    this.topNav = document.querySelector('.top-nav');
    if (!this.topNav) {
      console.log('❌ Top navigation not found');
      return;
    }
    
    this.findDropdowns();
    this.bindEvents();
    this.addAccessibilityFeatures();
    
    console.log('✅ Professional Navigation initialized');
    console.log(`📊 Found ${this.mainDropdowns.length} main dropdowns and ${this.nestedDropdowns.length} nested dropdowns`);
  }
  
  findDropdowns() {
    // Find main dropdowns
    this.mainDropdowns = Array.from(this.topNav.querySelectorAll('header-menu > details'));
    
    // Find nested dropdowns
    this.nestedDropdowns = Array.from(this.topNav.querySelectorAll('.header__submenu-details'));
    
    // Add smooth transition classes
    [...this.mainDropdowns, ...this.nestedDropdowns].forEach(dropdown => {
      dropdown.classList.add('nav-dropdown-enhanced');
    });
  }
  
  bindEvents() {
    // Main dropdown events
    this.mainDropdowns.forEach((dropdown, index) => {
      const summary = dropdown.querySelector('summary');
      const submenu = dropdown.querySelector('.header__submenu');
      
      if (summary && submenu) {
        this.bindMainDropdownEvents(dropdown, summary, submenu, index);
      }
    });
    
    // Nested dropdown events
    this.nestedDropdowns.forEach((dropdown, index) => {
      const summary = dropdown.querySelector('summary');
      const submenu = dropdown.querySelector('.header__submenu--nested');
      
      if (summary && submenu) {
        this.bindNestedDropdownEvents(dropdown, summary, submenu, index);
      }
    });
    
    // Global events
    this.bindGlobalEvents();
    
    // Window resize handler
    window.addEventListener('resize', () => this.handleResize());
  }
  
  bindMainDropdownEvents(dropdown, summary, submenu, index) {
    const menuName = summary.textContent.trim();
    
    // Click events
    summary.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleMainDropdown(dropdown, menuName);
    });
    
    // Desktop hover events
    if (!this.isMobile) {
      dropdown.addEventListener('mouseenter', () => {
        this.openMainDropdown(dropdown, menuName);
      });
      
      dropdown.addEventListener('mouseleave', () => {
        this.scheduleCloseDropdown(dropdown, menuName);
      });
    }
    
    // Keyboard navigation
    summary.addEventListener('keydown', (e) => {
      this.handleKeyboardNavigation(e, dropdown, 'main');
    });
  }
  
  bindNestedDropdownEvents(dropdown, summary, submenu, index) {
    const menuName = summary.textContent.trim();
    
    // Click events
    summary.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleNestedDropdown(dropdown, menuName);
    });
    
    // Desktop hover events
    if (!this.isMobile) {
      dropdown.addEventListener('mouseenter', () => {
        this.openNestedDropdown(dropdown, menuName);
      });
      
      dropdown.addEventListener('mouseleave', () => {
        this.scheduleCloseDropdown(dropdown, menuName, 'nested');
      });
    }
    
    // Keyboard navigation
    summary.addEventListener('keydown', (e) => {
      this.handleKeyboardNavigation(e, dropdown, 'nested');
    });
  }
  
  bindGlobalEvents() {
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.topNav.contains(e.target)) {
        this.closeAllDropdowns();
      }
    });
    
    // ESC key to close dropdowns
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllDropdowns();
      }
    });
    
    // Focus management
    document.addEventListener('focusin', (e) => {
      if (!this.topNav.contains(e.target)) {
        this.closeAllDropdowns();
      }
    });
  }
  
  toggleMainDropdown(dropdown, menuName) {
    const isOpen = dropdown.hasAttribute('open');
    
    if (isOpen) {
      this.closeMainDropdown(dropdown, menuName);
    } else {
      this.closeOtherMainDropdowns(dropdown);
      this.openMainDropdown(dropdown, menuName);
    }
  }
  
  openMainDropdown(dropdown, menuName) {
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
    }
    
    this.closeOtherMainDropdowns(dropdown);
    
    dropdown.setAttribute('open', '');
    this.activeDropdown = dropdown;
    
    // Add opening animation class
    const submenu = dropdown.querySelector('.header__submenu');
    if (submenu) {
      submenu.style.animation = 'fadeInUp 0.3s ease-out';
    }
    
    console.log(`🎯 Opened main dropdown: ${menuName}`);
  }
  
  closeMainDropdown(dropdown, menuName) {
    dropdown.removeAttribute('open');
    
    // Close any nested dropdowns within this main dropdown
    const nestedDropdowns = dropdown.querySelectorAll('.header__submenu-details[open]');
    nestedDropdowns.forEach(nested => nested.removeAttribute('open'));
    
    if (this.activeDropdown === dropdown) {
      this.activeDropdown = null;
    }
    
    console.log(`🎯 Closed main dropdown: ${menuName}`);
  }
  
  closeOtherMainDropdowns(currentDropdown) {
    this.mainDropdowns.forEach(dropdown => {
      if (dropdown !== currentDropdown && dropdown.hasAttribute('open')) {
        this.closeMainDropdown(dropdown, 'other');
      }
    });
  }
  
  toggleNestedDropdown(dropdown, menuName) {
    const isOpen = dropdown.hasAttribute('open');
    
    if (isOpen) {
      this.closeNestedDropdown(dropdown, menuName);
    } else {
      this.openNestedDropdown(dropdown, menuName);
    }
  }
  
  openNestedDropdown(dropdown, menuName) {
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
    }
    
    dropdown.setAttribute('open', '');
    
    // Add opening animation
    const submenu = dropdown.querySelector('.header__submenu--nested');
    if (submenu) {
      submenu.style.animation = 'fadeInUp 0.3s ease-out';
    }
    
    console.log(`🎯 Opened nested dropdown: ${menuName}`);
  }
  
  closeNestedDropdown(dropdown, menuName) {
    dropdown.removeAttribute('open');
    console.log(`🎯 Closed nested dropdown: ${menuName}`);
  }
  
  scheduleCloseDropdown(dropdown, menuName, type = 'main') {
    this.hoverTimer = setTimeout(() => {
      if (!dropdown.matches(':hover')) {
        if (type === 'main') {
          this.closeMainDropdown(dropdown, menuName);
        } else {
          this.closeNestedDropdown(dropdown, menuName);
        }
      }
    }, 150);
  }
  
  closeAllDropdowns() {
    [...this.mainDropdowns, ...this.nestedDropdowns].forEach(dropdown => {
      if (dropdown.hasAttribute('open')) {
        dropdown.removeAttribute('open');
      }
    });
    this.activeDropdown = null;
    console.log('🎯 Closed all dropdowns');
  }
  
  handleKeyboardNavigation(e, dropdown, type) {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (type === 'main') {
          this.toggleMainDropdown(dropdown, 'keyboard');
        } else {
          this.toggleNestedDropdown(dropdown, 'keyboard');
        }
        break;
        
      case 'ArrowDown':
        e.preventDefault();
        this.focusNextMenuItem(dropdown);
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        this.focusPreviousMenuItem(dropdown);
        break;
        
      case 'ArrowRight':
        if (type === 'main') {
          e.preventDefault();
          this.focusNestedDropdown(dropdown);
        }
        break;
        
      case 'ArrowLeft':
        if (type === 'nested') {
          e.preventDefault();
          this.focusParentDropdown(dropdown);
        }
        break;
    }
  }
  
  focusNextMenuItem(dropdown) {
    const menuItems = dropdown.querySelectorAll('a, summary');
    const currentIndex = Array.from(menuItems).indexOf(document.activeElement);
    const nextIndex = (currentIndex + 1) % menuItems.length;
    menuItems[nextIndex]?.focus();
  }
  
  focusPreviousMenuItem(dropdown) {
    const menuItems = dropdown.querySelectorAll('a, summary');
    const currentIndex = Array.from(menuItems).indexOf(document.activeElement);
    const prevIndex = currentIndex <= 0 ? menuItems.length - 1 : currentIndex - 1;
    menuItems[prevIndex]?.focus();
  }
  
  focusNestedDropdown(dropdown) {
    const nestedDropdown = dropdown.querySelector('.header__submenu-details summary');
    nestedDropdown?.focus();
  }
  
  focusParentDropdown(nestedDropdown) {
    const parentDropdown = nestedDropdown.closest('header-menu details summary');
    parentDropdown?.focus();
  }
  
  addAccessibilityFeatures() {
    // Add ARIA attributes
    this.mainDropdowns.forEach(dropdown => {
      const summary = dropdown.querySelector('summary');
      const submenu = dropdown.querySelector('.header__submenu');
      
      if (summary && submenu) {
        const id = `nav-dropdown-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        summary.setAttribute('aria-expanded', 'false');
        summary.setAttribute('aria-haspopup', 'true');
        summary.setAttribute('aria-controls', id);
        submenu.setAttribute('id', id);
        submenu.setAttribute('aria-hidden', 'true');
      }
    });
    
    // Update ARIA states on open/close
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'open') {
          const dropdown = mutation.target;
          const summary = dropdown.querySelector('summary');
          const submenu = dropdown.querySelector('.header__submenu, .header__submenu--nested');
          
          if (summary && submenu) {
            const isOpen = dropdown.hasAttribute('open');
            summary.setAttribute('aria-expanded', isOpen.toString());
            submenu.setAttribute('aria-hidden', (!isOpen).toString());
          }
        }
      });
    });
    
    [...this.mainDropdowns, ...this.nestedDropdowns].forEach(dropdown => {
      observer.observe(dropdown, { attributes: true });
    });
  }
  
  handleResize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < 990;
    
    if (wasMobile !== this.isMobile) {
      this.closeAllDropdowns();
      // Rebind events if needed
      console.log(`🔄 Navigation mode changed: ${this.isMobile ? 'Mobile' : 'Desktop'}`);
    }
  }
  
  // Public method to refresh navigation
  refresh() {
    this.closeAllDropdowns();
    this.findDropdowns();
    this.bindEvents();
    console.log('🔄 Navigation refreshed');
  }
}

// Initialize Professional Navigation
let professionalNav;

function initProfessionalNavigation() {
  if (professionalNav) {
    professionalNav.refresh();
  } else {
    professionalNav = new ProfessionalNavigation();
  }
}

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProfessionalNavigation);
} else {
  initProfessionalNavigation();
}

// Shopify theme editor compatibility
document.addEventListener('shopify:section:load', initProfessionalNavigation);

// Export for manual initialization if needed
window.ProfessionalNavigation = ProfessionalNavigation;
window.initProfessionalNavigation = initProfessionalNavigation;

console.log('✨ Professional Navigation System Loaded');
