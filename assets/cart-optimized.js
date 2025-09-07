/* ===================================================================
   OPTIMIZED CART COMPONENTS BUNDLE
   Replaces heavy cart.js and related cart functionality
   =================================================================== */

// Optimized Cart with performance improvements
class CartOptimized extends HTMLElement {
  constructor() {
    super();
    
    this.cacheDOM();
    this.bindEvents();
    this.setupPerformanceOptimizations();
  }

  cacheDOM() {
    this.cartItems = this.querySelector('#main-cart-items');
    this.cartItemsTarget = this.querySelector('#main-cart-items .js-contents');
    this.cartLiveRegionText = this.querySelector('#cart-live-region-text');
    this.cartStatus = this.querySelector('#main-cart-footer');
    
    // Cache frequently used elements
    this.quantityInputs = this.querySelectorAll('quantity-input');
    this.removeButtons = this.querySelectorAll('.cart-item__remove');
  }

  bindEvents() {
    this.addEventListener('change', this.onCartUpdate.bind(this));
    
    // Optimized click handling with event delegation
    this.addEventListener('click', (event) => {
      if (event.target.matches('.cart-item__remove')) {
        this.onItemRemove(event);
      }
    });
  }

  setupPerformanceOptimizations() {
    // Debounce cart updates to avoid excessive API calls
    this.debouncedUpdate = this.debounce(this.updateCart.bind(this), 300);
    
    // Throttle UI updates for better performance
    this.throttledUIUpdate = this.throttle(this.updateUI.bind(this), 100);
  }

  onCartUpdate(event) {
    if (event.target.tagName === 'QUANTITY-INPUT') {
      this.updateQuantity(
        event.target.dataset.index,
        event.target.value,
        document.activeElement.getAttribute('name'),
        event.target.dataset.quantityVariantId
      );
    }
  }

  onItemRemove(event) {
    event.preventDefault();
    
    const cartItem = event.target.closest('.cart-item');
    if (!cartItem) return;
    
    const index = cartItem.dataset.index;
    this.updateQuantity(index, 0, undefined, cartItem.dataset.variantId);
  }

  updateQuantity(line, quantity, name, variantId) {
    this.enableLoading(line);

    const body = JSON.stringify({
      line,
      quantity,
      sections: this.getSectionsToRender().map((section) => section.section),
      sections_url: window.location.pathname
    });

    fetch(`${routes.cart_change_url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body
    })
    .then((response) => {
      return response.text();
    })
    .then((state) => {
      const parsedState = JSON.parse(state);
      
      // Use throttled UI update for better performance
      this.throttledUIUpdate(parsedState, line, quantity);
      
      this.updateLiveRegions(line, parsedState.item_count);
      
      // Publish cart update event
      if (window.publish && window.PUB_SUB_EVENTS) {
        publish(PUB_SUB_EVENTS.cartUpdate, {
          source: 'cart-page',
          cartData: parsedState,
          variantId: variantId
        });
      }
    })
    .catch((error) => {
      console.error('Cart update error:', error);
      this.querySelectorAll('.loading__spinner').forEach((spinner) => spinner.classList.add('hidden'));
      this.disableLoading();
    });
  }

  updateUI(parsedState, line, quantity) {
    const cartItemsSource = this.querySelector('#main-cart-items') || this.querySelector('#CartDrawer-CartItems');
    const cartFooterSource = this.querySelector('#main-cart-footer') || this.querySelector('#CartDrawer-Footer');

    if (cartItemsSource && parsedState.sections['main-cart-items']) {
      this.updateCartItems(parsedState.sections['main-cart-items']);
    }

    if (cartFooterSource && parsedState.sections['main-cart-footer']) {
      this.updateCartFooter(parsedState.sections['main-cart-footer']);
    }

    // Handle empty cart state
    if (parsedState.item_count === 0) {
      this.handleEmptyCart();
    }

    this.disableLoading();
  }

  updateCartItems(html) {
    const cartItemsTarget = this.querySelector('#main-cart-items .js-contents') || this.querySelector('#CartDrawer-CartItems .js-contents');
    if (cartItemsTarget) {
      cartItemsTarget.innerHTML = this.getCartItemsHTML(html);
      // Re-cache elements after DOM update
      this.cacheDOM();
    }
  }

  updateCartFooter(html) {
    const cartStatus = this.querySelector('#main-cart-footer') || this.querySelector('#CartDrawer-Footer');
    if (cartStatus) {
      cartStatus.innerHTML = this.getCartFooterHTML(html);
    }
  }

  getCartItemsHTML(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.querySelector('#main-cart-items .js-contents')?.innerHTML || '';
  }

  getCartFooterHTML(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.querySelector('#main-cart-footer')?.innerHTML || '';
  }

  handleEmptyCart() {
    const cartEmptyMessage = this.querySelector('.cart__empty-text');
    const cartContents = this.querySelector('.cart__contents');
    
    if (cartEmptyMessage) cartEmptyMessage.classList.remove('hidden');
    if (cartContents) cartContents.classList.add('hidden');
  }

  updateLiveRegions(line, itemCount) {
    const lineItemError = this.querySelector(`#Line-item-error-${line}`) || this.querySelector(`#CartDrawer-LineItemError-${line}`);
    if (lineItemError) {
      lineItemError.querySelector('.cart-item__error-text').innerHTML = '';
    }

    if (this.cartLiveRegionText) {
      this.cartLiveRegionText.setAttribute('aria-hidden', false);
      this.cartLiveRegionText.innerHTML = window.cartStrings.update;
      
      setTimeout(() => {
        this.cartLiveRegionText.setAttribute('aria-hidden', true);
      }, 1000);
    }
  }

  getSectionsToRender() {
    return [
      {
        id: 'main-cart-items',
        section: 'main-cart-items',
        selector: '#main-cart-items .js-contents',
      },
      {
        id: 'main-cart-footer',
        section: 'main-cart-footer',
        selector: '#main-cart-footer',
      },
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section'
      },
      {
        id: 'cart-live-region-text',
        section: 'cart-live-region-text',
        selector: '#cart-live-region-text'
      }
    ];
  }

  enableLoading(line) {
    const cartItem = this.querySelector(`#CartItem-${line}`) || this.querySelector(`#CartDrawer-Item-${line}`);
    if (!cartItem) return;

    const spinner = cartItem.querySelector('.loading__spinner');
    const quantityInput = cartItem.querySelector('.quantity__input');
    
    if (spinner) spinner.classList.remove('hidden');
    if (quantityInput) quantityInput.classList.add('loading');
  }

  disableLoading() {
    this.querySelectorAll('.loading__spinner').forEach((spinner) => {
      spinner.classList.add('hidden');
    });
    
    this.querySelectorAll('.quantity__input').forEach((input) => {
      input.classList.remove('loading');
    });
  }

  // Utility functions for performance
  debounce(fn, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  throttle(fn, delay) {
    let lastCall = 0;
    return (...args) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        fn.apply(this, args);
      }
    };
  }
}

// Optimized Cart Drawer
class CartDrawerOptimized extends HTMLElement {
  constructor() {
    super();
    
    this.bindEvents();
    this.setupPerformanceOptimizations();
  }

  bindEvents() {
    this.addEventListener('keyup', (event) => {
      if (event.code === 'Escape') this.close();
    });

    // Optimized event delegation
    this.addEventListener('click', (event) => {
      if (event.target.matches('.drawer__close')) {
        this.close();
      }
    });
  }

  setupPerformanceOptimizations() {
    // Use RAF for smooth animations
    this.smoothOpen = () => {
      requestAnimationFrame(() => {
        this.classList.add('animate', 'active');
      });
    };

    this.smoothClose = () => {
      this.classList.remove('active');
      setTimeout(() => {
        this.classList.remove('animate');
      }, 300);
    };
  }

  open(opener) {
    this.openedBy = opener;
    
    const cartDrawerNote = this.querySelector('[id^="Details-"] summary');
    if (cartDrawerNote && !cartDrawerNote.hasAttribute('role')) this.setSummaryAccessibility(cartDrawerNote);
    
    // Use optimized animation
    this.smoothOpen();
    
    this.addEventListener('transitionend', () => {
      const containerToTrapFocusOn = this.classList.contains('is-empty') ? this.querySelector('.drawer__inner-empty') : document.getElementById('CartDrawer');
      const focusElement = this.querySelector('.drawer__inner') || this.querySelector('.drawer__close');
      
      const trapFocus = window.AlShariqahTheme?.FocusManager?.trapFocus || window.trapFocus;
      if (trapFocus) {
        trapFocus(containerToTrapFocusOn, focusElement);
      }
    }, { once: true });

    document.body.classList.add('overflow-hidden');
  }

  close() {
    // Use optimized animation
    this.smoothClose();
    
    const removeTrapFocus = window.AlShariqahTheme?.FocusManager?.removeTrapFocus || window.removeTrapFocus;
    if (removeTrapFocus) {
      removeTrapFocus(this.openedBy);
    }
    
    document.body.classList.remove('overflow-hidden');
  }

  setSummaryAccessibility(cartDrawerNote) {
    cartDrawerNote.setAttribute('role', 'button');
    cartDrawerNote.setAttribute('aria-expanded', cartDrawerNote.parentNode.hasAttribute('open'));

    if (cartDrawerNote.nextElementSibling.getAttribute('id')) {
      cartDrawerNote.setAttribute('aria-controls', cartDrawerNote.nextElementSibling.id);
    }

    cartDrawerNote.addEventListener('click', (event) => {
      event.currentTarget.setAttribute('aria-expanded', !event.currentTarget.closest('details').hasAttribute('open'));
    });

    cartDrawerNote.parentElement.addEventListener('keyup', (event) => {
      if (event.code === 'Escape') {
        cartDrawerNote.parentElement.removeAttribute('open');
        cartDrawerNote.setAttribute('aria-expanded', false);
      }
    });
  }

  renderContents(parsedState) {
    this.cartItemsTarget = this.cartItemsTarget || this.querySelector('#CartDrawer-CartItems .js-contents');
    this.cartFooterTarget = this.cartFooterTarget || this.querySelector('#CartDrawer-Footer');
    this.cartEmptyState = this.cartEmptyState || this.querySelector('#CartDrawer-CartItems .cart__empty-text');

    if (parsedState.item_count === 0) {
      this.classList.add('is-empty');
      if (this.cartEmptyState) {
        this.cartEmptyState.classList.remove('hidden');
      }
    } else {
      this.classList.remove('is-empty');
      if (this.cartEmptyState) {
        this.cartEmptyState.classList.add('hidden');
      }
    }

    this.getSectionsToRender().forEach((section) => {
      const sectionElement = this.querySelector(section.selector);
      if (sectionElement && parsedState.sections[section.section]) {
        sectionElement.innerHTML = this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);
      }
    });

    setTimeout(() => {
      this.open();
    });
  }

  getSectionInnerHTML(html, selector) {
    return new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector).innerHTML;
  }

  getSectionsToRender() {
    return [
      {
        id: 'CartDrawer-CartItems',
        section: 'cart-drawer',
        selector: '#CartDrawer-CartItems .js-contents',
      },
      {
        id: 'CartDrawer-Footer',
        section: 'cart-drawer',
        selector: '#CartDrawer-Footer',
      },
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section'
      }
    ];
  }
}

// Register optimized cart components
if ('customElements' in window) {
  customElements.define('cart-items', CartOptimized);
  customElements.define('cart-drawer', CartDrawerOptimized);
}

// Performance mark
if ('performance' in window && 'mark' in window.performance) {
  window.performance.mark('cart-components-loaded');
}
