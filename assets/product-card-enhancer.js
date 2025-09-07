/**
 * Product Card Enhancement System
 * Handles image loading, error recovery, and click navigation
 */
(function() {
  'use strict';

  // Enhanced image loading and error handling
  class ProductCardEnhancer {
    constructor() {
      this.retryAttempts = 3;
      this.retryDelay = 1000;
      this.init();
    }

    init() {
      this.setupImageErrorHandling();
      this.setupCardNavigation();
      this.setupLazyLoading();
      console.log('✅ Product Card Enhancer initialized');
    }

    setupImageErrorHandling() {
      // Handle images that fail to load
      document.addEventListener('error', (e) => {
        if (e.target.tagName === 'IMG' && e.target.closest('.card-product')) {
          this.handleImageError(e.target);
        }
      }, true);

      // Monitor existing images
      this.checkExistingImages();
    }

    checkExistingImages() {
      const images = document.querySelectorAll('.card-product img');
      images.forEach(img => {
        if (img.complete && !img.naturalHeight) {
          this.handleImageError(img);
        }
      });
    }

    handleImageError(img) {
      const card = img.closest('.card-product');
      const productTitle = card.querySelector('.card__heading')?.textContent?.trim() || 'Product';
      
      console.log(`🔄 Handling image error for: ${productTitle}`);

      // Try to retry loading
      const retryCount = parseInt(img.dataset.retryCount || '0');
      if (retryCount < this.retryAttempts) {
        setTimeout(() => {
          img.dataset.retryCount = retryCount + 1;
          const originalSrc = img.src;
          img.src = '';
          img.src = originalSrc;
        }, this.retryDelay * (retryCount + 1));
        return;
      }

      // Create enhanced placeholder
      this.createEnhancedPlaceholder(img, productTitle);
    }

    createEnhancedPlaceholder(img, productTitle) {
      const placeholder = document.createElement('div');
      placeholder.className = 'product-image-placeholder';
      placeholder.innerHTML = `
        <div class="placeholder-content">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21,15 16,10 5,21"/>
          </svg>
          <p class="placeholder-text">${productTitle}</p>
        </div>
      `;
      
      // Apply styles
      Object.assign(placeholder.style, {
        width: '100%',
        height: img.offsetHeight ? `${img.offsetHeight}px` : '280px',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#6c757d',
        textAlign: 'center',
        fontSize: '0.875rem',
        borderRadius: '8px'
      });

      img.parentNode.replaceChild(placeholder, img);
    }

    setupCardNavigation() {
      // Ensure product cards are clickable
      document.addEventListener('click', (e) => {
        const card = e.target.closest('.card-product');
        if (!card) return;

        // Don't interfere with buttons or existing links
        if (e.target.closest('button, a, [role="button"]')) return;

        const productLink = card.querySelector('a[href*="/products/"]');
        if (productLink) {
          e.preventDefault();
          window.location.href = productLink.href;
        }
      });
    }

    setupLazyLoading() {
      // Enhanced lazy loading for better performance
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              this.loadImage(img);
              imageObserver.unobserve(img);
            }
          });
        }, {
          rootMargin: '50px 0px'
        });

        // Observe images that aren't loaded yet
        document.querySelectorAll('img[data-src]').forEach(img => {
          imageObserver.observe(img);
        });
      }
    }

    loadImage(img) {
      return new Promise((resolve, reject) => {
        const tempImg = new Image();
        tempImg.onload = () => {
          img.src = tempImg.src;
          img.removeAttribute('data-src');
          resolve(img);
        };
        tempImg.onerror = () => {
          this.handleImageError(img);
          reject(new Error('Failed to load image'));
        };
        tempImg.src = img.dataset.src || img.src;
      });
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new ProductCardEnhancer();
    });
  } else {
    new ProductCardEnhancer();
  }

  // Re-initialize for dynamic content
  window.initProductCardEnhancer = () => {
    new ProductCardEnhancer();
  };

})();
