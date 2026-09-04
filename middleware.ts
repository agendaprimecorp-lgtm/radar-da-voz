import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Rotas públicas
const PUBLIC_ROUTES = ['/auth/login', '/auth/signup', '/', '/api/auth/callback']

// Rotas que precisam autenticação
const PROTECTED_ROUTES = [
  '/dashboard',
  '/recorder',
  '/video-analyzer',
  '/talents',
  '/jobs',
  '/campaigns',
  '/messages',
]

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip se for rota pública
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Verificar autenticação para rotas protegidas
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Validar token JWT
    try {
      const { data, error } = await supabase.auth.getUser(token)
      if (error || !data.user) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }
    } catch {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
