/**
 * Collection and Brand Data Validator
 * Tests if the collections referenced in brand_list actually exist
 */

document.addEventListener('DOMContentLoaded', function() {
  // Check if we're in theme editor
  if (window.Shopify && window.Shopify.designMode) {
    console.log('🔍 Running collection validation in theme editor...');
    
    // Find all brand lists in the page configuration
    const brandHandles = [
      "acer", "anker", "apple", "belkin", "green-lion", "hoco", 
      "honor", "hp", "infinix", "jbl", "lenovo", "mi", 
      "microsoft", "porodo", "samsung", "wiwu"
    ];
    
    console.log('📋 Checking these brand collections:', brandHandles);
    
    // Test each collection handle
    brandHandles.forEach(handle => {
      // Try to fetch collection data via AJAX
      fetch(`/collections/${handle}.json`)
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error(`Collection "${handle}" not found (${response.status})`);
          }
        })
        .then(data => {
          console.log(`✅ Collection "${handle}" exists:`, {
            title: data.collection?.title,
            productsCount: data.collection?.products_count,
            hasImage: !!data.collection?.image
          });
        })
        .catch(error => {
          console.warn(`❌ ${error.message}`);
          
          // Suggest creating the collection
          console.log(`💡 To fix: Create a collection with handle "${handle}" in Shopify admin`);
        });
    });
    
    // Also check for brand images in existing collections
    setTimeout(() => {
      console.log('\n🖼️ Checking for brand images in DOM...');
      const brandImages = document.querySelectorAll('[class*="ai-brand-bar"] img');
      
      brandImages.forEach((img, index) => {
        console.log(`Brand image ${index + 1}:`, {
          src: img.src,
          alt: img.alt,
          loaded: img.complete,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight
        });
      });
      
      const placeholders = document.querySelectorAll('[class*="ai-brand-bar"] [class*="placeholder"]');
      if (placeholders.length > 0) {
        console.log(`📦 Found ${placeholders.length} placeholder(s) - these brands may need images`);
      }
    }, 2000);
  }
});

// Also provide a global function for manual testing
window.testBrandCollections = function() {
  console.log('🧪 Manual brand collection test initiated...');
  
  // This can be called from browser console to test collections
  const testHandles = ["apple", "samsung", "microsoft"]; // Sample test
  
  testHandles.forEach(handle => {
    fetch(`/collections/${handle}`)
      .then(response => {
        console.log(`Collection "${handle}":`, response.status === 200 ? '✅ EXISTS' : '❌ MISSING');
      })
      .catch(error => {
        console.log(`Collection "${handle}": ❌ ERROR -`, error.message);
      });
  });
};
