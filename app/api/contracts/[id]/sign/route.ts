import { NextRequest, NextResponse } from 'next/server'
import { signContract } from '@/lib/contracts'
import { createAuthResponse, getCurrentUserId } from '@/app/api/auth/protected/route'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = getCurrentUserId(request)
    if (!userId) return createAuthResponse(401, { error: 'Unauthorized' })

    const { signatureData } = await request.json()

    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || ''
    const userAgent = request.headers.get('user-agent') || ''

    const success = await signContract(params.id, userId, signatureData, ip, userAgent)

    if (!success) {
      return createAuthResponse(500, { error: 'Failed to sign contract' })
    }

    return createAuthResponse(200, { message: 'Contract signed successfully' })
  } catch (error: any) {
    return createAuthResponse(500, { error: error.message })
  }
}
