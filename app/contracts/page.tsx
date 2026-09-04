'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'

export default function ContractsPage() {
  const [contracts, setContracts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'signed' | 'declined'>('all')

  useEffect(() => {
    loadContracts()
  }, [filter])

  const loadContracts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/contracts?status=${filter === 'all' ? '' : filter}`)
      if (!response.ok) throw new Error('Falha ao carregar contratos')

      const data = await response.json()
      setContracts(data.contracts || [])
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSign = async (contractId: string) => {
    try {
      const response = await fetch(`/api/contracts/${contractId}/sign`, {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Erro ao assinar')

      toast.success('Contrato assinado com sucesso!')
      loadContracts()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleDecline = async (contractId: string, reason: string) => {
    try {
      const response = await fetch(`/api/contracts/${contractId}/decline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      })

      if (!response.ok) throw new Error('Erro ao rejeitar')

      toast.success('Contrato rejeitado')
      loadContracts()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-700',
      pending: 'bg-yellow-700',
      signed: 'bg-green-700',
      declined: 'bg-red-700',
      expired: 'bg-red-900',
    }
    const labels: Record<string, string> = {
      draft: '📝 Rascunho',
      pending: '⏳ Pendente',
      signed: '✅ Assinado',
      declined: '❌ Rejeitado',
      expired: '⚠️ Expirado',
    }
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${colors[status] || colors.draft}`}>
        {labels[status] || status}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">📄 Contratos</h1>
          <Button className="bg-primary-500">+ Novo Contrato</Button>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-8">
          {(['all', 'pending', 'signed', 'declined'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === f ? 'bg-primary-500 text-white' : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
              }`}
            >
              {f === 'all'
                ? 'Todos'
                : f === 'pending'
                  ? 'Pendentes'
                  : f === 'signed'
                    ? 'Assinados'
                    : 'Rejeitados'}
            </button>
          ))}
        </div>

        {/* Lista de Contratos */}
        {loading ? (
          <p className="text-dark-400">Carregando contratos...</p>
        ) : contracts.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-dark-400 mb-4">Nenhum contrato nesta categoria</p>
            <Button variant="outline">Criar Novo Contrato</Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {contracts.map((contract) => (
              <Card key={contract.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{contract.title}</h3>
                    <p className="text-dark-400 text-sm mb-3">{contract.description}</p>
                    <div className="flex gap-4 text-sm text-dark-400">
                      <span>👤 {contract.initiator_name}</span>
                      <span>↔️</span>
                      <span>👤 {contract.counterparty_name}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(contract.status)}
                  </div>
                </div>

                <div className="border-t border-dark-700 pt-4 mt-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-dark-400">Criado</p>
                      <p className="font-semibold">
                        {new Date(contract.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    {contract.due_date && (
                      <div>
                        <p className="text-dark-400">Vencimento</p>
                        <p className="font-semibold">
                          {new Date(contract.due_date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    )}
                    {contract.signed_date && (
                      <div>
                        <p className="text-dark-400">Assinado em</p>
                        <p className="font-semibold">
                          {new Date(contract.signed_date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-dark-400">Assinaturas</p>
                      <p className="font-semibold">
                        {contract.signed_count}/{contract.signed_count + contract.pending_count}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      📄 Ver Documento
                    </Button>
                    {contract.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-700 hover:bg-green-600"
                          onClick={() => handleSign(contract.id)}
                        >
                          ✅ Assinar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500"
                          onClick={() => handleDecline(contract.id, 'Rejeitado pelo usuário')}
                        >
                          ❌ Rejeitar
                        </Button>
                      </>
                    )}
                    <Button variant="outline" size="sm">
                      📋 Histórico
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
