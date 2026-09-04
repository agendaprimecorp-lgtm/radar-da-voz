'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InteractiveMap } from '@/components/map/interactive-map'
import { toast } from 'sonner'

export default function MapPage() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [searchAddress, setSearchAddress] = useState('')
  const [radius, setRadius] = useState(50)
  const [markers, setMarkers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedResult, setSelectedResult] = useState<any>(null)

  // Obter localização do usuário
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        () => {
          // Fallback para São Paulo
          setUserLocation({ lat: -23.5505, lng: -46.6333 })
        }
      )
    }
  }, [])

  // Buscar por localização
  const handleSearch = async () => {
    if (!userLocation) return

    try {
      setLoading(true)
      const response = await fetch('/api/map/nearby', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: userLocation.lat,
          longitude: userLocation.lng,
          radius,
        }),
      })

      if (!response.ok) throw new Error('Erro ao buscar')

      const data = await response.json()
      const allMarkers = [
        ...data.talents.map((t: any) => ({
          id: t.id,
          name: t.data.name,
          type: 'talent',
          latitude: t.latitude,
          longitude: t.longitude,
          distance: t.distance,
        })),
        ...data.jobs.map((j: any) => ({
          id: j.id,
          name: j.data.title,
          type: 'job',
          latitude: j.latitude,
          longitude: j.longitude,
          distance: j.distance,
        })),
        ...data.offices.map((o: any) => ({
          id: o.id,
          name: o.data.name,
          type: 'office',
          latitude: o.latitude,
          longitude: o.longitude,
          distance: o.distance,
        })),
      ]

      setMarkers(allMarkers)
      toast.success(`Encontrados ${allMarkers.length} resultados`)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold mb-8">🗺️ Mapa de Oportunidades</h1>

        {/* Controles */}
        <div className="card mb-8 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Endereço</label>
              <Input
                placeholder="Digite um endereço ou cidade..."
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Raio de Busca</label>
              <div className="flex gap-2 items-center">
                <input
                  type="range"
                  min="5"
                  max="200"
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-semibold text-primary-500">{radius}km</span>
              </div>
            </div>

            <div className="flex items-end">
              <Button onClick={handleSearch} disabled={loading} className="w-full">
                {loading ? 'Buscando...' : '🔍 Buscar'}
              </Button>
            </div>
          </div>

          {/* Info */}
          {userLocation && (
            <p className="text-sm text-dark-400">
              📍 Sua localização: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </p>
          )}
        </div>

        {/* Mapa + Resultados */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Mapa */}
          <div className="lg:col-span-2">
            <InteractiveMap
              markers={markers}
              center={userLocation || { lat: -15.8267, lng: -48.0516 }}
              zoom={10}
              onMarkerClick={setSelectedResult}
              height="h-96"
            />
          </div>

          {/* Resultados */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">
              📍 Resultados ({markers.length})
            </h3>

            {markers.length === 0 ? (
              <p className="text-dark-400 text-sm">Nenhum resultado. Clique em Buscar!</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {markers.map((marker) => (
                  <button
                    key={marker.id}
                    onClick={() => setSelectedResult(marker)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedResult?.id === marker.id
                        ? 'bg-primary-500 text-white'
                        : 'bg-dark-800 hover:bg-dark-700'
                    }`}
                  >
                    <p className="font-semibold truncate">{marker.name}</p>
                    <p className="text-xs text-dark-400">
                      {marker.type === 'talent'
                        ? '👤 Talento'
                        : marker.type === 'job'
                          ? '💼 Vaga'
                          : '🏢 Filial'}
                    </p>
                    <p className="text-sm font-bold text-primary-300">
                      {marker.distance?.toFixed(1)}km
                    </p>
                  </button>
                ))}
              </div>
            )}

            {/* Detalhes do selecionado */}
            {selectedResult && (
              <div className="card p-4 mt-4">
                <h4 className="font-bold mb-2">{selectedResult.name}</h4>
                <p className="text-sm text-dark-400 mb-4">
                  {selectedResult.type === 'talent'
                    ? '👤 Perfil de Talento'
                    : selectedResult.type === 'job'
                      ? '💼 Vaga de Emprego'
                      : '🏢 Filial Local'}
                </p>
                <p className="text-sm mb-4">
                  <strong>Distância:</strong> {selectedResult.distance?.toFixed(1)}km
                </p>
                <Button className="w-full" size="sm">
                  Ver Detalhes
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Estatísticas */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card p-4">
            <p className="text-dark-400 text-sm mb-1">👤 Talentos</p>
            <p className="text-3xl font-bold text-primary-500">
              {markers.filter((m) => m.type === 'talent').length}
            </p>
          </div>
          <div className="card p-4">
            <p className="text-dark-400 text-sm mb-1">💼 Vagas</p>
            <p className="text-3xl font-bold text-primary-500">
              {markers.filter((m) => m.type === 'job').length}
            </p>
          </div>
          <div className="card p-4">
            <p className="text-dark-400 text-sm mb-1">🏢 Filiais</p>
            <p className="text-3xl font-bold text-primary-500">
              {markers.filter((m) => m.type === 'office').length}
            </p>
          </div>
          <div className="card p-4">
            <p className="text-dark-400 text-sm mb-1">📍 Raio</p>
            <p className="text-3xl font-bold text-primary-500">{radius}km</p>
          </div>
        </div>
      </div>
    </div>
  )
}
