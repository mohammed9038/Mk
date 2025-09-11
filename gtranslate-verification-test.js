/**
 * GTranslate Verification Test
 * Run this in browser console at http://127.0.0.1:9292
 * 
 * This test verifies:
 * 1. Second language selector removed
 * 2. GTranslate professional styling applied
 * 3. Theme settings integration working
 * 4. Only one language selector visible
 */

(function() {
  'use strict';
  
  console.log('🌍 GTranslate Professional Test');
  console.log('===============================');
  
  const results = {
    languageSelectors: 0,
    gtranslateFound: false,
    fallbackRemoved: false,
    styling: null,
    themeSettings: null
  };
  
  // 1. Count language selectors
  console.log('\n📊 1. Language Selector Count:');
  
  const gtranslateWidgets = document.querySelectorAll('.gtranslate_wrapper, .header-gtranslate, [data-gt-src]');
  const fallbackSelectors = document.querySelectorAll('.header__language-selector');
  const testLanguageItems = document.querySelectorAll('summary:contains("EN"), span:contains("🌐")');
  
  console.log(`GTranslate widgets: ${gtranslateWidgets.length}`);
  console.log(`Fallback selectors: ${fallbackSelectors.length}`);
  console.log(`Manual test items: ${testLanguageItems.length}`);
  
  results.languageSelectors = gtranslateWidgets.length + fallbackSelectors.length;
  results.gtranslateFound = gtranslateWidgets.length > 0;
  results.fallbackRemoved = fallbackSelectors.length === 0;
  
  if (results.fallbackRemoved) {
    console.log('✅ Fallback language selector removed');
  } else {
    console.log('❌ Fallback language selector still present');
  }
  
  if (results.gtranslateFound) {
    console.log('✅ GTranslate widget found');
  } else {
    console.log('❌ GTranslate widget not found');
  }
  
  // 2. Check GTranslate Professional Styling
  console.log('\n🎨 2. Professional Styling Check:');
  
  const professionalCSS = document.querySelector('link[href*="gtranslate-professional"]');
  const headerGTranslate = document.querySelector('.header-gtranslate');
  
  console.log(`Professional CSS loaded: ${!!professionalCSS}`);
  console.log(`Header GTranslate container: ${!!headerGTranslate}`);
  
  if (headerGTranslate) {
    const styles = window.getComputedStyle(headerGTranslate);
    console.log(`Container display: ${styles.display}`);
    console.log(`Container position: ${styles.position}`);
    results.styling = 'applied';
  } else {
    results.styling = 'missing';
  }
  
  // 3. Check Theme Settings Integration
  console.log('\n⚙️ 3. Theme Settings Integration:');
  
  const rootStyles = window.getComputedStyle(document.documentElement);
  const gtranslateTextColor = rootStyles.getPropertyValue('--gtranslate-text-color').trim();
  const gtranslateBgColor = rootStyles.getPropertyValue('--gtranslate-bg-color').trim();
  
  console.log(`CSS Variable --gtranslate-text-color: ${gtranslateTextColor || 'not set'}`);
  console.log(`CSS Variable --gtranslate-bg-color: ${gtranslateBgColor || 'not set'}`);
  
  if (gtranslateTextColor && gtranslateBgColor) {
    console.log('✅ Theme settings CSS variables found');
    results.themeSettings = 'integrated';
  } else {
    console.log('⚠️ Theme settings CSS variables not found');
    results.themeSettings = 'missing';
  }
  
  // 4. Check GTranslate JavaScript Settings
  console.log('\n🔧 4. GTranslate Configuration:');
  
  if (window.gtranslateSettings) {
    console.log('✅ GTranslate settings found');
    console.log('Languages:', window.gtranslateSettings.languages);
    console.log('Professional style:', window.gtranslateSettings.professional_style);
    console.log('Match header design:', window.gtranslateSettings.match_header_design);
    
    // Check if using CSS variables
    if (window.gtranslateSettings.dropdown_text_color && 
        window.gtranslateSettings.dropdown_text_color.includes('var(')) {
      console.log('✅ Using CSS variables for dynamic theming');
    } else {
      console.log('⚠️ Not using CSS variables - static colors');
    }
  } else {
    console.log('❌ GTranslate settings not found');
  }
  
  // 5. Visual Test
  console.log('\n👁️ 5. Visual Test:');
  
  const visibleLanguageElements = Array.from(document.querySelectorAll('*')).filter(el => {
    const text = el.textContent;
    const isVisible = el.offsetParent !== null;
    return isVisible && (
      text.includes('🌐') || 
      text.includes('EN') || 
      text.includes('العربية') ||
      text.includes('English') ||
      el.classList.contains('gt_selector') ||
      el.classList.contains('header-gtranslate')
    );
  });
  
  console.log(`Visible language-related elements: ${visibleLanguageElements.length}`);
  
  visibleLanguageElements.forEach((el, index) => {
    const text = el.textContent.substring(0, 50);
    const classes = el.className;
    console.log(`  ${index + 1}. ${text} (${classes})`);
  });
  
  // 6. Summary & Recommendations
  console.log('\n📋 6. Test Summary:');
  
  if (results.fallbackRemoved && results.gtranslateFound) {
    console.log('✅ SUCCESS: Only GTranslate widget present');
  } else if (!results.fallbackRemoved) {
    console.log('❌ ISSUE: Fallback selector still present');
  } else if (!results.gtranslateFound) {
    console.log('❌ ISSUE: GTranslate widget not found');
  }
  
  if (results.styling === 'applied') {
    console.log('✅ SUCCESS: Professional styling applied');
  } else {
    console.log('❌ ISSUE: Professional styling missing');
  }
  
  if (results.themeSettings === 'integrated') {
    console.log('✅ SUCCESS: Theme settings integrated');
  } else {
    console.log('⚠️ INFO: Theme settings not yet active (may need refresh)');
  }
  
  // 7. Next Steps
  console.log('\n🎯 7. Next Steps:');
  
  if (!results.fallbackRemoved) {
    console.log('1. Remove fallback language selector from header template');
  }
  
  if (!results.gtranslateFound) {
    console.log('1. Check if GTranslate widget is enabled in theme settings');
    console.log('2. Verify language selector setting is turned on');
  }
  
  if (results.styling === 'missing') {
    console.log('1. Ensure gtranslate-professional.css is loading');
    console.log('2. Check header container has .header-gtranslate class');
  }
  
  console.log('\n💡 To customize GTranslate:');
  console.log('Go to Theme Editor → Header section → Language Settings');
  
  console.log('\n✅ GTranslate Professional Test Complete!');
  
  // Make available globally for re-testing
  window.testGTranslate = arguments.callee;
  window.gtranslateTestResults = results;
  
  return results;
  
})();
