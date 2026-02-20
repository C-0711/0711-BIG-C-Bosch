/**
 * Multi-Tenant Configuration Loader for 0711-BIG-C
 * Supports isolated tenant instances with custom configs
 */

import * as fs from 'fs'
import * as path from 'path'

export interface TenantConfig {
  instance: {
    name: string
    locale: string
    auth: {
      mode: 'password' | 'oauth' | 'sso'
      users?: Array<{username: string, password: string}>
      oauthProviders?: string[]
    }
  }
  claude: {
    model: string
    thinking: 'off' | 'low' | 'medium' | 'high'
  }
  dataSources: {
    providers: Record<string, DataSourceProvider>
  }
  agents: {
    defaults: {
      workspace: string
      model: {
        primary: string
        fallbacks: string[]
      }
      thinkingDefault: string
    }
    list: AgentConfig[]
  }
  outputs: {
    providers: Record<string, any>
  }
}

export interface DataSourceProvider {
  type: 'mcp' | 'database' | 'api'
  name: string
  command?: string
  args?: string[]
  cwd?: string
  env?: Record<string, string>
  autoRestart?: boolean
  timeout?: number
  enabled?: boolean
}

export interface AgentConfig {
  id: string
  identity: {
    name: string
    emoji: string
    theme: string
  }
  dataSources: string[]
  skills: string[]
  enabled: boolean
}

// Tenant config paths
const CONFIG_PATHS: Record<string, string> = {
  bosch: '~/.0711/config.json',
  isoled: '~/.0711-isoled/config.json',
  lightnet: '~/.0711-lightnet/config.json',
  bette: '~/.0711-bette/config.json',
}

// Default config template
const DEFAULT_CONFIG: Partial<TenantConfig> = {
  instance: {
    name: 'Tenant Instance',
    locale: 'de-DE',
    auth: {
      mode: 'password',
      users: [],
    },
  },
  claude: {
    model: 'anthropic/claude-sonnet-4-20250514',
    thinking: 'low',
  },
  dataSources: {
    providers: {},
  },
  agents: {
    defaults: {
      workspace: '~/.0711/workspace',
      model: {
        primary: 'anthropic/claude-sonnet-4-20250514',
        fallbacks: ['openai/gpt-4o'],
      },
      thinkingDefault: 'low',
    },
    list: [],
  },
  outputs: {
    providers: {},
  },
}

/**
 * Load tenant configuration
 */
export function loadTenantConfig(tenantId: string): TenantConfig {
  const configPath = CONFIG_PATHS[tenantId]
  
  if (!configPath) {
    console.warn(`Unknown tenant: ${tenantId}, using default config`)
    return DEFAULT_CONFIG as TenantConfig
  }
  
  const expandedPath = configPath.replace('~', process.env.HOME || '')
  
  try {
    if (fs.existsSync(expandedPath)) {
      const content = fs.readFileSync(expandedPath, 'utf-8')
      const config = JSON.parse(content)
      return { ...DEFAULT_CONFIG, ...config } as TenantConfig
    }
  } catch (error) {
    console.error(`Failed to load config for ${tenantId}:`, error)
  }
  
  return DEFAULT_CONFIG as TenantConfig
}

/**
 * Get current tenant from environment
 */
export function getCurrentTenant(): string {
  return process.env.TENANT_ID || 'bosch'
}

/**
 * List available tenants
 */
export function listTenants(): string[] {
  return Object.keys(CONFIG_PATHS).filter(tenant => {
    const configPath = CONFIG_PATHS[tenant].replace('~', process.env.HOME || '')
    return fs.existsSync(configPath)
  })
}

/**
 * Create tenant config directory
 */
export function initTenant(tenantId: string, config: Partial<TenantConfig>): void {
  const configPath = `~/.0711-${tenantId}/config.json`.replace('~', process.env.HOME || '')
  const dir = path.dirname(configPath)
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  
  const fullConfig = { ...DEFAULT_CONFIG, ...config }
  fs.writeFileSync(configPath, JSON.stringify(fullConfig, null, 2))
  
  // Register new tenant
  CONFIG_PATHS[tenantId] = configPath
}
