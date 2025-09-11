/**
 * Quick GTranslate Fix Verification
 * Run in browser console to check if fixes worked
 */

console.log('🔧 GTranslate Fix Verification');
console.log('============================');

// Check language count
if (window.gtranslateSettings) {
  console.log('Languages configured:', window.gtranslateSettings.languages);
  console.log('Should show only: ["en", "ar"]');
  
  if (window.gtranslateSettings.languages.length === 2) {
    console.log('✅ FIXED: Only 2 languages (English & Arabic)');
  } else {
    console.log('❌ Still showing', window.gtranslateSettings.languages.length, 'languages');
  }
} else {
  console.log('❌ GTranslate settings not found');
}

// Check dropdown styling
const dropdown = document.querySelector('.header-gtranslate .gt_dropdown, .header-gtranslate .gt_switcher');
if (dropdown) {
  const styles = window.getComputedStyle(dropdown);
  const bgColor = styles.backgroundColor;
  console.log('Dropdown background:', bgColor);
  
  if (bgColor.includes('255, 255, 255') || bgColor.includes('rgb(255, 255, 255)')) {
    console.log('✅ FIXED: White background applied');
  } else {
    console.log('⚠️ Background color:', bgColor);
  }
} else {
  console.log('ℹ️ Dropdown not currently visible');
}

// Check text color
const gtLinks = document.querySelectorAll('.header-gtranslate a');
if (gtLinks.length > 0) {
  const linkStyles = window.getComputedStyle(gtLinks[0]);
  const textColor = linkStyles.color;
  console.log('Text color:', textColor);
  
  if (textColor.includes('51, 51, 51') || textColor.includes('rgb(51, 51, 51)')) {
    console.log('✅ FIXED: Dark text color applied');
  } else {
    console.log('⚠️ Text color might need adjustment:', textColor);
  }
}

console.log('\n💡 The page should refresh automatically with changes');
console.log('If not, try: Ctrl+F5 (hard refresh)');
