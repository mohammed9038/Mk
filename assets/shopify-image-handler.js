/**
 * Shopify Image Handler
 * A comprehensive solution for handling product images in Shopify themes
 * Version 1.0.0
 * 
 * This script provides:
 * - Preloading of critical product images
 * - Fallback mechanism for broken images
 * - Direct CDN URL correction
 * - Responsive image swapping
 */
(function() {
  'use strict';

  // Configuration
  const config = {
    // Target selectors for product images
    imageSelectors: [
      '.product-card-image',
      '.card__media img',
      '.media--transparent img',
      '.card-wrapper img',
      '.card--media img',
      '.product__media img'
    ],
    
    // CDN patterns for Shopify
    cdnPatterns: {
      shopifyRegex: /\/\/cdn\.shopify\.com\/s\/files\/\d+\/\d+\/\d+\/products\//,
      shopifyNewRegex: /\/\/[^\/]+\/cdn\/shop\/products\//,
      defaultImgWidths: [165, 360, 533, 720, 940, 1066]
    },
    
    // Debug mode
    debug: true,
    
    // Retry options
    maxRetries: 3,
    retryDelay: 800,
    
    // Placeholder options
    placeholderStyles: {
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      minHeight: '240px',
      borderRadius: '8px',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif'
    }
  };
  
  // Utility functions
  const utils = {
    log(message, obj = null) {
      if (config.debug) {
        if (obj) {
          console.log(`[Shopify Image Handler]: ${message}`, obj);
        } else {
          console.log(`[Shopify Image Handler]: ${message}`);
        }
      }
    },
    
    warn(message, obj = null) {
      if (config.debug) {
        if (obj) {
          console.warn(`[Shopify Image Handler]: ${message}`, obj);
        } else {
          console.warn(`[Shopify Image Handler]: ${message}`);
        }
      }
    },
    
    getAllImages() {
      const selector = config.imageSelectors.join(', ');
      return Array.from(document.querySelectorAll(selector));
    },
    
    getProductHandleFromImage(img) {
      // Try to extract from URL
      if (img.src) {
        const match = img.src.match(/products\/([^\/\?#]+)/);
        if (match && match[1]) {
          return match[1].split('.')[0]; // Remove extension
        }
      }
      
      // Try to extract from parent links
      const card = img.closest('.card, .card-wrapper, .product-card');
      if (card) {
        const link = card.querySelector('a[href*="/products/"]');
        if (link && link.href) {
          const match = link.href.match(/products\/([^\/\?#]+)/);
          if (match && match[1]) {
            return match[1];
          }
        }
      }
      
      return null;
    },
    
    getProductTitleNearImage(img) {
      // Find the closest product card or wrapper
      const card = img.closest('.card, .card-wrapper, .product-card, .card__content');
      
      if (card) {
        // Look for heading or title elements
        const titleElements = [
          '.card__heading',
          '.product-title', 
          'h2', 'h3', 
          '.card__information .full-unstyled-link',
          '[id*="title"]'
        ];
        
        for (const selector of titleElements) {
          const titleEl = card.querySelector(selector);
          if (titleEl && titleEl.textContent) {
            return titleEl.textContent.trim();
          }
        }
      }
      
      // If we can't find a specific title, try to get it from product handle
      const handle = utils.getProductHandleFromImage(img);
      if (handle) {
        return handle.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
      }
      
      return 'Product';
    },
    
    isImageBroken(img) {
      return (
        !img.complete || 
        !img.naturalWidth || 
        img.naturalWidth === 0 ||
        img.style.display === 'none' ||
        img.src === window.location.href ||
        img.src === '' ||
        img.src === 'data:,' ||
        img.src === 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
      );
    }
  };
  
  // Core functionality
  const ShopifyImageHandler = {
    init() {
      utils.log('Initializing...');
      this.setupImageObservers();
      this.processImages();
      this.setupMutationObserver();
      
      // Add window load event for a final check
      window.addEventListener('load', () => {
        setTimeout(() => {
          this.processImages();
        }, 500);
      });
    },
    
    setupImageObservers() {
      utils.log('Setting up image observers');
      
      // Use Intersection Observer for lazy loading if available
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              
              // Only handle images without explicit data-handled
              if (!img.hasAttribute('data-shopify-handler')) {
                this.handleImage(img);
                img.setAttribute('data-shopify-handler', 'observed');
              }
              
              // Stop observing this image
              imageObserver.unobserve(img);
            }
          });
        }, {
          rootMargin: '200px', // Load images a bit before they come into view
          threshold: 0.01
        });
        
        // Start observing all product images
        utils.getAllImages().forEach(img => {
          if (!img.hasAttribute('data-shopify-handler')) {
            imageObserver.observe(img);
          }
        });
      } else {
        // Fallback for browsers without IntersectionObserver
        this.processImages();
      }
    },
    
    setupMutationObserver() {
      if ('MutationObserver' in window) {
        const observer = new MutationObserver((mutations) => {
          let newImages = false;
          
          mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length) {
              for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                  // Check if the added node is an image or contains images
                  if (
                    (node.tagName === 'IMG' && config.imageSelectors.some(selector => node.matches(selector))) ||
                    node.querySelector(config.imageSelectors.join(','))
                  ) {
                    newImages = true;
                    break;
                  }
                }
              }
            }
          });
          
          if (newImages) {
            setTimeout(() => this.processImages(), 100);
          }
        });
        
        // Observe the entire document for changes
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
        
        utils.log('Mutation observer set up for dynamic content');
      }
    },
    
    processImages() {
      const images = utils.getAllImages();
      utils.log(`Processing ${images.length} product images`);
      
      images.forEach(img => {
        // Skip already processed images
        if (img.hasAttribute('data-shopify-handler') && img.getAttribute('data-shopify-handler') !== 'failed') {
          return;
        }
        
        this.handleImage(img);
      });
    },
    
    handleImage(img, retryCount = 0) {
      // Skip if already handled successfully
      if (img.getAttribute('data-shopify-handler') === 'success') {
        return;
      }
      
      // Fix common URL issues first
      this.fixImageUrl(img);
      
      // Check if image is broken
      if (utils.isImageBroken(img)) {
        utils.log(`Found broken image:`, img);
        
        // Attempt retry if under max retries
        if (retryCount < config.maxRetries) {
          utils.log(`Retrying image load (${retryCount + 1}/${config.maxRetries})`);
          
          // Try reloading the image with a clean URL if possible
          setTimeout(() => {
            // Try with a different size if possible
            const originalSrc = img.getAttribute('data-original-src') || img.src;
            
            if (originalSrc) {
              const newSrc = this.getAlternateImageUrl(originalSrc, retryCount);
              if (newSrc !== img.src) {
                utils.log(`Retrying with URL: ${newSrc}`);
                img.src = newSrc;
              } else {
                // Force reload current src
                img.src = '';
                setTimeout(() => {
                  img.src = originalSrc;
                }, 10);
              }
              
              img.setAttribute('data-shopify-handler', 'retrying');
              img.addEventListener('error', () => {
                this.handleImage(img, retryCount + 1);
              });
            } else {
              this.createPlaceholder(img);
            }
          }, config.retryDelay * (retryCount + 1));
        } else {
          // Max retries exceeded, show placeholder
          this.createPlaceholder(img);
        }
      } else {
        // Image seems good, mark it as handled
        img.setAttribute('data-shopify-handler', 'success');
        
        // Still add an error handler for images that might fail later
        img.addEventListener('error', () => {
          if (img.getAttribute('data-shopify-handler') !== 'failed') {
            utils.log(`Image failed after initially appearing good:`, img);
            this.handleImage(img, 0);
          }
        });
      }
    },
    
    getAlternateImageUrl(originalUrl, retryCount) {
      // Try with a different size if the URL matches Shopify CDN patterns
      if (originalUrl) {
        const isCdnUrl = config.cdnPatterns.shopifyRegex.test(originalUrl) ||
                         config.cdnPatterns.shopifyNewRegex.test(originalUrl);
        
        if (isCdnUrl) {
          // Extract base URL and try different size
          const sizes = [533, 360, 720, 1000, 180];
          const sizeToTry = sizes[retryCount % sizes.length];
          
          // Remove existing size parameters
          let baseUrl = originalUrl.replace(/(_\d+x(\d+)?)?(\.\w+)$/, '$3');
          return baseUrl.replace(/(\.\w+)$/, `_${sizeToTry}x$1`);
        }
      }
      
      return originalUrl;
    },
    
    fixImageUrl(img) {
      // Don't try to fix already successful images
      if (img.getAttribute('data-shopify-handler') === 'success') {
        return;
      }
      
      const originalSrc = img.getAttribute('original-src') || img.getAttribute('data-src') || img.src;
      
      // Skip if no src available
      if (!originalSrc) return;
      
      // Store original src for reference if not already done
      if (!img.hasAttribute('data-original-src')) {
        img.setAttribute('data-original-src', originalSrc);
      }
      
      // Check for common Shopify URL issues
      if (originalSrc === window.location.href || originalSrc === '' || originalSrc.endsWith('/')) {
        // Try to reconstruct from srcset
        if (img.srcset) {
          const firstSrcset = img.srcset.split(',')[0].trim().split(' ')[0];
          if (firstSrcset && firstSrcset !== originalSrc) {
            utils.log(`Fixed image src from srcset: ${firstSrcset}`);
            img.src = firstSrcset;
            return;
          }
        }
        
        // Try to reconstruct from product handle
        const handle = utils.getProductHandleFromImage(img);
        if (handle) {
          const shopDomain = window.Shopify?.shop || window.location.hostname;
          const reconstructedSrc = `https://${shopDomain}/cdn/shop/products/${handle}_medium.jpg`;
          
          utils.log(`Reconstructed image URL from handle: ${reconstructedSrc}`);
          img.src = reconstructedSrc;
        }
      }
    },
    
    createPlaceholder(img) {
      // Get product info
      const productName = utils.getProductTitleNearImage(img);
      utils.log(`Creating placeholder for: ${productName}`);
      
      // Determine appropriate dimensions
      const width = '100%';
      const height = img.naturalHeight || img.offsetHeight || 240;
      
      // Create placeholder element
      const placeholder = document.createElement('div');
      placeholder.className = 'shopify-image-placeholder';
      placeholder.style.cssText = `
        width: ${width};
        height: ${height}px;
        min-height: ${config.placeholderStyles.minHeight};
        background: ${config.placeholderStyles.background};
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: ${config.placeholderStyles.borderRadius};
        overflow: hidden;
        color: #6c757d;
        position: relative;
        z-index: 2;
        font-family: ${config.placeholderStyles.fontFamily};
        box-sizing: border-box;
      `;
      
      placeholder.innerHTML = `
        <div style="text-align: center; padding: ${config.placeholderStyles.padding}; width: 100%;">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 12px; opacity: 0.6;">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21,15 16,10 5,21"/>
          </svg>
          <div style="font-size: 1rem; max-width: 100%; word-wrap: break-word; font-weight: 500; line-height: 1.4;">${productName}</div>
        </div>
      `;
      
      // Hide the original image and mark it as failed
      img.style.display = 'none';
      img.setAttribute('data-shopify-handler', 'failed');
      
      // Insert placeholder after the image
      if (img.parentNode) {
        img.parentNode.insertBefore(placeholder, img.nextSibling);
      }
      
      return placeholder;
    }
  };
  
  // Initialize on document ready or immediately if document is already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      ShopifyImageHandler.init();
    });
  } else {
    ShopifyImageHandler.init();
  }
  
  // Support for Shopify theme editor
  if (window.Shopify && window.Shopify.designMode) {
    document.addEventListener('shopify:section:load', () => {
      setTimeout(() => ShopifyImageHandler.processImages(), 100);
    });
  }
  
  // Expose global API for theme customizations
  window.ShopifyImageHandler = {
    refresh: () => ShopifyImageHandler.processImages(),
    getConfig: () => ({...config})
  };
})();
