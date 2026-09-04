import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  recipient_id: string
  content: string
  read: boolean
  created_at: string
  sender?: { full_name: string }
}

export interface Conversation {
  id: string
  participants: string[]
  last_message: string
  last_message_at: string
  unread_count: number
}

// Obter ou criar conversa
export async function getOrCreateConversation(userId: string, otherUserId: string) {
  // Buscar conversa existente
  const { data: existing } = await supabase
    .from('conversations')
    .select('id')
    .or(`and(sender_id.eq.${userId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${userId})`)
    .single()

  if (existing) {
    return existing.id
  }

  // Criar nova conversa
  const { data: newConv, error } = await supabase
    .from('conversations')
    .insert({
      sender_id: userId,
      recipient_id: otherUserId,
    })
    .select('id')
    .single()

  if (error) throw new Error(error.message)
  return newConv.id
}

// Enviar mensagem
export async function sendMessage(
  conversationId: string,
  senderId: string,
  recipientId: string,
  content: string
) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      recipient_id: recipientId,
      content: content.substring(0, 5000),
      read: false,
    })
    .select('*, sender:users(full_name)')
    .single()

  if (error) throw new Error(error.message)
  return data
}

// Obter mensagens de uma conversa
export async function getConversationMessages(conversationId: string, limit = 50, offset = 0) {
  const { data, error } = await supabase
    .from('messages')
    .select('*, sender:users(full_name)')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw new Error(error.message)
  return data.reverse()
}

// Marcar mensagem como lida
export async function markAsRead(messageId: string) {
  const { error } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('id', messageId)

  if (error) throw new Error(error.message)
}

// Obter conversas do usuário
export async function getUserConversations(userId: string) {
  const { data, error } = await supabase
    .from('conversations')
    .select(
      `
      id,
      sender_id,
      recipient_id,
      sender:users!sender_id(id, full_name),
      recipient:users!recipient_id(id, full_name),
      messages(id, content, created_at, read, sender_id)
    `
    )
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)

  return data.map((conv: any) => {
    const otherUser = conv.sender_id === userId ? conv.recipient : conv.sender
    const unreadCount = conv.messages.filter(
      (m: any) => m.sender_id !== userId && !m.read
    ).length
    const lastMessage = conv.messages[0]

    return {
      id: conv.id,
      otherUser,
      lastMessage: lastMessage?.content || 'Sem mensagens',
      lastMessageAt: lastMessage?.created_at || conv.created_at,
      unreadCount,
    }
  })
}

// Deletar conversa
export async function deleteConversation(conversationId: string) {
  const { error } = await supabase
    .from('conversations')
    .delete()
    .eq('id', conversationId)

  if (error) throw new Error(error.message)
}

// Buscar usuários para iniciar conversa
export async function searchUsers(query: string, excludeId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('id, full_name, user_type')
    .ilike('full_name', `%${query}%`)
    .neq('id', excludeId)
    .limit(10)

  if (error) throw new Error(error.message)
  return data
}
