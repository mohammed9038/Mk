# Mobile Navigation Customization Guide

## Overview
The mobile bottom navigation provides an app-like experience with Home, Search, Cart, and Account links. It automatically hides the header cart icon on mobile devices to avoid duplication.

## Quick Customization

### 1. Change Navigation Style
Edit the `mobile_nav_style` variable in `snippets/mobile-navigation.liquid`:

```liquid
{% assign mobile_nav_style = 'ios' %} <!-- Options: default, ios, android, dark, gradient -->
```

### 2. Hide/Show Text Labels
```liquid
{% assign show_text_labels = false %} <!-- Set to false to hide text labels -->
```

### 3. Change Navigation Height
```liquid
{% assign navigation_height = 'compact' %} <!-- Options: compact, normal, tall -->
```

## Advanced Styling

### Available Themes
Uncomment one of these sections in `assets/component-mobile-navigation.css`:

#### iOS Style
```css
.mobile-nav {
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}
```

#### Android Material Design
```css
.mobile-nav {
  background: #FFFFFF !important;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.15);
}
```

#### Dark Mode
```css
.mobile-nav {
  background: #1A1A1A !important;
  border-top: 1px solid #333;
}
```

#### Colorful Gradient
```css
.mobile-nav {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}
```

## Custom Colors

### Change Icon Colors
```css
.mobile-nav__link {
  color: #YOUR_COLOR !important;
}
```

### Change Background
```css
.mobile-nav {
  background: YOUR_BACKGROUND !important;
}
```

### Change Active State Color
```css
.mobile-nav__link.active {
  color: #YOUR_ACTIVE_COLOR !important;
}
```

### Change Cart Badge Color
```css
.mobile-nav__badge {
  background: #YOUR_BADGE_COLOR !important;
  color: #YOUR_BADGE_TEXT_COLOR !important;
}
```

## Features

✅ **Automatic Cart Hiding**: Header cart icon is automatically hidden on mobile when mobile nav is active
✅ **Responsive Design**: Only shows on screens smaller than 750px
✅ **Cart Badge**: Shows item count with automatic updates
✅ **Search Overlay**: Tap search to open full-screen search
✅ **Active States**: Highlights current page automatically
✅ **Accessibility**: Full ARIA support and keyboard navigation
✅ **Customizable Heights**: Compact, normal, or tall navigation
✅ **Theme Options**: Multiple pre-built style themes

## File Structure

- `assets/component-mobile-navigation.css` - All styling and themes
- `assets/mobile-navigation.js` - Interactive functionality
- `snippets/mobile-navigation.liquid` - HTML template and settings
- `snippets/icon-home.liquid` - Home icon
- `snippets/icon-search.liquid` - Search icon
- Uses existing `icon-cart.liquid`, `icon-cart-empty.liquid`, `icon-account.liquid`

## Browser Support

- iOS Safari 12+
- Chrome Mobile 70+
- Firefox Mobile 68+
- Samsung Internet 10+

## Performance Notes

- Uses CSS transforms for smooth animations
- Backdrop-filter for iOS-style blur effects
- Minimal JavaScript footprint
- Lazy-loaded search overlay
