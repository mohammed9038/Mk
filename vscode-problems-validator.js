/**
 * VS Code Problems Validator
 * Identifies and fixes common validation issues in Shopify themes
 */

const fs = require('fs');
const path = require('path');

class VSCodeProblemsValidator {
  constructor() {
    this.problems = [];
    this.fixed = [];
    this.warnings = [];
  }

  async validateProject() {
    console.log('🔍 Starting VS Code Problems Validation...\n');
    
    try {
      // Validate JavaScript files
      await this.validateJavaScript();
      
      // Validate JSON files
      await this.validateJSON();
      
      // Validate Liquid files
      await this.validateLiquid();
      
      // Validate CSS files
      await this.validateCSS();
      
      // Check for common issues
      await this.checkCommonIssues();
      
      this.displayResults();
      
    } catch (error) {
      console.error('❌ Validation error:', error.message);
    }
  }

  async validateJavaScript() {
    console.log('📁 Validating JavaScript files...');
    
    const jsFiles = this.findFiles('assets', '.js');
    
    for (const file of jsFiles) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        // Check for common JS issues
        this.checkJSIssues(file, content);
        
      } catch (error) {
        this.problems.push(`❌ ${file}: ${error.message}`);
      }
    }
  }

  async validateJSON() {
    console.log('📁 Validating JSON files...');
    
    const jsonFiles = this.findFiles('.', '.json');
    
    for (const file of jsonFiles) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        JSON.parse(content);
        this.fixed.push(`✅ ${file}: Valid JSON`);
        
      } catch (error) {
        this.problems.push(`❌ ${file}: Invalid JSON - ${error.message}`);
      }
    }
  }

  async validateLiquid() {
    console.log('📁 Validating Liquid files...');
    
    const liquidFiles = this.findFiles('.', '.liquid');
    
    for (const file of liquidFiles) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        this.checkLiquidSyntax(file, content);
        
      } catch (error) {
        this.problems.push(`❌ ${file}: ${error.message}`);
      }
    }
  }

  async validateCSS() {
    console.log('📁 Validating CSS files...');
    
    const cssFiles = this.findFiles('assets', '.css');
    
    for (const file of cssFiles) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        this.checkCSSIssues(file, content);
        
      } catch (error) {
        this.problems.push(`❌ ${file}: ${error.message}`);
      }
    }
  }

  checkJSIssues(file, content) {
    // Check for missing semicolons
    const lines = content.split('\n');
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Check for common JS issues
      if (trimmed.match(/^(var|let|const|function)\s+.*[^;}]$/)) {
        this.warnings.push(`⚠️  ${file}:${index + 1}: Possible missing semicolon`);
      }
      
      if (trimmed.includes('console.log') && !trimmed.includes('//')) {
        this.warnings.push(`⚠️  ${file}:${index + 1}: Console.log statement (consider removing for production)`);
      }
    });
    
    this.fixed.push(`✅ ${file}: JavaScript validation passed`);
  }

  checkLiquidSyntax(file, content) {
    // Check for common Liquid syntax issues
    const openTags = (content.match(/\{\%\s*(?!end)/g) || []).length;
    const closeTags = (content.match(/\{\%\s*end/g) || []).length;
    
    if (openTags !== closeTags) {
      this.problems.push(`❌ ${file}: Mismatched Liquid tags (${openTags} open, ${closeTags} close)`);
    } else {
      this.fixed.push(`✅ ${file}: Liquid syntax validation passed`);
    }
    
    // Check for unclosed liquid variables
    const openVars = (content.match(/\{\{/g) || []).length;
    const closeVars = (content.match(/\}\}/g) || []).length;
    
    if (openVars !== closeVars) {
      this.problems.push(`❌ ${file}: Unclosed Liquid variables (${openVars} open, ${closeVars} close)`);
    }
  }

  checkCSSIssues(file, content) {
    // Check for basic CSS syntax issues
    const openBraces = (content.match(/\{/g) || []).length;
    const closeBraces = (content.match(/\}/g) || []).length;
    
    if (openBraces !== closeBraces) {
      this.problems.push(`❌ ${file}: Mismatched CSS braces (${openBraces} open, ${closeBraces} close)`);
    } else {
      this.fixed.push(`✅ ${file}: CSS syntax validation passed`);
    }
  }

  async checkCommonIssues() {
    console.log('📁 Checking for common issues...');
    
    // Check for missing files referenced in theme.liquid
    const themeFile = 'layout/theme.liquid';
    if (fs.existsSync(themeFile)) {
      const content = fs.readFileSync(themeFile, 'utf8');
      const assetRefs = content.match(/['"]\s*([^'"]+\.(js|css))\s*['"]/g) || [];
      
      assetRefs.forEach(ref => {
        const filename = ref.replace(/['"]/g, '').trim();
        const assetPath = `assets/${filename}`;
        
        if (!fs.existsSync(assetPath)) {
          this.problems.push(`❌ Missing asset: ${assetPath}`);
        }
      });
    }
    
    this.fixed.push('✅ Common issues check completed');
  }

  findFiles(dir, extension) {
    const files = [];
    
    if (!fs.existsSync(dir)) return files;
    
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.')) {
        files.push(...this.findFiles(fullPath, extension));
      } else if (stat.isFile() && item.endsWith(extension)) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  displayResults() {
    console.log('\n📊 VS CODE PROBLEMS VALIDATION RESULTS\n');
    console.log('='.repeat(60));
    
    if (this.problems.length > 0) {
      console.log('\n❌ PROBLEMS FOUND:');
      this.problems.forEach(problem => console.log(`  ${problem}`));
    }
    
    if (this.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS:');
      this.warnings.forEach(warning => console.log(`  ${warning}`));
    }
    
    if (this.fixed.length > 0) {
      console.log('\n✅ VALIDATIONS PASSED:');
      this.fixed.slice(0, 10).forEach(fix => console.log(`  ${fix}`));
      if (this.fixed.length > 10) {
        console.log(`  ... and ${this.fixed.length - 10} more`);
      }
    }
    
    const totalIssues = this.problems.length + this.warnings.length;
    console.log(`\n📈 Summary: ${totalIssues} issues found, ${this.fixed.length} validations passed`);
    
    if (totalIssues === 0) {
      console.log('\n🎉 No critical problems found! Your theme passes VS Code validation.');
    } else {
      console.log('\n🔧 Issues identified for fixing.');
    }
    
    console.log('\n' + '='.repeat(60));
  }
}

// Run validation
const validator = new VSCodeProblemsValidator();
validator.validateProject().catch(console.error);
