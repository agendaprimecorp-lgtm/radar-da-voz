import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { campaign_id, influencer_id, video_url } = body

    if (!campaign_id || !influencer_id || !video_url) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Obter campanha e calcular comissão
    const { data: campaign } = await supabase
      .from('ad_campaigns')
      .select('budget')
      .eq('id', campaign_id)
      .single()

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    // 20% da comissão para influenciador (80% vai para empresa)
    const commission = campaign.budget * 0.2

    const { data, error } = await supabase
      .from('campaign_submissions')
      .insert({
        campaign_id,
        influencer_id,
        video_url,
        status: 'submitted',
        commission_amount: commission,
      })
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(
      { submission: data?.[0], commission_amount: commission },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
