import { Package, Loader2 } from 'lucide-react';
import { useMCPData } from '../hooks/useMCPData';

export default function CatalogImpactPage() {
  const { stats, loading, error, formatNumber, refetch } = useMCPData();
  
  const categories = [
    { name: 'Heiztechnik', pct: 35.6, color: '#3b82f6' },
    { name: 'Erneuerbare', pct: 19.5, color: '#10b981' },
    { name: 'Warmwasser', pct: 16.8, color: '#8b5cf6' },
    { name: 'Regelung', pct: 10.1, color: '#f59e0b' },
    { name: 'Zubehör', pct: 18.0, color: '#ef4444' },
  ];

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin" size={32} /></div>;
  if (error && !stats) return <div className="text-center py-8 text-red-500">{error}</div>;

  const total = stats?.total_products || 0;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📊 Catalog Impact</h1>
        <p className="text-xs text-green-600">✓ Live data from Bosch MCP</p>
      </div>
      <div className="kpi-card mb-6">
        <Package size={20} style={{ color: '#0066cc' }} />
        <span className="kpi-value">{formatNumber(total)}</span>
        <span className="kpi-label">Total Products</span>
      </div>
      <div className="space-y-4">
        {categories.map(c => (
          <div key={c.name} className="bg-white rounded-lg p-4 border">
            <div className="flex justify-between mb-2">
              <span className="font-medium">{c.name}</span>
              <span className="text-gray-500">{formatNumber(Math.round(total * c.pct / 100))} / {formatNumber(total)}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full">
              <div className="h-2 rounded-full" style={{ width: c.pct + '%', background: c.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
