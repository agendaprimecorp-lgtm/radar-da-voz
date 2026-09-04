'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface ReviewFormProps {
  reviewedId: string
  onSubmit: (data: any) => Promise<void>
}

export function ReviewForm({ reviewedId, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [categories, setCategories] = useState({
    communication: 3,
    professionalism: 3,
    quality: 3,
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!comment.trim()) {
      toast.error('Escreva um comentário')
      return
    }

    setSubmitting(true)
    try {
      await onSubmit({
        reviewedId,
        rating,
        comment,
        categories,
      })
      setComment('')
      setRating(5)
      setCategories({ communication: 3, professionalism: 3, quality: 3 })
      toast.success('Avaliação enviada!')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h3 className="font-semibold">Deixe uma Avaliação</h3>

      {/* Rating */}
      <div>
        <label className="text-sm font-semibold mb-2 block">Classificação Geral</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="text-2xl transition hover:scale-110"
            >
              <span className={star <= rating ? 'text-yellow-500' : 'text-dark-500'}>★</span>
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-semibold mb-1 block">Comunicação</label>
          <input
            type="range"
            min="1"
            max="5"
            value={categories.communication}
            onChange={(e) =>
              setCategories((prev) => ({
                ...prev,
                communication: parseInt(e.target.value),
              }))
            }
            className="w-full"
          />
          <span className="text-xs text-dark-400">{categories.communication}/5</span>
        </div>
        <div>
          <label className="text-xs font-semibold mb-1 block">Profissionalismo</label>
          <input
            type="range"
            min="1"
            max="5"
            value={categories.professionalism}
            onChange={(e) =>
              setCategories((prev) => ({
                ...prev,
                professionalism: parseInt(e.target.value),
              }))
            }
            className="w-full"
          />
          <span className="text-xs text-dark-400">{categories.professionalism}/5</span>
        </div>
        <div>
          <label className="text-xs font-semibold mb-1 block">Qualidade</label>
          <input
            type="range"
            min="1"
            max="5"
            value={categories.quality}
            onChange={(e) =>
              setCategories((prev) => ({
                ...prev,
                quality: parseInt(e.target.value),
              }))
            }
            className="w-full"
          />
          <span className="text-xs text-dark-400">{categories.quality}/5</span>
        </div>
      </div>

      {/* Comment */}
      <div>
        <label className="text-sm font-semibold mb-2 block">Comentário</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Compartilhe sua experiência..."
          maxLength={2000}
          rows={4}
          className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded text-dark-50 placeholder-dark-500 focus:border-primary-500 focus:outline-none resize-none"
        />
        <p className="text-xs text-dark-400 mt-1">{comment.length}/2000</p>
      </div>

      <Button type="submit" disabled={submitting} className="w-full bg-primary-500">
        {submitting ? 'Enviando...' : '📤 Enviar Avaliação'}
      </Button>
    </form>
  )
}
