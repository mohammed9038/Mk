/**
 * Browser Console Image Fix Test Script
 * Copy and paste this into your browser console to test image fixing
 */

// Test function to validate image fix functionality
function testImageFix() {
    console.log('🧪 Starting Image Fix Test...');
    
    // Test 1: Check if ImageLoadingFix is loaded
    if (typeof ImageLoadingFix !== 'undefined') {
        console.log('✅ ImageLoadingFix class is available');
    } else {
        console.error('❌ ImageLoadingFix class not found - script may not be loaded');
        return;
    }
    
    // Test 2: Create test images
    const testContainer = document.createElement('div');
    testContainer.id = 'image-fix-test-container';
    testContainer.style.cssText = 'position: fixed; top: 10px; right: 10px; width: 300px; background: white; border: 2px solid #333; padding: 10px; z-index: 9999; max-height: 400px; overflow-y: auto;';
    
    testContainer.innerHTML = `
        <h3>🖼️ Image Fix Test</h3>
        <button onclick="document.getElementById('image-fix-test-container').remove()">Close</button>
        <div id="test-results"></div>
        <br>
        <h4>Test Images:</h4>
        <img src="https://nonexistent-domain.com/broken.jpg" alt="Broken 1" style="width: 50px; height: 50px; border: 1px solid red; margin: 5px;">
        <img src="/missing-local-image.png" alt="Broken 2" style="width: 50px; height: 50px; border: 1px solid red; margin: 5px;">
        <img src="https://via.placeholder.com/50" alt="Valid" style="width: 50px; height: 50px; border: 1px solid green; margin: 5px;">
    `;
    
    document.body.appendChild(testContainer);
    
    // Test 3: Monitor image loading
    let testResults = [];
    const resultsDiv = document.getElementById('test-results');
    
    function addResult(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        testResults.push(`[${timestamp}] ${message}`);
        resultsDiv.innerHTML = testResults.slice(-10).map(r => 
            `<div style="font-size: 11px; margin: 2px 0;">${r}</div>`
        ).join('');
        console.log(`🧪 Test: ${message}`);
    }
    
    addResult('Test container created');
    
    // Test 4: Check for broken images after a delay
    setTimeout(() => {
        const testImages = testContainer.querySelectorAll('img');
        let brokenCount = 0;
        let fixedCount = 0;
        
        testImages.forEach((img, index) => {
            if (img.complete && img.naturalHeight === 0) {
                brokenCount++;
                addResult(`Image ${index + 1} broken: ${img.src.substring(0, 30)}...`);
            } else if (img.src.includes('placeholder') || img.style.background) {
                fixedCount++;
                addResult(`Image ${index + 1} fixed/placeholder applied`);
            }
        });
        
        addResult(`Results: ${brokenCount} broken, ${fixedCount} fixed`);
        
        if (brokenCount === 0) {
            addResult('✅ All images handled correctly!');
        } else {
            addResult('⚠️ Some images may need fixing');
        }
    }, 3000);
    
    console.log('🧪 Test UI created in top-right corner. Check for results in 3 seconds.');
}

// Test function for checking existing images on page
function checkExistingImages() {
    console.log('🔍 Checking existing images on page...');
    
    const images = document.querySelectorAll('img');
    let stats = {
        total: images.length,
        loaded: 0,
        broken: 0,
        loading: 0
    };
    
    images.forEach((img, index) => {
        if (img.complete) {
            if (img.naturalHeight === 0) {
                stats.broken++;
                console.warn(`🚫 Broken image ${index + 1}:`, img.src);
            } else {
                stats.loaded++;
                console.log(`✅ Loaded image ${index + 1}:`, img.src.substring(0, 50) + '...');
            }
        } else {
            stats.loading++;
            console.log(`⏳ Loading image ${index + 1}:`, img.src.substring(0, 50) + '...');
        }
    });
    
    console.log('📊 Image Stats:', stats);
    return stats;
}

// Test function to simulate broken images
function simulateBrokenImages() {
    console.log('🎭 Simulating broken images...');
    
    const brokenUrls = [
        'https://fake-cdn.example.com/broken1.jpg',
        '/nonexistent/product-image.webp',
        'https://missing-domain-12345.com/image.png'
    ];
    
    brokenUrls.forEach((url, index) => {
        const img = document.createElement('img');
        img.src = url;
        img.alt = `Test broken image ${index + 1}`;
        img.style.cssText = 'width: 100px; height: 100px; border: 2px solid red; margin: 10px; position: fixed; top: ' + (100 + index * 120) + 'px; left: 10px; z-index: 9998;';
        img.title = 'Test broken image - should be fixed by image-fix.js';
        document.body.appendChild(img);
        
        console.log(`🎭 Added broken test image: ${url}`);
    });
    
    console.log('🎭 Added 3 broken test images. They should be handled by the image fix script.');
}

// Main test runner
function runAllImageTests() {
    console.log('🚀 Running comprehensive image fix tests...');
    
    // Test 1: Check existing images
    const stats = checkExistingImages();
    
    // Test 2: Create test UI
    setTimeout(() => testImageFix(), 1000);
    
    // Test 3: Add broken images
    setTimeout(() => simulateBrokenImages(), 2000);
    
    console.log('🚀 All tests initiated. Check console and page for results.');
}

// Instructions
console.log(`
🧪 IMAGE FIX TESTING COMMANDS:

1. testImageFix()          - Creates test UI with sample images
2. checkExistingImages()   - Analyzes current page images  
3. simulateBrokenImages()  - Adds broken test images
4. runAllImageTests()      - Runs all tests

Copy and paste any of these functions into the console to test!
`);

// Auto-run basic test
console.log('🔄 Running basic image check...');
checkExistingImages();
