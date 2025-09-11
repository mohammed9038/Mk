document.addEventListener('DOMContentLoaded', function() {
  // Get all dropdown hover elements
  const dropdownHovers = document.querySelectorAll('[dropdown-hover]');
  
  dropdownHovers.forEach(function(dropdown) {
    const menu = dropdown.querySelector('[dropdown-hover] menu, [dropdown-hover] .menu, [dropdown-hover] ul');
    
    // Check if menu exists before adding event listeners
    if (!menu) {
      console.warn('No menu found for dropdown:', dropdown);
      return;
    }
    
    // Add click event for mobile/touch devices
    dropdown.addEventListener('click', function(e) {
      e.stopPropagation();
      
      // Close other open dropdowns
      dropdownHovers.forEach(function(otherDropdown) {
        if (otherDropdown !== dropdown) {
          const otherMenu = otherDropdown.querySelector('[dropdown-hover] menu, [dropdown-hover] .menu, [dropdown-hover] ul');
          if (otherMenu && otherMenu.classList) {
            otherMenu.classList.remove('open', 'active');
          }
        }
      });
      
      // Toggle current dropdown
      if (menu.classList) {
        menu.classList.toggle('open');
        menu.classList.toggle('active');
      }
    });
    
    // Handle hover for desktop
    dropdown.addEventListener('mouseenter', function() {
      if (window.innerWidth > 768 && menu.classList) {
        menu.classList.add('open');
      }
    });
    
    dropdown.addEventListener('mouseleave', function() {
      if (window.innerWidth > 768 && menu.classList) {
        menu.classList.remove('open');
      }
    });
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('[dropdown-hover]')) {
      dropdownHovers.forEach(function(dropdown) {
        const menu = dropdown.querySelector('[dropdown-hover] menu, [dropdown-hover] .menu, [dropdown-hover] ul');
        if (menu && menu.classList) {
          menu.classList.remove('open', 'active');
        }
      });
    }
  });

  // Initialize GTranslate drawer for language selector
  function initGTranslate() {
    const drawer = document.querySelector('.gtranslate-drawer');
    const trigger = document.querySelector('.gtranslate-trigger, [data-gtranslate-trigger]');
    
    if (!drawer || !trigger) {
      console.warn('GTranslate elements not found');
      return;
    }
    
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      if (drawer.classList) {
        drawer.classList.toggle('active');
        drawer.classList.toggle('open');
      }
    });
    
    // Close drawer when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.gtranslate-drawer') && !e.target.closest('.gtranslate-trigger')) {
        if (drawer.classList) {
          drawer.classList.remove('active', 'open');
        }
      }
    });
  }
  
  // Wait for GTranslate to load
  if (typeof gtranslateSettings !== 'undefined') {
    initGTranslate();
  } else {
    // Retry after a delay if GTranslate hasn't loaded yet
    setTimeout(initGTranslate, 1000);
  }
});
