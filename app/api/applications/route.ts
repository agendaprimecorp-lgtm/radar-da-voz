import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const job_id = searchParams.get('job_id')
    const talent_id = searchParams.get('talent_id')

    let query = supabase
      .from('applications')
      .select('*, job:job_postings(*), talent:talents(*, user:users(*))')
      .order('created_at', { ascending: false })

    if (job_id) query = query.eq('job_id', job_id)
    if (talent_id) query = query.eq('talent_id', talent_id)

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ applications: data }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { job_id, talent_id } = body

    const { data, error } = await supabase
      .from('applications')
      .insert({
        job_id,
        talent_id,
        status: 'applied',
      })
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ application: data?.[0] }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status } = body

    const { data, error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', id)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ application: data?.[0] }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
