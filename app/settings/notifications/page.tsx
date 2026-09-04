'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function NotificationSettingsPage() {
  const [prefs, setPrefs] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadPreferences()
  }, [])

  const loadPreferences = async () => {
    try {
      const response = await fetch('/api/notifications/preferences')
      if (!response.ok) throw new Error('Falha ao carregar preferências')

      const data = await response.json()
      setPrefs(data.prefs)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async (field: string) => {
    const newPrefs = {
      ...prefs,
      [field]: !prefs[field],
    }
    setPrefs(newPrefs)

    try {
      setSaving(true)
      const response = await fetch('/api/notifications/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: !prefs[field] }),
      })

      if (!response.ok) throw new Error('Erro ao salvar')
      toast.success('Preferência atualizada')
    } catch (error: any) {
      setPrefs(prefs) // Reverter
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading || !prefs) {
    return (
      <div className="min-h-screen bg-dark-900 p-8 flex items-center justify-center">
        <p className="text-dark-400">Carregando preferências...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900 p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">🔔 Preferências de Notificações</h1>

        {/* Email */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold mb-6">📧 Email</h2>
          <div className="space-y-4">
            <NotificationToggle
              label="Novos Candidatos"
              value={prefs.email_new_applications}
              onChange={() => handleToggle('email_new_applications')}
              description="Receba email quando houver novas aplicações"
            />
            <NotificationToggle
              label="Novas Mensagens"
              value={prefs.email_new_messages}
              onChange={() => handleToggle('email_new_messages')}
              description="Notificações quando receber mensagens"
            />
            <NotificationToggle
              label="Novas Oportunidades"
              value={prefs.email_new_opportunities}
              onChange={() => handleToggle('email_new_opportunities')}
              description="Campanhas e oportunidades disponíveis"
            />
            <NotificationToggle
              label="Newsletter & Marketing"
              value={prefs.email_marketing}
              onChange={() => handleToggle('email_marketing')}
              description="Dicas, atualizações e promoções"
            />
            <NotificationToggle
              label="Resumo Semanal"
              value={prefs.email_weekly_digest}
              onChange={() => handleToggle('email_weekly_digest')}
              description="Resumo das atividades da semana"
            />
          </div>
        </div>

        {/* Push */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold mb-6">📱 Notificações Push</h2>
          <div className="space-y-4">
            <NotificationToggle
              label="Novos Candidatos"
              value={prefs.push_new_applications}
              onChange={() => handleToggle('push_new_applications')}
              description="Receba push quando houver novas aplicações"
            />
            <NotificationToggle
              label="Novas Mensagens"
              value={prefs.push_new_messages}
              onChange={() => handleToggle('push_new_messages')}
              description="Notificações quando receber mensagens"
            />
            <NotificationToggle
              label="Novas Oportunidades"
              value={prefs.push_new_opportunities}
              onChange={() => handleToggle('push_new_opportunities')}
              description="Campanhas e oportunidades disponíveis"
            />
            <NotificationToggle
              label="Marketing & Promoções"
              value={prefs.push_marketing}
              onChange={() => handleToggle('push_marketing')}
              description="Promoções e ofertas especiais"
            />
          </div>
        </div>

        {/* SMS */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold mb-6">📞 SMS</h2>
          <NotificationToggle
            label="Ativar SMS"
            value={prefs.sms_enabled}
            onChange={() => handleToggle('sms_enabled')}
            description="Receba notificações críticas por SMS (apenas números confirmados)"
          />
        </div>

        {/* Quiet Hours */}
        <div className="card">
          <h2 className="text-xl font-bold mb-6">🌙 Horas Silenciosas</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Início (HH:MM)</label>
              <input
                type="time"
                value={prefs.quiet_hours_start || '22:00'}
                onChange={(e) =>
                  setPrefs({ ...prefs, quiet_hours_start: e.target.value })
                }
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Fim (HH:MM)</label>
              <input
                type="time"
                value={prefs.quiet_hours_end || '08:00'}
                onChange={(e) =>
                  setPrefs({ ...prefs, quiet_hours_end: e.target.value })
                }
                className="input w-full"
              />
            </div>
            <p className="text-sm text-dark-400">
              ℹ️ Nenhuma notificação será enviada entre esses horários
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function NotificationToggle({
  label,
  value,
  onChange,
  description,
}: {
  label: string
  value: boolean
  onChange: () => void
  description: string
}) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-dark-400 mt-1">{description}</p>
      </div>
      <button
        onClick={onChange}
        className={`ml-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          value ? 'bg-primary-500' : 'bg-dark-700'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            value ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}
