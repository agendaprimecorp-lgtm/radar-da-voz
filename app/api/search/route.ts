import { NextRequest, NextResponse } from 'next/server'
import { searchFullText, getSearchFacets } from '@/lib/search'
import { createAuthResponse } from '@/app/api/auth/protected/route'

export async function POST(request: NextRequest) {
  try {
    const { query, filters, pagination } = await request.json()

    if (!query || query.length < 2) {
      return createAuthResponse(400, { error: 'Query must be at least 2 characters' })
    }

    const results = await searchFullText(query, filters, pagination)

    return createAuthResponse(200, {
      results,
      count: results.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    return createAuthResponse(500, { error: error.message })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || query.length < 2) {
      return createAuthResponse(400, { error: 'Query must be at least 2 characters' })
    }

    const results = await searchFullText(query, {}, { limit: 10 })

    return createAuthResponse(200, { results })
  } catch (error: any) {
    return createAuthResponse(500, { error: error.message })
  }
}
