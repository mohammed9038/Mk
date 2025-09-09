// Mobile Navigation Debug and Force Display Script
// This script will identify and fix mobile navigation display issues

(function() {
  'use strict';
  
  // Debug configuration
  const DEBUG_MODE = true;
  const FORCE_DISPLAY = true;
  
  // Log function for debugging
  function debugLog(message, data = null) {
    if (DEBUG_MODE) {
      console.log(`[Mobile Nav Debug] ${message}`, data || '');
    }
  }
  
  // Create debug panel
  function createDebugPanel() {
    if (!DEBUG_MODE) return;
    
    const panel = document.createElement('div');
    panel.id = 'mobile-nav-debug';
    panel.style.cssText = `
      position: fixed !important;
      top: 10px !important;
      right: 10px !important;
      background: rgba(0, 0, 0, 0.9) !important;
      color: white !important;
      padding: 10px !important;
      font-size: 12px !important;
      z-index: 99999 !important;
      border-radius: 5px !important;
      font-family: monospace !important;
      max-width: 300px !important;
      max-height: 200px !important;
      overflow-y: auto !important;
      line-height: 1.3 !important;
    `;
    
    document.body.appendChild(panel);
    return panel;
  }
  
  // Update debug panel
  function updateDebugPanel(info) {
    const panel = document.getElementById('mobile-nav-debug');
    if (panel) {
      panel.innerHTML = `
        <strong>Mobile Nav Debug</strong><br>
        Screen Width: ${window.innerWidth}px<br>
        Mobile Navs Found: ${info.navElements.length}<br>
        Visible Navs: ${info.visibleNavs}<br>
        CSS Display: ${info.cssDisplay}<br>
        Settings Enabled: ${info.settingsEnabled}<br>
        Forced Render: ${info.forcedRender}<br>
        Has Emergency Nav: ${info.hasEmergencyNav}<br>
        <hr style="margin: 5px 0;">
        <button onclick="window.forceMobileNavDisplay()" style="background: #007acc; color: white; border: none; padding: 3px 6px; cursor: pointer; font-size: 10px;">Force Display</button>
      `;
    }
  }
  
  // Analyze mobile navigation
  function analyzeMobileNav() {
    const navElements = document.querySelectorAll('.mobile-nav, nav[class*="mobile"], *[class*="mobile-nav"]');
    let visibleNavs = 0;
    let cssDisplay = 'unknown';
    let settingsEnabled = 'unknown';
    let forcedRender = false;
    let hasEmergencyNav = false;
    
    navElements.forEach((nav, index) => {
      const styles = window.getComputedStyle(nav);
      const isVisible = styles.display !== 'none' && styles.visibility !== 'hidden' && styles.opacity !== '0';
      
      if (isVisible) visibleNavs++;
      if (index === 0) cssDisplay = styles.display;
      
      if (nav.hasAttribute('data-forced-render')) forcedRender = true;
      if (nav.classList.contains('emergency-mobile-nav')) hasEmergencyNav = true;
      
      debugLog(`Nav ${index + 1}:`, {
        classes: nav.className,
        display: styles.display,
        visibility: styles.visibility,
        opacity: styles.opacity,
        position: styles.position,
        bottom: styles.bottom,
        zIndex: styles.zIndex,
        isVisible: isVisible
      });
    });
    
    return {
      navElements,
      visibleNavs,
      cssDisplay,
      settingsEnabled,
      forcedRender,
      hasEmergencyNav
    };
  }
  
  // Force mobile navigation display
  function forceMobileNavDisplay() {
    debugLog('Forcing mobile navigation display...');
    
    // Method 1: Show existing navigation
    const navElements = document.querySelectorAll('.mobile-nav, nav[class*="mobile"], *[class*="mobile-nav"]');
    navElements.forEach((nav, index) => {
      nav.style.cssText += `
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        position: fixed !important;
        bottom: 0 !important;
        left: 0 !important;
        right: 0 !important;
        width: 100% !important;
        height: 88px !important;
        background: #ffffff !important;
        border-top: 1px solid #e0e0e0 !important;
        z-index: 9999 !important;
        pointer-events: auto !important;
      `;
      debugLog(`Forced display on nav ${index + 1}`);
    });
    
    // Method 2: Create emergency navigation if none exist
    if (navElements.length === 0) {
      debugLog('No navigation elements found, creating emergency navigation...');
      createEmergencyNav();
    }
    
    // Method 3: Ensure body padding for navigation space
    document.body.style.paddingBottom = '100px';
    
    // Mark as rendered
    document.body.classList.add('mobile-nav-rendered');
    
    debugLog('Force display completed');
    
    // Refresh debug info
    setTimeout(() => {
      const info = analyzeMobileNav();
      updateDebugPanel(info);
    }, 100);
  }
  
  // Create emergency navigation
  function createEmergencyNav() {
    const emergencyNav = document.createElement('nav');
    emergencyNav.className = 'mobile-nav emergency-mobile-nav';
    emergencyNav.setAttribute('data-emergency', 'true');
    emergencyNav.innerHTML = `
      <ul class="mobile-nav__list" style="
        display: grid !important;
        grid-template-columns: repeat(4, 1fr) !important;
        align-items: center !important;
        height: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        list-style: none !important;
      ">
        <li class="mobile-nav__item" style="display: flex; align-items: center; justify-content: center; height: 100%;">
          <a href="/" style="display: flex; flex-direction: column; align-items: center; text-decoration: none; color: #333; padding: 8px;">
            <div style="width: 24px; height: 24px; margin-bottom: 4px;">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </div>
            <span style="font-size: 10px;">Home</span>
          </a>
        </li>
        <li class="mobile-nav__item" style="display: flex; align-items: center; justify-content: center; height: 100%;">
          <button style="display: flex; flex-direction: column; align-items: center; background: none; border: none; color: #333; padding: 8px; cursor: pointer;">
            <div style="width: 24px; height: 24px; margin-bottom: 4px;">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </div>
            <span style="font-size: 10px;">Search</span>
          </button>
        </li>
        <li class="mobile-nav__item" style="display: flex; align-items: center; justify-content: center; height: 100%;">
          <a href="/cart" style="display: flex; flex-direction: column; align-items: center; text-decoration: none; color: #333; padding: 8px; position: relative;">
            <div style="width: 24px; height: 24px; margin-bottom: 4px;">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </div>
            <span style="font-size: 10px;">Cart</span>
          </a>
        </li>
        <li class="mobile-nav__item" style="display: flex; align-items: center; justify-content: center; height: 100%;">
          <a href="/account" style="display: flex; flex-direction: column; align-items: center; text-decoration: none; color: #333; padding: 8px;">
            <div style="width: 24px; height: 24px; margin-bottom: 4px;">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <span style="font-size: 10px;">Account</span>
          </a>
        </li>
      </ul>
    `;
    
    emergencyNav.style.cssText = `
      display: block !important;
      position: fixed !important;
      bottom: 0 !important;
      left: 0 !important;
      right: 0 !important;
      width: 100% !important;
      height: 88px !important;
      background: #ffffff !important;
      border-top: 1px solid #e0e0e0 !important;
      z-index: 10000 !important;
      pointer-events: auto !important;
    `;
    
    document.body.appendChild(emergencyNav);
    debugLog('Emergency navigation created and appended');
  }
  
  // Initialize debug system
  function initDebugSystem() {
    if (!DEBUG_MODE) return;
    
    // Create debug panel
    const panel = createDebugPanel();
    
    // Make force function globally available
    window.forceMobileNavDisplay = forceMobileNavDisplay;
    
    // Initial analysis
    const info = analyzeMobileNav();
    updateDebugPanel(info);
    
    // Auto-force on mobile if no visible navigation
    if (window.innerWidth <= 749 && info.visibleNavs === 0 && FORCE_DISPLAY) {
      debugLog('No visible mobile navigation detected, auto-forcing display...');
      setTimeout(forceMobileNavDisplay, 500);
    }
    
    // Monitor for changes
    const observer = new MutationObserver(() => {
      setTimeout(() => {
        const newInfo = analyzeMobileNav();
        updateDebugPanel(newInfo);
      }, 100);
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });
    
    debugLog('Debug system initialized');
  }
  
  // Wait for DOM and initialize
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initDebugSystem);
    } else {
      initDebugSystem();
    }
  }
  
  // Start the debug system
  init();
  
  debugLog('Mobile Navigation Debug Script Loaded');
  
})();
