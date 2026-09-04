// Simulação de análise de vídeo com Google Cloud Video Intelligence
// Em produção, integrar com Google Cloud Vision API

export interface VideoAnalysisResult {
  carisma: number; // 0-10
  naturalidade: number; // 0-10
  tecnica: number; // 0-10
  score_geral: number; // 0-10
  tempo_visto: number; // segundos
  feedback: string[];
}

export async function analyzeVideo(videoUrl: string): Promise<VideoAnalysisResult> {
  try {
    // Simulação local enquanto não tem Google Cloud configurado
    // Em produção: await callGoogleCloudVideoIntelligence(videoUrl)

    const result: VideoAnalysisResult = {
      carisma: Math.floor(Math.random() * 10) + 1,
      naturalidade: Math.floor(Math.random() * 10) + 1,
      tecnica: Math.floor(Math.random() * 10) + 1,
      score_geral: Math.floor(Math.random() * 10) + 1,
      tempo_visto: Math.floor(Math.random() * 30) + 5,
      feedback: generateFeedback(),
    }

    return result
  } catch (error) {
    throw new Error('Falha ao analisar vídeo')
  }
}

function generateFeedback(): string[] {
  const feedbackOptions = [
    '✅ Contato visual constante com câmera',
    '✅ Expressão facial natural e engajante',
    '✅ Voz clara e sem pausas longas',
    '✅ Gestos naturais e apropriados',
    '✅ Composição e iluminação adequadas',
    '⚠️ Considere melhorar iluminação',
    '⚠️ Fale mais devagar para melhor entendimento',
    '⚠️ Aumente contato visual com câmera',
  ]

  return feedbackOptions.sort(() => Math.random() - 0.5).slice(0, 3)
}

export function getScoreColor(score: number): string {
  if (score >= 8) return '#9fd700' // primary-500
  if (score >= 6) return '#4b5563' // dark-600
  if (score >= 4) return '#9ca3af' // dark-400
  return '#6b7280' // dark-500
}

export function getScoreLabel(score: number): string {
  if (score >= 8) return 'Excelente'
  if (score >= 6) return 'Bom'
  if (score >= 4) return 'Satisfatório'
  return 'Precisa melhorar'
}
