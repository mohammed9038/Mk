/**
 * Professional Navigation Diagnostic Tool v2.0
 * Complete diagnostic suite for Shopify navigation issues
 * 
 * Usage: Copy and paste this entire script into browser console
 * Or run: fetch('/assets/dropdown-diagnostic.js').then(r => r.text()).then(eval)
 */

(function() {
  'use strict';
  
  console.log('🔍 Professional Navigation Diagnostic Tool v2.0');
  console.log('================================================');
  
  const diagnosticResults = {};
  const startTime = performance.now();
  
  // 1. System Detection
  console.log('\n🔧 1. Navigation System Detection:');
  
  if (window.navigationController) {
    console.log('✅ NavigationController found and instantiated');
    console.log('   - Version:', window.navigationController.version || 'Unknown');
    console.log('   - Initialized:', window.navigationController.initialized || false);
    console.log('   - State:', window.navigationController.state);
    diagnosticResults.navigationController = 'active';
  } else if (window.NavigationController) {
    console.log('⚠️ NavigationController class available but not instantiated');
    console.log('   - Creating instance for testing...');
    try {
      const testInstance = new window.NavigationController();
      console.log('✅ NavigationController can be instantiated');
      diagnosticResults.navigationController = 'available';
    } catch (error) {
      console.log('❌ NavigationController instantiation failed:', error.message);
      diagnosticResults.navigationController = 'error';
    }
  } else {
    console.log('❌ NavigationController not found');
    diagnosticResults.navigationController = 'missing';
  }
  
  if (window.slideshowEnhancer) {
    console.log('✅ SlideshowEnhancer active');
    diagnosticResults.slideshowEnhancer = 'active';
  } else if (window.SlideshowEnhancer) {
    console.log('⚠️ SlideshowEnhancer class available but not instantiated');
    diagnosticResults.slideshowEnhancer = 'available';
  } else {
    console.log('❌ SlideshowEnhancer not found');
    diagnosticResults.slideshowEnhancer = 'missing';
  }
  
  // 2. Dropdown Element Analysis
  console.log('\n📋 2. Dropdown Element Analysis:');
  
  const shopifyDropdowns = document.querySelectorAll('details[id^="Details-HeaderMenu-"]');
  const customDropdowns = document.querySelectorAll('details[data-dropdown]');
  const allDetails = document.querySelectorAll('details');
  
  console.log(`   Total <details> elements: ${allDetails.length}`);
  console.log(`   Shopify header dropdowns: ${shopifyDropdowns.length}`);
  console.log(`   Custom dropdowns: ${customDropdowns.length}`);
  
  diagnosticResults.dropdowns = {
    total: allDetails.length,
    shopify: shopifyDropdowns.length,
    custom: customDropdowns.length
  };
  
  // Analyze each Shopify dropdown
  if (shopifyDropdowns.length > 0) {
    console.log('\n   📊 Shopify Dropdown Details:');
    shopifyDropdowns.forEach((dropdown, index) => {
      const summary = dropdown.querySelector('summary');
      const submenu = dropdown.querySelector('.header__submenu');
      const isOpen = dropdown.hasAttribute('open');
      
      console.log(`     [${index + 1}] ${dropdown.id}:`);
      console.log(`         Summary: ${summary ? '✅' : '❌'}`);
      console.log(`         Submenu: ${submenu ? '✅' : '❌'}`);
      console.log(`         Currently open: ${isOpen ? '✅' : '❌'}`);
      
      // Test classList functionality
      if (summary) {
        try {
          summary.classList.contains('test');
          console.log(`         classList: ✅ working`);
        } catch (error) {
          console.log(`         classList: ❌ ERROR - ${error.message}`);
          diagnosticResults.classListError = true;
        }
      }
    });
  }
  
  // 3. Language Selector Analysis
  console.log('\n🌍 3. Language Selector Analysis:');
  
  const gtranslateWrappers = document.querySelectorAll('.gtranslate_wrapper');
  const gtranslateSelectors = document.querySelectorAll('[class*="gtranslate"]');
  
  console.log(`   GTranslate wrappers: ${gtranslateWrappers.length}`);
  console.log(`   GTranslate elements: ${gtranslateSelectors.length}`);
  
  if (window.gt_widget_script) {
    console.log('   ✅ GTranslate widget script loaded');
  } else {
    console.log('   ❌ GTranslate widget script not ready');
  }
  
  if (window.gtranslateSettings) {
    console.log('   ✅ GTranslate settings found');
    console.log('   - Languages:', window.gtranslateSettings.languages);
  } else {
    console.log('   ❌ GTranslate settings not found');
  }
  
  diagnosticResults.gtranslate = {
    wrappers: gtranslateWrappers.length,
    elements: gtranslateSelectors.length,
    script: !!window.gt_widget_script,
    settings: !!window.gtranslateSettings
  };
  
  // 4. Script Conflict Detection
  console.log('\n⚡ 4. Script Conflict Detection:');
  
  const allScripts = Array.from(document.querySelectorAll('script[src]'));
  const navigationScripts = allScripts.filter(script => {
    const src = script.src.toLowerCase();
    return src.includes('dropdown') || 
           src.includes('navigation') || 
           src.includes('menu');
  });
  
  console.log(`   Total navigation-related scripts: ${navigationScripts.length}`);
  
  const potentialConflicts = navigationScripts.filter(script => {
    const filename = script.src.split('/').pop().toLowerCase();
    return filename.includes('dropdown-hover') ||
           filename.includes('dropdown-fix') ||
           filename.includes('desktop-navigation') ||
           (filename.includes('dropdown') && !filename.includes('navigation-controller'));
  });
  
  if (potentialConflicts.length > 0) {
    console.log('   ⚠️ Potential conflicts detected:');
    potentialConflicts.forEach(script => {
      const filename = script.src.split('/').pop();
      console.log(`     - ${filename}`);
    });
  } else {
    console.log('   ✅ No obvious script conflicts');
  }
  
  diagnosticResults.scripts = {
    total: navigationScripts.length,
    conflicts: potentialConflicts.length
  };
  
  // 5. CSS Analysis
  console.log('\n🎨 5. CSS Analysis:');
  
  const allStylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
  const navigationCSS = allStylesheets.filter(link => {
    const href = link.href.toLowerCase();
    return href.includes('navigation') || 
           href.includes('dropdown') || 
           href.includes('menu');
  });
  
  console.log(`   Navigation-related CSS files: ${navigationCSS.length}`);
  
  const professionalCSS = document.querySelector('link[href*="navigation-professional.css"]');
  const listMenuCSS = document.querySelector('link[href*="component-list-menu.css"]');
  
  console.log(`   Professional navigation CSS: ${professionalCSS ? '✅' : '❌'}`);
  console.log(`   Component list menu CSS: ${listMenuCSS ? '✅' : '❌'}`);
  
  diagnosticResults.css = {
    total: navigationCSS.length,
    professional: !!professionalCSS,
    listMenu: !!listMenuCSS
  };
  
  // 6. Functional Testing
  console.log('\n🧪 6. Functional Testing:');
  
  let testsRun = 0;
  let testsPassed = 0;
  
  // Test dropdown click functionality
  if (shopifyDropdowns.length > 0) {
    console.log('   Testing dropdown click functionality...');
    const testDropdown = shopifyDropdowns[0];
    const testSummary = testDropdown.querySelector('summary');
    
    if (testSummary) {
      try {
        const wasOpen = testDropdown.hasAttribute('open');
        testsRun++;
        
        // Simulate click
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        
        testSummary.dispatchEvent(clickEvent);
        
        // Check result after a brief delay
        setTimeout(() => {
          const isNowOpen = testDropdown.hasAttribute('open');
          const clickWorked = wasOpen !== isNowOpen;
          
          if (clickWorked) {
            console.log('   ✅ Dropdown click test passed');
            testsPassed++;
          } else {
            console.log('   ⚠️ Dropdown click test inconclusive');
          }
          
          // Close dropdown if we opened it
          if (!wasOpen && isNowOpen) {
            testDropdown.removeAttribute('open');
          }
        }, 50);
        
      } catch (error) {
        console.log(`   ❌ Dropdown click test failed: ${error.message}`);
      }
    }
  }
  
  // Test classList access on all elements
  console.log('   Testing classList access...');
  let classListErrors = 0;
  
  allDetails.forEach((detail, index) => {
    const summary = detail.querySelector('summary');
    if (summary) {
      try {
        testsRun++;
        summary.classList.toString();
        testsPassed++;
      } catch (error) {
        classListErrors++;
        console.log(`   ❌ classList error on detail ${index}: ${error.message}`);
      }
    }
  });
  
  if (classListErrors === 0) {
    console.log('   ✅ All classList tests passed');
  } else {
    console.log(`   ❌ ${classListErrors} classList errors detected`);
  }
  
  diagnosticResults.tests = {
    run: testsRun,
    passed: testsPassed,
    classListErrors: classListErrors
  };
  
  // 7. Performance Check
  console.log('\n⚡ 7. Performance Analysis:');
  
  const perfStart = performance.now();
  
  // Test query selector performance
  document.querySelectorAll('details[id^="Details-HeaderMenu-"]');
  document.querySelectorAll('.header__submenu');
  document.querySelectorAll('.gtranslate_wrapper');
  
  const perfEnd = performance.now();
  const queryTime = perfEnd - perfStart;
  
  console.log(`   Query selector performance: ${queryTime.toFixed(2)}ms`);
  
  if (queryTime > 10) {
    console.log('   ⚠️ Query performance seems slow');
  } else {
    console.log('   ✅ Query performance is good');
  }
  
  // 8. Error Monitoring Setup
  console.log('\n🚨 8. Error Monitoring:');
  
  let errorMonitorActive = false;
  
  if (!window.navigationErrorMonitor) {
    const originalConsoleError = console.error;
    const errors = [];
    
    console.error = function(...args) {
      const message = args.join(' ');
      if (message.includes('classList') || 
          message.includes('dropdown') || 
          message.includes('navigation')) {
        errors.push({
          message: message,
          timestamp: new Date().toISOString(),
          stack: new Error().stack
        });
      }
      originalConsoleError.apply(console, args);
    };
    
    window.navigationErrorMonitor = {
      errors: errors,
      getErrors: () => errors,
      clearErrors: () => errors.length = 0
    };
    
    errorMonitorActive = true;
    console.log('   ✅ Error monitoring activated');
  } else {
    console.log('   ✅ Error monitoring already active');
    errorMonitorActive = true;
  }
  
  // 9. Summary and Recommendations
  console.log('\n📊 9. Summary and Recommendations:');
  
  const issues = [];
  const recommendations = [];
  
  if (diagnosticResults.navigationController === 'missing') {
    issues.push('NavigationController not found');
    recommendations.push('Verify navigation-controller.js is loaded');
  } else if (diagnosticResults.navigationController === 'available') {
    issues.push('NavigationController not instantiated');
    recommendations.push('Check NavigationController initialization in theme.liquid');
  }
  
  if (diagnosticResults.classListError) {
    issues.push('classList errors detected');
    recommendations.push('Enable SlideshowEnhancer to fix classList issues');
  }
  
  if (diagnosticResults.dropdowns.shopify === 0) {
    issues.push('No Shopify header dropdowns found');
    recommendations.push('Check menu configuration in theme settings');
  }
  
  if (diagnosticResults.scripts.conflicts > 0) {
    issues.push(`${diagnosticResults.scripts.conflicts} potentially conflicting scripts`);
    recommendations.push('Remove old dropdown fix scripts');
  }
  
  if (!diagnosticResults.css.professional) {
    issues.push('Professional navigation CSS not loaded');
    recommendations.push('Add navigation-professional.css to theme.liquid');
  }
  
  if (diagnosticResults.gtranslate.wrappers === 0) {
    issues.push('No language selector elements found');
    recommendations.push('Check GTranslate configuration');
  }
  
  const endTime = performance.now();
  const totalTime = endTime - startTime;
  
  console.log(`\n⏱️ Diagnostic completed in ${totalTime.toFixed(2)}ms`);
  
  if (issues.length === 0) {
    console.log('\n🎉 SUCCESS! No major issues detected.');
    console.log('   Your navigation system appears to be working correctly.');
  } else {
    console.log(`\n⚠️ ${issues.length} issue(s) identified:`);
    issues.forEach((issue, index) => {
      console.log(`   ${index + 1}. ${issue}`);
    });
    
    console.log('\n💡 Recommendations:');
    recommendations.forEach((rec, index) => {
      console.log(`   ${index + 1}. ${rec}`);
    });
  }
  
  // 10. Helper Functions
  console.log('\n🛠️ 10. Available Helper Functions:');
  console.log('   - window.testAllDropdowns() - Test all dropdown functionality');
  console.log('   - window.testLanguageSelector() - Test language selector');
  console.log('   - window.rerunDiagnostic() - Run this diagnostic again');
  console.log('   - window.getNavigationErrors() - View captured errors');
  console.log('   - window.clearNavigationErrors() - Clear error log');
  
  // Store results globally
  window.navigationDiagnosticResults = diagnosticResults;
  
  // Helper function implementations
  window.testAllDropdowns = function() {
    console.log('\n🧪 Manual Dropdown Test');
    const dropdowns = document.querySelectorAll('details[id^="Details-HeaderMenu-"]');
    
    if (dropdowns.length === 0) {
      console.log('❌ No Shopify dropdowns found to test');
      return;
    }
    
    dropdowns.forEach((dropdown, index) => {
      const summary = dropdown.querySelector('summary');
      const submenu = dropdown.querySelector('.header__submenu');
      
      console.log(`Testing dropdown ${index + 1}: ${dropdown.id}`);
      
      if (!summary) {
        console.log('  ❌ No summary element found');
        return;
      }
      
      if (!submenu) {
        console.log('  ⚠️ No submenu found');
      }
      
      try {
        const wasOpen = dropdown.hasAttribute('open');
        summary.click();
        
        setTimeout(() => {
          const isNowOpen = dropdown.hasAttribute('open');
          const worked = wasOpen !== isNowOpen;
          
          console.log(`  ${worked ? '✅' : '❌'} Click test: ${worked ? 'PASSED' : 'FAILED'}`);
          
          // Reset state
          if (!wasOpen && isNowOpen) {
            dropdown.removeAttribute('open');
          }
        }, 100);
        
      } catch (error) {
        console.log(`  ❌ Error: ${error.message}`);
      }
    });
  };
  
  window.testLanguageSelector = function() {
    console.log('\n🌍 Language Selector Test');
    
    const wrappers = document.querySelectorAll('.gtranslate_wrapper');
    const selectors = document.querySelectorAll('[class*="gtranslate"]');
    
    console.log(`Found ${wrappers.length} GTranslate wrappers`);
    console.log(`Found ${selectors.length} GTranslate elements`);
    
    if (window.gt_widget_script) {
      console.log('✅ GTranslate script is loaded');
    } else {
      console.log('❌ GTranslate script not loaded');
    }
    
    if (window.gtranslateSettings) {
      console.log('✅ GTranslate settings configured');
      console.log('Languages:', window.gtranslateSettings.languages);
    } else {
      console.log('❌ GTranslate settings not found');
    }
    
    wrappers.forEach((wrapper, index) => {
      console.log(`Wrapper ${index + 1}:`, wrapper.innerHTML.length > 0 ? '✅ Has content' : '❌ Empty');
    });
  };
  
  window.rerunDiagnostic = function() {
    console.clear();
    eval(arguments.callee.toString().replace('function() {', '').slice(0, -1));
  };
  
  window.getNavigationErrors = function() {
    if (window.navigationErrorMonitor) {
      return window.navigationErrorMonitor.getErrors();
    }
    return [];
  };
  
  window.clearNavigationErrors = function() {
    if (window.navigationErrorMonitor) {
      window.navigationErrorMonitor.clearErrors();
      console.log('✅ Navigation error log cleared');
    }
  };
  
  console.log('\n🔍 Diagnostic Complete!');
  console.log('================================================');
  
  return diagnosticResults;
})();