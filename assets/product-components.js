/* ===================================================================
   OPTIMIZED PRODUCT COMPONENTS BUNDLE
   Replaces heavy product/variant code from global.js
   =================================================================== */

// Optimized Variant Selects with performance improvements
class VariantSelects extends HTMLElement {
  constructor() {
    super();
    
    this.cacheDOM();
    this.bindEvents();
    this.initializeVariants();
  }

  cacheDOM() {
    this.productForm = this.closest('product-form');
    this.selects = this.querySelectorAll('select');
    this.options = Array.from(this.querySelectorAll('select'), (select) => [...select.options]);
    this.prevSelectedValues = this.options.map((option) => option.find((o) => o.selected)?.value);
  }

  bindEvents() {
    this.addEventListener('change', this.onVariantChange.bind(this));
  }

  initializeVariants() {
    if (this.dataset.section) {
      this.productId = this.dataset.section;
      this.variantData = this.getVariantData();
    }
  }

  onVariantChange() {
    this.updateOptions();
    this.updateMasterId();
    this.toggleAddButton(true, '', false);
    this.updatePickupAvailability();
    this.removeErrorMessage();
    this.updateVariantStatuses();

    if (!this.currentVariant) {
      this.toggleAddButton(true, '', true);
      this.setUnavailable();
    } else {
      this.updateMedia();
      this.updateURL();
      this.updateVariantInput();
      this.renderProductInfo();
      this.updateShareUrl();
    }
  }

  updateOptions() {
    const fieldsets = Array.from(this.querySelectorAll('fieldset'));
    this.options = fieldsets.map((fieldset) => {
      return Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked)?.value;
    });
  }

  updateMasterId() {
    this.currentVariant = this.getVariantData().find((variant) => {
      return !variant.options.map((option, index) => {
        return this.options[index] === option;
      }).includes(false);
    });
  }

  updateMedia() {
    if (!this.currentVariant) return;
    if (!this.currentVariant.featured_media) return;

    const mediaGalleries = document.querySelectorAll(`[id^="MediaGallery-${this.dataset.section}"]`);
    mediaGalleries.forEach((mediaGallery) => {
      if (mediaGallery.setActiveMedia) {
        mediaGallery.setActiveMedia(`${this.dataset.section}-${this.currentVariant.featured_media.id}`);
      }
    });

    const modalContent = document.querySelector(`#ProductModal-${this.dataset.section} .product-media-modal__content`);
    if (!modalContent) return;
    
    const newMediaModal = modalContent.querySelector(`[data-media-id="${this.currentVariant.featured_media.id}"]`);
    if (newMediaModal) {
      modalContent.prepend(newMediaModal);
    }
  }

  updateURL() {
    if (!this.currentVariant || this.dataset.updateUrl === 'false') return;
    window.history.replaceState({}, '', `${this.dataset.url}?variant=${this.currentVariant.id}`);
  }

  updateShareUrl() {
    const shareButton = document.getElementById(`Share-${this.dataset.section}`);
    if (!shareButton || !shareButton.updateUrl) return;
    shareButton.updateUrl(`${window.shopUrl}${this.dataset.url}?variant=${this.currentVariant.id}`);
  }

  updateVariantInput() {
    const productForms = document.querySelectorAll(`#product-form-${this.dataset.section}, #product-form-installment-${this.dataset.section}`);
    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]');
      if (input) {
        input.value = this.currentVariant?.id || '';
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  }

  updateVariantStatuses() {
    const selectedOptionOneVariants = this.variantData.filter(variant => this.querySelector(':checked').value === variant.option1);
    const inputWrappers = [...this.querySelectorAll('.product-form__input')];
    
    inputWrappers.forEach((option, index) => {
      if (index === 0) return;
      const optionInputs = [...option.querySelectorAll('input[type="radio"], option')];
      const previousOptionSelected = inputWrappers[index - 1].querySelector(':checked').value;
      const availableOptionInputsValue = selectedOptionOneVariants.filter(variant => variant.available && variant[`option${index}`] === previousOptionSelected).map(variantOption => variantOption[`option${index + 1}`]);
      this.setInputAvailability(optionInputs, availableOptionInputsValue);
    });
  }

  setInputAvailability(listOfOptions, listOfAvailableOptions) {
    listOfOptions.forEach(input => {
      if (listOfAvailableOptions.includes(input.getAttribute('value'))) {
        input.innerText = input.getAttribute('value');
      } else {
        input.innerText = window.variantStrings.unavailable_with_option.replace('[value]', input.getAttribute('value'));
      }
    });
  }

  updatePickupAvailability() {
    const pickUpAvailability = document.querySelector('pickup-availability');
    if (!pickUpAvailability) return;

    if (this.currentVariant && this.currentVariant.available) {
      pickUpAvailability.fetchAvailability(this.currentVariant.id);
    } else {
      pickUpAvailability.removeAttribute('available');
      pickUpAvailability.innerHTML = '';
    }
  }

  removeErrorMessage() {
    const section = this.closest('section');
    if (!section) return;

    const productForm = section.querySelector('product-form');
    if (productForm) productForm.handleErrorMessage();
  }

  renderProductInfo() {
    const requestedVariantId = this.currentVariant?.id;
    const sectionId = this.dataset.originalSection || this.dataset.section;

    fetch(`${this.dataset.url}?variant=${requestedVariantId}&section_id=${sectionId}`)
      .then((response) => response.text())
      .then((responseText) => {
        // Only update if this is still the current variant
        if (this.currentVariant?.id !== requestedVariantId) return;
        
        const html = new DOMParser().parseFromString(responseText, 'text/html');
        const destination = document.getElementById(`price-${this.dataset.section}`);
        const source = html.getElementById(`price-${sectionId}`);

        if (source && destination) destination.innerHTML = source.innerHTML;

        const price = document.getElementById(`price-${this.dataset.section}`);
        if (price) price.classList.remove('visibility-hidden');
        this.toggleAddButton(!this.currentVariant.available, window.variantStrings.soldOut);
      })
      .catch(() => {
        console.warn('Failed to fetch variant info');
      });
  }

  toggleAddButton(disable = true, text, modifyClass = true) {
    const productForm = document.getElementById(`product-form-${this.dataset.section}`);
    if (!productForm) return;

    const addButton = productForm.querySelector('[name="add"]');
    const addButtonText = productForm.querySelector('[name="add"] > span');
    
    if (!addButton) return;

    if (disable) {
      addButton.setAttribute('disabled', 'disabled');
      if (text) addButtonText.textContent = text;
    } else {
      addButton.removeAttribute('disabled');
      addButtonText.textContent = window.variantStrings.addToCart;
    }

    if (!modifyClass) return;
  }

  setUnavailable() {
    const button = document.getElementById(`product-form-${this.dataset.section}`);
    const addButton = button?.querySelector('[name="add"]');
    const addButtonText = button?.querySelector('[name="add"] > span');
    const price = document.getElementById(`price-${this.dataset.section}`);
    
    if (!addButton) return;
    
    addButtonText.textContent = window.variantStrings.unavailable;
    if (price) price.classList.add('visibility-hidden');
  }

  getVariantData() {
    this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
    return this.variantData;
  }
}

// Optimized Product Form
class ProductForm extends HTMLElement {
  constructor() {
    super();
    
    this.form = this.querySelector('form');
    this.form?.addEventListener('submit', this.onSubmitHandler.bind(this));
    this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
    this.submitButton = this.querySelector('[type="submit"]');
    this.submitButtonText = this.submitButton?.querySelector('span');
  }

  onSubmitHandler(evt) {
    evt.preventDefault();
    
    if (this.submitButton.getAttribute('disabled') === 'disabled') return;

    this.handleErrorMessage();
    this.submitButton.setAttribute('disabled', true);
    this.submitButton.classList.add('loading');
    this.querySelector('.loading__spinner').classList.remove('hidden');

    const config = window.AlShariqahTheme?.ThemeUtils?.fetchConfig('javascript') || {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/javascript' },
    };
    
    config.body = JSON.stringify({
      id: this.form.querySelector('[name="id"]').value,
      quantity: this.form.querySelector('[name="quantity"]').value,
      sections: this.cart?.getSectionsToRender?.()?.map((section) => section.id),
      sections_url: window.location.pathname,
      ...this.getAdditionalData()
    });

    fetch(`${routes.cart_add_url}`, config)
      .then((response) => response.json())
      .then((response) => {
        if (response.status) {
          this.handleErrorMessage(response.description);

          const soldOutMessage = this.submitButton.querySelector('.sold-out-message');
          if (!soldOutMessage) return;
          this.submitButton.setAttribute('disabled', true);
          this.submitButtonText.classList.add('hidden');
          soldOutMessage.classList.remove('hidden');
          this.error = true;
          return;
        } else if (!this.cart) {
          window.location = window.routes.cart_url;
          return;
        }

        if (!this.error) {
          this.cart.renderContents(response);
        }

        this.submitButton.classList.remove('loading');
        if (this.cart && this.cart.classList.contains('is-empty')) this.cart.classList.remove('is-empty');
        if (!this.error) this.submitButton.setAttribute('disabled', false);
        this.querySelector('.loading__spinner').classList.add('hidden');
      })
      .catch((e) => {
        console.error(e);
        this.handleErrorMessage('Network error occurred');
      })
      .finally(() => {
        this.submitButton.classList.remove('loading');
        this.querySelector('.loading__spinner').classList.add('hidden');
      });
  }

  getAdditionalData() {
    const sellingPlanInput = this.form.querySelector('[name="selling_plan"]');
    const additionalData = {};

    if (sellingPlanInput && sellingPlanInput.value !== '') {
      additionalData.selling_plan = sellingPlanInput.value;
    }

    // Add gift card recipient if present
    const recipientFields = this.form.querySelectorAll('[name^="properties[__recipient"]');
    if (recipientFields.length > 0) {
      recipientFields.forEach(field => {
        if (field.value) {
          additionalData[field.name] = field.value;
        }
      });
    }

    return additionalData;
  }

  handleErrorMessage(errorMessage = false) {
    this.errorMessageWrapper = this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
    if (!this.errorMessageWrapper) return;
    
    this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

    this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

    if (errorMessage) {
      this.errorMessage.textContent = errorMessage;
    }
  }
}

// Register optimized product components
if ('customElements' in window) {
  customElements.define('variant-selects', VariantSelects);
  customElements.define('product-form', ProductForm);
}

// Performance mark
if ('performance' in window && 'mark' in window.performance) {
  window.performance.mark('product-components-loaded');
}
