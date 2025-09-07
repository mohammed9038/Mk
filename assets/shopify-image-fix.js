/**
 * Modern Shopify Image Loading Fix
 * Follows Shopify best practices for responsive images and error handling
 * Based on official Shopify documentation: https://shopify.dev/docs/storefronts/themes/best-practices/performance
 */

class ShopifyImageFix {
  constructor() {
    this.retryAttempts = 3;
    this.retryDelay = 500;
    this.processedImages = new Set();
    this.config = {
      // Shopify CDN responsive widths following best practices
      responsiveWidths: [165, 360, 533, 720, 940, 1066, 1200, 1500, 1920],
      placeholderColor: '#f8f9fa',
      loadingSpinnerColor: '#007bff'
    };
    
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.startImageFix());
    } else {
      this.startImageFix();
    }
  }

  startImageFix() {
    // Fix existing images
    this.fixAllImages();
    
    // Setup mutation observer for dynamic content
    this.setupMutationObserver();
    
    // Handle theme editor changes
    if (window.Shopify && window.Shopify.designMode) {
      document.addEventListener('shopify:section:load', () => this.fixAllImages());
      document.addEventListener('shopify:section:reorder', () => this.fixAllImages());
    }
    
    console.log('🖼️ Shopify Image Fix initialized following best practices');
  }

  fixAllImages() {
    // Target all image containers following Shopify patterns
    const imageSelectors = [
      'img[src*="cdn.shopify.com"]',
      '.card__media img',
      '.product__media img', 
      '.featured_media img',
      'img[data-src]',
      'img.product-card-image',
      '.media img',
      '[data-media-id] img',
      '[class*="ai-brand-bar"] img',
      '[class*="brand"] img',
      '.brand-bar img',
      '.collection-card img',
      '.featured-collection img',
      '.slider img',
      '.slideshow img'
    ];
    
    const images = document.querySelectorAll(imageSelectors.join(', '));
    
    images.forEach(img => {
      if (this.processedImages.has(img)) return;
      this.processedImages.add(img);
      
      this.setupImageHandlers(img);
      
      // Check if image is already failed
      if (img.complete && img.naturalWidth === 0) {
        this.handleImageError(img);
      }
    });
    
    console.log(`🔍 Processed ${images.length} Shopify images`);
  }

  setupImageHandlers(img) {
    // Modern event listeners following Shopify best practices
    img.addEventListener('error', () => this.handleImageError(img), { once: false });
    img.addEventListener('load', () => this.handleImageSuccess(img), { once: true });
    
    // Ensure proper loading attribute for performance
    if (!img.hasAttribute('loading') && !this.isAboveFold(img)) {
      img.setAttribute('loading', 'lazy');
    }
    
    // Add proper sizes if missing
    if (!img.hasAttribute('sizes') && img.hasAttribute('srcset')) {
      img.setAttribute('sizes', this.getDefaultSizes());
    }
  }

  handleImageError(img) {
    const imgSrc = img.src || img.dataset.src || '';
    const retryCount = parseInt(img.dataset.retryCount || '0');
    
    console.warn('🚫 Image failed to load:', imgSrc.substring(0, 80) + '...');
    
    if (retryCount < this.retryAttempts && imgSrc.includes('cdn.shopify.com')) {
      // Retry with smaller image size for Shopify CDN
      this.retryWithSmallerSize(img, retryCount);
    } else {
      // Create proper Shopify-style placeholder
      this.createShopifyPlaceholder(img);
    }
  }

  retryWithSmallerSize(img, retryCount) {
    const currentSrc = img.src;
    let newSrc = currentSrc;
    
    // Extract current width and try smaller size
    const widthMatch = currentSrc.match(/[?&]width=(\d+)/);
    if (widthMatch) {
      const currentWidth = parseInt(widthMatch[1]);
      const smallerWidth = this.findSmallerWidth(currentWidth);
      
      if (smallerWidth) {
        newSrc = currentSrc.replace(/([?&])width=\d+/, `$1width=${smallerWidth}`);
      }
    } else {
      // Add width parameter if missing
      const separator = currentSrc.includes('?') ? '&' : '?';
      newSrc = `${currentSrc}${separator}width=533`;
    }
    
    if (newSrc !== currentSrc) {
      img.dataset.retryCount = (retryCount + 1).toString();
      
      setTimeout(() => {
        img.src = newSrc;
        console.log(`🔄 Retry ${retryCount + 1}: Loading smaller image size`);
      }, this.retryDelay * (retryCount + 1));
    } else {
      this.createShopifyPlaceholder(img);
    }
  }

  findSmallerWidth(currentWidth) {
    // Find next smaller size from Shopify recommended widths
    const smaller = this.config.responsiveWidths.filter(w => w < currentWidth);
    return smaller.length > 0 ? smaller[smaller.length - 1] : null;
  }

  createShopifyPlaceholder(img) {
    const imgId = img.src || img.dataset.src || 'placeholder';
    
    // Create modern Shopify-style placeholder
    const productTitle = this.getProductTitle(img);
    const container = img.closest('.card__media, .media, .product__media') || img.parentElement;
    
    if (container) {
      container.classList.add('image-placeholder-container');
      
      // Create placeholder with proper Shopify styling
      const placeholder = document.createElement('div');
      placeholder.className = 'shopify-image-placeholder';
      placeholder.setAttribute('aria-label', `Product image placeholder: ${productTitle}`);
      
      placeholder.innerHTML = `
        <div class="placeholder-content">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21,15 16,10 5,21"/>
          </svg>
          <span class="placeholder-title">${productTitle}</span>
        </div>
      `;
      
      // Apply Shopify-standard styling
      Object.assign(placeholder.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: this.config.placeholderColor,
        color: '#6c757d',
        fontSize: '0.875rem',
        textAlign: 'center',
        zIndex: '1'
      });
      
      // Hide broken image and show placeholder
      img.style.opacity = '0';
      container.style.position = 'relative';
      container.appendChild(placeholder);
      
      console.log('📷 Created Shopify placeholder for:', productTitle);
    }
  }

  handleImageSuccess(img) {
    img.classList.add('loaded');
    img.style.opacity = '1';
    
    // Remove any existing placeholders
    const container = img.closest('.card__media, .media, .product__media');
    if (container) {
      const placeholder = container.querySelector('.shopify-image-placeholder');
      if (placeholder) {
        placeholder.remove();
      }
      container.classList.remove('image-placeholder-container');
    }
  }

  getProductTitle(img) {
    // Extract product title from various sources
    return img.dataset.productTitle ||
           img.alt ||
           img.closest('[data-product-title]')?.dataset.productTitle ||
           img.closest('.card')?.querySelector('.card__heading')?.textContent?.trim() ||
           'Product Image';
  }

  isAboveFold(img) {
    // Check if image is likely above the fold (first 800px)
    const rect = img.getBoundingClientRect();
    return rect.top < 800;
  }

  getDefaultSizes() {
    // Shopify recommended sizes attribute for responsive images
    return '(min-width: 1200px) 267px, (min-width: 990px) calc((100vw - 130px) / 4), (min-width: 750px) calc((100vw - 120px) / 3), calc((100vw - 35px) / 2)';
  }

  setupMutationObserver() {
    // Watch for dynamically added content
    const observer = new MutationObserver((mutations) => {
      let hasNewImages = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const newImages = node.querySelectorAll ? node.querySelectorAll('img') : [];
              if (newImages.length > 0 || node.tagName === 'IMG') {
                hasNewImages = true;
              }
            }
          });
        }
      });
      
      if (hasNewImages) {
        // Debounced image fixing for performance
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => this.fixAllImages(), 100);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    console.log('👀 Mutation observer setup for dynamic content');
  }
}

// Initialize when script loads
if (typeof window !== 'undefined') {
  window.ShopifyImageFix = new ShopifyImageFix();
}

// Add CSS for placeholders following Shopify design patterns
const style = document.createElement('style');
style.textContent = `
  .shopify-image-placeholder {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    transition: opacity 0.3s ease;
  }
  
  .shopify-image-placeholder .placeholder-content {
    text-align: center;
    opacity: 0.7;
  }
  
  .shopify-image-placeholder svg {
    margin-bottom: 8px;
    opacity: 0.5;
  }
  
  .shopify-image-placeholder .placeholder-title {
    display: block;
    max-width: 150px;
    font-weight: 500;
    line-height: 1.2;
    word-break: break-word;
  }
  
  .image-placeholder-container {
    position: relative;
    overflow: hidden;
  }
  
  /* Loading states for images following Shopify performance guidelines */
  img[loading="lazy"]:not(.loaded) {
    transition: opacity 0.3s ease;
  }
  
  img.loaded {
    transition: opacity 0.3s ease;
  }
  
  /* Responsive image improvements */
  .card__media img,
  .media img,
  .product__media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  /* Performance optimization for image loading */
  .card__media,
  .media,
  .product__media {
    background-color: #f8f9fa;
  }
  
  /* Improved hover effects following Shopify patterns */
  .card:hover .card__media img {
    transform: scale(1.05);
    transition: transform 0.3s ease;
  }
`;

if (document.head) {
  document.head.appendChild(style);
} else {
  document.addEventListener('DOMContentLoaded', () => {
    document.head.appendChild(style);
  });
}
