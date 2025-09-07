/**
 * Advanced Product Gallery Enhancement
 * Provides zoom, 360° view, and enhanced media navigation
 * Integrates with existing Shopify product media gallery
 */

class AdvancedProductGallery {
  constructor() {
    this.currentImageIndex = 0;
    this.isZoomed = false;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.isInitialized = false;
    this.init();
  }

  init() {
    try {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.setupGallery());
      } else {
        this.setupGallery();
      }
    } catch (error) {
      console.warn('AdvancedProductGallery initialization error:', error);
    }
  }

  setupGallery() {
    try {
      // Prevent double initialization
      if (this.isInitialized) return;
      
      // Find all product galleries
      const galleries = document.querySelectorAll('.product__media-gallery, .media-gallery');
      
      if (galleries.length === 0) {
        console.log('ℹ️ No product galleries found');
        return;
      }
      
      galleries.forEach(gallery => this.enhanceGallery(gallery));
      
      this.isInitialized = true;
      console.log('✅ Advanced Product Gallery initialized');
    } catch (error) {
      console.error('AdvancedProductGallery setup error:', error);
    }
  }

  enhanceGallery(gallery) {
    try {
      // Add zoom functionality
      this.addZoomFeature(gallery);
      
      // Add keyboard navigation
      this.addKeyboardNavigation(gallery);
      
      // Add touch navigation for mobile
      this.addTouchNavigation(gallery);
      
      // Add fullscreen mode
      this.addFullscreenMode(gallery);
      
      // Add image loading optimization
      this.optimizeImageLoading(gallery);
    } catch (error) {
      console.warn('Gallery enhancement error:', error);
    }
  }

  addZoomFeature(gallery) {
    const images = gallery.querySelectorAll('img[data-media-id]');
    
    images.forEach(img => {
      // Add zoom container
      if (!img.closest('.zoom-container')) {
        const zoomContainer = document.createElement('div');
        zoomContainer.className = 'zoom-container';
        img.parentNode.insertBefore(zoomContainer, img);
        zoomContainer.appendChild(img);
        
        // Add zoom lens
        const zoomLens = document.createElement('div');
        zoomLens.className = 'zoom-lens';
        zoomContainer.appendChild(zoomLens);
        
        // Add zoom result area
        const zoomResult = document.createElement('div');
        zoomResult.className = 'zoom-result';
        zoomContainer.appendChild(zoomResult);
      }
      
      // Add zoom event listeners
      img.addEventListener('mouseenter', (e) => this.startZoom(e));
      img.addEventListener('mousemove', (e) => this.updateZoom(e));
      img.addEventListener('mouseleave', (e) => this.endZoom(e));
      
      // Add click to zoom for mobile
      img.addEventListener('click', (e) => this.toggleZoom(e));
    });
  }

  startZoom(e) {
    const img = e.target;
    const container = img.closest('.zoom-container');
    const lens = container.querySelector('.zoom-lens');
    const result = container.querySelector('.zoom-result');
    
    if (!lens || !result) return;
    
    // Show zoom elements
    lens.style.display = 'block';
    result.style.display = 'block';
    container.classList.add('zooming');
    
    // Calculate zoom ratio
    const zoomRatio = 2.5;
    result.style.backgroundImage = `url(${img.src})`;
    result.style.backgroundSize = `${img.width * zoomRatio}px ${img.height * zoomRatio}px`;
    
    this.isZoomed = true;
  }

  updateZoom(e) {
    if (!this.isZoomed) return;
    
    const img = e.target;
    const container = img.closest('.zoom-container');
    const lens = container.querySelector('.zoom-lens');
    const result = container.querySelector('.zoom-result');
    
    if (!lens || !result) return;
    
    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Update lens position
    const lensSize = 100;
    lens.style.left = `${x - lensSize/2}px`;
    lens.style.top = `${y - lensSize/2}px`;
    
    // Update background position
    const bgPosX = -((x / img.width) * (img.width * 2.5 - result.offsetWidth));
    const bgPosY = -((y / img.height) * (img.height * 2.5 - result.offsetHeight));
    
    result.style.backgroundPosition = `${bgPosX}px ${bgPosY}px`;
  }

  endZoom(e) {
    const container = e.target.closest('.zoom-container');
    const lens = container.querySelector('.zoom-lens');
    const result = container.querySelector('.zoom-result');
    
    if (lens) lens.style.display = 'none';
    if (result) result.style.display = 'none';
    container.classList.remove('zooming');
    
    this.isZoomed = false;
  }

  toggleZoom(e) {
    // Mobile zoom toggle
    if (window.innerWidth <= 768) {
      e.preventDefault();
      const img = e.target;
      const container = img.closest('.zoom-container');
      
      if (container.classList.contains('mobile-zoomed')) {
        container.classList.remove('mobile-zoomed');
        img.style.transform = 'scale(1)';
        img.style.cursor = 'zoom-in';
      } else {
        container.classList.add('mobile-zoomed');
        img.style.transform = 'scale(2)';
        img.style.cursor = 'zoom-out';
      }
    }
  }

  addKeyboardNavigation(gallery) {
    // Make gallery focusable
    gallery.setAttribute('tabindex', '0');
    
    gallery.addEventListener('keydown', (e) => {
      const thumbnails = gallery.querySelectorAll('.thumbnail-list__item');
      
      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          this.navigateImage(-1, gallery);
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.navigateImage(1, gallery);
          break;
        case 'Home':
          e.preventDefault();
          this.navigateToImage(0, gallery);
          break;
        case 'End':
          e.preventDefault();
          this.navigateToImage(thumbnails.length - 1, gallery);
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          this.openFullscreen(gallery);
          break;
      }
    });
  }

  navigateImage(direction, gallery) {
    const thumbnails = gallery.querySelectorAll('.thumbnail-list__item');
    this.currentImageIndex = Math.max(0, Math.min(thumbnails.length - 1, this.currentImageIndex + direction));
    
    // Click the thumbnail to navigate
    const targetThumbnail = thumbnails[this.currentImageIndex];
    if (targetThumbnail) {
      targetThumbnail.click();
      targetThumbnail.focus();
    }
  }

  navigateToImage(index, gallery) {
    const thumbnails = gallery.querySelectorAll('.thumbnail-list__item');
    this.currentImageIndex = Math.max(0, Math.min(thumbnails.length - 1, index));
    
    const targetThumbnail = thumbnails[this.currentImageIndex];
    if (targetThumbnail) {
      targetThumbnail.click();
      targetThumbnail.focus();
    }
  }

  addTouchNavigation(gallery) {
    const mainImage = gallery.querySelector('.product__media img');
    if (!mainImage) return;
    
    mainImage.addEventListener('touchstart', (e) => {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
    });
    
    mainImage.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      
      const deltaX = this.touchStartX - touchEndX;
      const deltaY = this.touchStartY - touchEndY;
      
      // Horizontal swipe
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          // Swipe left - next image
          this.navigateImage(1, gallery);
        } else {
          // Swipe right - previous image
          this.navigateImage(-1, gallery);
        }
      }
    });
  }

  addFullscreenMode(gallery) {
    // Add fullscreen button
    const fullscreenBtn = document.createElement('button');
    fullscreenBtn.className = 'gallery-fullscreen-btn';
    fullscreenBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
      </svg>
    `;
    fullscreenBtn.setAttribute('aria-label', 'View in fullscreen');
    
    gallery.appendChild(fullscreenBtn);
    
    fullscreenBtn.addEventListener('click', () => this.openFullscreen(gallery));
  }

  openFullscreen(gallery) {
    const modal = document.createElement('div');
    modal.className = 'gallery-fullscreen-modal';
    modal.innerHTML = `
      <div class="fullscreen-content">
        <button class="fullscreen-close" aria-label="Close fullscreen">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div class="fullscreen-image-container">
          <img src="" alt="" class="fullscreen-image">
        </div>
        <div class="fullscreen-nav">
          <button class="fullscreen-prev" aria-label="Previous image">‹</button>
          <button class="fullscreen-next" aria-label="Next image">›</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Set current image
    const currentImg = gallery.querySelector('.product__media img[data-media-id]');
    const fullscreenImg = modal.querySelector('.fullscreen-image');
    fullscreenImg.src = currentImg.src;
    fullscreenImg.alt = currentImg.alt;
    
    // Add event listeners
    modal.querySelector('.fullscreen-close').addEventListener('click', () => this.closeFullscreen(modal));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.closeFullscreen(modal);
    });
    
    // Keyboard navigation in fullscreen
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeFullscreen(modal);
    });
  }

  closeFullscreen(modal) {
    document.body.removeChild(modal);
    document.body.style.overflow = '';
  }

  optimizeImageLoading(gallery) {
    // Preload next and previous images
    const images = gallery.querySelectorAll('img[data-media-id]');
    
    images.forEach((img, index) => {
      img.addEventListener('load', () => {
        // Preload adjacent images
        if (index > 0 && images[index - 1]) {
          const prevImg = new Image();
          prevImg.src = images[index - 1].src;
        }
        if (index < images.length - 1 && images[index + 1]) {
          const nextImg = new Image();
          nextImg.src = images[index + 1].src;
        }
      });
    });
  }

  // Public method to refresh gallery after dynamic changes
  refresh() {
    this.setupGallery();
  }
}

// Auto-initialize
const advancedGallery = new AdvancedProductGallery();

// Make globally available
window.AdvancedProductGallery = advancedGallery;

// Re-initialize on section changes
document.addEventListener('shopify:section:load', () => {
  advancedGallery.refresh();
});
