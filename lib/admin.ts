import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface AdminPermissions {
  user_id: string
  is_super_admin: boolean
  can_manage_users: boolean
  can_manage_organizations: boolean
  can_manage_content: boolean
  can_view_analytics: boolean
  can_manage_payments: boolean
  can_manage_system: boolean
}

export interface AdminActionLog {
  id: string
  admin_id: string
  action_type: string
  target_id?: string
  target_type?: string
  description: string
  created_at: string
}

export interface Report {
  id: string
  reporter_id: string
  target_id: string
  target_type: string
  reason: string
  status: 'open' | 'investigating' | 'resolved' | 'dismissed'
  created_at: string
}

// Verificar permissões de admin
export async function getAdminPermissions(userId: string): Promise<AdminPermissions | null> {
  try {
    const { data, error } = await supabase
      .from('admin_permissions')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code === 'PGRST116') return null
    if (error) throw new Error(error.message)
    return data
  } catch (error: any) {
    console.error('Failed to get admin permissions:', error)
    return null
  }
}

// Conceder permissões de admin
export async function grantAdminPermission(
  userId: string,
  permission: Partial<AdminPermissions>
): Promise<AdminPermissions | null> {
  try {
    const { data, error } = await supabase
      .from('admin_permissions')
      .upsert({
        user_id: userId,
        ...permission,
      })
      .select()
      .single()

    if (error) throw new Error(error.message)

    // Log ação
    await logAdminAction('permission_granted', userId, { permission })

    return data
  } catch (error: any) {
    console.error('Failed to grant admin permission:', error)
    return null
  }
}

// Log de ação de admin
export async function logAdminAction(
  actionType: string,
  adminId: string,
  details: {
    target_id?: string
    target_type?: string
    description?: string
    changes?: any
  },
  ipAddress?: string,
  userAgent?: string
): Promise<boolean> {
  try {
    await supabase.from('admin_action_logs').insert({
      admin_id: adminId,
      action_type: actionType,
      target_id: details.target_id,
      target_type: details.target_type,
      description: details.description,
      changes: details.changes,
      ip_address: ipAddress,
      user_agent: userAgent,
    })

    return true
  } catch (error: any) {
    console.error('Failed to log admin action:', error)
    return false
  }
}

// Obter logs de ação
export async function getAdminActionLogs(limit: number = 50): Promise<AdminActionLog[]> {
  try {
    const { data, error } = await supabase
      .from('admin_action_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw new Error(error.message)
    return data || []
  } catch (error: any) {
    console.error('Failed to get admin action logs:', error)
    return []
  }
}

// Criar denúncia
export async function createReport(
  reporterId: string,
  targetId: string,
  targetType: string,
  reason: string,
  description?: string
): Promise<Report | null> {
  try {
    const { data, error } = await supabase
      .from('reports')
      .insert({
        reporter_id: reporterId,
        target_id: targetId,
        target_type: targetType,
        reason,
        description,
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  } catch (error: any) {
    console.error('Failed to create report:', error)
    return null
  }
}

// Obter denúncias pendentes
export async function getPendingReports(): Promise<Report[]> {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('status', 'open')
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  } catch (error: any) {
    console.error('Failed to get pending reports:', error)
    return []
  }
}

// Resolver denúncia
export async function resolveReport(
  reportId: string,
  adminId: string,
  status: 'resolved' | 'dismissed',
  resolution: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('reports')
      .update({
        status,
        resolved_by: adminId,
        resolution,
        resolved_at: new Date().toISOString(),
      })
      .eq('id', reportId)

    if (error) throw new Error(error.message)

    // Log ação
    await logAdminAction('report_resolved', adminId, {
      target_id: reportId,
      target_type: 'report',
      description: resolution,
    })

    return true
  } catch (error: any) {
    console.error('Failed to resolve report:', error)
    return false
  }
}

// Obter configuração do sistema
export async function getSystemSetting(key: string): Promise<any> {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('setting_value')
      .eq('setting_key', key)
      .single()

    if (error && error.code === 'PGRST116') return null
    if (error) throw new Error(error.message)
    return data?.setting_value
  } catch (error: any) {
    console.error('Failed to get system setting:', error)
    return null
  }
}

// Atualizar configuração do sistema
export async function updateSystemSetting(
  key: string,
  value: any,
  adminId: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('system_settings')
      .upsert({
        setting_key: key,
        setting_value: value,
        updated_by: adminId,
        updated_at: new Date().toISOString(),
      })

    if (error) throw new Error(error.message)

    // Log ação
    await logAdminAction('system_setting_updated', adminId, {
      description: `Updated ${key}`,
      changes: value,
    })

    return true
  } catch (error: any) {
    console.error('Failed to update system setting:', error)
    return false
  }
}

// Obter estatísticas do sistema
export async function getSystemStats(): Promise<any> {
  try {
    const { data, error } = await supabase.from('admin_system_stats').select('*').single()

    if (error) throw new Error(error.message)
    return data
  } catch (error: any) {
    console.error('Failed to get system stats:', error)
    return null
  }
}

// Banir usuário
export async function banUser(
  userId: string,
  adminId: string,
  reason: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('users')
      .update({ is_banned: true, banned_reason: reason, banned_at: new Date().toISOString() })
      .eq('id', userId)

    if (error) throw new Error(error.message)

    // Log ação
    await logAdminAction('user_banned', adminId, {
      target_id: userId,
      target_type: 'user',
      description: `User banned: ${reason}`,
    })

    return true
  } catch (error: any) {
    console.error('Failed to ban user:', error)
    return false
  }
}

// Desbanir usuário
export async function unbanUser(userId: string, adminId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('users')
      .update({ is_banned: false, banned_reason: null, banned_at: null })
      .eq('id', userId)

    if (error) throw new Error(error.message)

    // Log ação
    await logAdminAction('user_unbanned', adminId, {
      target_id: userId,
      target_type: 'user',
    })

    return true
  } catch (error: any) {
    console.error('Failed to unban user:', error)
    return false
  }
}

// Remover conteúdo
export async function removeContent(
  contentId: string,
  contentType: string,
  adminId: string,
  reason: string
): Promise<boolean> {
  try {
    // Marcar como removido em vez de deletar
    const { error } = await supabase
      .from(contentType === 'job' ? 'jobs' : contentType === 'campaign' ? 'campaigns' : contentType)
      .update({ is_deleted: true, deleted_reason: reason })
      .eq('id', contentId)

    if (error) throw new Error(error.message)

    // Log ação
    await logAdminAction('content_removed', adminId, {
      target_id: contentId,
      target_type: contentType,
      description: `Content removed: ${reason}`,
    })

    return true
  } catch (error: any) {
    console.error('Failed to remove content:', error)
    return false
  }
}
