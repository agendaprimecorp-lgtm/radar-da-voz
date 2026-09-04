import { NextRequest, NextResponse } from 'next/server'
import { getSearchFacets } from '@/lib/search'
import { createAuthResponse } from '@/app/api/auth/protected/route'

export async function GET(request: NextRequest) {
  try {
    const facets = await getSearchFacets()

    return createAuthResponse(200, {
      facets,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    return createAuthResponse(500, { error: error.message })
  }
}
