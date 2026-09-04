'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [facets, setFacets] = useState<any>({})
  const [filters, setFilters] = useState({
    entityType: '',
    specialty: '',
    city: '',
    minRating: 0,
  })
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)

  // Buscar quando query mudar
  useEffect(() => {
    if (query.length > 2) {
      handleSearch()
    } else {
      setResults([])
    }
  }, [filters])

  const handleSearch = async () => {
    if (query.length < 2) return

    try {
      setLoading(true)
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          filters,
          pagination: { limit: 20, offset: (page - 1) * 20 },
        }),
      })

      if (!response.ok) throw new Error('Erro na busca')

      const data = await response.json()
      setResults(data.results || [])
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Buscar facets ao carregar
  useEffect(() => {
    const loadFacets = async () => {
      try {
        const response = await fetch('/api/search/facets')
        if (!response.ok) throw new Error('Erro ao carregar filtros')

        const data = await response.json()
        const grouped = data.facets?.reduce((acc: any, f: any) => {
          if (!acc[f.facet_type]) acc[f.facet_type] = []
          acc[f.facet_type].push(f)
          return acc
        }, {})

        setFacets(grouped || {})
      } catch (error: any) {
        console.error(error.message)
      }
    }

    loadFacets()
  }, [])

  const getResultIcon = (type: string) => {
    const icons: Record<string, string> = {
      talent: '👤',
      job: '💼',
      campaign: '📢',
    }
    return icons[type] || '🔍'
  }

  const getResultTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      talent: 'Talento',
      job: 'Vaga',
      campaign: 'Campanha',
    }
    return labels[type] || type
  }

  return (
    <div className="min-h-screen bg-dark-900 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold mb-8">🔍 Busca Avançada</h1>

        {/* Search Box */}
        <div className="mb-8">
          <div className="relative">
            <Input
              type="text"
              placeholder="Buscar talentos, vagas, campanhas..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pr-12"
            />
            <Button
              onClick={handleSearch}
              disabled={loading || query.length < 2}
              className="absolute right-2 top-1/2 -translate-y-1/2"
              size="sm"
            >
              {loading ? '⏳' : '🔍'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filtros (Sidebar) */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold mb-6">Filtros</h2>

            {/* Tipo de Entidade */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Tipo</h3>
              <div className="space-y-2">
                {['', 'talent', 'job', 'campaign'].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="entityType"
                      value={type}
                      checked={filters.entityType === type}
                      onChange={(e) => setFilters({ ...filters, entityType: e.target.value })}
                    />
                    <span>{type ? getResultTypeLabel(type) : 'Todos'}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Especialidade */}
            {facets.specialty && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Especialidade</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {facets.specialty.map((f: any) => (
                    <label key={f.facet_value} className="flex items-center gap-2 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={filters.specialty === f.facet_value}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            specialty: e.target.checked ? f.facet_value : '',
                          })
                        }
                      />
                      <span>
                        {f.facet_value} ({f.count})
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Cidade */}
            {facets.city && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Cidade</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {facets.city.map((f: any) => (
                    <label key={f.facet_value} className="flex items-center gap-2 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={filters.city === f.facet_value}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            city: e.target.checked ? f.facet_value : '',
                          })
                        }
                      />
                      <span>
                        {f.facet_value} ({f.count})
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Rating Mínimo */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Avaliação Mínima</h3>
              <div className="flex gap-2 items-center">
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={filters.minRating}
                  onChange={(e) => setFilters({ ...filters, minRating: parseFloat(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-sm font-semibold text-primary-500">{filters.minRating.toFixed(1)}⭐</span>
              </div>
            </div>

            {/* Clear Filters */}
            {Object.values(filters).some((v) => v !== '' && v !== 0) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setFilters({
                    entityType: '',
                    specialty: '',
                    city: '',
                    minRating: 0,
                  })
                }
                className="w-full"
              >
                Limpar Filtros
              </Button>
            )}
          </div>

          {/* Resultados */}
          <div className="lg:col-span-3">
            {query.length < 2 ? (
              <Card className="p-12 text-center">
                <p className="text-dark-400 mb-4">Digite pelo menos 2 caracteres para buscar</p>
                <p className="text-sm text-dark-500">Busque por nome, especialidade, cidade ou qualquer palavra-chave</p>
              </Card>
            ) : loading ? (
              <Card className="p-12 text-center">
                <p className="text-dark-400">Buscando...</p>
              </Card>
            ) : results.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-dark-400 mb-2">Nenhum resultado encontrado para "{query}"</p>
                <p className="text-sm text-dark-500">Tente usar palavras diferentes ou ajuste os filtros</p>
              </Card>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-dark-400 mb-4">
                  {results.length} resultado(s) encontrado(s)
                </p>

                {results.map((result) => (
                  <Card key={result.id} className="p-6 cursor-pointer hover:bg-dark-700 transition-colors">
                    <div className="flex items-start gap-4">
                      <span className="text-3xl">{getResultIcon(result.entity_type)}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold">{result.title}</h3>
                          <span className="text-xs px-2 py-1 bg-dark-700 rounded text-dark-400">
                            {getResultTypeLabel(result.entity_type)}
                          </span>
                        </div>
                        <p className="text-dark-400 text-sm mb-3 line-clamp-2">{result.content}</p>
                        <div className="flex flex-wrap gap-2">
                          {result.metadata?.specialty && (
                            <span className="text-xs bg-primary-900 text-primary-300 px-2 py-1 rounded">
                              {result.metadata.specialty}
                            </span>
                          )}
                          {result.metadata?.city && (
                            <span className="text-xs bg-dark-700 text-dark-300 px-2 py-1 rounded">
                              📍 {result.metadata.city}
                            </span>
                          )}
                          {result.metadata?.rating && (
                            <span className="text-xs bg-dark-700 text-dark-300 px-2 py-1 rounded">
                              ⭐ {result.metadata.rating}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-dark-500">
                        Relevância: {(result.rank * 100).toFixed(0)}%
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
