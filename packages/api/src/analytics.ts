/**
 * Usage Analytics for 0711-BIG-C
 * Track API calls, agent usage, and workflow executions
 */

interface AnalyticsEvent {
  timestamp: Date
  tenant: string
  user?: string
  eventType: 'api_call' | 'agent_run' | 'workflow_run' | 'search' | 'export'
  eventData: Record<string, any>
  duration?: number
  success: boolean
}

// In-memory storage (replace with TimescaleDB in production)
const events: AnalyticsEvent[] = []

export function trackEvent(event: Omit<AnalyticsEvent, 'timestamp'>) {
  events.push({
    ...event,
    timestamp: new Date(),
  })
  
  // Keep last 10000 events
  if (events.length > 10000) {
    events.shift()
  }
}

export function getAnalytics(options: {
  tenant?: string
  startDate?: Date
  endDate?: Date
  eventType?: string
} = {}) {
  let filtered = events
  
  if (options.tenant) {
    filtered = filtered.filter(e => e.tenant === options.tenant)
  }
  if (options.startDate) {
    filtered = filtered.filter(e => e.timestamp >= options.startDate!)
  }
  if (options.endDate) {
    filtered = filtered.filter(e => e.timestamp <= options.endDate!)
  }
  if (options.eventType) {
    filtered = filtered.filter(e => e.eventType === options.eventType)
  }
  
  return filtered
}

export function getUsageSummary(tenant: string, days: number = 7) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  
  const tenantEvents = getAnalytics({ tenant, startDate })
  
  const summary = {
    totalEvents: tenantEvents.length,
    byType: {} as Record<string, number>,
    successRate: 0,
    avgDuration: 0,
    topAgents: [] as { id: string, count: number }[],
    dailyBreakdown: [] as { date: string, count: number }[],
  }
  
  let totalDuration = 0
  let successCount = 0
  const agentCounts: Record<string, number> = {}
  const dailyCounts: Record<string, number> = {}
  
  for (const event of tenantEvents) {
    // By type
    summary.byType[event.eventType] = (summary.byType[event.eventType] || 0) + 1
    
    // Success rate
    if (event.success) successCount++
    
    // Duration
    if (event.duration) totalDuration += event.duration
    
    // Agent counts
    if (event.eventType === 'agent_run' && event.eventData.agentId) {
      agentCounts[event.eventData.agentId] = (agentCounts[event.eventData.agentId] || 0) + 1
    }
    
    // Daily breakdown
    const dateKey = event.timestamp.toISOString().split('T')[0]
    dailyCounts[dateKey] = (dailyCounts[dateKey] || 0) + 1
  }
  
  summary.successRate = tenantEvents.length > 0 ? successCount / tenantEvents.length : 0
  summary.avgDuration = tenantEvents.length > 0 ? totalDuration / tenantEvents.length : 0
  
  summary.topAgents = Object.entries(agentCounts)
    .map(([id, count]) => ({ id, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
  
  summary.dailyBreakdown = Object.entries(dailyCounts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
  
  return summary
}

export default { trackEvent, getAnalytics, getUsageSummary }
