# Search Bar Customization Guide

## Overview
The desktop search bar in the header now has comprehensive styling options and improved centering. The search bar can be positioned left, center, or right in the header with full control over colors, text, and appearance.

## Fixed Issues

### ✅ Center Position
- **Problem**: Search bar was not properly centered when "center" position was selected
- **Solution**: Updated CSS Grid layout to properly center the search bar
- **Result**: Search bar now perfectly centers between logo and cart/account icons

### ✅ Text Colors
- **Problem**: Text color didn't adapt to different background colors
- **Solution**: Dynamic color system based on background choice
- **Result**: Text automatically adjusts for optimal readability

### ✅ Placeholder Text
- **Problem**: No control over placeholder text
- **Solution**: Added custom placeholder text setting
- **Result**: Can customize placeholder text and make it italic

## Customization Options

### Position Control
- **Left**: Search bar appears on the left side of the header
- **Center**: Search bar appears centered between logo and icons
- **Right**: Search bar appears on the right side of the header

### Background Styles
- **Default**: Uses theme's default background
- **Transparent**: Fully transparent background
- **White**: White background with subtle shadow
- **Dark**: Dark background for contrast
- **Accent**: Uses theme's accent color

### Text Customization
- **Font Size**: 12px to 18px
- **Placeholder Text**: Custom placeholder message
- **Italic Placeholder**: Toggle italic style for placeholder
- **Dynamic Colors**: Text color adapts to background choice

### Border & Shape
- **Border Radius**: 0px to 50px for rounded corners
- **Border Width**: 1px to 5px thickness
- **Border Color**: Default or accent color
- **Width Control**: 250px to 700px

### Interactive Effects
- **Simple**: Basic focus outline
- **Glow Effect**: Glowing border on focus
- **Scale Effect**: Slight scale animation on focus
- **Focus Width**: 1px to 4px focus outline

### Button Styling
- **Subtle**: Light background with transparency
- **Filled**: Solid button with accent color
- **Outline**: Transparent with colored border
- **Icon Size**: 12px to 24px
- **Button Padding**: Adjustable spacing

## Technical Improvements

### CSS Grid Layout
```css
.header--has-search-center {
  grid-template-areas: "heading search-center icons";
  grid-template-columns: auto 1fr auto;
}
```

### Dynamic Text Colors
```css
color: {% if section.settings.search_bar_background == 'dark' %}rgba(255, 255, 255, 0.9)
       {% elsif section.settings.search_bar_background == 'white' %}rgba(0, 0, 0, 0.8)
       {% else %}rgb(var(--color-foreground)){% endif %};
```

### Responsive Behavior
- Mobile: Search bar hides, search icon shows
- Tablet: Reduced width and padding
- Desktop: Full functionality with all options

## How to Customize

1. **Go to**: Theme Editor → Header Section
2. **Find**: "Search Bar Styling" section
3. **Adjust**: 
   - Position: Left/Center/Right
   - Background: Choose from 5 options
   - Width: Drag slider 250-700px
   - Colors: Select border and text options
   - Effects: Choose focus animation
   - Text: Add custom placeholder

## Color Combinations

### Recommended Settings:

#### Modern Clean Look
- Background: White
- Border: Default
- Border Radius: 25px
- Focus Effect: Glow

#### Dark Theme
- Background: Dark
- Border: Accent
- Border Radius: 20px
- Focus Effect: Scale

#### Minimal Design
- Background: Transparent
- Border: Default
- Border Radius: 5px
- Focus Effect: Simple

#### Brand Accent
- Background: Accent
- Border: Accent
- Border Radius: 30px
- Focus Effect: Glow

## Browser Compatibility
- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## Performance Notes
- CSS transforms for smooth animations
- Backdrop-filter for modern blur effects
- Optimized for mobile performance
