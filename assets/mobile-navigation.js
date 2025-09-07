class MobileNavigation {
  constructor() {
    this.nav = document.querySelector('.mobile-nav');
    this.searchOverlay = document.querySelector('.mobile-search-overlay');
    this.searchButton = document.querySelector('.mobile-nav__link[data-action="search"]');
    this.searchClose = document.querySelector('.mobile-search-overlay__close');
    this.searchInput = document.querySelector('.mobile-search-overlay__input');
    this.cartBadge = document.querySelector('.mobile-nav__badge');
    
    this.init();
  }

  init() {
    if (!this.nav) return;
    
    this.bindEvents();
    this.updateCartBadge();
    this.setActiveNav();
    
    // Update cart badge when cart changes
    document.addEventListener('cart:updated', () => this.updateCartBadge());
  }

  bindEvents() {
    // Search overlay functionality
    if (this.searchButton && this.searchOverlay) {
      this.searchButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.openSearchOverlay();
      });
    }

    if (this.searchClose) {
      this.searchClose.addEventListener('click', () => {
        this.closeSearchOverlay();
      });
    }

    // Close search on overlay click
    if (this.searchOverlay) {
      this.searchOverlay.addEventListener('click', (e) => {
        if (e.target === this.searchOverlay) {
          this.closeSearchOverlay();
        }
      });
    }

    // Close search on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.searchOverlay && this.searchOverlay.classList.contains('active')) {
        this.closeSearchOverlay();
      }
    });

    // Handle search form submission
    if (this.searchInput) {
      this.searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.performSearch();
        }
      });
    }

    // Navigation analytics
    this.nav.addEventListener('click', (e) => {
      const link = e.target.closest('.mobile-nav__link');
      if (link && link.dataset.action) {
        this.trackNavigation(link.dataset.action);
      }
    });
  }

  openSearchOverlay() {
    if (this.searchOverlay) {
      this.searchOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Focus on search input after animation
      setTimeout(() => {
        if (this.searchInput) {
          this.searchInput.focus();
        }
      }, 100);
    }
  }

  closeSearchOverlay() {
    if (this.searchOverlay) {
      this.searchOverlay.classList.remove('active');
      document.body.style.overflow = '';
      
      if (this.searchInput) {
        this.searchInput.value = '';
      }
    }
  }

  performSearch() {
    const query = this.searchInput ? this.searchInput.value.trim() : '';
    if (query) {
      // Use Shopify's search URL
      const searchUrl = window.routes?.predictive_search_url || '/search';
      window.location.href = `${searchUrl}?q=${encodeURIComponent(query)}`;
    }
  }

  updateCartBadge() {
    if (!this.cartBadge) return;

    // Get cart count from Shopify cart object or fetch it
    if (window.Shopify && window.Shopify.cart) {
      const itemCount = window.Shopify.cart.item_count;
      this.cartBadge.textContent = itemCount > 0 ? itemCount : '';
    } else {
      // Fetch cart data
      fetch('/cart.js')
        .then(response => response.json())
        .then(cart => {
          const itemCount = cart.item_count;
          this.cartBadge.textContent = itemCount > 0 ? itemCount : '';
        })
        .catch(error => {
          console.log('Could not fetch cart data:', error);
        });
    }
  }

  setActiveNav() {
    const currentPath = window.location.pathname;
    const navLinks = this.nav.querySelectorAll('.mobile-nav__link');

    navLinks.forEach(link => {
      link.classList.remove('active');
      
      // Check if this is the current page
      const href = link.getAttribute('href');
      if (href && (currentPath === href || currentPath.startsWith(href + '/'))) {
        link.classList.add('active');
      }
      
      // Special cases
      if (currentPath === '/' && link.dataset.action === 'home') {
        link.classList.add('active');
      } else if (currentPath.includes('/cart') && link.dataset.action === 'cart') {
        link.classList.add('active');
      } else if (currentPath.includes('/search') && link.dataset.action === 'search') {
        link.classList.add('active');
      } else if (currentPath.includes('/account') && link.dataset.action === 'account') {
        link.classList.add('active');
      }
    });
  }

  trackNavigation(action) {
    // Analytics tracking for mobile navigation
    if (window.gtag) {
      window.gtag('event', 'mobile_nav_click', {
        'event_category': 'Mobile Navigation',
        'event_label': action,
        'value': 1
      });
    }

    // Facebook Pixel tracking
    if (window.fbq) {
      window.fbq('trackCustom', 'MobileNavigation', {
        action: action
      });
    }

    // Custom analytics
    if (window.analytics && window.analytics.track) {
      window.analytics.track('Mobile Navigation Click', {
        action: action,
        page: window.location.pathname
      });
    }
  }

  // Public method to refresh cart badge
  refreshCartBadge() {
    this.updateCartBadge();
  }

  // Public method to set active navigation
  setActiveNavigation(action) {
    const navLinks = this.nav.querySelectorAll('.mobile-nav__link');
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.dataset.action === action) {
        link.classList.add('active');
      }
    });
  }
}

// Initialize mobile navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.mobileNav = new MobileNavigation();
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MobileNavigation;
}
