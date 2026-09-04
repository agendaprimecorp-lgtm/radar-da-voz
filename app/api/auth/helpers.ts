import { NextRequest, NextResponse } from 'next/server'

export function getCurrentUserId(request: NextRequest): string | null {
  try {
    const auth = request.headers.get('authorization')
    if (!auth) return null
    const token = auth.split(' ')[1]
    // Em produção usar jwt.verify()
    return token ? 'user-id' : null
  } catch {
    return null
  }
}

export function createAuthResponse(status: number, data: any) {
  return NextResponse.json(data, { status })
}
