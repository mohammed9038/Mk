/**
 * Enhanced Product Variant Picker
 * Provides intelligent variant selection with visual feedback
 * Includes color swatches, size guides, and availability notifications
 */

class EnhancedVariantPicker {
  constructor() {
    this.currentVariant = null;
    this.product = null;
    this.variantData = {};
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupVariantPickers());
    } else {
      this.setupVariantPickers();
    }
  }

  setupVariantPickers() {
    // Find all product forms
    const productForms = document.querySelectorAll('form[action*="/cart/add"]');
    
    productForms.forEach(form => {
      this.enhanceVariantPicker(form);
    });
    
    console.log('✅ Enhanced Variant Picker initialized');
  }

  enhanceVariantPicker(form) {
    const productData = this.getProductData(form);
    if (!productData) return;
    
    this.product = productData;
    
    // Enhance existing variant selects
    this.enhanceVariantSelects(form);
    
    // Add color swatches
    this.addColorSwatches(form);
    
    // Add size guide
    this.addSizeGuide(form);
    
    // Add inventory notifications
    this.addInventoryNotifications(form);
    
    // Add variant change handlers
    this.addVariantChangeHandlers(form);
    
    // Update initial state
    this.updateVariantDisplay(form);
  }

  getProductData(form) {
    // Try to get product data from various sources
    let productData = null;
    
    // From data attributes
    if (form.dataset.product) {
      try {
        productData = JSON.parse(form.dataset.product);
      } catch (e) {
        console.warn('Could not parse product data from form');
      }
    }
    
    // From global variables
    if (!productData && window.productData) {
      productData = window.productData;
    }
    
    // From script tags
    if (!productData) {
      const productScript = document.querySelector('script[type="application/json"][data-product-json]');
      if (productScript) {
        try {
          productData = JSON.parse(productScript.textContent);
        } catch (e) {
          console.warn('Could not parse product JSON');
        }
      }
    }
    
    return productData;
  }

  enhanceVariantSelects(form) {
    const selects = form.querySelectorAll('select[data-option-select]');
    
    selects.forEach(select => {
      // Add custom styling
      const wrapper = select.closest('.product-form__input') || select.parentNode;
      wrapper.classList.add('enhanced-select-wrapper');
      
      // Add icons for better UX
      if (!wrapper.querySelector('.select-icon')) {
        const icon = document.createElement('div');
        icon.className = 'select-icon';
        icon.innerHTML = '▼';
        wrapper.appendChild(icon);
      }
      
      // Add option descriptions
      this.addOptionDescriptions(select);
    });
  }

  addOptionDescriptions(select) {
    const options = select.querySelectorAll('option');
    
    options.forEach(option => {
      const value = option.value;
      
      // Add size information for size options
      if (this.isSizeOption(select)) {
        const sizeInfo = this.getSizeInfo(value);
        if (sizeInfo) {
          option.setAttribute('data-description', sizeInfo);
        }
      }
      
      // Add availability info
      const availability = this.getOptionAvailability(select, value);
      if (!availability.available) {
        option.setAttribute('data-unavailable', 'true');
        option.textContent += ' (Sold Out)';
      } else if (availability.lowStock) {
        option.setAttribute('data-low-stock', 'true');
        option.textContent += ` (${availability.quantity} left)`;
      }
    });
  }

  addColorSwatches(form) {
    const colorSelects = form.querySelectorAll('select[data-option-select]');
    
    colorSelects.forEach(select => {
      if (!this.isColorOption(select)) return;
      
      const swatchContainer = document.createElement('div');
      swatchContainer.className = 'color-swatches';
      
      const options = select.querySelectorAll('option:not([value=""])');
      
      options.forEach(option => {
        const swatch = this.createColorSwatch(option.value, option.textContent);
        swatch.addEventListener('click', () => {
          select.value = option.value;
          select.dispatchEvent(new Event('change'));
          this.updateSwatchSelection(swatchContainer, swatch);
        });
        
        swatchContainer.appendChild(swatch);
      });
      
      // Insert swatches before the select
      select.parentNode.insertBefore(swatchContainer, select);
      
      // Hide the original select
      select.style.display = 'none';
      
      // Set initial selection
      if (select.value) {
        const activeSwatch = swatchContainer.querySelector(`[data-value="${select.value}"]`);
        if (activeSwatch) {
          this.updateSwatchSelection(swatchContainer, activeSwatch);
        }
      }
    });
  }

  createColorSwatch(value, name) {
    const swatch = document.createElement('button');
    swatch.type = 'button';
    swatch.className = 'color-swatch';
    swatch.setAttribute('data-value', value);
    swatch.setAttribute('aria-label', `Select ${name}`);
    swatch.setAttribute('title', name);
    
    // Try to get color from name or use default
    const color = this.getColorFromName(name);
    swatch.style.backgroundColor = color;
    
    // Add pattern for complex colors
    if (this.isPatternColor(name)) {
      swatch.classList.add('pattern-swatch');
      swatch.style.backgroundImage = this.getPatternImage(name);
    }
    
    return swatch;
  }

  updateSwatchSelection(container, activeSwatch) {
    // Remove active class from all swatches
    container.querySelectorAll('.color-swatch').forEach(swatch => {
      swatch.classList.remove('active');
    });
    
    // Add active class to selected swatch
    activeSwatch.classList.add('active');
  }

  addSizeGuide(form) {
    const sizeSelects = form.querySelectorAll('select[data-option-select]');
    
    sizeSelects.forEach(select => {
      if (!this.isSizeOption(select)) return;
      
      const sizeGuideBtn = document.createElement('button');
      sizeGuideBtn.type = 'button';
      sizeGuideBtn.className = 'size-guide-btn';
      sizeGuideBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 12l2 2 4-4"/>
          <circle cx="12" cy="12" r="10"/>
        </svg>
        Size Guide
      `;
      
      sizeGuideBtn.addEventListener('click', () => this.openSizeGuide());
      
      // Insert after the select wrapper
      const wrapper = select.closest('.product-form__input') || select.parentNode;
      wrapper.parentNode.insertBefore(sizeGuideBtn, wrapper.nextSibling);
    });
  }

  openSizeGuide() {
    const modal = document.createElement('div');
    modal.className = 'size-guide-modal';
    modal.innerHTML = `
      <div class="size-guide-content">
        <div class="size-guide-header">
          <h3>Size Guide</h3>
          <button class="size-guide-close" aria-label="Close">×</button>
        </div>
        <div class="size-guide-body">
          <table class="size-chart">
            <thead>
              <tr>
                <th>Size</th>
                <th>Chest (cm)</th>
                <th>Waist (cm)</th>
                <th>Length (cm)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>S</td><td>88-92</td><td>76-80</td><td>68</td></tr>
              <tr><td>M</td><td>92-96</td><td>80-84</td><td>70</td></tr>
              <tr><td>L</td><td>96-100</td><td>84-88</td><td>72</td></tr>
              <tr><td>XL</td><td>100-104</td><td>88-92</td><td>74</td></tr>
              <tr><td>XXL</td><td>104-108</td><td>92-96</td><td>76</td></tr>
            </tbody>
          </table>
          <div class="size-guide-tips">
            <h4>Measuring Tips:</h4>
            <ul>
              <li>Measure around the fullest part of your chest</li>
              <li>Measure around your natural waistline</li>
              <li>For length, measure from shoulder to hem</li>
            </ul>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close handlers
    modal.querySelector('.size-guide-close').addEventListener('click', () => this.closeSizeGuide(modal));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.closeSizeGuide(modal);
    });
  }

  closeSizeGuide(modal) {
    document.body.removeChild(modal);
    document.body.style.overflow = '';
  }

  addInventoryNotifications(form) {
    const notification = document.createElement('div');
    notification.className = 'variant-inventory-notification';
    
    // Insert after variant selects
    const lastSelect = form.querySelector('select[data-option-select]:last-of-type');
    if (lastSelect) {
      const wrapper = lastSelect.closest('.product-form__input') || lastSelect.parentNode;
      wrapper.parentNode.insertBefore(notification, wrapper.nextSibling);
    }
  }

  addVariantChangeHandlers(form) {
    const selects = form.querySelectorAll('select[data-option-select]');
    
    selects.forEach(select => {
      select.addEventListener('change', () => {
        this.updateVariantDisplay(form);
        this.updateAvailableOptions(form);
      });
    });
  }

  updateVariantDisplay(form) {
    const selectedVariant = this.getSelectedVariant(form);
    
    if (selectedVariant) {
      this.currentVariant = selectedVariant;
      this.updatePrice(form, selectedVariant);
      this.updateInventoryNotification(form, selectedVariant);
      this.updateBuyButton(form, selectedVariant);
      this.updateVariantImage(selectedVariant);
    }
  }

  getSelectedVariant(form) {
    if (!this.product || !this.product.variants) return null;
    
    const selectedOptions = [];
    const selects = form.querySelectorAll('select[data-option-select]');
    
    selects.forEach(select => {
      selectedOptions.push(select.value);
    });
    
    return this.product.variants.find(variant => {
      return variant.options.every((option, index) => option === selectedOptions[index]);
    });
  }

  updatePrice(form, variant) {
    const priceElement = form.querySelector('.price, [data-price]');
    if (!priceElement) return;
    
    const price = this.formatPrice(variant.price);
    const compareAtPrice = variant.compare_at_price ? this.formatPrice(variant.compare_at_price) : null;
    
    if (compareAtPrice && compareAtPrice !== price) {
      priceElement.innerHTML = `
        <span class="price-sale">${price}</span>
        <span class="price-compare">${compareAtPrice}</span>
      `;
    } else {
      priceElement.innerHTML = `<span class="price-regular">${price}</span>`;
    }
  }

  updateInventoryNotification(form, variant) {
    const notification = form.querySelector('.variant-inventory-notification');
    if (!notification) return;
    
    if (!variant.available) {
      notification.innerHTML = `
        <div class="inventory-status out-of-stock">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          Out of stock
        </div>
      `;
    } else if (variant.inventory_quantity && variant.inventory_quantity <= 5) {
      notification.innerHTML = `
        <div class="inventory-status low-stock">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          Only ${variant.inventory_quantity} left in stock
        </div>
      `;
    } else {
      notification.innerHTML = `
        <div class="inventory-status in-stock">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22,4 12,14.01 9,11.01"/>
          </svg>
          In stock
        </div>
      `;
    }
  }

  updateBuyButton(form, variant) {
    const buyButton = form.querySelector('[name="add"], .btn-product-add');
    if (!buyButton) return;
    
    if (!variant.available) {
      buyButton.disabled = true;
      buyButton.textContent = 'Sold Out';
      buyButton.classList.add('disabled');
    } else {
      buyButton.disabled = false;
      buyButton.textContent = 'Add to Cart';
      buyButton.classList.remove('disabled');
    }
  }

  updateVariantImage(variant) {
    if (!variant.featured_image) return;
    
    // Update main product image
    const mainImage = document.querySelector('.product__media img[data-media-id]');
    if (mainImage) {
      mainImage.src = variant.featured_image.src;
      mainImage.alt = variant.featured_image.alt || variant.name;
    }
  }

  // Helper methods
  isColorOption(select) {
    const label = select.previousElementSibling;
    if (!label) return false;
    
    const text = label.textContent.toLowerCase();
    return text.includes('color') || text.includes('colour');
  }

  isSizeOption(select) {
    const label = select.previousElementSibling;
    if (!label) return false;
    
    const text = label.textContent.toLowerCase();
    return text.includes('size');
  }

  getColorFromName(colorName) {
    const colorMap = {
      'black': '#000000',
      'white': '#ffffff',
      'red': '#ff0000',
      'blue': '#0000ff',
      'green': '#008000',
      'yellow': '#ffff00',
      'pink': '#ffc0cb',
      'purple': '#800080',
      'gray': '#808080',
      'grey': '#808080',
      'brown': '#a52a2a',
      'orange': '#ffa500',
      'navy': '#000080',
      'beige': '#f5f5dc'
    };
    
    return colorMap[colorName.toLowerCase()] || '#cccccc';
  }

  isPatternColor(colorName) {
    const patterns = ['stripe', 'plaid', 'check', 'dot', 'floral', 'print'];
    return patterns.some(pattern => colorName.toLowerCase().includes(pattern));
  }

  getPatternImage(colorName) {
    // Return default pattern - in real implementation, you'd have actual pattern images
    return 'url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'4\' height=\'4\'><rect width=\'4\' height=\'4\' fill=\'%23000\'></rect><rect width=\'2\' height=\'2\' fill=\'%23fff\'></rect></svg>")';
  }

  formatPrice(cents) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100);
  }

  getSizeInfo(size) {
    const sizeGuide = {
      'XS': 'Extra Small',
      'S': 'Small (Chest: 34-36")',
      'M': 'Medium (Chest: 38-40")',
      'L': 'Large (Chest: 42-44")',
      'XL': 'Extra Large (Chest: 46-48")',
      'XXL': '2X Large (Chest: 50-52")'
    };
    
    return sizeGuide[size.toUpperCase()];
  }

  getOptionAvailability(select, value) {
    // This would be enhanced with real inventory data
    return {
      available: true,
      quantity: Math.floor(Math.random() * 20) + 1,
      lowStock: Math.random() > 0.8
    };
  }

  updateAvailableOptions(form) {
    // Enable/disable options based on current selection
    const selects = form.querySelectorAll('select[data-option-select]');
    
    selects.forEach((select, index) => {
      const options = select.querySelectorAll('option:not([value=""])');
      
      options.forEach(option => {
        const tempSelection = this.buildTempSelection(form, index, option.value);
        const variant = this.findVariantBySelection(tempSelection);
        
        if (!variant || !variant.available) {
          option.disabled = true;
          option.classList.add('unavailable');
        } else {
          option.disabled = false;
          option.classList.remove('unavailable');
        }
      });
    });
  }

  buildTempSelection(form, currentIndex, currentValue) {
    const selects = form.querySelectorAll('select[data-option-select]');
    const selection = [];
    
    selects.forEach((select, index) => {
      if (index === currentIndex) {
        selection.push(currentValue);
      } else {
        selection.push(select.value);
      }
    });
    
    return selection;
  }

  findVariantBySelection(selection) {
    if (!this.product || !this.product.variants) return null;
    
    return this.product.variants.find(variant => {
      return variant.options.every((option, index) => option === selection[index]);
    });
  }

  // Public method to refresh after dynamic changes
  refresh() {
    this.setupVariantPickers();
  }
}

// Auto-initialize
const enhancedVariantPicker = new EnhancedVariantPicker();

// Make globally available
window.EnhancedVariantPicker = enhancedVariantPicker;

// Re-initialize on section changes
document.addEventListener('shopify:section:load', () => {
  enhancedVariantPicker.refresh();
});
