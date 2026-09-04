import { NextRequest, NextResponse } from 'next/server'
import { getNotificationPreferences, updateNotificationPreferences } from '@/lib/notifications'
import { createAuthResponse, getCurrentUserId } from '@/app/api/auth/protected/route'

export async function GET(request: NextRequest) {
  try {
    const userId = getCurrentUserId(request)
    if (!userId) return createAuthResponse(401, { error: 'Unauthorized' })

    const prefs = await getNotificationPreferences(userId)
    return createAuthResponse(200, { prefs })
  } catch (error: any) {
    return createAuthResponse(500, { error: error.message })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = getCurrentUserId(request)
    if (!userId) return createAuthResponse(401, { error: 'Unauthorized' })

    const updates = await request.json()
    const prefs = await updateNotificationPreferences(userId, updates)

    return createAuthResponse(200, { prefs })
  } catch (error: any) {
    return createAuthResponse(500, { error: error.message })
  }
}
