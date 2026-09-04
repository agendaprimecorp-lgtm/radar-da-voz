'use client'

interface MetricsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: string
  trend?: number
  color?: 'primary' | 'green' | 'blue' | 'orange'
}

export function MetricsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'primary',
}: MetricsCardProps) {
  const colorClass = {
    primary: 'text-primary-500',
    green: 'text-green-500',
    blue: 'text-blue-500',
    orange: 'text-orange-500',
  }[color]

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-dark-400 text-sm">{title}</p>
          <p className={`text-3xl font-bold ${colorClass} mt-1`}>{value}</p>
          {subtitle && <p className="text-xs text-dark-500 mt-1">{subtitle}</p>}
        </div>
        {icon && <span className="text-3xl">{icon}</span>}
      </div>

      {trend !== undefined && (
        <div
          className={`text-xs ${
            trend > 0 ? 'text-green-400' : trend < 0 ? 'text-red-400' : 'text-dark-400'
          }`}
        >
          {trend > 0 ? '📈' : trend < 0 ? '📉' : '→'} {Math.abs(trend)}% vs semana passada
        </div>
      )}
    </div>
  )
}
