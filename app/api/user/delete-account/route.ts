import { NextRequest, NextResponse } from 'next/server'
import { validateAuth, createAuthResponse } from '@/app/api/auth/protected/route'
import { deleteUserData, logActivity } from '@/lib/lgpd-compliance'

export async function POST(request: NextRequest) {
  const { user, error } = await validateAuth(request)

  if (error || !user) {
    return createAuthResponse(401, { error: 'Unauthorized' })
  }

  try {
    const body = await request.json()
    const { password } = body

    if (!password) {
      return createAuthResponse(400, { error: 'Password required for account deletion' })
    }

    // Log da atividade
    await logActivity(user.id, 'ACCOUNT_DELETION_REQUEST', { timestamp: new Date() })

    // Deletar dados do usuário
    const result = await deleteUserData(user.id)

    if (!result.success) {
      return createAuthResponse(500, { error: result.error })
    }

    return createAuthResponse(200, {
      success: true,
      message: 'Conta deletada conforme solicitação LGPD. Todos os dados foram removidos.',
    })
  } catch (error: any) {
    return createAuthResponse(500, { error: error.message })
  }
}
