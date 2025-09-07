/* ===================================================================
   AL-SHARIQAH THEME - ENHANCED PRODUCT COMPONENTS
   Advanced product display with design system integration
   =================================================================== */

// Register enhanced product card component
window.AdvancedComponentManager.registerComponent('product-card-enhanced', {
  name: 'product-card-enhanced',
  selector: '.product-card-enhanced',
  lazy: true,
  accessible: true,
  role: 'article',
  focusable: true,
  designTokens: {
    '--card-background': '--color-background',
    '--card-border-radius': '--card-radius',
    '--card-shadow': '--card-shadow',
    '--card-transition': '--animation-duration'
  },
  animations: [
    {
      trigger: 'scroll',
      name: 'fadeIn',
      threshold: 0.2,
      once: true
    },
    {
      trigger: 'hover',
      name: 'bounce',
      reverse: 'fadeIn'
    }
  ],
  init(element, tokens) {
    this.setupProductCard(element, tokens);
  },

  setupProductCard(card, tokens) {
    const quickAddBtn = card.querySelector('.product-card__quick-add');
    const imageContainer = card.querySelector('.product-card__image');
    const badge = card.querySelector('.product-card__badge');

    // Enhanced quick add functionality
    if (quickAddBtn) {
      this.setupQuickAdd(quickAddBtn, card, tokens);
    }

    // Image hover effects
    if (imageContainer) {
      this.setupImageEffects(imageContainer, tokens);
    }

    // Dynamic badge styling
    if (badge) {
      this.setupBadge(badge, tokens);
    }

    // Color variants preview
    this.setupColorVariants(card, tokens);

    // Wishlist functionality
    this.setupWishlist(card, tokens);
  },

  setupQuickAdd(button, card, tokens) {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const variantId = button.dataset.variantId;
      if (!variantId) return;

      // Add loading state
      button.classList.add('loading');
      button.disabled = true;

      try {
        await this.addToCart(variantId);
        this.showSuccess(button, 'Added to cart!');
        
        // Trigger cart update event
        document.dispatchEvent(new CustomEvent('cart:updated'));
      } catch (error) {
        this.showError(button, 'Failed to add to cart');
        console.error('Quick add error:', error);
      } finally {
        button.classList.remove('loading');
        button.disabled = false;
      }
    });
  },

  async addToCart(variantId, quantity = 1) {
    const response = await fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: variantId,
        quantity: quantity
      })
    });

    if (!response.ok) {
      throw new Error('Failed to add to cart');
    }

    return response.json();
  },

  setupImageEffects(imageContainer, tokens) {
    const images = imageContainer.querySelectorAll('img');
    
    if (images.length > 1) {
      // Setup image swap on hover
      const primaryImage = images[0];
      const secondaryImage = images[1];

      imageContainer.addEventListener('mouseenter', () => {
        primaryImage.style.opacity = '0';
        secondaryImage.style.opacity = '1';
      });

      imageContainer.addEventListener('mouseleave', () => {
        primaryImage.style.opacity = '1';
        secondaryImage.style.opacity = '0';
      });
    }

    // Lazy loading for images
    images.forEach(img => {
      if (img.dataset.src) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              observer.unobserve(img);
            }
          });
        });
        observer.observe(img);
      }
    });
  },

  setupBadge(badge, tokens) {
    const badgeType = badge.dataset.type;
    const badgeColors = {
      sale: tokens.colors.secondary,
      new: tokens.colors.primary,
      bestseller: '#f59e0b',
      'sold-out': '#6b7280'
    };

    if (badgeColors[badgeType]) {
      badge.style.backgroundColor = badgeColors[badgeType];
    }

    // Animate badge entrance
    badge.style.transform = 'scale(0)';
    setTimeout(() => {
      badge.style.transform = 'scale(1)';
      badge.style.transition = `transform ${tokens.animation.duration} ease`;
    }, 200);
  },

  setupColorVariants(card, tokens) {
    const colorVariants = card.querySelectorAll('.product-card__color-variant');
    
    colorVariants.forEach(variant => {
      variant.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Update active state
        colorVariants.forEach(v => v.classList.remove('active'));
        variant.classList.add('active');

        // Update product image
        const newImage = variant.dataset.image;
        if (newImage) {
          const productImage = card.querySelector('.product-card__image img');
          if (productImage) {
            productImage.src = newImage;
          }
        }

        // Update variant data
        const quickAddBtn = card.querySelector('.product-card__quick-add');
        if (quickAddBtn) {
          quickAddBtn.dataset.variantId = variant.dataset.variantId;
        }
      });
    });
  },

  setupWishlist(card, tokens) {
    const wishlistBtn = card.querySelector('.product-card__wishlist');
    if (!wishlistBtn) return;

    wishlistBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const productId = card.dataset.productId;
      const isWishlisted = wishlistBtn.classList.contains('active');

      if (isWishlisted) {
        this.removeFromWishlist(productId);
        wishlistBtn.classList.remove('active');
        this.showSuccess(wishlistBtn, 'Removed from wishlist');
      } else {
        this.addToWishlist(productId);
        wishlistBtn.classList.add('active');
        this.showSuccess(wishlistBtn, 'Added to wishlist');
      }
    });
  },

  addToWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (!wishlist.includes(productId)) {
      wishlist.push(productId);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  },

  removeFromWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    wishlist = wishlist.filter(id => id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  },

  showSuccess(element, message) {
    const tooltip = document.createElement('div');
    tooltip.className = 'success-tooltip';
    tooltip.textContent = message;
    tooltip.style.cssText = `
      position: absolute;
      top: -40px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--color-primary);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      white-space: nowrap;
      z-index: 1000;
      animation: fadeIn 0.3s ease;
    `;

    element.style.position = 'relative';
    element.appendChild(tooltip);

    setTimeout(() => {
      tooltip.remove();
    }, 2000);
  },

  showError(element, message) {
    const tooltip = document.createElement('div');
    tooltip.className = 'error-tooltip';
    tooltip.textContent = message;
    tooltip.style.cssText = `
      position: absolute;
      top: -40px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--color-error, #e53e3e);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      white-space: nowrap;
      z-index: 1000;
      animation: fadeIn 0.3s ease;
    `;

    element.style.position = 'relative';
    element.appendChild(tooltip);

    setTimeout(() => {
      tooltip.remove();
    }, 2000);
  }
});

// Register enhanced product gallery component
window.AdvancedComponentManager.registerComponent('product-gallery-enhanced', {
  name: 'product-gallery-enhanced',
  selector: '.product-gallery-enhanced',
  accessible: true,
  role: 'region',
  designTokens: {
    '--gallery-transition': '--animation-duration'
  },
  animations: [
    {
      trigger: 'scroll',
      name: 'fadeInLeft',
      threshold: 0.3,
      once: true
    }
  ],
  init(element, tokens) {
    this.setupGallery(element, tokens);
  },

  setupGallery(gallery, tokens) {
    const mainImage = gallery.querySelector('.product-gallery__main img');
    const thumbnails = gallery.querySelectorAll('.product-gallery__thumbnail');
    const prevBtn = gallery.querySelector('.product-gallery__prev');
    const nextBtn = gallery.querySelector('.product-gallery__next');

    let currentIndex = 0;
    const images = Array.from(thumbnails).map(thumb => thumb.dataset.image);

    // Thumbnail click handlers
    thumbnails.forEach((thumbnail, index) => {
      thumbnail.addEventListener('click', () => {
        this.updateMainImage(mainImage, images[index], tokens);
        this.updateActiveThumbnail(thumbnails, index);
        currentIndex = index;
      });
    });

    // Navigation button handlers
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
        this.updateMainImage(mainImage, images[currentIndex], tokens);
        this.updateActiveThumbnail(thumbnails, currentIndex);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
        this.updateMainImage(mainImage, images[currentIndex], tokens);
        this.updateActiveThumbnail(thumbnails, currentIndex);
      });
    }

    // Keyboard navigation
    gallery.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' && prevBtn) {
        prevBtn.click();
      } else if (e.key === 'ArrowRight' && nextBtn) {
        nextBtn.click();
      }
    });

    // Touch/swipe support
    this.setupTouchNavigation(gallery, () => {
      if (nextBtn) nextBtn.click();
    }, () => {
      if (prevBtn) prevBtn.click();
    });

    // Zoom functionality
    this.setupZoom(mainImage, tokens);
  },

  updateMainImage(imageElement, newSrc, tokens) {
    imageElement.style.opacity = '0';
    setTimeout(() => {
      imageElement.src = newSrc;
      imageElement.style.opacity = '1';
    }, parseInt(tokens.animation.duration) / 2);
  },

  updateActiveThumbnail(thumbnails, activeIndex) {
    thumbnails.forEach((thumb, index) => {
      thumb.classList.toggle('active', index === activeIndex);
    });
  },

  setupTouchNavigation(element, onSwipeLeft, onSwipeRight) {
    let startX = 0;
    let startY = 0;

    element.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    element.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = endX - startX;
      const deltaY = endY - startY;

      // Check if horizontal swipe is more significant than vertical
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          onSwipeRight();
        } else {
          onSwipeLeft();
        }
      }
    }, { passive: true });
  },

  setupZoom(imageElement, tokens) {
    const zoomContainer = document.createElement('div');
    zoomContainer.className = 'product-gallery__zoom';
    zoomContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: url(${imageElement.src}) no-repeat;
      background-size: 200%;
      opacity: 0;
      pointer-events: none;
      transition: opacity ${tokens.animation.duration} ease;
    `;

    imageElement.parentElement.style.position = 'relative';
    imageElement.parentElement.appendChild(zoomContainer);

    imageElement.parentElement.addEventListener('mouseenter', () => {
      zoomContainer.style.opacity = '1';
      zoomContainer.style.pointerEvents = 'auto';
    });

    imageElement.parentElement.addEventListener('mouseleave', () => {
      zoomContainer.style.opacity = '0';
      zoomContainer.style.pointerEvents = 'none';
    });

    imageElement.parentElement.addEventListener('mousemove', (e) => {
      const rect = imageElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      zoomContainer.style.backgroundPosition = `${x}% ${y}%`;
    });

    // Update zoom background when main image changes
    const observer = new MutationObserver(() => {
      zoomContainer.style.backgroundImage = `url(${imageElement.src})`;
    });

    observer.observe(imageElement, {
      attributes: true,
      attributeFilter: ['src']
    });
  }
});
