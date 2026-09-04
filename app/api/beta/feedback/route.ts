import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { validateAuth, createAuthResponse } from '@/app/api/auth/protected/route'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { feedback } = body

    if (!feedback || feedback.trim().length < 10) {
      return createAuthResponse(400, { error: 'Feedback muito curto (mínimo 10 caracteres)' })
    }

    // Salvar feedback no banco
    const { data, error } = await supabase.from('beta_feedback').insert({
      user_id: 'anonymous', // Para permitir feedback de não-logados
      message: feedback.substring(0, 2000),
      created_at: new Date().toISOString(),
    })

    if (error) {
      return createAuthResponse(500, { error: error.message })
    }

    // Log de auditoria
    await supabase.from('audit_log').insert({
      user_id: 'system',
      action: 'BETA_FEEDBACK_SUBMITTED',
      details: { feedback_length: feedback.length },
    })

    return createAuthResponse(201, {
      success: true,
      message: 'Obrigado pelo feedback! Usaremos para melhorar a plataforma.',
    })
  } catch (error: any) {
    return createAuthResponse(500, { error: error.message })
  }
}

// GET /api/beta/feedback - Admin only
export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('beta_feedback')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      return createAuthResponse(500, { error: error.message })
    }

    return createAuthResponse(200, { feedback: data })
  } catch (error: any) {
    return createAuthResponse(500, { error: error.message })
  }
}
