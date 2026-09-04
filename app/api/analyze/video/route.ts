import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { analyzeVideo } from '@/lib/video-analysis'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { talent_id, video_url, video_type = 'performance' } = body

    if (!talent_id || !video_url) {
      return NextResponse.json(
        { error: 'Missing talent_id or video_url' },
        { status: 400 }
      )
    }

    // Analisar vídeo
    const analysisResult = await analyzeVideo(video_url)

    // Salvar no banco de dados
    const { data, error } = await supabase
      .from('video_submissions')
      .insert({
        talent_id,
        video_url,
        video_type,
        duration_seconds: analysisResult.tempo_visto,
        analysis_score: {
          carisma: analysisResult.carisma,
          naturalidade: analysisResult.naturalidade,
          tecnica: analysisResult.tecnica,
          score_geral: analysisResult.score_geral,
          tempo_visto: analysisResult.tempo_visto,
          feedback: analysisResult.feedback,
        },
        status: 'completed',
      })
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(
      {
        video: data?.[0],
        analysis: analysisResult,
      },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
