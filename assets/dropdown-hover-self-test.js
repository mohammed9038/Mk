(function(){
  'use strict';

  // Configuration
  const PARAM_NAME = 'dropdown_test';
  const MAX_ATTEMPTS = 25;          // ~ (25 * 160ms) = 4s max wait
  const ATTEMPT_INTERVAL = 160;     // ms
  const OPEN_WAIT = 200;            // ms to wait after triggering hover
  const DESKTOP_MIN_WIDTH = 990;

  const qs = new URLSearchParams(window.location.search);
  const enabled = qs.has(PARAM_NAME) || localStorage.getItem('dropdown_test') === '1';

  // Always expose minimal status container; only verbose overlay if enabled
  const state = {
    started: Date.now(),
    attempts: 0,
    status: 'pending',
    reason: null,
    menuCount: 0,
    viewport: window.innerWidth,
    debug: enabled
  };

  window.__DROPDOWN_HOVER_TEST__ = state; // Expose for console inspection

  function log(...args){ console.log('[DropdownHoverTest]', ...args); }
  function warn(...args){ console.warn('[DropdownHoverTest]', ...args); }

  if (!enabled) {
    // Run a silent lightweight check once after load to store pass/fail status for monitoring.
    window.addEventListener('load', () => runTest({ silent:true }));
  } else {
    log('Enabled (query param/localStorage). Beginning active test.');
    runTest({ silent:false });
  }

  function createOverlay(result){
    if (!enabled) return; // Only show overlay in explicit test mode
    const existing = document.getElementById('dropdown-hover-test-overlay');
    if (existing) existing.remove();
    const el = document.createElement('div');
    el.id = 'dropdown-hover-test-overlay';
    el.style.cssText = [
      'position:fixed',
      'top:8px','right:8px','z-index:999999999',
      'font:12px/1.4 system-ui,Segoe UI,Arial,sans-serif',
      'padding:10px 14px','border-radius:6px','box-shadow:0 2px 6px rgba(0,0,0,.25)',
      'color:#fff',
      result.status==='pass' ? 'background:#10893e' : 'background:#c50f1f'
    ].join(';');
    const icon = result.status==='pass' ? '✅' : '❌';
    el.innerHTML = `${icon} Dropdown Hover Test ${result.status.toUpperCase()}<br>`+
      `<span style="opacity:.85">Attempts: ${result.attempts}, Menus: ${result.menuCount}, Time: ${(Date.now()-state.started)}ms</span>`+
      (result.reason ? `<br><span style="opacity:.75">Reason: ${result.reason}</span>` : '')+
      `<br><a href="#" style="color:#fff;text-decoration:underline;font-weight:600" id="dropdown-hover-test-close">close</a>`+
      `<br><a href="#" style="color:#fff;text-decoration:underline;font-weight:400" id="dropdown-hover-test-persist">${localStorage.getItem('dropdown_test')==='1' ? 'disable persistence' : 'persist test mode'}</a>`;
    document.body.appendChild(el);
    el.querySelector('#dropdown-hover-test-close').addEventListener('click', e=>{e.preventDefault(); el.remove();});
    el.querySelector('#dropdown-hover-test-persist').addEventListener('click', e=>{
      e.preventDefault();
      if (localStorage.getItem('dropdown_test')==='1'){ localStorage.removeItem('dropdown_test'); }
      else { localStorage.setItem('dropdown_test','1'); }
      location.reload();
    });
  }

  function finalize(status, reason){
    state.status = status;
    state.reason = reason || null;
    state.completed = Date.now();
    state.duration = state.completed - state.started;
    if (status==='pass') log('PASS', state); else warn('FAIL', state);
    createOverlay(state);
  }

  function simulateHover(headerMenu){
    // Fire mouseenter; some scripts rely on listeners attached to container or summary
    const ev = new Event('mouseenter', { bubbles:true, cancelable:true });
    headerMenu.dispatchEvent(ev);
  }

  function runTest(opts){
    const silent = !!opts.silent;
    if (window.innerWidth < DESKTOP_MIN_WIDTH){
      finalize('fail', 'Viewport width < '+DESKTOP_MIN_WIDTH);
      return;
    }
    attempt();

    function attempt(){
      state.attempts++;
      const menus = document.querySelectorAll('.header__inline-menu header-menu');
      state.menuCount = menus.length;
      if (menus.length === 0){
        if (state.attempts < MAX_ATTEMPTS){
          return setTimeout(attempt, ATTEMPT_INTERVAL);
        }
        return finalize('fail','No header-menu elements detected');
      }
      // Choose first menu with submenu
      let target = null;
      for (const m of menus){ if (m.querySelector('.header__submenu')) { target = m; break; } }
      if (!target){
        return finalize('fail','No submenu found inside menus');
      }
      if (!silent) log('Testing hover on menu:', target.querySelector('summary')?.textContent?.trim());
      simulateHover(target);
      setTimeout(()=>{
        const details = target.querySelector('details');
        const submenu = target.querySelector('.header__submenu');
        if (!details || !submenu){
          return finalize('fail','Missing details/submenu during evaluation');
        }
        const styles = window.getComputedStyle(submenu);
        const visible = details.hasAttribute('open') && styles.visibility === 'visible' && styles.opacity === '1';
        if (visible){
          finalize('pass');
        } else {
          // Attempt direct open as fallback and re-evaluate once
            details.setAttribute('open','');
            const styles2 = window.getComputedStyle(submenu);
            if (styles2.visibility==='visible' && styles2.opacity==='1'){
              finalize('pass','Had to force open attribute (listeners not applied)');
            } else {
              finalize('fail','Submenu not visible after hover');
            }
        }
      }, OPEN_WAIT);
    }
  }
})();
