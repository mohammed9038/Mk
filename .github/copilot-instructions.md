# Copilot Instructions for Shopify Theme Codebase

## Overview
This codebase is a customized Shopify theme, structured in the Dawn/OS2 style with a professional navigation system. It is designed for a multi-lingual, multi-currency storefront with advanced dropdown menus, mobile navigation, and GTranslate integration. The project is not a Node or Python app, but a collection of Liquid templates, CSS, and JavaScript assets.

## Key Directories & Files
- `layout/theme.liquid`: Main entry point; injects global CSS/JS including professional navigation system loaded early in `<head>`
- `sections/header.liquid`: Controls the header, navigation, and localization selectors (1100+ lines with backup variants)
- `sections/mobile-bottom-navigation.liquid`: Modern mobile bottom navigation with cart counter and search integration
- `assets/navigation-controller.js`: ES6 class-based navigation system (573 lines) replacing old dropdown scripts
- `assets/navigation-professional.css`: Mobile-first navigation styles with CSS custom properties
- `assets/dropdown-diagnostic.js`: Comprehensive 500-line diagnostic tool for debugging navigation issues
- `assets/base.css`: Core theme styles. Critical for dropdown visibility rules and theme structure

## Professional Navigation System (v2.0)
- **Architecture**: ES6 `NavigationController` class handles all navigation logic with error handling and accessibility
- **Loading**: Navigation CSS/JS loaded early in theme.liquid `<head>` with `defer` for performance
- **Structure**: Uses `<details>`/`<summary>` pattern with ARIA compliance and keyboard navigation
- **Mobile Support**: Responsive breakpoints at 990px with touch device detection
- **Integration**: GTranslate language selectors automatically detected and integrated

## Development Patterns & Debugging

### Navigation Debugging
- **Diagnostic Tool**: Use `dropdown-diagnostic.js` (paste in console or load via fetch) for comprehensive navigation system analysis
- **Test Files**: `dropdown-test.html` and `navigation-test.html` for isolated testing
- **Implementation Summary**: See `NAVIGATION_IMPLEMENTATION_SUMMARY.md` for detailed architecture overview

### File Organization
- Multiple header.liquid backups with dates (`header.backup.20250910.liquid`, etc.) - always use main `header.liquid`
- Professional drawer system: `assets/professional-drawer.js` with clean CSS variant
- Component-based CSS: Each feature has dedicated CSS files (e.g., `component-professional-drawer-clean.css`)

### Mobile Navigation
- Bottom navigation: Separate section with cart counter, search trigger, and language selector
- CSS custom properties for theming: `--mobile-nav-bg`, `--mobile-nav-text`, etc.
- Touch device detection and responsive breakpoint handling at 990px

## Customization & Debugging
- **Navigation Issues**: Check `window.navigationController.state` and use diagnostic tool
- **GTranslate**: Language selectors auto-detected; check section settings if missing
- **Console Logging**: Verbose debugging available; controlled by class-level DEBUG flags
- **CSS Specificity**: Navigation CSS injected with high specificity; avoid competing stylesheets

## Developer Workflows
- **No Build Step**: Direct Liquid/CSS/JS editing with immediate deployment
- **Testing**: Use `?dropdown_test=1` URL parameter for overlay testing (if implemented)
- **Version Control**: All changes committed to main branch; backup files preserved for reference
- **Performance**: CSS loaded with `media="print" onload="this.media='all'"` pattern for non-blocking

## Patterns & Conventions
- **ES6 Classes**: NavigationController pattern with initialization, state management, and error handling
- **CSS Architecture**: Mobile-first with CSS custom properties; component-based organization
- **Event Handling**: Event delegation for performance; touch device detection and responsive behavior
- **Accessibility**: ARIA compliance, keyboard navigation, and screen reader support built-in
- **Integration Points**: GTranslate auto-detection, cart drawer integration, search triggers

## Critical Integration Points
- **Theme Loading Order**: Navigation CSS/JS loaded early in `<head>`, before other components
- **Mobile Bottom Nav**: Conditionally loaded based on section settings with CSS custom properties
- **Language Selectors**: GTranslate integration with fallback to native Shopify localization
- **Cart Integration**: Real-time cart counter updates and drawer integration
- **Search Integration**: Mobile search triggers with predictive search integration

## Example: Navigation System Architecture
```javascript
// NavigationController is instantiated automatically
window.navigationController = new NavigationController();
// Access state: window.navigationController.state
// Check initialization: window.navigationController.initialized
// Debug: Use dropdown-diagnostic.js for full analysis
```

---

For any new AI agent: This is a professional-grade navigation implementation with comprehensive error handling and diagnostics. Always check `window.navigationController.state` and use the diagnostic tools before assuming navigation issues. The system uses modern ES6 patterns with extensive logging and state management.
