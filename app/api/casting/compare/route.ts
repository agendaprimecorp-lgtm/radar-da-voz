import { NextRequest, NextResponse } from 'next/server'
import { validateAuth, createAuthResponse } from '@/app/api/auth/protected/route'
import { compareMultipleTalents } from '@/lib/casting-comparison'

export async function POST(request: NextRequest) {
  const { user, error: authError } = await validateAuth(request)

  if (authError || !user) {
    return createAuthResponse(401, { error: 'Unauthorized' })
  }

  try {
    const body = await request.json()
    const { talentIds, jobRequirements } = body

    if (!talentIds || !Array.isArray(talentIds) || talentIds.length < 2) {
      return createAuthResponse(400, { error: 'Precisa de pelo menos 2 talentos' })
    }

    if (talentIds.length > 10) {
      return createAuthResponse(400, { error: 'Máximo 10 talentos para comparação' })
    }

    const result = await compareMultipleTalents(talentIds, jobRequirements)

    return createAuthResponse(200, { comparison: result })
  } catch (error: any) {
    return createAuthResponse(500, { error: error.message })
  }
}
