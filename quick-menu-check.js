/**
 * Quick Menu Verification
 * Paste this in browser console at http://127.0.0.1:9292
 */

console.log('🔍 Quick Menu Check');
console.log('==================');

// Check current menu status
const menuItems = document.querySelectorAll('.header__inline-menu li');
const hasError = document.querySelectorAll('.menu-error-message').length > 0;
const hasTestMenu = Array.from(document.querySelectorAll('*')).some(el => 
  el.textContent && el.textContent.includes('Test Menu')
);

console.log(`Menu items found: ${menuItems.length}`);
console.log(`Has error message: ${hasError}`);
console.log(`Using test menu: ${hasTestMenu}`);

if (hasError) {
  console.log('❌ Issue: Menu not found in Shopify admin');
  console.log('Solution: Create menu in Shopify Admin → Online Store → Navigation');
} else if (hasTestMenu) {
  console.log('⚠️ Issue: Using fallback test menu');
  console.log('Solution: Go to Theme Customization → Header → Select your menu');
} else {
  console.log('✅ Status: Using real menu from Shopify');
}

// List menu items
console.log('\nCurrent Menu Items:');
menuItems.forEach((item, index) => {
  const link = item.querySelector('a, summary');
  const text = link ? link.textContent.trim() : 'No text';
  const hasDropdown = item.querySelector('details') !== null;
  const isTestItem = text.includes('Test Menu');
  
  console.log(`${index + 1}. ${text} ${hasDropdown ? '(dropdown)' : '(link)'} ${isTestItem ? '⚠️' : '✅'}`);
});

// Test NavigationController
if (window.navigationController) {
  console.log('\n🤖 NavigationController Status:');
  try {
    const debug = window.navigationController.debugNavigation();
    console.log(`Detected dropdowns: ${debug.detectedDropdowns}`);
    console.log(`Initialization: ${debug.initialized ? '✅' : '❌'}`);
    
    if (debug.detectedDropdowns === 0) {
      console.log('💡 Try running: window.navigationController.refreshNavigation()');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
} else {
  console.log('❌ NavigationController not found');
}

console.log('\n🚀 For full test, run: fetch("/live-navigation-test.js").then(r=>r.text()).then(eval)');
