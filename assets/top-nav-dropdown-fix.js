// Top Navigation Dropdown JavaScript Fix
(function() {
  'use strict';
  
  console.log('🔧 Top Navigation Dropdown Fix Loading...');
  
  function initTopNavDropdowns() {
    // Find all dropdown elements with the pro-nav-submenu class
    const dropdowns = document.querySelectorAll('details.pro-nav-submenu');
    console.log(`Found ${dropdowns.length} top nav dropdowns`);
    
    dropdowns.forEach((dropdown, index) => {
      const summary = dropdown.querySelector('summary');
      const submenu = dropdown.querySelector('ul, .dropdown-menu, div');
      
      if (summary && submenu) {
        console.log(`Initializing dropdown ${index + 1}: ${summary.textContent.trim()}`);
        
        // Ensure submenu has proper structure
        if (!submenu.style.position) {
          submenu.style.position = 'absolute';
        }
        
        // Add arrow icon if not present
        if (!summary.querySelector('.dropdown-arrow') && !summary.querySelector('svg')) {
          const arrow = document.createElement('span');
          arrow.className = 'dropdown-arrow';
          arrow.innerHTML = '▼';
          arrow.style.fontSize = '0.7em';
          arrow.style.marginLeft = '4px';
          summary.appendChild(arrow);
        }
        
        // Handle click to toggle
        summary.addEventListener('click', (e) => {
          e.preventDefault();
          const isOpen = dropdown.hasAttribute('open');
          console.log(`${summary.textContent.trim()} clicked - ${isOpen ? 'closing' : 'opening'}`);
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
          if (!dropdown.contains(e.target) && dropdown.hasAttribute('open')) {
            dropdown.removeAttribute('open');
          }
        });
        
        // Hover support for desktop
        if (window.innerWidth >= 990) {
          dropdown.addEventListener('mouseenter', () => {
            dropdown.setAttribute('open', '');
          });
          
          dropdown.addEventListener('mouseleave', () => {
            dropdown.removeAttribute('open');
          });
        }
      }
    });
  }
  
  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTopNavDropdowns);
  } else {
    initTopNavDropdowns();
  }
  
  // Re-initialize on Shopify theme editor changes
  document.addEventListener('shopify:section:load', initTopNavDropdowns);
  
  console.log('✅ Top Navigation Dropdown Fix Loaded');
})();