import { NextRequest, NextResponse } from 'next/server'
import { validateAuth, createAuthResponse } from '@/app/api/auth/protected/route'
import { createReview, getUserReviews, getReviewSummary } from '@/lib/reviews'

// GET /api/reviews?userId=xxx - Obter reviews de um usuário
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!userId) {
      return createAuthResponse(400, { error: 'Missing userId' })
    }

    const reviews = await getUserReviews(userId, limit, offset)
    const summary = await getReviewSummary(userId)

    return createAuthResponse(200, { reviews, summary })
  } catch (error: any) {
    return createAuthResponse(500, { error: error.message })
  }
}

// POST /api/reviews - Criar review
export async function POST(request: NextRequest) {
  const { user, error: authError } = await validateAuth(request)

  if (authError || !user) {
    return createAuthResponse(401, { error: 'Unauthorized' })
  }

  try {
    const body = await request.json()
    const { reviewedId, rating, comment, categories } = body

    if (!reviewedId || !rating) {
      return createAuthResponse(400, { error: 'Missing reviewedId or rating' })
    }

    const review = await createReview(reviewedId, user.id, rating, comment, categories)

    return createAuthResponse(201, { review })
  } catch (error: any) {
    return createAuthResponse(500, { error: error.message })
  }
}
