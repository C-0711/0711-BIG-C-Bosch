/**
 * Bosch Branding Configuration
 * Official Bosch brand colors and assets
 */

export interface BrandingConfig {
  appTitle: string;
  appSubtitle?: string;
  logo: string;
  logoAlt?: string;
  favicon: string;
  colors: ColorPalette;
  fonts?: FontConfig;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
}

export interface FontConfig {
  primary: string;
  secondary?: string;
}

export const branding: BrandingConfig = {
  appTitle: 'Bosch Product Intelligence',
  appSubtitle: 'Powered by 0711',
  logo: '/assets/bosch-logo.svg',
  logoAlt: 'Bosch Logo',
  favicon: '/assets/bosch-favicon.ico',
  colors: {
    // Official Bosch Colors
    primary: '#E20015',      // Bosch Red
    secondary: '#005691',    // Bosch Blue
    accent: '#00A651',       // Bosch Green
    success: '#00A651',      // Green
    warning: '#FFB800',      // Amber
    error: '#E20015',        // Red
    background: '#F5F5F5',   // Light Gray
    surface: '#FFFFFF',      // White
    text: '#333333',         // Dark Gray
    textSecondary: '#666666', // Medium Gray
  },
  fonts: {
    primary: 'Bosch Sans, Arial, sans-serif',
  },
};

/**
 * CSS Variables for theming
 */
export function generateCSSVariables(config: BrandingConfig = branding): string {
  return `
:root {
  --color-primary: ${config.colors.primary};
  --color-secondary: ${config.colors.secondary};
  --color-accent: ${config.colors.accent};
  --color-success: ${config.colors.success};
  --color-warning: ${config.colors.warning};
  --color-error: ${config.colors.error};
  --color-background: ${config.colors.background};
  --color-surface: ${config.colors.surface};
  --color-text: ${config.colors.text};
  --color-text-secondary: ${config.colors.textSecondary};
  --font-primary: ${config.fonts?.primary || 'system-ui, sans-serif'};
}
`.trim();
}
