/* ===================================================================
   AL-SHARIQAH THEME - LIVE CUSTOMIZATION PANEL
   Real-time theme customization with instant preview
   =================================================================== */

class LiveCustomizationPanel {
  constructor() {
    this.isOpen = false;
    this.currentTheme = this.loadThemeSettings();
    this.presets = this.loadPresets();
    this.init();
  }

  init() {
    this.createPanel();
    this.bindEvents();
    this.applyTheme(this.currentTheme);
  }

  loadThemeSettings() {
    const saved = localStorage.getItem('al-shariqah-theme-settings');
    return saved ? JSON.parse(saved) : {
      colorScheme: 'light',
      primaryColor: '#2c5282',
      secondaryColor: '#e53e3e',
      accentColor: '#f59e0b',
      backgroundColor: '#ffffff',
      textColor: '#1a202c',
      fontFamily: 'system-ui',
      headingFont: 'system-ui',
      fontSize: '16',
      lineHeight: '1.6',
      borderRadius: '8',
      spacing: 'normal',
      animations: 'enabled',
      layout: 'contained',
      buttonStyle: 'filled',
      cardStyle: 'elevated'
    };
  }

  loadPresets() {
    return {
      modern: {
        name: 'Modern',
        primaryColor: '#2563eb',
        secondaryColor: '#7c3aed',
        accentColor: '#f59e0b',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        borderRadius: '12',
        spacing: 'comfortable',
        buttonStyle: 'rounded',
        cardStyle: 'elevated'
      },
      classic: {
        name: 'Classic',
        primaryColor: '#1f2937',
        secondaryColor: '#6b7280',
        accentColor: '#d97706',
        backgroundColor: '#f9fafb',
        textColor: '#111827',
        borderRadius: '4',
        spacing: 'compact',
        buttonStyle: 'sharp',
        cardStyle: 'bordered'
      },
      vibrant: {
        name: 'Vibrant',
        primaryColor: '#e11d48',
        secondaryColor: '#8b5cf6',
        accentColor: '#06b6d4',
        backgroundColor: '#ffffff',
        textColor: '#0f172a',
        borderRadius: '16',
        spacing: 'comfortable',
        buttonStyle: 'rounded',
        cardStyle: 'gradient'
      },
      minimal: {
        name: 'Minimal',
        primaryColor: '#000000',
        secondaryColor: '#6b7280',
        accentColor: '#000000',
        backgroundColor: '#ffffff',
        textColor: '#000000',
        borderRadius: '0',
        spacing: 'normal',
        buttonStyle: 'ghost',
        cardStyle: 'flat'
      },
      dark: {
        name: 'Dark',
        primaryColor: '#3b82f6',
        secondaryColor: '#8b5cf6',
        accentColor: '#f59e0b',
        backgroundColor: '#0f172a',
        textColor: '#f8fafc',
        borderRadius: '8',
        spacing: 'normal',
        buttonStyle: 'filled',
        cardStyle: 'elevated'
      }
    };
  }

  createPanel() {
    const panel = document.createElement('div');
    panel.className = 'live-customization-panel';
    panel.innerHTML = `
      <div class="customization-panel__overlay"></div>
      <div class="customization-panel__content">
        <div class="customization-panel__header">
          <h3>Theme Customization</h3>
          <button class="customization-panel__close" aria-label="Close customization panel">&times;</button>
        </div>
        
        <div class="customization-panel__body">
          <!-- Presets Section -->
          <div class="customization-section">
            <h4>Quick Presets</h4>
            <div class="preset-grid">
              ${Object.entries(this.presets).map(([key, preset]) => `
                <button class="preset-card" data-preset="${key}">
                  <div class="preset-card__preview">
                    <div class="preset-preview__colors">
                      <span style="background: ${preset.primaryColor}"></span>
                      <span style="background: ${preset.secondaryColor}"></span>
                      <span style="background: ${preset.accentColor}"></span>
                    </div>
                  </div>
                  <span class="preset-card__name">${preset.name}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Color Scheme -->
          <div class="customization-section">
            <h4>Color Scheme</h4>
            <div class="color-scheme-toggle">
              <label class="scheme-option">
                <input type="radio" name="colorScheme" value="light" ${this.currentTheme.colorScheme === 'light' ? 'checked' : ''}>
                <span>☀️ Light</span>
              </label>
              <label class="scheme-option">
                <input type="radio" name="colorScheme" value="dark" ${this.currentTheme.colorScheme === 'dark' ? 'checked' : ''}>
                <span>🌙 Dark</span>
              </label>
              <label class="scheme-option">
                <input type="radio" name="colorScheme" value="auto" ${this.currentTheme.colorScheme === 'auto' ? 'checked' : ''}>
                <span>🔄 Auto</span>
              </label>
            </div>
          </div>

          <!-- Colors -->
          <div class="customization-section">
            <h4>Colors</h4>
            <div class="color-controls">
              <div class="color-control">
                <label for="primaryColor">Primary Color</label>
                <input type="color" id="primaryColor" name="primaryColor" value="${this.currentTheme.primaryColor}">
              </div>
              <div class="color-control">
                <label for="secondaryColor">Secondary Color</label>
                <input type="color" id="secondaryColor" name="secondaryColor" value="${this.currentTheme.secondaryColor}">
              </div>
              <div class="color-control">
                <label for="accentColor">Accent Color</label>
                <input type="color" id="accentColor" name="accentColor" value="${this.currentTheme.accentColor}">
              </div>
              <div class="color-control">
                <label for="backgroundColor">Background</label>
                <input type="color" id="backgroundColor" name="backgroundColor" value="${this.currentTheme.backgroundColor}">
              </div>
              <div class="color-control">
                <label for="textColor">Text Color</label>
                <input type="color" id="textColor" name="textColor" value="${this.currentTheme.textColor}">
              </div>
            </div>
          </div>

          <!-- Typography -->
          <div class="customization-section">
            <h4>Typography</h4>
            <div class="typography-controls">
              <div class="control-group">
                <label for="fontFamily">Body Font</label>
                <select id="fontFamily" name="fontFamily">
                  <option value="system-ui" ${this.currentTheme.fontFamily === 'system-ui' ? 'selected' : ''}>System UI</option>
                  <option value="Inter" ${this.currentTheme.fontFamily === 'Inter' ? 'selected' : ''}>Inter</option>
                  <option value="Roboto" ${this.currentTheme.fontFamily === 'Roboto' ? 'selected' : ''}>Roboto</option>
                  <option value="Open Sans" ${this.currentTheme.fontFamily === 'Open Sans' ? 'selected' : ''}>Open Sans</option>
                  <option value="Lato" ${this.currentTheme.fontFamily === 'Lato' ? 'selected' : ''}>Lato</option>
                  <option value="Poppins" ${this.currentTheme.fontFamily === 'Poppins' ? 'selected' : ''}>Poppins</option>
                  <option value="Montserrat" ${this.currentTheme.fontFamily === 'Montserrat' ? 'selected' : ''}>Montserrat</option>
                </select>
              </div>
              <div class="control-group">
                <label for="headingFont">Heading Font</label>
                <select id="headingFont" name="headingFont">
                  <option value="system-ui" ${this.currentTheme.headingFont === 'system-ui' ? 'selected' : ''}>System UI</option>
                  <option value="Inter" ${this.currentTheme.headingFont === 'Inter' ? 'selected' : ''}>Inter</option>
                  <option value="Roboto" ${this.currentTheme.headingFont === 'Roboto' ? 'selected' : ''}>Roboto</option>
                  <option value="Playfair Display" ${this.currentTheme.headingFont === 'Playfair Display' ? 'selected' : ''}>Playfair Display</option>
                  <option value="Merriweather" ${this.currentTheme.headingFont === 'Merriweather' ? 'selected' : ''}>Merriweather</option>
                  <option value="Oswald" ${this.currentTheme.headingFont === 'Oswald' ? 'selected' : ''}>Oswald</option>
                </select>
              </div>
              <div class="control-group">
                <label for="fontSize">Font Size: <span class="value">${this.currentTheme.fontSize}px</span></label>
                <input type="range" id="fontSize" name="fontSize" min="14" max="20" value="${this.currentTheme.fontSize}">
              </div>
              <div class="control-group">
                <label for="lineHeight">Line Height: <span class="value">${this.currentTheme.lineHeight}</span></label>
                <input type="range" id="lineHeight" name="lineHeight" min="1.2" max="2.0" step="0.1" value="${this.currentTheme.lineHeight}">
              </div>
            </div>
          </div>

          <!-- Layout & Spacing -->
          <div class="customization-section">
            <h4>Layout & Spacing</h4>
            <div class="layout-controls">
              <div class="control-group">
                <label for="borderRadius">Border Radius: <span class="value">${this.currentTheme.borderRadius}px</span></label>
                <input type="range" id="borderRadius" name="borderRadius" min="0" max="20" value="${this.currentTheme.borderRadius}">
              </div>
              <div class="control-group">
                <label for="spacing">Spacing</label>
                <select id="spacing" name="spacing">
                  <option value="compact" ${this.currentTheme.spacing === 'compact' ? 'selected' : ''}>Compact</option>
                  <option value="normal" ${this.currentTheme.spacing === 'normal' ? 'selected' : ''}>Normal</option>
                  <option value="comfortable" ${this.currentTheme.spacing === 'comfortable' ? 'selected' : ''}>Comfortable</option>
                </select>
              </div>
              <div class="control-group">
                <label for="layout">Layout Style</label>
                <select id="layout" name="layout">
                  <option value="contained" ${this.currentTheme.layout === 'contained' ? 'selected' : ''}>Contained</option>
                  <option value="full-width" ${this.currentTheme.layout === 'full-width' ? 'selected' : ''}>Full Width</option>
                  <option value="boxed" ${this.currentTheme.layout === 'boxed' ? 'selected' : ''}>Boxed</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Components -->
          <div class="customization-section">
            <h4>Component Styles</h4>
            <div class="component-controls">
              <div class="control-group">
                <label for="buttonStyle">Button Style</label>
                <select id="buttonStyle" name="buttonStyle">
                  <option value="filled" ${this.currentTheme.buttonStyle === 'filled' ? 'selected' : ''}>Filled</option>
                  <option value="outlined" ${this.currentTheme.buttonStyle === 'outlined' ? 'selected' : ''}>Outlined</option>
                  <option value="ghost" ${this.currentTheme.buttonStyle === 'ghost' ? 'selected' : ''}>Ghost</option>
                  <option value="rounded" ${this.currentTheme.buttonStyle === 'rounded' ? 'selected' : ''}>Rounded</option>
                  <option value="sharp" ${this.currentTheme.buttonStyle === 'sharp' ? 'selected' : ''}>Sharp</option>
                </select>
              </div>
              <div class="control-group">
                <label for="cardStyle">Card Style</label>
                <select id="cardStyle" name="cardStyle">
                  <option value="elevated" ${this.currentTheme.cardStyle === 'elevated' ? 'selected' : ''}>Elevated</option>
                  <option value="bordered" ${this.currentTheme.cardStyle === 'bordered' ? 'selected' : ''}>Bordered</option>
                  <option value="flat" ${this.currentTheme.cardStyle === 'flat' ? 'selected' : ''}>Flat</option>
                  <option value="gradient" ${this.currentTheme.cardStyle === 'gradient' ? 'selected' : ''}>Gradient</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Animations -->
          <div class="customization-section">
            <h4>Animations</h4>
            <div class="animation-controls">
              <label class="toggle-control">
                <input type="checkbox" name="animations" ${this.currentTheme.animations === 'enabled' ? 'checked' : ''}>
                <span class="toggle-slider"></span>
                <span class="toggle-label">Enable Animations</span>
              </label>
            </div>
          </div>
        </div>

        <div class="customization-panel__footer">
          <button class="btn btn--secondary" id="resetTheme">Reset to Default</button>
          <button class="btn btn--primary" id="saveTheme">Save Theme</button>
        </div>
      </div>

      <!-- Floating Toggle Button -->
      <button class="customization-toggle" title="Customize Theme">
        🎨
      </button>
    `;

    document.body.appendChild(panel);
    this.panel = panel;
  }

  bindEvents() {
    const toggle = this.panel.querySelector('.customization-toggle');
    const close = this.panel.querySelector('.customization-panel__close');
    const overlay = this.panel.querySelector('.customization-panel__overlay');
    const save = this.panel.querySelector('#saveTheme');
    const reset = this.panel.querySelector('#resetTheme');

    // Toggle panel
    toggle.addEventListener('click', () => this.togglePanel());
    close.addEventListener('click', () => this.closePanel());
    overlay.addEventListener('click', () => this.closePanel());

    // Preset selection
    this.panel.querySelectorAll('.preset-card').forEach(card => {
      card.addEventListener('click', () => {
        const presetKey = card.dataset.preset;
        this.applyPreset(presetKey);
      });
    });

    // Real-time updates
    this.panel.querySelectorAll('input, select').forEach(control => {
      if (control.type === 'range') {
        control.addEventListener('input', (e) => {
          this.updateValueDisplay(e.target);
          this.updateTheme(e.target.name, e.target.value);
        });
      } else if (control.type === 'color') {
        control.addEventListener('input', (e) => {
          this.updateTheme(e.target.name, e.target.value);
        });
      } else if (control.type === 'checkbox') {
        control.addEventListener('change', (e) => {
          this.updateTheme(e.target.name, e.target.checked ? 'enabled' : 'disabled');
        });
      } else if (control.type === 'radio' || control.tagName === 'SELECT') {
        control.addEventListener('change', (e) => {
          this.updateTheme(e.target.name, e.target.value);
        });
      }
    });

    // Save and reset
    save.addEventListener('click', () => this.saveTheme());
    reset.addEventListener('click', () => this.resetTheme());

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closePanel();
      }
    });
  }

  togglePanel() {
    if (this.isOpen) {
      this.closePanel();
    } else {
      this.openPanel();
    }
  }

  openPanel() {
    this.panel.classList.add('open');
    this.isOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closePanel() {
    this.panel.classList.remove('open');
    this.isOpen = false;
    document.body.style.overflow = '';
  }

  updateValueDisplay(input) {
    const valueDisplay = input.parentElement.querySelector('.value');
    if (valueDisplay) {
      valueDisplay.textContent = input.value + (input.name === 'fontSize' || input.name === 'borderRadius' ? 'px' : '');
    }
  }

  updateTheme(property, value) {
    this.currentTheme[property] = value;
    this.applyTheme(this.currentTheme);
  }

  applyPreset(presetKey) {
    const preset = this.presets[presetKey];
    this.currentTheme = { ...this.currentTheme, ...preset };
    this.updateFormControls();
    this.applyTheme(this.currentTheme);
  }

  updateFormControls() {
    Object.entries(this.currentTheme).forEach(([key, value]) => {
      const control = this.panel.querySelector(`[name="${key}"]`);
      if (control) {
        if (control.type === 'color' || control.type === 'range' || control.tagName === 'SELECT') {
          control.value = value;
        } else if (control.type === 'radio') {
          const radio = this.panel.querySelector(`[name="${key}"][value="${value}"]`);
          if (radio) radio.checked = true;
        } else if (control.type === 'checkbox') {
          control.checked = value === 'enabled';
        }
        
        if (control.type === 'range') {
          this.updateValueDisplay(control);
        }
      }
    });
  }

  applyTheme(theme) {
    const root = document.documentElement;
    
    // Apply color scheme
    if (theme.colorScheme === 'dark') {
      root.classList.add('dark-mode');
    } else {
      root.classList.remove('dark-mode');
    }

    // Apply CSS custom properties
    root.style.setProperty('--color-primary', theme.primaryColor);
    root.style.setProperty('--color-secondary', theme.secondaryColor);
    root.style.setProperty('--color-accent', theme.accentColor);
    root.style.setProperty('--color-background', theme.backgroundColor);
    root.style.setProperty('--color-foreground', theme.textColor);
    
    root.style.setProperty('--font-body', `"${theme.fontFamily}", system-ui, sans-serif`);
    root.style.setProperty('--font-heading', `"${theme.headingFont}", system-ui, sans-serif`);
    root.style.setProperty('--font-size-base', `${theme.fontSize}px`);
    root.style.setProperty('--line-height-base', theme.lineHeight);
    
    root.style.setProperty('--border-radius', `${theme.borderRadius}px`);
    root.style.setProperty('--button-radius', `${theme.borderRadius}px`);
    root.style.setProperty('--card-radius', `${theme.borderRadius}px`);
    
    // Apply spacing
    const spacingMultiplier = {
      compact: 0.8,
      normal: 1,
      comfortable: 1.2
    }[theme.spacing] || 1;
    
    root.style.setProperty('--spacing-xs', `${4 * spacingMultiplier}px`);
    root.style.setProperty('--spacing-sm', `${8 * spacingMultiplier}px`);
    root.style.setProperty('--spacing-md', `${16 * spacingMultiplier}px`);
    root.style.setProperty('--spacing-lg', `${24 * spacingMultiplier}px`);
    root.style.setProperty('--spacing-xl', `${32 * spacingMultiplier}px`);
    
    // Apply animations
    const animationDuration = theme.animations === 'enabled' ? '250ms' : '0ms';
    root.style.setProperty('--animation-duration', animationDuration);
    
    // Apply component styles
    root.setAttribute('data-button-style', theme.buttonStyle);
    root.setAttribute('data-card-style', theme.cardStyle);
    root.setAttribute('data-layout', theme.layout);

    // Load custom fonts if needed
    this.loadCustomFonts([theme.fontFamily, theme.headingFont]);
  }

  loadCustomFonts(fonts) {
    const googleFonts = ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Poppins', 'Montserrat', 'Playfair Display', 'Merriweather', 'Oswald'];
    const fontsToLoad = fonts.filter(font => googleFonts.includes(font));
    
    if (fontsToLoad.length > 0) {
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?${fontsToLoad.map(font => `family=${font.replace(' ', '+')}`).join('&')}&display=swap`;
      link.rel = 'stylesheet';
      
      if (!document.querySelector(`link[href*="${fontsToLoad[0]}"]`)) {
        document.head.appendChild(link);
      }
    }
  }

  saveTheme() {
    localStorage.setItem('al-shariqah-theme-settings', JSON.stringify(this.currentTheme));
    this.showNotification('Theme saved successfully!', 'success');
  }

  resetTheme() {
    this.currentTheme = this.loadThemeSettings();
    this.updateFormControls();
    this.applyTheme(this.currentTheme);
    this.showNotification('Theme reset to default', 'info');
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--color-primary);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: var(--border-radius);
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      z-index: 10000;
      animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease forwards';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Initialize the customization panel when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.LiveCustomizationPanel = new LiveCustomizationPanel();
  });
} else {
  window.LiveCustomizationPanel = new LiveCustomizationPanel();
}
