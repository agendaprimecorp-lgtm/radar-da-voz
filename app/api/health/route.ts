import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Testar conexão com banco
    const { data, error } = await supabase
      .from('users')
      .select('count(*)', { count: 'exact' })
      .limit(1)

    if (error) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Database connection failed',
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      )
    }

    return NextResponse.json(
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        uptime: process.uptime(),
        database: 'connected',
        environment: process.env.NODE_ENV,
      },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
