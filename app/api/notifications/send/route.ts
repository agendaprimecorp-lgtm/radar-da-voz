import { NextRequest, NextResponse } from 'next/server'
import { sendNotification } from '@/lib/notifications'
import { createAuthResponse, getCurrentUserId } from '@/app/api/auth/protected/route'

export async function POST(request: NextRequest) {
  try {
    const userId = getCurrentUserId(request)
    if (!userId) return createAuthResponse(401, { error: 'Unauthorized' })

    const { type, subject, content, channels } = await request.json()

    if (!type || !subject || !content) {
      return createAuthResponse(400, { error: 'Missing required fields' })
    }

    const result = await sendNotification({
      userId,
      type,
      subject,
      content,
      channels,
    })

    return createAuthResponse(200, { success: true, result })
  } catch (error: any) {
    return createAuthResponse(500, { error: error.message })
  }
}
