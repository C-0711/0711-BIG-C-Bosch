import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Database, BarChart3, TrendingUp, Activity, Loader2, XCircle } from 'lucide-react';
import { useMCPData } from '../hooks/useMCPData';

export default function AnalyticsPage() {
  const { stats, loading, error, formatNumber, formatMillions, refetch } = useMCPData();

  const STATS_CONFIG = [
    { key: 'products', label: 'Products', Icon: Database, color: '#0066cc', getValue: s => formatNumber(s?.total_products) },
    { key: 'embeddings', label: 'Embeddings', Icon: BarChart3, color: '#059669', getValue: s => formatNumber(s?.total_embeddings) },
    { key: 'relations', label: 'Relations', Icon: TrendingUp, color: '#7c3aed', getValue: s => formatMillions(s?.total_relationships) },
    { key: 'categories', label: 'Categories', Icon: Activity, color: '#ea580c', getValue: s => formatNumber(s?.total_etim_groups) },
  ];

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin" size={32} /><p className="ml-2">Loading from MCP...</p></div>;
  if (error && !stats) return <div className="flex items-center justify-center h-64 flex-col gap-4"><XCircle className="text-red-500" size={32} /><p>{error}</p><button onClick={refetch} className="btn">Retry</button></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📊 Analytics</h1>
        <p className="subtitle">Platform metrics and insights</p>
        <p className="text-xs text-green-600 mt-1">✓ Live data from Bosch MCP</p>
      </div>
      <div className="kpi-grid">
        {STATS_CONFIG.map(s => (
          <div key={s.key} className="kpi-card">
            <s.Icon size={20} style={{ color: s.color }} />
            <div className="kpi-content">
              <span className="kpi-value">{s.getValue(stats)}</span>
              <span className="kpi-label">{s.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
