import { NextRequest, NextResponse } from 'next/server'
import { getSystemStats, getAdminActionLogs, getAdminPermissions } from '@/lib/admin'
import { createAuthResponse, getCurrentUserId } from '@/app/api/auth/protected/route'

export async function GET(request: NextRequest) {
  try {
    const userId = getCurrentUserId(request)
    if (!userId) return createAuthResponse(401, { error: 'Unauthorized' })

    // Verificar se é admin
    const permissions = await getAdminPermissions(userId)
    if (!permissions?.is_super_admin && !permissions?.can_view_analytics) {
      return createAuthResponse(403, { error: 'Forbidden' })
    }

    const stats = await getSystemStats()
    const logs = await getAdminActionLogs(20)

    return createAuthResponse(200, {
      stats,
      logs,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    return createAuthResponse(500, { error: error.message })
  }
}
