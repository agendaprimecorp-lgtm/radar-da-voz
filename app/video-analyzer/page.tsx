'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { VideoAnalysisResultComponent } from '@/components/video/video-analysis-result'
import { toast } from 'sonner'

export default function VideoAnalyzerPage() {
  const [videoUrl, setVideoUrl] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!videoUrl) {
      toast.error('Insira a URL do vídeo')
      return
    }

    setAnalyzing(true)
    try {
      const response = await fetch('/api/analyze/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          talent_id: 'TODO', // User ID
          video_url: videoUrl,
          video_type: 'performance',
        }),
      })

      if (!response.ok) throw new Error('Falha na análise')

      const data = await response.json()
      setResult(data.analysis)
      toast.success('Vídeo analisado com sucesso!')
    } catch (error: any) {
      toast.error(error.message || 'Erro ao analisar vídeo')
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Analisador de Vídeo</h1>
          <p className="text-dark-400">
            Envie seu vídeo e obtenha feedback automático sobre sua performance
          </p>
        </div>

        {!result ? (
          <div className="card space-y-6">
            <form onSubmit={handleAnalyze} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">URL do Vídeo</label>
                <Input
                  type="url"
                  placeholder="https://youtube.com/watch?v=... ou https://vimeo.com/..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  required
                />
                <p className="mt-2 text-xs text-dark-400">
                  ℹ️ Upload seu vídeo no YouTube ou Vimeo e cole o link aqui
                </p>
              </div>

              <Button
                type="submit"
                disabled={analyzing}
                className="w-full bg-primary-500"
              >
                {analyzing ? 'Analisando...' : '🎬 Analisar Vídeo'}
              </Button>
            </form>

            {/* Info Section */}
            <div className="bg-dark-800 p-6 rounded-lg border border-dark-700 space-y-4">
              <h3 className="font-semibold text-primary-300">O que Analisamos?</h3>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-dark-50">🎭 Carisma</p>
                  <p className="text-dark-400">Sua conexão com a câmera e capacidade de engajar</p>
                </div>

                <div>
                  <p className="font-semibold text-dark-50">🎬 Naturalidade</p>
                  <p className="text-dark-400">Quão natural e confortável você parece no vídeo</p>
                </div>

                <div>
                  <p className="font-semibold text-dark-50">⭐ Técnica</p>
                  <p className="text-dark-400">Qualidade técnica: iluminação, som, composição</p>
                </div>
              </div>

              <div className="pt-4 border-t border-dark-700">
                <p className="text-xs text-dark-500">
                  💡 Use o feedback para melhorar seus vídeos e aumentar suas chances de ser descoberto!
                </p>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-dark-800 p-6 rounded-lg border border-dark-700">
              <h3 className="font-semibold mb-3">Requisitos de Vídeo</h3>
              <ul className="text-sm text-dark-400 space-y-2">
                <li>✓ Duração: 15-30 segundos</li>
                <li>✓ Qualidade: HD (1080p mínimo)</li>
                <li>✓ Áudio claro e sem ruído</li>
                <li>✓ Bem iluminado</li>
                <li>✓ Contato visual com câmera</li>
                <li>✓ Expressão natural e engajante</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <VideoAnalysisResultComponent analysis={result} />

            <Button
              onClick={() => setResult(null)}
              variant="outline"
              className="w-full"
            >
              Analisar Outro Vídeo
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
