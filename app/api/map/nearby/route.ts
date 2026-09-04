import { NextRequest, NextResponse } from 'next/server'
import {
  findNearbyAll,
  getUserLocationByIP,
  reverseGeocode,
} from '@/lib/geolocation'
import { createAuthResponse, getCurrentUserId } from '@/app/api/auth/protected/route'

export async function POST(request: NextRequest) {
  try {
    const { latitude, longitude, radius = 50 } = await request.json()

    if (!latitude || !longitude) {
      return createAuthResponse(400, { error: 'latitude and longitude required' })
    }

    // Buscar talentos, vagas e filiais próximos
    const results = await findNearbyAll(latitude, longitude, radius)

    // Obter informações de localidade
    const location = await reverseGeocode(latitude, longitude)

    return createAuthResponse(200, {
      results: {
        talents: results.talents,
        jobs: results.jobs,
        offices: results.offices,
      },
      location,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    return createAuthResponse(500, { error: error.message })
  }
}
