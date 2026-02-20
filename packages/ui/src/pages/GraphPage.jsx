import { Network, Loader2 } from 'lucide-react';
import { useMCPData } from '../hooks/useMCPData';

export default function GraphPage() {
  const { stats, loading, error, formatNumber, formatMillions, refetch } = useMCPData();

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin" size={32} /></div>;
  if (error && !stats) return <div className="text-center py-8 text-red-500">{error}</div>;

  const graphStats = [
    { l: 'Total Nodes', v: formatNumber(stats?.total_products) },
    { l: 'Total Edges', v: formatMillions(stats?.total_relationships) },
    { l: 'Categories', v: formatNumber(stats?.total_etim_groups) },
    { l: 'Avg Degree', v: formatNumber(stats?.avg_relationships_per_product) },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🕸️ Graph View</h1>
        <p className="text-xs text-green-600">✓ Live data from Bosch MCP</p>
      </div>
      <div className="kpi-grid">
        {graphStats.map((s, i) => (
          <div key={i} className="kpi-card">
            <Network size={20} className="text-blue-500" />
            <span className="kpi-value">{s.v}</span>
            <span className="kpi-label">{s.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
