// Nested Dropdown Test Script
console.log('🧪 Testing Nested Dropdown Structure...');

function testNestedDropdowns() {
  const topNav = document.querySelector('.top-nav');
  if (!topNav) {
    console.log('❌ Top navigation not found');
    return;
  }
  
  console.log('✅ Top navigation found');
  
  // Test main dropdowns
  const mainDropdowns = topNav.querySelectorAll('header-menu > details');
  console.log(`📊 Main dropdowns found: ${mainDropdowns.length}`);
  
  mainDropdowns.forEach((dropdown, index) => {
    const summary = dropdown.querySelector('summary');
    const submenu = dropdown.querySelector('.header__submenu');
    console.log(`  ${index + 1}. "${summary?.textContent.trim()}" - Submenu: ${submenu ? '✅' : '❌'}`);
    
    // Check for nested dropdowns within this main dropdown
    const nestedDropdowns = dropdown.querySelectorAll('.header__submenu-details');
    console.log(`     Nested dropdowns: ${nestedDropdowns.length}`);
    
    nestedDropdowns.forEach((nested, nestedIndex) => {
      const nestedSummary = nested.querySelector('summary');
      const nestedSubmenu = nested.querySelector('.header__submenu--nested');
      console.log(`     ${nestedIndex + 1}. "${nestedSummary?.textContent.trim()}" - Nested submenu: ${nestedSubmenu ? '✅' : '❌'}`);
    });
  });
  
  // Test clicking Electronics dropdown
  const electronicsDropdown = Array.from(mainDropdowns).find(dropdown => {
    const summary = dropdown.querySelector('summary');
    return summary?.textContent.trim().toLowerCase().includes('electronics');
  });
  
  if (electronicsDropdown) {
    console.log('🎯 Found Electronics dropdown - testing...');
    electronicsDropdown.setAttribute('open', '');
    
    setTimeout(() => {
      const wearablesDropdown = electronicsDropdown.querySelector('.header__submenu-details');
      if (wearablesDropdown) {
        console.log('🎯 Found Wearables nested dropdown - testing...');
        wearablesDropdown.setAttribute('open', '');
        
        setTimeout(() => {
          console.log('✅ Nested dropdown test complete');
        }, 500);
      }
    }, 500);
  }
}

// Run test when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', testNestedDropdowns);
} else {
  testNestedDropdowns();
}

console.log('📝 To test manually:');
console.log('1. Look for Electronics menu item');
console.log('2. Click or hover to open');
console.log('3. Look for Wearables submenu');
console.log('4. Click or hover Wearables to see nested items');
