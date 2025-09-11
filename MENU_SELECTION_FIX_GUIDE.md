# Menu Selection Fix Guide

## The Issue
You reported that the navigation fixes only work with "main-menu" and not with other menus selected in theme settings. This suggests the navigation system needs to be more flexible in detecting different menu structures.

## Root Cause Analysis

### 1. **Menu Selection Process**
- Theme Settings → Header → Menu dropdown
- This sets `section.settings.menu` to your selected menu handle
- The code should dynamically load the selected menu, not just "main-menu"

### 2. **Current Code Status**
✅ **Fixed:** The `header-dropdown-menu.liquid` snippet properly uses `section.settings.menu`
✅ **Fixed:** NavigationController can detect dropdowns dynamically  
✅ **Fixed:** CSS rules work with any menu structure
❓ **Question:** Are you seeing the actual menu items or test menu items?

## Diagnostic Steps

### Step 1: Check Your Menu Setup
1. Go to **Shopify Admin → Online Store → Navigation**
2. Verify you have a menu with items (not empty)
3. Note the menu name/handle

### Step 2: Verify Theme Settings
1. Go to **Theme Customization → Header section**
2. Check the "Menu" dropdown selection
3. Ensure it matches your created menu

### Step 3: Run Diagnostic Test
Open browser console and paste:
```javascript
// Quick menu diagnostic
fetch('/menu-selection-diagnostic.js').then(r=>r.text()).then(eval);
```

Or manually check:
```javascript
// Check what menu is selected
const menuItems = document.querySelectorAll('.header__inline-menu li');
console.log(`Found ${menuItems.length} menu items:`);

menuItems.forEach((item, index) => {
    const text = item.textContent.trim();
    const isTest = text.includes('Test Menu');
    console.log(`${index + 1}. ${text} ${isTest ? '⚠️ TEST' : '✅ REAL'}`);
});
```

## Symptoms & Solutions

### Symptom 1: Seeing "Test Menu" Items
**Problem:** Menu fallback is active
**Solutions:**
- Create menu items in Shopify Navigation
- Select proper menu in theme settings
- Refresh the page after changes

### Symptom 2: "Menu not found" Error Message
**Problem:** Selected menu doesn't exist
**Solutions:**
- Check menu exists in Shopify admin
- Verify menu handle matches theme setting
- Try selecting a different menu

### Symptom 3: Empty Navigation
**Problem:** Menu exists but has no items
**Solutions:**
- Add items to your menu in Shopify admin
- Check menu visibility settings
- Ensure menu items are not hidden

### Symptom 4: Dropdowns Not Working
**Problem:** NavigationController not detecting dropdowns
**Solutions:**
- Run: `window.navigationController.refreshNavigation()`
- Check console for JavaScript errors
- Verify CSS classes are correct

## Technical Details

### How Menu Selection Works
```liquid
{%- liquid
  assign selected_menu = section.settings.menu
  assign menu_handle = section.settings.menu
  assign menu_links_exist = false
  
  if selected_menu and selected_menu != blank
    if selected_menu.links and selected_menu.links.size > 0
      assign menu_links_exist = true
    endif
  elsif menu_handle and menu_handle != blank
    assign menu_from_handle = linklists[menu_handle]
    if menu_from_handle and menu_from_handle.links.size > 0
      assign selected_menu = menu_from_handle
      assign menu_links_exist = true
    endif
  endif
-%}
```

### NavigationController Flexibility
The NavigationController now uses multiple detection strategies:
1. `header-menu details` (custom elements)
2. `.header__inline-menu details` (class-based)
3. `details[id*="HeaderMenu"]` (ID-based)
4. Generic `details` within navigation (fallback)

## Verification Checklist

- [ ] Menu exists in Shopify admin with items
- [ ] Correct menu selected in theme customization  
- [ ] No "Test Menu" labels visible
- [ ] No "Menu not found" error messages
- [ ] Dropdowns work when clicked
- [ ] NavigationController detects dropdowns
- [ ] Console shows no JavaScript errors

## Common Mistakes

1. **Empty Menu:** Menu exists but has no menu items
2. **Wrong Selection:** Different menu selected in theme vs. expected
3. **Handle Mismatch:** Menu handle doesn't match theme setting value
4. **Cache Issues:** Old menu cached, need hard refresh
5. **JavaScript Errors:** Navigation script not loading properly

## Quick Fixes

### Fix 1: Reset Menu Selection
```liquid
<!-- In theme customization, try: -->
1. Select "None" for menu
2. Save
3. Select your desired menu
4. Save again
```

### Fix 2: Refresh Navigation
```javascript
// In browser console:
if (window.navigationController) {
    window.navigationController.refreshNavigation();
    console.log('✅ Navigation refreshed');
}
```

### Fix 3: Create Test Menu
```text
Shopify Admin → Navigation → Create menu
- Name: "Main Navigation"
- Add items: Home, Products, About, Contact
- Set some items to have sub-items for dropdown testing
```

### Fix 4: Debug Console Commands
```javascript
// Check current state
window.navigationController.debugNavigation();

// Manual refresh
window.navigationController.refreshNavigation();

// Test dropdown
document.querySelector('header-menu details summary')?.click();
```

## Files Modified
- `snippets/header-dropdown-menu.liquid` - Enhanced menu selection
- `assets/navigation-controller.js` - Flexible dropdown detection
- `assets/base.css` - CSS compatibility
- `layout/theme.liquid` - GTranslate integration

## Next Steps
1. **Run diagnostic script** to identify exact issue
2. **Check Shopify admin** for menu setup
3. **Verify theme settings** for correct menu selection
4. **Test navigation** after any changes
5. **Clear cache** if problems persist

The code is now menu-agnostic and should work with any menu you select in theme settings. The issue is likely in the Shopify admin menu setup or theme setting selection rather than the code itself.
