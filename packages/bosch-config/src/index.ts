/**
 * @0711/bosch-config
 * Bosch client configuration for 0711-BIG-C
 */

// MCP Configuration
export * from './mcp.config';

// Branding
export * from './branding';

// Dashboards
export * from './dashboards';

// Re-export for convenience
import { mcpConfig } from './mcp.config';
import { branding, generateCSSVariables } from './branding';
import { boschDashboards, defaultDashboardId } from './dashboards';

/**
 * Complete Bosch client configuration
 */
export const boschConfig = {
  client: {
    id: 'bosch',
    name: 'Bosch Power Tools',
    version: '1.0.0',
  },
  mcp: mcpConfig,
  branding,
  dashboards: boschDashboards,
  defaultDashboardId,
};

export default boschConfig;
