// Top Navigation Dropdown JavaScript Fix
(function() {
  'use strict';
  
  console.log('🔧 Top Navigation Dropdown Fix Loading...');
  
  function initTopNavDropdowns() {
    // Find all dropdown elements in the top navigation
    const topNav = document.querySelector('.top-nav');
    if (!topNav) {
      console.log('❌ Top navigation not found');
      return;
    }
    
    // Handle main dropdown menus
    const mainDropdowns = topNav.querySelectorAll('header-menu > details');
    console.log(`Found ${mainDropdowns.length} main dropdowns`);
    
    mainDropdowns.forEach((dropdown, index) => {
      const summary = dropdown.querySelector('summary');
      const submenu = dropdown.querySelector('.header__submenu');
      
      if (summary && submenu) {
        console.log(`Initializing main dropdown ${index + 1}: ${summary.textContent.trim()}`);
        
        // Handle click events for main dropdown
        summary.addEventListener('click', (e) => {
          const isOpen = dropdown.hasAttribute('open');
          console.log(`Main dropdown ${summary.textContent.trim()} clicked - ${isOpen ? 'closing' : 'opening'}`);
          
          // Close other main dropdowns
          mainDropdowns.forEach(otherDropdown => {
            if (otherDropdown !== dropdown && otherDropdown.hasAttribute('open')) {
              otherDropdown.removeAttribute('open');
            }
          });
        });
        
        // Desktop hover functionality for main dropdown (skip GTranslate elements)
        if (window.innerWidth >= 990 && !dropdown.closest('.gtranslate_wrapper, .header__gtranslate, [class*="gtranslate"], [id*="gtranslate"]')) {
          dropdown.addEventListener('mouseenter', () => {
            dropdown.setAttribute('open', '');
            console.log(`Hover opened: ${summary.textContent.trim()}`);
          });
          
          dropdown.addEventListener('mouseleave', () => {
            // Small delay to allow moving to submenu
            setTimeout(() => {
              if (!dropdown.matches(':hover')) {
                dropdown.removeAttribute('open');
                console.log(`Hover closed: ${summary.textContent.trim()}`);
              }
            }, 100);
          });
        }
      }
    });
    
    // Handle nested dropdown menus
    const nestedDropdowns = topNav.querySelectorAll('.header__submenu-details');
    console.log(`Found ${nestedDropdowns.length} nested dropdowns`);
    
    nestedDropdowns.forEach((nestedDropdown, index) => {
      const summary = nestedDropdown.querySelector('summary');
      const nestedSubmenu = nestedDropdown.querySelector('.header__submenu--nested');
      
      if (summary && nestedSubmenu) {
        console.log(`Initializing nested dropdown ${index + 1}: ${summary.textContent.trim()}`);
        
        // Handle click events for nested dropdown
        summary.addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent parent dropdown from closing
          const isOpen = nestedDropdown.hasAttribute('open');
          console.log(`Nested dropdown ${summary.textContent.trim()} clicked - ${isOpen ? 'closing' : 'opening'}`);
        });
        
        // Desktop hover functionality for nested dropdown (skip GTranslate elements)
        if (window.innerWidth >= 990 && !nestedDropdown.closest('.gtranslate_wrapper, .header__gtranslate, [class*="gtranslate"], [id*="gtranslate"]')) {
          nestedDropdown.addEventListener('mouseenter', () => {
            nestedDropdown.setAttribute('open', '');
            console.log(`Nested hover opened: ${summary.textContent.trim()}`);
          });
          
          nestedDropdown.addEventListener('mouseleave', () => {
            setTimeout(() => {
              if (!nestedDropdown.matches(':hover')) {
                nestedDropdown.removeAttribute('open');
                console.log(`Nested hover closed: ${summary.textContent.trim()}`);
              }
            }, 100);
          });
        }
      }
    });
    
    // Close all dropdowns when clicking outside (but not on GTranslate)
    document.addEventListener('click', (e) => {
      // Don't interfere with GTranslate dropdowns or their events
      if (e.target.closest('.gtranslate_wrapper, .header__gtranslate, .gt-dropdown, .gt-option, .gt-selector, .gt-current, .gt-option, [class*="gtranslate"], [id*="gtranslate"]')) {
        return;
      }
      
      // Only close navigation dropdowns, not GTranslate
      if (!topNav.contains(e.target)) {
        mainDropdowns.forEach(dropdown => {
          // Extra check to ensure we don't touch GTranslate elements
          if (dropdown.hasAttribute('open') && !dropdown.closest('.gtranslate_wrapper, .header__gtranslate')) {
            dropdown.removeAttribute('open');
          }
        });
        nestedDropdowns.forEach(dropdown => {
          // Extra check to ensure we don't touch GTranslate elements
          if (dropdown.hasAttribute('open') && !dropdown.closest('.gtranslate_wrapper, .header__gtranslate')) {
            dropdown.removeAttribute('open');
          }
        });
      }
    });
    
    // Force visibility for any open dropdowns (only navigation dropdowns, never GTranslate)
    setTimeout(() => {
      const openDropdowns = topNav.querySelectorAll('details[open] .header__submenu, .header__submenu-details[open] .header__submenu--nested');
      openDropdowns.forEach(submenu => {
        // Only apply to navigation dropdowns, never to GTranslate elements
        if (!submenu.closest('.gtranslate_wrapper, .header__gtranslate, [class*="gtranslate"], [id*="gtranslate"]')) {
          submenu.style.opacity = '1';
          submenu.style.visibility = 'visible';
          submenu.style.transform = 'translateY(0)';
          submenu.style.pointerEvents = 'auto';
        }
      });
    }, 100);
  }
  
  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTopNavDropdowns);
  } else {
    initTopNavDropdowns();
  }
  
  // Function to protect GTranslate functionality after navigation changes
  function protectGTranslate() {
    const gtranslateElements = document.querySelectorAll('.gtranslate_wrapper, .header__gtranslate, [class*="gtranslate"], [id*="gtranslate"]');
    gtranslateElements.forEach(element => {
      // Ensure GTranslate elements are not affected by navigation styling
      element.style.cssText = element.style.cssText.replace(/opacity:\s*[^;]+;?/g, '');
      element.style.cssText = element.style.cssText.replace(/visibility:\s*[^;]+;?/g, '');
      element.style.cssText = element.style.cssText.replace(/transform:\s*[^;]+;?/g, '');
      element.style.cssText = element.style.cssText.replace(/pointer-events:\s*[^;]+;?/g, '');
    });
  }
  
  // Re-initialize on Shopify theme editor changes
  document.addEventListener('shopify:section:load', () => {
    initTopNavDropdowns();
    setTimeout(protectGTranslate, 150); // Protect GTranslate after navigation init
  });
  
  // Re-initialize on window resize for mobile/desktop detection
  window.addEventListener('resize', () => {
    initTopNavDropdowns();
    setTimeout(protectGTranslate, 150); // Protect GTranslate after navigation init
  });
  
  // Initial protection for GTranslate
  setTimeout(protectGTranslate, 200);
  
  console.log('✅ Top Navigation Dropdown Fix Loaded with GTranslate Protection');
})();