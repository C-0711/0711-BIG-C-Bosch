/**
 * API Configuration
 * Centralized configuration for all API endpoints
 */

// Use environment variable, fallback to same origin
export const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return '';
};

const API_BASE_URL = getApiBaseUrl();
const MCP_BASE_URL = import.meta.env.VITE_MCP_URL || API_BASE_URL;

// Export dynamic API URL for direct use
export const API_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  // Product endpoints
  searchProducts: `${API_BASE_URL}/api/products/search`,
  searchSimilar: `${API_BASE_URL}/api/products/similar`,
  getProduct: (id) => `${API_BASE_URL}/api/products/${id}`,
  getProductByPid: (pid) => `${API_BASE_URL}/api/products/pid/${pid}`,
  getRelated: (id) => `${API_BASE_URL}/api/products/${id}/related`,

  // Graph endpoints
  getGraph: `${API_BASE_URL}/api/graph`,
  getProductNetwork: (pid) => `${API_BASE_URL}/api/graph/network/${pid}`,
  getGlobalNetwork: `${API_BASE_URL}/api/graph/global`,

  // Statistics & Analytics
  getStatistics: `${API_BASE_URL}/api/statistics`,
  getCoverageMetrics: `${API_BASE_URL}/api/analytics/coverage`,

  // Classification
  getETIMGroups: `${API_BASE_URL}/api/etim/groups`,
  getECLASSGroups: `${API_BASE_URL}/api/eclass/groups`,
  searchByETIM: (groupId) => `${API_BASE_URL}/api/etim/${groupId}/products`,

  // Media
  getProductMedia: (pid) => `${API_BASE_URL}/api/products/${pid}/media`,
  getProductImages: (pid) => `${API_BASE_URL}/api/products/${pid}/images`,
  getProductDocuments: (pid) => `${API_BASE_URL}/api/products/${pid}/documents`,

  // Custom queries
  executeSQL: `${API_BASE_URL}/api/query/sql`,
  executeCypher: `${API_BASE_URL}/api/query/cypher`,
};

export const API_CONFIG = {
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
};

export async function apiFetch(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
  try {
    const response = await fetch(url, {
      ...options,
      headers: { ...API_CONFIG.headers, ...options.headers },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') throw new Error('Request timeout');
    throw error;
  }
}

export const api = {
  searchProducts: async (query, options = {}) => {
    const { limit = 20, offset = 0, filters = {} } = options;
    return apiFetch(API_ENDPOINTS.searchProducts, {
      method: 'POST', body: JSON.stringify({ query, limit, offset, filters }),
    });
  },
  searchSimilar: async (query, options = {}) => {
    const { threshold = 0.7, limit = 10 } = options;
    return apiFetch(API_ENDPOINTS.searchSimilar, {
      method: 'POST', body: JSON.stringify({ query, threshold, limit }),
    });
  },
  getProduct: async (identifier) => {
    const isNumeric = /^\d+$/.test(identifier);
    const url = isNumeric ? API_ENDPOINTS.getProduct(identifier) : API_ENDPOINTS.getProductByPid(identifier);
    return apiFetch(url);
  },
  getRelated: async (productId, relationshipType = null) => {
    const url = API_ENDPOINTS.getRelated(productId);
    const params = relationshipType ? `?type=${relationshipType}` : '';
    return apiFetch(url + params);
  },
  getProductNetwork: async (supplierPid, options = {}) => {
    const { limit = 50, depth = 1, relationshipTypes = [] } = options;
    return apiFetch(API_ENDPOINTS.getProductNetwork(supplierPid), {
      method: 'POST', body: JSON.stringify({ limit, depth, relationshipTypes }),
    });
  },
  getGlobalNetwork: async (options = {}) => {
    const { limit = 500, minConnections = 10, entityType = 'all', productType = null, etimGroup = null } = options;
    return apiFetch(API_ENDPOINTS.getGlobalNetwork, {
      method: 'POST',
      body: JSON.stringify({ limit, min_connections: minConnections, entity_type: entityType, product_type: productType, etim_group: etimGroup }),
    });
  },
  getStatistics: async () => apiFetch(API_ENDPOINTS.getStatistics),
  getETIMGroups: async (limit = 50) => apiFetch(`${API_ENDPOINTS.getETIMGroups}?limit=${limit}`),
  executeSQL: async (query, limit = 100) => apiFetch(API_ENDPOINTS.executeSQL, { method: 'POST', body: JSON.stringify({ query, limit }) }),
  executeCypher: async (query) => apiFetch(API_ENDPOINTS.executeCypher, { method: 'POST', body: JSON.stringify({ query }) }),
};

export default api;
