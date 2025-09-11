// Quick Dropdown Test Script
// Copy and paste this into your browser console

console.log('🧪 Testing dropdown functionality...');

// 1. Find dropdown elements
const dropdowns = document.querySelectorAll('details[id^="Details-HeaderMenu-"]');
console.log(`Found ${dropdowns.length} dropdown elements:`, dropdowns);

// 2. Test if dropdowns have proper structure
dropdowns.forEach((dropdown, index) => {
  const summary = dropdown.querySelector('summary');
  const submenu = dropdown.querySelector('.header__submenu');
  const headerMenu = dropdown.closest('header-menu');
  
  console.log(`Dropdown ${index + 1} (${dropdown.id}):`);
  console.log('  - Summary:', !!summary);
  console.log('  - Submenu:', !!submenu);
  console.log('  - Header-menu wrapper:', !!headerMenu);
  
  if (submenu) {
    const styles = window.getComputedStyle(submenu);
    console.log('  - Current CSS:', {
      opacity: styles.opacity,
      visibility: styles.visibility,
      transform: styles.transform,
      position: styles.position
    });
  }
});

// 3. Test opening the first dropdown
if (dropdowns.length > 0) {
  const firstDropdown = dropdowns[0];
  console.log('🔄 Testing first dropdown...');
  
  // Try to open it
  firstDropdown.setAttribute('open', '');
  
  setTimeout(() => {
    const submenu = firstDropdown.querySelector('.header__submenu');
    if (submenu) {
      const styles = window.getComputedStyle(submenu);
      console.log('After opening:', {
        hasOpenAttribute: firstDropdown.hasAttribute('open'),
        opacity: styles.opacity,
        visibility: styles.visibility,
        transform: styles.transform
      });
      
      if (styles.opacity === '1' && styles.visibility === 'visible') {
        console.log('✅ Dropdown is working correctly!');
      } else {
        console.log('❌ Dropdown not visible - CSS issue detected');
        
        // Force visibility for testing
        submenu.style.opacity = '1';
        submenu.style.visibility = 'visible';
        submenu.style.transform = 'translateY(0)';
        submenu.style.background = 'yellow';
        submenu.style.border = '2px solid red';
        console.log('🔧 Forced dropdown visible with debug styling');
      }
    }
    
    // Close it after 3 seconds
    setTimeout(() => {
      firstDropdown.removeAttribute('open');
      console.log('🔄 Closed test dropdown');
    }, 3000);
  }, 200);
}

// 4. Test NavigationController methods
if (window.navigationController) {
  console.log('🎯 NavigationController status:');
  try {
    const debugInfo = window.navigationController.getDebugInfo();
    console.log('Debug info:', debugInfo);
  } catch (e) {
    console.log('Debug info not available:', e.message);
  }
}

console.log('🏁 Dropdown test complete. Check results above.');
