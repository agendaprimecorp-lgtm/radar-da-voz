'use client'

import { ReactNode } from 'react'

interface MobileOptimizedCardProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  title?: string
  action?: ReactNode
}

export function MobileOptimizedCard({
  children,
  onClick,
  className = '',
  title,
  action,
}: MobileOptimizedCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-dark-800 rounded-lg p-4 mb-4
        touch-manipulation
        active:bg-dark-700 transition-colors
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {title && (
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">{title}</h3>
          {action}
        </div>
      )}
      {children}
    </div>
  )
}
