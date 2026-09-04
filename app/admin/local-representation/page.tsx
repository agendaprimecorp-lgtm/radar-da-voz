'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function LocalRepresentationPage() {
  const [representatives, setRepresentatives] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRegion, setSelectedRegion] = useState<string>('sudeste')

  const regions = ['norte', 'nordeste', 'centro-oeste', 'sudeste', 'sul']

  useEffect(() => {
    loadRepresentatives()
  }, [selectedRegion])

  const loadRepresentatives = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/local-representation/representatives?region=${selectedRegion}`)
      if (!response.ok) throw new Error('Falha ao carregar')

      const data = await response.json()
      setRepresentatives(data.representatives || [])
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold mb-8">🗺️ Representação Local</h1>

        {/* Filtro por região */}
        <div className="mb-8">
          <div className="flex gap-2 flex-wrap">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedRegion === region
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                }`}
              >
                {region.charAt(0).toUpperCase() + region.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-dark-400">Carregando...</p>
        ) : representatives.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-dark-400 mb-4">Nenhum representante nesta região</p>
            <Button variant="outline">+ Adicionar Representante</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {representatives.map((rep) => (
              <div key={rep.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{rep.name}</h3>
                    <p className="text-sm text-dark-400">
                      {rep.city_name}, {rep.state_code}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    rep.is_active
                      ? 'bg-green-900 text-green-300'
                      : 'bg-red-900 text-red-300'
                  }`}>
                    {rep.is_active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  {rep.email && (
                    <p className="text-dark-400">
                      📧 <a href={`mailto:${rep.email}`} className="text-primary-500 hover:underline">
                        {rep.email}
                      </a>
                    </p>
                  )}
                  {rep.phone && (
                    <p className="text-dark-400">
                      📱 <a href={`tel:${rep.phone}`} className="text-primary-500 hover:underline">
                        {rep.phone}
                      </a>
                    </p>
                  )}
                  {rep.office_name && (
                    <p className="text-dark-400">
                      🏢 {rep.office_name}
                    </p>
                  )}
                </div>

                <div className="mb-4 pb-4 border-b border-dark-700">
                  <p className="text-sm text-dark-400">
                    <strong>{rep.talents_covered}</strong> talento(s) coberto(s)
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Detalhes
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Estatísticas por região */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">📊 Estatísticas por Região</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {regions.map((region) => (
              <div key={region} className="card">
                <p className="text-dark-400 text-sm mb-2">
                  {region.charAt(0).toUpperCase() + region.slice(1)}
                </p>
                <p className="text-3xl font-bold text-primary-500">
                  {representatives.filter(r => r.region === region).length}
                </p>
                <p className="text-xs text-dark-400 mt-2">representantes</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mapa visual */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">🌍 Cobertura Nacional</h2>
          <div className="card p-8 text-center">
            <p className="text-dark-400 mb-4">
              Mapa interativo de representantes locais (Google Maps API)
            </p>
            <div className="w-full h-96 bg-dark-800 rounded flex items-center justify-center">
              <p className="text-dark-400">Mapa será renderizado aqui</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
