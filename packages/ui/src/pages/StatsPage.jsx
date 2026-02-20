import { CheckCircle, Loader2 } from 'lucide-react';
import { useMCPData } from '../hooks/useMCPData';

export default function StatsPage() {
  const { stats, loading, error, formatNumber, formatMillions, refetch } = useMCPData();

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin" size={32} /></div>;
  if (error && !stats) return <div className="text-center py-8 text-red-500">{error}</div>;

  const pipeline = [
    { label: 'Product Import', status: 'completed', time: formatNumber(stats?.total_products) + ' products' },
    { label: 'Feature Extraction', status: 'completed', time: formatNumber(stats?.total_features) + ' features' },
    { label: 'Embedding Generation', status: 'completed', time: formatNumber(stats?.total_embeddings) + ' vectors' },
    { label: 'Relationship Mapping', status: 'completed', time: formatMillions(stats?.total_relationships) + ' edges' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📈 Statistics</h1>
        <p className="text-xs text-green-600">✓ Live data from Bosch MCP</p>
      </div>
      <div className="space-y-3">
        {pipeline.map((p, i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-lg border">
            <CheckCircle className="text-green-500" size={20} />
            <span className="flex-1 font-medium">{p.label}</span>
            <span className="text-gray-500">{p.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
