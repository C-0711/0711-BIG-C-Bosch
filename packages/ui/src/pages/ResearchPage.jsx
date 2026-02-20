import { Link } from 'react-router-dom';
import { Sparkles, Command, Map, Network, Loader2 } from 'lucide-react';
import { useMCPData } from '../hooks/useMCPData';

const ICON_MAP = { 'sparkles': Sparkles, 'command': Command, 'map': Map, 'network': Network };

export default function ResearchPage() {
  const { navigation, loading, error, getModules, refetch } = useMCPData();

  // Get modules from config
  const modules = getModules('research') || [
    { path: '/search', name: 'Semantic Search', desc: 'Natural language queries', icon: 'sparkles' },
    { path: '/command', name: 'Command Center', desc: 'Unified workspace', icon: 'command' },
    { path: '/mindmap', name: 'Mind Map', desc: 'Visual exploration', icon: 'map' },
  ];

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin" size={32} /></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🔬 Research</h1>
        <p className="subtitle">Exploration and discovery tools</p>
        <p className="text-xs text-green-600">✓ Modules from Config</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {modules.map(m => {
          const Icon = ICON_MAP[m.icon] || Network;
          return (
            <Link key={m.path} to={m.path} className="p-5 bg-white rounded-xl border hover:border-blue-500">
              <Icon size={24} className="text-blue-500 mb-3" />
              <div className="font-medium">{m.name}</div>
              <div className="text-sm text-gray-500">{m.desc}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
