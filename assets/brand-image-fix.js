/**
 * Brand Image Enhancement for AI-Generated Brand Bar
 * Fixes collection image loading issues and provides fallbacks
 */

class BrandImageFix {
  constructor() {
    this.retryCount = 3;
    this.retryDelay = 500;
    this.processedBrands = new Set();
    
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.startBrandFix());
    } else {
      this.startBrandFix();
    }
  }

  startBrandFix() {
    this.fixBrandImages();
    this.setupBrandObserver();
    
    // Handle theme editor updates
    if (window.Shopify && window.Shopify.designMode) {
      document.addEventListener('shopify:section:load', () => this.fixBrandImages());
    }
    
    console.log('🏷️ Brand Image Fix initialized');
  }

  fixBrandImages() {
    // Target brand bar items specifically
    const brandContainers = document.querySelectorAll('[class*="ai-brand-bar__item"]');
    
    brandContainers.forEach(container => {
      const img = container.querySelector('img');
      const placeholder = container.querySelector('[class*="placeholder"]');
      
      if (img && !this.processedBrands.has(img.src)) {
        this.processedBrands.add(img.src);
        this.enhanceBrandImage(img, container);
      } else if (placeholder && !img) {
        this.createFallbackBrandImage(container, placeholder);
      }
    });
  }

  enhanceBrandImage(img, container) {
    // Add loading state
    this.addLoadingState(container);
    
    // Handle load success
    img.addEventListener('load', () => {
      this.removeLoadingState(container);
      img.style.opacity = '1';
    });

    // Handle load error with retry
    img.addEventListener('error', () => {
      this.handleBrandImageError(img, container);
    });

    // Optimize image URL if it's a Shopify CDN image
    if (img.src.includes('cdn.shopify.com')) {
      this.optimizeBrandImageUrl(img);
    }
  }

  handleBrandImageError(img, container, attempt = 1) {
    if (attempt <= this.retryCount) {
      console.log(`🔄 Retrying brand image load (attempt ${attempt}):`, img.src);
      
      setTimeout(() => {
        // Try different image transformations
        const originalSrc = img.src;
        let newSrc = originalSrc;
        
        if (attempt === 1) {
          // Try with different width
          newSrc = this.modifyImageUrl(originalSrc, { width: 300 });
        } else if (attempt === 2) {
          // Try without transforms
          newSrc = originalSrc.split('?')[0];
        } else {
          // Last attempt - try with minimal params
          newSrc = this.modifyImageUrl(originalSrc, { width: 200, format: 'webp' });
        }
        
        if (newSrc !== originalSrc) {
          img.src = newSrc;
          
          // Set up retry handler
          const retryHandler = () => {
            img.removeEventListener('error', retryHandler);
            this.handleBrandImageError(img, container, attempt + 1);
          };
          
          img.addEventListener('error', retryHandler, { once: true });
        } else {
          this.createFallbackBrandImage(container);
        }
      }, this.retryDelay * attempt);
    } else {
      console.warn('❌ Brand image failed to load after retries:', img.src);
      this.createFallbackBrandImage(container);
    }
  }

  createFallbackBrandImage(container, existingPlaceholder = null) {
    this.removeLoadingState(container);
    
    // If there's already a placeholder, enhance it
    if (existingPlaceholder) {
      this.enhancePlaceholder(existingPlaceholder);
      return;
    }
    
    // Create new fallback
    const img = container.querySelector('img');
    if (img) {
      const brandName = img.alt || 'Brand';
      
      // Create text-based fallback
      const fallback = document.createElement('div');
      fallback.className = 'brand-image-fallback';
      fallback.style.cssText = `
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #f8f9fa, #e9ecef);
        border: 2px dashed #dee2e6;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 600;
        color: #6c757d;
        text-align: center;
        padding: 8px;
        box-sizing: border-box;
      `;
      fallback.textContent = brandName;
      
      img.style.display = 'none';
      container.appendChild(fallback);
    }
  }

  enhancePlaceholder(placeholder) {
    // Add better styling to existing placeholders
    placeholder.style.cssText += `
      background: linear-gradient(135deg, #f8f9fa, #e9ecef);
      border: 2px dashed #dee2e6;
      border-radius: 8px;
      transition: all 0.3s ease;
    `;
    
    // Add hover effect
    placeholder.addEventListener('mouseenter', () => {
      placeholder.style.background = 'linear-gradient(135deg, #e9ecef, #dee2e6)';
    });
    
    placeholder.addEventListener('mouseleave', () => {
      placeholder.style.background = 'linear-gradient(135deg, #f8f9fa, #e9ecef)';
    });
  }

  addLoadingState(container) {
    if (container.querySelector('.brand-loading')) return;
    
    const loading = document.createElement('div');
    loading.className = 'brand-loading';
    loading.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 20px;
      height: 20px;
      border: 2px solid #f3f3f3;
      border-top: 2px solid #007bff;
      border-radius: 50%;
      animation: brand-spin 1s linear infinite;
      z-index: 10;
    `;
    
    // Add keyframes if not already added
    if (!document.querySelector('#brand-loading-styles')) {
      const style = document.createElement('style');
      style.id = 'brand-loading-styles';
      style.textContent = `
        @keyframes brand-spin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }
    
    container.style.position = 'relative';
    container.appendChild(loading);
  }

  removeLoadingState(container) {
    const loading = container.querySelector('.brand-loading');
    if (loading) {
      loading.remove();
    }
  }

  modifyImageUrl(url, params) {
    try {
      const urlObj = new URL(url);
      
      // For Shopify CDN images
      if (urlObj.hostname.includes('cdn.shopify.com')) {
        // Clear existing params and add new ones
        urlObj.search = '';
        
        Object.entries(params).forEach(([key, value]) => {
          urlObj.searchParams.set(key, value);
        });
      }
      
      return urlObj.toString();
    } catch (e) {
      console.warn('Error modifying image URL:', e);
      return url;
    }
  }

  optimizeBrandImageUrl(img) {
    const containerWidth = img.closest('[class*="ai-brand-bar"]')?.clientWidth || 200;
    const optimalWidth = Math.min(400, Math.ceil(containerWidth * 2)); // 2x for retina
    
    if (img.src.includes('cdn.shopify.com') && !img.src.includes('width=')) {
      const optimizedUrl = this.modifyImageUrl(img.src, { 
        width: optimalWidth,
        format: 'webp'
      });
      
      if (optimizedUrl !== img.src) {
        img.src = optimizedUrl;
      }
    }
  }

  setupBrandObserver() {
    // Watch for dynamically added brand images
    const observer = new MutationObserver((mutations) => {
      let shouldReprocess = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element node
              if (node.matches && node.matches('[class*="ai-brand-bar"]')) {
                shouldReprocess = true;
              } else if (node.querySelector && node.querySelector('[class*="ai-brand-bar"]')) {
                shouldReprocess = true;
              }
            }
          });
        }
      });
      
      if (shouldReprocess) {
        setTimeout(() => this.fixBrandImages(), 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new BrandImageFix());
} else {
  new BrandImageFix();
}
