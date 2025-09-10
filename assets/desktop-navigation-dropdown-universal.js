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
      // Try multiple possible selectors for summary and submenu
      const summary = details.querySelector('summary') || 
                     details.querySelector('.pro-nav-link--parent') ||
                     details.previousElementSibling;
      
      const submenu = details.querySelector('.header__submenu') || 
                     details.querySelector('.pro-submenu-content') ||
                     details.querySelector('.pro-submenu-list') ||
                     details.querySelector('ul') ||
                     details.querySelector('div');
      
      console.log('[Dropdown Debug] Element analysis:', {
        hasSummary: !!summary,
        hasSubmenu: !!submenu,
        detailsHTML: details.outerHTML.substring(0, 200) + '...',
        summaryType: summary ? summary.tagName + '.' + summary.className : 'None',
        submenuType: submenu ? submenu.tagName + '.' + submenu.className : 'None'
      });
      
      if (!summary || !submenu) {
        console.warn('[Dropdown Debug] Missing summary or submenu for:', details);
        console.log('[Dropdown Debug] Will try to use parent element as trigger');
        
        // Try to use the parent element as the hover trigger
        const parentTrigger = details.parentElement;
        const parentLink = parentTrigger ? parentTrigger.querySelector('a') : null;
        
        if (parentTrigger && parentLink && submenu) {
          console.log('[Dropdown Debug] Using parent element as trigger for:', parentLink.textContent.trim());
          this.setupParentTrigger(parentTrigger, parentLink, details, submenu);
        }
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
        
        // Open this dropdown - FORCE IT
        details.setAttribute('open', '');
        details.classList.add('hover-active');
        currentOpenDropdown = details;
        
        // Force visibility with multiple approaches
        submenu.style.setProperty('opacity', '1', 'important');
        submenu.style.setProperty('visibility', 'visible', 'important');
        submenu.style.setProperty('pointer-events', 'auto', 'important');
        submenu.style.setProperty('display', 'block', 'important');
        submenu.style.setProperty('transform', 'translateY(0)', 'important');
        submenu.style.setProperty('z-index', '9999', 'important');
        submenu.style.setProperty('position', 'absolute', 'important');
        
        console.log('[Dropdown Debug] Forced dropdown styles applied');
      });
      
      // Also add mouseover for extra coverage
      details.addEventListener('mouseover', function() {
        if (!details.hasAttribute('open')) {
          details.setAttribute('open', '');
          details.classList.add('hover-active');
          submenu.style.setProperty('opacity', '1', 'important');
          submenu.style.setProperty('visibility', 'visible', 'important');
          submenu.style.setProperty('display', 'block', 'important');
        }
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
          submenu.style.removeProperty('display');
          
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
          submenu.style.removeProperty('display');
          
          if (currentOpenDropdown === details) {
            currentOpenDropdown = null;
          }
        }, 300);
      });
    }.bind(this));
    
    // Method to setup parent element as trigger
    this.setupParentTrigger = function(parentElement, triggerLink, details, submenu) {
      let hoverTimeout = null;
      
      console.log('[Dropdown Debug] Setting up parent trigger for:', triggerLink.textContent.trim());
      
      // Prevent default click behavior on the link
      triggerLink.addEventListener('click', function(e) {
        if (window.innerWidth >= 990) {
          e.preventDefault();
          e.stopPropagation();
        }
      });
      
      // Mouse enter on parent
      parentElement.addEventListener('mouseenter', function() {
        console.log('[Dropdown Debug] Mouse entered parent:', triggerLink.textContent.trim());
        
        // Clear any pending close timeout
        if (hoverTimeout) {
          clearTimeout(hoverTimeout);
          hoverTimeout = null;
        }
        
        // Open this dropdown
        details.setAttribute('open', '');
        details.classList.add('hover-active');
        
        // Force visibility
        submenu.style.setProperty('opacity', '1', 'important');
        submenu.style.setProperty('visibility', 'visible', 'important');
        submenu.style.setProperty('pointer-events', 'auto', 'important');
        submenu.style.setProperty('display', 'block', 'important');
      });
      
      // Mouse leave from parent
      parentElement.addEventListener('mouseleave', function() {
        console.log('[Dropdown Debug] Mouse left parent:', triggerLink.textContent.trim());
        
        // Delay closing to allow moving to submenu
        hoverTimeout = setTimeout(function() {
          details.removeAttribute('open');
          details.classList.remove('hover-active');
          
          // Reset styles
          submenu.style.removeProperty('opacity');
          submenu.style.removeProperty('visibility');
          submenu.style.removeProperty('pointer-events');
          submenu.style.removeProperty('display');
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
          submenu.style.removeProperty('display');
        }, 300);
      });
    };
    
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
    
    // ADDITIONAL: Add CSS hover as backup
    const style = document.createElement('style');
    style.textContent = `
      @media screen and (min-width: 990px) {
        /* Force dropdown on any li hover */
        nav[role="navigation"] li:hover details.pro-nav-submenu .pro-submenu-content,
        nav[role="navigation"] li:hover .pro-submenu-content,
        .top-nav__item:hover .pro-submenu-content,
        details.pro-nav-submenu:hover .pro-submenu-content {
          opacity: 1 !important;
          visibility: visible !important;
          pointer-events: auto !important;
          display: block !important;
          transform: translateY(0) !important;
          z-index: 9999 !important;
          position: absolute !important;
          top: 100% !important;
          left: 0 !important;
          background: white !important;
          border: 1px solid #ddd !important;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1) !important;
          min-width: 200px !important;
          padding: 10px 0 !important;
        }
        
        /* Ensure parent positioning */
        nav[role="navigation"] li,
        .top-nav__item,
        details.pro-nav-submenu {
          position: relative !important;
        }
      }
    `;
    document.head.appendChild(style);
    console.log('[Dropdown Debug] Backup CSS hover styles injected');
    
    // TEST: Force open first dropdown for 3 seconds to verify it can be opened
    if (menuItems.length > 0) {
      const testDropdown = menuItems[0];
      const testSubmenu = testDropdown.querySelector('.pro-submenu-content') || testDropdown.querySelector('.header__submenu');
      
      if (testSubmenu) {
        console.log('[Dropdown Debug] TESTING: Force opening first dropdown for 3 seconds');
        testDropdown.setAttribute('open', '');
        testSubmenu.style.setProperty('opacity', '1', 'important');
        testSubmenu.style.setProperty('visibility', 'visible', 'important');
        testSubmenu.style.setProperty('display', 'block', 'important');
        testSubmenu.style.setProperty('position', 'absolute', 'important');
        testSubmenu.style.setProperty('z-index', '9999', 'important');
        
        setTimeout(() => {
          testDropdown.removeAttribute('open');
          testSubmenu.style.removeProperty('opacity');
          testSubmenu.style.removeProperty('visibility');
          testSubmenu.style.removeProperty('display');
          testSubmenu.style.removeProperty('position');
          testSubmenu.style.removeProperty('z-index');
          console.log('[Dropdown Debug] Test dropdown closed');
        }, 3000);
      }
    }
  });
})();
