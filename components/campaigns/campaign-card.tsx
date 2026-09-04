'use client'

import { AdCampaign } from '@/types'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

interface CampaignCardProps {
  campaign: AdCampaign
  showApply?: boolean
}

export function CampaignCard({ campaign, showApply = true }: CampaignCardProps) {
  const daysLeft = campaign.deadline
    ? Math.ceil(
        (new Date(campaign.deadline).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null

  return (
    <div className="card">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">{campaign.title}</h3>
          <p className="text-sm text-dark-400">{campaign.company?.name}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary-500">
            {formatCurrency(campaign.budget)}
          </div>
          {daysLeft !== null && (
            <p className="text-xs text-dark-500">
              {daysLeft > 0 ? `${daysLeft} dias restantes` : 'Expirado'}
            </p>
          )}
        </div>
      </div>

      <p className="mb-4 line-clamp-3 text-dark-300">{campaign.brief}</p>

      <div className="mb-4 flex flex-wrap gap-2">
        {campaign.target_region && (
          <span className="rounded-full bg-dark-700 px-3 py-1 text-xs">
            📍 {campaign.target_region}
          </span>
        )}
        <span className="rounded-full bg-primary-900 px-3 py-1 text-xs text-primary-300">
          💰 {formatCurrency(campaign.budget * 0.2)} para você
        </span>
      </div>

      <div className="flex gap-2">
        <Link href={`/campaigns/${campaign.id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            Ver Detalhes
          </Button>
        </Link>
        {showApply && (
          <Button className="flex-1 bg-primary-500">Candidatar-se</Button>
        )}
      </div>
    </div>
  )
}
