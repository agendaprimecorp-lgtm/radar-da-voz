import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface Review {
  id: string
  reviewer_id: string
  reviewed_id: string
  rating: number
  comment: string
  categories: {
    communication: number
    professionalism: number
    quality: number
  }
  created_at: string
  reviewer?: { full_name: string }
}

export interface ReviewSummary {
  reviewed_id: string
  total_reviews: number
  avg_rating: number
  max_rating: number
  min_rating: number
  avg_communication: number
  avg_professionalism: number
  avg_quality: number
}

// Criar review
export async function createReview(
  reviewedId: string,
  reviewerId: string,
  rating: number,
  comment: string,
  categories: { communication: number; professionalism: number; quality: number }
) {
  if (rating < 1 || rating > 5) {
    throw new Error('Rating deve ser entre 1 e 5')
  }

  if (comment && comment.length > 2000) {
    throw new Error('Comentário não pode exceder 2000 caracteres')
  }

  const { data, error } = await supabase
    .from('reviews')
    .insert({
      reviewed_id: reviewedId,
      reviewer_id: reviewerId,
      rating,
      comment: comment?.substring(0, 2000),
      categories,
    })
    .select('*, reviewer:users(full_name)')
    .single()

  if (error) throw new Error(error.message)
  return data
}

// Obter reviews de um usuário
export async function getUserReviews(userId: string, limit = 20, offset = 0) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, reviewer:users(full_name)')
    .eq('reviewed_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw new Error(error.message)
  return data
}

// Obter sumário de ratings
export async function getReviewSummary(userId: string): Promise<ReviewSummary | null> {
  const { data, error } = await supabase
    .from('reviews_summary')
    .select('*')
    .eq('reviewed_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') {
    throw new Error(error.message)
  }

  return data || null
}

// Verificar se usuário já avaliou
export async function hasUserReviewed(reviewerId: string, reviewedId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('id')
    .eq('reviewer_id', reviewerId)
    .eq('reviewed_id', reviewedId)
    .single()

  if (error && error.code === 'PGRST116') {
    return false // Não encontrou
  }

  if (error) throw new Error(error.message)
  return !!data
}

// Marcar review como útil/não útil
export async function voteOnReview(reviewId: string, voterId: string, isHelpful: boolean) {
  const { data, error } = await supabase
    .from('review_votes')
    .insert({
      review_id: reviewId,
      voter_id: voterId,
      is_helpful: isHelpful,
    })
    .select()
    .single()

  if (error && error.code === '23505') {
    // Já votou, atualizar
    const { data: updated, error: updateError } = await supabase
      .from('review_votes')
      .update({ is_helpful: isHelpful })
      .eq('review_id', reviewId)
      .eq('voter_id', voterId)
      .select()
      .single()

    if (updateError) throw new Error(updateError.message)
    return updated
  }

  if (error) throw new Error(error.message)
  return data
}

// Obter contagem de votos úteis
export async function getReviewHelpfulness(reviewId: string) {
  const { data, error } = await supabase
    .from('review_votes')
    .select('is_helpful')
    .eq('review_id', reviewId)

  if (error) throw new Error(error.message)

  const helpful = data.filter((v: any) => v.is_helpful).length
  const notHelpful = data.filter((v: any) => !v.is_helpful).length

  return { helpful, notHelpful, total: data.length }
}

// Deletar review
export async function deleteReview(reviewId: string, reviewerId: string) {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId)
    .eq('reviewer_id', reviewerId)

  if (error) throw new Error(error.message)
}

// Atualizar review
export async function updateReview(
  reviewId: string,
  reviewerId: string,
  rating: number,
  comment: string,
  categories: { communication: number; professionalism: number; quality: number }
) {
  const { data, error } = await supabase
    .from('reviews')
    .update({
      rating,
      comment,
      categories,
      updated_at: new Date().toISOString(),
    })
    .eq('id', reviewId)
    .eq('reviewer_id', reviewerId)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}
