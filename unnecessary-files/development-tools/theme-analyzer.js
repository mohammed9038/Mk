/**
 * Theme File Usage Analyzer
 * Identifies which files are actually used vs unused in the theme
 */

const fs = require('fs');
const path = require('path');

class ThemeAnalyzer {
  constructor() {
    this.usedFiles = new Set();
    this.allFiles = new Set();
    this.templateFiles = [];
    this.liquidFiles = [];
    this.assetFiles = [];
    this.documentationFiles = [];
    this.testingFiles = [];
    this.unusedFiles = [];
  }

  async analyzeTheme() {
    console.log('🔍 Analyzing theme file usage...\n');
    
    // Scan all files
    await this.scanDirectory('.');
    
    // Find all asset references
    await this.findUsedAssets();
    
    // Categorize files
    this.categorizeFiles();
    
    // Generate report
    this.generateReport();
  }

  async scanDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        if (!['node_modules', '.git', 'unnecessary-files'].includes(entry.name)) {
          await this.scanDirectory(fullPath);
        }
      } else {
        this.allFiles.add(fullPath);
        
        if (entry.name.endsWith('.liquid')) {
          this.liquidFiles.push(fullPath);
        }
      }
    }
  }

  async findUsedAssets() {
    // Core theme files that are always needed
    const coreFiles = [
      'layout/theme.liquid',
      'layout/password.liquid',
      'config/settings_data.json',
      'config/settings_schema.json'
    ];
    
    coreFiles.forEach(file => this.usedFiles.add(file));

    // Scan liquid files for asset references
    for (const liquidFile of this.liquidFiles) {
      try {
        const content = fs.readFileSync(liquidFile, 'utf8');
        
        // Find asset_url references
        const assetMatches = content.match(/['"]([^'"]+\.(?:js|css|gif|png|jpg|jpeg|svg|woff|woff2))['"][\s]*\|[\s]*asset_url/g);
        if (assetMatches) {
          assetMatches.forEach(match => {
            const assetName = match.match(/['"]([^'"]+)['"][\s]*\|[\s]*asset_url/)[1];
            this.usedFiles.add(`assets/${assetName}`);
          });
        }

        // Find render references
        const renderMatches = content.match(/{%-?\s*render\s+['"]([^'"]+)['"][\s\w,:-]*%}/g);
        if (renderMatches) {
          renderMatches.forEach(match => {
            const snippetName = match.match(/render\s+['"]([^'"]+)['"]/)[1];
            this.usedFiles.add(`snippets/${snippetName}.liquid`);
          });
        }

        // Find sections references
        const sectionMatches = content.match(/{%-?\s*section\s+['"]([^'"]+)['"][\s\w,:-]*%}/g);
        if (sectionMatches) {
          sectionMatches.forEach(match => {
            const sectionName = match.match(/section\s+['"]([^'"]+)['"]/)[1];
            this.usedFiles.add(`sections/${sectionName}.liquid`);
          });
        }

        this.usedFiles.add(liquidFile);
      } catch (error) {
        console.log(`⚠️  Could not read file: ${liquidFile}`);
      }
    }

    // Scan JSON template files for section references
    const jsonFiles = Array.from(this.allFiles).filter(f => f.endsWith('.json') && f.includes('templates/'));
    for (const jsonFile of jsonFiles) {
      try {
        const content = fs.readFileSync(jsonFile, 'utf8');
        const jsonData = JSON.parse(content);
        
        if (jsonData.sections) {
          Object.values(jsonData.sections).forEach(section => {
            if (section.type) {
              this.usedFiles.add(`sections/${section.type}.liquid`);
            }
          });
        }
        
        this.usedFiles.add(jsonFile);
      } catch (error) {
        // Skip invalid JSON files
      }
    }
  }

  categorizeFiles() {
    Array.from(this.allFiles).forEach(file => {
      const isUsed = this.usedFiles.has(file);
      
      if (file.includes('unnecessary-files/')) {
        return; // Skip already moved files
      }

      if (!isUsed) {
        // Categorize unused files
        if (file.match(/\.(md|txt)$/) && !file.includes('README.md')) {
          this.documentationFiles.push(file);
        } else if (file.match(/(test|optimization|performance|validation|dashboard).*\.(js|html|json)$/)) {
          this.testingFiles.push(file);
        } else if (file.startsWith('assets/') && !this.usedFiles.has(file)) {
          this.assetFiles.push(file);
        } else if (file.endsWith('.liquid') || file.endsWith('.css') || file.endsWith('.js')) {
          this.unusedFiles.push(file);
        }
      }
    });
  }

  generateReport() {
    console.log('📊 THEME FILE USAGE ANALYSIS REPORT');
    console.log('=====================================\n');

    console.log(`✅ Total Files Scanned: ${this.allFiles.size}`);
    console.log(`✅ Used Files: ${this.usedFiles.size}`);
    console.log(`❌ Unused Files: ${this.allFiles.size - this.usedFiles.size}\n`);

    console.log('📁 UNUSED FILES BY CATEGORY:\n');

    if (this.documentationFiles.length > 0) {
      console.log(`📄 Documentation Files (${this.documentationFiles.length}):`);
      this.documentationFiles.forEach(file => console.log(`  - ${file}`));
      console.log('');
    }

    if (this.testingFiles.length > 0) {
      console.log(`🧪 Testing/Development Tools (${this.testingFiles.length}):`);
      this.testingFiles.forEach(file => console.log(`  - ${file}`));
      console.log('');
    }

    if (this.assetFiles.length > 0) {
      console.log(`🎨 Unused Asset Files (${this.assetFiles.length}):`);
      this.assetFiles.forEach(file => console.log(`  - ${file}`));
      console.log('');
    }

    if (this.unusedFiles.length > 0) {
      console.log(`🗃️  Other Unused Files (${this.unusedFiles.length}):`);
      this.unusedFiles.forEach(file => console.log(`  - ${file}`));
      console.log('');
    }

    console.log('🔧 RECOMMENDATIONS:');
    console.log('==================');
    console.log('1. Move documentation files to unnecessary-files/documentation/');
    console.log('2. Move testing tools to unnecessary-files/testing-tools/');
    console.log('3. Move unused assets to unnecessary-files/unused-assets/');
    console.log('4. Review other unused files for potential removal');
    console.log('\n✨ This will significantly reduce the theme file count and improve organization!');
  }

  getAllUnusedFiles() {
    return [
      ...this.documentationFiles,
      ...this.testingFiles,
      ...this.assetFiles,
      ...this.unusedFiles
    ];
  }
}

// Run the analysis
const analyzer = new ThemeAnalyzer();
analyzer.analyzeTheme().then(() => {
  // Export results for use by cleanup script
  const unusedFiles = analyzer.getAllUnusedFiles();
  fs.writeFileSync('unused-files-list.json', JSON.stringify({
    documentation: analyzer.documentationFiles,
    testing: analyzer.testingFiles,
    assets: analyzer.assetFiles,
    other: analyzer.unusedFiles,
    total: unusedFiles.length
  }, null, 2));
  
  console.log('\n💾 Results saved to unused-files-list.json');
}).catch(console.error);
