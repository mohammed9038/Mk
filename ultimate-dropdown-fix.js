// Ultimate Dropdown Fix - Direct DOM Manipulation
console.log('🔧 ULTIMATE DROPDOWN FIX - Finding and forcing dropdown to work...');

// Find ALL possible dropdown structures
const allDetails = document.querySelectorAll('details');
console.log(`Found ${allDetails.length} details elements total`);

let accessoriesDropdown = null;

allDetails.forEach((detail, index) => {
  const summary = detail.querySelector('summary');
  const summaryText = summary ? summary.textContent.trim() : '';
  
  console.log(`Details ${index + 1}: "${summaryText}" - Classes: ${detail.className}`);
  
  if (summaryText.toLowerCase().includes('accessories')) {
    accessoriesDropdown = detail;
    console.log(`✅ FOUND Accessories dropdown: ${detail.className}`);
  }
});

if (accessoriesDropdown) {
  console.log('🎯 Working with Accessories dropdown...');
  
  // Find all child elements that could be the submenu
  const allChildren = accessoriesDropdown.querySelectorAll('*');
  console.log(`Dropdown has ${allChildren.length} child elements`);
  
  allChildren.forEach((child, i) => {
    console.log(`  ${i + 1}. ${child.tagName} - Classes: ${child.className}`);
  });
  
  // Find the submenu element (could have any class)
  const possibleSubmenus = accessoriesDropdown.querySelectorAll('ul, div, nav, *[class*="menu"], *[class*="submenu"], *[class*="dropdown"]');
  
  console.log(`Found ${possibleSubmenus.length} possible submenu elements`);
  
  possibleSubmenus.forEach((submenu, i) => {
    console.log(`  Submenu ${i + 1}: ${submenu.tagName}.${submenu.className}`);
    
    // Force this element to be visible with maximum CSS power
    submenu.style.cssText = `
      display: block !important;
      position: absolute !important;
      top: 100% !important;
      left: 0 !important;
      opacity: 1 !important;
      visibility: visible !important;
      transform: translateY(0) !important;
      pointer-events: auto !important;
      z-index: 9999 !important;
      background: white !important;
      border: 3px solid red !important;
      min-width: 200px !important;
      max-width: 300px !important;
      padding: 10px !important;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important;
      color: black !important;
      font-size: 14px !important;
    `;
    
    console.log(`🔧 Applied nuclear CSS to submenu ${i + 1}`);
  });
  
  // Open the dropdown
  accessoriesDropdown.setAttribute('open', '');
  accessoriesDropdown.open = true;
  
  // Also add a click handler to make it work permanently
  const summary = accessoriesDropdown.querySelector('summary');
  if (summary) {
    summary.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Toggle open
      if (accessoriesDropdown.hasAttribute('open')) {
        accessoriesDropdown.removeAttribute('open');
        console.log('❌ Closed dropdown');
      } else {
        accessoriesDropdown.setAttribute('open', '');
        
        // Re-apply styles to all possible submenus
        possibleSubmenus.forEach(submenu => {
          submenu.style.cssText = `
            display: block !important;
            position: absolute !important;
            top: 100% !important;
            left: 0 !important;
            opacity: 1 !important;
            visibility: visible !important;
            transform: translateY(0) !important;
            pointer-events: auto !important;
            z-index: 9999 !important;
            background: white !important;
            border: 3px solid red !important;
            min-width: 200px !important;
            padding: 10px !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important;
            color: black !important;
          `;
        });
        
        console.log('✅ Opened dropdown with forced styles');
      }
    });
    
    console.log('🎯 Added permanent click handler');
  }
  
  console.log('🎉 DROPDOWN SHOULD NOW BE VISIBLE WITH RED BORDER!');
  console.log('👆 Click on "Accessories" to test the toggle functionality');
  
} else {
  console.log('❌ Could not find Accessories dropdown');
  
  // Show all text content to help debug
  console.log('All text content on page containing "accessories":');
  const allElements = document.querySelectorAll('*');
  allElements.forEach(el => {
    if (el.textContent && el.textContent.toLowerCase().includes('accessories') && 
        el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE') {
      console.log(`  ${el.tagName}.${el.className}: "${el.textContent.trim().slice(0, 50)}"`);
    }
  });
}

console.log('🏁 Ultimate fix complete!');
