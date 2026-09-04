import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkRateLimit } from '@/lib/rate-limiter'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Middleware para validar token e RLS
export async function validateAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.split('Bearer ')[1]

  if (!token) {
    return { user: null, error: 'No authorization header' }
  }

  // Rate limiting
  const clientIp = request.headers.get('x-forwarded-for') || 'unknown'
  if (!checkRateLimit(clientIp, 'api')) {
    return { user: null, error: 'Rate limit exceeded' }
  }

  try {
    const { data, error } = await supabase.auth.getUser(token)
    if (error || !data.user) {
      return { user: null, error: 'Invalid token' }
    }
    return { user: data.user, error: null }
  } catch (error) {
    return { user: null, error: 'Token validation failed' }
  }
}

export function createAuthResponse(status: number, data: any) {
  const response = NextResponse.json(data, { status })

  // Headers de segurança
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self'")

  return response
}
