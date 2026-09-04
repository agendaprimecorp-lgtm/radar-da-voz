'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AudioRecorder } from '@/components/recorder/audio-recorder'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function RecorderPage() {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [recordingData, setRecordingData] = useState<{ blob: Blob; duration: number } | null>(null)

  const handleRecordingComplete = (blob: Blob, duration: number) => {
    setRecordingData({ blob, duration })
    toast.success('Áudio gravado com sucesso!')
  }

  const handleUpload = async () => {
    if (!recordingData) {
      toast.error('Nenhum áudio gravado')
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', recordingData.blob)
      formData.append('type', 'audio')
      // Você precisará obter o talent_id do usuário atual
      formData.append('talent_id', 'TODO')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload falhou')
      }

      const data = await response.json()
      toast.success('Áudio enviado para análise!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Erro ao enviar áudio')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold">Gravar Áudio</h1>

        <AudioRecorder onRecordingComplete={handleRecordingComplete} />

        {recordingData && (
          <div className="mt-8 card">
            <h2 className="mb-4 text-lg font-semibold">Áudio Gravado</h2>
            <audio
              controls
              className="mb-4 w-full"
              src={URL.createObjectURL(recordingData.blob)}
            />
            <div className="flex gap-4">
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                className="flex-1 bg-primary-500"
              >
                {isUploading ? 'Enviando...' : 'Enviar Áudio'}
              </Button>
              <Button
                onClick={() => setRecordingData(null)}
                variant="outline"
                className="flex-1"
              >
                Gravar Novamente
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
