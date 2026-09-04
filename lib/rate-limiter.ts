// Rate limiter simples em memória (em produção usar Redis)
const rateLimits = new Map<string, { count: number; reset: number }>()

const LIMITS = {
  api: { requests: 100, window: 60000 }, // 100 requests por minuto
  auth: { requests: 5, window: 900000 }, // 5 tentativas a cada 15 minutos
  upload: { requests: 10, window: 3600000 }, // 10 uploads por hora
}

export function checkRateLimit(key: string, limitType: keyof typeof LIMITS): boolean {
  const limit = LIMITS[limitType]
  const now = Date.now()

  const existing = rateLimits.get(key)

  if (!existing || existing.reset < now) {
    rateLimits.set(key, { count: 1, reset: now + limit.window })
    return true
  }

  if (existing.count < limit.requests) {
    existing.count++
    return true
  }

  return false
}

export function getRateLimitInfo(key: string, limitType: keyof typeof LIMITS) {
  const limit = LIMITS[limitType]
  const existing = rateLimits.get(key)

  if (!existing) {
    return { remaining: limit.requests, resetIn: limit.window }
  }

  return {
    remaining: Math.max(0, limit.requests - existing.count),
    resetIn: Math.max(0, existing.reset - Date.now()),
  }
}
