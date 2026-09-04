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
    const genre = searchParams.get('genre')
    const location_city = searchParams.get('location_city')
    const rating_min = searchParams.get('rating_min')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('talents')
      .select('*, user:users(*), audio_count:audio_recordings(count)', { count: 'exact' })
      .order('rating', { ascending: false })
      .range(offset, offset + limit - 1)

    if (specialty) query = query.eq('specialty', specialty)
    if (genre) query = query.contains('genre', [genre])
    if (location_city) {
      query = supabase
        .from('talents')
        .select('*, user:users(*), audio_count:audio_recordings(count)', { count: 'exact' })
        .eq('user.location_city', location_city)
        .order('rating', { ascending: false })
        .range(offset, offset + limit - 1)
    }
    if (rating_min) query = query.gte('rating', parseFloat(rating_min))

    const { data, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(
      {
        talents: data,
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
    const { user_id, specialty, genre, experience_years } = body

    const { data, error } = await supabase
      .from('talents')
      .insert({
        user_id,
        specialty,
        genre,
        experience_years,
      })
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(
      { talent: data?.[0] },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
