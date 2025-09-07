/**
 * Enhanced Image Fallback System
 * Provides a more robust solution for handling product image failures
 * Version 2.0 - Improved Shopify Theme Integration
 */
(function() {
  'use strict';

  // Selectors for various image types in the theme
  const PRODUCT_IMAGE_SELECTORS = [
    '.product-card-image',
    '.card img', 
    '.card-wrapper img',
    '.product-card img', 
    '.card-product img',
    '.media--transparent img',
    '.card__media img'
  ];
  
  // Create a better placeholder with product info when an image fails
  function createPlaceholder(img, productName = 'Product') {
    console.log('Creating placeholder for:', productName);
    
    // Try to find product title from nearby elements
    const card = img.closest('.card, .card-wrapper, .product-card');
    if (card) {
      const titleEl = card.querySelector('.card__heading, .product-title, h2, h3');
      if (titleEl) {
        productName = titleEl.textContent.trim();
      }
    }
    
    // Get ideal dimensions - use image dimensions if available
    const width = '100%';
    const height = img.naturalHeight || img.offsetHeight || 280;
    
    // Create enhanced placeholder with a professional look
    const placeholder = document.createElement('div');
    placeholder.className = 'product-image-placeholder';
    placeholder.style.cssText = `
      width: ${width};
      height: ${height}px;
      min-height: 240px;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      overflow: hidden;
      color: #6c757d;
      position: relative;
      z-index: 5;
    `;
    placeholder.innerHTML = `
      <div style="text-align: center; padding: 20px; width: 100%;">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 10px; opacity: 0.6;">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21,15 16,10 5,21"/>
        </svg>
        <div style="font-size: 1rem; max-width: 100%; word-wrap: break-word; font-weight: 500;">${productName}</div>
      </div>
    `;
    
    // Replace image with placeholder
    if (img.parentNode) {
      img.style.display = 'none';
      img.setAttribute('data-failed', 'true');
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
      // Skip images we've already processed
      if (img.hasAttribute('data-failed')) {
        return;
      }
      
      // Fix common Shopify image URL issues
      fixShopifyImageUrl(img);
      
      // Check if image is already broken
      if (isImageBroken(img)) {
        createPlaceholder(img);
      } else {
        // Add error handler for future failures
        img.addEventListener('error', () => {
          createPlaceholder(img);
        });
        
        // Force check the image by reloading it if it has no dimensions
        if (img.complete && (!img.naturalWidth || !img.naturalHeight)) {
          // Image might be broken but not triggering error
          const currentSrc = img.src;
          img.src = '';
          setTimeout(() => {
            img.src = currentSrc;
          }, 10);
        }
      }
    });
    
    // Special handling for cards without any image - add placeholders
    processCardsWithoutImages();
  }
  
  // Fixes common issues with Shopify image URLs
  function fixShopifyImageUrl(img) {
    // Missing URL, same as page URL, or ends with slash
    if (!img.src || img.src === window.location.href || img.src.endsWith('/')) {
      // Try to find alternate sources
      const sources = [
        img.getAttribute('data-src'),
        img.getAttribute('data-original-src'),
        img.getAttribute('data-srcset')?.split(' ')[0],
        img.getAttribute('srcset')?.split(' ')[0]
      ].filter(Boolean);
      
      // Apply first valid source found
      for (const source of sources) {
        if (source && source !== img.src) {
          console.log('Fixed image source:', source);
          img.src = source;
          return;
        }
      }
      
      // If we have srcset but no src, extract from srcset
      if (img.srcset && !img.src) {
        const firstSrc = img.srcset.split(',')[0].trim().split(' ')[0];
        if (firstSrc) {
          img.src = firstSrc;
        }
      }
      
      // Try to reconstruct based on product URL if all else fails
      tryToReconstructImageFromProductURL(img);
    }
  }
  
  // Try to rebuild the image URL from product URL if available
  function tryToReconstructImageFromProductURL(img) {
    const card = img.closest('.card, .card-wrapper, .product-card');
    if (!card) return;
    
    const productLink = card.querySelector('a[href*="/products/"]');
    if (productLink && productLink.href) {
      const productUrl = new URL(productLink.href);
      const productHandle = productUrl.pathname.split('/products/')[1]?.split('?')[0]?.split('#')[0];
      
      if (productHandle) {
        console.log('Reconstructing image for product:', productHandle);
        const shopDomain = window.Shopify?.shop || window.location.hostname;
        const possibleUrls = [
          `//cdn.shopify.com/s/files/1/0/0/1/products/${productHandle}_large.jpg`,
          `//cdn.shopify.com/s/files/1/0/0/1/products/${productHandle}_medium.jpg`,
          `//${shopDomain}/cdn/shop/products/${productHandle}_large.jpg`
        ];
        
        // Attempt each URL in sequence
        let attemptIndex = 0;
        function tryNextUrl() {
          if (attemptIndex < possibleUrls.length) {
            const testImg = new Image();
            testImg.onload = function() {
              img.src = this.src;
            };
            testImg.onerror = tryNextUrl;
            testImg.src = possibleUrls[attemptIndex++];
          }
        }
        
        tryNextUrl();
      }
    }
  }
  
  // Checks if an image is broken (more reliable than just checking naturalHeight)
  function isImageBroken(img) {
    return (
      img.style.display === 'none' || 
      (img.complete && img.naturalHeight === 0) ||
      !img.src || 
      img.src === window.location.href ||
      img.src === 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
    );
  }
  
  // Special handling for product cards without images
  function processCardsWithoutImages() {
    document.querySelectorAll('.card, .card-wrapper, .product-card, .card__inner, .card__media').forEach(card => {
      const hasImage = card.querySelector('img');
      const hasPlaceholder = card.querySelector('.product-image-placeholder');
      
      if (!hasImage && !hasPlaceholder) {
        const mediaContainer = card.querySelector('.card__media, .media, .product-image') || card;
        
        if (mediaContainer && !mediaContainer.querySelector('.product-image-placeholder')) {
          const title = card.querySelector('.card__heading, h3')?.textContent.trim() || 
                      card.closest('.card, .card-wrapper')?.querySelector('.card__heading, h3')?.textContent.trim() || 
                      'Product';
          
          const placeholderDiv = document.createElement('div');
          placeholderDiv.className = 'product-image-placeholder';
          placeholderDiv.style.cssText = `
            width: 100%;
            height: 280px;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            color: #6c757d;
          `;
          
          placeholderDiv.innerHTML = `
            <div style="text-align: center; padding: 20px; width: 100%;">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 10px; opacity: 0.6;">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21,15 16,10 5,21"/>
              </svg>
              <div style="font-size: 1rem; font-weight: 500;">${title}</div>
            </div>
          `;
          
          mediaContainer.appendChild(placeholderDiv);
          console.log('Added placeholder to card without image:', title);
        }
      }
    });
  }

  // Run on initial load and also after any content updates
  function initialize() {
    // Log initialization
    console.log('🖼️ Image Fallback System initializing...');
    
    // Immediate processing
    processImages();
    
    // Additional processing after delays to catch lazy-loaded images
    setTimeout(processImages, 500);  // Quick follow-up
    setTimeout(processImages, 1500); // After most critical resources
    setTimeout(processImages, 3000); // After lazy-loaded content
    
    // Final check after all other resources
    window.addEventListener('load', () => {
      setTimeout(processImages, 100);
    });
    
    // Monitor for mutation events that might add images dynamically
    setupMutationObserver();
  }
  
  // Watch for DOM changes that might add new product cards or images
  function setupMutationObserver() {
    if ('MutationObserver' in window) {
      const observer = new MutationObserver((mutations) => {
        let shouldProcess = false;
        
        mutations.forEach(mutation => {
          // Check if new nodes were added
          if (mutation.addedNodes.length) {
            for (let i = 0; i < mutation.addedNodes.length; i++) {
              const node = mutation.addedNodes[i];
              
              // If it's an Element, check if it's an image or contains images
              if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.tagName === 'IMG' || node.querySelector('img')) {
                  shouldProcess = true;
                  break;
                }
              }
            }
          }
        });
        
        if (shouldProcess) {
          // Delay slightly to allow images to load
          setTimeout(processImages, 100);
        }
      });
      
      // Observe the entire document body for changes
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      console.log('🔍 DOM Mutation Observer set up for dynamic content');
    }
  }

  // Set up initialization based on document ready state
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // Reinitialize for AJAX content and Shopify theme editor
  if (window.Shopify && window.Shopify.designMode) {
    document.addEventListener('shopify:section:load', initialize);
    document.addEventListener('shopify:section:select', initialize);
    document.addEventListener('shopify:section:reorder', initialize);
  }
  
  // Expose globally for other scripts to trigger
  window.reinitializeProductImageFallbacks = initialize;
})();
