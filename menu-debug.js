/**
 * Debug script to test the currently selected menu and navigation elements
 * Run this in the browser console to diagnose menu selection issues
 */

(function() {
  'use strict';
  
  console.log('🔍 Menu Selection Debug Tool');
  console.log('============================');
  
  // 1. Check what menu is selected in theme settings
  console.log('\n📋 1. Theme Settings Analysis:');
  
  const headerSections = document.querySelectorAll('[data-section-type="header"], .section-header');
  console.log(`Found ${headerSections.length} header sections`);
  
  // 2. Check navigation structure
  console.log('\n🧭 2. Navigation Structure:');
  
  const navigationContainers = document.querySelectorAll('.header__inline-menu');
  console.log(`Navigation containers: ${navigationContainers.length}`);
  
  navigationContainers.forEach((nav, index) => {
    console.log(`\n   Navigation ${index + 1}:`);
    const menuList = nav.querySelector('.list-menu--inline');
    const menuItems = nav.querySelectorAll('li');
    const dropdownItems = nav.querySelectorAll('header-menu details');
    
    console.log(`     Menu list: ${menuList ? '✅' : '❌'}`);
    console.log(`     Total menu items: ${menuItems.length}`);
    console.log(`     Dropdown items: ${dropdownItems.length}`);
    
    // List all menu items
    menuItems.forEach((item, itemIndex) => {
      const link = item.querySelector('a, summary');
      const hasDropdown = item.querySelector('details');
      const text = link ? link.textContent.trim() : 'No link found';
      console.log(`       [${itemIndex + 1}] ${text} ${hasDropdown ? '(has dropdown)' : '(simple link)'}`);
    });
  });
  
  // 3. Check NavigationController state
  console.log('\n🤖 3. NavigationController State:');
  
  if (window.navigationController) {
    const state = window.navigationController.getState();
    console.log('   ✅ NavigationController found');
    console.log(`   Initialized: ${state.initialized}`);
    console.log(`   Active dropdowns: ${state.activeDropdowns.length}`);
    console.log(`   Current breakpoint: ${state.currentBreakpoint}`);
    console.log(`   Touch device: ${state.touchDevice}`);
    
    // Test dropdown detection
    const detectedDropdowns = document.querySelectorAll(window.navigationController.selectors.dropdownTrigger);
    console.log(`   Detected dropdown elements: ${detectedDropdowns.length}`);
    
    detectedDropdowns.forEach((dropdown, index) => {
      console.log(`     [${index + 1}] ${dropdown.id || 'No ID'}`);
    });
    
  } else {
    console.log('   ❌ NavigationController not found');
  }
  
  // 4. Check CSS Classes and Hover States
  console.log('\n🎨 4. CSS and Hover State Analysis:');
  
  const bodyClasses = document.body.className;
  const hasJSClass = bodyClasses.includes('js');
  console.log(`   Body has 'js' class: ${hasJSClass ? '✅' : '❌'}`);
  
  const headerMenus = document.querySelectorAll('header-menu');
  console.log(`   Found ${headerMenus.length} header-menu elements`);
  
  headerMenus.forEach((menu, index) => {
    const details = menu.querySelector('details');
    const summary = menu.querySelector('summary');
    const submenu = menu.querySelector('.header__submenu');
    
    console.log(`\n     Header-menu ${index + 1}:`);
    console.log(`       Details element: ${details ? '✅' : '❌'}`);
    console.log(`       Summary element: ${summary ? '✅' : '❌'}`);
    console.log(`       Submenu element: ${submenu ? '✅' : '❌'}`);
    
    if (details && submenu) {
      const isOpen = details.hasAttribute('open');
      const computedStyle = window.getComputedStyle(submenu);
      console.log(`       Currently open: ${isOpen ? '✅' : '❌'}`);
      console.log(`       Submenu opacity: ${computedStyle.opacity}`);
      console.log(`       Submenu visibility: ${computedStyle.visibility}`);
      console.log(`       Submenu transform: ${computedStyle.transform}`);
    }
  });
  
  // 5. Test clicking functionality
  console.log('\n🖱️ 5. Click Test:');
  
  const firstDropdown = document.querySelector('header-menu details summary');
  if (firstDropdown) {
    console.log('   First dropdown found - testing click...');
    
    // Add temporary click listener
    const testClick = function(e) {
      console.log('   🖱️ Click detected on:', e.target.textContent.trim());
      console.log('   Event prevented:', e.defaultPrevented);
      firstDropdown.removeEventListener('click', testClick);
    };
    
    firstDropdown.addEventListener('click', testClick);
    console.log('   Click test listener added. Try clicking the first dropdown menu item.');
  } else {
    console.log('   ❌ No dropdown summary found for click testing');
  }
  
  // 6. Recommendations
  console.log('\n💡 6. Recommendations:');
  
  if (!window.navigationController) {
    console.log('   - NavigationController is missing. Check if navigation-controller.js is loaded.');
  }
  
  if (!hasJSClass) {
    console.log('   - Body is missing "js" class. This may affect CSS dropdown rules.');
  }
  
  if (navigationContainers.length === 0) {
    console.log('   - No navigation containers found. Check if menu is properly selected in theme settings.');
  }
  
  if (headerMenus.length === 0) {
    console.log('   - No header-menu elements found. Check if dropdown menu structure is correct.');
  }
  
  console.log('\n✅ Debug analysis complete!');
  
})();
