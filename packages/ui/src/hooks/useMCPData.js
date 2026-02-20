/**
 * Central hook for fetching MCP statistics and Config navigation
 * ALL pages should use this instead of hardcoding values!
 */
import { useState, useEffect, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '';

// Cache for MCP data to avoid redundant API calls
let mcpCache = null;
let configCache = null;
let lastFetchTime = 0;
const CACHE_TTL = 30000; // 30 seconds cache

export function useMCPData() {
  const [stats, setStats] = useState(null);
  const [navigation, setNavigation] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (force = false) => {
    const now = Date.now();
    
    // Use cache if available and not expired
    if (!force && mcpCache && configCache && (now - lastFetchTime) < CACHE_TTL) {
      setStats(mcpCache);
      setNavigation(configCache);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch both in parallel
      const [mcpRes, configRes] = await Promise.all([
        fetch(`${API_BASE}/api/mcp/bosch-mcp/call`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tool: 'get_statistics' })
        }),
        fetch(`${API_BASE}/api/config`)
      ]);

      // Parse MCP stats
      const mcpData = await mcpRes.json();
      if (mcpData.success && mcpData.result?.content?.[0]?.text) {
        const mcpStats = JSON.parse(mcpData.result.content[0].text);
        // Calculate derived stats
        if (mcpStats.total_products && mcpStats.total_relationships) {
          mcpStats.avg_relationships_per_product = Math.round(mcpStats.total_relationships / mcpStats.total_products);
        }
        mcpCache = mcpStats;
        setStats(mcpStats);
      } else {
        throw new Error('Failed to fetch MCP statistics');
      }

      // Parse config
      const configData = await configRes.json();
      configCache = configData.navigation || {};
      setNavigation(configData.navigation || {});

      lastFetchTime = now;
    } catch (err) {
      console.error('useMCPData error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Helper to get modules for a specific section
  const getModules = useCallback((section) => {
    return navigation?.[section]?.modules || [];
  }, [navigation]);

  // Helper to format stats
  const formatNumber = useCallback((num) => {
    if (num === null || num === undefined) return '-';
    return num.toLocaleString();
  }, []);

  const formatMillions = useCallback((num) => {
    if (num === null || num === undefined) return '-';
    return `${(num / 1000000).toFixed(0)}M`;
  }, []);

  return {
    // Raw data
    stats,
    navigation,
    loading,
    error,
    
    // Helpers
    getModules,
    formatNumber,
    formatMillions,
    refetch: () => fetchData(true),

    // Pre-formatted common stats (NO FALLBACKS - show '-' if not loaded)
    totalProducts: stats?.total_products,
    activeProducts: stats?.active_products,
    discontinuedProducts: stats?.discontinued_products,
    totalFeatures: stats?.total_features,
    totalRelationships: stats?.total_relationships,
    totalEmbeddings: stats?.total_embeddings,
    totalEtimGroups: stats?.total_etim_groups,
    avgConnectionsPerProduct: stats?.avg_relationships_per_product,
    totalCatalogs: stats?.total_catalogs,
  };
}

export default useMCPData;
