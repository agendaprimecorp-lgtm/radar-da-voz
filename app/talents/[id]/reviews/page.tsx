'use client'

import { useState, useEffect } from 'react'
import { ReviewForm } from '@/components/reviews/review-form'
import { ReviewCard } from '@/components/reviews/review-card'
import { toast } from 'sonner'

export default function TalentReviewsPage({ params }: { params: { id: string } }) {
  const [reviews, setReviews] = useState<any[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [hasReviewed, setHasReviewed] = useState(false)

  useEffect(() => {
    loadReviews()
  }, [params.id])

  const loadReviews = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/reviews?userId=${params.id}`)
      if (!response.ok) throw new Error('Falha ao carregar reviews')

      const data = await response.json()
      setReviews(data.reviews || [])
      setSummary(data.summary)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async (reviewData: any) => {
    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Erro ao enviar avaliação')
    }

    await loadReviews()
    setHasReviewed(true)
  }

  return (
    <div className="min-h-screen bg-dark-900 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-2">⭐ Avaliações</h1>
        <p className="text-dark-400 mb-8">Veja o que outras pessoas acham deste talento</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar com Sumário */}
          <div className="space-y-4">
            {summary ? (
              <>
                {/* Rating Geral */}
                <div className="card text-center">
                  <div className="text-4xl font-bold text-primary-500 mb-2">
                    {summary.avg_rating || 0}
                  </div>
                  <div className="flex justify-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={
                          i < Math.round(summary.avg_rating || 0)
                            ? 'text-yellow-500'
                            : 'text-dark-500'
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-dark-400">{summary.total_reviews || 0} avaliações</p>
                </div>

                {/* Categorias */}
                <div className="card space-y-2">
                  <h3 className="font-semibold text-sm mb-3">Médias por Categoria</h3>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Comunicação</span>
                      <span className="text-primary-400">{summary.avg_communication || 0}/5</span>
                    </div>
                    <div className="w-full bg-dark-700 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full"
                        style={{
                          width: `${((summary.avg_communication || 0) / 5) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Profissionalismo</span>
                      <span className="text-primary-400">{summary.avg_professionalism || 0}/5</span>
                    </div>
                    <div className="w-full bg-dark-700 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full"
                        style={{
                          width: `${((summary.avg_professionalism || 0) / 5) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Qualidade</span>
                      <span className="text-primary-400">{summary.avg_quality || 0}/5</span>
                    </div>
                    <div className="w-full bg-dark-700 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full"
                        style={{ width: `${((summary.avg_quality || 0) / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="card text-center text-dark-400">
                <p>Nenhuma avaliação ainda</p>
              </div>
            )}

            {!hasReviewed && (
              <ReviewForm reviewedId={params.id} onSubmit={handleSubmitReview} />
            )}
          </div>

          {/* Reviews */}
          <div className="md:col-span-2 space-y-4">
            {loading ? (
              <div className="text-center text-dark-400">Carregando...</div>
            ) : reviews.length === 0 ? (
              <div className="card text-center text-dark-400">
                <p>Nenhuma avaliação ainda. Seja o primeiro a avaliar!</p>
              </div>
            ) : (
              reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  reviewId={review.id}
                  reviewer={review.reviewer?.full_name || 'Anônimo'}
                  rating={review.rating}
                  comment={review.comment}
                  categories={review.categories}
                  createdAt={review.created_at}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
