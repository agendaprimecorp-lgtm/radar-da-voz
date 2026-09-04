import { createClient } from '@supabase/supabase-js'

// Helper para operações com RLS ativado
export function createRLSClient(userToken: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
    }
  )
}

// Verificar se usuário tem acesso ao recurso
export async function checkUserAccess(
  userId: string,
  resourceType: 'talent' | 'campaign' | 'job' | 'video',
  resourceId: string
): Promise<boolean> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    const table = `${resourceType}s`
    const { data, error } = await supabase
      .from(table)
      .select('id')
      .eq('id', resourceId)
      .eq('user_id', userId)
      .single()

    return !error && !!data
  } catch {
    return false
  }
}

// Validar organização do usuário
export async function getUserOrganization(userId: string): Promise<string | null> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    const { data, error } = await supabase
      .from('users')
      .select('organization_id')
      .eq('id', userId)
      .single()

    if (error || !data) return null
    return data.organization_id
  } catch {
    return null
  }
}
