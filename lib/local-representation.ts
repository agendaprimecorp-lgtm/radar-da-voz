import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface LocalOffice {
  id: string
  organization_id: string
  name: string
  description?: string
  city_id: number
  state_id: number
  address?: string
  postal_code?: string
  phone?: string
  email?: string
  manager_id?: string
  website?: string
  latitude?: number
  longitude?: number
  is_active: boolean
  city_name?: string
  state_name?: string
}

export interface LocalRepresentative {
  id: string
  user_id: string
  organization_id: string
  office_id?: string
  city_id: number
  state_id: number
  phone?: string
  expertise?: string[]
  languages?: string[]
  commission_rate: number
  is_active: boolean
}

// Obter filiais por organização
export async function getLocalOffices(organizationId: string) {
  try {
    const { data, error } = await supabase
      .from('local_offices')
      .select(
        `
        *,
        city:cities(name),
        state:states(code, name, region)
      `
      )
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  } catch (error: any) {
    console.error('Failed to get local offices:', error)
    return []
  }
}

// Criar nova filial
export async function createLocalOffice(office: Omit<LocalOffice, 'id'>) {
  try {
    const { data, error } = await supabase
      .from('local_offices')
      .insert(office)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  } catch (error: any) {
    console.error('Failed to create local office:', error)
    return null
  }
}

// Atualizar filial
export async function updateLocalOffice(id: string, updates: Partial<LocalOffice>) {
  try {
    const { data, error } = await supabase
      .from('local_offices')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  } catch (error: any) {
    console.error('Failed to update local office:', error)
    return null
  }
}

// Obter representantes locais por estado
export async function getLocalRepresentatives(stateId?: number, cityId?: number) {
  try {
    let query = supabase.from('regional_representation').select('*')

    if (stateId) query = query.eq('state_id', stateId)
    if (cityId) query = query.eq('city_id', cityId)

    const { data, error } = await query.eq('is_active', true).order('state_name')

    if (error) throw new Error(error.message)
    return data || []
  } catch (error: any) {
    console.error('Failed to get local representatives:', error)
    return []
  }
}

// Criar representante local
export async function createLocalRepresentative(rep: Omit<LocalRepresentative, 'id'>) {
  try {
    const { data, error } = await supabase
      .from('local_representatives')
      .insert(rep)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  } catch (error: any) {
    console.error('Failed to create local representative:', error)
    return null
  }
}

// Atualizar representante
export async function updateLocalRepresentative(
  id: string,
  updates: Partial<LocalRepresentative>
) {
  try {
    const { data, error } = await supabase
      .from('local_representatives')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  } catch (error: any) {
    console.error('Failed to update local representative:', error)
    return null
  }
}

// Obter vagas por região
export async function getJobsByRegion(region?: string) {
  try {
    let query = supabase.from('jobs_by_region').select('*')

    if (region) query = query.eq('region', region)

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  } catch (error: any) {
    console.error('Failed to get jobs by region:', error)
    return []
  }
}

// Obter todos os estados
export async function getStates() {
  try {
    const { data, error } = await supabase
      .from('states')
      .select('*')
      .order('name')

    if (error) throw new Error(error.message)
    return data || []
  } catch (error: any) {
    console.error('Failed to get states:', error)
    return []
  }
}

// Obter cidades por estado
export async function getCitiesByState(stateId: number) {
  try {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('state_id', stateId)
      .order('name')

    if (error) throw new Error(error.message)
    return data || []
  } catch (error: any) {
    console.error('Failed to get cities:', error)
    return []
  }
}

// Cobrir talento por representante
export async function coverTalent(representativeId: string, talentId: string) {
  try {
    const { data, error } = await supabase
      .from('talent_coverage')
      .insert({
        representative_id: representativeId,
        talent_id: talentId,
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  } catch (error: any) {
    console.error('Failed to cover talent:', error)
    return null
  }
}

// Remover cobertura
export async function removeTalentCoverage(representativeId: string, talentId: string) {
  try {
    const { error } = await supabase
      .from('talent_coverage')
      .delete()
      .eq('representative_id', representativeId)
      .eq('talent_id', talentId)

    if (error) throw new Error(error.message)
    return true
  } catch (error: any) {
    console.error('Failed to remove talent coverage:', error)
    return false
  }
}

// Obter representantes por talento
export async function getRepresentativesForTalent(talentId: string) {
  try {
    const { data, error } = await supabase
      .from('talent_coverage')
      .select(
        `
        *,
        representative:local_representatives(
          *,
          user:users(name, email, avatar_url),
          state:states(code, name),
          city:cities(name)
        )
      `
      )
      .eq('talent_id', talentId)

    if (error) throw new Error(error.message)
    return data || []
  } catch (error: any) {
    console.error('Failed to get representatives:', error)
    return []
  }
}

// Encontrar representante mais próximo por coordenadas
export async function findNearestRepresentative(latitude: number, longitude: number, maxDistance = 100) {
  try {
    // Isso seria mais eficiente com PostGIS no banco
    // Por enquanto, fazemos em memória
    const { data: representatives } = await supabase
      .from('local_representatives')
      .select(
        `
        *,
        user:users(name, email),
        city:cities(latitude, longitude, name)
      `
      )
      .eq('is_active', true)

    if (!representatives) return null

    let nearest = null
    let minDistance = maxDistance

    representatives.forEach((rep: any) => {
      if (!rep.city?.latitude || !rep.city?.longitude) return

      const distance = calculateDistance(
        latitude,
        longitude,
        rep.city.latitude,
        rep.city.longitude
      )

      if (distance < minDistance) {
        minDistance = distance
        nearest = rep
      }
    })

    return nearest
  } catch (error: any) {
    console.error('Failed to find nearest representative:', error)
    return null
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
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
