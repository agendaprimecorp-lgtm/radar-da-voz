import { NextRequest, NextResponse } from 'next/server'
import { createAuthResponse } from '@/app/api/auth/protected/route'
import {
  getMetrics30d,
  getDailyTrend,
  getRecentEvents,
  getEventTypeDistribution,
  getActiveUsersToday,
  getConversionRate,
} from '@/lib/analytics'

export async function GET(request: NextRequest) {
  try {
    // Apenas admin pode acessar analytics (TODO: implementar verificação de admin)
    const [metrics30d, trend, events, eventTypes, activeUsersToday, conversionRate] =
      await Promise.all([
        getMetrics30d(),
        getDailyTrend(30),
        getRecentEvents(20),
        getEventTypeDistribution(),
        getActiveUsersToday(),
        getConversionRate(),
      ])

    return createAuthResponse(200, {
      metrics: metrics30d,
      trend,
      recentEvents: events,
      eventDistribution: eventTypes,
      activeUsersToday,
      conversionRate: parseFloat(conversionRate),
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    return createAuthResponse(500, { error: error.message })
  }
}
