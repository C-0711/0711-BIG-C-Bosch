import React, { useState } from 'react'

interface AgentConfig {
  id: string
  name: string
  emoji: string
  theme: string
  dataSources: string[]
  skills: string[]
  enabled: boolean
}

const AVAILABLE_SKILLS = [
  'search', 'describe', 'compare', 'quality-audit', 'gap-analysis',
  'export', 'translate', 'summarize', 'enrich', 'validate'
]

const AVAILABLE_DATA_SOURCES = [
  'bosch-mcp', 'isoled-mcp', 'lightnet-mcp', 'bette-mcp'
]

export function AgentCreator({ onSave, onCancel }: { onSave: (agent: AgentConfig) => void, onCancel: () => void }) {
  const [agent, setAgent] = useState<AgentConfig>({
    id: '',
    name: '',
    emoji: '🤖',
    theme: '',
    dataSources: [],
    skills: [],
    enabled: true,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const id = agent.name.toLowerCase().replace(/\s+/g, '-')
    onSave({ ...agent, id })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-gray-900 rounded-lg">
      <h2 className="text-xl font-bold">Create New Agent</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Name</label>
          <input
            value={agent.name}
            onChange={(e) => setAgent({ ...agent, name: e.target.value })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded"
            placeholder="e.g., Product Expert"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Emoji</label>
          <input
            value={agent.emoji}
            onChange={(e) => setAgent({ ...agent, emoji: e.target.value })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded"
            placeholder="🤖"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Theme/Description</label>
        <input
          value={agent.theme}
          onChange={(e) => setAgent({ ...agent, theme: e.target.value })}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded"
          placeholder="What does this agent do?"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Data Sources</label>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_DATA_SOURCES.map(ds => (
            <label key={ds} className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={agent.dataSources.includes(ds)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setAgent({ ...agent, dataSources: [...agent.dataSources, ds] })
                  } else {
                    setAgent({ ...agent, dataSources: agent.dataSources.filter(d => d !== ds) })
                  }
                }}
              />
              {ds}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Skills</label>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_SKILLS.map(skill => (
            <label key={skill} className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={agent.skills.includes(skill)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setAgent({ ...agent, skills: [...agent.skills, skill] })
                  } else {
                    setAgent({ ...agent, skills: agent.skills.filter(s => s !== skill) })
                  }
                }}
              />
              {skill}
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <button type="submit" className="px-4 py-2 bg-white text-black rounded font-semibold">
          Create Agent
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-600 rounded">
          Cancel
        </button>
      </div>
    </form>
  )
}

export default AgentCreator
