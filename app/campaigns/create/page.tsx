'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { toast } from 'sonner'

export default function CreateCampaignPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    brief: '',
    budget: '',
    target_region: '',
    target_city: '',
    deadline: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: 'TODO', // Será preenchido com user ID atual
          ...formData,
          budget: parseFloat(formData.budget),
        }),
      })

      if (!response.ok) throw new Error('Falha ao criar campanha')

      toast.success('Campanha criada com sucesso!')
      router.push('/campaigns')
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar campanha')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-3xl font-bold">Criar Nova Campanha</h1>
        <p className="mb-8 text-dark-400">
          Crie um briefing de anúncio e receba submissões de influenciadores
        </p>

        <form onSubmit={handleSubmit} className="card space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Título da Campanha</label>
            <Input
              name="title"
              placeholder="Ex: Novo Refrigerante - Verão 2026"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Brief do Anúncio</label>
            <textarea
              name="brief"
              placeholder="Descreva o que você quer no vídeo, estilo, tom, etc..."
              value={formData.brief}
              onChange={handleChange}
              className="w-full rounded-md border border-dark-600 bg-dark-800 px-3 py-2 text-dark-50 h-24 focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Orçamento (R$)</label>
            <Input
              name="budget"
              type="number"
              placeholder="Ex: 1000"
              value={formData.budget}
              onChange={handleChange}
              required
            />
            <p className="mt-2 text-xs text-dark-400">
              💰 Influenciador receberá: R$ {formData.budget ? (parseFloat(formData.budget) * 0.2).toFixed(2) : '0'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Região Alvo</label>
            <Input
              name="target_region"
              placeholder="Ex: São Paulo"
              value={formData.target_region}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Cidade (Opcional)</label>
            <Input
              name="target_city"
              placeholder="Ex: São Paulo - SP"
              value={formData.target_city}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Data de Expiração</label>
            <Input
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleChange}
              required
            />
          </div>

          <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
            <h3 className="font-semibold mb-2 text-primary-300">Como Funciona?</h3>
            <ul className="text-sm text-dark-400 space-y-1">
              <li>✓ Influenciadores veem sua campanha</li>
              <li>✓ Eles criam vídeos com seu produto</li>
              <li>✓ Você aprova/rejeita as submissões</li>
              <li>✓ Videos aprovados são publicados</li>
              <li>✓ Você paga apenas pelos aprovados</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="flex-1 bg-primary-500">
              {loading ? 'Criando...' : 'Criar Campanha'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
