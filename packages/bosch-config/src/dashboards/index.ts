/**
 * Bosch Dashboard Templates
 */

export * from './product-research';
export * from './sales-assistant';
export * from './technical-analysis';

import { productResearchDashboard } from './product-research';
import { salesAssistantDashboard } from './sales-assistant';
import { technicalAnalysisDashboard } from './technical-analysis';

/**
 * All available Bosch dashboards
 */
export const boschDashboards = [
  productResearchDashboard,
  salesAssistantDashboard,
  technicalAnalysisDashboard,
];

/**
 * Get dashboard by ID
 */
export function getDashboard(id: string) {
  return boschDashboards.find(d => d.id === id);
}

/**
 * Default dashboard for new users
 */
export const defaultDashboardId = 'bosch-product-research';
