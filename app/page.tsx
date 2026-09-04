import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold">
            <span className="bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
              Radar da Voz
            </span>
          </h1>
          <p className="text-xl text-dark-300">
            Plataforma de economia de talentos - Descubra, analise e monetize seus dons
          </p>
        </div>

        {/* Features */}
        <div className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="card">
            <div className="mb-4 text-4xl">🎤</div>
            <h3 className="mb-2 text-lg font-semibold">Análise de Voz</h3>
            <p className="text-dark-400">
              Descubra o potencial da sua voz com análise automática e inteligente
            </p>
          </div>

          <div className="card">
            <div className="mb-4 text-4xl">📊</div>
            <h3 className="mb-2 text-lg font-semibold">Banco de Talentos</h3>
            <p className="text-dark-400">
              Conecte com produtoras, empresas e oportunidades profissionais
            </p>
          </div>

          <div className="card">
            <div className="mb-4 text-4xl">💰</div>
            <h3 className="mb-2 text-lg font-semibold">Monetização</h3>
            <p className="text-dark-400">
              Ganhe dinheiro com seus talentos através de múltiplas oportunidades
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center gap-4">
          <Link href="/auth/signup">
            <Button className="bg-primary-500 hover:bg-primary-600">
              Começar Agora
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="outline">Fazer Login</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
