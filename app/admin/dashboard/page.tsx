'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [actionLogs, setActionLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'content' | 'reports' | 'logs'>('overview')

  useEffect(() => {
    loadData()
  }, [activeTab])

  const loadData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/dashboard')
      if (!response.ok) throw new Error('Falha ao carregar dados')

      const data = await response.json()
      setStats(data.stats)
      setActionLogs(data.logs || [])
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon, trend }: any) => (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-dark-400 text-sm mb-2">{title}</p>
          <p className="text-3xl font-bold text-primary-500">{value}</p>
          {trend && (
            <p className={`text-xs mt-2 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend > 0 ? '📈' : '📉'} {Math.abs(trend)}% desde ontem
            </p>
          )}
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </Card>
  )

  return (
    <div className="min-h-screen bg-dark-900 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">⚙️ Admin Dashboard</h1>
          <Button className="bg-primary-500">🔄 Sincronizar</Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-dark-700 overflow-x-auto">
          {['overview', 'users', 'content', 'reports', 'logs'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-primary-500 text-primary-500'
                  : 'border-transparent text-dark-400 hover:text-white'
              }`}
            >
              {tab === 'overview' && '📊 Visão Geral'}
              {tab === 'users' && '👥 Usuários'}
              {tab === 'content' && '📝 Conteúdo'}
              {tab === 'reports' && '🚨 Denúncias'}
              {tab === 'logs' && '📋 Logs'}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {loading ? (
              <p className="text-dark-400">Carregando...</p>
            ) : (
              <>
                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    title="Total de Usuários"
                    value={stats?.total_users || 0}
                    icon="👥"
                    trend={12}
                  />
                  <StatCard
                    title="Organizações"
                    value={stats?.total_organizations || 0}
                    icon="🏢"
                    trend={8}
                  />
                  <StatCard
                    title="Vagas Abertas"
                    value={stats?.open_jobs || 0}
                    icon="💼"
                    trend={-3}
                  />
                  <StatCard
                    title="Denúncias Abertas"
                    value={stats?.open_reports || 0}
                    icon="🚨"
                    trend={5}
                  />
                </div>

                {/* More Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <StatCard
                    title="Contratos Assinados"
                    value={stats?.signed_contracts || 0}
                    icon="✍️"
                  />
                  <StatCard
                    title="Receita Total"
                    value={`R$ ${(stats?.revenue_total || 0).toLocaleString('pt-BR')}`}
                    icon="💰"
                  />
                </div>

                {/* Recent Activity */}
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">📋 Atividade Recente</h2>
                  <div className="space-y-3">
                    {actionLogs.slice(0, 5).map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between p-3 bg-dark-800 rounded border border-dark-700"
                      >
                        <div>
                          <p className="font-semibold">{log.action_type}</p>
                          <p className="text-sm text-dark-400">{log.description}</p>
                        </div>
                        <p className="text-xs text-dark-500">
                          {new Date(log.created_at).toLocaleTimeString('pt-BR')}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">👥 Gerenciamento de Usuários</h2>
            <p className="text-dark-400">Recursos de gerenciamento de usuários viriam aqui</p>
            <div className="mt-4 space-y-2">
              <Button variant="outline">🔍 Buscar Usuário</Button>
              <Button variant="outline">🚫 Ver Usuários Banidos</Button>
              <Button variant="outline">📊 Estatísticas de Usuários</Button>
            </div>
          </Card>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">📝 Gerenciamento de Conteúdo</h2>
            <p className="text-dark-400">Recursos de gerenciamento de conteúdo viriam aqui</p>
            <div className="mt-4 space-y-2">
              <Button variant="outline">🔍 Buscar Conteúdo</Button>
              <Button variant="outline">🗑️ Conteúdo Removido</Button>
              <Button variant="outline">📊 Estatísticas de Conteúdo</Button>
            </div>
          </Card>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">🚨 Denúncias</h2>
            <p className="text-dark-400">Recursos de denúncias viriam aqui</p>
            <div className="mt-4 space-y-2">
              <Button variant="outline">🔍 Denúncias Abertas</Button>
              <Button variant="outline">✅ Denúncias Resolvidas</Button>
              <Button variant="outline">📊 Estatísticas de Denúncias</Button>
            </div>
          </Card>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">📋 Logs de Ação</h2>
            <div className="space-y-3">
              {actionLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 bg-dark-800 rounded border border-dark-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold">{log.action_type}</p>
                    <p className="text-xs text-dark-500">
                      {new Date(log.created_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <p className="text-sm text-dark-400">{log.description}</p>
                  {log.target_type && (
                    <p className="text-xs text-dark-500 mt-2">
                      Target: {log.target_type} ({log.target_id})
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
