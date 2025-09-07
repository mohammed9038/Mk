/**
 * Shopify Theme Image Diagnostic Tool
 * Comprehensive debugging for image loading issues
 */
class ShopifyImageDiagnostic {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      pageUrl: window.location.href,
      images: [],
      collections: [],
      errors: [],
      performance: {}
    };
    
    this.init();
  }
  
  init() {
    console.log('%c🔍 Shopify Image Diagnostic Tool Started', 'color: #4CAF50; font-size: 16px; font-weight: bold;');
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.runDiagnostics());
    } else {
      this.runDiagnostics();
    }
  }
  
  runDiagnostics() {
    this.checkImages();
    this.checkCollections();
    this.checkScripts();
    this.checkConsoleErrors();
    this.generateReport();
  }
  
  checkImages() {
    const images = document.querySelectorAll('img');
    console.log(`📸 Found ${images.length} images on page`);
    
    images.forEach((img, index) => {
      const imageData = {
        index,
        src: img.src,
        alt: img.alt,
        width: img.width,
        height: img.height,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        complete: img.complete,
        classList: Array.from(img.classList),
        hasError: false,
        parentElement: img.parentElement ? img.parentElement.tagName : null,
        isShopifyImage: this.isShopifyImage(img.src),
        isPlaceholder: this.isPlaceholder(img)
      };
      
      // Check if image failed to load
      if (img.complete && img.naturalWidth === 0) {
        imageData.hasError = true;
        this.results.errors.push(`Image ${index}: Failed to load - ${img.src}`);
      }
      
      // Add load/error listeners for incomplete images
      if (!img.complete) {
        img.addEventListener('load', () => {
          console.log(`✅ Image ${index} loaded successfully`);
          imageData.complete = true;
        });
        
        img.addEventListener('error', () => {
          console.error(`❌ Image ${index} failed to load:`, img.src);
          imageData.hasError = true;
          this.results.errors.push(`Image ${index}: Load error - ${img.src}`);
        });
      }
      
      this.results.images.push(imageData);
    });
  }
  
  checkCollections() {
    // Look for collection-related elements
    const collectionElements = document.querySelectorAll('[class*="brand"], [class*="collection"], [data-collection]');
    console.log(`📦 Found ${collectionElements.length} collection-related elements`);
    
    collectionElements.forEach((element, index) => {
      const images = element.querySelectorAll('img');
      const collectionData = {
        index,
        className: element.className,
        tagName: element.tagName,
        images: images.length,
        hasPlaceholders: false,
        dataAttributes: {}
      };
      
      // Check for data attributes
      Array.from(element.attributes).forEach(attr => {
        if (attr.name.startsWith('data-')) {
          collectionData.dataAttributes[attr.name] = attr.value;
        }
      });
      
      // Check for placeholder SVGs
      const placeholders = element.querySelectorAll('svg');
      if (placeholders.length > 0) {
        collectionData.hasPlaceholders = true;
        console.log(`📋 Collection element ${index} has ${placeholders.length} placeholder(s)`);
      }
      
      this.results.collections.push(collectionData);
    });
  }
  
  checkScripts() {
    const scripts = document.querySelectorAll('script[src]');
    const imageFixScripts = [];
    
    scripts.forEach(script => {
      if (script.src.includes('shopify-image-fix') || 
          script.src.includes('brand-image-fix') || 
          script.src.includes('collection-validator')) {
        imageFixScripts.push({
          src: script.src,
          loaded: script.readyState || 'unknown',
          defer: script.defer,
          async: script.async
        });
      }
    });
    
    console.log(`🔧 Found ${imageFixScripts.length} image fix scripts`);
    this.results.imageFixScripts = imageFixScripts;
    
    // Check if our fix classes exist
    const fixExists = {
      ShopifyImageFix: typeof window.ShopifyImageFix !== 'undefined',
      BrandImageFix: typeof window.BrandImageFix !== 'undefined'
    };
    
    this.results.fixClassesLoaded = fixExists;
    console.log('🛠️ Fix classes loaded:', fixExists);
  }
  
  checkConsoleErrors() {
    // Override console.error to catch errors
    const originalError = console.error;
    const errors = [];
    
    console.error = function(...args) {
      errors.push(args.join(' '));
      originalError.apply(console, args);
    };
    
    setTimeout(() => {
      this.results.consoleErrors = errors;
      console.error = originalError; // Restore original
    }, 5000);
  }
  
  isShopifyImage(src) {
    return src && (
      src.includes('cdn.shopify.com') ||
      src.includes('shopify.com/s/files') ||
      src.includes('images.unsplash.com') ||
      src.includes('placeholder')
    );
  }
  
  isPlaceholder(img) {
    return img.src.includes('placeholder') || 
           img.alt.includes('placeholder') ||
           img.parentElement?.querySelector('svg') !== null;
  }
  
  generateReport() {
    setTimeout(() => {
      this.results.summary = {
        totalImages: this.results.images.length,
        errorImages: this.results.images.filter(img => img.hasError).length,
        shopifyImages: this.results.images.filter(img => img.isShopifyImage).length,
        placeholderImages: this.results.images.filter(img => img.isPlaceholder).length,
        collectionsWithIssues: this.results.collections.filter(col => col.hasPlaceholders).length
      };
      
      console.log('%c📊 DIAGNOSTIC REPORT', 'color: #2196F3; font-size: 18px; font-weight: bold;');
      console.log('%c===================', 'color: #2196F3; font-size: 16px;');
      console.table(this.results.summary);
      
      if (this.results.errors.length > 0) {
        console.log('%c❌ ERRORS FOUND:', 'color: #F44336; font-size: 14px; font-weight: bold;');
        this.results.errors.forEach(error => console.error(error));
      }
      
      console.log('%c📄 Full Report Available:', 'color: #FF9800; font-size: 14px;');
      console.log('window.imageDiagnostic.results');
      
      // Make results globally available
      window.imageDiagnostic = this;
      
      // Auto-fix if issues found
      if (this.results.summary.errorImages > 0 || this.results.summary.placeholderImages > 0) {
        console.log('%c🔧 Attempting auto-fix...', 'color: #4CAF50; font-size: 14px;');
        this.attemptFix();
      }
      
    }, 3000);
  }
  
  attemptFix() {
    // Try to trigger our existing fix scripts
    if (window.ShopifyImageFix) {
      console.log('🔄 Triggering ShopifyImageFix...');
      new window.ShopifyImageFix();
    }
    
    if (window.BrandImageFix) {
      console.log('🔄 Triggering BrandImageFix...');
      new window.BrandImageFix();
    }
    
    // Manual fix for broken images
    this.results.images.forEach((imageData, index) => {
      if (imageData.hasError) {
        const img = document.querySelectorAll('img')[index];
        if (img && img.src) {
          // Try to reload with different size
          const newSrc = img.src.replace(/width=\d+/, 'width=800').replace(/height=\d+/, 'height=600');
          if (newSrc !== img.src) {
            console.log(`🔄 Retrying image ${index} with new dimensions`);
            img.src = newSrc;
          }
        }
      }
    });
  }
}

// Auto-start diagnostic
document.addEventListener('DOMContentLoaded', () => {
  new ShopifyImageDiagnostic();
});

// Also start immediately if DOM is already loaded
if (document.readyState !== 'loading') {
  new ShopifyImageDiagnostic();
}
