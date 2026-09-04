import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface SearchResult {
  id: string
  entity_type: 'talent' | 'job' | 'campaign'
  title: string
  content: string
  metadata: Record<string, any>
  rank: number
}

export interface SearchFacet {
  facet_type: string
  facet_value: string
  count: number
}

// Busca full-text com filtros
export async function searchFullText(
  query: string,
  filters?: {
    entityType?: 'talent' | 'job' | 'campaign'
    specialty?: string
    city?: string
    minRating?: number
  },
  pagination?: {
    limit?: number
    offset?: number
  }
): Promise<SearchResult[]> {
  try {
    const { data, error } = await supabase.rpc('search_full_text', {
      query,
      entity_type_filter: filters?.entityType || null,
      specialty_filter: filters?.specialty || null,
      city_filter: filters?.city || null,
      min_rating: filters?.minRating || 0,
      limit_results: pagination?.limit || 20,
      offset_results: pagination?.offset || 0,
    })

    if (error) throw new Error(error.message)
    return data || []
  } catch (error: any) {
    console.error('Failed to search:', error)
    return []
  }
}

// Obter facets para filtros
export async function getSearchFacets(): Promise<SearchFacet[]> {
  try {
    const { data, error } = await supabase.from('search_facets').select('*')

    if (error) throw new Error(error.message)
    return data || []
  } catch (error: any) {
    console.error('Failed to get facets:', error)
    return []
  }
}

// Busca de talentos específica
export async function searchTalents(
  query: string,
  filters?: {
    specialty?: string
    city?: string
    minRating?: number
  }
): Promise<SearchResult[]> {
  return searchFullText(query, {
    entityType: 'talent',
    ...filters,
  })
}

// Busca de vagas específica
export async function searchJobs(
  query: string,
  filters?: {
    specialty?: string
    city?: string
  }
): Promise<SearchResult[]> {
  return searchFullText(query, {
    entityType: 'job',
    ...filters,
  })
}

// Busca com autocomplete (primeiros 10 caracteres)
export async function searchAutocomplete(
  query: string,
  limit: number = 10
): Promise<string[]> {
  try {
    const results = await searchFullText(query, {}, { limit })
    return [...new Set(results.map((r) => r.title))]
  } catch (error: any) {
    console.error('Failed to get autocomplete suggestions:', error)
    return []
  }
}

// Busca com spell correction (usar postgresql-fuzzy ou similar)
export async function searchWithFuzzy(
  query: string,
  entityType?: string
): Promise<SearchResult[]> {
  try {
    // Usar LIKE com ILIKE para fuzzy matching básico
    let queryBuilder = supabase.from('search_index').select('*')

    if (entityType) {
      queryBuilder = queryBuilder.eq('entity_type', entityType)
    }

    const { data, error } = await queryBuilder.ilike('title', `%${query}%`).limit(20)

    if (error) throw new Error(error.message)

    return (data || []).map((d: any) => ({
      id: d.id,
      entity_type: d.entity_type,
      title: d.title,
      content: d.content,
      metadata: d.metadata,
      rank: 0,
    }))
  } catch (error: any) {
    console.error('Failed to search with fuzzy:', error)
    return []
  }
}

// Busca relacionada (encontrar similares)
export async function findSimilar(
  entityType: string,
  entityId: string,
  limit: number = 5
): Promise<SearchResult[]> {
  try {
    // Obter metadata do item atual
    const { data: current } = await supabase
      .from('search_index')
      .select('metadata')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .single()

    if (!current) return []

    // Buscar items similares baseado em metadata
    const { data, error } = await supabase
      .from('search_index')
      .select('*')
      .eq('entity_type', entityType)
      .not('entity_id', 'eq', entityId)
      .limit(limit)

    if (error) throw new Error(error.message)

    return (
      data?.map((d: any) => ({
        id: d.id,
        entity_type: d.entity_type,
        title: d.title,
        content: d.content,
        metadata: d.metadata,
        rank: 0,
      })) || []
    )
  } catch (error: any) {
    console.error('Failed to find similar:', error)
    return []
  }
}

// Reindexar todo o search_index (admin)
export async function reindexSearch(): Promise<boolean> {
  try {
    // Limpar índice
    await supabase.from('search_index').delete().neq('id', null)

    // Recriar índice para talentos
    const { data: talents } = await supabase.from('talents').select('id, name, bio, specialty, city, state, rating, reviews_count')

    if (talents) {
      for (const talent of talents) {
        await supabase.from('search_index').insert({
          entity_type: 'talent',
          entity_id: talent.id,
          title: talent.name,
          content: `${talent.bio} ${talent.specialty}`,
          metadata: {
            specialty: talent.specialty,
            city: talent.city,
            state: talent.state,
            rating: talent.rating,
            reviews: talent.reviews_count,
          },
        })
      }
    }

    // Recriar índice para vagas
    const { data: jobs } = await supabase.from('jobs').select('id, title, description, specialty, city, state, salary, status')

    if (jobs) {
      for (const job of jobs) {
        await supabase.from('search_index').insert({
          entity_type: 'job',
          entity_id: job.id,
          title: job.title,
          content: job.description,
          metadata: {
            specialty: job.specialty,
            city: job.city,
            state: job.state,
            salary: job.salary,
            status: job.status,
          },
        })
      }
    }

    return true
  } catch (error: any) {
    console.error('Failed to reindex search:', error)
    return false
  }
}

// Obter trending searches
export async function getTrendingSearches(limit: number = 10): Promise<string[]> {
  try {
    // Isso seria melhor com uma tabela de search_history
    // Por enquanto, retorna titles populares
    const { data, error } = await supabase
      .from('search_index')
      .select('title')
      .order('updated_at', { ascending: false })
      .limit(limit)

    if (error) throw new Error(error.message)

    return data?.map((d: any) => d.title) || []
  } catch (error: any) {
    console.error('Failed to get trending searches:', error)
    return []
  }
}
