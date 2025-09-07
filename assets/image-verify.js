/**
 * Image Verification Script
 * Quick diagnostic tool to check image loading status
 */

function verifyImages() {
  console.log('🔍 Starting image verification...');
  
  // Check logo
  const logoImg = document.querySelector('header .header__heading img');
  if (logoImg) {
    console.log('✅ Logo element found:', logoImg.src);
    if (logoImg.complete && logoImg.naturalHeight !== 0) {
      console.log('✅ Logo loaded successfully');
    } else {
      console.log('❌ Logo failed to load');
    }
  } else {
    console.log('❌ Logo element not found');
  }
  
  // Check product images
  const productImages = document.querySelectorAll('.card__media img');
  console.log(`📦 Found ${productImages.length} product images`);
  
  productImages.forEach((img, index) => {
    if (img.complete && img.naturalHeight !== 0) {
      console.log(`✅ Product image ${index + 1} loaded: ${img.src}`);
    } else {
      console.log(`❌ Product image ${index + 1} failed: ${img.src}`);
    }
  });
  
  // Check for Shopify CDN URLs
  const allImages = document.querySelectorAll('img');
  const shopifyImages = Array.from(allImages).filter(img => 
    img.src.includes('cdn.shopify.com') || img.src.includes('shopify.com')
  );
  
  console.log(`🛍️ Found ${shopifyImages.length} Shopify CDN images`);
  
  // Check image fix script status
  if (window.ShopifyImageFix) {
    console.log('✅ Shopify Image Fix script loaded');
  } else {
    console.log('❌ Shopify Image Fix script not loaded');
  }
}

// Run verification on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', verifyImages);
} else {
  verifyImages();
}

// Also make it available globally for manual testing
window.verifyImages = verifyImages;

console.log('🔧 Image verification script loaded. Run verifyImages() in console anytime.');
