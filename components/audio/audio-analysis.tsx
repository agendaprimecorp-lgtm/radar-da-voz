'use client'

import { useEffect, useRef } from 'react'

interface AudioAnalysisProps {
  audioUrl: string
}

export function AudioAnalysis({ audioUrl }: AudioAnalysisProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 2048

    audioContextRef.current = audioContext
    analyserRef.current = analyser

    const audio = new Audio(audioUrl)
    const source = audioContext.createMediaElementAudioSource(audio)
    source.connect(analyser)
    analyser.connect(audioContext.destination)

    audio.play()

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      requestAnimationFrame(draw)

      analyser.getByteFrequencyData(dataArray)

      ctx.fillStyle = 'rgb(31, 41, 55)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const barWidth = (canvas.width / bufferLength) * 2.5
      let barHeight
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height

        ctx.fillStyle = `rgb(159, 215, 0)`
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)

        x += barWidth + 1
      }
    }

    draw()
  }, [audioUrl])

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={100}
      className="w-full rounded-lg border border-dark-700"
    />
  )
}
