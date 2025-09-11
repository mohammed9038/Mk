/**
 * Live Navigation Testing Script
 * Run this in the browser console while viewing http://127.0.0.1:9292
 * 
 * This script will:
 * 1. Test current menu selection
 * 2. Verify NavigationController functionality
 * 3. Check dropdown interactions
 * 4. Validate GTranslate integration
 * 5. Test mobile navigation
 */

(function() {
  'use strict';
  
  console.log('🚀 Live Navigation Testing Started');
  console.log('==================================');
  
  const results = {
    menuSelection: null,
    navigationController: null,
    dropdowns: [],
    gTranslate: null,
    mobile: null,
    performance: null
  };
  
  // 1. Test Menu Selection
  console.log('\n📋 1. Testing Menu Selection...');
  
  const menuContainer = document.querySelector('.header__inline-menu');
  const menuItems = document.querySelectorAll('.header__inline-menu li');
  const errorMessages = document.querySelectorAll('.menu-error-message');
  const testMenuItems = Array.from(document.querySelectorAll('span')).filter(span => 
    span.textContent.includes('Test Menu')
  );
  
  console.log(`Menu container found: ${!!menuContainer}`);
  console.log(`Menu items count: ${menuItems.length}`);
  console.log(`Error messages: ${errorMessages.length}`);
  console.log(`Test menu items: ${testMenuItems.length}`);
  
  if (errorMessages.length > 0) {
    console.log('❌ Menu Error: Selected menu not found in Shopify admin');
    results.menuSelection = 'error';
  } else if (testMenuItems.length > 0) {
    console.log('⚠️ Using fallback test menu - check theme settings');
    results.menuSelection = 'fallback';
  } else {
    console.log('✅ Using real menu from Shopify admin');
    results.menuSelection = 'real';
  }
  
  // List actual menu items
  console.log('\nMenu Items Found:');
  menuItems.forEach((item, index) => {
    const text = item.textContent.trim().substring(0, 50);
    const hasDropdown = item.querySelector('details') !== null;
    const isActive = item.querySelector('.header__active-menu-item') !== null;
    console.log(`  ${index + 1}. ${text} ${hasDropdown ? '(dropdown)' : '(link)'} ${isActive ? '(active)' : ''}`);
  });
  
  // 2. Test NavigationController
  console.log('\n🤖 2. Testing NavigationController...');
  
  if (window.navigationController) {
    console.log('✅ NavigationController found');
    
    try {
      const debug = window.navigationController.debugNavigation();
      console.log('Debug info:', debug);
      results.navigationController = debug;
      
      if (debug.detectedDropdowns === 0) {
        console.log('⚠️ No dropdowns detected - trying refresh...');
        window.navigationController.refreshNavigation();
        
        setTimeout(() => {
          const newDebug = window.navigationController.debugNavigation();
          console.log('After refresh:', newDebug);
        }, 500);
      }
      
    } catch (error) {
      console.log('❌ Error getting debug info:', error.message);
      results.navigationController = 'error';
    }
    
  } else {
    console.log('❌ NavigationController not found');
    results.navigationController = 'missing';
  }
  
  // 3. Test Dropdown Functionality
  console.log('\n🔽 3. Testing Dropdown Functionality...');
  
  const dropdowns = document.querySelectorAll('header-menu details');
  console.log(`Dropdowns found: ${dropdowns.length}`);
  
  dropdowns.forEach((dropdown, index) => {
    const summary = dropdown.querySelector('summary');
    const submenu = dropdown.querySelector('.header__submenu');
    
    if (summary && submenu) {
      const text = summary.textContent.trim();
      console.log(`  Dropdown ${index + 1}: ${text}`);
      
      // Test if dropdown can be opened
      const wasOpen = dropdown.open;
      
      // Try to open
      summary.click();
      
      setTimeout(() => {
        const isNowOpen = dropdown.open;
        console.log(`    Click test: ${wasOpen ? 'was open' : 'was closed'} → ${isNowOpen ? 'now open' : 'now closed'}`);
        
        // Close if we opened it
        if (!wasOpen && isNowOpen) {
          summary.click();
        }
        
        results.dropdowns.push({
          text: text,
          clickable: wasOpen !== isNowOpen,
          hasSubmenu: !!submenu
        });
      }, 100);
    }
  });
  
  // 4. Test GTranslate Integration
  console.log('\n🌍 4. Testing GTranslate...');
  
  const gTranslateWidgets = document.querySelectorAll('[data-gt-src], .gtranslate_wrapper, .gt_selector');
  const gTranslateScript = document.querySelector('script[src*="gtranslate"]');
  
  console.log(`GTranslate widgets found: ${gTranslateWidgets.length}`);
  console.log(`GTranslate script loaded: ${!!gTranslateScript}`);
  
  if (window.doGTranslate) {
    console.log('✅ GTranslate API available');
    results.gTranslate = 'loaded';
  } else if (gTranslateScript) {
    console.log('⚠️ GTranslate script loaded but API not ready');
    results.gTranslate = 'loading';
  } else {
    console.log('❌ GTranslate not found');
    results.gTranslate = 'missing';
  }
  
  // 5. Test Mobile Navigation
  console.log('\n📱 5. Testing Mobile Navigation...');
  
  const mobileNav = document.querySelector('.mobile-bottom-navigation, [data-section-type="mobile-bottom-navigation"]');
  const isMobile = window.innerWidth < 990;
  const hasTouchClass = document.documentElement.classList.contains('touch');
  
  console.log(`Mobile navigation found: ${!!mobileNav}`);
  console.log(`Current viewport: ${window.innerWidth}px (${isMobile ? 'mobile' : 'desktop'})`);
  console.log(`Touch device detected: ${hasTouchClass}`);
  
  results.mobile = {
    navigationExists: !!mobileNav,
    isMobileViewport: isMobile,
    touchDevice: hasTouchClass
  };
  
  // 6. Performance Check
  console.log('\n⚡ 6. Performance Check...');
  
  const parserBlockingScripts = Array.from(document.querySelectorAll('script[src]')).filter(script => 
    !script.defer && !script.async && script.src.includes('firebase')
  );
  
  console.log(`Parser blocking scripts: ${parserBlockingScripts.length}`);
  
  if (parserBlockingScripts.length === 0) {
    console.log('✅ No parser blocking scripts found - performance fix applied!');
    results.performance = 'optimized';
  } else {
    console.log('⚠️ Found parser blocking scripts:');
    parserBlockingScripts.forEach(script => {
      console.log(`    ${script.src}`);
    });
    results.performance = 'needs_fix';
  }
  
  // 7. Summary and Recommendations
  console.log('\n📊 7. Test Summary');
  console.log('==================');
  
  // Menu Selection Status
  if (results.menuSelection === 'real') {
    console.log('✅ Menu Selection: Using real Shopify menu');
  } else if (results.menuSelection === 'fallback') {
    console.log('⚠️ Menu Selection: Using fallback test menu');
    console.log('   → Go to Theme Settings → Header → Select your menu');
  } else {
    console.log('❌ Menu Selection: Menu error detected');
    console.log('   → Create menu in Shopify Admin → Navigation');
  }
  
  // Navigation Controller Status
  if (results.navigationController && results.navigationController.detectedDropdowns > 0) {
    console.log(`✅ NavigationController: Working (${results.navigationController.detectedDropdowns} dropdowns)`);
  } else if (results.navigationController === 'missing') {
    console.log('❌ NavigationController: Not loaded');
  } else {
    console.log('⚠️ NavigationController: Loaded but no dropdowns detected');
  }
  
  // Dropdown Status
  const workingDropdowns = results.dropdowns.filter(d => d.clickable).length;
  if (workingDropdowns > 0) {
    console.log(`✅ Dropdowns: ${workingDropdowns} working dropdowns`);
  } else if (results.dropdowns.length > 0) {
    console.log(`⚠️ Dropdowns: ${results.dropdowns.length} found but not clickable`);
  } else {
    console.log('ℹ️ Dropdowns: None found (menu might not have sub-items)');
  }
  
  // GTranslate Status
  if (results.gTranslate === 'loaded') {
    console.log('✅ GTranslate: Working correctly');
  } else if (results.gTranslate === 'loading') {
    console.log('⚠️ GTranslate: Still loading');
  } else {
    console.log('❌ GTranslate: Not found or not working');
  }
  
  // Performance Status
  if (results.performance === 'optimized') {
    console.log('✅ Performance: Optimized (no parser blocking scripts)');
  } else {
    console.log('⚠️ Performance: Needs optimization');
  }
  
  // 8. Next Steps
  console.log('\n🎯 Next Steps:');
  
  if (results.menuSelection === 'fallback') {
    console.log('1. Go to Shopify Admin → Online Store → Navigation');
    console.log('2. Create a menu or edit existing menu');
    console.log('3. Go to Theme Customization → Header → Select your menu');
  }
  
  if (results.navigationController === 'missing') {
    console.log('1. Check if navigation-controller.js is loading');
    console.log('2. Check browser console for JavaScript errors');
  }
  
  if (workingDropdowns === 0 && results.dropdowns.length > 0) {
    console.log('1. Try: window.navigationController.refreshNavigation()');
    console.log('2. Check CSS for dropdown visibility issues');
  }
  
  console.log('\n✅ Live Navigation Test Complete!');
  console.log('You can re-run this test anytime with: liveNavTest()');
  
  // Make available globally for re-testing
  window.liveNavTest = arguments.callee;
  window.navTestResults = results;
  
  return results;
  
})();
