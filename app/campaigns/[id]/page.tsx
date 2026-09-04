'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  const [campaign, setCampaign] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')

  useEffect(() => {
    loadCampaign()
  }, [params.id])

  const loadCampaign = async () => {
    setLoading(true)
    try {
      // TODO: Implementar fetch de campanha específica
      // const response = await fetch(`/api/campaigns/${params.id}`)
      // const data = await response.json()
      // setCampaign(data.campaign)
      setCampaign({
        id: params.id,
        title: 'Campanha Exemplo',
        brief: 'Crie um vídeo divertido com nosso produto',
        budget: 1000,
        target_region: 'São Paulo',
        company: { name: 'Empresa X' },
      })
    } catch (error) {
      toast.error('Erro ao carregar campanha')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!videoUrl) {
      toast.error('Envie um vídeo')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/campaigns/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign_id: params.id,
          influencer_id: 'TODO', // User ID
          video_url: videoUrl,
        }),
      })

      if (!response.ok) throw new Error('Falha ao submeter')

      const data = await response.json()
      toast.success(`Submetido! Você ganhará ${formatCurrency(data.commission_amount)}`)
      setVideoUrl('')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div>Carregando...</div>
  if (!campaign) return <div>Campanha não encontrada</div>

  return (
    <div className="min-h-screen bg-dark-900 p-8">
      <div className="mx-auto max-w-3xl">
        <div className="card mb-8">
          <h1 className="text-3xl font-bold mb-2">{campaign.title}</h1>
          <p className="text-dark-400 mb-4">{campaign.company?.name}</p>

          <div className="mb-6 flex items-center gap-8">
            <div>
              <p className="text-sm text-dark-500">Orçamento Total</p>
              <p className="text-2xl font-bold text-primary-500">
                {formatCurrency(campaign.budget)}
              </p>
            </div>
            <div>
              <p className="text-sm text-dark-500">Sua Comissão</p>
              <p className="text-2xl font-bold text-green-500">
                {formatCurrency(campaign.budget * 0.2)}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">O que Queremos</h3>
            <p className="text-dark-300">{campaign.brief}</p>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Submeter Vídeo</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">URL do Vídeo</label>
              <Input
                type="url"
                placeholder="https://youtube.com/... ou https://cloud..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                required
              />
              <p className="mt-2 text-xs text-dark-400">
                ℹ️ Upload seu vídeo no YouTube ou Vimeo e cole o link aqui
              </p>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary-500"
            >
              {submitting ? 'Enviando...' : 'Submeter para Aprovação'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
