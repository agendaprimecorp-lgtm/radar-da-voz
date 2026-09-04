'use client'

import { useState, useEffect } from 'react'
import { AdCampaign } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { CampaignCard } from '@/components/campaigns/campaign-card'
import { toast } from 'sonner'
import Link from 'next/link'

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    region: '',
    status: 'open',
  })

  useEffect(() => {
    loadCampaigns()
  }, [filters])

  const loadCampaigns = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.region) params.append('region', filters.region)
      if (filters.status) params.append('status', filters.status)

      const response = await fetch(`/api/campaigns?${params}`)
      const data = await response.json()
      setCampaigns(data.campaigns || [])
    } catch (error) {
      toast.error('Erro ao carregar campanhas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Campanhas Comerciais Abertas</h1>
            <p className="text-dark-400">Ganhe dinheiro criando vídeos para marcas</p>
          </div>
          <Link href="/campaigns/create">
            <Button className="bg-primary-500">+ Criar Campanha</Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="card mb-8 space-y-4">
          <h2 className="text-lg font-semibold">Filtros</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Input
              placeholder="Região (ex: São Paulo)"
              value={filters.region}
              onChange={(e) => setFilters({ ...filters, region: e.target.value })}
            />
            <Select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="open">Aberto</option>
              <option value="in_progress">Em Andamento</option>
              <option value="completed">Completado</option>
            </Select>
          </div>
        </div>

        {/* Campaigns Grid */}
        {loading ? (
          <div className="text-center">Carregando campanhas...</div>
        ) : campaigns.length === 0 ? (
          <div className="card text-center">
            <p className="mb-4 text-dark-400">Nenhuma campanha encontrada</p>
            <p className="text-sm text-dark-500">
              Volte mais tarde para ver novas oportunidades!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} showApply={true} />
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 card bg-gradient-to-r from-primary-900 to-dark-800">
          <h3 className="mb-4 text-xl font-semibold">Como Funciona?</h3>
          <div className="space-y-3 text-sm text-dark-300">
            <p>
              <strong className="text-primary-300">1. Escolha:</strong> Veja campanhas abertas de marcas
            </p>
            <p>
              <strong className="text-primary-300">2. Crie:</strong> Grave um vídeo de 15-30 segundos com o produto
            </p>
            <p>
              <strong className="text-primary-300">3. Publique:</strong> Suba o vídeo para a campanha
            </p>
            <p>
              <strong className="text-primary-300">4. Ganhe:</strong> Se aprovado, receba 20% do orçamento da marca!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
