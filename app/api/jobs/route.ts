import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const specialty = searchParams.get('specialty')
    const location_city = searchParams.get('location_city')
    const status = searchParams.get('status') || 'open'
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('job_postings')
      .select('*, posted_by:users(*)', { count: 'exact' })
      .eq('status', status)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (specialty) query = query.eq('specialty_required', specialty)
    if (location_city) query = query.eq('location_city', location_city)

    const { data, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(
      {
        jobs: data,
        total: count,
        limit,
        offset,
      },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      posted_by_id,
      title,
      description,
      specialty_required,
      genre_required,
      location_city,
      location_state,
      budget_min,
      budget_max,
      expires_at,
    } = body

    const { data, error } = await supabase
      .from('job_postings')
      .insert({
        posted_by_id,
        title,
        description,
        specialty_required,
        genre_required,
        location_city,
        location_state,
        budget_min,
        budget_max,
        expires_at,
        status: 'open',
      })
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(
      { job: data?.[0] },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
