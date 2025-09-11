# Copilot Instructions for Shopify Theme Codebase

## Overview
This codebase is a customized Shopify theme, structured in the Dawn/OS2 style. It is designed for a multi-lingual, multi-currency storefront with custom navigation, localization, and aggressive dropdown menu logic. The project is not a Node or Python app, but a collection of Liquid templates, CSS, and JavaScript assets.

## Key Directories & Files
- `layout/theme.liquid`: Main entry point; injects global CSS/JS and sets up the page shell.
- `sections/header.liquid`: Controls the header, navigation, and localization selectors. Navigation menus are rendered via `{% render 'header-dropdown-menu' %}`.
- `snippets/header-dropdown-menu.liquid`: Renders the actual navigation structure, using nested `<details>` and `<summary>` for dropdowns.
- `assets/dropdown-hover.js`: Main dropdown logic (now click-based, not hover). Handles menu open/close, keyboard, and accessibility.
- `assets/base.css`: Core theme styles. Dropdown visibility is controlled by both JS and CSS rules here.
- `locales/`: Contains translation files for multi-language support.

## Navigation & Dropdowns
- Navigation menus use `<details>` and `<summary>` for dropdowns. The JS (`dropdown-hover.js`) attaches click handlers to toggle dropdowns, closes on outside click, and supports keyboard navigation.
- CSS for dropdowns is injected at runtime by the JS for maximum specificity. If you change menu structure, update selectors in both JS and CSS.

## Localization
- Language and country selectors are controlled by header section settings (`enable_language_selector`, `enable_country_selector`).
- The GTranslate widget is injected if enabled. If missing, check section settings in `header.liquid` and the theme customizer.

## Customization & Debugging
- To test dropdown logic, append `?dropdown_test=1` to the URL for a self-test overlay.
- Console logs are verbose for debugging. Set `DEBUG = false` in `dropdown-hover.js` to silence.
- If dropdowns break, inspect the DOM for `<details>` and `<summary>` structure and update selectors in `dropdown-hover.js`.

## Developer Workflows
- No build step: edit Liquid, CSS, and JS directly.
- Use `git` for version control. All changes should be committed and pushed to the main branch.
- For localization or menu issues, always check both section settings and the actual DOM output.

## Patterns & Conventions
- All dropdown logic is consolidated in `assets/dropdown-hover.js`.
- Avoid multiple competing dropdown scripts or CSS overrides.
- Use click, not hover, for dropdowns for reliability and accessibility.
- Keep all global overrides in `theme.liquid` or `base.css` for easy discovery.

## Example: Adding a New Dropdown Menu
1. Add a new menu item in Shopify admin and assign it to the header menu.
2. Ensure it renders as a `<details>` with a `<summary>` and a submenu `<ul>` in the DOM.
3. No JS changes needed unless the structure changes.

---

For any new AI agent: Always check the actual DOM output and section settings before assuming a pattern. If dropdowns or localization break, start by inspecting the rendered HTML and the relevant section settings.
