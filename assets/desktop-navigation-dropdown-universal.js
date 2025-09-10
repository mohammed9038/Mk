// Desktop Navigation Dropdown - Enhanced Native Theme Support
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
    // Target the theme's native dropdown structure
    const headerMenus = document.querySelectorAll('.header__inline-menu header-menu');
    
    headerMenus.forEach(headerMenu => {
      const details = headerMenu.querySelector('details');
      const submenu = headerMenu.querySelector('.header__submenu');
      
      if (!details || !submenu) return;
      
      this.setupMenuItem(headerMenu, details, submenu);
    });
  }

  setupMenuItem(headerMenu, details, submenu) {
    const summary = details.querySelector('summary');
    let hoverTimer = null;

    // Prevent default click behavior - let hover control it
    if (summary) {
      summary.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      });
    }

    // Show on hover
    headerMenu.addEventListener('mouseenter', () => {
      clearTimeout(hoverTimer);
      this.showDropdown(details, submenu, headerMenu);
    });

    // Hide on mouse leave with delay
    headerMenu.addEventListener('mouseleave', () => {
      hoverTimer = setTimeout(() => {
        this.hideDropdown(details, submenu, headerMenu);
      }, 150);
    });

    // Keep dropdown open when hovering over submenu
    submenu.addEventListener('mouseenter', () => {
      clearTimeout(hoverTimer);
    });

    submenu.addEventListener('mouseleave', () => {
      hoverTimer = setTimeout(() => {
        this.hideDropdown(details, submenu, headerMenu);
      }, 150);
    });

    // Handle keyboard navigation
    headerMenu.addEventListener('focusin', () => {
      this.showDropdown(details, submenu, headerMenu);
    });

    headerMenu.addEventListener('focusout', (e) => {
      setTimeout(() => {
        if (!headerMenu.contains(document.activeElement)) {
          this.hideDropdown(details, submenu, headerMenu);
        }
      }, 100);
    });
  }

  showDropdown(details, submenu, headerMenu) {
    // Don't actually open the details element, just show the submenu
    submenu.style.setProperty('opacity', '1', 'important');
    submenu.style.setProperty('transform', 'translateY(0)', 'important');
    submenu.style.setProperty('visibility', 'visible', 'important');
    submenu.style.setProperty('z-index', '1', 'important');
    
    // Rotate arrow
    const arrow = headerMenu.querySelector('.icon-caret');
    if (arrow) {
      arrow.style.setProperty('transform', 'rotate(180deg)', 'important');
    }
    
    // Add hover class for CSS targeting
    headerMenu.classList.add('menu-hovered');
  }

  hideDropdown(details, submenu, headerMenu) {
    // Reset to theme defaults
    submenu.style.removeProperty('opacity');
    submenu.style.removeProperty('transform');
    submenu.style.removeProperty('visibility');
    submenu.style.removeProperty('z-index');
    
    // Reset arrow
    const arrow = headerMenu.querySelector('.icon-caret');
    if (arrow) {
      arrow.style.removeProperty('transform');
    }
    
    // Remove hover class
    headerMenu.classList.remove('menu-hovered');
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

// Global fallback
window.DesktopNavigationDropdown = DesktopNavigationDropdown;
