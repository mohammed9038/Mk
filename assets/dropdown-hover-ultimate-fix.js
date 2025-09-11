(function() {
  'use strict';
  
  console.log('Dropdown Hover Ultimate Fix - Initializing');
  
  function initDropdownHover() {
    // Wait for DOM to be fully ready
    if (document.readyState === 'loading') {
      setTimeout(initDropdownHover, 100);
      return;
    }
    
    // Get all header menu elements
    const headerMenus = document.querySelectorAll('.header__inline-menu header-menu');
    
    if (headerMenus.length === 0) {
      console.log('No header-menu elements found');
      // Try alternative selector
      const altMenus = document.querySelectorAll('header-menu');
      console.log(`Found ${altMenus.length} header-menu elements (alternative search)`);
      if (altMenus.length === 0) return;
    }
    
    console.log(`Found ${headerMenus.length} header-menu elements`);
    
    // Process each header-menu
    headerMenus.forEach((headerMenu, index) => {
      const details = headerMenu.querySelector('details');
      const summary = headerMenu.querySelector('summary');
      const submenu = headerMenu.querySelector('.header__submenu');
      
      if (!details || !summary || !submenu) {
        console.log(`Menu ${index + 1}: Missing elements`, {
          hasDetails: !!details,
          hasSummary: !!summary,
          hasSubmenu: !!submenu
        });
        return;
      }
      
      const menuText = summary.textContent.trim();
      console.log(`Setting up menu: "${menuText}"`);
      
      let hoverTimeout = null;
      
      // Force positioning on header-menu
      headerMenu.style.position = 'relative';
      
      // Prevent default click behavior
      summary.addEventListener('click', function(e) {
        if (window.innerWidth >= 990) {
          e.preventDefault();
          e.stopPropagation();
          
          // Toggle dropdown manually
          if (details.hasAttribute('open')) {
            closeDropdown();
          } else {
            openDropdown();
          }
        }
      });
      
      // Mouse enter on header-menu
      headerMenu.addEventListener('mouseenter', function() {
        console.log(`Mouse enter: ${menuText}`);
        if (hoverTimeout) {
          clearTimeout(hoverTimeout);
          hoverTimeout = null;
        }
        openDropdown();
      });
      
      // Mouse leave on header-menu
      headerMenu.addEventListener('mouseleave', function() {
        console.log(`Mouse leave: ${menuText}`);
        hoverTimeout = setTimeout(closeDropdown, 150);
      });
      
      // Keep open when hovering submenu
      submenu.addEventListener('mouseenter', function() {
        if (hoverTimeout) {
          clearTimeout(hoverTimeout);
          hoverTimeout = null;
        }
      });
      
      submenu.addEventListener('mouseleave', function() {
        hoverTimeout = setTimeout(closeDropdown, 150);
      });
      
      function openDropdown() {
        // Close other dropdowns first
        document.querySelectorAll('.header__inline-menu header-menu details[open]').forEach(otherDetails => {
          if (otherDetails !== details) {
            otherDetails.removeAttribute('open');
            const otherSubmenu = otherDetails.querySelector('.header__submenu');
            if (otherSubmenu) {
              otherSubmenu.style.removeProperty('opacity');
              otherSubmenu.style.removeProperty('visibility');
              otherSubmenu.style.removeProperty('transform');
              otherSubmenu.style.removeProperty('display');
            }
          }
        });
        
        // Open this dropdown
        details.setAttribute('open', '');
        details.classList.add('force-open');
        
        // Force visibility styles
        submenu.style.setProperty('opacity', '1', 'important');
        submenu.style.setProperty('visibility', 'visible', 'important');
        submenu.style.setProperty('transform', 'translateY(0)', 'important');
        submenu.style.setProperty('display', 'block', 'important');
        submenu.style.setProperty('pointer-events', 'auto', 'important');
        submenu.style.setProperty('position', 'absolute', 'important');
        submenu.style.setProperty('top', '100%', 'important');
        submenu.style.setProperty('left', '0', 'important');
        submenu.style.setProperty('z-index', '999999', 'important');
        
        console.log(`Opened dropdown: ${menuText}`);
      }
      
      function closeDropdown() {
        details.removeAttribute('open');
        details.classList.remove('force-open');
        
        // Reset inline styles
        submenu.style.removeProperty('opacity');
        submenu.style.removeProperty('visibility');
        submenu.style.removeProperty('transform');
        submenu.style.removeProperty('display');
        submenu.style.removeProperty('pointer-events');
        submenu.style.removeProperty('position');
        submenu.style.removeProperty('top');
        submenu.style.removeProperty('left');
        submenu.style.removeProperty('z-index');
        
        console.log(`Closed dropdown: ${menuText}`);
      }
    });
    
    // Inject critical CSS
    if (!document.getElementById('dropdown-hover-critical-css')) {
      const style = document.createElement('style');
      style.id = 'dropdown-hover-critical-css';
      style.textContent = `
        /* Critical dropdown hover CSS */
        .header__inline-menu header-menu {
          position: relative !important;
        }
        
        .header__inline-menu header-menu details[open] > .header__submenu {
          opacity: 1 !important;
          visibility: visible !important;
          transform: translateY(0) !important;
          display: block !important;
          pointer-events: auto !important;
          position: absolute !important;
          top: 100% !important;
          left: 0 !important;
          z-index: 999999 !important;
          animation: none !important;
        }
        
        .header__inline-menu header-menu details:not([open]) > .header__submenu {
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }
        
        /* Override any conflicting animations */
        .header__inline-menu .header__submenu {
          transition: opacity 0.2s ease, visibility 0.2s ease, transform 0.2s ease !important;
        }
        
        /* Ensure proper stacking */
        .header__inline-menu {
          z-index: 1000 !important;
        }
      `;
      document.head.appendChild(style);
    }
    
    console.log('Dropdown Hover Ultimate Fix - Setup complete');
  }
  
  // Initialize immediately
  initDropdownHover();
  
  // Also initialize on DOM ready as backup
  document.addEventListener('DOMContentLoaded', initDropdownHover);
  
  // Reinitialize on window load as final backup
  window.addEventListener('load', initDropdownHover);
  
  // Monitor for dynamic content changes
  if (window.MutationObserver) {
    const observer = new MutationObserver(function(mutations) {
      let shouldReinit = false;
      
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1) {
              if (node.tagName === 'HEADER-MENU' || 
                  node.querySelector && node.querySelector('header-menu')) {
                shouldReinit = true;
              }
            }
          });
        }
      });
      
      if (shouldReinit) {
        console.log('Header menu DOM change detected, reinitializing...');
        setTimeout(initDropdownHover, 100);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
})();
