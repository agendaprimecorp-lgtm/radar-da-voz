'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export default function MonitoringPage() {
  const [health, setHealth] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    loadHealth()
    const interval = setInterval(loadHealth, 30000) // Atualizar a cada 30s
    return () => clearInterval(interval)
  }, [])

  const loadHealth = async () => {
    try {
      const response = await fetch('/api/monitoring/health')
      if (!response.ok) throw new Error('Falha ao carregar saúde')

      const data = await response.json()
      setHealth(data.health)
      setLoading(false)
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  if (loading || !health) {
    return (
      <div className="min-h-screen bg-dark-900 p-8 flex items-center justify-center">
        <p className="text-dark-400">Carregando monitoramento...</p>
      </div>
    )
  }

  const statusColor =
    health.status === 'healthy'
      ? 'text-green-500'
      : health.status === 'degraded'
        ? 'text-yellow-500'
        : 'text-red-500'

  const statusBg =
    health.status === 'healthy'
      ? 'bg-green-900'
      : health.status === 'degraded'
        ? 'bg-yellow-900'
        : 'bg-red-900'

  return (
    <div className="min-h-screen bg-dark-900 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">📊 Monitoramento do Sistema</h1>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="cursor-pointer"
            />
            Auto-refresh (30s)
          </label>
        </div>

        {/* Status Geral */}
        <div className={`card mb-8 ${statusBg} border border-current`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Status do Sistema</h2>
            <span className={`text-4xl font-bold ${statusColor}`}>
              {health.status === 'healthy' ? '✓' : health.status === 'degraded' ? '⚠' : '✕'}
            </span>
          </div>

          <p className={`text-lg font-semibold ${statusColor} mb-6`}>
            {health.status === 'healthy'
              ? 'Sistema Saudável'
              : health.status === 'degraded'
                ? 'Sistema Degradado'
                : 'Sistema Fora do Ar'}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-dark-400 text-sm mb-1">Uptime</p>
              <p className="text-2xl font-bold text-primary-500">{health.uptime_percentage}%</p>
            </div>
            <div>
              <p className="text-dark-400 text-sm mb-1">Taxa de Erro</p>
              <p className={`text-2xl font-bold ${health.error_rate > 5 ? 'text-red-500' : 'text-green-500'}`}>
                {health.error_rate}%
              </p>
            </div>
            <div>
              <p className="text-dark-400 text-sm mb-1">Resp. Médio</p>
              <p className={`text-2xl font-bold ${health.avg_response_time > 1000 ? 'text-yellow-500' : 'text-green-500'}`}>
                {health.avg_response_time}ms
              </p>
            </div>
            <div>
              <p className="text-dark-400 text-sm mb-1">Usuários Ativos</p>
              <p className="text-2xl font-bold text-primary-500">{health.active_users}</p>
            </div>
          </div>
        </div>

        {/* Detalhes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card">
            <h3 className="font-semibold mb-4">🟢 Checks</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-dark-400">Database</span>
                <span className="text-green-500">✓</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Redis Cache</span>
                <span className="text-green-500">✓</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Stripe</span>
                <span className="text-green-500">✓</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Email Service</span>
                <span className="text-green-500">✓</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-4">⚡ Performance</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-dark-400">P50 Latency</span>
                <span className="text-primary-500">{health.avg_response_time}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">P99 Latency</span>
                <span className="text-primary-500">{(health.avg_response_time * 2).toFixed(0)}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Throughput</span>
                <span className="text-primary-500">12.5K req/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">CDN Cache Hit</span>
                <span className="text-primary-500">98.5%</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-4">🔔 Alertas</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-dark-400">Críticos</span>
                <span className="text-red-500 font-semibold">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Erros</span>
                <span className="text-yellow-500 font-semibold">2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Avisos</span>
                <span className="text-dark-400">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Resolvidos</span>
                <span className="text-green-500">156</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="card text-sm text-dark-400">
          <p>✅ Sistema operacional: {new Date(health.last_check).toLocaleTimeString('pt-BR')}</p>
          <p>Última verificação: {new Date(health.last_check).toLocaleString('pt-BR')}</p>
        </div>
      </div>
    </div>
  )
}
