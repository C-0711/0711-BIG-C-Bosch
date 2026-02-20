import { Link } from 'react-router-dom';
import { Package, CheckCircle, GitBranch, Grid3X3, Database, Network, Megaphone, BarChart3, Search as SearchIcon, Loader2, XCircle } from 'lucide-react';
import { useMCPData } from '../hooks/useMCPData';

export default function IntelligenceDashboard() {
  const { stats, navigation, loading, error, formatNumber, formatMillions, refetch, getModules } = useMCPData();

  // Get modules from config
  const modules = getModules('dashboard') || [
    { path: '/marketing', Icon: Megaphone, name: 'Marketing', desc: 'SEO & Content', color: '#0066cc' },
    { path: '/product', Icon: Package, name: 'Product', desc: 'Catalog', color: '#059669' },
    { path: '/analytics', Icon: BarChart3, name: 'Analytics', desc: 'Metrics', color: '#7c3aed' },
    { path: '/intelligence', Icon: Network, name: 'Intelligence', desc: 'Network', color: '#db2777' },
    { path: '/research', Icon: SearchIcon, name: 'Research', desc: 'Explore', color: '#ea580c' },
  ];

  const STATS_CONFIG = [
    { key: 'products', label: 'Products', Icon: Package, color: '#0066cc', getValue: s => formatNumber(s?.total_products) },
    { key: 'active', label: 'Active', Icon: CheckCircle, color: '#059669', getValue: s => formatNumber(s?.active_products) },
    { key: 'relations', label: 'Relations', Icon: GitBranch, color: '#7c3aed', getValue: s => formatMillions(s?.total_relationships) },
    { key: 'categories', label: 'Categories', Icon: Grid3X3, color: '#db2777', getValue: s => formatNumber(s?.total_etim_groups) },
    { key: 'embeddings', label: 'Embeddings', Icon: Database, color: '#ea580c', getValue: s => formatNumber(s?.total_embeddings) },
  ];

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin" size={32} /></div>;
  if (error && !stats) return <div className="text-center py-8"><p className="text-red-500">{error}</p><button onClick={refetch}>Retry</button></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🧠 Intelligence Dashboard</h1>
        <p className="subtitle">Overview of all intelligence capabilities</p>
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

      <Link to="/global-network" className="block my-6 rounded-xl overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8">
          <h2 className="text-2xl font-bold text-white">Product Network</h2>
          <p className="text-white/80">Explore {formatNumber(stats?.total_products)} products and their relationships</p>
        </div>
      </Link>

      <div className="grid grid-cols-5 gap-4">
        {modules.map(m => (
          <Link key={m.path} to={m.path} className="p-4 bg-white rounded-xl border hover:border-blue-500">
            <m.Icon size={24} style={{ color: m.color }} />
            <div className="mt-2 font-medium">{m.name}</div>
            <div className="text-xs text-gray-500">{m.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
