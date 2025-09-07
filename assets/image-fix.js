/**
 * Comprehensive Image Loading Fix
 * Handles all image loading issues, 404s, and missing images
 */

class ImageLoadingFix {
  constructor() {
    this.retryAttempts = 3;
    this.retryDelay = 1000;
    this.placeholderCreated = new Set();
    
    this.init();
  }

  init() {
    // Fix existing broken images
    this.fixBrokenImages();
    
    // Setup observers for dynamically loaded content
    this.setupMutationObserver();
    
    // Fix missing product images
    this.fixMissingProductImages();
    
    console.log('🖼️ Image Loading Fix initialized');
  }

  fixBrokenImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      if (img.complete && img.naturalHeight === 0) {
        // Image failed to load
        this.handleImageError(img);
      } else {
        // Setup error handler for future failures
        img.addEventListener('error', () => this.handleImageError(img));
        img.addEventListener('load', () => this.handleImageSuccess(img));
      }
    });
  }

  handleImageError(img) {
    const imgId = img.src || img.dataset.src || 'unknown';
    
    if (this.placeholderCreated.has(imgId)) {
      return; // Already handled
    }
    
    console.warn('🚫 Image failed to load:', imgId);
    
    // Get retry count
    const retryCount = parseInt(img.dataset.retryCount || '0');
    
    if (retryCount < this.retryAttempts) {
      // Try to retry with a delay
      setTimeout(() => {
        img.dataset.retryCount = retryCount + 1;
        const originalSrc = img.src;
        img.src = '';
        img.src = originalSrc;
        console.log(`🔄 Retrying image load (attempt ${retryCount + 1}):`, originalSrc);
      }, this.retryDelay * (retryCount + 1));
      return;
    }

    // All retries failed, create placeholder
    this.createImagePlaceholder(img);
    this.placeholderCreated.add(imgId);
  }

  handleImageSuccess(img) {
    // Mark as successfully loaded
    img.classList.add('loaded');
    img.style.opacity = '1';
  }

  createImagePlaceholder(img) {
    const productTitle = this.getProductTitle(img);
    const container = img.closest('.card__media, .media, .product__media, .card__inner') || img.parentElement;
    
    if (!container) return;

    // Create placeholder
    const placeholder = document.createElement('div');
    placeholder.className = 'image-loading-placeholder';
    placeholder.innerHTML = `
      <div class="placeholder-content">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21,15 16,10 5,21"/>
        </svg>
        <p class="placeholder-title">${productTitle}</p>
      </div>
    `;

    // Apply styles
    placeholder.style.cssText = `
      width: 100%;
      height: ${img.offsetHeight || 280}px;
      min-height: 200px;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      color: #6c757d;
      text-align: center;
      position: relative;
    `;

    // Hide original image and insert placeholder
    img.style.display = 'none';
    img.setAttribute('data-placeholder-created', 'true');
    
    if (container.contains(img)) {
      container.insertBefore(placeholder, img.nextSibling);
    }

    console.log('✅ Created placeholder for:', productTitle);
  }

  getProductTitle(img) {
    // Try multiple methods to get product title
    const methods = [
      () => img.dataset.productTitle,
      () => img.alt,
      () => {
        const card = img.closest('.card, .card-wrapper, .product-card');
        return card?.querySelector('.card__heading, .product-title, h2, h3, .card__information h3')?.textContent?.trim();
      },
      () => {
        const titleElement = img.closest('.product')?.querySelector('.product__title, .product-title');
        return titleElement?.textContent?.trim();
      },
      () => {
        // Try to extract from URL
        const match = img.src?.match(/products\/([^\/\?#]+)/);
        if (match) {
          return match[1].split('.')[0].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        }
        return null;
      }
    ];

    for (const method of methods) {
      try {
        const title = method();
        if (title && title.length > 0) {
          return title;
        }
      } catch (e) {
        // Continue to next method
      }
    }

    return 'Product Image';
  }

  fixMissingProductImages() {
    // Find cards/products without any images
    const productCards = document.querySelectorAll('.card, .card-wrapper, .product-card, .card__inner');
    
    productCards.forEach(card => {
      const hasImage = card.querySelector('img');
      const hasPlaceholder = card.querySelector('.image-loading-placeholder, .product-image-placeholder');
      
      if (!hasImage && !hasPlaceholder) {
        const mediaContainer = card.querySelector('.card__media, .media, .product-image') || card;
        
        if (mediaContainer && !mediaContainer.querySelector('.image-loading-placeholder')) {
          const title = this.getProductTitle({ closest: () => card });
          
          const placeholder = document.createElement('div');
          placeholder.className = 'image-loading-placeholder no-image-placeholder';
          placeholder.innerHTML = `
            <div class="placeholder-content">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21,15 16,10 5,21"/>
              </svg>
              <p class="placeholder-title">${title}</p>
            </div>
          `;
          
          placeholder.style.cssText = `
            width: 100%;
            height: 280px;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            color: #6c757d;
            text-align: center;
          `;
          
          if (mediaContainer) {
            mediaContainer.appendChild(placeholder);
            console.log('✅ Added placeholder for card without image:', title);
          }
        }
      }
    });
  }

  setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            const images = node.querySelectorAll?.('img') || (node.tagName === 'IMG' ? [node] : []);
            images.forEach(img => {
              if (!img.dataset.errorHandlerAdded) {
                img.dataset.errorHandlerAdded = 'true';
                img.addEventListener('error', () => this.handleImageError(img));
                img.addEventListener('load', () => this.handleImageSuccess(img));
                
                // Check if image is already broken
                if (img.complete && img.naturalHeight === 0) {
                  this.handleImageError(img);
                }
              }
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}

// Add CSS styles
const style = document.createElement('style');
style.textContent = `
  .image-loading-placeholder {
    position: relative;
    overflow: hidden;
  }
  
  .image-loading-placeholder .placeholder-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 2rem;
    height: 100%;
  }
  
  .image-loading-placeholder svg {
    opacity: 0.6;
    transition: opacity 0.3s ease;
  }
  
  .image-loading-placeholder:hover svg {
    opacity: 0.8;
  }
  
  .image-loading-placeholder .placeholder-title {
    margin: 0;
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.4;
    word-break: break-word;
    max-width: 100%;
  }
  
  .no-image-placeholder {
    border: 2px dashed rgba(108, 117, 125, 0.3);
  }
  
  /* Ensure images load smoothly */
  img:not(.loaded) {
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  img.loaded {
    opacity: 1;
  }
  
  /* Responsive adjustments */
  @media (max-width: 749px) {
    .image-loading-placeholder {
      height: 200px !important;
      min-height: 200px;
    }
    
    .image-loading-placeholder .placeholder-content {
      padding: 1.5rem;
    }
    
    .image-loading-placeholder svg {
      width: 48px;
      height: 48px;
    }
    
    .image-loading-placeholder .placeholder-title {
      font-size: 0.875rem;
    }
  }
`;

document.head.appendChild(style);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ImageLoadingFix();
  });
} else {
  new ImageLoadingFix();
}

// Re-initialize on section loads (for theme editor)
document.addEventListener('shopify:section:load', () => {
  setTimeout(() => {
    new ImageLoadingFix();
  }, 100);
});

// Export for global access
window.ImageLoadingFix = ImageLoadingFix;
