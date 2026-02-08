/**
 * Bosch MCP Configuration
 * Connects to Bosch product data via MCP
 */

export interface MCPConfig {
  endpoint: string;
  apiKey?: string;
  timeout: number;
  retries: number;
}

export const mcpConfig: MCPConfig = {
  endpoint: process.env.BOSCH_MCP_ENDPOINT || 'http://localhost:3000/mcp',
  apiKey: process.env.BOSCH_MCP_API_KEY,
  timeout: 30000,
  retries: 3,
};

/**
 * Standard MCP Tools available for Bosch
 * All 27 standard tools work with Bosch product data
 */
export const standardTools = [
  // Search & Discovery
  'search_products',
  'search_similar_products',
  'find_similar_products',
  'search_by_etim_group',
  'search_massive_products',
  'search_catalogs_semantic',
  'find_product_in_catalogs',
  
  // Product Details
  'get_product',
  'get_related_products',
  'get_product_media',
  'get_product_images',
  'get_product_documents',
  'get_massive_product',
  'list_massive_products',
  'get_factsheet_data',
  'generate_factsheet_ultimate',
  
  // Classification & Taxonomy
  'get_etim_groups',
  'resolve_product_family',
  'resolve_product_family_advanced',
  'get_product_class_terminology',
  'validate_product_terminology',
  
  // Analytics & Intelligence
  'get_statistics',
  'aggregate_product_specs',
  'check_product_compatibility',
  'get_product_lineage',
  'analyze_product_ecosystem',
  
  // Data Access
  'execute_sql',
  'execute_cypher',
] as const;

export type StandardTool = typeof standardTools[number];
