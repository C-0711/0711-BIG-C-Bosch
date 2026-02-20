import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Network, GitBranch, Layers, Share2, Globe, Map, Command, 
  Plus, Trash2, X, Loader2, Brain, Save, XCircle
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "";

// Icon mapping from config string to component
const ICON_MAP = {
  'globe': Globe,
  'map': Map,
  'command': Command,
  'network': Network,
  'brain': Brain,
};

const Dialog = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl border border-gray-200 p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default function IntelligencePage() {
  const [stats, setStats] = useState(null);
  const [modules, setModules] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [newAnalysis, setNewAnalysis] = useState({ name: "", type: "network" });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      // Fetch config for navigation modules
      const configRes = await fetch(`${API_BASE}/api/config`);
      const configData = await configRes.json();
      
      // Get modules from config - NOT HARDCODED!
      const navModules = configData?.navigation?.intelligence?.modules || [];
      setModules(navModules);

      // Fetch real statistics from MCP
      const statsRes = await fetch(`${API_BASE}/api/mcp/bosch-mcp/call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: 'get_statistics' })
      });
      
      const statsData = await statsRes.json();
      
      if (statsData.success && statsData.result?.content?.[0]?.text) {
        const mcpStats = JSON.parse(statsData.result.content[0].text);
        if (mcpStats.total_products && mcpStats.total_relationships) {
          mcpStats.avg_relationships_per_product = Math.round(mcpStats.total_relationships / mcpStats.total_products);
        }
        setStats(mcpStats);
      } else {
        setError('Could not load statistics from MCP');
      }

      // Fetch analyses
      try {
        const analysesRes = await fetch(`${API_BASE}/api/intelligence/analyses`);
        if (analysesRes.ok) {
          const data = await analysesRes.json();
          setAnalyses(data.analyses || []);
        }
      } catch (e) { /* analyses endpoint may not exist */ }
    } catch (err) { 
      console.error(err);
      setError(err.message);
    }
    finally { setLoading(false); }
  };

  const createAnalysis = async () => {
    const res = await fetch(`${API_BASE}/api/intelligence/analyses`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAnalysis)
    });
    const data = await res.json();
    if (data.success) { setAnalyses([...analyses, data.analysis]); setShowDialog(false); setNewAnalysis({ name: "", type: "network" }); }
  };

  const deleteAnalysis = async (id) => {
    await fetch(`${API_BASE}/api/intelligence/analyses/${id}`, { method: "DELETE" });
    setAnalyses(analyses.filter(a => a.id !== id));
  };

  // Stats config - NO hardcoded fallbacks!
  const STATS_CONFIG = [
    { key: "nodes", label: "Nodes", Icon: Network, color: "#0066cc", getValue: s => s?.total_products?.toLocaleString() },
    { key: "edges", label: "Edges", Icon: GitBranch, color: "#059669", getValue: s => s?.total_relationships ? `${(s.total_relationships/1e6).toFixed(0)}M` : null },
    { key: "clusters", label: "Categories", Icon: Layers, color: "#7c3aed", getValue: s => s?.total_etim_groups?.toString() },
    { key: "density", label: "Avg. Connections", Icon: Share2, color: "#ea580c", getValue: s => s?.avg_relationships_per_product?.toLocaleString() },
  ];

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
      <button onClick={fetchData} className="px-4 py-2 bg-blue-500 text-white rounded">Retry</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Intelligence</h1>
            <p className="text-sm text-gray-500">AI-powered network analysis and visualization</p>
            <p className="text-xs text-green-600 mt-1">✓ Live data from Bosch MCP • Modules from Config</p>
          </div>
          <button onClick={() => setShowDialog(true)} className="flex items-center gap-2 px-4 py-2 bg-[#0066cc] text-white rounded-lg hover:bg-[#0052a3]">
            <Save size={18} /> Analyse speichern
          </button>
        </div>
      </header>

      <main className="p-6">
        {/* Stats - REAL DATA FROM MCP */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {STATS_CONFIG.map(s => (
            <div key={s.key} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <s.Icon size={20} style={{ color: s.color }} />
                <span className="text-xs text-gray-500">{s.label}</span>
              </div>
              <div className="text-2xl font-semibold text-gray-900">{s.getValue(stats) || '-'}</div>
            </div>
          ))}
        </div>

        {/* Featured Network Card */}
        <Link to="/global-network" className="block mb-6 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-blue-200 text-sm font-medium">Featured</span>
                <h2 className="text-2xl font-bold text-white mt-1">Product Network</h2>
                <p className="text-blue-100 mt-2">
                  Explore {stats?.total_products?.toLocaleString() || '—'} products and their relationships
                </p>
              </div>
              <div className="bg-white/20 rounded-xl p-4">
                <Network size={48} className="text-white" />
              </div>
            </div>
          </div>
        </Link>

        {/* Modules - FROM CONFIG, NOT HARDCODED */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
            Modules {modules.length > 0 && <span className="text-green-500">(from config)</span>}
          </h2>
          {modules.length === 0 ? (
            <p className="text-gray-500">No modules configured in navigation.intelligence.modules</p>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {modules.map(m => {
                const IconComponent = ICON_MAP[m.icon] || Network;
                return (
                  <Link key={m.id} to={m.path} className="p-5 bg-white border border-gray-200 rounded-xl hover:border-[#0066cc] hover:shadow-md transition-all group shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mb-3 group-hover:bg-[#0066cc]/10">
                      <IconComponent size={20} className="text-gray-500 group-hover:text-[#0066cc]" />
                    </div>
                    <div className="font-medium text-gray-900 group-hover:text-[#0066cc]">{m.name}</div>
                    <div className="text-xs text-gray-500">{m.desc}</div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Saved Analyses */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Gespeicherte Analysen</h2>
          {analyses.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Keine gespeicherten Analysen</p>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {analyses.map(a => (
                <div key={a.id} className="p-4 border border-gray-200 rounded-xl hover:border-[#0066cc] transition-all group">
                  <div className="flex justify-between items-start mb-3">
                    <Brain size={24} className="text-indigo-500" />
                    <button onClick={() => deleteAnalysis(a.id)} className="text-red-500 opacity-0 group-hover:opacity-100">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <h3 className="font-medium text-gray-900">{a.name}</h3>
                  <p className="text-sm text-gray-500">{a.type}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Dialog open={showDialog} onClose={() => setShowDialog(false)} title="Analyse speichern">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Name</label>
            <input type="text" value={newAnalysis.name} onChange={e => setNewAnalysis({...newAnalysis, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Analyse Name" />
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Typ</label>
            <select value={newAnalysis.type} onChange={e => setNewAnalysis({...newAnalysis, type: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="network">Netzwerk-Analyse</option>
              <option value="cluster">Cluster-Analyse</option>
              <option value="comparison">Vergleichs-Analyse</option>
            </select>
          </div>
          <button onClick={createAnalysis} className="w-full py-2 bg-[#0066cc] text-white rounded-lg hover:bg-[#0052a3]">Analyse speichern</button>
        </div>
      </Dialog>
    </div>
  );
}
