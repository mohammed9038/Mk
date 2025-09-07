/* ===================================================================
   OPTIMIZED GLOBAL BUNDLE - Essential Shopify theme functionality
   Replaces the heavy global.js with optimized, modular approach
   =================================================================== */

// Essential theme utilities
const ThemeUtils = {
  // Optimized debounce
  debounce(fn, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        fn(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Optimized throttle
  throttle(fn, delay) {
    let lastCall = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        return fn.apply(this, args);
      }
    };
  },

  // Fetch configuration for Shopify APIs
  fetchConfig(type = 'json') {
    return {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        Accept: `application/${type}` 
      },
    };
  }
};

// Essential focus management (optimized)
class FocusManager {
  static getFocusableElements(container) {
    return container.querySelectorAll(
      'summary, a[href], button:enabled, [tabindex]:not([tabindex^="-"]), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe'
    );
  }

  static trapFocus(container, elementToFocus = container) {
    const elements = this.getFocusableElements(container);
    const first = elements[0];
    const last = elements[elements.length - 1];

    this.removeTrapFocus();

    this.handlers = {
      focusin: (event) => {
        if (event.target !== container && event.target !== last && event.target !== first) return;
        document.addEventListener('keydown', this.handlers.keydown);
      },
      focusout: () => {
        document.removeEventListener('keydown', this.handlers.keydown);
      },
      keydown: (event) => {
        if (event.code !== 'Tab') return;
        if (event.target === last && !event.shiftKey) {
          event.preventDefault();
          first.focus();
        }
        if ((event.target === container || event.target === first) && event.shiftKey) {
          event.preventDefault();
          last.focus();
        }
      }
    };

    document.addEventListener('focusout', this.handlers.focusout);
    document.addEventListener('focusin', this.handlers.focusin);

    if (elementToFocus) elementToFocus.focus();
  }

  static removeTrapFocus(elementToFocus = null) {
    if (this.handlers) {
      document.removeEventListener('focusin', this.handlers.focusin);
      document.removeEventListener('focusout', this.handlers.focusout);
      document.removeEventListener('keydown', this.handlers.keydown);
    }
    if (elementToFocus) elementToFocus.focus();
  }
}

// Essential media control
const MediaController = {
  pauseAllMedia() {
    // YouTube videos
    document.querySelectorAll('.js-youtube').forEach((video) => {
      video.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    });
    
    // Vimeo videos
    document.querySelectorAll('.js-vimeo').forEach((video) => {
      video.contentWindow.postMessage('{"method":"pause"}', '*');
    });
    
    // HTML5 videos
    document.querySelectorAll('video').forEach((video) => video.pause());
    
    // 3D models
    document.querySelectorAll('product-model').forEach((model) => {
      if (model.modelViewerUI) model.modelViewerUI.pause();
    });
  }
};

// Optimized Quantity Input (Essential)
class QuantityInput extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector('input');
    this.changeEvent = new Event('change', { bubbles: true });
    
    if (this.input) {
      this.input.addEventListener('change', this.onInputChange.bind(this));
    }
    
    this.querySelectorAll('button').forEach((button) =>
      button.addEventListener('click', this.onButtonClick.bind(this))
    );
  }

  connectedCallback() {
    this.validateQtyRules();
    // Subscribe to quantity updates if PubSub is available
    if (window.subscribe && window.PUB_SUB_EVENTS) {
      this.unsubscriber = subscribe(PUB_SUB_EVENTS.quantityUpdate, this.validateQtyRules.bind(this));
    }
  }

  disconnectedCallback() {
    if (this.unsubscriber) {
      this.unsubscriber();
    }
  }

  onInputChange() {
    this.validateQtyRules();
  }

  onButtonClick(event) {
    event.preventDefault();
    const previousValue = this.input.value;

    if (event.target.name === 'plus') {
      this.input.stepUp();
    } else {
      this.input.stepDown();
    }
    
    if (previousValue !== this.input.value) {
      this.input.dispatchEvent(this.changeEvent);
    }
  }

  validateQtyRules() {
    const value = parseInt(this.input.value);
    
    if (this.input.min) {
      const min = parseInt(this.input.min);
      const buttonMinus = this.querySelector(".quantity__button[name='minus']");
      if (buttonMinus) {
        buttonMinus.classList.toggle('disabled', value <= min);
      }
    }
    
    if (this.input.max) {
      const max = parseInt(this.input.max);
      const buttonPlus = this.querySelector(".quantity__button[name='plus']");
      if (buttonPlus) {
        buttonPlus.classList.toggle('disabled', value >= max);
      }
    }
  }
}

// Essential Modal Dialog (Optimized)
class ModalDialog extends HTMLElement {
  constructor() {
    super();
    
    const closeButton = this.querySelector('[id^="ModalClose-"]');
    if (closeButton) {
      closeButton.addEventListener('click', () => this.hide(false));
    }
    
    this.addEventListener('keyup', (event) => {
      if (event.code === 'Escape') this.hide();
    });
    
    if (this.classList.contains('media-modal')) {
      this.addEventListener('pointerup', (event) => {
        if (event.pointerType === 'mouse' && !event.target.closest('deferred-media, product-model')) {
          this.hide();
        }
      });
    } else {
      this.addEventListener('click', (event) => {
        if (event.target === this) this.hide();
      });
    }
  }

  connectedCallback() {
    if (this.moved) return;
    this.moved = true;
    document.body.appendChild(this);
  }

  show(opener) {
    this.openedBy = opener;
    const popup = this.querySelector('.template-popup');
    document.body.classList.add('overflow-hidden');
    this.setAttribute('open', '');
    
    if (popup && popup.loadContent) {
      popup.loadContent();
    }
    
    FocusManager.trapFocus(this, this.querySelector('[role="dialog"]'));
    MediaController.pauseAllMedia();
  }

  hide() {
    document.body.classList.remove('overflow-hidden');
    document.body.dispatchEvent(new CustomEvent('modalClosed'));
    this.removeAttribute('open');
    FocusManager.removeTrapFocus(this.openedBy);
    MediaController.pauseAllMedia();
  }
}

// Essential Modal Opener
class ModalOpener extends HTMLElement {
  constructor() {
    super();
    const button = this.querySelector('button');
    if (!button) return;
    
    button.addEventListener('click', () => {
      const modal = document.querySelector(this.getAttribute('data-modal'));
      if (modal && modal.show) {
        modal.show(button);
      }
    });
  }
}

// Essential Deferred Media (Optimized)
class DeferredMedia extends HTMLElement {
  constructor() {
    super();
    const poster = this.querySelector('[id^="Deferred-Poster-"]');
    if (!poster) return;
    poster.addEventListener('click', this.loadContent.bind(this));
  }

  loadContent(focus = true) {
    MediaController.pauseAllMedia();
    
    if (!this.getAttribute('loaded')) {
      const template = this.querySelector('template');
      if (!template) return;
      
      const content = document.createElement('div');
      content.appendChild(template.content.firstElementChild.cloneNode(true));

      this.setAttribute('loaded', true);
      const deferredElement = this.appendChild(content.querySelector('video, model-viewer, iframe'));
      
      if (focus && deferredElement) {
        deferredElement.focus();
      }
      
      if (deferredElement && deferredElement.nodeName === 'VIDEO' && deferredElement.getAttribute('autoplay')) {
        // Force autoplay for Safari
        deferredElement.play();
      }
    }
  }
}

// Register custom elements
if ('customElements' in window) {
  customElements.define('quantity-input', QuantityInput);
  customElements.define('modal-dialog', ModalDialog);
  customElements.define('modal-opener', ModalOpener);
  customElements.define('deferred-media', DeferredMedia);
}

// Make utilities globally available
window.AlShariqahTheme = window.AlShariqahTheme || {};
window.AlShariqahTheme.ThemeUtils = ThemeUtils;
window.AlShariqahTheme.FocusManager = FocusManager;
window.AlShariqahTheme.MediaController = MediaController;

// Legacy global functions for backward compatibility
window.getFocusableElements = FocusManager.getFocusableElements;
window.trapFocus = FocusManager.trapFocus.bind(FocusManager);
window.removeTrapFocus = FocusManager.removeTrapFocus.bind(FocusManager);
window.pauseAllMedia = MediaController.pauseAllMedia;
window.debounce = ThemeUtils.debounce;
window.throttle = ThemeUtils.throttle;
window.fetchConfig = ThemeUtils.fetchConfig;

// Performance mark
if ('performance' in window && 'mark' in window.performance) {
  window.performance.mark('optimized-global-loaded');
}
