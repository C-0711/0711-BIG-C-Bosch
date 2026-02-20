import React from 'react';
import { Link } from 'react-router-dom';
import { Loader2, XCircle, Network, ArrowLeft } from 'lucide-react';
import { useMCPData } from '../hooks/useMCPData';

export default function GlobalNetwork() {
  const { stats, loading, error, formatNumber, formatMillions, refetch } = useMCPData();

  if (loading) return (
    <div className="flex items-center justify-center h-64 flex-col gap-4">
      <Loader2 className="animate-spin" size={32} />
      <p className="text-gray-500">Loading from MCP...</p>
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
          <Link to="/intelligence" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1>🌐 Global Network</h1>
            <p className="subtitle">Vollständige Produkt-Netzwerk Visualisierung</p>
            <p className="text-xs text-green-600 mt-1">✓ Live data from Bosch MCP</p>
          </div>
        </div>
      </div>

      {/* Stats Bar - FROM MCP */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon">🔵</div>
          <div className="kpi-content">
            <span className="kpi-value">{formatNumber(stats?.total_products)}</span>
            <span className="kpi-label">Produkte (Nodes)</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon">🔗</div>
          <div className="kpi-content">
            <span className="kpi-value">{formatMillions(stats?.total_relationships)}</span>
            <span className="kpi-label">Beziehungen (Edges)</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon">📊</div>
          <div className="kpi-content">
            <span className="kpi-value">{formatNumber(stats?.total_etim_groups)}</span>
            <span className="kpi-label">ETIM Kategorien</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon">⚡</div>
          <div className="kpi-content">
            <span className="kpi-value">{formatNumber(stats?.avg_relationships_per_product)}</span>
            <span className="kpi-label">Avg. Verbindungen</span>
          </div>
        </div>
      </div>

      {/* Network Visualization */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 50%, #16213e 100%)',
        borderRadius: '16px',
        padding: '40px',
        minHeight: '500px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: 0.3,
          background: 'radial-gradient(circle at 20% 30%, #3b82f6 0%, transparent 30%), radial-gradient(circle at 80% 70%, #10b981 0%, transparent 25%), radial-gradient(circle at 50% 50%, #8b5cf6 0%, transparent 35%)'
        }} />
        
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Network size={80} className="text-white mb-4 mx-auto" />
          <h2 style={{ color: '#fff', marginBottom: '10px', fontSize: '28px' }}>Produkt-Netzwerk</h2>
          <p style={{ color: '#94a3b8', marginBottom: '30px', maxWidth: '500px' }}>
            Interaktive Visualisierung von {formatNumber(stats?.total_products)} Bosch-Produkten 
            und ihren {formatMillions(stats?.total_relationships)} Beziehungen
          </p>
        </div>
      </div>

      <p style={{ color: '#64748b', textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
        💡 Graph-Visualisierung in nächster Version
      </p>
    </div>
  );
}
