import { NextRequest, NextResponse } from 'next/server'
import { getUserContracts, generateContract, getContractTemplates } from '@/lib/contracts'
import { createAuthResponse, getCurrentUserId } from '@/app/api/auth/protected/route'

export async function GET(request: NextRequest) {
  try {
    const userId = getCurrentUserId(request)
    if (!userId) return createAuthResponse(401, { error: 'Unauthorized' })

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const contracts = await getUserContracts(userId)
    const filtered = status ? contracts.filter((c) => c.status === status) : contracts

    return createAuthResponse(200, { contracts: filtered })
  } catch (error: any) {
    return createAuthResponse(500, { error: error.message })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getCurrentUserId(request)
    if (!userId) return createAuthResponse(401, { error: 'Unauthorized' })

    const { templateId, title, counterpartyId, variables, dueDate, organizationId } = await request.json()

    if (!templateId || !title || !counterpartyId) {
      return createAuthResponse(400, { error: 'Missing required fields' })
    }

    const contract = await generateContract(
      organizationId,
      templateId,
      title,
      userId,
      counterpartyId,
      variables || {},
      dueDate
    )

    if (!contract) {
      return createAuthResponse(500, { error: 'Failed to generate contract' })
    }

    return createAuthResponse(201, { contract })
  } catch (error: any) {
    return createAuthResponse(500, { error: error.message })
  }
}
