(function() {
    'use strict';
    
    let gtInitialized = false;
    let initAttempts = 0;
    const maxAttempts = 20;
    
    function initGTranslate() {
        if (gtInitialized) return;
        
        // Check if GTranslate script is loaded
        if (typeof window.gtranslateSettings === 'undefined') {
            initAttempts++;
            if (initAttempts < maxAttempts) {
                setTimeout(initGTranslate, 250);
            }
            return;
        }
        
        // Find the correct wrapper - use the one in header only
        const wrapper = document.querySelector('#header-gtranslate-wrapper');
        if (!wrapper) {
            console.warn('[GTranslate] No wrapper found in header');
            return;
        }
        
        // Check if widget already exists
        const existingWidget = wrapper.querySelector('select, .gt_selector');
        if (existingWidget) {
            console.log('[GTranslate] Widget already exists');
            gtInitialized = true;
            ensureVisibility(wrapper);
            return;
        }
        
        // Clear any duplicate widgets in other locations
        document.querySelectorAll('.gtranslate_wrapper:not(#header-gtranslate-wrapper)').forEach(duplicate => {
            duplicate.remove();
            console.log('[GTranslate] Removed duplicate container');
        });
        
        // Initialize widget
        wrapper.innerHTML = '';
        
        // Create a temporary script to force widget reload
        const script = document.createElement('script');
        script.src = 'https://cdn.gtranslate.net/widgets/latest/dropdown.js';
        script.onload = function() {
            gtInitialized = true;
            console.log('[GTranslate] Widget initialized successfully');
            ensureVisibility(wrapper);
        };
        script.onerror = function() {
            console.error('[GTranslate] Failed to load widget script');
        };
        document.head.appendChild(script);
    }
    
    function ensureVisibility(wrapper) {
        // Ensure the wrapper and its contents are visible
        wrapper.style.display = 'block';
        wrapper.style.visibility = 'visible';
        wrapper.style.opacity = '1';
        
        const widget = wrapper.querySelector('select, .gt_selector');
        if (widget) {
            widget.style.display = 'block';
            widget.style.visibility = 'visible';
            widget.style.opacity = '1';
            widget.style.pointerEvents = 'auto';
        }
    }
    
    // Prevent multiple initializations
    if (window.gtranslateInitialized) {
        console.log('[GTranslate] Already initialized, skipping');
        return;
    }
    window.gtranslateInitialized = true;
    
    // Prevent duplicate GTranslate widgets
    document.addEventListener('DOMContentLoaded', function() {
        // Remove any duplicate GTranslate containers that might be injected
        const checkDuplicates = setInterval(function() {
            const containers = document.querySelectorAll('.gtranslate_wrapper');
            if (containers.length > 1) {
                // Keep only the one in header
                containers.forEach(container => {
                    if (container.id !== 'header-gtranslate-wrapper') {
                        container.remove();
                        console.log('[GTranslate] Removed duplicate container:', container);
                    }
                });
            }
        }, 1000);
        
        // Stop checking after 10 seconds
        setTimeout(() => clearInterval(checkDuplicates), 10000);
    });
    
    // Start initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGTranslate);
    } else {
        setTimeout(initGTranslate, 100);
    }
    
    // Handle Shopify editor events
    document.addEventListener('shopify:section:load', function(e) {
        if (e.detail.sectionId && e.target.querySelector('.header__gtranslate')) {
            gtInitialized = false;
            setTimeout(initGTranslate, 100);
        }
    });
    
    document.addEventListener('shopify:section:reorder', function() {
        setTimeout(initGTranslate, 100);
    });
    
    console.log('✅ GTranslate Single Instance Initialization Script Loaded');
})();