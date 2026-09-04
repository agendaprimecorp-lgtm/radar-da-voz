'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface ChatWindowProps {
  conversationId: string
  otherUserName: string
  onClose: () => void
}

export function ChatWindow({ conversationId, otherUserName, onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadMessages()
    // Poll para novas mensagens a cada 2 segundos
    const interval = setInterval(loadMessages, 2000)
    return () => clearInterval(interval)
  }, [conversationId])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(scrollToBottom, [messages])

  const loadMessages = async () => {
    try {
      const response = await fetch(`/api/messages/${conversationId}?limit=50`)
      if (!response.ok) throw new Error('Falha ao carregar mensagens')

      const data = await response.json()
      setMessages(data.messages || [])
      setLoading(false)
    } catch (error) {
      console.error(error)
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim()) {
      toast.error('Digite uma mensagem')
      return
    }

    setSending(true)
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: '', // Será preenchido do contexto
          content: newMessage,
        }),
      })

      if (!response.ok) throw new Error('Falha ao enviar')

      setNewMessage('')
      await loadMessages()
      toast.success('Mensagem enviada!')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96">Carregando...</div>
  }

  return (
    <div className="card flex flex-col h-96 bg-dark-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-dark-700">
        <h3 className="font-semibold">{otherUserName}</h3>
        <button
          onClick={onClose}
          className="text-dark-400 hover:text-dark-200 text-xl"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-dark-400 text-sm py-8">
            Nenhuma mensagem ainda. Comece a conversa!
          </div>
        ) : (
          messages.map((msg: any) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender_id === 'current-user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.sender_id === 'current-user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-dark-700 text-dark-200'
                }`}
              >
                <p className="text-sm break-words">{msg.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-dark-700">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Envie uma mensagem..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={sending}
            maxLength={5000}
          />
          <Button type="submit" disabled={sending} className="bg-primary-500">
            {sending ? '...' : 'Enviar'}
          </Button>
        </div>
      </form>
    </div>
  )
}
