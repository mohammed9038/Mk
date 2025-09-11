/**
 * Menu Selection Diagnostic Tool
 * 
 * This script helps diagnose issues when changing menus in Shopify theme settings.
 * Run this in the browser console to check why your selected menu isn't working.
 * 
 * Usage:
 * 1. Copy and paste this entire script into browser console
 * 2. Or run: fetch('/menu-debug.js').then(r => r.text()).then(eval)
 */

(function() {
  'use strict';
  
  console.log('🔍 Menu Selection Diagnostic Tool v2.0');
  console.log('=======================================');
  
  const results = {};
  
  // 1. Check Theme Settings
  console.log('\n🎛️ 1. Theme Settings Analysis:');
  
  // Try to detect what menu is configured
  const headerSections = document.querySelectorAll('[data-section-type="header"], .section-header, header.header');
  console.log(`Found ${headerSections.length} header sections`);
  
  // 2. Available Menus Detection
  console.log('\n📋 2. Available Menus:');
  
  // Check if Liquid exposed menu data
  const menuDebugScript = document.querySelector('script');
  if (menuDebugScript) {
    console.log('Menu debug information should appear above this line if available');
  }
  
  // 3. Navigation Structure Analysis
  console.log('\n🧭 3. Navigation Structure Analysis:');
  
  const navContainers = document.querySelectorAll('.header__inline-menu, nav, .header__navigation');
  console.log(`Navigation containers found: ${navContainers.length}`);
  
  navContainers.forEach((nav, index) => {
    console.log(`\n   Container ${index + 1} (${nav.className}):`);
    
    const lists = nav.querySelectorAll('ul');
    const items = nav.querySelectorAll('li');
    const links = nav.querySelectorAll('a, summary');
    const dropdowns = nav.querySelectorAll('details, header-menu');
    const errorMessages = nav.querySelectorAll('.menu-error-message');
    
    console.log(`     Lists: ${lists.length}`);
    console.log(`     Items: ${items.length}`);
    console.log(`     Links/Summaries: ${links.length}`);
    console.log(`     Dropdowns: ${dropdowns.length}`);
    console.log(`     Error messages: ${errorMessages.length}`);
    
    if (errorMessages.length > 0) {
      console.log('     ⚠️ Menu error detected - check theme settings!');
    }
    
    // List menu items
    items.forEach((item, itemIndex) => {
      const link = item.querySelector('a, summary');
      const hasDropdown = item.querySelector('details, header-menu');
      const text = link ? link.textContent.trim() : 'No link';
      const isTestMenu = text.includes('(Test Menu)');
      
      console.log(`       [${itemIndex + 1}] ${text} ${hasDropdown ? '(dropdown)' : '(link)'} ${isTestMenu ? '⚠️ TEST' : ''}`);
    });
  });
  
  // 4. Menu Selection Validation
  console.log('\n✅ 4. Menu Selection Status:');
  
  const hasRealMenu = !document.querySelector('li:contains("Test Menu")') && 
                      !document.querySelector('.menu-error-message');
  const hasTestMenu = document.querySelectorAll('span').length > 0 && 
                      Array.from(document.querySelectorAll('span')).some(span => span.textContent.includes('Test Menu'));
  const hasErrorMessage = document.querySelectorAll('.menu-error-message').length > 0;
  
  if (hasErrorMessage) {
    console.log('   ❌ Menu error detected - selected menu not found');
    console.log('   📝 Solution: Check theme settings and ensure menu exists');
  } else if (hasTestMenu) {
    console.log('   ⚠️ Using fallback test menu');
    console.log('   📝 Solution: Select a proper menu in theme settings or create menu items');
  } else {
    console.log('   ✅ Appears to be using real menu data');
  }
  
  // 5. NavigationController Status
  console.log('\n🤖 5. NavigationController Status:');
  
  if (window.navigationController) {
    console.log('   ✅ NavigationController found');
    
    try {
      const debug = window.navigationController.debugNavigation();
      console.log('   Debug info:', debug);
      
      if (debug.detectedDropdowns === 0) {
        console.log('   ⚠️ No dropdowns detected by NavigationController');
        console.log('   💡 Try: window.navigationController.refreshNavigation()');
      }
    } catch (error) {
      console.log('   ❌ Error getting debug info:', error.message);
    }
    
  } else {
    console.log('   ❌ NavigationController not found');
    console.log('   📝 Check if navigation-controller.js is loaded');
  }
  
  // 6. CSS Analysis
  console.log('\n🎨 6. CSS Analysis:');
  
  const bodyHasJSClass = document.body.classList.contains('js');
  console.log(`   Body has 'js' class: ${bodyHasJSClass ? '✅' : '❌'}`);
  
  if (!bodyHasJSClass) {
    console.log('   📝 Add js class to body for proper CSS functionality');
  }
  
  const dropdownDetails = document.querySelectorAll('header-menu details, .header__inline-menu details');
  console.log(`   Dropdown details elements: ${dropdownDetails.length}`);
  
  if (dropdownDetails.length > 0) {
    const firstDropdown = dropdownDetails[0];
    const submenu = firstDropdown.querySelector('.header__submenu');
    
    if (submenu) {
      const styles = window.getComputedStyle(submenu);
      console.log(`   First submenu opacity: ${styles.opacity}`);
      console.log(`   First submenu visibility: ${styles.visibility}`);
      console.log(`   First submenu transform: ${styles.transform}`);
    }
  }
  
  // 7. Recommendations
  console.log('\n💡 7. Recommendations:');
  
  const recommendations = [];
  
  if (hasErrorMessage) {
    recommendations.push('Create a menu in Shopify admin or select existing menu in theme settings');
  }
  
  if (hasTestMenu) {
    recommendations.push('Go to Theme Settings → Header → Menu and select your menu');
  }
  
  if (!window.navigationController) {
    recommendations.push('Check if navigation-controller.js is properly loaded');
  }
  
  if (!bodyHasJSClass) {
    recommendations.push('Ensure body element has "js" class for proper CSS functionality');
  }
  
  if (navContainers.length === 0) {
    recommendations.push('Navigation structure missing - check header.liquid template');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Navigation appears to be configured correctly!');
  }
  
  recommendations.forEach((rec, index) => {
    console.log(`   ${index + 1}. ${rec}`);
  });
  
  // 8. Quick Fixes
  console.log('\n🔧 8. Quick Test Functions:');
  
  // Add helper functions to window for testing
  window.menuDebugTools = {
    refreshNavigation: function() {
      if (window.navigationController) {
        window.navigationController.refreshNavigation();
        console.log('✅ Navigation refreshed');
      } else {
        console.log('❌ NavigationController not available');
      }
    },
    
    testDropdownClick: function() {
      const firstDropdown = document.querySelector('header-menu details summary');
      if (firstDropdown) {
        console.log('🖱️ Testing dropdown click...');
        firstDropdown.click();
      } else {
        console.log('❌ No dropdown found to test');
      }
    },
    
    listMenus: function() {
      console.log('Available console commands:');
      console.log('- menuDebugTools.refreshNavigation() - Refresh navigation system');
      console.log('- menuDebugTools.testDropdownClick() - Test dropdown functionality');
      console.log('- menuDebugTools.listMenus() - Show this help');
      
      if (window.navigationController) {
        console.log('- navigationController.debugNavigation() - Full debug info');
        console.log('- navigationController.refreshNavigation() - Refresh navigation');
      }
    }
  };
  
  console.log('   Available functions: menuDebugTools.listMenus()');
  
  console.log('\n✅ Diagnostic complete! Check recommendations above.');
  
})();
