'use client'

import { useState, useEffect } from 'react'
import { MetricsCard } from '@/components/analytics/metrics-card'
import { toast } from 'sonner'

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<any>(null)
  const [trend, setTrend] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeUsersToday, setActiveUsersToday] = useState(0)
  const [conversionRate, setConversionRate] = useState(0)

  useEffect(() => {
    loadAnalytics()
    const interval = setInterval(loadAnalytics, 60000) // Atualizar a cada minuto
    return () => clearInterval(interval)
  }, [])

  const loadAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics/metrics')
      if (!response.ok) throw new Error('Falha ao carregar analytics')

      const data = await response.json()
      setMetrics(data.metrics)
      setTrend(data.trend)
      setActiveUsersToday(data.activeUsersToday)
      setConversionRate(data.conversionRate)
      setLoading(false)
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  if (loading || !metrics) {
    return (
      <div className="min-h-screen bg-dark-900 p-8 flex items-center justify-center">
        <p className="text-dark-400">Carregando analytics...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold mb-2">📊 Analytics</h1>
        <p className="text-dark-400 mb-8">Últimos 30 dias</p>

        {/* KPIs Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricsCard
            title="Usuários Ativos"
            value={metrics.total_active_users}
            subtitle="Últimos 30 dias"
            icon="👥"
            color="primary"
            trend={5}
          />
          <MetricsCard
            title="Novos Usuários"
            value={metrics.total_new_users}
            subtitle="Cadastrados"
            icon="✨"
            color="green"
            trend={12}
          />
          <MetricsCard
            title="Aplicações"
            value={metrics.total_job_applications}
            subtitle="Para vagas"
            icon="📝"
            color="blue"
            trend={8}
          />
          <MetricsCard
            title="Taxa Conversão"
            value={`${conversionRate}%`}
            subtitle="Submissões / Campanhas"
            icon="🎯"
            color="orange"
            trend={3}
          />
        </div>

        {/* Atividades */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <div className="card">
            <h3 className="font-semibold mb-4">💼 Vagas</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-dark-400">Publicadas</span>
                <span className="font-semibold">{metrics.total_job_postings}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Candidaturas</span>
                <span className="font-semibold text-primary-500">{metrics.total_job_applications}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Taxa média</span>
                <span className="font-semibold">
                  {(metrics.total_job_applications / (metrics.total_job_postings || 1)).toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-4">📺 Campanhas</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-dark-400">Criadas</span>
                <span className="font-semibold">{metrics.total_campaigns}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Submissões</span>
                <span className="font-semibold text-primary-500">{metrics.total_submissions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Taxa média</span>
                <span className="font-semibold">
                  {metrics.avg_submissions_per_campaign.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-4">💰 Receita</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-dark-400">Total</span>
                <span className="font-semibold text-green-500">
                  R$ {metrics.total_revenue.toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Por aplicação</span>
                <span className="font-semibold">
                  R$ {metrics.avg_revenue_per_application.toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Reviews</span>
                <span className="font-semibold">{metrics.total_reviews}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Engagement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card">
            <h3 className="font-semibold mb-4">💬 Engagement</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-dark-400">Mensagens</span>
                <span className="font-semibold">{metrics.total_messages}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Reviews</span>
                <span className="font-semibold">{metrics.total_reviews}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Visualizações</span>
                <span className="font-semibold">{metrics.total_page_views}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-4">🎯 Usuários Hoje</h3>
            <div className="text-3xl font-bold text-primary-500 mb-2">{activeUsersToday}</div>
            <p className="text-sm text-dark-400">Usuários ativos nas últimas 24h</p>
            {trend.length > 0 && (
              <div className="mt-4 text-xs space-y-1">
                <div className="flex justify-between text-dark-400">
                  <span>Tendência</span>
                  <span>
                    {trend[0]?.active_users > (trend[1]?.active_users || 0) ? '📈' : '📉'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
