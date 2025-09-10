// Desktop Navigation Dropdown - Enhanced Native Theme Support
class DesktopNavigationDropdown {
  constructor() {
    console.log('DesktopNavigationDropdown: Initializing...');
    this.init();
  }

  init() {
    if (window.innerWidth < 990) {
      console.log('DesktopNavigationDropdown: Window width < 990px, not initializing');
      return;
    }
    
    console.log('DesktopNavigationDropdown: Setting up dropdowns...');
    this.setupDropdowns();
    
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 990) {
        this.setupDropdowns();
      }
    });
  }

  setupDropdowns() {
    // Target the theme's native dropdown structure: li > header-menu > details
    const menuItems = document.querySelectorAll('.header__inline-menu li');
    console.log('DesktopNavigationDropdown: Found', menuItems.length, 'menu items');
    
    menuItems.forEach((li, index) => {
      const headerMenu = li.querySelector('header-menu');
      const details = headerMenu ? headerMenu.querySelector('details') : null;
      const submenu = details ? details.querySelector('.header__submenu') : null;
      
      console.log(`Menu item ${index}:`, {
        hasHeaderMenu: !!headerMenu,
        hasDetails: !!details,
        hasSubmenu: !!submenu
      });
      
      if (!headerMenu || !details || !submenu) return;
      
      console.log('DesktopNavigationDropdown: Setting up menu item', index);
      this.setupMenuItem(li, headerMenu, details, submenu);
    });
  }

  setupMenuItem(li, headerMenu, details, submenu) {
    const summary = details.querySelector('summary');
    let hoverTimer = null;

    // Prevent default click behavior - let hover control it
    if (summary) {
      summary.addEventListener('click', (e) => {
        console.log('DesktopNavigationDropdown: Preventing default click');
        e.preventDefault();
        e.stopPropagation();
        return false;
      });
    }

    // Show on hover of the li element
    li.addEventListener('mouseenter', () => {
      console.log('DesktopNavigationDropdown: Mouse enter');
      clearTimeout(hoverTimer);
      this.showDropdown(details, submenu, li);
    });

    // Hide on mouse leave of the li element with delay
    li.addEventListener('mouseleave', () => {
      console.log('DesktopNavigationDropdown: Mouse leave');
      hoverTimer = setTimeout(() => {
        this.hideDropdown(details, submenu, li);
      }, 150);
    });

    // Keep dropdown open when hovering over submenu
    submenu.addEventListener('mouseenter', () => {
      clearTimeout(hoverTimer);
    });

    submenu.addEventListener('mouseleave', () => {
      hoverTimer = setTimeout(() => {
        this.hideDropdown(details, submenu, li);
      }, 150);
    });

    // Handle keyboard navigation
    li.addEventListener('focusin', () => {
      this.showDropdown(details, submenu, li);
    });

    li.addEventListener('focusout', (e) => {
      setTimeout(() => {
        if (!li.contains(document.activeElement)) {
          this.hideDropdown(details, submenu, li);
        }
      }, 100);
    });
  }

  showDropdown(details, submenu, li) {
    console.log('DesktopNavigationDropdown: Showing dropdown');
    // Don't actually open the details element, just show the submenu
    submenu.style.setProperty('opacity', '1', 'important');
    submenu.style.setProperty('transform', 'translateY(0)', 'important');
    submenu.style.setProperty('visibility', 'visible', 'important');
    submenu.style.setProperty('z-index', '1', 'important');
    submenu.style.setProperty('display', 'block', 'important');
    
    // Rotate arrow
    const arrow = li.querySelector('.icon-caret');
    if (arrow) {
      arrow.style.setProperty('transform', 'rotate(180deg)', 'important');
    }
    
    // Add hover class for CSS targeting
    li.classList.add('menu-hovered');
  }

  hideDropdown(details, submenu, li) {
    console.log('DesktopNavigationDropdown: Hiding dropdown');
    // Reset to theme defaults
    submenu.style.removeProperty('opacity');
    submenu.style.removeProperty('transform');
    submenu.style.removeProperty('visibility');
    submenu.style.removeProperty('z-index');
    submenu.style.removeProperty('display');
    
    // Reset arrow
    const arrow = li.querySelector('.icon-caret');
    if (arrow) {
      arrow.style.removeProperty('transform');
    }
    
    // Remove hover class
    li.classList.remove('menu-hovered');
  }
}

// Initialize when DOM is loaded
console.log('DesktopNavigationDropdown: Script loaded');

if (document.readyState === 'loading') {
  console.log('DesktopNavigationDropdown: Waiting for DOMContentLoaded');
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DesktopNavigationDropdown: DOMContentLoaded fired');
    new DesktopNavigationDropdown();
  });
} else {
  console.log('DesktopNavigationDropdown: DOM already loaded, initializing immediately');
  new DesktopNavigationDropdown();
}

// Also initialize after Shopify theme events
document.addEventListener('shopify:section:load', () => {
  console.log('DesktopNavigationDropdown: shopify:section:load fired');
  new DesktopNavigationDropdown();
});

// Global fallback
window.DesktopNavigationDropdown = DesktopNavigationDropdown;
