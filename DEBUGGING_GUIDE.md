# Shopify Theme Image Debugging Instructions

## Problem: Images not showing, theme settings not working

## Quick Diagnosis Steps:

### 1. Upload Theme to Shopify
Since you have all the files locally, you need to upload them to Shopify to test:

```bash
# Option A: Upload via Shopify CLI (if installed)
shopify theme push

# Option B: Upload manually via Admin
# 1. Go to Shopify Admin > Online Store > Themes
# 2. Actions > Upload theme
# 3. Upload your theme ZIP file
```

### 2. Check Browser Console
1. Open your live Shopify store
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Look for the diagnostic report that will show automatically
5. You should see: "🔍 Shopify Image Diagnostic Tool Started"

### 3. Manual Check
If console shows issues, try these manual fixes:

```javascript
// Run in browser console to check images
document.querySelectorAll('img').forEach((img, i) => {
  if (img.complete && img.naturalWidth === 0) {
    console.log(`Broken image ${i}:`, img.src);
  }
});

// Check if our fix scripts loaded
console.log('ShopifyImageFix loaded:', typeof ShopifyImageFix);
console.log('BrandImageFix loaded:', typeof BrandImageFix);
```

### 4. Common Issues & Solutions

#### Issue: Collections not showing images
**Solution:** 
- Ensure collections have featured images set
- Check Admin > Products > Collections > [Collection Name] > Featured Image

#### Issue: Scripts not loading
**Solution:**
- Check if assets uploaded correctly
- Verify script tags in theme.liquid

#### Issue: Theme settings not appearing
**Solution:**
- Check if theme is published/activated
- Verify settings_schema.json is valid

## Files Created/Modified

### New Files:
- `assets/shopify-image-fix.js` - Modern image loading fix
- `assets/brand-image-fix.js` - Brand bar specific fix  
- `assets/image-diagnostic.js` - Debugging tool
- `assets/collection-validator.js` - Collection validation
- `IMAGE_FIX_SUMMARY.md` - Technical documentation

### Modified Files:
- `layout/theme.liquid` - Added image fix scripts
- `blocks/ai_gen_block_3b08850.liquid` - Fixed collection access

## Next Steps

1. **Upload theme to Shopify first** - This is essential as local files don't work with Shopify liquid
2. **Check browser console** for diagnostic report
3. **Set up collections** with proper featured images
4. **Configure theme settings** in Shopify Admin

## Support

If issues persist after upload:
1. Share the diagnostic report from browser console
2. Provide screenshots of the actual vs expected results
3. Check if collections exist and have images in Shopify Admin

## Expected Results

After successful upload and setup:
- All images should load properly using modern Shopify CDN
- Brand bar should show collection featured images
- No placeholder images except where intended
- Console should show "✅ All image systems operational"
