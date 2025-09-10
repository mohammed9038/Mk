// Desktop Navigation Dropdown - Universal JavaScript Enhancement
(function() {
  'use strict';
  
  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', function() {
    // Only run on desktop
    if (window.innerWidth < 990) {
      console.log('[Dropdown Debug] Mobile view, skipping dropdown enhancement');
      return;
    }
    
    console.log('[Dropdown Debug] Script initialized for desktop');
    
    // Find the navigation menu
    const navigation = document.querySelector('.header__inline-menu');
    if (!navigation) {
      console.error('[Dropdown Debug] No .header__inline-menu found!');
      return;
    }
    
    console.log('[Dropdown Debug] Navigation found:', navigation);
    
    // Find all dropdown menu items (header-menu elements containing details)
    const menuItems = navigation.querySelectorAll('header-menu details');
    console.log('[Dropdown Debug] Found dropdown menu items:', menuItems.length);
    
    if (menuItems.length === 0) {
      console.warn('[Dropdown Debug] No dropdown menu items found!');
      // Let's check if there are any other dropdown structures
      const alternativeItems = navigation.querySelectorAll('details');
      console.log('[Dropdown Debug] Alternative details found:', alternativeItems.length);
      return;
    }
    
    // Track hover state
    let currentOpenDropdown = null;
    let hoverTimeout = null;

    menuItems.forEach(function(details, index) {
      const summary = details.querySelector('summary');
      const submenu = details.querySelector('.header__submenu');
      const headerMenu = details.closest('header-menu');
      
      console.log(`[Dropdown Debug] Menu item ${index + 1}:`, {
        hasSummary: !!summary,
        hasSubmenu: !!submenu,
        hasHeaderMenu: !!headerMenu,
        summaryText: summary ? summary.textContent.trim() : 'No summary'
      });
      
      if (!summary || !submenu || !headerMenu) {
        console.warn(`[Dropdown Debug] Missing elements for menu item ${index + 1}`);
        return;
      }
      
      // Prevent default click behavior on summary for hover interaction
      summary.addEventListener('click', function(e) {
        if (window.innerWidth >= 990) {
          e.preventDefault();
          e.stopPropagation();
          
          // Toggle dropdown manually
          if (details.hasAttribute('open')) {
            details.removeAttribute('open');
            details.classList.remove('hover-active');
          } else {
            // Close other dropdowns
            if (currentOpenDropdown && currentOpenDropdown !== details) {
              currentOpenDropdown.removeAttribute('open');
              currentOpenDropdown.classList.remove('hover-active');
            }
            details.setAttribute('open', '');
            details.classList.add('hover-active');
            currentOpenDropdown = details;
          }
          
          console.log('[Dropdown Debug] Clicked dropdown:', summary.textContent.trim(), 'Open:', details.hasAttribute('open'));
        }
      });
      
      // Mouse enter on header-menu (parent container)
      headerMenu.addEventListener('mouseenter', function() {
        console.log('[Dropdown Debug] Mouse entered header-menu:', summary.textContent.trim());
        
        // Clear any pending close timeout
        if (hoverTimeout) {
          clearTimeout(hoverTimeout);
          hoverTimeout = null;
        }
        
        // Close other dropdowns
        if (currentOpenDropdown && currentOpenDropdown !== details) {
          currentOpenDropdown.removeAttribute('open');
          currentOpenDropdown.classList.remove('hover-active');
        }
        
        // Open this dropdown
        details.setAttribute('open', '');
        details.classList.add('hover-active');
        currentOpenDropdown = details;
        
        // Force visibility styles to override base.css
        submenu.style.setProperty('opacity', '1', 'important');
        submenu.style.setProperty('visibility', 'visible', 'important');
        submenu.style.setProperty('pointer-events', 'auto', 'important');
        submenu.style.setProperty('transform', 'translateY(0)', 'important');
        submenu.style.setProperty('display', 'block', 'important');
      });
      
      // Mouse leave from header-menu
      headerMenu.addEventListener('mouseleave', function() {
        console.log('[Dropdown Debug] Mouse left header-menu:', summary.textContent.trim());
        
        // Delay closing to allow moving to submenu
        hoverTimeout = setTimeout(function() {
          details.removeAttribute('open');
          details.classList.remove('hover-active');
          
          // Reset styles
          submenu.style.removeProperty('opacity');
          submenu.style.removeProperty('visibility');
          submenu.style.removeProperty('pointer-events');
          submenu.style.removeProperty('transform');
          submenu.style.removeProperty('display');
          
          if (currentOpenDropdown === details) {
            currentOpenDropdown = null;
          }
        }, 300);
      });
      
      // Keep dropdown open when hovering submenu
      submenu.addEventListener('mouseenter', function() {
        if (hoverTimeout) {
          clearTimeout(hoverTimeout);
          hoverTimeout = null;
        }
      });
      
      submenu.addEventListener('mouseleave', function() {
        hoverTimeout = setTimeout(function() {
          details.removeAttribute('open');
          details.classList.remove('hover-active');
          
          submenu.style.removeProperty('opacity');
          submenu.style.removeProperty('visibility');
          submenu.style.removeProperty('pointer-events');
          submenu.style.removeProperty('transform');
          submenu.style.removeProperty('display');
          
          if (currentOpenDropdown === details) {
            currentOpenDropdown = null;
          }
        }, 300);
      });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
      if (currentOpenDropdown && !currentOpenDropdown.contains(e.target)) {
        currentOpenDropdown.removeAttribute('open');
        currentOpenDropdown.classList.remove('hover-active');
        
        const submenu = currentOpenDropdown.querySelector('.header__submenu');
        if (submenu) {
          submenu.style.removeProperty('opacity');
          submenu.style.removeProperty('visibility');
          submenu.style.removeProperty('pointer-events');
          submenu.style.removeProperty('transform');
          submenu.style.removeProperty('display');
        }
        
        currentOpenDropdown = null;
      }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
      if (window.innerWidth < 990 && currentOpenDropdown) {
        currentOpenDropdown.removeAttribute('open');
        currentOpenDropdown.classList.remove('hover-active');
        currentOpenDropdown = null;
      }
    });
    
    // Add custom CSS class to body for additional styling hooks
    document.body.classList.add('dropdown-hover-enabled');
    console.log('[Dropdown Debug] Dropdown hover functionality enabled for', menuItems.length, 'menu items');
  });
})();
