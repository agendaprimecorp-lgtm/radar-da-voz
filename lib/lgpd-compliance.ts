import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Registro de consentimento LGPD
export async function recordConsent(userId: string, type: 'marketing' | 'analytics' | 'profiling') {
  return await supabase.from('lgpd_consent').insert({
    user_id: userId,
    consent_type: type,
    granted: true,
    timestamp: new Date().toISOString(),
    ip_address: '', // Preenchido no servidor
  })
}

// Solicitar dados pessoais do usuário (direito de acesso)
export async function getUserData(userId: string) {
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  const { data: talents } = await supabase
    .from('talents')
    .select('*')
    .eq('user_id', userId)

  const { data: applications } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', userId)

  return {
    user,
    talents,
    applications,
  }
}

// Deletar todos os dados do usuário (direito ao esquecimento)
export async function deleteUserData(userId: string) {
  try {
    // 1. Deletar dados relacionados
    await supabase.from('applications').delete().eq('user_id', userId)
    await supabase.from('video_submissions').delete().eq('talent_id', userId)
    await supabase.from('talents').delete().eq('user_id', userId)
    await supabase.from('messages').delete().eq('sender_id', userId)
    await supabase.from('messages').delete().eq('recipient_id', userId)
    await supabase.from('reviews').delete().eq('reviewer_id', userId)

    // 2. Anonymizar dados do usuário
    await supabase
      .from('users')
      .update({
        email: `deleted_${userId}@noreply.com`,
        full_name: 'Usuário Deletado',
        is_deleted: true,
      })
      .eq('id', userId)

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Exportar dados em formato portável
export async function exportUserDataAsPDF(userId: string) {
  const data = await getUserData(userId)

  const pdf = {
    exportDate: new Date().toISOString(),
    user: data.user,
    talents: data.talents,
    applications: data.applications,
    note: 'Dados em conformidade com LGPD - Lei Geral de Proteção de Dados',
  }

  return JSON.stringify(pdf, null, 2)
}

// Log de atividades para auditoria
export async function logActivity(userId: string, action: string, details: any) {
  return await supabase.from('audit_log').insert({
    user_id: userId,
    action,
    details,
    timestamp: new Date().toISOString(),
  })
}
