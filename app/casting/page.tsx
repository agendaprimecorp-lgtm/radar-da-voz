'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { TalentCardCompact } from '@/components/casting/talent-card-compact'
import { ComparisonView } from '@/components/casting/comparison-view'
import { toast } from 'sonner'

export default function CastingComparadorPage() {
  const [talents, setTalents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTalents, setSelectedTalents] = useState<string[]>([])
  const [comparing, setComparing] = useState(false)
  const [comparison, setComparison] = useState<any>(null)
  const [filters, setFilters] = useState({
    specialty: '',
    city: '',
  })

  useEffect(() => {
    loadTalents()
  }, [filters])

  const loadTalents = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.specialty) params.append('specialty', filters.specialty)
      if (filters.city) params.append('city', filters.city)

      const response = await fetch(`/api/talents?${params.toString()}`)
      if (!response.ok) throw new Error('Falha ao carregar talentos')

      const data = await response.json()
      setTalents(data.talents || [])
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleTalentSelection = (talentId: string) => {
    setSelectedTalents((prev) =>
      prev.includes(talentId) ? prev.filter((id) => id !== talentId) : [...prev, talentId]
    )
  }

  const handleCompare = async () => {
    if (selectedTalents.length < 2) {
      toast.error('Selecione pelo menos 2 talentos para comparar')
      return
    }

    setComparing(true)
    try {
      const response = await fetch('/api/casting/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          talentIds: selectedTalents,
          jobRequirements: {
            minCarisma: 5,
            minNaturalidade: 5,
            minTecnica: 5,
          },
        }),
      })

      if (!response.ok) throw new Error('Falha ao comparar')

      const data = await response.json()
      setComparison(data.comparison)
      toast.success('Comparação realizada!')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setComparing(false)
    }
  }

  if (comparison) {
    return (
      <div className="min-h-screen bg-dark-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Button
              onClick={() => {
                setComparison(null)
                setSelectedTalents([])
              }}
              variant="outline"
            >
              ← Voltar para Seleção
            </Button>
          </div>

          <ComparisonView
            talents={comparison.talents}
            scores={comparison.compatibilityScores}
            winner={comparison.winner}
            recommendation={comparison.recommendation}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold mb-2">🎬 Comparador de Casting</h1>
        <p className="text-dark-400 mb-8">
          Selecione múltiplos talentos e compare suas análises lado-a-lado
        </p>

        {/* Filtros */}
        <div className="card mb-8">
          <h2 className="text-lg font-semibold mb-4">Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              value={filters.specialty}
              onChange={(value) => setFilters((prev) => ({ ...prev, specialty: value }))}
            >
              <option value="">Todas as especialidades</option>
              <option value="singing">Canto</option>
              <option value="acting">Atuação</option>
              <option value="dancing">Dança</option>
              <option value="presenting">Apresentação</option>
              <option value="voice">Voz</option>
            </Select>
            <Input
              type="text"
              placeholder="Filtrar por cidade..."
              value={filters.city}
              onChange={(e) => setFilters((prev) => ({ ...prev, city: e.target.value }))}
            />
          </div>
        </div>

        {/* Lista de Talentos */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              Talentos Disponíveis ({talents.length})
            </h2>
            <span className="text-sm text-primary-400">
              {selectedTalents.length} selecionado(s)
            </span>
          </div>

          {loading ? (
            <div className="text-center text-dark-400">Carregando...</div>
          ) : talents.length === 0 ? (
            <div className="text-center text-dark-400">Nenhum talento encontrado</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {talents.map((talent) => (
                <TalentCardCompact
                  key={talent.id}
                  name={talent.full_name || talent.name}
                  specialty={talent.specialty}
                  rating={talent.rating || 0}
                  carisma={talent.carisma || 5}
                  naturalidade={talent.naturalidade || 5}
                  tecnica={talent.tecnica || 5}
                  scoreGeral={talent.score_geral || 5}
                  isSelected={selectedTalents.includes(talent.id)}
                  onSelect={() => toggleTalentSelection(talent.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Botão de Comparação */}
        <div className="sticky bottom-0 bg-dark-900 p-4 border-t border-dark-700">
          <Button
            onClick={handleCompare}
            disabled={comparing || selectedTalents.length < 2}
            className="w-full bg-primary-500 py-6 text-lg"
          >
            {comparing ? '⏳ Comparando...' : `🎯 Comparar ${selectedTalents.length} Talentos`}
          </Button>
          {selectedTalents.length < 2 && (
            <p className="text-sm text-dark-400 text-center mt-2">
              Selecione pelo menos 2 talentos para comparar
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
