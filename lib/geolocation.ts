import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface GeoLocation {
  latitude: number
  longitude: number
  accuracy?: number
  timestamp?: number
}

export interface NearbyResult {
  id: string
  name: string
  type: 'talent' | 'job' | 'office'
  latitude: number
  longitude: number
  distance: number // km
  data: any
}

// Obter localização do usuário via IP
export async function getUserLocationByIP(ip: string): Promise<GeoLocation | null> {
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`)
    if (!response.ok) return null

    const data = await response.json()
    return {
      latitude: data.latitude,
      longitude: data.longitude,
      accuracy: data.accuracy || 1000,
    }
  } catch (error) {
    console.error('Failed to get location by IP:', error)
    return null
  }
}

// Buscar localidades por coordenadas (Reverse Geocoding)
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<{ city: string; state: string; country: string } | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    )
    if (!response.ok) return null

    const data = await response.json()
    return {
      city: data.address?.city || data.address?.town || '',
      state: data.address?.state || '',
      country: data.address?.country || '',
    }
  } catch (error) {
    console.error('Failed to reverse geocode:', error)
    return null
  }
}

// Buscar coordenadas por endereço (Geocoding)
export async function geocode(address: string): Promise<GeoLocation | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
    )
    if (!response.ok) return null

    const data = await response.json()
    if (!data || data.length === 0) return null

    return {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon),
    }
  } catch (error) {
    console.error('Failed to geocode:', error)
    return null
  }
}

// Calcular distância entre dois pontos (Haversine)
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Raio da Terra em km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Encontrar talentos próximos
export async function findNearbyTalents(
  latitude: number,
  longitude: number,
  radiusKm: number = 50
): Promise<NearbyResult[]> {
  try {
    // PostGIS query seria ideal, mas usando Haversine em memória
    const { data: talents } = await supabase
      .from('talents')
      .select(
        `
        id,
        name,
        specialty,
        latitude,
        longitude,
        rating,
        avatar_url
      `
      )
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)

    if (!talents) return []

    return (
      talents
        .map((talent: any) => {
          const distance = calculateDistance(latitude, longitude, talent.latitude, talent.longitude)
          return {
            id: talent.id,
            name: talent.name,
            type: 'talent' as const,
            latitude: talent.latitude,
            longitude: talent.longitude,
            distance,
            data: talent,
          }
        })
        .filter((result) => result.distance <= radiusKm)
        .sort((a, b) => a.distance - b.distance)
    )
  } catch (error) {
    console.error('Failed to find nearby talents:', error)
    return []
  }
}

// Encontrar vagas próximas
export async function findNearbyJobs(
  latitude: number,
  longitude: number,
  radiusKm: number = 50
): Promise<NearbyResult[]> {
  try {
    const { data: jobs } = await supabase
      .from('jobs')
      .select(
        `
        id,
        title,
        specialty,
        latitude,
        longitude,
        salary,
        status
      `
      )
      .eq('status', 'open')
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)

    if (!jobs) return []

    return (
      jobs
        .map((job: any) => {
          const distance = calculateDistance(latitude, longitude, job.latitude, job.longitude)
          return {
            id: job.id,
            name: job.title,
            type: 'job' as const,
            latitude: job.latitude,
            longitude: job.longitude,
            distance,
            data: job,
          }
        })
        .filter((result) => result.distance <= radiusKm)
        .sort((a, b) => a.distance - b.distance)
    )
  } catch (error) {
    console.error('Failed to find nearby jobs:', error)
    return []
  }
}

// Encontrar filiais próximas
export async function findNearbyOffices(
  latitude: number,
  longitude: number,
  radiusKm: number = 50
): Promise<NearbyResult[]> {
  try {
    const { data: offices } = await supabase
      .from('local_offices')
      .select(
        `
        id,
        name,
        latitude,
        longitude,
        phone,
        email,
        is_active
      `
      )
      .eq('is_active', true)
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)

    if (!offices) return []

    return (
      offices
        .map((office: any) => {
          const distance = calculateDistance(latitude, longitude, office.latitude, office.longitude)
          return {
            id: office.id,
            name: office.name,
            type: 'office' as const,
            latitude: office.latitude,
            longitude: office.longitude,
            distance,
            data: office,
          }
        })
        .filter((result) => result.distance <= radiusKm)
        .sort((a, b) => a.distance - b.distance)
    )
  } catch (error) {
    console.error('Failed to find nearby offices:', error)
    return []
  }
}

// Buscar tudo próximo (talentos + vagas + filiais)
export async function findNearbyAll(
  latitude: number,
  longitude: number,
  radiusKm: number = 50
): Promise<{
  talents: NearbyResult[]
  jobs: NearbyResult[]
  offices: NearbyResult[]
}> {
  try {
    const [talents, jobs, offices] = await Promise.all([
      findNearbyTalents(latitude, longitude, radiusKm),
      findNearbyJobs(latitude, longitude, radiusKm),
      findNearbyOffices(latitude, longitude, radiusKm),
    ])

    return { talents, jobs, offices }
  } catch (error) {
    console.error('Failed to find nearby all:', error)
    return { talents: [], jobs: [], offices: [] }
  }
}

// Atualizar localização do usuário
export async function updateUserLocation(
  userId: string,
  latitude: number,
  longitude: number
) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        latitude,
        longitude,
        last_location_update: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  } catch (error: any) {
    console.error('Failed to update user location:', error)
    return null
  }
}

// Validar se ponto está dentro de polygon (simplificado - bounding box)
export function isPointInBoundingBox(
  point: GeoLocation,
  minLat: number,
  minLon: number,
  maxLat: number,
  maxLon: number
): boolean {
  return (
    point.latitude >= minLat &&
    point.latitude <= maxLat &&
    point.longitude >= minLon &&
    point.longitude <= maxLon
  )
}

// Obter bounds de um conjunto de localizações
export function getBoundingBox(locations: GeoLocation[]): {
  minLat: number
  minLon: number
  maxLat: number
  maxLon: number
} {
  if (locations.length === 0) {
    return { minLat: 0, minLon: 0, maxLat: 0, maxLon: 0 }
  }

  const lats = locations.map((l) => l.latitude)
  const lons = locations.map((l) => l.longitude)

  return {
    minLat: Math.min(...lats),
    minLon: Math.min(...lons),
    maxLat: Math.max(...lats),
    maxLon: Math.max(...lons),
  }
}

// Converter endereço para coordenadas
export async function addressToCoordinates(
  street: string,
  city: string,
  state: string
): Promise<GeoLocation | null> {
  return geocode(`${street}, ${city}, ${state}, Brasil`)
}

// Verificar se está em zona urbana ou rural
export async function getAreaType(
  latitude: number,
  longitude: number
): Promise<'urban' | 'rural' | 'unknown'> {
  try {
    // Simplificado: usar dados do OpenStreetMap
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    )
    if (!response.ok) return 'unknown'

    const data = await response.json()
    const addressType = data.address?.category || ''

    if (addressType.includes('city') || addressType.includes('town')) {
      return 'urban'
    }
    return 'rural'
  } catch (error) {
    console.error('Failed to get area type:', error)
    return 'unknown'
  }
}
