import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface AnalyticsEvent {
  event_type: string
  event_data?: any
  session_id?: string
}

export interface DailyMetrics {
  date: string
  active_users: number
  new_users: number
  job_applications: number
  campaign_submissions: number
  revenue: number
  messages_sent: number
}

export interface Metrics30d {
  total_active_users: number
  total_new_users: number
  total_page_views: number
  total_job_postings: number
  total_job_applications: number
  total_campaigns: number
  total_submissions: number
  total_messages: number
  total_reviews: number
  total_revenue: number
  avg_revenue_per_application: number
  avg_submissions_per_campaign: number
}

// Log de evento
export async function logEvent(
  userId: string | null,
  eventType: string,
  eventData?: any,
  sessionId?: string
) {
  try {
    const { data, error } = await supabase.rpc('log_analytics_event', {
      p_user_id: userId,
      p_event_type: eventType,
      p_event_data: eventData || null,
      p_session_id: sessionId || null,
    })

    if (error) console.error('Analytics error:', error)
    return data
  } catch (error) {
    console.error('Failed to log event:', error)
  }
}

// Obter métricas dos últimos 30 dias
export async function getMetrics30d(): Promise<Metrics30d | null> {
  try {
    const { data, error } = await supabase.from('metrics_30d').select('*').single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching metrics:', error)
      return null
    }

    return data || null
  } catch (error) {
    console.error('Failed to fetch metrics:', error)
    return null
  }
}

// Obter tendência diária (últimos 90 dias)
export async function getDailyTrend(days: number = 30) {
  try {
    const { data, error } = await supabase
      .from('daily_trend')
      .select('*')
      .limit(days)

    if (error) {
      console.error('Error fetching trend:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Failed to fetch trend:', error)
    return []
  }
}

// Obter eventos recentes (últimas 24h)
export async function getRecentEvents(limit: number = 50) {
  try {
    const { data, error } = await supabase
      .from('analytics_events')
      .select(`
        id,
        event_type,
        created_at,
        user_id,
        users:users(full_name)
      `)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching events:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Failed to fetch events:', error)
    return []
  }
}

// Contar eventos por tipo (últimas 24h)
export async function getEventTypeDistribution() {
  try {
    const { data, error } = await supabase
      .from('analytics_events')
      .select('event_type')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    if (error) {
      console.error('Error fetching event types:', error)
      return {}
    }

    const distribution: { [key: string]: number } = {}
    data?.forEach((event: any) => {
      distribution[event.event_type] = (distribution[event.event_type] || 0) + 1
    })

    return distribution
  } catch (error) {
    console.error('Failed to fetch event distribution:', error)
    return {}
  }
}

// Obter usuários ativos hoje
export async function getActiveUsersToday() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { data, error } = await supabase
      .from('analytics_events')
      .select('user_id')
      .gte('created_at', today.toISOString())
      .neq('user_id', null)

    if (error) {
      console.error('Error fetching active users:', error)
      return 0
    }

    // Contar usuários únicos
    const uniqueUsers = new Set(data?.map((e: any) => e.user_id))
    return uniqueUsers.size
  } catch (error) {
    console.error('Failed to fetch active users:', error)
    return 0
  }
}

// Calcular taxa de conversão
export async function getConversionRate() {
  const metrics = await getMetrics30d()
  if (!metrics || !metrics.total_job_applications) return 0

  return (
    (metrics.total_submissions / metrics.total_job_applications) * 100
  ).toFixed(2)
}
