import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface TalentComparison {
  id: string
  name: string
  specialty: string
  rating: number
  city: string
  carisma: number
  naturalidade: number
  tecnica: number
  score_geral: number
  profileImage?: string
  videoUrl?: string
}

export interface ComparisonResult {
  talents: TalentComparison[]
  compatibilityScores: { [key: string]: number }
  recommendation: string
  winner: TalentComparison | null
}

// Buscar talentos para comparação
export async function getTalentsForComparison(filters: {
  specialty?: string
  city?: string
  minRating?: number
}) {
  let query = supabase
    .from('talents')
    .select(`
      id,
      user_id,
      specialty,
      bio,
      city,
      rating,
      users:users(id, full_name)
    `)

  if (filters.specialty) {
    query = query.eq('specialty', filters.specialty)
  }
  if (filters.city) {
    query = query.eq('city', filters.city)
  }
  if (filters.minRating) {
    query = query.gte('rating', filters.minRating)
  }

  const { data, error } = await query.limit(100)

  if (error) throw new Error(error.message)
  return data
}

// Obter análises de vídeo para talento
export async function getTalentAnalyses(talentId: string) {
  const { data, error } = await supabase
    .from('video_submissions')
    .select(`
      id,
      talent_id,
      video_url,
      analysis_score,
      created_at
    `)
    .eq('talent_id', talentId)
    .order('created_at', { ascending: false })
    .limit(5)

  if (error) throw new Error(error.message)
  return data
}

// Calcular score de compatibilidade entre talentos
export function calculateCompatibilityScore(
  talent1: TalentComparison,
  talent2: TalentComparison,
  jobRequirements?: {
    minCarisma?: number
    minNaturalidade?: number
    minTecnica?: number
  }
): { score: number; reason: string } {
  const weights = {
    carisma: 0.35,
    naturalidade: 0.35,
    tecnica: 0.30,
  }

  let score = 0
  let reasons: string[] = []

  // Comparar carisma
  const carismaScore = Math.min(talent1.carisma, talent2.carisma)
  if (jobRequirements?.minCarisma && carismaScore < jobRequirements.minCarisma) {
    reasons.push(`Carisma baixo (${carismaScore.toFixed(1)}/10)`)
  } else {
    score += carismaScore * weights.carisma
  }

  // Comparar naturalidade
  const naturalidadeScore = Math.min(talent1.naturalidade, talent2.naturalidade)
  if (jobRequirements?.minNaturalidade && naturalidadeScore < jobRequirements.minNaturalidade) {
    reasons.push(`Naturalidade baixa (${naturalidadeScore.toFixed(1)}/10)`)
  } else {
    score += naturalidadeScore * weights.naturalidade
  }

  // Comparar técnica
  const tecnicaScore = Math.min(talent1.tecnica, talent2.tecnica)
  if (jobRequirements?.minTecnica && tecnicaScore < jobRequirements.minTecnica) {
    reasons.push(`Técnica baixa (${tecnicaScore.toFixed(1)}/10)`)
  } else {
    score += tecnicaScore * weights.tecnica
  }

  // Bonus por diferença (diversity)
  const diferenca = Math.abs(talent1.score_geral - talent2.score_geral)
  if (diferenca > 2) {
    score += 1 // Bonus se talentos são bem diferentes
    reasons.push(`Diversidade: ${diferenca.toFixed(1)} pontos de diferença`)
  }

  const reason = reasons.length > 0 ? reasons.join(' | ') : 'Compatibilidade excelente'

  return { score: Math.min(score, 10), reason }
}

// Comparar múltiplos talentos
export async function compareMultipleTalents(
  talentIds: string[],
  jobRequirements?: {
    minCarisma?: number
    minNaturalidade?: number
    minTecnica?: number
  }
): Promise<ComparisonResult> {
  if (talentIds.length < 2) {
    throw new Error('Precisa de pelo menos 2 talentos para comparar')
  }

  // Buscar dados dos talentos
  const { data: talentsData, error } = await supabase
    .from('talents')
    .select(`
      id,
      user_id,
      specialty,
      city,
      rating,
      users:users(id, full_name)
    `)
    .in('user_id', talentIds)

  if (error) throw new Error(error.message)

  // Buscar análises de vídeo mais recentes
  const talents: TalentComparison[] = []

  for (const talent of talentsData) {
    const { data: analyses } = await supabase
      .from('video_submissions')
      .select('analysis_score')
      .eq('talent_id', talent.user_id)
      .order('created_at', { ascending: false })
      .limit(1)

    const analysis = analyses?.[0]?.analysis_score || {
      carisma: 5,
      naturalidade: 5,
      tecnica: 5,
      score_geral: 5,
    }

    talents.push({
      id: talent.user_id,
      name: talent.users?.[0]?.full_name || 'Desconhecido',
      specialty: talent.specialty,
      rating: talent.rating || 0,
      city: talent.city,
      carisma: analysis.carisma || 5,
      naturalidade: analysis.naturalidade || 5,
      tecnica: analysis.tecnica || 5,
      score_geral: analysis.score_geral || 5,
    })
  }

  // Calcular scores de compatibilidade
  const compatibilityScores: { [key: string]: number } = {}
  let highestScore = 0
  let bestTalent: TalentComparison | null = null

  for (const talent of talents) {
    let score = talent.score_geral

    if (jobRequirements) {
      if (
        (jobRequirements.minCarisma && talent.carisma < jobRequirements.minCarisma) ||
        (jobRequirements.minNaturalidade && talent.naturalidade < jobRequirements.minNaturalidade) ||
        (jobRequirements.minTecnica && talent.tecnica < jobRequirements.minTecnica)
      ) {
        score -= 2 // Penalidade se não atende requisitos
      }
    }

    compatibilityScores[talent.id] = Math.max(0, Math.min(10, score))

    if (score > highestScore) {
      highestScore = score
      bestTalent = talent
    }
  }

  // Gerar recomendação
  let recommendation = ''
  if (bestTalent) {
    if (highestScore >= 8) {
      recommendation = `${bestTalent.name} é a escolha perfeita! Score: ${highestScore.toFixed(1)}/10`
    } else if (highestScore >= 6) {
      recommendation = `${bestTalent.name} é uma boa opção. Score: ${highestScore.toFixed(1)}/10`
    } else {
      recommendation = `Nenhum talento atende perfeitamente os requisitos. Melhor opção: ${bestTalent.name}`
    }
  }

  return {
    talents,
    compatibilityScores,
    recommendation,
    winner: bestTalent,
  }
}
