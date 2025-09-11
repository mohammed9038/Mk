/**
 * Navigation Dropdown JavaScript Fix
 * Ensures dropdown functionality works reliably
 */

(function() {
  'use strict';
  
  console.log('[Dropdown Fix] Initializing navigation dropdown fix...');
  
  // Wait for DOM and NavigationController to be ready
  function initDropdownFix() {
    // Find all dropdown elements
    const dropdowns = document.querySelectorAll('header-menu details[id^="Details-HeaderMenu-"]');
    console.log(`[Dropdown Fix] Found ${dropdowns.length} dropdown elements`);
    
    if (dropdowns.length === 0) {
      console.warn('[Dropdown Fix] No dropdown elements found. Retrying in 1 second...');
      setTimeout(initDropdownFix, 1000);
      return;
    }
    
    dropdowns.forEach((dropdown, index) => {
      const summary = dropdown.querySelector('summary');
      const submenu = dropdown.querySelector('.header__submenu');
      
      if (!summary || !submenu) {
        console.warn(`[Dropdown Fix] Dropdown ${index + 1} missing components:`, {
          summary: !!summary,
          submenu: !!submenu
        });
        return;
      }
      
      // Ensure proper structure
      dropdown.setAttribute('data-dropdown-fixed', 'true');
      
      // Add click handler that ensures dropdown opens
      summary.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isOpen = dropdown.hasAttribute('open');
        
        // Close all other dropdowns first
        dropdowns.forEach(otherDropdown => {
          if (otherDropdown !== dropdown && otherDropdown.hasAttribute('open')) {
            otherDropdown.removeAttribute('open');
            otherDropdown.querySelector('summary').setAttribute('aria-expanded', 'false');
          }
        });
        
        // Toggle this dropdown
        if (isOpen) {
          dropdown.removeAttribute('open');
          summary.setAttribute('aria-expanded', 'false');
          console.log(`[Dropdown Fix] Closed dropdown ${index + 1}`);
        } else {
          dropdown.setAttribute('open', '');
          summary.setAttribute('aria-expanded', 'true');
          console.log(`[Dropdown Fix] Opened dropdown ${index + 1}`);
          
          // Force visibility for testing
          submenu.style.opacity = '1';
          submenu.style.visibility = 'visible';
          submenu.style.transform = 'translateY(0)';
          submenu.style.pointerEvents = 'auto';
        }
      });
      
      // Add hover functionality for desktop
      if (window.innerWidth >= 990) {
        const headerMenu = dropdown.closest('header-menu');
        if (headerMenu) {
          headerMenu.addEventListener('mouseenter', function() {
            if (!dropdown.hasAttribute('open')) {
              dropdown.setAttribute('open', '');
              summary.setAttribute('aria-expanded', 'true');
              
              // Force visibility
              submenu.style.opacity = '1';
              submenu.style.visibility = 'visible';
              submenu.style.transform = 'translateY(0)';
              submenu.style.pointerEvents = 'auto';
            }
          });
          
          headerMenu.addEventListener('mouseleave', function() {
            setTimeout(() => {
              if (!headerMenu.matches(':hover')) {
                dropdown.removeAttribute('open');
                summary.setAttribute('aria-expanded', 'false');
                
                // Reset styles to let CSS take over
                submenu.style.opacity = '';
                submenu.style.visibility = '';
                submenu.style.transform = '';
                submenu.style.pointerEvents = '';
              }
            }, 100);
          });
        }
      }
      
      console.log(`[Dropdown Fix] Fixed dropdown ${index + 1}: ${dropdown.id}`);
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('header-menu')) {
        dropdowns.forEach(dropdown => {
          if (dropdown.hasAttribute('open')) {
            dropdown.removeAttribute('open');
            dropdown.querySelector('summary').setAttribute('aria-expanded', 'false');
          }
        });
      }
    });
    
    console.log('[Dropdown Fix] Navigation dropdown fix complete');
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDropdownFix);
  } else {
    initDropdownFix();
  }
  
  // Also initialize after a delay to catch dynamically loaded content
  setTimeout(initDropdownFix, 2000);
  
})();
