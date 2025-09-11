/*
* Desktop Dropdown Hover - Definitive Fix (JavaScript)
* This script handles accessibility and edge cases for the CSS-based hover dropdown.
*/
(function() {
  'use strict';

  class HeaderMenu {
    constructor() {
      this.init();
    }

    init() {
      if (window.innerWidth < 990) return;

      this.menuContainer = document.querySelector('.header__inline-menu');
      if (!this.menuContainer) return;

      this.menuItems = this.menuContainer.querySelectorAll('.list-menu > li');
      this.menuItems.forEach(item => {
        const details = item.querySelector('details');
        if (details) {
          this.setupEventListeners(item, details);
        }
      });
    }

    setupEventListeners(listItem, details) {
      const summary = details.querySelector('summary');

      // Prevent default click behavior on desktop to allow hover to work
      if (summary) {
        summary.addEventListener('click', (event) => {
          if (window.innerWidth >= 990) {
            event.preventDefault();
          }
        });
      }

      // Handle focus for keyboard accessibility
      const links = listItem.querySelectorAll('a, summary');
      links.forEach(link => {
        link.addEventListener('focus', () => {
          this.onFocus(listItem);
        });
      });

      // Handle blur to close the menu
      const lastLink = this.getLastLink(listItem);
      if (lastLink) {
        lastLink.addEventListener('blur', () => {
          this.onBlur(listItem);
        });
      }
    }

    onFocus(listItem) {
      this.menuItems.forEach(item => {
        if (item === listItem) {
          item.classList.add('menu-item--active');
        } else {
          item.classList.remove('menu-item--active');
        }
      });
    }

    onBlur(listItem) {
      setTimeout(() => {
        if (!listItem.contains(document.activeElement)) {
          listItem.classList.remove('menu-item--active');
        }
      }, 10);
    }

    getLastLink(listItem) {
      const submenu = listItem.querySelector('.header__submenu');
      if (submenu) {
        const submenuLinks = submenu.querySelectorAll('a');
        if (submenuLinks.length > 0) {
          return submenuLinks[submenuLinks.length - 1];
        }
      }
      return listItem.querySelector('summary');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new HeaderMenu());
  } else {
    new HeaderMenu();
  }
})();
