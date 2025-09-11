// Top Navigation Dropdown JavaScript Fix
(function() {
  'use strict';
  
  console.log('🔧 Top Navigation Dropdown Fix Loading...');
  
// Top Navigation Dropdown JavaScript Fix - COMPREHENSIVE
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
    
    const dropdowns = topNav.querySelectorAll('details, header-menu details');
    console.log(`Found ${dropdowns.length} top nav dropdowns`);
    
    dropdowns.forEach((dropdown, index) => {
      const summary = dropdown.querySelector('summary');
      const submenu = dropdown.querySelector('.header__submenu, ul.list-menu, .pro-nav-submenu');
      
      if (summary && submenu) {
        console.log(`Initializing dropdown ${index + 1}: ${summary.textContent.trim()}`);
        
        // Ensure submenu has proper positioning
        submenu.style.position = 'absolute';
        submenu.style.top = '100%';
        submenu.style.left = '0';
        submenu.style.zIndex = '1000';
        
        // Handle click events
        summary.addEventListener('click', (e) => {
          const isOpen = dropdown.hasAttribute('open');
          console.log(`${summary.textContent.trim()} clicked - ${isOpen ? 'closing' : 'opening'}`);
          
          // Close other dropdowns
          dropdowns.forEach(otherDropdown => {
            if (otherDropdown !== dropdown && otherDropdown.hasAttribute('open')) {
              otherDropdown.removeAttribute('open');
            }
          });
        });
        
        // Desktop hover functionality
        if (window.innerWidth >= 990) {
          dropdown.addEventListener('mouseenter', () => {
            dropdown.setAttribute('open', '');
            console.log(`Hover opened: ${summary.textContent.trim()}`);
          });
          
          dropdown.addEventListener('mouseleave', () => {
            dropdown.removeAttribute('open');
            console.log(`Hover closed: ${summary.textContent.trim()}`);
          });
        }
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
          if (!dropdown.contains(e.target) && dropdown.hasAttribute('open')) {
            dropdown.removeAttribute('open');
            console.log(`Outside click closed: ${summary.textContent.trim()}`);
          }
        });
      }
    });
    
    // Force visibility for any open dropdowns
    setTimeout(() => {
      const openDropdowns = topNav.querySelectorAll('details[open] .header__submenu');
      openDropdowns.forEach(submenu => {
        submenu.style.opacity = '1';
        submenu.style.visibility = 'visible';
        submenu.style.transform = 'translateY(0)';
        submenu.style.pointerEvents = 'auto';
      });
    }, 100);
  }
  
  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTopNavDropdowns);
  } else {
    initTopNavDropdowns();
  }
  
  // Re-initialize on Shopify theme editor changes
  document.addEventListener('shopify:section:load', initTopNavDropdowns);
  
  // Re-initialize on window resize for mobile/desktop detection
  window.addEventListener('resize', initTopNavDropdowns);
  
  console.log('✅ Top Navigation Dropdown Fix Loaded');
})();