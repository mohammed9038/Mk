(function(){
  'use strict';
  const DESKTOP_WIDTH = 990;
  const TEST_PARAM = 'dropdown_test';
  const state = { initialized:false, menus:[], listeners:[] };

  function isDesktop(){
    return window.innerWidth >= DESKTOP_WIDTH && matchMedia('(pointer:fine)').matches;
  }
  function getMenus(){
    return Array.from(document.querySelectorAll('.header__inline-menu header-menu'))
      .map(m=>({root:m, details:m.querySelector('details'), summary:m.querySelector('summary'), submenu:m.querySelector('.header__submenu')}))
      .filter(x=>x.details && x.summary && x.submenu);
  }
  function offAll(){ state.listeners.forEach(fn=>fn()); state.listeners=[]; }
  function closeOthers(except){ state.menus.forEach(m=>{ if(m.details!==except) m.details.removeAttribute('open'); }); }
  function add(el,ev,fn,opt){ el.addEventListener(ev,fn,opt); state.listeners.push(()=>el.removeEventListener(ev,fn,opt)); }

  function openMenu(m){ if(!isDesktop()) return; if(!m.details.hasAttribute('open')){ closeOthers(m.details); m.details.setAttribute('open',''); } }

  function setup(){
    if(!isDesktop()){ teardown(); return; }
    state.menus = getMenus();
    if(!state.menus.length) return;
    state.menus.forEach(m=>{
      let leaveTimer=null;
      function cancel(){ if(leaveTimer){ clearTimeout(leaveTimer); leaveTimer=null; } }
      function scheduleClose(){ leaveTimer=setTimeout(()=>m.details.removeAttribute('open'),180); }
      add(m.root,'mouseenter',()=>{ cancel(); openMenu(m); });
      add(m.root,'mouseleave',()=>{ cancel(); scheduleClose(); });
      add(m.summary,'focusin',()=>openMenu(m));
      add(m.summary,'keydown',e=>{ if(e.key==='Escape'){ m.details.removeAttribute('open'); m.summary.blur(); }});
      add(m.summary,'click',e=>{ if(isDesktop()){ e.preventDefault(); openMenu(m); }});
    });
    state.initialized=true;
    document.documentElement.classList.add('dropdown-hover-active');
  }
  function teardown(){ offAll(); state.menus=[]; state.initialized=false; document.documentElement.classList.remove('dropdown-hover-active'); }
  function reinit(){ teardown(); setup(); }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', setup); else setup();
  window.addEventListener('load', reinit);
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
