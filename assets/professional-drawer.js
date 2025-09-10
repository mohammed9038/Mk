/**
 * Professional Drawer JavaScript
 * Enhanced mobile drawer with smooth animations and interactions
 */

class ProfessionalDrawer {
  constructor() {
    this.drawer = document.getElementById('menu-drawer');
    this.drawerContainer = document.getElementById('Details-menu-drawer-container');
    this.init();
  }

  init() {
    if (!this.drawer || !this.drawerContainer) return;
    
    this.setupEventListeners();
    this.setupSubmenuHandlers();
    this.setupKeyboardNavigation();
    this.setupAccessibility();
  }

  setupEventListeners() {
    // Close drawer when clicking outside
    document.addEventListener('click', (e) => {
      if (this.drawerContainer.hasAttribute('open') && 
          !this.drawer.contains(e.target) && 
          !e.target.closest('summary[aria-label*="menu"]')) {
        this.closeDrawer();
      }
    });

    // Close drawer with escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.drawerContainer.hasAttribute('open')) {
        this.closeDrawer();
        this.focusMenuButton();
      }
    });

    // Handle drawer state changes
    this.drawerContainer.addEventListener('toggle', (e) => {
      if (e.target.open) {
        this.openDrawer();
      } else {
        this.closeDrawer();
      }
    });

    // Prevent body scroll when drawer is open
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'open') {
          if (this.drawerContainer.hasAttribute('open')) {
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = this.getScrollbarWidth() + 'px';
          } else {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
          }
        }
      });
    });

    observer.observe(this.drawerContainer, { attributes: true });
  }

  setupSubmenuHandlers() {
    // Handle submenu back buttons
    const backButtons = this.drawer.querySelectorAll('.professional-submenu__back');
    backButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const submenu = button.closest('details');
        if (submenu) {
          submenu.removeAttribute('open');
          // Focus back on the parent menu item
          const summary = submenu.querySelector('summary');
          if (summary) {
            summary.focus();
          }
        }
      });
    });

    // Smooth animation for submenu toggles
    const submenuToggles = this.drawer.querySelectorAll('.professional-submenu > summary');
    submenuToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        const details = toggle.parentElement;
        const content = details.querySelector('.professional-submenu__content');
        
        if (details.hasAttribute('open')) {
          // Closing animation
          e.preventDefault();
          content.style.animation = 'slideUp 0.3s ease-out forwards';
          setTimeout(() => {
            details.removeAttribute('open');
            content.style.animation = '';
          }, 300);
        }
      });
    });
  }

  setupKeyboardNavigation() {
    // Improve keyboard navigation within the drawer
    const focusableElements = this.drawer.querySelectorAll(
      'a[href], button, [tabindex]:not([tabindex="-1"]), summary'
    );

    focusableElements.forEach((element, index) => {
      element.addEventListener('keydown', (e) => {
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            const nextElement = focusableElements[index + 1];
            if (nextElement) {
              nextElement.focus();
            }
            break;
          case 'ArrowUp':
            e.preventDefault();
            const prevElement = focusableElements[index - 1];
            if (prevElement) {
              prevElement.focus();
            }
            break;
        }
      });
    });
  }

  setupAccessibility() {
    // Announce drawer state changes to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'visually-hidden';
    document.body.appendChild(announcement);

    this.drawerContainer.addEventListener('toggle', () => {
      if (this.drawerContainer.hasAttribute('open')) {
        announcement.textContent = 'Navigation menu opened';
        this.trapFocus();
      } else {
        announcement.textContent = 'Navigation menu closed';
        this.releaseFocus();
      }
    });
  }

  trapFocus() {
    const focusableElements = this.drawer.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), summary'
    );
    
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus the first element when drawer opens
    setTimeout(() => {
      firstElement.focus();
    }, 100);

    this.focusTrapHandler = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', this.focusTrapHandler);
  }

  releaseFocus() {
    if (this.focusTrapHandler) {
      document.removeEventListener('keydown', this.focusTrapHandler);
      this.focusTrapHandler = null;
    }
  }

  openDrawer() {
    this.drawer.classList.add('drawer-opening');
    // Add smooth entrance animation
    requestAnimationFrame(() => {
      this.drawer.style.animation = 'drawerSlideIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
    });
  }

  closeDrawer() {
    this.drawerContainer.removeAttribute('open');
    this.drawer.classList.remove('drawer-opening');
  }

  focusMenuButton() {
    const menuButton = document.querySelector('[aria-label*="menu"] summary, .header__icon--menu');
    if (menuButton) {
      menuButton.focus();
    }
  }

  getScrollbarWidth() {
    const scrollDiv = document.createElement('div');
    scrollDiv.style.cssText = 'width: 100px; height: 100px; overflow: scroll; position: absolute; top: -9999px;';
    document.body.appendChild(scrollDiv);
    const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    return scrollbarWidth;
  }
}

// Enhanced interaction effects
class DrawerInteractionEffects {
  constructor(drawer) {
    this.drawer = drawer;
    this.init();
  }

  init() {
    this.addHoverEffects();
    this.addClickEffects();
    this.addScrollEffects();
  }

  addHoverEffects() {
    // Add hover sound effects (optional)
    const interactiveElements = this.drawer.querySelectorAll(
      '.professional-menu__link, .professional-submenu__link, .utility-link--account, .professional-social-link'
    );

    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        element.style.transition = 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)';
      });

      element.addEventListener('mouseleave', () => {
        element.style.transition = 'all 0.25s ease';
      });
    });
  }

  addClickEffects() {
    // Add click ripple effects
    const clickableElements = this.drawer.querySelectorAll(
      '.professional-menu__link, .professional-submenu__link, .utility-link--account'
    );

    clickableElements.forEach(element => {
      element.addEventListener('click', (e) => {
        // Create ripple effect
        const rect = element.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          background: rgba(var(--color-base-accent-1), 0.3);
          border-radius: 50%;
          left: ${x}px;
          top: ${y}px;
          transform: scale(0);
          animation: ripple 0.6s ease-out;
          pointer-events: none;
          z-index: 1;
        `;

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });
  }

  addScrollEffects() {
    // Add scroll-based animations for drawer content
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
        }
      });
    }, { threshold: 0.1 });

    const animatedElements = this.drawer.querySelectorAll(
      '.professional-menu__item, .utility-group'
    );

    animatedElements.forEach((element, index) => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(2rem)';
      element.style.animationDelay = `${index * 0.1}s`;
      observer.observe(element);
    });
  }
}

// CSS animations to be added dynamically
const additionalStyles = `
  @keyframes ripple {
    to {
      transform: scale(2);
      opacity: 0;
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(2rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideUp {
    from {
      opacity: 1;
      transform: translateY(0);
      max-height: 100vh;
    }
    to {
      opacity: 0;
      transform: translateY(-1rem);
      max-height: 0;
    }
  }
`;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Add additional styles
  const styleSheet = document.createElement('style');
  styleSheet.textContent = additionalStyles;
  document.head.appendChild(styleSheet);

  // Initialize professional drawer
  const professionalDrawer = new ProfessionalDrawer();
  
  // Initialize interaction effects
  setTimeout(() => {
    const drawer = document.getElementById('menu-drawer');
    if (drawer) {
      new DrawerInteractionEffects(drawer);
    }
  }, 100);
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ProfessionalDrawer, DrawerInteractionEffects };
}
