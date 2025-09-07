/* ===================================================================
   OPTIMIZED QUICK ORDER COMPONENTS
   Replaces heavy quick-order-list.js with performance improvements
   =================================================================== */

// Optimized Quick Order List with performance enhancements
class QuickOrderListOptimized extends HTMLElement {
  constructor() {
    super();
    
    this.cacheDOM();
    this.bindEvents();
    this.setupPerformanceOptimizations();
  }

  cacheDOM() {
    this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
    this.quickOrderListId = `quick-order-list-${this.dataset.productId}`;
    this.variantItemStatusElement = document.getElementById('quick-order-list-item-status');
    
    // Cache frequently accessed elements
    this.variantInputs = this.querySelectorAll('.variant-item__input');
    this.quantityInputs = this.querySelectorAll('quantity-input');
    this.addButtons = this.querySelectorAll('.quick-add__submit');
  }

  bindEvents() {
    // Use event delegation for better performance
    this.addEventListener('change', this.onVariantChange.bind(this));
    this.addEventListener('submit', this.onSubmit.bind(this));
    this.addEventListener('input', this.onInput.bind(this));
  }

  setupPerformanceOptimizations() {
    // Debounce variant changes to avoid excessive processing
    this.debouncedVariantChange = this.debounce(this.handleVariantChange.bind(this), 300);
    
    // Throttle UI updates
    this.throttledUIUpdate = this.throttle(this.updateUI.bind(this), 100);
    
    // Setup intersection observer for lazy loading
    this.setupIntersectionObserver();
  }

  setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) return;

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.initializeQuickOrder();
          this.observer.disconnect();
        }
      });
    }, {
      rootMargin: '100px'
    });

    this.observer.observe(this);
  }

  initializeQuickOrder() {
    // Initialize quick order functionality when visible
    this.loadVariantData();
    this.setupFormValidation();
  }

  loadVariantData() {
    // Load product variant data if not already loaded
    if (!this.variantData) {
      const variantDataElement = this.querySelector('[type="application/json"]');
      if (variantDataElement) {
        try {
          this.variantData = JSON.parse(variantDataElement.textContent);
        } catch (error) {
          console.error('Failed to parse variant data:', error);
        }
      }
    }
  }

  onVariantChange(event) {
    if (event.target.matches('.variant-item__input')) {
      this.debouncedVariantChange(event);
    }
  }

  handleVariantChange(event) {
    const variantId = event.target.value;
    const targetElement = event.target.closest('.variant-item');
    
    if (!targetElement) return;

    this.updateVariantItem(targetElement, variantId);
  }

  updateVariantItem(targetElement, variantId) {
    const variant = this.getVariantById(variantId);
    
    if (!variant) {
      this.handleUnavailableVariant(targetElement);
      return;
    }

    // Update price
    this.updateVariantPrice(targetElement, variant);
    
    // Update availability
    this.updateVariantAvailability(targetElement, variant);
    
    // Update quantity input
    this.updateQuantityInput(targetElement, variant);
  }

  updateVariantPrice(targetElement, variant) {
    const priceElement = targetElement.querySelector('.variant-item__price');
    if (!priceElement) return;

    const price = this.formatPrice(variant.price);
    priceElement.textContent = price;

    // Update compare at price if available
    const compareAtPriceElement = targetElement.querySelector('.variant-item__compare-price');
    if (compareAtPriceElement && variant.compare_at_price > variant.price) {
      const compareAtPrice = this.formatPrice(variant.compare_at_price);
      compareAtPriceElement.textContent = compareAtPrice;
      compareAtPriceElement.classList.remove('hidden');
    } else if (compareAtPriceElement) {
      compareAtPriceElement.classList.add('hidden');
    }
  }

  updateVariantAvailability(targetElement, variant) {
    const addButton = targetElement.querySelector('.quick-add__submit');
    const quantityInput = targetElement.querySelector('quantity-input');
    
    if (!addButton) return;

    if (variant.available) {
      addButton.removeAttribute('disabled');
      addButton.textContent = window.quickOrderListStrings?.addToCart || 'Add to cart';
      
      if (quantityInput) {
        quantityInput.removeAttribute('disabled');
      }
    } else {
      addButton.setAttribute('disabled', 'disabled');
      addButton.textContent = window.quickOrderListStrings?.soldOut || 'Sold out';
      
      if (quantityInput) {
        quantityInput.setAttribute('disabled', 'disabled');
      }
    }
  }

  updateQuantityInput(targetElement, variant) {
    const quantityInput = targetElement.querySelector('quantity-input input');
    if (!quantityInput) return;

    // Set max quantity if inventory tracking is enabled
    if (variant.inventory_management && variant.inventory_quantity > 0) {
      quantityInput.setAttribute('max', variant.inventory_quantity);
    } else {
      quantityInput.removeAttribute('max');
    }
  }

  handleUnavailableVariant(targetElement) {
    const addButton = targetElement.querySelector('.quick-add__submit');
    const quantityInput = targetElement.querySelector('quantity-input');
    
    if (addButton) {
      addButton.setAttribute('disabled', 'disabled');
      addButton.textContent = window.quickOrderListStrings?.unavailable || 'Unavailable';
    }
    
    if (quantityInput) {
      quantityInput.setAttribute('disabled', 'disabled');
    }
  }

  onSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const variantId = form.querySelector('.variant-item__input')?.value;
    const quantity = parseInt(form.querySelector('quantity-input input')?.value) || 1;
    
    if (!variantId) {
      this.displayError('Please select a variant');
      return;
    }

    this.addToCart(variantId, quantity, form);
  }

  addToCart(variantId, quantity, form) {
    const addButton = form.querySelector('.quick-add__submit');
    
    // Show loading state
    this.setLoadingState(addButton, true);
    
    const body = JSON.stringify({
      id: variantId,
      quantity: quantity,
      sections: this.cart?.getSectionsToRender?.()?.map((section) => section.id) || [],
      sections_url: window.location.pathname
    });

    fetch(`${routes.cart_add_url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body
    })
    .then(response => response.json())
    .then(response => {
      if (response.status) {
        this.handleAddToCartError(response.description, addButton);
        return;
      }

      // Success - update cart
      if (this.cart && this.cart.renderContents) {
        this.cart.renderContents(response);
      }

      // Reset form
      this.resetForm(form);
      
      // Show success message
      this.displaySuccess('Added to cart');
    })
    .catch(error => {
      console.error('Add to cart error:', error);
      this.handleAddToCartError('Network error occurred', addButton);
    })
    .finally(() => {
      this.setLoadingState(addButton, false);
    });
  }

  handleAddToCartError(message, addButton) {
    this.displayError(message);
    
    // Update button text temporarily
    const originalText = addButton.textContent;
    addButton.textContent = 'Error';
    
    setTimeout(() => {
      addButton.textContent = originalText;
    }, 3000);
  }

  setLoadingState(button, isLoading) {
    if (isLoading) {
      button.setAttribute('disabled', 'disabled');
      button.classList.add('loading');
      
      // Add spinner if available
      const spinner = button.querySelector('.loading__spinner');
      if (spinner) {
        spinner.classList.remove('hidden');
      }
    } else {
      button.removeAttribute('disabled');
      button.classList.remove('loading');
      
      // Hide spinner
      const spinner = button.querySelector('.loading__spinner');
      if (spinner) {
        spinner.classList.add('hidden');
      }
    }
  }

  resetForm(form) {
    const quantityInput = form.querySelector('quantity-input input');
    if (quantityInput) {
      quantityInput.value = 1;
    }
  }

  displayError(message) {
    if (this.variantItemStatusElement) {
      this.variantItemStatusElement.textContent = message;
      this.variantItemStatusElement.classList.add('quick-order-list__message--error');
      this.variantItemStatusElement.classList.remove('hidden');
      
      setTimeout(() => {
        this.variantItemStatusElement.classList.add('hidden');
        this.variantItemStatusElement.classList.remove('quick-order-list__message--error');
      }, 5000);
    }
  }

  displaySuccess(message) {
    if (this.variantItemStatusElement) {
      this.variantItemStatusElement.textContent = message;
      this.variantItemStatusElement.classList.add('quick-order-list__message--success');
      this.variantItemStatusElement.classList.remove('hidden');
      
      setTimeout(() => {
        this.variantItemStatusElement.classList.add('hidden');
        this.variantItemStatusElement.classList.remove('quick-order-list__message--success');
      }, 3000);
    }
  }

  getVariantById(variantId) {
    if (!this.variantData || !variantId) return null;
    return this.variantData.find(variant => variant.id.toString() === variantId.toString());
  }

  formatPrice(price) {
    return new Intl.NumberFormat(window.Shopify?.locale || 'en', {
      style: 'currency',
      currency: window.Shopify?.currency?.active || 'USD'
    }).format(price / 100);
  }

  // Utility functions
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

  setupFormValidation() {
    // Add form validation for better UX
    this.variantInputs.forEach(input => {
      input.addEventListener('invalid', (event) => {
        event.preventDefault();
        this.displayError('Please select a valid variant');
      });
    });
  }

  disconnectedCallback() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Register optimized quick order component
if ('customElements' in window) {
  customElements.define('quick-order-list', QuickOrderListOptimized);
}

// Performance mark
if ('performance' in window && 'mark' in window.performance) {
  window.performance.mark('quick-order-components-loaded');
}
