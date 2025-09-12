(function() {
    'use strict';
    
    let gtInitialized = false;
    let initAttempts = 0;
    const maxAttempts = 20;
    
    function initGTranslate() {
        if (gtInitialized) return;
        
        // Check if GTranslate script is loaded
        if (typeof window.gtranslateSettings === 'undefined' || !document.querySelector('.gtranslate_wrapper')) {
            initAttempts++;
            if (initAttempts < maxAttempts) {
                setTimeout(initGTranslate, 250);
            }
            return;
        }
        
        // Force re-render of GTranslate widget
        const wrapper = document.querySelector('.gtranslate_wrapper');
        if (wrapper && !wrapper.querySelector('select')) {
            // Clear and re-initialize
            wrapper.innerHTML = '';
            
            // Create a temporary script to force widget reload
            const script = document.createElement('script');
            script.src = 'https://cdn.gtranslate.net/widgets/latest/dropdown.js';
            script.onload = function() {
                gtInitialized = true;
                console.log('[GTranslate] Widget initialized successfully');
                
                // Ensure visibility
                setTimeout(() => {
                    const gtSelect = wrapper.querySelector('select');
                    if (gtSelect) {
                        gtSelect.style.display = 'block';
                        gtSelect.style.visibility = 'visible';
                        gtSelect.style.opacity = '1';
                    }
                }, 100);
            };
            document.head.appendChild(script);
        } else if (wrapper && wrapper.querySelector('select')) {
            gtInitialized = true;
            // Ensure existing widget is visible
            const gtSelect = wrapper.querySelector('select');
            if (gtSelect) {
                gtSelect.style.display = 'block';
                gtSelect.style.visibility = 'visible';
                gtSelect.style.opacity = '1';
            }
        }
    }
    
    // Start initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGTranslate);
    } else {
        setTimeout(initGTranslate, 100);
    }
    
    // Re-initialize on Shopify editor events
    document.addEventListener('shopify:section:load', initGTranslate);
    document.addEventListener('shopify:section:reorder', initGTranslate);
    
    console.log('✅ GTranslate initialization script loaded');
})();