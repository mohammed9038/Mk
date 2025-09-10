// Desktop Navigation Dropdown - Universal JavaScript Enhancement
(function() {
  'use strict';
  
  // Only run on desktop
  if (window.innerWidth < 990) return;
  
  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', function() {
    console.log('[Dropdown Debug] Script initialized');
    
    // Debug ALL possible navigation selectors
    const possibleSelectors = [
      '.header__inline-menu',
      '.header__navigation',
      '.list-menu--inline',
      'nav[role="navigation"]',
      '.header nav',
      '.header .list-menu'
    ];
    
    let foundNavigation = null;
    let navigationSelector = '';
    
    possibleSelectors.forEach(selector => {
      const element = document.querySelector(selector);
      console.log(`[Dropdown Debug] Checking selector "${selector}":`, !!element);
      if (element && !foundNavigation) {
        foundNavigation = element;
        navigationSelector = selector;
        console.log(`[Dropdown Debug] Found navigation with selector: ${selector}`);
        console.log(`[Dropdown Debug] Navigation HTML:`, element.outerHTML.substring(0, 500) + '...');
      }
    });
    
    if (!foundNavigation) {
      console.error('[Dropdown Debug] No navigation found with any selector!');
      // Log the entire header structure for debugging
      const header = document.querySelector('.header, header');
      if (header) {
        console.log('[Dropdown Debug] Header HTML:', header.outerHTML.substring(0, 1000) + '...');
      }
      return;
    }
    
    // Find all possible dropdown structures
    const dropdownSelectors = [
      `${navigationSelector} details`,
      `${navigationSelector} .header-menu details`,
      `${navigationSelector} header-menu details`,
      `${navigationSelector} li details`
    ];
    
    let menuItems = [];
    let workingSelector = '';
    
    dropdownSelectors.forEach(selector => {
      const items = document.querySelectorAll(selector);
      console.log(`[Dropdown Debug] Checking dropdown selector "${selector}": found ${items.length} items`);
      if (items.length > 0 && menuItems.length === 0) {
        menuItems = items;
        workingSelector = selector;
      }
    });
    
    console.log(`[Dropdown Debug] Using selector: ${workingSelector}`);
    console.log('[Dropdown Debug] Found dropdown menu items:', menuItems.length);
    
    if (menuItems.length === 0) {
      console.warn('[Dropdown Debug] No dropdown menu items found with any selector!');
      
      // Debug all menu items to see their structure
      const allMenuItems = foundNavigation.querySelectorAll('li, a');
      console.log(`[Dropdown Debug] Found ${allMenuItems.length} total menu items`);
      
      allMenuItems.forEach((item, index) => {
        const text = item.textContent ? item.textContent.trim().substring(0, 30) : 'No text';
        const hasDetails = !!item.querySelector('details');
        const hasHeaderMenu = !!item.querySelector('header-menu');
        const hasSubmenu = !!item.querySelector('.header__submenu');
        
        console.log(`[Dropdown Debug] Item ${index + 1}: "${text}"`, {
          tagName: item.tagName,
          hasDetails,
          hasHeaderMenu,
          hasSubmenu,
          innerHTML: item.innerHTML.substring(0, 100) + '...'
        });
      });
      
      return;
    }
    
    // Track hover state
    let currentOpenDropdown = null;
    let hoverTimeout = null;
    
    menuItems.forEach(function(details) {
      const summary = details.querySelector('summary');
      const submenu = details.querySelector('.header__submenu');
      
      if (!summary || !submenu) {
        console.warn('[Dropdown Debug] Missing summary or submenu for:', details);
        return;
      }
      
      console.log('[Dropdown Debug] Setting up dropdown for:', summary.textContent.trim());
      
      // Prevent default click behavior
      summary.addEventListener('click', function(e) {
        if (window.innerWidth >= 990) {
          e.preventDefault();
          e.stopPropagation();
        }
      });
      
      // Mouse enter on parent
      details.addEventListener('mouseenter', function() {
        console.log('[Dropdown Debug] Mouse entered:', summary.textContent.trim());
        
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
        
        // Force visibility
        submenu.style.setProperty('opacity', '1', 'important');
        submenu.style.setProperty('visibility', 'visible', 'important');
        submenu.style.setProperty('pointer-events', 'auto', 'important');
      });
      
      // Mouse leave from parent
      details.addEventListener('mouseleave', function() {
        console.log('[Dropdown Debug] Mouse left:', summary.textContent.trim());
        
        // Delay closing to allow moving to submenu
        hoverTimeout = setTimeout(function() {
          details.removeAttribute('open');
          details.classList.remove('hover-active');
          
          // Reset styles
          submenu.style.removeProperty('opacity');
          submenu.style.removeProperty('visibility');
          submenu.style.removeProperty('pointer-events');
          
          if (currentOpenDropdown === details) {
            currentOpenDropdown = null;
          }
        }, 300);
      });
      
      // Keep dropdown open when hovering submenu
      submenu.addEventListener('mouseenter', function() {
        console.log('[Dropdown Debug] Mouse entered submenu');
        if (hoverTimeout) {
          clearTimeout(hoverTimeout);
          hoverTimeout = null;
        }
      });
      
      // Close when leaving submenu
      submenu.addEventListener('mouseleave', function() {
        console.log('[Dropdown Debug] Mouse left submenu');
        hoverTimeout = setTimeout(function() {
          details.removeAttribute('open');
          details.classList.remove('hover-active');
          
          submenu.style.removeProperty('opacity');
          submenu.style.removeProperty('visibility');
          submenu.style.removeProperty('pointer-events');
          
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
        currentOpenDropdown = null;
      }
    });
    
    // Add custom CSS class to body for additional styling hooks
    document.body.classList.add('dropdown-hover-enabled');
    console.log('[Dropdown Debug] Dropdown hover functionality enabled for', menuItems.length, 'menu items');
  });
})();
