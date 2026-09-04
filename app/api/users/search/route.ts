import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { validateAuth, createAuthResponse } from '@/app/api/auth/protected/route'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  const { user, error: authError } = await validateAuth(request)

  if (authError || !user) {
    return createAuthResponse(401, { error: 'Unauthorized' })
  }

  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || query.length < 2) {
      return createAuthResponse(400, { error: 'Query must be at least 2 characters' })
    }

    const { data, error } = await supabase
      .from('users')
      .select('id, full_name, user_type')
      .ilike('full_name', `%${query}%`)
      .neq('id', user.id)
      .limit(10)

    if (error) {
      return createAuthResponse(500, { error: error.message })
    }

    return createAuthResponse(200, { users: data })
  } catch (error: any) {
    return createAuthResponse(500, { error: error.message })
  }
}
