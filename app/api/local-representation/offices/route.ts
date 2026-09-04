import { NextRequest, NextResponse } from 'next/server'
import { getLocalOffices, createLocalOffice } from '@/lib/local-representation'
import { createAuthResponse, getCurrentUserId } from '@/app/api/auth/protected/route'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const userId = getCurrentUserId(request)
    if (!userId) return createAuthResponse(401, { error: 'Unauthorized' })

    const { searchParams } = new URL(request.url)
    const orgId = searchParams.get('orgId')

    if (!orgId) return createAuthResponse(400, { error: 'orgId required' })

    const offices = await getLocalOffices(orgId)
    return createAuthResponse(200, { offices })
  } catch (error: any) {
    return createAuthResponse(500, { error: error.message })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getCurrentUserId(request)
    if (!userId) return createAuthResponse(401, { error: 'Unauthorized' })

    const body = await request.json()
    const office = await createLocalOffice(body)

    return createAuthResponse(201, { office })
  } catch (error: any) {
    return createAuthResponse(500, { error: error.message })
  }
}
