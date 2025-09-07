/**
 * Featured Collection Image Fix
 * Ensures all product images load properly in featured collections
 * Provides fallbacks for missing images and handles lazy loading
 */

(function() {
  'use strict';

  class FeaturedCollectionImageFix {
    constructor() {
      this.retryAttempts = 2;
      this.init();
    }

    init() {
      try {
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => this.setupImageFixes());
        } else {
          this.setupImageFixes();
        }
        
        // Reinitialize when sections are loaded dynamically
        document.addEventListener('shopify:section:load', () => this.setupImageFixes());
      } catch (error) {
        console.warn('Featured collection image fix initialization failed:', error);
      }
    }

    setupImageFixes() {
      try {
        this.fixProductImages();
        this.setupImageErrorHandling();
        console.log('✅ Featured Collection image fixes applied');
      } catch (error) {
        console.error('❌ Error in featured collection image fix:', error);
      }
    }

    fixProductImages() {
      const productCards = document.querySelectorAll('.card-wrapper, .product-card-wrapper, .card--product');
      
      productCards.forEach(card => {
        const images = card.querySelectorAll('img');
        
        images.forEach(img => {
          if (img.dataset.imageFixed) return;
          img.dataset.imageFixed = 'true';
          
          // Ensure proper loading attributes
          if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
          }
          
          // Add error handling
          img.addEventListener('error', () => this.handleImageError(img));
          img.addEventListener('load', () => this.handleImageSuccess(img));
          
          // Check if image is already broken
          if (img.complete && img.naturalWidth === 0) {
            this.handleImageError(img);
          }
          
          // Ensure image has proper src
          if (!img.src && img.srcset) {
            const firstSrc = img.srcset.split(',')[0].trim().split(' ')[0];
            if (firstSrc) img.src = firstSrc;
          }
        });
      });
      
      console.log('Fixed ' + productCards.length + ' product cards');
    }

    setupImageErrorHandling() {
      const allImages = document.querySelectorAll('.card__media img, .media img');
      
      allImages.forEach(img => {
        if (!img.dataset.errorHandled) {
          img.dataset.errorHandled = 'true';
          img.addEventListener('error', () => this.handleImageError(img));
        }
      });
    }

    handleImageError(img) {
      console.warn('Image failed to load:', img.src);
      
      const mediaContainer = img.closest('.card__media, .media');
      if (mediaContainer) {
        this.setPlaceholderImage(img, mediaContainer);
      }
    }

    handleImageSuccess(img) {
      const mediaContainer = img.closest('.card__media, .media');
      if (mediaContainer) {
        const placeholder = mediaContainer.querySelector('.image-placeholder');
        if (placeholder) {
          placeholder.style.display = 'none';
        }
        img.style.display = 'block';
      }
    }

    setPlaceholderImage(img, mediaContainer) {
      img.style.display = 'none';
      
      let placeholder = mediaContainer.querySelector('.image-placeholder');
      
      if (!placeholder) {
        placeholder = document.createElement('div');
        placeholder.className = 'image-placeholder';
        placeholder.style.cssText = 'display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); color: #6c757d; font-size: 0.875rem; position: absolute; top: 0; left: 0; flex-direction: column; gap: 8px; border-radius: 8px;';
        
        placeholder.innerHTML = '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg><span>Product Image</span>';
        
        mediaContainer.appendChild(placeholder);
      }
      
      placeholder.style.display = 'flex';
    }

    refresh() {
      this.setupImageFixes();
    }
  }

  // Initialize only if not already done
  if (!window.featuredCollectionImageFix) {
    window.featuredCollectionImageFix = new FeaturedCollectionImageFix();
  }

})();
