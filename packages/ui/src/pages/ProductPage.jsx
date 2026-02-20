import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Package, CheckCircle, XCircle, Grid3X3, Search, Activity, 
  FolderOpen, Database, GitCompare, Sparkles, Plus, Trash2, X, Loader2, Tag
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "";

// Icon mapping from config string to component
const ICON_MAP = {
  'folder': FolderOpen,
  'database': Database,
  'git-compare': GitCompare,
  'sparkles': Sparkles,
  'search': Search,
  'package': Package,
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

export default function ProductPage() {
  const [stats, setStats] = useState(null);
  const [modules, setModules] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [newCollection, setNewCollection] = useState({ name: "", icon: "📁" });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      // Fetch config for navigation modules
      const configRes = await fetch(`${API_BASE}/api/config`);
      const configData = await configRes.json();
      
      // Get modules from config - NOT HARDCODED!
      const navModules = configData?.navigation?.product?.modules || [];
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
        setStats(mcpStats);
      } else {
        setError('Could not load statistics from MCP');
      }

      // Fetch collections
      try {
        const colRes = await fetch(`${API_BASE}/api/products/collections`);
        if (colRes.ok) {
          const colData = await colRes.json();
          setCollections(colData.collections || []);
        }
      } catch (e) { /* collections endpoint may not exist */ }
    } catch (err) { 
      console.error('Error fetching data:', err);
      setError(err.message);
    }
    finally { setLoading(false); }
  };

  const createCollection = async () => {
    const res = await fetch(`${API_BASE}/api/products/collections`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCollection)
    });
    const data = await res.json();
    if (data.success) { setCollections([...collections, data.collection]); setShowDialog(false); setNewCollection({ name: "", icon: "📁" }); }
  };

  const deleteCollection = async (id) => {
    await fetch(`${API_BASE}/api/products/collections/${id}`, { method: "DELETE" });
    setCollections(collections.filter(c => c.id !== id));
  };

  // Stats config - reads from MCP data, NO hardcoded fallbacks
  const STATS_CONFIG = [
    { key: "total", label: "Total Products", Icon: Package, color: "#0066cc", getValue: s => s?.total_products?.toLocaleString() },
    { key: "active", label: "Active", Icon: CheckCircle, color: "#059669", getValue: s => s?.active_products?.toLocaleString() },
    { key: "discontinued", label: "Discontinued", Icon: XCircle, color: "#dc2626", getValue: s => s?.discontinued_products?.toLocaleString() },
    { key: "categories", label: "ETIM Groups", Icon: Grid3X3, color: "#7c3aed", getValue: s => s?.total_etim_groups?.toString() },
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
            <h1 className="text-xl font-semibold text-gray-900">Product</h1>
            <p className="text-sm text-gray-500">Catalog management and exploration</p>
            <p className="text-xs text-green-600 mt-1">✓ Live data from Bosch MCP • Modules from Config</p>
          </div>
          <button onClick={() => setShowDialog(true)} className="flex items-center gap-2 px-4 py-2 bg-[#0066cc] text-white rounded-lg hover:bg-[#0052a3]">
            <Plus size={18} /> Neue Kollektion
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

        {/* Extended Stats from MCP */}
        {stats && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
              <div className="text-sm opacity-80">Features</div>
              <div className="text-2xl font-bold">{stats.total_features?.toLocaleString()}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
              <div className="text-sm opacity-80">Relationships</div>
              <div className="text-2xl font-bold">{(stats.total_relationships / 1000000).toFixed(0)}M</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
              <div className="text-sm opacity-80">Embeddings</div>
              <div className="text-2xl font-bold">{stats.total_embeddings?.toLocaleString()}</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
              <div className="text-sm opacity-80">Catalogs</div>
              <div className="text-2xl font-bold">{stats.total_catalogs}</div>
            </div>
          </div>
        )}

        {/* Modules - FROM CONFIG, NOT HARDCODED */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
            Modules {modules.length > 0 && <span className="text-green-500">(from config)</span>}
          </h2>
          {modules.length === 0 ? (
            <p className="text-gray-500">No modules configured in navigation.product.modules</p>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {modules.map(m => {
                const IconComponent = ICON_MAP[m.icon] || Package;
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

        {/* Collections */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Produkt-Kollektionen</h2>
          {collections.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Keine Kollektionen vorhanden</p>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {collections.map(c => (
                <div key={c.id} className="p-4 border border-gray-200 rounded-xl hover:border-[#0066cc] transition-all group">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-2xl">{c.icon}</span>
                    {!c.builtin && (
                      <button onClick={() => deleteCollection(c.id)} className="text-red-500 opacity-0 group-hover:opacity-100">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <h3 className="font-medium text-gray-900">{c.name}</h3>
                  <p className="text-sm text-gray-500">{c.products} Produkte</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Dialog open={showDialog} onClose={() => setShowDialog(false)} title="Neue Kollektion erstellen">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Name</label>
            <input type="text" value={newCollection.name} onChange={e => setNewCollection({...newCollection, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Kollektion Name" />
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Icon (Emoji)</label>
            <input type="text" value={newCollection.icon} onChange={e => setNewCollection({...newCollection, icon: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="📁" />
          </div>
          <button onClick={createCollection} className="w-full py-2 bg-[#0066cc] text-white rounded-lg hover:bg-[#0052a3]">Kollektion erstellen</button>
        </div>
      </Dialog>
    </div>
  );
}
