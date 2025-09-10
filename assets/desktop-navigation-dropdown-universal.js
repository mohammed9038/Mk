// Desktop Navigation Dropdown - Universal Solution
class DesktopNavigationDropdown {
  constructor() {
    this.init();
  }

  init() {
    if (window.innerWidth < 990) return;
    
    this.setupDropdowns();
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 990) {
        this.setupDropdowns();
      }
    });
  }

  setupDropdowns() {
    // Target all possible menu structures
    const menuSelectors = [
      '.header__inline-menu li',
      '.header__navigation li',
      '.list-menu--inline > li',
      'header-menu'
    ];

    menuSelectors.forEach(selector => {
      const menuItems = document.querySelectorAll(selector);
      menuItems.forEach(item => this.setupMenuItem(item));
    });
  }

  setupMenuItem(menuItem) {
    // Check if this menu item has submenu
    const submenus = menuItem.querySelectorAll('.header__submenu, .list-menu--disclosure');
    const details = menuItem.querySelector('details');
    
    if (submenus.length === 0) return;

    // Force details to never be open by default
    if (details) {
      details.removeAttribute('open');
      
      // Prevent default click behavior
      const summary = details.querySelector('summary');
      if (summary) {
        summary.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
        });
      }
    }

    let hoverTimer = null;

    // Show on hover
    menuItem.addEventListener('mouseenter', () => {
      clearTimeout(hoverTimer);
      this.showDropdown(menuItem, submenus);
    });

    // Hide on mouse leave with delay
    menuItem.addEventListener('mouseleave', () => {
      hoverTimer = setTimeout(() => {
        this.hideDropdown(menuItem, submenus);
      }, 150);
    });

    // Keep dropdown open when hovering over it
    submenus.forEach(submenu => {
      submenu.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimer);
      });

      submenu.addEventListener('mouseleave', () => {
        hoverTimer = setTimeout(() => {
          this.hideDropdown(menuItem, submenus);
        }, 150);
      });
    });

    // Handle keyboard navigation
    menuItem.addEventListener('focusin', () => {
      this.showDropdown(menuItem, submenus);
    });

    menuItem.addEventListener('focusout', (e) => {
      // Only hide if focus is moving outside the menu item
      setTimeout(() => {
        if (!menuItem.contains(document.activeElement)) {
          this.hideDropdown(menuItem, submenus);
        }
      }, 100);
    });
  }

  showDropdown(menuItem, submenus) {
    // Force show dropdowns
    submenus.forEach(submenu => {
      submenu.style.setProperty('opacity', '1', 'important');
      submenu.style.setProperty('visibility', 'visible', 'important');
      submenu.style.setProperty('transform', 'translateY(0)', 'important');
      submenu.style.setProperty('display', 'block', 'important');
      submenu.removeAttribute('hidden');
    });

    // Rotate arrow
    const arrows = menuItem.querySelectorAll('.header__menu-item svg, .list-menu__item svg');
    arrows.forEach(arrow => {
      arrow.style.setProperty('transform', 'rotate(180deg)', 'important');
    });

    // Add hover class for CSS targeting
    menuItem.classList.add('menu-item-hovered');
  }

  hideDropdown(menuItem, submenus) {
    // Hide dropdowns
    submenus.forEach(submenu => {
      submenu.style.setProperty('opacity', '0', 'important');
      submenu.style.setProperty('visibility', 'hidden', 'important');
      submenu.style.setProperty('transform', 'translateY(-10px)', 'important');
    });

    // Reset arrow
    const arrows = menuItem.querySelectorAll('.header__menu-item svg, .list-menu__item svg');
    arrows.forEach(arrow => {
      arrow.style.setProperty('transform', 'rotate(0deg)', 'important');
    });

    // Remove hover class
    menuItem.classList.remove('menu-item-hovered');
  }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new DesktopNavigationDropdown();
  });
} else {
  new DesktopNavigationDropdown();
}

// Also initialize after Shopify theme events
document.addEventListener('shopify:section:load', () => {
  new DesktopNavigationDropdown();
});

// Global fallback for immediate execution
window.DesktopNavigationDropdown = DesktopNavigationDropdown;
