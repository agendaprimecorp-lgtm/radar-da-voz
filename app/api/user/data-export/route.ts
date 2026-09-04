import { NextRequest, NextResponse } from 'next/server'
import { validateAuth, createAuthResponse } from '@/app/api/auth/protected/route'
import { exportUserDataAsPDF } from '@/lib/lgpd-compliance'
import { logActivity } from '@/lib/lgpd-compliance'

export async function GET(request: NextRequest) {
  const { user, error } = await validateAuth(request)

  if (error || !user) {
    return createAuthResponse(401, { error: 'Unauthorized' })
  }

  try {
    // Log da atividade
    await logActivity(user.id, 'DATA_EXPORT', { timestamp: new Date() })

    // Exportar dados
    const data = await exportUserDataAsPDF(user.id)

    return createAuthResponse(200, {
      success: true,
      data: JSON.parse(data),
      message: 'Dados exportados conforme LGPD',
    })
  } catch (error: any) {
    return createAuthResponse(500, { error: error.message })
  }
}
