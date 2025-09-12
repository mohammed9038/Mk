// 🔍 Professional Header Settings Verification Tool
// This tool verifies that all 60+ professional settings are properly connected

(function() {
  console.log('🏢 Professional Header Settings Verification Tool');
  console.log('==================================================');
  
  const verificationResults = {
    connected: [],
    missing: [],
    cssVariables: [],
    schemaSettings: []
  };
  
  // Expected professional settings from our schema
  const expectedSettings = [
    // Brand & Logo (7 settings)
    'logo', 'logo_mobile', 'logo_width', 'logo_width_mobile', 'logo_position', 'mobile_logo_position', 'logo_link',
    
    // Navigation System (8 settings) 
    'menu', 'menu_type_desktop', 'show_line_separator', 'sticky_header_type', 'nav_font_size', 'nav_font_weight', 'nav_height', 'enable_nav_shadow',
    
    // Styling & Layout (6 settings)
    'color_scheme', 'header_padding_top', 'header_padding_bottom', 'header_max_width', 'enable_header_blur', 'custom_css',
    
    // Dropdown Styling (7 settings)
    'dropdown_width', 'dropdown_bg', 'dropdown_border', 'dropdown_text', 'dropdown_hover_bg', 'dropdown_radius', 'dropdown_shadow',
    
    // Search Integration (8 settings)
    'show_search', 'search_style', 'search_width', 'search_bg', 'search_border', 'search_border_focus', 'search_text', 'search_text_muted',
    
    // Multi-Language (6 settings)
    'enable_country_selector', 'enable_language_selector', 'gtranslate_text_color', 'gtranslate_bg_color', 'gtranslate_hover_bg', 'gtranslate_position',
    
    // Mobile Experience (6 settings)
    'menu_type_mobile', 'drawer_width', 'drawer_title_color', 'drawer_header_bg', 'utilities_bg', 'show_mobile_bottom_nav',
    
    // Advanced Features (7 settings)
    'show_top_menu', 'top_menu', 'enable_dropdown_icons', 'dropdown_delay', 'enable_mega_menu', 'enable_cart_drawer', 'cart_drawer_position',
    
    // Visual Design (4 settings)
    'nav_text_color', 'nav_hover_color', 'nav_active_color', 'dropdown_icons_style',
    
    // Developer Options (4 settings)
    'debug_mode', 'performance_monitoring', 'css_optimization', 'js_optimization'
  ];
  
  console.log(`📊 Expected ${expectedSettings.length} professional settings`);
  
  // Check if settings are defined in the current page context
  function checkSettingsInPage() {
    // Try to find evidence of settings being used
    const bodyHTML = document.documentElement.outerHTML;
    
    expectedSettings.forEach(setting => {
      const patterns = [
        `section.settings.${setting}`,
        `settings.${setting}`,
        `--${setting.replace(/_/g, '-')}:`
      ];
      
      let found = false;
      patterns.forEach(pattern => {
        if (bodyHTML.includes(pattern)) {
          found = true;
        }
      });
      
      if (found) {
        verificationResults.connected.push(setting);
      } else {
        verificationResults.missing.push(setting);
      }
    });
  }
  
  // Check CSS variables in computed styles
  function checkCSSVariables() {
    const rootStyle = getComputedStyle(document.documentElement);
    const headerElement = document.querySelector('.header');
    const headerStyle = headerElement ? getComputedStyle(headerElement) : null;
    
    const expectedCSSVars = [
      '--logo-width-desktop', '--logo-width-mobile',
      '--nav-font-size', '--nav-font-weight', '--nav-height',
      '--dropdown-width', '--dropdown-bg', '--dropdown-border',
      '--search-width', '--search-bg', '--search-border',
      '--gtranslate-text-color', '--gtranslate-bg-color',
      '--drawer-width', '--dropdown-delay'
    ];
    
    expectedCSSVars.forEach(varName => {
      const value = rootStyle.getPropertyValue(varName) || 
                   (headerStyle ? headerStyle.getPropertyValue(varName) : '');
      if (value.trim()) {
        verificationResults.cssVariables.push({
          variable: varName,
          value: value.trim()
        });
      }
    });
  }
  
  // Check for professional settings schema evidence
  function checkSchemaEvidence() {
    // Look for evidence of professional schema in the page
    const headerSection = document.querySelector('[data-section-type="header"]');
    if (headerSection) {
      console.log('✅ Header section found with professional implementation');
    }
    
    // Check for professional CSS files
    const stylesheets = Array.from(document.styleSheets);
    stylesheets.forEach(sheet => {
      if (sheet.href && sheet.href.includes('header-professional-settings')) {
        console.log('✅ Professional settings CSS file loaded');
      }
    });
    
    // Check for professional navigation controller
    if (window.navigationController) {
      console.log('✅ Professional navigation controller found');
      console.log('   State:', window.navigationController.state);
    }
  }
  
  // Run verification
  checkSettingsInPage();
  checkCSSVariables();
  checkSchemaEvidence();
  
  // Display results
  console.log('\n🔗 CONNECTED SETTINGS (' + verificationResults.connected.length + '/' + expectedSettings.length + ')');
  verificationResults.connected.forEach(setting => {
    console.log(`✅ ${setting}`);
  });
  
  if (verificationResults.missing.length > 0) {
    console.log('\n❌ MISSING SETTINGS (' + verificationResults.missing.length + ')');
    verificationResults.missing.forEach(setting => {
      console.log(`❌ ${setting}`);
    });
  }
  
  console.log('\n🎨 CSS VARIABLES (' + verificationResults.cssVariables.length + ')');
  verificationResults.cssVariables.forEach(item => {
    console.log(`✅ ${item.variable}: ${item.value}`);
  });
  
  // Overall score
  const connectionRate = Math.round((verificationResults.connected.length / expectedSettings.length) * 100);
  console.log(`\n📈 OVERALL CONNECTION RATE: ${connectionRate}%`);
  
  if (connectionRate >= 80) {
    console.log('🎉 EXCELLENT! Professional settings are well connected');
  } else if (connectionRate >= 60) {
    console.log('⚠️  GOOD! Most settings connected, some may need attention');
  } else {
    console.log('🚨 NEEDS WORK! Many settings are not properly connected');
  }
  
  // Recommendations
  console.log('\n💡 RECOMMENDATIONS:');
  if (verificationResults.missing.length > 0) {
    console.log('• Ensure all schema settings have corresponding template implementation');
    console.log('• Check that CSS variables are defined for all styling settings');
    console.log('• Verify Liquid template uses section.settings.SETTING_NAME pattern');
  }
  
  if (verificationResults.cssVariables.length < 10) {
    console.log('• Add more CSS variables for dynamic styling');
  }
  
  console.log('• Test settings changes in Shopify admin to verify they take effect');
  console.log('• Use browser dev tools to inspect CSS variable values');
  
  return verificationResults;
})();