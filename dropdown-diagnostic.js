// Dropdown Diagnostic Script - Run in browser console
(function() {
  console.log('=== DROPDOWN DIAGNOSTIC REPORT ===');
  
  // Check if navigation exists
  const nav = document.querySelector('.header__inline-menu');
  console.log('1. Navigation found:', !!nav);
  if (nav) {
    console.log('   Navigation HTML:', nav.outerHTML.substring(0, 200) + '...');
  }
  
  // Check for menu items
  const menuItems = document.querySelectorAll('.header__inline-menu header-menu');
  console.log('2. Menu items found:', menuItems.length);
  
  // Check each menu item
  menuItems.forEach((item, index) => {
    const details = item.querySelector('details');
    const summary = item.querySelector('summary');
    const submenu = item.querySelector('.header__submenu');
    
    console.log(`3.${index + 1} Menu "${summary ? summary.textContent.trim() : 'No summary'}":`, {
      hasDetails: !!details,
      hasSummary: !!summary,
      hasSubmenu: !!submenu,
      detailsOpen: details ? details.hasAttribute('open') : false
    });
    
    if (submenu) {
      const styles = window.getComputedStyle(submenu);
      console.log(`   Submenu styles:`, {
        opacity: styles.opacity,
        visibility: styles.visibility,
        transform: styles.transform,
        position: styles.position,
        display: styles.display
      });
    }
  });
  
  // Check for conflicting CSS rules
  const testElement = document.createElement('div');
  testElement.className = 'js';
  testElement.innerHTML = '<details><div class="header__submenu">Test</div></details>';
  document.body.appendChild(testElement);
  
  const testSubmenu = testElement.querySelector('.header__submenu');
  const testStyles = window.getComputedStyle(testSubmenu);
  console.log('4. Base CSS rule test (.js details > .header__submenu):', {
    opacity: testStyles.opacity,
    transform: testStyles.transform
  });
  
  document.body.removeChild(testElement);
  
  // Check for our fix classes
  console.log('5. Fix indicators:', {
    hasDropdownHoverClass: document.body.classList.contains('dropdown-hover-enabled'),
    jsClass: document.documentElement.classList.contains('js') || document.body.classList.contains('js')
  });
  
  // Check viewport
  console.log('6. Viewport:', {
    width: window.innerWidth,
    isDesktop: window.innerWidth >= 990
  });
  
  // Test hover functionality
  if (menuItems.length > 0) {
    const firstMenuItem = menuItems[0];
    const firstDetails = firstMenuItem.querySelector('details');
    const firstSubmenu = firstMenuItem.querySelector('.header__submenu');
    
    if (firstDetails && firstSubmenu) {
      console.log('7. Testing hover on first menu item...');
      
      // Simulate hover
      firstDetails.setAttribute('open', '');
      firstDetails.classList.add('force-open');
      
      setTimeout(() => {
        const hoverStyles = window.getComputedStyle(firstSubmenu);
        console.log('   Styles after opening:', {
          opacity: hoverStyles.opacity,
          visibility: hoverStyles.visibility,
          transform: hoverStyles.transform
        });
        
        // Clean up
        firstDetails.removeAttribute('open');
        firstDetails.classList.remove('force-open');
      }, 100);
    }
  }
  
  console.log('=== END DIAGNOSTIC REPORT ===');
})();
