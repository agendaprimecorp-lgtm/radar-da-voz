import { NextRequest, NextResponse } from 'next/server'
import { geocode, reverseGeocode } from '@/lib/geolocation'
import { createAuthResponse } from '@/app/api/auth/protected/route'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (body.address) {
      // Geocoding: endereço → coordenadas
      const location = await geocode(body.address)
      if (!location) {
        return createAuthResponse(404, { error: 'Address not found' })
      }
      return createAuthResponse(200, { location })
    }

    if (body.latitude && body.longitude) {
      // Reverse Geocoding: coordenadas → endereço
      const address = await reverseGeocode(body.latitude, body.longitude)
      if (!address) {
        return createAuthResponse(404, { error: 'Location not found' })
      }
      return createAuthResponse(200, { address })
    }

    return createAuthResponse(400, { error: 'address or coordinates required' })
  } catch (error: any) {
    return createAuthResponse(500, { error: error.message })
  }
}
