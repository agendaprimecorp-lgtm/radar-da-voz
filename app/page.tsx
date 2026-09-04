'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-dark-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-dark-900/80 backdrop-blur border-b border-dark-700 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎤</span>
            <span className="font-bold text-primary-500">Radar da Voz</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-dark-300 hover:text-white transition">
              Features
            </a>
            <a href="#como-funciona" className="text-dark-300 hover:text-white transition">
              Como Funciona
            </a>
            <a href="#precos" className="text-dark-300 hover:text-white transition">
              Preços
            </a>
            <Link href="/auth/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-primary-500">Começar</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Descubra Talentos.
            <br />
            <span className="text-primary-500">Monetize Seu Potencial.</span>
          </h1>
          <p className="text-xl text-dark-400 mb-8 max-w-2xl mx-auto">
            A plataforma completa para artistas, produtores e empresas. Conecte, colabore e cresça
            no universo criativo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth/signup">
              <Button className="bg-primary-500 px-8 py-6 text-lg h-auto">
                🚀 Começar Agora (Grátis)
              </Button>
            </Link>
            <a href="#features">
              <Button variant="outline" className="px-8 py-6 text-lg h-auto">
                📖 Saber Mais
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-purple-600/20 blur-3xl"></div>
            <div className="relative bg-dark-800 rounded-xl border border-primary-500/20 p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-dark-700 rounded-lg">
                  <p className="text-2xl font-bold text-primary-500">1000+</p>
                  <p className="text-sm text-dark-400">Talentos</p>
                </div>
                <div className="p-4 bg-dark-700 rounded-lg">
                  <p className="text-2xl font-bold text-primary-500">500K+</p>
                  <p className="text-sm text-dark-400">Em Pagamentos</p>
                </div>
                <div className="p-4 bg-dark-700 rounded-lg">
                  <p className="text-2xl font-bold text-primary-500">50+</p>
                  <p className="text-sm text-dark-400">Empresas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Tudo que você precisa em um só lugar
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card">
              <div className="text-4xl mb-4">🎭</div>
              <h3 className="text-xl font-bold mb-3">Banco de Talentos</h3>
              <p className="text-dark-400">
                Descubra artistas filtrados por especialidade, cidade e rating
              </p>
            </div>

            <div className="card">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-xl font-bold mb-3">Vagas Criativas</h3>
              <p className="text-dark-400">
                Publique oportunidades e gerencie candidaturas em um dashboard
              </p>
            </div>

            <div className="card">
              <div className="text-4xl mb-4">📺</div>
              <h3 className="text-xl font-bold mb-3">Campanhas</h3>
              <p className="text-dark-400">
                Influenciadores ganham comissões em campanhas comerciais
              </p>
            </div>

            <div className="card">
              <div className="text-4xl mb-4">🎬</div>
              <h3 className="text-xl font-bold mb-3">Análise de Vídeo</h3>
              <p className="text-dark-400">
                AI analisa carisma, naturalidade e técnica automaticamente
              </p>
            </div>

            <div className="card">
              <div className="text-4xl mb-4">🎙️</div>
              <h3 className="text-xl font-bold mb-3">Análise de Áudio</h3>
              <p className="text-dark-400">
                Avalie qualidade, tom e técnica vocal com feedback automático
              </p>
            </div>

            <div className="card">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold mb-3">Mensagens</h3>
              <p className="text-dark-400">
                Converse com produtores, empresas e talentos em tempo real
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Como Funciona</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Crie sua Conta</h3>
              <p className="text-dark-400">
                Escolha seu tipo: Artista, Produtor, Empresa, Influencer ou Band
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Conecte-se</h3>
              <p className="text-dark-400">
                Explore talentos, publique vagas ou participe de campanhas
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Ganhe</h3>
              <p className="text-dark-400">
                Receba pagamentos via Pix ou Stripe sem taxas abusivas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-900 to-purple-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Pronto para começar?</h2>
          <p className="text-xl text-dark-200 mb-8">
            Junte-se aos talentos que já estão crescendo no Radar da Voz.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button className="bg-white text-dark-900 px-8 py-6 text-lg h-auto hover:bg-gray-100">
                🚀 Começar Agora
              </Button>
            </Link>
            <Link href="/beta">
              <Button variant="outline" className="px-8 py-6 text-lg h-auto border-white text-white">
                📧 Testar Beta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-800 border-t border-dark-700 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-sm text-dark-400">
            <p>© 2026 Radar da Voz. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
