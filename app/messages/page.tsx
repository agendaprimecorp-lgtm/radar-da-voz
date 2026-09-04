'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChatWindow } from '@/components/messaging/chat-window'
import { toast } from 'sonner'

export default function MessagesPage() {
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedConversation, setSelectedConversation] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    loadConversations()
    const interval = setInterval(loadConversations, 5000)
    return () => clearInterval(interval)
  }, [])

  const loadConversations = async () => {
    try {
      const response = await fetch('/api/messages')
      if (!response.ok) throw new Error('Falha ao carregar mensagens')

      const data = await response.json()
      setConversations(data.conversations || [])
      setLoading(false)
    } catch (error) {
      console.error(error)
    }
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)

    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setSearching(true)
    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`)
      if (!response.ok) throw new Error('Erro na busca')

      const data = await response.json()
      setSearchResults(data.users || [])
    } catch (error) {
      toast.error('Erro ao buscar usuários')
    } finally {
      setSearching(false)
    }
  }

  const handleStartConversation = async (userId: string) => {
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientId: userId, content: 'Olá!' }),
      })

      if (!response.ok) throw new Error('Erro ao iniciar conversa')

      setSearchQuery('')
      setSearchResults([])
      await loadConversations()
      toast.success('Conversa iniciada!')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-dark-900 p-8 flex items-center justify-center">Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-dark-900 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar de Conversas */}
          <div className="lg:col-span-1 space-y-4">
            <h1 className="text-2xl font-bold">💬 Mensagens</h1>

            {/* Busca */}
            <div className="card space-y-3">
              <Input
                type="text"
                placeholder="Procurar usuário..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />

              {searching && <p className="text-sm text-dark-400">Buscando...</p>}

              {searchResults.length > 0 && (
                <div className="space-y-2">
                  {searchResults.map((user: any) => (
                    <button
                      key={user.id}
                      onClick={() => handleStartConversation(user.id)}
                      className="w-full text-left p-2 bg-dark-800 hover:bg-dark-700 rounded transition text-sm"
                    >
                      <p className="font-semibold">{user.full_name}</p>
                      <p className="text-xs text-dark-400">{user.user_type}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Conversas */}
            <div className="card space-y-2 max-h-96 overflow-y-auto">
              {conversations.length === 0 ? (
                <p className="text-sm text-dark-400 text-center py-4">Nenhuma mensagem ainda</p>
              ) : (
                conversations.map((conv: any) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full text-left p-3 rounded transition ${
                      selectedConversation?.id === conv.id
                        ? 'bg-primary-600'
                        : 'bg-dark-800 hover:bg-dark-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm truncate">
                          {conv.otherUser?.full_name}
                        </p>
                        <p className="text-xs text-dark-400 truncate">
                          {conv.lastMessage}
                        </p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="ml-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2">
            {selectedConversation ? (
              <ChatWindow
                conversationId={selectedConversation.id}
                otherUserName={selectedConversation.otherUser?.full_name || 'Usuário'}
                onClose={() => setSelectedConversation(null)}
              />
            ) : (
              <div className="card flex items-center justify-center h-96 text-dark-400">
                <p>Selecione uma conversa ou procure um usuário</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
