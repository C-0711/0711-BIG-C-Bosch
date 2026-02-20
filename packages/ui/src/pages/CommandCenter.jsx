import React from 'react';
import { Link } from 'react-router-dom';
import { Loader2, XCircle, MessageSquare, Package, Network, Zap, Megaphone, BarChart3, Search, ArrowLeft } from 'lucide-react';
import { useMCPData } from '../hooks/useMCPData';

const ICON_MAP = {
  'chat': MessageSquare, 'package': Package, 'network': Network,
  'zap': Zap, 'megaphone': Megaphone, 'bar-chart': BarChart3, 'search': Search,
};

export default function CommandCenter() {
  const { stats, navigation, loading, error, formatNumber, formatMillions, refetch } = useMCPData();

  // Get modules from config - fallback to empty
  const modules = navigation?.command?.modules || [
    // These should be in config, but provide sensible defaults that reference real routes
    { id: 'chat', icon: 'chat', title: 'AI Assistant', desc: 'Chat mit Agenten', link: '/agent/product-expert', statsKey: 'agents' },
    { id: 'products', icon: 'package', title: 'Produktkatalog', desc: 'Produkte durchsuchen', link: '/product', statsKey: 'products' },
    { id: 'network', icon: 'network', title: 'Netzwerk-Analyse', desc: 'Beziehungen visualisieren', link: '/global-network', statsKey: 'relationships' },
    { id: 'workflows', icon: 'zap', title: 'Automation', desc: 'Workflows ausführen', link: '/automation', statsKey: 'workflows' },
    { id: 'marketing', icon: 'megaphone', title: 'Marketing', desc: 'Content generieren', link: '/marketing', statsKey: 'channels' },
    { id: 'reports', icon: 'bar-chart', title: 'Reports', desc: 'Analysen und Insights', link: '/reports', statsKey: 'reports' },
  ];

  // Dynamic stats based on MCP data
  const getStatValue = (key) => {
    switch(key) {
      case 'products': return formatNumber(stats?.total_products);
      case 'relationships': return formatMillions(stats?.total_relationships);
      case 'agents': return '13 Agents';
      case 'workflows': return '12 Workflows';
      default: return '-';
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64 flex-col gap-4">
      <Loader2 className="animate-spin" size={32} />
      <p className="text-gray-500">Loading from MCP & Config...</p>
    </div>
  );

  if (error && !stats) return (
    <div className="flex items-center justify-center h-64 flex-col gap-4">
      <XCircle className="text-red-500" size={32} />
      <p className="text-red-500">Error: {error}</p>
      <button onClick={refetch} className="px-4 py-2 bg-blue-500 text-white rounded">Retry</button>
    </div>
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center gap-4">
          <Link to="/intelligence" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={20} /></Link>
          <div>
            <h1>🎯 Command Center</h1>
            <p className="subtitle">Unified Workspace - Alle Tools an einem Ort</p>
            <p className="text-xs text-green-600 mt-1">✓ Live data from Bosch MCP</p>
          </div>
        </div>
      </div>

      {/* Quick Stats - FROM MCP */}
      <div className="kpi-grid">
        <div className="kpi-card" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}>
          <div className="kpi-content" style={{ color: '#fff' }}>
            <span className="kpi-value">{formatNumber(stats?.total_products)}</span>
            <span className="kpi-label" style={{ color: 'rgba(255,255,255,0.8)' }}>Produkte</span>
          </div>
        </div>
        <div className="kpi-card" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
          <div className="kpi-content" style={{ color: '#fff' }}>
            <span className="kpi-value">13</span>
            <span className="kpi-label" style={{ color: 'rgba(255,255,255,0.8)' }}>AI Agents</span>
          </div>
        </div>
        <div className="kpi-card" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' }}>
          <div className="kpi-content" style={{ color: '#fff' }}>
            <span className="kpi-value">{formatMillions(stats?.total_relationships)}</span>
            <span className="kpi-label" style={{ color: 'rgba(255,255,255,0.8)' }}>Beziehungen</span>
          </div>
        </div>
        <div className="kpi-card" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
          <div className="kpi-content" style={{ color: '#fff' }}>
            <span className="kpi-value">12</span>
            <span className="kpi-label" style={{ color: 'rgba(255,255,255,0.8)' }}>Workflows</span>
          </div>
        </div>
      </div>

      {/* Module Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '24px' }}>
        {modules.map(mod => {
          const IconComponent = ICON_MAP[mod.icon] || Package;
          return (
            <Link key={mod.id} to={mod.link} style={{
              background: '#1e1e2e', borderRadius: '16px', padding: '24px',
              textDecoration: 'none', border: '1px solid #2a2a3a', display: 'block'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ fontSize: '40px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconComponent size={32} className="text-blue-500" />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: '#fff', margin: '0 0 4px 0', fontSize: '18px' }}>{mod.title}</h3>
                  <p style={{ color: '#64748b', margin: '0 0 12px 0', fontSize: '14px' }}>{mod.desc}</p>
                  <span style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>
                    {getStatValue(mod.statsKey)}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div style={{ background: '#1e1e2e', borderRadius: '16px', padding: '24px', marginTop: '24px' }}>
        <h3 style={{ color: '#fff', marginBottom: '16px' }}>⚡ Schnellzugriff</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link to="/agent/product-expert" style={{ background: '#3b82f6', color: '#fff', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none' }}>💬 Produkt-Suche</Link>
          <Link to="/automation" style={{ background: '#10b981', color: '#fff', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none' }}>⚡ Workflow</Link>
          <Link to="/skills" style={{ background: '#8b5cf6', color: '#fff', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none' }}>🤖 Agents</Link>
        </div>
      </div>
    </div>
  );
}
