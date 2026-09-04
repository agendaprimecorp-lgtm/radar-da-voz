import { NextRequest, NextResponse } from 'next/server'
import { validateAuth, createAuthResponse } from '@/app/api/auth/protected/route'
import { getConversationMessages, markAsRead } from '@/lib/messaging'

// GET /api/messages/[conversationId] - Obter mensagens
export async function GET(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  const { user, error: authError } = await validateAuth(request)

  if (authError || !user) {
    return createAuthResponse(401, { error: 'Unauthorized' })
  }

  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const messages = await getConversationMessages(params.conversationId, limit, offset)

    // Marcar todas as mensagens recebidas como lidas
    for (const msg of messages) {
      if (msg.recipient_id === user.id && !msg.read) {
        await markAsRead(msg.id)
      }
    }

    return createAuthResponse(200, { messages })
  } catch (error: any) {
    return createAuthResponse(500, { error: error.message })
  }
}
