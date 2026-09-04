import { createClient } from '@supabase/supabase-js'
import { logError } from './monitoring'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export type NotificationType = 'new_application' | 'new_message' | 'new_opportunity' | 'new_review'
export type NotificationChannel = 'email' | 'push' | 'sms'

interface SendNotificationOptions {
  userId: string
  type: NotificationType
  subject: string
  content: string
  data?: Record<string, any>
  channels?: NotificationChannel[]
}

// Enviar notificação (escolhe canais baseado em preferências)
export async function sendNotification(options: SendNotificationOptions) {
  try {
    const { userId, type, subject, content, data, channels } = options

    // Obter preferências do usuário
    const { data: prefs } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (!prefs) return

    // Verificar se está em quiet hours
    if (isInQuietHours(prefs.quiet_hours_start, prefs.quiet_hours_end, prefs.timezone)) {
      return
    }

    // Determinar canais a usar
    const activeChannels = channels || getActiveChannels(type, prefs)

    // Enviar por cada canal
    const results = await Promise.all(
      activeChannels.map((channel) => sendByChannel(userId, type, subject, content, channel, prefs))
    )

    return results
  } catch (error: any) {
    logError('NotificationError', error.message, error.stack, {
      userId: options.userId,
    })
  }
}

// Enviar por canal específico
async function sendByChannel(
  userId: string,
  type: NotificationType,
  subject: string,
  content: string,
  channel: NotificationChannel,
  prefs: any
) {
  try {
    if (channel === 'email') {
      return await sendEmailNotification(userId, subject, content, type)
    } else if (channel === 'push') {
      return await sendPushNotification(userId, subject, content, type)
    } else if (channel === 'sms') {
      return await sendSMSNotification(userId, subject, content)
    }
  } catch (error: any) {
    logError('ChannelNotificationError', `Channel: ${channel} - ${error.message}`, error.stack, {
      userId,
    })
  }
}

// Email via SendGrid
async function sendEmailNotification(
  userId: string,
  subject: string,
  content: string,
  type: NotificationType
) {
  try {
    const { data: user } = await supabase.from('users').select('email').eq('id', userId).single()

    if (!user?.email) return

    // Template seleção
    const template = getEmailTemplate(type, content)

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: user.email }],
            dynamic_template_data: {
              subject,
              content,
              ...template.data,
            },
          },
        ],
        from: {
          email: 'notificacoes@radardevoz.com',
          name: 'Radar da Voz',
        },
        template_id: template.templateId,
      }),
    })

    if (!response.ok) throw new Error('SendGrid error')

    // Log
    await logNotification(userId, type, 'email', subject, content, user.email, 'sent')

    return { success: true, channel: 'email' }
  } catch (error: any) {
    logError('EmailNotificationError', error.message, error.stack, { userId })
    return { success: false, channel: 'email', error: error.message }
  }
}

// Push via OneSignal
async function sendPushNotification(
  userId: string,
  title: string,
  content: string,
  type: NotificationType
) {
  try {
    // Obter tokens do usuário
    const { data: tokens } = await supabase.from('push_tokens').select('token').eq('user_id', userId)

    if (!tokens?.length) return

    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Basic ${process.env.ONESIGNAL_AUTH_KEY}`,
      },
      body: JSON.stringify({
        app_id: process.env.ONESIGNAL_APP_ID,
        include_subscription_ids: tokens.map((t: any) => t.token),
        headings: { en: title },
        contents: { en: content },
        data: {
          notificationType: type,
        },
        ios_badgeType: 'Increase',
        ios_badgeCount: 1,
      }),
    })

    if (!response.ok) throw new Error('OneSignal error')

    // Log
    await logNotification(userId, type, 'push', title, content, tokens[0].token, 'sent')

    return { success: true, channel: 'push' }
  } catch (error: any) {
    logError('PushNotificationError', error.message, error.stack, { userId })
    return { success: false, channel: 'push', error: error.message }
  }
}

// SMS via Twilio
async function sendSMSNotification(userId: string, title: string, content: string) {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('phone_number')
      .eq('id', userId)
      .single()

    if (!user?.phone_number) return

    const response = await fetch('https://api.twilio.com/2010-04-01/Accounts/{ACCOUNT_SID}/Messages.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        From: process.env.TWILIO_PHONE_NUMBER || '',
        To: user.phone_number,
        Body: `${title}: ${content}`,
      }).toString(),
    })

    if (!response.ok) throw new Error('Twilio error')

    return { success: true, channel: 'sms' }
  } catch (error: any) {
    logError('SMSNotificationError', error.message, error.stack, { userId })
    return { success: false, channel: 'sms', error: error.message }
  }
}

// Verificar preferências ativas
function getActiveChannels(type: NotificationType, prefs: any): NotificationChannel[] {
  const channels: NotificationChannel[] = []

  const typeKey = `email_${type.replace('new_', '')}`
  if (prefs[typeKey]) channels.push('email')

  const pushKey = `push_${type.replace('new_', '')}`
  if (prefs[pushKey]) channels.push('push')

  if (prefs.sms_enabled) channels.push('sms')

  return channels
}

// Verificar quiet hours
function isInQuietHours(start?: string, end?: string, timezone?: string): boolean {
  if (!start || !end) return false

  // TODO: implementar lógica de quiet hours com timezone
  return false
}

// Templates de email
function getEmailTemplate(type: NotificationType, content: string) {
  const templates: Record<
    NotificationType,
    { templateId: string; data: Record<string, any> }
  > = {
    new_application: {
      templateId: 'd-123456789', // SendGrid template ID
      data: {
        type: 'Novo Candidato',
        icon: '📝',
      },
    },
    new_message: {
      templateId: 'd-987654321',
      data: {
        type: 'Nova Mensagem',
        icon: '💬',
      },
    },
    new_opportunity: {
      templateId: 'd-555666777',
      data: {
        type: 'Nova Oportunidade',
        icon: '✨',
      },
    },
    new_review: {
      templateId: 'd-888999000',
      data: {
        type: 'Nova Avaliação',
        icon: '⭐',
      },
    },
  }

  return templates[type] || templates.new_message
}

// Log de notificação
async function logNotification(
  userId: string,
  type: NotificationType,
  channel: NotificationChannel,
  subject: string,
  content: string,
  recipient: string,
  status: string
) {
  try {
    await supabase.from('notification_logs').insert({
      user_id: userId,
      notification_type: type,
      channel,
      subject,
      content,
      recipient,
      status,
      sent_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Failed to log notification:', error)
  }
}

// Registrar push token
export async function registerPushToken(
  userId: string,
  token: string,
  deviceType: 'web' | 'ios' | 'android',
  deviceName?: string
) {
  try {
    await supabase.from('push_tokens').upsert({
      user_id: userId,
      token,
      device_type: deviceType,
      device_name: deviceName,
    })
  } catch (error: any) {
    logError('PushTokenError', error.message, error.stack, { userId })
  }
}

// Obter preferências
export async function getNotificationPreferences(userId: string) {
  try {
    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code === 'PGRST116') {
      // Criar preferências padrão se não existir
      return await createNotificationPreferences(userId)
    }

    return data
  } catch (error: any) {
    logError('GetPreferencesError', error.message, error.stack, { userId })
    return null
  }
}

// Criar preferências padrão
async function createNotificationPreferences(userId: string) {
  try {
    const { data } = await supabase
      .from('notification_preferences')
      .insert({
        user_id: userId,
      })
      .select()
      .single()

    return data
  } catch (error: any) {
    logError('CreatePreferencesError', error.message, error.stack, { userId })
    return null
  }
}

// Atualizar preferências
export async function updateNotificationPreferences(userId: string, prefs: Partial<any>) {
  try {
    const { data } = await supabase
      .from('notification_preferences')
      .update(prefs)
      .eq('user_id', userId)
      .select()
      .single()

    return data
  } catch (error: any) {
    logError('UpdatePreferencesError', error.message, error.stack, { userId })
    return null
  }
}
