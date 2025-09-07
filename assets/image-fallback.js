/**
 * Enhanced Image Fallback System
 * Provides a more robust solution for handling product image failures
 */
(function() {
  'use strict';

  // Selectors for images and cards
  const PRODUCT_IMAGE_SELECTORS = ['.product-card-image', '.card img', '.product-card img', '.card-product img'];
  
  // Create a more visible placeholder with product info
  function createPlaceholder(img, productName = 'Product') {
    // Try to find product title from nearby elements
    const card = img.closest('.card, .card-wrapper, .product-card');
    if (card) {
      const titleEl = card.querySelector('.card__heading, .product-title, h2, h3');
      if (titleEl) {
        productName = titleEl.textContent.trim();
      }
    }
    
    // Create enhanced placeholder
    const placeholder = document.createElement('div');
    placeholder.className = 'product-image-placeholder';
    placeholder.style.cssText = `
      width: 100%;
      height: ${img.offsetHeight || 280}px;
      background: linear-gradient(135deg, #f5f5f5 0%, #e9ecef 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      overflow: hidden;
      color: #6c757d;
    `;
    placeholder.innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 10px; opacity: 0.6;">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21,15 16,10 5,21"/>
        </svg>
        <div style="font-size: 0.95rem; max-width: 120px; word-wrap: break-word;">${productName}</div>
      </div>
    `;
    
    // Replace image with placeholder
    if (img.parentNode) {
      img.style.display = 'none';
      img.insertAdjacentElement('afterend', placeholder);
    }
    
    return placeholder;
  }

  // Process all product images on the page
  function processImages() {
    // Build a selector string from the array of selectors
    const selector = PRODUCT_IMAGE_SELECTORS.join(', ');
    const images = document.querySelectorAll(selector);
    
    console.log(`Processing ${images.length} product images for fallbacks`);
    
    images.forEach(img => {
      // Force reset src if it's broken
      if (img.src && (img.src === window.location.href || img.src.endsWith('/'))) {
        const originalSrc = img.getAttribute('data-original-src') || img.getAttribute('data-src');
        if (originalSrc) {
          img.src = originalSrc;
        }
      }
      
      // Check if image is already broken
      if ((img.complete && img.naturalHeight === 0) || img.style.display === 'none') {
        createPlaceholder(img);
      } else {
        // Add error handler for future failures
        img.addEventListener('error', () => {
          createPlaceholder(img);
        });
      }
    });
    
    // Special handling for cards without any image
    document.querySelectorAll('.card, .card-wrapper, .product-card').forEach(card => {
      const hasImage = card.querySelector('img');
      if (!hasImage) {
        const mediaContainer = card.querySelector('.card__media, .product-image');
        if (mediaContainer && !mediaContainer.querySelector('.product-image-placeholder')) {
          const placeholderDiv = document.createElement('div');
          placeholderDiv.className = 'product-image-placeholder';
          placeholderDiv.style.cssText = `
            width: 100%;
            height: 280px;
            background: linear-gradient(135deg, #f5f5f5 0%, #e9ecef 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            color: #6c757d;
          `;
          
          const title = card.querySelector('.card__heading, h3')?.textContent.trim() || 'Product';
          placeholderDiv.innerHTML = `
            <div style="text-align: center; padding: 20px;">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 10px; opacity: 0.6;">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21,15 16,10 5,21"/>
              </svg>
              <div style="font-size: 0.95rem;">${title}</div>
            </div>
          `;
          mediaContainer.appendChild(placeholderDiv);
        }
      }
    });
  }

  // Run on initial load and also after any content updates
  function initialize() {
    // Immediate processing
    processImages();
    
    // Additional processing after a delay to catch lazy-loaded images
    setTimeout(processImages, 1000);
    setTimeout(processImages, 3000);
  }

  // Set up initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // Reinitialize for AJAX content and Shopify theme editor
  if (window.Shopify && window.Shopify.designMode) {
    document.addEventListener('shopify:section:load', initialize);
  }
  
  // Expose globally for other scripts to trigger
  window.reinitializeProductImageFallbacks = initialize;
})();
