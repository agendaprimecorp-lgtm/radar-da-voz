'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

interface MapMarker {
  id: string
  name: string
  type: 'talent' | 'job' | 'office'
  latitude: number
  longitude: number
  distance?: number
  icon?: string
}

interface InteractiveMapProps {
  markers: MapMarker[]
  center?: { lat: number; lng: number }
  zoom?: number
  onMarkerClick?: (marker: MapMarker) => void
  height?: string
}

export function InteractiveMap({
  markers,
  center = { lat: -15.8267, lng: -48.0516 }, // Brasil center
  zoom = 4,
  onMarkerClick,
  height = 'h-96',
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [mapMarkers, setMapMarkers] = useState<google.maps.Marker[]>([])

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current || !process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY) return

      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
        version: 'weekly',
      })

      const { Map } = await loader.importLibrary('maps')
      const { AdvancedMarkerElement } = await loader.importLibrary('marker')

      const mapInstance = new Map(mapRef.current, {
        zoom,
        center,
        mapId: 'radar-da-voz-map',
        streetViewControl: false,
      })

      setMap(mapInstance)
    }

    initMap()
  }, [])

  // Atualizar markers quando mudam
  useEffect(() => {
    if (!map) return

    // Remover markers antigos
    mapMarkers.forEach((marker) => marker.setMap(null))

    // Adicionar novos markers
    const newMarkers = markers.map((markerData) => {
      const marker = new google.maps.Marker({
        position: { lat: markerData.latitude, lng: markerData.longitude },
        map,
        title: markerData.name,
        icon: getMarkerIcon(markerData.type),
      })

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-3 max-w-xs">
            <h3 class="font-bold">${markerData.name}</h3>
            <p class="text-sm text-gray-600">${markerData.type}</p>
            ${markerData.distance ? `<p class="text-sm">📍 ${markerData.distance.toFixed(1)}km</p>` : ''}
          </div>
        `,
      })

      marker.addListener('click', () => {
        // Fechar todas as outras infoWindows
        mapMarkers.forEach((m) => {
          const info = (m as any).infoWindow
          if (info) info.close()
        })

        infoWindow.open(map, marker)
        onMarkerClick?.(markerData)
      })

      ;(marker as any).infoWindow = infoWindow
      return marker
    })

    setMapMarkers(newMarkers)

    // Auto-ajustar zoom para ver todos os markers
    if (newMarkers.length > 0) {
      const bounds = new google.maps.LatLngBounds()
      newMarkers.forEach((marker) => {
        bounds.extend(marker.getPosition()!)
      })
      map.fitBounds(bounds, { padding: 100 })
    }
  }, [markers, map])

  return <div ref={mapRef} className={`w-full ${height} rounded-lg`} />
}

function getMarkerIcon(type: string): string {
  const icons: Record<string, string> = {
    talent: '👤',
    job: '💼',
    office: '🏢',
  }
  return icons[type] || '📍'
}
