import { Package, GitBranch, Layers, Network, Loader2 } from 'lucide-react';
import { useMCPData } from '../hooks/useMCPData';

export default function SupplyChainPage() {
  const { stats, loading, error, formatNumber, formatMillions, refetch } = useMCPData();

  const STATS = [
    { label: 'Products', Icon: Package, color: '#0066cc', getValue: s => formatNumber(s?.total_products) },
    { label: 'Relationships', Icon: GitBranch, color: '#059669', getValue: s => formatMillions(s?.total_relationships) },
    { label: 'Avg. Dependencies', Icon: Layers, color: '#7c3aed', getValue: s => formatNumber(s?.avg_relationships_per_product) },
    { label: 'Categories', Icon: Network, color: '#ea580c', getValue: s => formatNumber(s?.total_etim_groups) },
  ];

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin" size={32} /></div>;
  if (error && !stats) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🔗 Supply Chain</h1>
        <p className="text-xs text-green-600">✓ Live data from Bosch MCP</p>
      </div>
      <div className="kpi-grid">
        {STATS.map((s, i) => (
          <div key={i} className="kpi-card">
            <s.Icon size={20} style={{ color: s.color }} />
            <span className="kpi-value">{s.getValue(stats)}</span>
            <span className="kpi-label">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
