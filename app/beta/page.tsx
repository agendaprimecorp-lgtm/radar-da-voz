'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function BetaPage() {
  const [testResults, setTestResults] = useState<any>(null)
  const [running, setRunning] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const testAccounts = [
    { email: 'empresa@test.com', password: 'Teste123!', type: 'Empresa' },
    { email: 'artista1@test.com', password: 'Teste123!', type: 'Artista' },
    { email: 'artista2@test.com', password: 'Teste123!', type: 'Artista' },
    { email: 'produtor@test.com', password: 'Teste123!', type: 'Produtor' },
    { email: 'influencer@test.com', password: 'Teste123!', type: 'Influencer' },
  ]

  const handleTestLogin = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      return true
    } catch {
      return false
    }
  }

  const handleRunTests = async () => {
    setRunning(true)
    const results: any = {
      timestamp: new Date().toISOString(),
      tests: [],
    }

    for (const account of testAccounts) {
      const success = await handleTestLogin(account.email, account.password)
      results.tests.push({
        type: account.type,
        email: account.email,
        status: success ? '✅' : '❌',
      })
    }

    setTestResults(results)
    setRunning(false)
    toast.success('Testes completados!')
  }

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) {
      toast.error('Digite seu feedback')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/beta/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback }),
      })

      if (!response.ok) throw new Error('Erro ao enviar feedback')

      toast.success('Obrigado pelo feedback! 🎉')
      setFeedback('')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🚀 Beta Program - Radar da Voz</h1>
          <p className="text-dark-400">Bem-vindo ao programa beta! Ajude-nos a testar a plataforma.</p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card">
            <p className="text-2xl font-bold text-primary-500">5</p>
            <p className="text-sm text-dark-400">Contas de Teste</p>
          </div>
          <div className="card">
            <p className="text-2xl font-bold text-primary-500">1</p>
            <p className="text-sm text-dark-400">Vaga Publicada</p>
          </div>
          <div className="card">
            <p className="text-2xl font-bold text-primary-500">1</p>
            <p className="text-sm text-dark-400">Campanha Ativa</p>
          </div>
        </div>

        {/* Test Accounts */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">👤 Contas de Teste</h2>
          <div className="space-y-3 mb-6">
            {testAccounts.map((account, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-dark-800 rounded border border-dark-700"
              >
                <div>
                  <p className="font-semibold text-sm">{account.type}</p>
                  <p className="text-xs text-dark-400">{account.email}</p>
                  <p className="text-xs text-dark-500">Senha: Teste123!</p>
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={handleRunTests}
            disabled={running}
            className="w-full bg-primary-500"
          >
            {running ? '⏳ Testando...' : '🧪 Testar Todos os Logins'}
          </Button>
        </div>

        {/* Test Results */}
        {testResults && (
          <div className="card mb-8">
            <h2 className="text-xl font-semibold mb-4">📊 Resultados dos Testes</h2>
            <div className="space-y-2">
              {testResults.tests.map((test: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-dark-800 rounded">
                  <span>{test.type}</span>
                  <span className="text-xl">{test.status}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-dark-400">
              Testado em: {new Date(testResults.timestamp).toLocaleString()}
            </p>
          </div>
        )}

        {/* Feature Checklist */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">✅ Funcionalidades para Testar</h2>
          <div className="space-y-2 text-sm">
            <label className="flex items-center gap-2 cursor-pointer hover:bg-dark-800 p-2 rounded">
              <input type="checkbox" className="cursor-pointer" defaultChecked disabled />
              <span>Login com múltiplos tipos de usuário</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:bg-dark-800 p-2 rounded">
              <input type="checkbox" className="cursor-pointer" />
              <span>Dashboard por tipo de usuário</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:bg-dark-800 p-2 rounded">
              <input type="checkbox" className="cursor-pointer" />
              <span>Visualizar vagas disponíveis</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:bg-dark-800 p-2 rounded">
              <input type="checkbox" className="cursor-pointer" />
              <span>Candidatar-se a vaga</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:bg-dark-800 p-2 rounded">
              <input type="checkbox" className="cursor-pointer" />
              <span>Visualizar campanhas</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:bg-dark-800 p-2 rounded">
              <input type="checkbox" className="cursor-pointer" />
              <span>Submeter vídeo para campanha</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:bg-dark-800 p-2 rounded">
              <input type="checkbox" className="cursor-pointer" />
              <span>Análise de vídeo automática</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:bg-dark-800 p-2 rounded">
              <input type="checkbox" className="cursor-pointer" />
              <span>Exportar dados (LGPD)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:bg-dark-800 p-2 rounded">
              <input type="checkbox" className="cursor-pointer" />
              <span>Deletar conta (LGPD)</span>
            </label>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">💬 Seu Feedback</h2>
          <p className="text-dark-400 text-sm mb-4">
            Encontrou um bug? Tem sugestão? Não gostou de algo? Conte-nos!
          </p>

          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Descreva seu feedback, bugs encontrados ou sugestões..."
            className="w-full h-32 px-4 py-3 bg-dark-800 border border-dark-700 rounded text-dark-50 placeholder-dark-500 focus:border-primary-500 focus:outline-none resize-none"
          />

          <div className="mt-4 flex gap-2">
            <Button
              onClick={handleSubmitFeedback}
              disabled={submitting || !feedback.trim()}
              className="flex-1 bg-primary-500"
            >
              {submitting ? 'Enviando...' : '📤 Enviar Feedback'}
            </Button>
            <Button
              onClick={() => setFeedback('')}
              variant="outline"
              className="flex-1"
            >
              Limpar
            </Button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-8 p-6 bg-primary-900 border border-primary-700 rounded-lg">
          <p className="text-primary-300 text-sm">
            <strong>💡 Dica:</strong> Use as contas de teste acima para experimentar diferentes perspectivas da
            plataforma. Tente criar uma vaga, candidatar-se, submeter vídeos e testar todas as features!
          </p>
        </div>
      </div>
    </div>
  )
}
