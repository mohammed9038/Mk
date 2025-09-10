// Desktop Navigation Dropdown Enhancement
document.addEventListener('DOMContentLoaded', function() {
  if (window.innerWidth >= 990) {
    const menuItems = document.querySelectorAll('.header__inline-menu header-menu');
    
    menuItems.forEach(function(menuItem) {
      const details = menuItem.querySelector('details');
      const submenu = menuItem.querySelector('.header__submenu');
      const summary = menuItem.querySelector('summary');
      
      if (details && submenu && summary) {
        let hoverTimeout;
        let isHovering = false;
        
        // Function to open dropdown
        function openDropdown() {
          // Close other dropdowns first
          document.querySelectorAll('.header__inline-menu details[open]').forEach(function(openDetails) {
            if (openDetails !== details) {
              openDetails.removeAttribute('open');
            }
          });
          
          // Open this dropdown
          details.setAttribute('open', '');
        }
        
        // Function to close dropdown
        function closeDropdown() {
          if (!isHovering) {
            details.removeAttribute('open');
          }
        }
        
        // Mouse enter on menu item
        menuItem.addEventListener('mouseenter', function() {
          isHovering = true;
          clearTimeout(hoverTimeout);
          openDropdown();
        });
        
        // Mouse leave from menu item
        menuItem.addEventListener('mouseleave', function() {
          isHovering = false;
          hoverTimeout = setTimeout(closeDropdown, 200);
        });
        
        // Keep dropdown open when hovering over submenu
        submenu.addEventListener('mouseenter', function() {
          isHovering = true;
          clearTimeout(hoverTimeout);
        });
        
        submenu.addEventListener('mouseleave', function() {
          isHovering = false;
          hoverTimeout = setTimeout(closeDropdown, 200);
        });
        
        // Prevent default click behavior on summary for hover interaction
        summary.addEventListener('click', function(e) {
          e.preventDefault();
          
          if (details.hasAttribute('open')) {
            details.removeAttribute('open');
          } else {
            openDropdown();
          }
        });
        
        // Handle keyboard navigation
        summary.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (details.hasAttribute('open')) {
              details.removeAttribute('open');
            } else {
              openDropdown();
            }
          }
          
          if (e.key === 'Escape') {
            details.removeAttribute('open');
            summary.focus();
          }
        });
      }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.header__inline-menu')) {
        document.querySelectorAll('.header__inline-menu details[open]').forEach(function(details) {
          details.removeAttribute('open');
        });
      }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
      if (window.innerWidth < 990) {
        document.querySelectorAll('.header__inline-menu details[open]').forEach(function(details) {
          details.removeAttribute('open');
        });
      }
    });
  }
});
