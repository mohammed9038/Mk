// Dropdown Hover Fix - Aggressive JavaScript Solution
(function() {
  'use strict';
  
  console.log('[Dropdown Fix] Starting enhanced dropdown hover fix');
  
  function initDropdownHover() {
    // Only run on desktop
    if (window.innerWidth < 990) {
      console.log('[Dropdown Fix] Mobile view detected, skipping');
      return;
    }
    
    const navigation = document.querySelector('.header__inline-menu');
    if (!navigation) {
      console.log('[Dropdown Fix] No navigation found');
      return;
    }
    
    const menuItems = navigation.querySelectorAll('header-menu');
    console.log('[Dropdown Fix] Found menu items:', menuItems.length);
    
    if (menuItems.length === 0) return;
    
    let currentOpenDropdown = null;
    let hoverTimeout = null;
    
    // Add body class for CSS targeting
    document.body.classList.add('dropdown-hover-enabled');
    
    menuItems.forEach((headerMenu, index) => {
      const details = headerMenu.querySelector('details');
      const summary = headerMenu.querySelector('summary');
      const submenu = headerMenu.querySelector('.header__submenu');
      
      if (!details || !summary || !submenu) {
        console.log(`[Dropdown Fix] Missing elements in menu item ${index + 1}`);
        return;
      }
      
      console.log(`[Dropdown Fix] Setting up menu: ${summary.textContent.trim()}`);
      
      // Force relative positioning on header-menu
      headerMenu.style.position = 'relative';
      
      // Override click behavior
      summary.addEventListener('click', function(e) {
        if (window.innerWidth >= 990) {
          e.preventDefault();
          e.stopPropagation();
          
          if (details.hasAttribute('open')) {
            closeDropdown(details, submenu);
          } else {
            openDropdown(details, submenu);
          }
        }
      });
      
      // Hover enter
      headerMenu.addEventListener('mouseenter', function() {
        console.log('[Dropdown Fix] Mouse enter:', summary.textContent.trim());
        
        if (hoverTimeout) {
          clearTimeout(hoverTimeout);
          hoverTimeout = null;
        }
        
        // Close other dropdowns
        if (currentOpenDropdown && currentOpenDropdown !== details) {
          closeDropdown(currentOpenDropdown, currentOpenDropdown.querySelector('.header__submenu'));
        }
        
        openDropdown(details, submenu);
        currentOpenDropdown = details;
      });
      
      // Hover leave
      headerMenu.addEventListener('mouseleave', function() {
        console.log('[Dropdown Fix] Mouse leave:', summary.textContent.trim());
        
        hoverTimeout = setTimeout(() => {
          closeDropdown(details, submenu);
          if (currentOpenDropdown === details) {
            currentOpenDropdown = null;
          }
        }, 200);
      });
      
      // Keep open when hovering submenu
      if (submenu) {
        submenu.addEventListener('mouseenter', function() {
          if (hoverTimeout) {
            clearTimeout(hoverTimeout);
            hoverTimeout = null;
          }
        });
        
        submenu.addEventListener('mouseleave', function() {
          hoverTimeout = setTimeout(() => {
            closeDropdown(details, submenu);
            if (currentOpenDropdown === details) {
              currentOpenDropdown = null;
            }
          }, 200);
        });
      }
    });
    
    function openDropdown(details, submenu) {
      details.setAttribute('open', '');
      details.classList.add('force-open');
      
      // Force styles to override base.css
      if (submenu) {
        submenu.style.setProperty('opacity', '1', 'important');
        submenu.style.setProperty('visibility', 'visible', 'important');
        submenu.style.setProperty('transform', 'translateY(0)', 'important');
        submenu.style.setProperty('pointer-events', 'auto', 'important');
        submenu.style.setProperty('display', 'block', 'important');
        submenu.style.setProperty('animation', 'none', 'important');
      }
    }
    
    function closeDropdown(details, submenu) {
      details.removeAttribute('open');
      details.classList.remove('force-open');
      
      if (submenu) {
        submenu.style.removeProperty('opacity');
        submenu.style.removeProperty('visibility');
        submenu.style.removeProperty('transform');
        submenu.style.removeProperty('pointer-events');
        submenu.style.removeProperty('display');
        submenu.style.removeProperty('animation');
      }
    }
    
    // Close on outside click
    document.addEventListener('click', function(e) {
      if (currentOpenDropdown && !currentOpenDropdown.contains(e.target)) {
        closeDropdown(currentOpenDropdown, currentOpenDropdown.querySelector('.header__submenu'));
        currentOpenDropdown = null;
      }
    });
    
    // Handle resize
    window.addEventListener('resize', function() {
      if (window.innerWidth < 990 && currentOpenDropdown) {
        closeDropdown(currentOpenDropdown, currentOpenDropdown.querySelector('.header__submenu'));
        currentOpenDropdown = null;
      }
    });
    
    console.log('[Dropdown Fix] Enhancement complete for', menuItems.length, 'menu items');
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDropdownHover);
  } else {
    initDropdownHover();
  }
  
  // Re-initialize on dynamic content changes
  if (window.MutationObserver) {
    const observer = new MutationObserver(function(mutations) {
      let shouldReinit = false;
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i];
            if (node.nodeType === 1 && (node.classList.contains('header__inline-menu') || node.querySelector('.header__inline-menu'))) {
              shouldReinit = true;
              break;
            }
          }
        }
      });
      
      if (shouldReinit) {
        console.log('[Dropdown Fix] DOM change detected, reinitializing');
        setTimeout(initDropdownHover, 100);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
})();
