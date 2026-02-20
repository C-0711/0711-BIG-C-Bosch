import { Link } from 'react-router-dom';
import { Package, CheckCircle, XCircle, Grid3X3, Loader2 } from 'lucide-react';
import { useMCPData } from '../hooks/useMCPData';

export default function ProductsPage() {
  const { stats, loading, error, formatNumber, refetch } = useMCPData();

  const STATS = [
    { label: 'Total Products', Icon: Package, color: '#0066cc', getValue: s => formatNumber(s?.total_products) },
    { label: 'Active', Icon: CheckCircle, color: '#059669', getValue: s => formatNumber(s?.active_products) },
    { label: 'Discontinued', Icon: XCircle, color: '#dc2626', getValue: s => formatNumber(s?.discontinued_products) },
    { label: 'ETIM Groups', Icon: Grid3X3, color: '#7c3aed', getValue: s => formatNumber(s?.total_etim_groups) },
  ];

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin" size={32} /></div>;
  if (error && !stats) return <div className="text-center py-8 text-red-500">{error}<button onClick={refetch} className="ml-4 btn">Retry</button></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📦 Products</h1>
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
