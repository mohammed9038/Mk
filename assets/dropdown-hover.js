 (function(){
  'use strict';
  const DESKTOP_WIDTH = 990;
  const TEST_PARAM = 'dropdown_test';
  const state = { initialized:false, menus:[], listeners:[] };
  const DEBUG = true; // set false to silence logs

  function isDesktop(){
    return window.innerWidth >= DESKTOP_WIDTH && matchMedia('(pointer:fine)').matches;
  }
  function getMenus(){
    // Primary pattern (Dawn style markup)
    let menuElems = Array.from(document.querySelectorAll('.header__inline-menu header-menu'));
    // Fallback: any details element containing a .header__submenu
    if(!menuElems.length){
      const detailsWithSub = Array.from(document.querySelectorAll('details > .header__submenu'))
        .map(sm => sm.closest('details'))
        .filter(Boolean);
      menuElems = detailsWithSub.map(d => d.closest('header-menu') || d); // may be header-menu or bare details
    }
    // Additional fallback: any nav with class header__inline-menu then its direct details children
    if(!menuElems.length){
      menuElems = Array.from(document.querySelectorAll('nav.header__inline-menu details'));
    }
    // Broad fallback: any details inside a header element that has a summary and a nested ul (generic)
    if(!menuElems.length){
      menuElems = Array.from(document.querySelectorAll('header details'));
    }
    return menuElems.map(m=>{
      const details = m.tagName === 'DETAILS' ? m : m.querySelector('details');
      const summary = details ? details.querySelector('summary') : null;
      // Try multiple submenu patterns
      let submenu = null;
      if(details){
        submenu = details.querySelector('.header__submenu') || details.querySelector('ul.list-menu--disclosure') || details.querySelector('ul');
      }
      return {root: m, details, summary, submenu};
    }).filter(x=>x.details && x.summary && x.submenu);
  }
  function offAll(){ state.listeners.forEach(fn=>fn()); state.listeners=[]; }
  function closeOthers(except){ state.menus.forEach(m=>{ if(m.details!==except) m.details.removeAttribute('open'); }); }
  function add(el,ev,fn,opt){ el.addEventListener(ev,fn,opt); state.listeners.push(()=>el.removeEventListener(ev,fn,opt)); }
  function log(){ if(DEBUG) console.log('[dropdown-hover]', ...arguments); }
  function openMenu(m){
    if(!isDesktop()) return; 
    if(!m.details.hasAttribute('open')){ 
      closeOthers(m.details); 
      m.details.setAttribute('open','');
      // Fallback: force reflow then ensure attribute still present
      if(!m.details.hasAttribute('open')) m.details.setAttribute('open','');
      log('open', m.summary && m.summary.textContent && m.summary.textContent.trim());
    }
  }

  function injectCoreCSS(){
    if(document.getElementById('dropdown-hover-core-css')) return;
    const style=document.createElement('style');
    style.id='dropdown-hover-core-css';
    style.textContent = `@media screen and (min-width:${DESKTOP_WIDTH}px){
      /* Ensure open state always visible regardless of animations */
      .header__inline-menu header-menu details[open] > .header__submenu,
      nav.header__inline-menu details[open] > .header__submenu,
      .dropdown-hover-active details[open] > .header__submenu,
      .dropdown-hover-active details[open] > ul,
      details[open] > .header__submenu,
      details[open] > ul.list-menu--disclosure {
        opacity:1!important;
        transform:translateY(0)!important;
        visibility:visible!important;
        pointer-events:auto!important;
        display:block!important;
        position:absolute!important;
        z-index:999999!important;
        background:var(--color-background,#fff)!important;
        border:1px solid rgba(var(--color-foreground),.1)!important;
        box-shadow:0 4px 12px rgba(0,0,0,.15)!important;
        min-width:200px!important;
        top:100%!important;
        left:0!important;
      }
      .dropdown-hover-active details > ul {transition:opacity .18s ease, transform .18s ease;}
      /* Ensure parent positioning */
      .dropdown-hover-active details, .dropdown-hover-active header-menu {position:relative!important;}
    }`;
    document.head.appendChild(style);
  }

  function setup(){
    injectCoreCSS();
  if(!isDesktop()){ teardown(); return; }
  state.menus = getMenus();
    if(!state.menus.length){
      log('no menus yet', {
        inlineNavs: document.querySelectorAll('.header__inline-menu').length,
        headerMenus: document.querySelectorAll('.header__inline-menu header-menu').length,
        detailsWithSub: document.querySelectorAll('details > .header__submenu').length,
        headerDetails: document.querySelectorAll('header details').length
      });
      // Diagnostic: show first few candidate details outerHTML truncated
      const cand = Array.from(document.querySelectorAll('header details')).slice(0,3).map(d=>d.outerHTML.slice(0,120));
      if(cand.length) log('header details candidates (truncated):', cand);
      return; 
    }
    log('menus found', state.menus.length);
    state.menus.forEach(m=>{
      let leaveTimer=null;
      function cancel(){ if(leaveTimer){ clearTimeout(leaveTimer); leaveTimer=null; } }
      function scheduleClose(){ leaveTimer=setTimeout(()=>{ m.details.removeAttribute('open'); log('close', m.summary && m.summary.textContent && m.summary.textContent.trim()); },180); }

      // Root hover
      add(m.root,'mouseenter',()=>{ cancel(); openMenu(m); });
      add(m.root,'mouseleave',()=>{ cancel(); scheduleClose(); });
      // Details hover backup
      add(m.details,'mouseenter',()=>{ cancel(); openMenu(m); });
      add(m.details,'mouseleave',()=>{ cancel(); scheduleClose(); });
      // Summary specific events
      add(m.summary,'mouseenter',()=>{ cancel(); openMenu(m); });
      add(m.summary,'focusin',()=>openMenu(m));
      add(m.summary,'keydown',e=>{ if(e.key==='Escape'){ m.details.removeAttribute('open'); m.summary.blur(); log('escape close'); }});
      add(m.summary,'click',e=>{ if(isDesktop()){ e.preventDefault(); openMenu(m); }});
    });
    state.initialized=true;
    document.documentElement.classList.add('dropdown-hover-active');
  }
  function teardown(){ offAll(); state.menus=[]; state.initialized=false; document.documentElement.classList.remove('dropdown-hover-active'); }
  function reinit(){ teardown(); setup(); }

  // Retry mechanism if menus not yet present
  let attempts = 0; const MAX_ATTEMPTS = 25; const INTERVAL = 200;
  function attemptInit(){
    if(state.initialized) return; 
    setup();
    if(!state.initialized && attempts < MAX_ATTEMPTS){
      attempts++; setTimeout(attemptInit, INTERVAL);
    } else if(!state.initialized){
      log('giving up after attempts', attempts);
    }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', attemptInit); else attemptInit();
  window.addEventListener('load', reinit);

  // Continuous observer: capture late insertion beyond retry window
  if(window.MutationObserver){
    const observer = new MutationObserver(muts=>{
      if(state.initialized) return;
      let relevant = false;
      for(const m of muts){
        if(m.addedNodes){
          m.addedNodes.forEach(n=>{
            if(n.nodeType===1){
              if(n.matches && (n.matches('.header__inline-menu, header-menu, details') )) relevant = true;
              else if(n.querySelector && n.querySelector('.header__inline-menu, header-menu, details > .header__submenu')) relevant = true;
            }
          });
        }
      }
      if(relevant){
        log('mutation detected -> attempting init');
        attemptInit();
      }
    });
    observer.observe(document.documentElement || document.body, {childList:true, subtree:true});
  }
  window.addEventListener('resize', ()=>{ cancelAnimationFrame(reinit._raf); reinit._raf=requestAnimationFrame(reinit); });

  // Integrated lightweight test via ?dropdown_test=1
  const testEnabled = new URLSearchParams(location.search).has(TEST_PARAM);
  if(testEnabled){
    window.addEventListener('load',()=>{
      setTimeout(()=>{
        const res = { status:'fail', reason:'no menus', width:innerWidth };
        if(state.menus.length){
          const first=state.menus[0];
          first.root.dispatchEvent(new Event('mouseenter',{bubbles:true}));
          if(first.details.hasAttribute('open')){ res.status='pass'; delete res.reason; } else { res.reason='hover did not open'; }
        }
        showOverlay(res);
        console.log('[dropdown-hover test]',res);
      },150);
    });
  }
  function showOverlay(res){
    const el=document.createElement('div');
    el.style.cssText='position:fixed;top:8px;right:8px;z-index:999999;font:12px/1.4 system-ui,Segoe UI,Arial,sans-serif;padding:10px 14px;border-radius:6px;box-shadow:0 2px 6px rgba(0,0,0,.25);color:#fff;background:'+(res.status==='pass'?'#107c41':'#c50f1f');
    el.innerHTML=(res.status==='pass'?'✅':'❌')+' Hover '+res.status.toUpperCase()+(res.reason?'<br>'+res.reason:'')+'<br><a href="#" style="color:#fff;text-decoration:underline" id="close-hover-test">close</a>';
    document.body.appendChild(el);
    el.querySelector('#close-hover-test').addEventListener('click',e=>{e.preventDefault(); el.remove();});
  }
})();
