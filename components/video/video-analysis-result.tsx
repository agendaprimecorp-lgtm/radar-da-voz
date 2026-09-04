'use client'

import { VideoAnalysisResult, getScoreColor, getScoreLabel } from '@/lib/video-analysis'

interface VideoAnalysisResultProps {
  analysis: VideoAnalysisResult
}

export function VideoAnalysisResultComponent({ analysis }: VideoAnalysisResultProps) {
  const scoreColor = getScoreColor(analysis.score_geral)
  const scoreLabel = getScoreLabel(analysis.score_geral)

  return (
    <div className="card space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-6">Resultado da Análise</h2>

        {/* Score Geral */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-32 w-32 items-center justify-center rounded-full border-4 border-primary-500 bg-dark-800">
            <div>
              <div className="text-4xl font-bold text-primary-500">
                {analysis.score_geral.toFixed(1)}
              </div>
              <div className="text-sm text-dark-400">/10</div>
            </div>
          </div>
          <h3 className="text-xl font-semibold">{scoreLabel}</h3>
          <p className="text-dark-400">Score Geral de Performance</p>
        </div>

        {/* Breakdown de Scores */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-dark-800 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold mb-2" style={{ color: getScoreColor(analysis.carisma) }}>
              {analysis.carisma.toFixed(1)}
            </div>
            <div className="text-sm font-semibold">Carisma</div>
            <div className="text-xs text-dark-500">Conexão com câmera</div>
          </div>

          <div className="bg-dark-800 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold mb-2" style={{ color: getScoreColor(analysis.naturalidade) }}>
              {analysis.naturalidade.toFixed(1)}
            </div>
            <div className="text-sm font-semibold">Naturalidade</div>
            <div className="text-xs text-dark-500">Comportamento</div>
          </div>

          <div className="bg-dark-800 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold mb-2" style={{ color: getScoreColor(analysis.tecnica) }}>
              {analysis.tecnica.toFixed(1)}
            </div>
            <div className="text-sm font-semibold">Técnica</div>
            <div className="text-xs text-dark-500">Qualidade</div>
          </div>
        </div>

        {/* Feedback */}
        <div>
          <h3 className="font-semibold mb-3">Feedback</h3>
          <ul className="space-y-2">
            {analysis.feedback.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2 text-dark-300">
                <span className="text-lg">{item.startsWith('✅') ? '✅' : '⚠️'}</span>
                <span>{item.replace(/^(✅|⚠️)\s*/, '')}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Duração */}
        <div className="mt-6 p-4 bg-dark-800 rounded-lg">
          <p className="text-sm text-dark-400">Duração do vídeo</p>
          <p className="text-lg font-semibold">{analysis.tempo_visto} segundos</p>
        </div>

        {/* Recomendações */}
        <div className="mt-6 p-4 bg-primary-900 rounded-lg border border-primary-700">
          <h4 className="font-semibold mb-2 text-primary-300">💡 Dica</h4>
          <p className="text-sm text-dark-300">
            {analysis.score_geral >= 8
              ? 'Parabéns! Seu vídeo está excelente. Pronto para ser descoberto por produtoras.'
              : analysis.score_geral >= 6
              ? 'Bom trabalho! Considere os feedbacks para melhorar ainda mais.'
              : 'Foco nos pontos de melhoria indicados acima e tente novamente.'}
          </p>
        </div>
      </div>
    </div>
  )
}
