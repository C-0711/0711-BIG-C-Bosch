import React, { useState, useEffect } from 'react'

interface UsageSummary {
  totalEvents: number
  byType: Record<string, number>
  successRate: number
  avgDuration: number
  topAgents: Array<{ id: string, count: number }>
  dailyBreakdown: Array<{ date: string, count: number }>
}

export function AnalyticsDashboard({ tenantId }: { tenantId: string }) {
  const [summary, setSummary] = useState<UsageSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(7)

  useEffect(() => {
    loadAnalytics()
  }, [tenantId, days])

  async function loadAnalytics() {
    setLoading(true)
    try {
      const res = await fetch(`/api/analytics/summary?tenant=${tenantId}&days=${days}`)
      const data = await res.json()
      setSummary(data)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  if (loading) return <div className="p-8 text-gray-500">Loading analytics...</div>
  if (!summary) return <div className="p-8 text-red-500">Failed to load analytics</div>

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Usage Analytics</h2>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="px-3 py-1 bg-gray-800 border border-gray-700 rounded"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-gray-900 rounded-lg">
          <div className="text-3xl font-bold">{summary.totalEvents.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Total Events</div>
        </div>
        <div className="p-4 bg-gray-900 rounded-lg">
          <div className="text-3xl font-bold">{(summary.successRate * 100).toFixed(1)}%</div>
          <div className="text-sm text-gray-400">Success Rate</div>
        </div>
        <div className="p-4 bg-gray-900 rounded-lg">
          <div className="text-3xl font-bold">{summary.avgDuration.toFixed(0)}ms</div>
          <div className="text-sm text-gray-400">Avg Duration</div>
        </div>
        <div className="p-4 bg-gray-900 rounded-lg">
          <div className="text-3xl font-bold">{Object.keys(summary.byType).length}</div>
          <div className="text-sm text-gray-400">Event Types</div>
        </div>
      </div>

      {/* Event Types Breakdown */}
      <div className="p-4 bg-gray-900 rounded-lg">
        <h3 className="font-semibold mb-4">Events by Type</h3>
        <div className="space-y-2">
          {Object.entries(summary.byType).map(([type, count]) => (
            <div key={type} className="flex items-center gap-2">
              <div className="w-32 text-sm">{type}</div>
              <div className="flex-1 h-4 bg-gray-800 rounded overflow-hidden">
                <div
                  className="h-full bg-blue-600"
                  style={{ width: `${(count / summary.totalEvents) * 100}%` }}
                />
              </div>
              <div className="w-16 text-right text-sm">{count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Agents */}
      <div className="p-4 bg-gray-900 rounded-lg">
        <h3 className="font-semibold mb-4">Top Agents</h3>
        <div className="space-y-2">
          {summary.topAgents.map((agent, i) => (
            <div key={agent.id} className="flex items-center gap-2">
              <span className="w-6 text-gray-500">{i + 1}.</span>
              <span className="flex-1">{agent.id}</span>
              <span className="text-gray-400">{agent.count} runs</span>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Chart */}
      <div className="p-4 bg-gray-900 rounded-lg">
        <h3 className="font-semibold mb-4">Daily Activity</h3>
        <div className="flex items-end gap-1 h-32">
          {summary.dailyBreakdown.map((day) => {
            const maxCount = Math.max(...summary.dailyBreakdown.map(d => d.count))
            const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0
            return (
              <div key={day.date} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-blue-600 rounded-t"
                  style={{ height: `${height}%` }}
                  title={`${day.date}: ${day.count}`}
                />
                <span className="text-xs text-gray-600 mt-1">{day.date.slice(-2)}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard
