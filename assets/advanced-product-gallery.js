/**
 * Advanced Product Gallery
 * Handles image switching, zoom functionality, and navigation
 */
class AdvancedProductGallery extends HTMLElement {
  constructor() {
    super();
    this.currentImageIndex = 0;
    this.images = [];
    this.init();
  }

  init() {
    this.mainImage = this.querySelector('.advanced-product-gallery__main-image');
    this.thumbnails = this.querySelectorAll('.advanced-product-gallery__thumbnail');
    this.zoomContainer = this.querySelector('.advanced-product-gallery__zoom');
    this.prevButton = this.querySelector('.advanced-product-gallery__nav--prev');
    this.nextButton = this.querySelector('.advanced-product-gallery__nav--next');
    this.closeButton = this.querySelector('.advanced-product-gallery__close');

    this.collectImages();
    this.bindEvents();
    this.updateUI();
  }

  collectImages() {
    this.images = Array.from(this.thumbnails).map(thumbnail => {
      const img = thumbnail.querySelector('img');
      return {
        src: img.dataset.src || img.src,
        alt: img.alt || '',
        thumbnail: thumbnail
      };
    });
  }

  bindEvents() {
    // Thumbnail click events
    this.thumbnails.forEach((thumbnail, index) => {
      thumbnail.addEventListener('click', () => {
        this.switchToImage(index);
      });
    });

    // Main image click for zoom
    if (this.mainImage) {
      this.mainImage.addEventListener('click', () => {
        this.openZoom();
      });
    }

    // Navigation buttons
    if (this.prevButton) {
      this.prevButton.addEventListener('click', () => {
        this.previousImage();
      });
    }

    if (this.nextButton) {
      this.nextButton.addEventListener('click', () => {
        this.nextImage();
      });
    }

    // Close zoom
    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => {
        this.closeZoom();
      });
    }

    if (this.zoomContainer) {
      this.zoomContainer.addEventListener('click', (e) => {
        if (e.target === this.zoomContainer) {
          this.closeZoom();
        }
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (this.zoomContainer && this.zoomContainer.style.display !== 'none') {
        if (e.key === 'Escape') {
          this.closeZoom();
        } else if (e.key === 'ArrowLeft') {
          this.previousImage();
        } else if (e.key === 'ArrowRight') {
          this.nextImage();
        }
      }
    });

    // Touch/swipe support for mobile
    this.addTouchSupport();
  }

  switchToImage(index) {
    if (index >= 0 && index < this.images.length) {
      this.currentImageIndex = index;
      this.updateMainImage();
      this.updateThumbnails();
    }
  }

  updateMainImage() {
    if (this.mainImage && this.images[this.currentImageIndex]) {
      const currentImage = this.images[this.currentImageIndex];
      
      // Add loading state
      this.mainImage.style.opacity = '0.5';
      
      // Create new image element for smooth loading
      const newImage = new Image();
      newImage.onload = () => {
        this.mainImage.src = currentImage.src;
        this.mainImage.alt = currentImage.alt;
        this.mainImage.style.opacity = '1';
      };
      newImage.src = currentImage.src;
    }
  }

  updateThumbnails() {
    this.thumbnails.forEach((thumbnail, index) => {
      thumbnail.classList.toggle('active', index === this.currentImageIndex);
    });
  }

  updateUI() {
    this.updateMainImage();
    this.updateThumbnails();
    
    // Update navigation buttons visibility
    if (this.prevButton) {
      this.prevButton.style.display = this.images.length > 1 ? 'flex' : 'none';
    }
    if (this.nextButton) {
      this.nextButton.style.display = this.images.length > 1 ? 'flex' : 'none';
    }
  }

  previousImage() {
    const newIndex = this.currentImageIndex > 0 
      ? this.currentImageIndex - 1 
      : this.images.length - 1;
    this.switchToImage(newIndex);
  }

  nextImage() {
    const newIndex = this.currentImageIndex < this.images.length - 1 
      ? this.currentImageIndex + 1 
      : 0;
    this.switchToImage(newIndex);
  }

  openZoom() {
    if (this.zoomContainer) {
      const zoomImage = this.zoomContainer.querySelector('.advanced-product-gallery__zoom-image');
      if (zoomImage && this.images[this.currentImageIndex]) {
        zoomImage.src = this.images[this.currentImageIndex].src;
        zoomImage.alt = this.images[this.currentImageIndex].alt;
      }
      this.zoomContainer.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  closeZoom() {
    if (this.zoomContainer) {
      this.zoomContainer.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  addTouchSupport() {
    let startX = 0;
    let startY = 0;
    
    this.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });

    this.addEventListener('touchend', (e) => {
      if (!startX || !startY) return;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      
      const diffX = startX - endX;
      const diffY = startY - endY;

      // Check if horizontal swipe is more significant than vertical
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          // Swipe left - next image
          this.nextImage();
        } else {
          // Swipe right - previous image
          this.previousImage();
        }
      }

      startX = 0;
      startY = 0;
    });
  }

  // Public API for external control
  getCurrentImageIndex() {
    return this.currentImageIndex;
  }

  getTotalImages() {
    return this.images.length;
  }

  goToImage(index) {
    this.switchToImage(index);
  }
}

// Auto-initialize when DOM is ready
if (!customElements.get('advanced-product-gallery')) {
  customElements.define('advanced-product-gallery', AdvancedProductGallery);
}

// Fallback initialization for existing galleries
document.addEventListener('DOMContentLoaded', () => {
  const galleries = document.querySelectorAll('advanced-product-gallery');
  galleries.forEach(gallery => {
    if (!gallery.initialized) {
      gallery.initialized = true;
    }
  });
});
