/* GTranslate Enhancements: remove placeholder options and keep dropdown clean */
(function () {
  function cleanGTranslateDropdown() {
    try {
      // Remove placeholder/empty/disabled from native selects
      var selects = document.querySelectorAll('.header-gtranslate select, .goog-te-combo');
      selects.forEach(function (select) {
        var removed = false;
        Array.from(select.options).forEach(function (opt) {
          var txt = (opt.textContent || '').trim().toLowerCase();
          if (!opt.value || opt.disabled || txt === '' || txt === 'select language' || txt === 'select') {
            opt.remove();
            removed = true;
          }
        });
        if (removed) {
          // If value became empty, set to first available
          if (!select.value && select.options.length) {
            select.value = select.options[0].value;
            select.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      });

      // Remove placeholder anchors inside gtranslate custom dropdowns
      var links = document.querySelectorAll('.header-gtranslate .gt_dropdown a, .header-gtranslate .gt_switcher a');
      links.forEach(function (a) {
        var txt = (a.textContent || '').trim().toLowerCase();
        var href = a.getAttribute('href') || '';
        if (txt === '' || txt === 'select language' || href === '#' || !href) {
          a.remove();
        }
      });

      // Add a class to the currently active language if detectable
      var htmlLang = (document.documentElement.getAttribute('lang') || 'en').toLowerCase();
      links = document.querySelectorAll('.header-gtranslate .gt_dropdown a, .header-gtranslate .gt_switcher a');
      links.forEach(function (a) {
        var t = (a.textContent || '').trim().toLowerCase();
        var isMatch = htmlLang.startsWith('ar') ? t.includes('arab') : t.includes('english') || t.includes('ingl');
        if (isMatch) a.classList.add('gt_current_lang');
      });
    } catch (e) {
      // Silent failure; avoid console noise in production
    }
  }

  function scheduleCleanups() {
    cleanGTranslateDropdown();
    setTimeout(cleanGTranslateDropdown, 400);
    setTimeout(cleanGTranslateDropdown, 1000);
    setTimeout(cleanGTranslateDropdown, 2000);
  }

  document.addEventListener('DOMContentLoaded', function () {
    scheduleCleanups();

    // Clean when user interacts with the widget
    document.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('.header-gtranslate')) {
        setTimeout(cleanGTranslateDropdown, 50);
      }
    }, true);

    // Observe DOM changes around the widget
    var containers = document.querySelectorAll('.header-gtranslate, .gtranslate_wrapper');
    containers.forEach(function (el) {
      var mo = new MutationObserver(function () { setTimeout(cleanGTranslateDropdown, 0); });
      mo.observe(el, { childList: true, subtree: true, attributes: true });
    });
  });

  // Expose for debugging
  window.cleanGTranslateDropdown = cleanGTranslateDropdown;
})();
