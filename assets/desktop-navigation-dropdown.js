// Desktop Navigation Dropdown Enhancement
document.addEventListener('DOMContentLoaded', function() {
  if (window.innerWidth >= 990) {
    const menuItems = document.querySelectorAll('.header__inline-menu header-menu');
    
    menuItems.forEach(function(menuItem) {
      const details = menuItem.querySelector('details');
      const submenu = menuItem.querySelector('.header__submenu');
      
      if (details && submenu) {
        let hoverTimeout;
        
        // Mouse enter - show dropdown
        menuItem.addEventListener('mouseenter', function() {
          clearTimeout(hoverTimeout);
          
          // Close other open dropdowns first
          document.querySelectorAll('.header__inline-menu details[open]').forEach(function(openDetails) {
            if (openDetails !== details) {
              openDetails.removeAttribute('open');
            }
          });
          
          // Open this dropdown
          details.setAttribute('open', '');
          submenu.style.display = 'block';
        });
        
        // Mouse leave - hide dropdown with delay
        menuItem.addEventListener('mouseleave', function() {
          hoverTimeout = setTimeout(function() {
            details.removeAttribute('open');
            submenu.style.display = '';
          }, 150); // Small delay to prevent flickering
        });
        
        // Keep dropdown open when hovering over submenu
        submenu.addEventListener('mouseenter', function() {
          clearTimeout(hoverTimeout);
        });
        
        submenu.addEventListener('mouseleave', function() {
          hoverTimeout = setTimeout(function() {
            details.removeAttribute('open');
            submenu.style.display = '';
          }, 150);
        });
        
        // Handle keyboard navigation
        details.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (details.hasAttribute('open')) {
              details.removeAttribute('open');
            } else {
              details.setAttribute('open', '');
            }
          }
          
          if (e.key === 'Escape') {
            details.removeAttribute('open');
            details.querySelector('summary').focus();
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
