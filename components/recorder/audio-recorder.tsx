'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob, duration: number) => void
  maxDuration?: number
}

export function AudioRecorder({ onRecordingComplete, maxDuration = 30 }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [duration, setDuration] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
        onRecordingComplete(audioBlob, duration)
        setDuration(0)
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)

      timerRef.current = setInterval(() => {
        setDuration(prev => {
          if (prev >= maxDuration - 1) {
            stopRecording()
            return prev
          }
          return prev + 1
        })
      }, 1000)
    } catch (error) {
      toast.error('Erro ao acessar microfone')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="card space-y-4">
      <div className="text-center">
        <div className="mb-4 text-4xl font-bold text-primary-500">
          {formatTime(duration)}
        </div>
        <div className="mb-4 flex justify-center gap-2">
          {isRecording ? (
            <Button onClick={stopRecording} variant="destructive">
              ⏹ Parar Gravação
            </Button>
          ) : (
            <Button onClick={startRecording} className="bg-primary-500">
              ● Iniciar Gravação
            </Button>
          )}
        </div>
        <p className="text-sm text-dark-400">
          Máximo {maxDuration} segundos
        </p>
      </div>
    </div>
  )
}
