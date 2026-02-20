import { useState, useEffect } from "react";
import { 
  Bot, Play, CheckCircle, Clock, Sparkles, 
  Search as SearchIcon, MessageSquare, FileCheck, Upload, Globe, Package, 
  TrendingUp, Shield, BookOpen, ShoppingCart, Store, FileOutput, DollarSign,
  Target, BarChart3, Loader2, ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || window.location.origin;

// Icon mapping for agents
const AGENT_ICONS = {
  "product-expert": SearchIcon,
  "quality-checker": FileCheck,
  "content-writer": MessageSquare,
  "feed-manager": Upload,
  "ecosystem-analyst": Globe,
  "migration-advisor": Package,
  "terminology-guardian": BookOpen,
  "amazon-specialist": ShoppingCart,
  "shopify-writer": Store,
  "b2b-export-manager": FileOutput,
  "price-analyst": DollarSign,
  "competition-scout": Target,
  "market-analyst": BarChart3,
};

const AGENT_COLORS = {
  "product-expert": "#0066cc",
  "quality-checker": "#059669",
  "content-writer": "#7c3aed",
  "feed-manager": "#f59e0b",
  "ecosystem-analyst": "#06b6d4",
  "migration-advisor": "#8b5cf6",
  "terminology-guardian": "#ec4899",
  "amazon-specialist": "#ff9900",
  "shopify-writer": "#95bf47",
  "b2b-export-manager": "#1a1a1a",
  "price-analyst": "#10b981",
  "competition-scout": "#ef4444",
  "market-analyst": "#6366f1",
};

// Agent Card
const AgentCard = ({ agent }) => {
  const Icon = AGENT_ICONS[agent.id] || Bot;
  const color = AGENT_COLORS[agent.id] || "#6366f1";
  
  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-sm hover:shadow-md hover:border-[#0066cc] transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + "15" }}>
          <Icon size={24} style={{ color }} />
        </div>
        <span className="px-2 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full">Aktiv</span>
      </div>
      <h3 className="font-medium text-[#1a2b3c] mb-1">{agent.name || agent.id}</h3>
      <p className="text-sm text-[#64748b] mb-3 line-clamp-2">{agent.theme || agent.description || "KI-Assistent"}</p>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {agent.skills?.slice(0, 3).map(s => (
          <span key={s} className="px-2 py-0.5 bg-[#f5f7fa] rounded text-[10px] text-[#64748b]">{s}</span>
        ))}
        {agent.skills?.length > 3 && (
          <span className="px-2 py-0.5 bg-[#f5f7fa] rounded text-[10px] text-[#64748b]">+{agent.skills.length - 3}</span>
        )}
      </div>
      <Link to={"/agent/" + agent.id}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#0066cc] hover:bg-[#0052a3] text-white text-sm font-medium rounded-lg transition-colors opacity-0 group-hover:opacity-100">
        <MessageSquare size={14} /> Chat starten
      </Link>
    </div>
  );
};

// Workflow Card
const WorkflowCard = ({ workflow }) => (
  <div className="flex items-center justify-between p-4 bg-[#f5f7fa] hover:bg-[#e2e8f0] rounded-lg transition-colors">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-[#7c3aed]/10 flex items-center justify-center">
        <Sparkles size={16} className="text-[#7c3aed]" />
      </div>
      <div>
        <div className="font-medium text-[#1a2b3c] text-sm">{workflow.name}</div>
        <div className="text-xs text-[#64748b]">{workflow.id}</div>
      </div>
    </div>
    <button className="px-3 py-1.5 text-[#0066cc] hover:bg-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1">
      <Play size={12} /> Starten
    </button>
  </div>
);

export default function SkillsPage() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API + "/api/config")
      .then(r => r.json())
      .then(data => {
        setConfig(data);
        setLoading(false);
      })
      .catch(e => {
        console.error("Failed to load config:", e);
        setLoading(false);
      });
  }, []);

  const agents = config?.agents?.list || [];
  const workflows = config?.workflows?.list || [];

  const STATS = [
    { label: "Agents", value: agents.length, icon: Bot, color: "#0066cc" },
    { label: "Workflows", value: workflows.length, icon: Sparkles, color: "#7c3aed" },
    { label: "MCP Tools", value: Object.keys(config?.dataSources?.providers || {}).length > 0 ? 27 : 0, icon: Package, color: "#059669" },
    { label: "Status", value: "Online", icon: CheckCircle, color: "#10b981" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7fa] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#0066cc]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <header className="bg-white border-b border-[#e2e8f0] px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[#1a2b3c]">Skills & Agents</h1>
            <p className="text-sm text-[#64748b]">Verfügbare KI-Assistenten und Automatisierungen</p>
          </div>
          <Link to="/assistant" className="px-4 py-2 bg-[#0066cc] hover:bg-[#0052a3] text-white text-sm font-medium rounded-lg flex items-center gap-2">
            <MessageSquare size={16} /> Zum Assistenten
          </Link>
        </div>
      </header>

      <main className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {STATS.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white rounded-xl border border-[#e2e8f0] p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <Icon size={20} style={{ color: s.color }} />
                  <span className="text-xs text-[#94a3b8]">{s.label}</span>
                </div>
                <div className="text-2xl font-semibold text-[#1a2b3c]">{s.value}</div>
              </div>
            );
          })}
        </div>

        {/* Agents */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-[#64748b] uppercase tracking-wider mb-4">KI-Assistenten ({agents.length})</h2>
          <div className="grid grid-cols-3 gap-4">
            {agents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>

        {/* Workflows */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm">
          <div className="px-5 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
            <h2 className="font-medium text-[#1a2b3c]">Workflows ({workflows.length})</h2>
            <Link to="/automation" className="text-sm text-[#0066cc] hover:underline flex items-center gap-1">
              Alle anzeigen <ArrowRight size={14} />
            </Link>
          </div>
          <div className="p-4 space-y-2">
            {workflows.slice(0, 5).map(wf => (
              <WorkflowCard key={wf.id} workflow={wf} />
            ))}
            {workflows.length > 5 && (
              <div className="text-center py-2">
                <span className="text-sm text-[#64748b]">+{workflows.length - 5} weitere Workflows</span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
