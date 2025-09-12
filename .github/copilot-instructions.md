# Copilot Instructions for AI Coding Agents

## Project Overview
This codebase is a Shopify theme export, structured for custom theme development and maintenance. It contains assets, configuration, layout, sections, snippets, and templates typical of Shopify Liquid-based themes.

## Architecture & Key Directories
- `assets/`: JavaScript, CSS/SCSS, images, and fonts. JS files often enhance UI/UX (e.g., `cart.js`, `cdz-megamenu.js`). SCSS files are sometimes paired with `.liquid` for dynamic theming.
- `layout/`, `templates/`, `sections/`, `snippets/`: Core Shopify theme structure. Liquid templates drive page rendering and dynamic content.
- `config/`, `locales/`: Theme settings and translations.

## Development Workflows
- **No build system detected**: Most assets are edited directly. If you add new JS/CSS, ensure references are updated in the relevant Liquid files.
- **Testing**: No automated test suite present. Manual browser testing is standard.
- **Debugging**: Use browser dev tools. For JS, check `assets/` for entry points. For Liquid, trace from `layout/` to `sections/` to `snippets/`.

## Project-Specific Conventions
- **SCSS/CSS**: Both `.scss` and `.scss.liquid` are used. Use `.scss.liquid` for variables or logic that depend on Shopify settings.
- **JS Naming**: `cdz-` prefix indicates Codazon custom scripts/styles. Keep this prefix for related features.
- **Liquid Structure**: Major page logic is in `sections/` and `snippets/`. Reuse snippets for shared UI.
- **No package.json**: Do not assume npm/yarn workflows.

## Integration & Dependencies
- **External JS/CSS**: Some assets (e.g., `bootstrap.min.js`) are included directly in `assets/`.
- **No backend code**: All logic is client-side or Liquid.

## Examples
- To add a new homepage feature: create a new section in `sections/`, add supporting assets to `assets/`, and reference them in the relevant Liquid files.
- To update cart behavior: edit `assets/cart.js` and test in the browser.

## Key Files
- `assets/application.js`, `assets/application.scss.liquid`: Main entry points for custom JS/CSS.
- `layout/theme.liquid`: Root template for all pages.
- `sections/`, `snippets/`: Where most dynamic and reusable logic lives.

## AI Agent Guidance
- Prefer editing existing files over introducing new build tools.
- Follow naming conventions for new assets and sections.
- When in doubt, trace feature flows from `layout/` → `sections/` → `snippets/` → `assets/`.
- Document any new conventions in this file for future agents.
