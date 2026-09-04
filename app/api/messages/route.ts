import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { validateAuth, createAuthResponse } from '@/app/api/auth/protected/route'
import { getOrCreateConversation, sendMessage, getUserConversations } from '@/lib/messaging'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/messages - Obter conversas do usuário
export async function GET(request: NextRequest) {
  const { user, error: authError } = await validateAuth(request)

  if (authError || !user) {
    return createAuthResponse(401, { error: 'Unauthorized' })
  }

  try {
    const conversations = await getUserConversations(user.id)
    return createAuthResponse(200, { conversations })
  } catch (error: any) {
    return createAuthResponse(500, { error: error.message })
  }
}

// POST /api/messages - Enviar mensagem
export async function POST(request: NextRequest) {
  const { user, error: authError } = await validateAuth(request)

  if (authError || !user) {
    return createAuthResponse(401, { error: 'Unauthorized' })
  }

  try {
    const body = await request.json()
    const { recipientId, content } = body

    if (!recipientId || !content) {
      return createAuthResponse(400, { error: 'Missing recipientId or content' })
    }

    if (content.length < 1 || content.length > 5000) {
      return createAuthResponse(400, { error: 'Message length must be 1-5000 characters' })
    }

    // Obter ou criar conversa
    const conversationId = await getOrCreateConversation(user.id, recipientId)

    // Enviar mensagem
    const message = await sendMessage(conversationId, user.id, recipientId, content)

    return createAuthResponse(201, { message })
  } catch (error: any) {
    return createAuthResponse(500, { error: error.message })
  }
}
