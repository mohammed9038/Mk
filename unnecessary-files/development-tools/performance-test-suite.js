/* ===================================================================
   AL-SHARIQAH THEME - COMPREHENSIVE PERFORMANCE TESTING SUITE
   Tests all aspects of theme performance after Phase 5 implementation
   =================================================================== */

class PerformanceTestSuite {
  constructor() {
    this.results = {
      loadingPerformance: {},
      runtimePerformance: {},
      memoryUsage: {},
      networkImpact: {},
      componentPerformance: {},
      designSystemPerformance: {},
      overallScore: 0
    };
    this.startTime = performance.now();
    this.init();
  }

  async init() {
    console.log('🚀 Starting Comprehensive Performance Test Suite...');
    console.log('='.repeat(60));
    
    await this.testLoadingPerformance();
    await this.testRuntimePerformance();
    await this.testMemoryUsage();
    await this.testNetworkImpact();
    await this.testComponentPerformance();
    await this.testDesignSystemPerformance();
    
    this.calculateOverallScore();
    this.generateReport();
  }

  // Test initial loading performance
  async testLoadingPerformance() {
    console.log('📊 Testing Loading Performance...');
    
    const navigationTiming = performance.getEntriesByType('navigation')[0];
    const paintTiming = performance.getEntriesByType('paint');
    
    this.results.loadingPerformance = {
      domContentLoaded: Math.round(navigationTiming.domContentLoadedEventEnd - navigationTiming.domContentLoadedEventStart),
      loadComplete: Math.round(navigationTiming.loadEventEnd - navigationTiming.loadEventStart),
      firstPaint: paintTiming.find(entry => entry.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: paintTiming.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
      domInteractive: Math.round(navigationTiming.domInteractive - navigationTiming.navigationStart),
      domComplete: Math.round(navigationTiming.domComplete - navigationTiming.navigationStart)
    };

    // Test critical CSS loading
    const cssLoadStart = performance.now();
    const testCSS = document.querySelector('link[href*="design-system"]');
    if (testCSS) {
      this.results.loadingPerformance.cssLoadTime = performance.now() - cssLoadStart;
    }

    console.log('✅ Loading Performance:', this.results.loadingPerformance);
  }

  // Test runtime performance
  async testRuntimePerformance() {
    console.log('⚡ Testing Runtime Performance...');
    
    const runtimeTests = await Promise.all([
      this.testScrollPerformance(),
      this.testAnimationPerformance(),
      this.testInteractionPerformance(),
      this.testRenderingPerformance()
    ]);

    this.results.runtimePerformance = {
      scrollFPS: runtimeTests[0],
      animationSmootness: runtimeTests[1],
      interactionLatency: runtimeTests[2],
      renderingTime: runtimeTests[3]
    };

    console.log('✅ Runtime Performance:', this.results.runtimePerformance);
  }

  // Test scroll performance
  testScrollPerformance() {
    return new Promise((resolve) => {
      let frameCount = 0;
      let lastTime = performance.now();
      let fps = [];

      const measureFPS = () => {
        const currentTime = performance.now();
        const delta = currentTime - lastTime;
        fps.push(1000 / delta);
        lastTime = currentTime;
        frameCount++;

        if (frameCount < 60) {
          requestAnimationFrame(measureFPS);
        } else {
          const avgFPS = fps.reduce((a, b) => a + b, 0) / fps.length;
          resolve(Math.round(avgFPS));
        }
      };

      // Simulate scroll events
      window.scrollTo(0, 100);
      requestAnimationFrame(measureFPS);
    });
  }

  // Test animation performance
  testAnimationPerformance() {
    return new Promise((resolve) => {
      const testElement = document.createElement('div');
      testElement.style.cssText = `
        position: fixed;
        top: -100px;
        left: 0;
        width: 100px;
        height: 100px;
        background: red;
        transition: transform 0.3s ease;
      `;
      document.body.appendChild(testElement);

      const startTime = performance.now();
      testElement.style.transform = 'translateY(200px)';

      testElement.addEventListener('transitionend', () => {
        const duration = performance.now() - startTime;
        document.body.removeChild(testElement);
        resolve(duration);
      });
    });
  }

  // Test interaction latency
  testInteractionPerformance() {
    return new Promise((resolve) => {
      const button = document.createElement('button');
      button.textContent = 'Test Button';
      button.style.position = 'fixed';
      button.style.top = '-100px';
      document.body.appendChild(button);

      const startTime = performance.now();
      button.addEventListener('click', () => {
        const latency = performance.now() - startTime;
        document.body.removeChild(button);
        resolve(latency);
      });

      button.click();
    });
  }

  // Test rendering performance
  async testRenderingPerformance() {
    const startTime = performance.now();
    
    // Create complex DOM structure
    const container = document.createElement('div');
    for (let i = 0; i < 100; i++) {
      const item = document.createElement('div');
      item.className = 'test-item';
      item.textContent = `Test Item ${i}`;
      container.appendChild(item);
    }
    
    document.body.appendChild(container);
    
    // Force reflow
    container.offsetHeight;
    
    const renderTime = performance.now() - startTime;
    document.body.removeChild(container);
    
    return renderTime;
  }

  // Test memory usage
  async testMemoryUsage() {
    console.log('💾 Testing Memory Usage...');
    
    if ('memory' in performance) {
      this.results.memoryUsage = {
        usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024), // MB
        totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024), // MB
        jsHeapSizeLimit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024), // MB
        memoryEfficiency: Math.round((performance.memory.usedJSHeapSize / performance.memory.totalJSHeapSize) * 100)
      };
    } else {
      this.results.memoryUsage = {
        note: 'Memory API not available in this browser'
      };
    }

    console.log('✅ Memory Usage:', this.results.memoryUsage);
  }

  // Test network impact
  async testNetworkImpact() {
    console.log('🌐 Testing Network Impact...');
    
    const resources = performance.getEntriesByType('resource');
    const designSystemResources = resources.filter(resource => 
      resource.name.includes('design-system') || 
      resource.name.includes('customization') ||
      resource.name.includes('enhanced') ||
      resource.name.includes('advanced')
    );

    let totalSize = 0;
    let totalDuration = 0;

    designSystemResources.forEach(resource => {
      totalSize += resource.transferSize || 0;
      totalDuration += resource.duration || 0;
    });

    this.results.networkImpact = {
      designSystemFiles: designSystemResources.length,
      totalTransferSize: Math.round(totalSize / 1024), // KB
      averageLoadTime: Math.round(totalDuration / designSystemResources.length),
      totalLoadTime: Math.round(totalDuration),
      compressionRatio: totalSize > 0 ? Math.round(((totalSize - (designSystemResources.reduce((acc, r) => acc + (r.encodedBodySize || 0), 0))) / totalSize) * 100) : 0
    };

    console.log('✅ Network Impact:', this.results.networkImpact);
  }

  // Test component performance
  async testComponentPerformance() {
    console.log('🧩 Testing Component Performance...');
    
    const componentTests = {};

    // Test design system initialization
    if (window.ALShariqahDesignSystem) {
      const initStart = performance.now();
      const isReady = window.ALShariqahDesignSystem.isReady();
      componentTests.designSystemInit = {
        ready: isReady,
        checkTime: performance.now() - initStart
      };
    }

    // Test component manager
    if (window.AdvancedComponentManager) {
      const managerStart = performance.now();
      const tokenTest = window.AdvancedComponentManager.getDesignToken('colors.primary');
      componentTests.componentManager = {
        tokenRetrievalTime: performance.now() - managerStart,
        tokenValue: tokenTest
      };
    }

    // Test customization panel
    if (window.LiveCustomizationPanel) {
      const panelStart = performance.now();
      const panelReady = typeof window.LiveCustomizationPanel.isOpen !== 'undefined';
      componentTests.customizationPanel = {
        ready: panelReady,
        checkTime: performance.now() - panelStart
      };
    }

    this.results.componentPerformance = componentTests;
    console.log('✅ Component Performance:', this.results.componentPerformance);
  }

  // Test design system specific performance
  async testDesignSystemPerformance() {
    console.log('🎨 Testing Design System Performance...');
    
    const designSystemTests = {};

    // Test CSS custom property performance
    const cssStart = performance.now();
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    const testProperties = [
      '--color-primary',
      '--color-secondary',
      '--font-heading',
      '--animation-duration'
    ];

    let propertyAccessTime = 0;
    testProperties.forEach(prop => {
      const propStart = performance.now();
      computedStyle.getPropertyValue(prop);
      propertyAccessTime += performance.now() - propStart;
    });

    designSystemTests.cssPropertyAccess = {
      totalTime: propertyAccessTime,
      averageTime: propertyAccessTime / testProperties.length,
      propertiesTested: testProperties.length
    };

    // Test theme switching performance
    const themeStart = performance.now();
    root.style.setProperty('--color-primary', '#ff0000');
    root.style.setProperty('--color-primary', '#2c5282'); // Reset
    designSystemTests.themeSwitch = performance.now() - themeStart;

    // Test component registration performance
    if (window.AdvancedComponentManager) {
      const regStart = performance.now();
      window.AdvancedComponentManager.registerComponent('test-perf-component', {
        name: 'test-perf-component',
        selector: '.test-perf',
        init() {}
      });
      designSystemTests.componentRegistration = performance.now() - regStart;
    }

    this.results.designSystemPerformance = designSystemTests;
    console.log('✅ Design System Performance:', this.results.designSystemPerformance);
  }

  // Calculate overall performance score
  calculateOverallScore() {
    let score = 100;
    
    // Loading performance penalties
    const loading = this.results.loadingPerformance;
    if (loading.firstContentfulPaint > 1500) score -= 10;
    if (loading.domInteractive > 3000) score -= 15;
    if (loading.loadComplete > 5000) score -= 10;

    // Runtime performance penalties
    const runtime = this.results.runtimePerformance;
    if (runtime.scrollFPS < 55) score -= 15;
    if (runtime.animationSmootness > 500) score -= 10;
    if (runtime.interactionLatency > 100) score -= 10;

    // Memory penalties
    if (this.results.memoryUsage.usedJSHeapSize > 50) score -= 10;
    if (this.results.memoryUsage.memoryEfficiency < 70) score -= 5;

    // Network penalties
    const network = this.results.networkImpact;
    if (network.totalTransferSize > 200) score -= 10; // Over 200KB
    if (network.averageLoadTime > 200) score -= 5;

    // Design system specific penalties
    const ds = this.results.designSystemPerformance;
    if (ds.cssPropertyAccess?.averageTime > 1) score -= 5;
    if (ds.themeSwitch > 50) score -= 5;

    this.results.overallScore = Math.max(0, Math.round(score));
  }

  // Generate comprehensive report
  generateReport() {
    const totalTime = Math.round(performance.now() - this.startTime);
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 COMPREHENSIVE PERFORMANCE REPORT');
    console.log('='.repeat(60));
    
    console.log(`\n🏆 OVERALL PERFORMANCE SCORE: ${this.results.overallScore}/100`);
    
    if (this.results.overallScore >= 90) {
      console.log('🎉 EXCELLENT - Your theme is performing exceptionally well!');
    } else if (this.results.overallScore >= 80) {
      console.log('✅ GOOD - Your theme has good performance with minor optimizations possible');
    } else if (this.results.overallScore >= 70) {
      console.log('⚠️ FAIR - Some performance improvements recommended');
    } else {
      console.log('🚨 POOR - Significant performance improvements needed');
    }

    console.log('\n📈 DETAILED METRICS:');
    console.log('─'.repeat(40));
    
    // Loading Performance
    console.log('\n⚡ Loading Performance:');
    console.log(`  • First Contentful Paint: ${this.results.loadingPerformance.firstContentfulPaint}ms`);
    console.log(`  • DOM Interactive: ${this.results.loadingPerformance.domInteractive}ms`);
    console.log(`  • Load Complete: ${this.results.loadingPerformance.loadComplete}ms`);

    // Runtime Performance  
    console.log('\n🎯 Runtime Performance:');
    console.log(`  • Scroll FPS: ${this.results.runtimePerformance.scrollFPS} fps`);
    console.log(`  • Animation Smoothness: ${this.results.runtimePerformance.animationSmootness}ms`);
    console.log(`  • Interaction Latency: ${this.results.runtimePerformance.interactionLatency}ms`);

    // Memory Usage
    console.log('\n💾 Memory Usage:');
    if (this.results.memoryUsage.usedJSHeapSize) {
      console.log(`  • Used JS Heap: ${this.results.memoryUsage.usedJSHeapSize}MB`);
      console.log(`  • Memory Efficiency: ${this.results.memoryUsage.memoryEfficiency}%`);
    } else {
      console.log(`  • ${this.results.memoryUsage.note}`);
    }

    // Network Impact
    console.log('\n🌐 Network Impact:');
    console.log(`  • Design System Files: ${this.results.networkImpact.designSystemFiles}`);
    console.log(`  • Total Transfer Size: ${this.results.networkImpact.totalTransferSize}KB`);
    console.log(`  • Average Load Time: ${this.results.networkImpact.averageLoadTime}ms`);

    // Component Performance
    console.log('\n🧩 Component Performance:');
    const comp = this.results.componentPerformance;
    if (comp.designSystemInit) {
      console.log(`  • Design System Ready: ${comp.designSystemInit.ready ? '✅' : '❌'}`);
    }
    if (comp.componentManager) {
      console.log(`  • Token Retrieval: ${comp.componentManager.tokenRetrievalTime.toFixed(2)}ms`);
    }
    if (comp.customizationPanel) {
      console.log(`  • Customization Panel: ${comp.customizationPanel.ready ? '✅' : '❌'}`);
    }

    // Design System Performance
    console.log('\n🎨 Design System Performance:');
    const ds = this.results.designSystemPerformance;
    if (ds.cssPropertyAccess) {
      console.log(`  • CSS Property Access: ${ds.cssPropertyAccess.averageTime.toFixed(2)}ms avg`);
    }
    if (ds.themeSwitch) {
      console.log(`  • Theme Switch Time: ${ds.themeSwitch.toFixed(2)}ms`);
    }

    console.log('\n🔍 RECOMMENDATIONS:');
    console.log('─'.repeat(40));
    this.generateRecommendations();

    console.log(`\n⏱️ Test completed in ${totalTime}ms`);
    console.log('='.repeat(60));

    // Store results for potential export
    window.performanceTestResults = this.results;
  }

  generateRecommendations() {
    const recommendations = [];

    // Loading recommendations
    if (this.results.loadingPerformance.firstContentfulPaint > 1500) {
      recommendations.push('• Consider lazy loading non-critical resources');
    }
    if (this.results.loadingPerformance.domInteractive > 3000) {
      recommendations.push('• Optimize critical CSS and JavaScript');
    }

    // Runtime recommendations
    if (this.results.runtimePerformance.scrollFPS < 55) {
      recommendations.push('• Optimize scroll event handlers and animations');
    }
    if (this.results.runtimePerformance.animationSmootness > 500) {
      recommendations.push('• Use CSS transforms instead of layout-triggering properties');
    }

    // Memory recommendations
    if (this.results.memoryUsage.usedJSHeapSize > 50) {
      recommendations.push('• Monitor for memory leaks in JavaScript');
    }

    // Network recommendations
    if (this.results.networkImpact.totalTransferSize > 200) {
      recommendations.push('• Consider code splitting for design system components');
    }

    // Design system recommendations
    const ds = this.results.designSystemPerformance;
    if (ds.cssPropertyAccess?.averageTime > 1) {
      recommendations.push('• Cache CSS custom property values when possible');
    }

    if (recommendations.length === 0) {
      console.log('🎉 No performance issues detected! Your theme is well optimized.');
    } else {
      recommendations.forEach(rec => console.log(rec));
    }
  }

  // Export results as JSON
  exportResults() {
    const resultsBlob = new Blob([JSON.stringify(this.results, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(resultsBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Auto-run the performance test suite
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.PerformanceTestSuite = new PerformanceTestSuite();
  });
} else {
  window.PerformanceTestSuite = new PerformanceTestSuite();
}

// Make export function globally available
window.exportPerformanceResults = () => {
  if (window.PerformanceTestSuite) {
    window.PerformanceTestSuite.exportResults();
  }
};
