'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { UserType } from '@/types'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const { user, session, isAuthenticated } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    }
    setLoading(false)
  }, [isAuthenticated, router])

  if (loading) return <div>Carregando...</div>

  return (
    <div className="min-h-screen bg-dark-900 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>

        {session && (
          <div className="card mb-8">
            <h2 className="mb-4 text-xl font-semibold">Bem-vindo!</h2>
            <p className="mb-4 text-dark-300">Email: {session.user.email}</p>
            <Button onClick={() => router.push('/')}>Voltar para Home</Button>
          </div>
        )}

        {/* Artista Dashboard */}
        {session?.user.user_metadata?.user_type === 'artist' && (
          <div className="space-y-6">
            <section>
              <h2 className="mb-4 text-2xl font-bold">Meus Áudios</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="card">
                  <Button className="w-full">Gravar Novo Áudio</Button>
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold">Minhas Candidaturas</h2>
              <div className="card">
                <p className="text-dark-400">Nenhuma candidatura ainda</p>
              </div>
            </section>
          </div>
        )}

        {/* Produtora Dashboard */}
        {session?.user.user_metadata?.user_type === 'producer' && (
          <div className="space-y-6">
            <section>
              <h2 className="mb-4 text-2xl font-bold">Minhas Vagas</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Button className="w-full">Criar Nova Vaga</Button>
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold">Candidatos</h2>
              <div className="card">
                <p className="text-dark-400">Nenhum candidato ainda</p>
              </div>
            </section>
          </div>
        )}

        {/* Empresa Dashboard */}
        {session?.user.user_metadata?.user_type === 'company' && (
          <div className="space-y-6">
            <section>
              <h2 className="mb-4 text-2xl font-bold">Minhas Campanhas</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Button className="w-full">Criar Nova Campanha</Button>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
