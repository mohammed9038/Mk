/* ===================================================================
   OPTIMIZED SLIDER COMPONENT BUNDLE
   Replaces heavy slider code from global.js with optimized modules
   =================================================================== */

// Optimized Slider Component with intersection observer
class SliderComponent extends HTMLElement {
  constructor() {
    super();
    this.sliderItems = this.querySelectorAll('[id^="Slide-"]');
    this.pageCount = this.querySelector('.slider-counter--current');
    this.pageTotal = this.querySelector('.slider-counter--total');
    this.prevButton = this.querySelector('button[name="previous"]');
    this.nextButton = this.querySelector('button[name="next"]');
    
    if (!this.sliderItems.length) return;
    
    this.initializeSlider();
  }

  initializeSlider() {
    if (this.pageTotal) {
      this.pageTotal.setAttribute('aria-hidden', true);
      this.pageTotal.textContent = this.sliderItems.length;
    }

    if (this.pageCount) {
      this.pageCount.setAttribute('aria-hidden', true);
    }

    this.currentPage = 1;
    this.setCurrentPage();

    if (this.prevButton && this.nextButton) {
      this.prevButton.addEventListener('click', this.onButtonClick.bind(this));
      this.nextButton.addEventListener('click', this.onButtonClick.bind(this));
    }

    this.slider = this.querySelector('[role="list"]');
    if (this.slider) {
      this.initializeSlideObserver();
    }

    // Reduce motion support
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  }

  initializeSlideObserver() {
    if (!('IntersectionObserver' in window)) return;

    this.slideObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.75) {
          const slideIndex = parseInt(entry.target.dataset.index);
          if (slideIndex && slideIndex !== this.currentPage) {
            this.currentPage = slideIndex;
            this.setCurrentPage();
          }
        }
      }
    }, {
      root: this.slider,
      threshold: 0.75
    });

    this.sliderItems.forEach((slide, index) => {
      slide.dataset.index = index + 1;
      this.slideObserver.observe(slide);
    });
  }

  setCurrentPage() {
    if (this.pageCount) {
      this.pageCount.textContent = this.currentPage;
    }
    
    if (this.prevButton) {
      this.prevButton.setAttribute('aria-disabled', this.currentPage === 1);
    }
    
    if (this.nextButton) {
      this.nextButton.setAttribute('aria-disabled', this.currentPage === this.sliderItems.length);
    }
  }

  onButtonClick(event) {
    event.preventDefault();
    const step = event.currentTarget.name === 'next' ? 1 : -1;
    this.slideScrollPosition = event.currentTarget.name === 'next' ? this.slider.scrollLeft + step * this.sliderItems[0].clientWidth : this.slider.scrollLeft - step * this.sliderItems[0].clientWidth;
    
    const behavior = this.reducedMotion?.matches ? 'auto' : 'smooth';
    this.slider.scrollTo({
      left: this.slideScrollPosition,
      behavior
    });
  }

  disconnectedCallback() {
    if (this.slideObserver) {
      this.slideObserver.disconnect();
    }
  }
}

// Optimized Slideshow Component
class SlideshowComponent extends SliderComponent {
  constructor() {
    super();
    
    this.autoplayButton = this.querySelector('.slideshow__autoplay');
    this.sliderControlWrapper = this.querySelector('.slider-buttons');
    this.enableSliderLooping = false;

    if (!this.sliderItems.length) return;

    this.autoPlay = this.dataset.autoplay === 'true';
    this.autoplaySpeed = this.dataset.speed * 1000 || 5000;

    this.initializeAutoplay();
  }

  initializeAutoplay() {
    if (this.autoplayButton) {
      this.autoplayButton.addEventListener('click', this.onAutoplayButtonClick.bind(this));
    }

    this.addEventListener('focusin', () => {
      if (this.autoPlay) this.stopAutoplay();
    });

    this.addEventListener('focusout', () => {
      if (this.autoPlay) this.startAutoplay();
    });

    this.addEventListener('mouseenter', () => {
      if (this.autoPlay) this.stopAutoplay();
    });

    this.addEventListener('mouseleave', () => {
      if (this.autoPlay) this.startAutoplay();
    });

    if (this.autoPlay) this.startAutoplay();
  }

  onAutoplayButtonClick() {
    this.autoPlay = !this.autoPlay;
    this.autoplayButton.classList.toggle('slideshow__autoplay--paused', !this.autoPlay);

    if (this.autoPlay) {
      this.startAutoplay();
    } else {
      this.stopAutoplay();
    }
  }

  startAutoplay() {
    this.stopAutoplay();
    this.autoplayTimer = setInterval(() => {
      this.goToNextSlide();
    }, this.autoplaySpeed);
  }

  stopAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  goToNextSlide() {
    const nextPage = this.currentPage === this.sliderItems.length ? 1 : this.currentPage + 1;
    const nextSlide = this.querySelector(`[id="Slide-${this.dataset.slideshow || this.dataset.section}-${nextPage}"]`);
    
    if (nextSlide) {
      const behavior = this.reducedMotion?.matches ? 'auto' : 'smooth';
      nextSlide.scrollIntoView({ 
        block: 'nearest', 
        behavior 
      });
    }
  }

  onButtonClick(event) {
    super.onButtonClick(event);
    
    // Reset autoplay timer
    if (this.autoPlay) {
      this.stopAutoplay();
      this.startAutoplay();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.stopAutoplay();
  }
}

// Optimized Product Recommendations Slider
class ProductRecommendations extends HTMLElement {
  constructor() {
    super();
    
    this.initializeObserver();
  }

  initializeObserver() {
    if (!('IntersectionObserver' in window)) {
      this.loadRecommendations();
      return;
    }

    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.observer.disconnect();
        this.loadRecommendations();
      }
    }, {
      rootMargin: '0px 0px 400px 0px'
    });

    this.observer.observe(this);
  }

  loadRecommendations() {
    const url = this.dataset.url;
    if (!url) return;

    fetch(url)
      .then(response => response.text())
      .then(text => {
        const html = document.createElement('div');
        html.innerHTML = text;
        const recommendations = html.querySelector('product-recommendations');

        if (recommendations?.innerHTML.trim().length) {
          this.innerHTML = recommendations.innerHTML;
        }

        if (html.querySelector('.grid__item')) {
          this.classList.add('product-recommendations--loaded');
        }
      })
      .catch(e => {
        console.error('Failed to load product recommendations:', e);
      });
  }

  disconnectedCallback() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Register optimized slider components
if ('customElements' in window) {
  customElements.define('slider-component', SliderComponent);
  customElements.define('slideshow-component', SlideshowComponent);
  customElements.define('product-recommendations', ProductRecommendations);
}

// Performance mark
if ('performance' in window && 'mark' in window.performance) {
  window.performance.mark('slider-components-loaded');
}
