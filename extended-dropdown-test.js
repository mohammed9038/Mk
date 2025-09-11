// Updated Dropdown Test - Menu Exists
console.log('🧪 Testing existing dropdown menu...');

// 1. Check if this menu is assigned to the header
console.log('🔍 Checking theme header settings...');

// 2. Look for the menu elements more broadly
const allDetails = document.querySelectorAll('details');
const headerMenus = document.querySelectorAll('header-menu');
const submenus = document.querySelectorAll('.header__submenu');

console.log(`Found ${allDetails.length} details elements total`);
console.log(`Found ${headerMenus.length} header-menu elements`);
console.log(`Found ${submenus.length} submenu elements`);

// 3. Check for any menu-related elements
const menuElements = {
  'details[id*="Menu"]': document.querySelectorAll('details[id*="Menu"]'),
  'details[id*="HeaderMenu"]': document.querySelectorAll('details[id*="HeaderMenu"]'),
  'details[id*="Accessories"]': document.querySelectorAll('details[id*="Accessories"]'),
  '.header__inline-menu': document.querySelectorAll('.header__inline-menu'),
  'nav details': document.querySelectorAll('nav details'),
  '.menu-drawer': document.querySelectorAll('.menu-drawer')
};

Object.entries(menuElements).forEach(([selector, elements]) => {
  if (elements.length > 0) {
    console.log(`✅ Found ${elements.length} elements with selector: ${selector}`);
    elements.forEach((el, i) => {
      console.log(`   ${i + 1}. ID: ${el.id || 'no-id'}, Classes: ${el.className || 'no-classes'}`);
    });
  } else {
    console.log(`❌ No elements found for: ${selector}`);
  }
});

// 4. Check if menu is actually rendered in header
const headerSection = document.querySelector('header, .header, #shopify-section-header');
if (headerSection) {
  console.log('📍 Header section found');
  const headerDetails = headerSection.querySelectorAll('details');
  console.log(`   - Contains ${headerDetails.length} details elements`);
  
  if (headerDetails.length > 0) {
    headerDetails.forEach((detail, i) => {
      const summary = detail.querySelector('summary');
      const submenu = detail.querySelector('.header__submenu, ul, .submenu');
      console.log(`   ${i + 1}. ${detail.id || 'no-id'}: summary=${!!summary}, submenu=${!!submenu}`);
      
      if (summary) {
        console.log(`      Summary text: "${summary.textContent.trim()}"`);
      }
    });
  }
} else {
  console.log('❌ No header section found');
}

// 5. Check theme section settings
console.log('🎯 Checking if menu is assigned to header...');
const headerMenuSelects = document.querySelectorAll('select[name*="menu"], input[name*="menu"]');
console.log(`Found ${headerMenuSelects.length} menu selection inputs`);

// 6. Look for navigation elements by text content
const accessoriesElements = Array.from(document.querySelectorAll('*')).filter(el => 
  el.textContent && el.textContent.toLowerCase().includes('accessories') && 
  el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE'
);

console.log(`🔍 Found ${accessoriesElements.length} elements containing "accessories":`);
accessoriesElements.forEach((el, i) => {
  console.log(`   ${i + 1}. ${el.tagName} - "${el.textContent.trim().slice(0, 50)}..."`);
  console.log(`      Parent: ${el.parentElement?.tagName || 'none'}`);
});

// 7. Force navigation re-initialization
if (window.navigationController) {
  console.log('🔄 Forcing navigation re-initialization...');
  try {
    window.navigationController.initDropdowns();
    console.log('✅ Re-initialization complete');
  } catch (e) {
    console.log('❌ Re-initialization failed:', e.message);
  }
}

console.log('🏁 Extended dropdown test complete.');
