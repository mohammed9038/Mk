# THEME SCHEMA DIAGNOSTIC & FIX

## 🔍 CURRENT INVESTIGATION

Based on the screenshot showing "To preview your changes, color schemes must be defined in settings_data and settings_schema files" error, investigating potential causes:

### **Potential Issues:**
1. **Color Scheme Group Structure** - Schema definition may need adjustment
2. **Settings Data Synchronization** - Current settings may not reference color schemes properly  
3. **Field Validation** - Missing required fields or incorrect field types
4. **JSON Structure** - Syntax or structural issues

### **Current Schema Structure:**
```json
{
  "type": "color_scheme_group",
  "id": "color_schemes",
  "default": "scheme-1",
  "definition": [
    // Color definitions...
  ],
  "role": {
    // Role mappings...
  }
}
```

### **Current Data Structure:**
```json
{
  "current": {
    // Theme settings without color_schemes reference
  },
  "color_schemes": {
    "scheme-1": { "settings": {...} },
    "scheme-2": { "settings": {...} },
    // etc...
  }
}
```

## 🛠️ ATTEMPTED FIXES

1. ✅ **Added default to color_scheme_group** - May resolve validation
2. ✅ **Removed invalid presets** - Presets not supported in color_scheme_group
3. ✅ **Synchronized color values** - Current and preset values match
4. ❌ **Attempted current section reference** - Caused duplicate key error

## 🎯 NEXT STEPS

The issue may require a different approach:
- Color scheme group validation rules may be stricter
- Schema structure may need to match exact Shopify requirements
- Settings data may need specific formatting

Testing clean schema structure...
