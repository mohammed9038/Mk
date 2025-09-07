/**
 * Featured Collection Image Fix
 * Ensures all product images load properly in featured collections
 * Provides fallbacks for missing images and handles lazy loading
 */

class FeaturedCollectionImageFix {
  constructor() {
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupImageFixes());
    } else {
      this.setupImageFixes();
    }
  }

  setupImageFixes() {
    // Fix all product cards in featured collections
    this.fixProductImages();
    
    // Setup intersection observer for lazy loading
    this.setupLazyLoading();
    
    // Handle image load errors
    this.setupImageErrorHandling();
    
    console.log('✅ Featured Collection image fixes applied');
  }

  fixProductImages() {
    // Find all product cards
    const productCards = document.querySelectorAll('.card-product, .product-card-wrapper, .card--product');
    
    productCards.forEach(card => {
      const images = card.querySelectorAll('img');
      
      images.forEach(img => {
        // Ensure proper loading attributes
        if (!img.hasAttribute('loading')) {
          img.setAttribute('loading', 'lazy');
        }
        
        // Ensure proper sizes attribute for responsive images
        if (!img.hasAttribute('sizes') || img.getAttribute('sizes') === '') {
          img.setAttribute('sizes', '(min-width: 990px) 25vw, (min-width: 750px) 33vw, 50vw');
        }
        
        // Fix missing alt attributes
        if (!img.hasAttribute('alt') || img.getAttribute('alt') === '') {
          const productTitle = card.querySelector('.card__heading, .card-title, .product-title');
          if (productTitle) {
            img.setAttribute('alt', productTitle.textContent.trim());
          }
        }
        
        // Ensure image has proper src fallback
        if (!img.src || img.src === '') {
          const srcset = img.getAttribute('srcset');
          if (srcset) {
            const firstSrc = srcset.split(',')[0].trim().split(' ')[0];
            img.src = firstSrc;
          }
        }
      });
    });
  }

  setupLazyLoading() {
    // Enhanced lazy loading for better performance
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // Load the image
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
            img.removeAttribute('data-srcset');
          }
          
          // Add loaded class for animations
          img.classList.add('loaded');
          
          // Stop observing this image
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    // Observe all images
    const lazyImages = document.querySelectorAll('img[data-src], img[loading="lazy"]');
    lazyImages.forEach(img => imageObserver.observe(img));
  }

  setupImageErrorHandling() {
    // Handle image load errors with fallbacks
    document.addEventListener('error', (e) => {
      if (e.target.tagName === 'IMG') {
        const img = e.target;
        
        // Try alternative image sources
        this.handleImageError(img);
      }
    }, true);
  }

  handleImageError(img) {
    const card = img.closest('.card-product, .product-card-wrapper, .card--product');
    if (!card) return;

    // Try to find alternative image sources
    const srcset = img.getAttribute('srcset');
    if (srcset && !img.dataset.originalSrcset) {
      img.dataset.originalSrcset = srcset;
      
      // Try different image sizes from srcset
      const sources = srcset.split(',').map(s => s.trim().split(' ')[0]);
      if (sources.length > 1) {
        img.src = sources[1]; // Try second source
        return;
      }
    }

    // If no alternative found, use placeholder
    this.setPlaceholderImage(img, card);
  }

  setPlaceholderImage(img, card) {
    // Create a proper placeholder with product info
    const productTitle = card.querySelector('.card__heading, .card-title, .product-title');
    const title = productTitle ? productTitle.textContent.trim() : 'Product';
    
    // Use SVG placeholder with product title
    const placeholderSvg = `data:image/svg+xml,${encodeURIComponent(`
      <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="400" fill="#f8f9fa"/>
        <rect x="50" y="50" width="300" height="300" fill="#e9ecef" rx="8"/>
        <circle cx="120" cy="130" r="20" fill="#dee2e6"/>
        <path d="M80 250 L120 200 L180 240 L240 180 L320 250 Z" fill="#dee2e6"/>
        <text x="200" y="320" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#6c757d">
          ${title.substring(0, 20)}${title.length > 20 ? '...' : ''}
        </text>
      </svg>
    `)}`;
    
    img.src = placeholderSvg;
    img.alt = `${title} - Image not available`;
    img.classList.add('placeholder-image');
  }

  // Public method to refresh images after dynamic content changes
  refresh() {
    this.setupImageFixes();
  }
}

// Auto-initialize when script loads
const featuredCollectionFix = new FeaturedCollectionImageFix();

// Make it globally available for manual refresh
window.FeaturedCollectionImageFix = featuredCollectionFix;

// Re-run fixes when new content is loaded (for AJAX/dynamic loading)
if (window.Shopify && window.Shopify.theme) {
  document.addEventListener('shopify:section:load', () => {
    featuredCollectionFix.refresh();
  });
}
