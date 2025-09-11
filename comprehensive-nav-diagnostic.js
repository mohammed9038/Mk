/**
 * Comprehensive Top Navigation Dropdown Diagnostic
 * This will identify exactly why dropdowns aren't working
 */

console.log('🔍 Comprehensive Top Navigation Diagnostic');
console.log('==========================================');

// 1. Check if top navigation exists
const topNavWrapper = document.querySelector('.top-nav-wrapper');
const topNav = document.querySelector('.top-nav');

console.log('\n📍 TOP NAVIGATION STRUCTURE:');
console.log('Top nav wrapper exists:', !!topNavWrapper);
console.log('Top nav exists:', !!topNav);

if (topNav) {
  const menuItems = topNav.querySelectorAll('.top-nav__item');
  console.log(`Found ${menuItems.length} top nav items`);
  
  menuItems.forEach((item, index) => {
    const link = item.querySelector('.top-nav__link');
    const headerMenu = item.querySelector('header-menu');
    const details = item.querySelector('details');
    const summary = item.querySelector('summary');
    const submenu = item.querySelector('.header__submenu');
    const caret = item.querySelector('.icon-caret');
    
    console.log(`\n📋 Menu Item ${index + 1}:`);
    console.log(`  Text: "${link ? link.textContent.trim() : 'N/A'}"`);
    console.log(`  Has header-menu: ${!!headerMenu}`);
    console.log(`  Has details: ${!!details}`);
    console.log(`  Has summary: ${!!summary}`);
    console.log(`  Has submenu: ${!!submenu}`);
    console.log(`  Has caret icon: ${!!caret}`);
    
    if (details) {
      console.log(`  Details ID: ${details.id || 'no-id'}`);
      console.log(`  Is open: ${details.hasAttribute('open')}`);
    }
    
    if (submenu) {
      const subItems = submenu.querySelectorAll('li');
      console.log(`  Submenu items: ${subItems.length}`);
      subItems.forEach((subItem, subIndex) => {
        const subLink = subItem.querySelector('a');
        console.log(`    ${subIndex + 1}. "${subLink ? subLink.textContent.trim() : 'N/A'}"`);
      });
      
      // Check CSS
      const styles = window.getComputedStyle(submenu);
      console.log(`  Submenu CSS:`);
      console.log(`    opacity: ${styles.opacity}`);
      console.log(`    visibility: ${styles.visibility}`);
      console.log(`    position: ${styles.position}`);
      console.log(`    display: ${styles.display}`);
    }
  });
} else {
  console.log('❌ Top navigation not found in DOM');
}

// 2. Check if CSS files are loaded
console.log('\n🎨 CSS FILES CHECK:');
const stylesheets = Array.from(document.styleSheets);
let foundTopNavCSS = false;
let foundNavProfessionalCSS = false;
let foundDropdownFixCSS = false;

stylesheets.forEach(sheet => {
  try {
    if (sheet.href) {
      if (sheet.href.includes('top-nav-dropdown.css')) {
        foundTopNavCSS = true;
        console.log('✅ top-nav-dropdown.css loaded');
      }
      if (sheet.href.includes('navigation-professional.css')) {
        foundNavProfessionalCSS = true;
        console.log('✅ navigation-professional.css loaded');
      }
      if (sheet.href.includes('navigation-dropdown-fix.css')) {
        foundDropdownFixCSS = true;
        console.log('✅ navigation-dropdown-fix.css loaded');
      }
    }
  } catch (e) {
    // Cross-origin issues
  }
});

console.log(`Top nav CSS loaded: ${foundTopNavCSS}`);
console.log(`Navigation professional CSS loaded: ${foundNavProfessionalCSS}`);
console.log(`Dropdown fix CSS loaded: ${foundDropdownFixCSS}`);

// 3. Check for JavaScript errors
console.log('\n⚡ JAVASCRIPT CHECK:');
console.log('NavigationController exists:', typeof NavigationController !== 'undefined');
console.log('NavigationController instance:', !!window.navigationController);

if (window.navigationController) {
  console.log('NavigationController initialized:', window.navigationController.initialized);
  console.log('Active dropdowns:', window.navigationController.state?.activeDropdowns?.size || 0);
}

// 4. Manual dropdown test
const accessoriesDropdown = Array.from(document.querySelectorAll('details')).find(d => {
  const summary = d.querySelector('summary');
  return summary && summary.textContent.toLowerCase().includes('accessories');
});

console.log('\n🧪 MANUAL TEST:');
if (accessoriesDropdown) {
  console.log('✅ Found Accessories dropdown element');
  console.log('Element:', accessoriesDropdown);
  
  // Test opening
  console.log('🔄 Testing dropdown open...');
  accessoriesDropdown.setAttribute('open', '');
  
  setTimeout(() => {
    const submenu = accessoriesDropdown.querySelector('.header__submenu');
    if (submenu) {
      const styles = window.getComputedStyle(submenu);
      console.log('After opening:');
      console.log(`  opacity: ${styles.opacity}`);
      console.log(`  visibility: ${styles.visibility}`);
      console.log(`  transform: ${styles.transform}`);
      
      if (styles.opacity === '1' && styles.visibility === 'visible') {
        console.log('🎉 DROPDOWN IS WORKING!');
      } else {
        console.log('❌ Dropdown not visible - CSS issue');
        
        // Force visibility
        submenu.style.opacity = '1';
        submenu.style.visibility = 'visible';
        submenu.style.transform = 'translateY(0)';
        submenu.style.background = 'yellow';
        submenu.style.border = '2px solid red';
        submenu.style.zIndex = '9999';
        console.log('🔧 FORCED dropdown visible with debug styles');
      }
    }
  }, 300);
} else {
  console.log('❌ Accessories dropdown not found');
  
  // Show all details elements
  const allDetails = document.querySelectorAll('details');
  console.log(`Found ${allDetails.length} details elements total:`);
  allDetails.forEach((detail, i) => {
    const summary = detail.querySelector('summary');
    console.log(`  ${i + 1}. ${detail.id || 'no-id'} - "${summary ? summary.textContent.trim() : 'no-summary'}"`);
  });
}

console.log('\n🏁 Diagnostic complete. Check results above.');

// 5. Quick fix attempt
setTimeout(() => {
  console.log('\n🔧 ATTEMPTING QUICK FIX...');
  
  // Force all dropdowns to work
  const allTopNavDropdowns = document.querySelectorAll('.top-nav details');
  allTopNavDropdowns.forEach((dropdown, index) => {
    const summary = dropdown.querySelector('summary');
    const submenu = dropdown.querySelector('.header__submenu');
    
    if (summary && submenu) {
      // Add click handler
      summary.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Close others
        allTopNavDropdowns.forEach(other => {
          if (other !== dropdown) other.removeAttribute('open');
        });
        
        // Toggle this one
        if (dropdown.hasAttribute('open')) {
          dropdown.removeAttribute('open');
        } else {
          dropdown.setAttribute('open', '');
          
          // Force visibility
          submenu.style.opacity = '1';
          submenu.style.visibility = 'visible';
          submenu.style.transform = 'translateY(0)';
        }
      });
      
      console.log(`✅ Added fix for dropdown ${index + 1}: "${summary.textContent.trim()}"`);
    }
  });
  
  if (allTopNavDropdowns.length > 0) {
    console.log('🎯 Quick fix applied! Try clicking the menu items now.');
  }
}, 1000);
