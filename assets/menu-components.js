/* ===================================================================
   OPTIMIZED MENU AND NAVIGATION COMPONENTS
   Replaces heavy menu/drawer code from global.js
   =================================================================== */

// Optimized Menu Drawer with performance improvements
class MenuDrawer extends HTMLElement {
  constructor() {
    super();
    
    this.mainDetailsToggle = this.querySelector('details');
    this.animation = null;
    
    if (this.mainDetailsToggle) {
      this.addEventListener('keyup', this.onKeyUp.bind(this));
      this.addEventListener('focusout', this.onFocusOut.bind(this));
      this.mainDetailsToggle.addEventListener('toggle', this.onToggle.bind(this));
    }

    // Optimize for mobile performance
    this.bindEvents();
  }

  bindEvents() {
    // Use passive listeners for better performance
    this.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: true });
    this.addEventListener('touchend', this.onTouchEnd.bind(this), { passive: true });
  }

  onKeyUp(event) {
    if (event.code.toUpperCase() !== 'ESCAPE') return;

    const openDetailsElement = event.target.closest('details[open]');
    if (!openDetailsElement) return;

    if (openDetailsElement === this.mainDetailsToggle) {
      this.closeMenuDrawer(event, this.mainDetailsToggle.querySelector('summary'));
    } else {
      this.closeSubmenu(openDetailsElement);
    }
  }

  onToggle() {
    if (!this.animation) this.animation = this.querySelector('.menu-drawer__navigation-container');

    // Use RAF for smooth animations
    requestAnimationFrame(() => {
      if (this.mainDetailsToggle.hasAttribute('open')) {
        this.openMenuDrawer();
      } else {
        this.closeMenuDrawer();
      }
    });
  }

  openMenuDrawer() {
    setTimeout(() => {
      this.mainDetailsToggle.classList.add('menu-opening');
    });
    
    this.summaryElement = this.querySelector('summary');
    
    // Use AlShariqahTheme utilities if available, fallback to direct access
    const trapFocus = window.AlShariqahTheme?.FocusManager?.trapFocus || window.trapFocus;
    if (trapFocus) {
      trapFocus(this, this.summaryElement);
    }

    document.body.classList.add('overflow-hidden-mobile');
  }

  closeMenuDrawer(event, elementToFocus = false) {
    if (!event || event.type !== 'click') {
      this.mainDetailsToggle.classList.remove('menu-opening');
    }

    // Use AlShariqahTheme utilities if available, fallback to direct access
    const removeTrapFocus = window.AlShariqahTheme?.FocusManager?.removeTrapFocus || window.removeTrapFocus;
    if (removeTrapFocus) {
      removeTrapFocus(elementToFocus);
    }

    document.body.classList.remove('overflow-hidden-mobile');
  }

  onFocusOut() {
    // Use RAF to avoid layout thrashing
    requestAnimationFrame(() => {
      if (!this.contains(document.activeElement)) {
        this.closeMenuDrawer();
      }
    });
  }

  closeSubmenu(detailsElement) {
    detailsElement.removeAttribute('open');
    detailsElement.querySelector('summary').setAttribute('aria-expanded', false);
  }

  onTouchStart() {
    this.touchStarted = true;
  }

  onTouchEnd(event) {
    if (!this.touchStarted) return;
    this.touchStarted = false;
    
    // Close menu if touching outside
    if (!this.mainDetailsToggle.contains(event.target)) {
      this.mainDetailsToggle.removeAttribute('open');
    }
  }
}

// Optimized Header Drawer
class HeaderDrawer extends MenuDrawer {
  constructor() {
    super();
  }

  openMenuDrawer() {
    this.header = this.header || document.querySelector('.section-header');
    this.borderOffset = this.borderOffset || this.closest('.header-wrapper').classList.contains('header-wrapper--border-bottom') ? 1 : 0;

    // Optimize scroll calculations
    document.documentElement.style.setProperty('--header-bottom-position', `${parseInt(this.header?.getBoundingClientRect().bottom - this.borderOffset)}px`);
    
    // Use setTimeout for better performance
    setTimeout(() => {
      this.mainDetailsToggle.classList.add('menu-opening');
    });

    this.summaryElement = this.querySelector('summary');
    
    const trapFocus = window.AlShariqahTheme?.FocusManager?.trapFocus || window.trapFocus;
    if (trapFocus) {
      trapFocus(this, this.summaryElement);
    }

    document.body.classList.add('overflow-hidden-mobile');
  }
}

// Optimized Details Disclosure
class DetailsDisclosure extends HTMLElement {
  constructor() {
    super();
    
    this.mainDetailsToggle = this.querySelector('details');
    this.content = this.mainDetailsToggle?.querySelector('summary').nextElementSibling;

    if (!this.mainDetailsToggle) return;

    this.mainDetailsToggle.addEventListener('toggle', this.onToggle.bind(this));
  }

  onToggle() {
    if (!this.animations) this.animations = this.content?.getAnimations();

    if (this.mainDetailsToggle.hasAttribute('open')) {
      this.onOpen();
    } else {
      this.onClose();
    }
  }

  onOpen() {
    this.content?.style.setProperty('height', `${this.content.scrollHeight}px`);
    this.mainDetailsToggle.classList.add('details-disclosure--opening');
  }

  onClose() {
    this.mainDetailsToggle.classList.remove('details-disclosure--opening');
    
    if (!this.animations || this.animations.length === 0) return;

    const closingAnimation = this.content?.animate({
      height: [this.content.scrollHeight + 'px', 0],
    }, {
      duration: 300,
      easing: 'ease-out'
    });

    closingAnimation?.addEventListener('finish', () => {
      this.content?.style.removeProperty('height');
    });
  }
}

// Optimized List Menu Component
class ListMenu extends HTMLElement {
  constructor() {
    super();
    
    this.setupAccessibility();
    this.bindEvents();
  }

  setupAccessibility() {
    this.querySelectorAll('summary').forEach(summary =>
      summary.setAttribute('role', 'button')
    );

    this.querySelectorAll('details[id]').forEach(details =>
      details.querySelector('summary').setAttribute('aria-controls', details.id)
    );
  }

  bindEvents() {
    this.addEventListener('toggle', this.onToggle.bind(this));
    this.addEventListener('focusout', this.closeMenuOnFocusOut.bind(this));
    this.addEventListener('keyup', this.onKeyUp.bind(this));
  }

  onToggle(event) {
    const target = event.target;
    if (target.tagName === 'DETAILS') {
      const isOpen = target.hasAttribute('open');
      const summary = target.querySelector('summary');
      
      if (summary) {
        summary.setAttribute('aria-expanded', isOpen);
      }
    }
  }

  onKeyUp(event) {
    if (event.code.toUpperCase() === 'ESCAPE') {
      const openDetails = event.target.closest('details[open]');
      if (openDetails) {
        const summary = openDetails.querySelector('summary');
        openDetails.removeAttribute('open');
        if (summary) {
          summary.setAttribute('aria-expanded', false);
          summary.focus();
        }
      }
    }
  }

  closeMenuOnFocusOut(event) {
    // Use RAF for better performance
    requestAnimationFrame(() => {
      if (!this.contains(document.activeElement)) {
        this.querySelectorAll('details[open]').forEach(details => {
          details.removeAttribute('open');
          details.querySelector('summary')?.setAttribute('aria-expanded', false);
        });
      }
    });
  }
}

// Optimized Localization Form
class LocalizationForm extends HTMLElement {
  constructor() {
    super();
    
    this.elements = {
      input: this.querySelector('input[name="language_code"], input[name="country_code"]'),
      button: this.querySelector('button'),
      panel: this.querySelector('.disclosure__list-wrapper, ul')
    };

    this.elements.button?.addEventListener('click', this.openSelector.bind(this));
    this.addEventListener('keyup', this.onContainerKeyUp.bind(this));

    this.querySelectorAll('a').forEach(item => {
      item.addEventListener('click', this.onItemClick.bind(this));
      item.addEventListener('keydown', this.onItemKeyDown.bind(this));
    });
  }

  hidePanel() {
    this.elements.button?.setAttribute('aria-expanded', 'false');
    this.elements.panel?.setAttribute('hidden', true);
  }

  onContainerKeyUp(event) {
    if (event.code.toUpperCase() !== 'ESCAPE') return;

    this.hidePanel();
    this.elements.button?.focus();
  }

  onItemClick(event) {
    event.preventDefault();
    const form = this.querySelector('form');
    if (this.elements.input) {
      this.elements.input.value = event.currentTarget.dataset.value;
    }
    if (form) form.submit();
  }

  onItemKeyDown(event) {
    if (event.code.toUpperCase() !== 'ENTER') return;

    const form = this.querySelector('form');
    if (this.elements.input) {
      this.elements.input.value = event.currentTarget.dataset.value;
    }
    if (form) form.submit();
  }

  openSelector() {
    this.elements.button?.focus();
    this.elements.panel?.toggleAttribute('hidden');
    this.elements.button?.setAttribute(
      'aria-expanded',
      (this.elements.button.getAttribute('aria-expanded') === 'false').toString()
    );
  }
}

// Register optimized menu components
if ('customElements' in window) {
  customElements.define('menu-drawer', MenuDrawer);
  customElements.define('header-drawer', HeaderDrawer);
  customElements.define('details-disclosure', DetailsDisclosure);
  customElements.define('list-menu', ListMenu);
  customElements.define('localization-form', LocalizationForm);
}

// Performance mark
if ('performance' in window && 'mark' in window.performance) {
  window.performance.mark('menu-components-loaded');
}
