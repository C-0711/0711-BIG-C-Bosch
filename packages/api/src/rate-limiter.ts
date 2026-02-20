/**
 * API Rate Limiter for 0711-BIG-C
 * Token bucket algorithm with per-tenant limits
 */

interface RateLimitConfig {
  maxRequests: number      // Max requests per window
  windowMs: number         // Time window in ms
  blockDurationMs: number  // How long to block after limit exceeded
}

interface TenantBucket {
  tokens: number
  lastRefill: number
  blocked: boolean
  blockedUntil: number
}

// Default configs per tier
const TIER_CONFIGS: Record<string, RateLimitConfig> = {
  free: {
    maxRequests: 100,
    windowMs: 60 * 1000,      // 100/minute
    blockDurationMs: 60 * 1000,
  },
  pro: {
    maxRequests: 1000,
    windowMs: 60 * 1000,      // 1000/minute
    blockDurationMs: 30 * 1000,
  },
  enterprise: {
    maxRequests: 10000,
    windowMs: 60 * 1000,      // 10000/minute
    blockDurationMs: 10 * 1000,
  },
}

// In-memory buckets (use Redis in production)
const buckets: Map<string, TenantBucket> = new Map()

export function getRateLimiter(tenantId: string, tier: string = 'free') {
  const config = TIER_CONFIGS[tier] || TIER_CONFIGS.free
  
  return {
    async checkLimit(): Promise<{
      allowed: boolean
      remaining: number
      resetAt: number
      retryAfter?: number
    }> {
      const now = Date.now()
      let bucket = buckets.get(tenantId)
      
      if (!bucket) {
        bucket = {
          tokens: config.maxRequests,
          lastRefill: now,
          blocked: false,
          blockedUntil: 0,
        }
        buckets.set(tenantId, bucket)
      }
      
      // Check if blocked
      if (bucket.blocked && now < bucket.blockedUntil) {
        return {
          allowed: false,
          remaining: 0,
          resetAt: bucket.blockedUntil,
          retryAfter: bucket.blockedUntil - now,
        }
      }
      
      // Unblock if time passed
      if (bucket.blocked && now >= bucket.blockedUntil) {
        bucket.blocked = false
        bucket.tokens = config.maxRequests
        bucket.lastRefill = now
      }
      
      // Refill tokens based on time passed
      const timePassed = now - bucket.lastRefill
      const refillAmount = Math.floor((timePassed / config.windowMs) * config.maxRequests)
      
      if (refillAmount > 0) {
        bucket.tokens = Math.min(config.maxRequests, bucket.tokens + refillAmount)
        bucket.lastRefill = now
      }
      
      // Check if request allowed
      if (bucket.tokens > 0) {
        bucket.tokens--
        return {
          allowed: true,
          remaining: bucket.tokens,
          resetAt: bucket.lastRefill + config.windowMs,
        }
      }
      
      // Rate limit exceeded - block
      bucket.blocked = true
      bucket.blockedUntil = now + config.blockDurationMs
      
      return {
        allowed: false,
        remaining: 0,
        resetAt: bucket.blockedUntil,
        retryAfter: config.blockDurationMs,
      }
    },
    
    reset() {
      buckets.delete(tenantId)
    },
  }
}

// Express/Fastify middleware factory
export function createRateLimitMiddleware(getTenant: (req: any) => string, getTier: (tenant: string) => string = () => 'free') {
  return async (req: any, res: any, next: () => void) => {
    const tenant = getTenant(req)
    const tier = getTier(tenant)
    const limiter = getRateLimiter(tenant, tier)
    
    const result = await limiter.checkLimit()
    
    // Set rate limit headers
    res.setHeader('X-RateLimit-Remaining', result.remaining)
    res.setHeader('X-RateLimit-Reset', result.resetAt)
    
    if (!result.allowed) {
      res.setHeader('Retry-After', Math.ceil((result.retryAfter || 0) / 1000))
      res.status(429).json({
        error: 'Too Many Requests',
        retryAfter: result.retryAfter,
      })
      return
    }
    
    next()
  }
}

export default { getRateLimiter, createRateLimitMiddleware, TIER_CONFIGS }
