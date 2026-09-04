import { NextRequest, NextResponse } from 'next/server'
import { getSystemHealth } from '@/lib/monitoring'
import { createAuthResponse } from '@/app/api/auth/protected/route'

export async function GET(request: NextRequest) {
  try {
    const health = await getSystemHealth()

    return createAuthResponse(200, {
      health,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    })
  } catch (error: any) {
    return createAuthResponse(500, {
      error: error.message,
      status: 'error',
    })
  }
}
