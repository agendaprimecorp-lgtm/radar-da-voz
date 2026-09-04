import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface ErrorLog {
  id: string
  error_type: string
  message: string
  stack_trace?: string
  user_id?: string
  endpoint?: string
  status_code?: number
  environment: 'production' | 'staging' | 'development'
  created_at: string
}

export interface PerformanceMetric {
  id: string
  endpoint: string
  method: string
  response_time_ms: number
  status_code: number
  user_count?: number
  created_at: string
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down'
  uptime_percentage: number
  avg_response_time: number
  error_rate: number
  active_users: number
  last_check: string
}

// Log de erro
export async function logError(
  errorType: string,
  message: string,
  stackTrace?: string,
  context?: {
    userId?: string
    endpoint?: string
    statusCode?: number
  }
) {
  try {
    await supabase.from('error_logs').insert({
      error_type: errorType,
      message: message.substring(0, 1000),
      stack_trace: stackTrace?.substring(0, 5000),
      user_id: context?.userId,
      endpoint: context?.endpoint,
      status_code: context?.statusCode,
      environment: process.env.NODE_ENV || 'development',
      severity: getSeverity(errorType),
    })

    // Enviar alerta se crítico
    if (getSeverity(errorType) === 'critical') {
      await sendAlert('CRITICAL_ERROR', {
        error: errorType,
        message,
        endpoint: context?.endpoint,
      })
    }
  } catch (error) {
    console.error('Failed to log error:', error)
  }
}

// Log de performance
export async function logPerformance(
  endpoint: string,
  method: string,
  responseTimeMs: number,
  statusCode: number
) {
  try {
    await supabase.from('performance_logs').insert({
      endpoint,
      method,
      response_time_ms: responseTimeMs,
      status_code: statusCode,
      created_at: new Date().toISOString(),
    })

    // Alerta se muito lento (>5s)
    if (responseTimeMs > 5000) {
      await sendAlert('SLOW_ENDPOINT', {
        endpoint,
        responseTime: responseTimeMs,
      })
    }
  } catch (error) {
    console.error('Failed to log performance:', error)
  }
}

// Obter status de saúde do sistema
export async function getSystemHealth(): Promise<SystemHealth> {
  try {
    // Últimas 24h
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    // Total de requests
    const { data: perfLogs } = await supabase
      .from('performance_logs')
      .select('response_time_ms, status_code')
      .gte('created_at', oneDayAgo)

    // Erros
    const { data: errors } = await supabase
      .from('error_logs')
      .select('id')
      .gte('created_at', oneDayAgo)

    const totalRequests = perfLogs?.length || 0
    const errorCount = errors?.length || 0
    const avgResponseTime =
      perfLogs && perfLogs.length > 0
        ? perfLogs.reduce((sum: number, log: any) => sum + log.response_time_ms, 0) /
          perfLogs.length
        : 0

    const uptime = totalRequests > 0 ? ((totalRequests - errorCount) / totalRequests) * 100 : 100
    const errorRate = totalRequests > 0 ? (errorCount / totalRequests) * 100 : 0

    return {
      status:
        errorRate > 10 ? 'down' : errorRate > 5 ? 'degraded' : 'healthy',
      uptime_percentage: Math.round(uptime * 100) / 100,
      avg_response_time: Math.round(avgResponseTime),
      error_rate: Math.round(errorRate * 100) / 100,
      active_users: 0, // Would get from analytics
      last_check: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Failed to get system health:', error)
    return {
      status: 'degraded',
      uptime_percentage: 0,
      avg_response_time: 0,
      error_rate: 100,
      active_users: 0,
      last_check: new Date().toISOString(),
    }
  }
}

// Enviar alerta (integração com Slack/Email)
export async function sendAlert(alertType: string, data: any) {
  try {
    // Integração com Slack (seria configurado via webhook)
    const slackWebhook = process.env.SLACK_WEBHOOK_URL

    if (slackWebhook) {
      await fetch(slackWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `🚨 Alert: ${alertType}`,
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*${alertType}*\n${JSON.stringify(data, null, 2)}`,
              },
            },
          ],
        }),
      })
    }

    // Integração com email (seria configurado via SendGrid/Resend)
    const emailWebhook = process.env.EMAIL_WEBHOOK_URL
    if (emailWebhook) {
      await fetch(emailWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: process.env.ALERT_EMAIL,
          subject: `[ALERT] ${alertType}`,
          html: `<h2>${alertType}</h2><pre>${JSON.stringify(data, null, 2)}</pre>`,
        }),
      })
    }
  } catch (error) {
    console.error('Failed to send alert:', error)
  }
}

// Obter erros recentes
export async function getRecentErrors(limit: number = 20): Promise<ErrorLog[]> {
  try {
    const { data, error } = await supabase
      .from('error_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw new Error(error.message)
    return data || []
  } catch (error) {
    console.error('Failed to get recent errors:', error)
    return []
  }
}

// Obter performance metrics
export async function getPerformanceMetrics(hours: number = 24): Promise<PerformanceMetric[]> {
  try {
    const timeAgo = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()

    const { data, error } = await supabase
      .from('performance_logs')
      .select('*')
      .gte('created_at', timeAgo)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  } catch (error) {
    console.error('Failed to get performance metrics:', error)
    return []
  }
}

function getSeverity(errorType: string): 'critical' | 'error' | 'warning' {
  if (
    errorType.includes('Database') ||
    errorType.includes('Authentication') ||
    errorType.includes('500')
  ) {
    return 'critical'
  }
  if (errorType.includes('400') || errorType.includes('Validation')) {
    return 'error'
  }
  return 'warning'
}
