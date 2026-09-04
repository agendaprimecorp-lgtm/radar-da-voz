'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface ReviewCardProps {
  reviewId: string
  reviewer: string
  rating: number
  comment: string
  categories: {
    communication: number
    professionalism: number
    quality: number
  }
  createdAt: string
  onVote?: (isHelpful: boolean) => void
}

export function ReviewCard({
  reviewId,
  reviewer,
  rating,
  comment,
  categories,
  createdAt,
  onVote,
}: ReviewCardProps) {
  const [voted, setVoted] = useState<boolean | null>(null)

  const handleVote = async (isHelpful: boolean) => {
    setVoted(isHelpful)
    if (onVote) onVote(isHelpful)
    toast.success(isHelpful ? 'Marcado como útil' : 'Marcado como não útil')
  }

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold">{reviewer}</h4>
          <p className="text-xs text-dark-400">
            {new Date(createdAt).toLocaleDateString('pt-BR')}
          </p>
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={i < rating ? 'text-yellow-500' : 'text-dark-500'}>
              ★
            </span>
          ))}
        </div>
      </div>

      {comment && <p className="text-dark-300 mb-4">{comment}</p>}

      {/* Categorias */}
      <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
        <div className="bg-dark-800 p-2 rounded text-center">
          <div className="font-semibold text-xs mb-1">Comunicação</div>
          <div className="text-primary-400">{categories.communication}/5</div>
        </div>
        <div className="bg-dark-800 p-2 rounded text-center">
          <div className="font-semibold text-xs mb-1">Profissionalismo</div>
          <div className="text-primary-400">{categories.professionalism}/5</div>
        </div>
        <div className="bg-dark-800 p-2 rounded text-center">
          <div className="font-semibold text-xs mb-1">Qualidade</div>
          <div className="text-primary-400">{categories.quality}/5</div>
        </div>
      </div>

      {/* Votos */}
      <div className="flex gap-2 text-xs">
        <Button
          onClick={() => handleVote(true)}
          variant={voted === true ? 'default' : 'outline'}
          size="sm"
          className="text-xs"
        >
          👍 Útil
        </Button>
        <Button
          onClick={() => handleVote(false)}
          variant={voted === false ? 'destructive' : 'outline'}
          size="sm"
          className="text-xs"
        >
          👎 Não útil
        </Button>
      </div>
    </div>
  )
}
