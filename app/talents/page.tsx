'use client'

import { useState, useEffect } from 'react'
import { Talent, TalentFilters } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { toast } from 'sonner'

export default function TalentsPage() {
  const [talents, setTalents] = useState<Talent[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<TalentFilters>({
    sort: 'rating',
  })

  useEffect(() => {
    loadTalents()
  }, [filters])

  const loadTalents = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.specialty) params.append('specialty', filters.specialty)
      if (filters.location_city) params.append('location_city', filters.location_city)
      if (filters.rating?.min) params.append('rating_min', filters.rating.min.toString())

      const response = await fetch(`/api/talents?${params}`)
      const data = await response.json()
      setTalents(data.talents || [])
    } catch (error) {
      toast.error('Erro ao carregar talentos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold">Banco de Talentos</h1>

        {/* Filters */}
        <div className="card mb-8 space-y-4">
          <h2 className="text-lg font-semibold">Filtros</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Input
              placeholder="Especialidade"
              onChange={(e) =>
                setFilters({ ...filters, specialty: e.target.value || undefined })
              }
            />
            <Input
              placeholder="Cidade"
              onChange={(e) =>
                setFilters({ ...filters, location_city: e.target.value || undefined })
              }
            />
            <Select
              onChange={(e) =>
                setFilters({ ...filters, sort: (e.target.value as any) || 'rating' })
              }
            >
              <option value="rating">Melhores avaliados</option>
              <option value="recent">Mais recentes</option>
            </Select>
          </div>
        </div>

        {/* Talents Grid */}
        {loading ? (
          <div className="text-center">Carregando talentos...</div>
        ) : talents.length === 0 ? (
          <div className="card text-center">
            <p className="text-dark-400">Nenhum talento encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {talents.map((talent) => (
              <div key={talent.id} className="card">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{talent.user?.name}</h3>
                    <p className="text-sm text-dark-400">{talent.specialty}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary-500">
                      {talent.rating.toFixed(1)}
                    </div>
                    <p className="text-xs text-dark-500">(⭐ rating)</p>
                  </div>
                </div>

                <p className="mb-4 text-sm text-dark-300">
                  {talent.user?.bio || 'Sem bio'}
                </p>

                <div className="mb-4 flex flex-wrap gap-2">
                  {talent.genre?.map((g) => (
                    <span key={g} className="rounded-full bg-primary-900 px-3 py-1 text-xs">
                      {g}
                    </span>
                  ))}
                </div>

                <Button className="w-full">Ver Perfil</Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
