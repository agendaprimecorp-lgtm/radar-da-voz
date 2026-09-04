'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { UserType } from '@/types'
import { toast } from 'sonner'

export default function SignUpPage() {
  const router = useRouter()
  const { signUp } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    userType: 'artist' as UserType,
    city: '',
    state: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não correspondem')
      return
    }

    if (formData.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setLoading(true)
    try {
      await signUp(
        formData.email,
        formData.password,
        formData.name,
        formData.userType,
        formData.city,
        formData.state
      )

      toast.success('Conta criada! Verifique seu email.')
      router.push('/auth/login')
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card">
          <h1 className="mb-6 text-2xl font-bold text-center">Criar Conta</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              type="text"
              name="name"
              placeholder="Nome completo"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              required
            >
              <option value="">Selecione seu tipo</option>
              <option value="artist">Artista</option>
              <option value="producer">Produtora</option>
              <option value="company">Empresa</option>
              <option value="influencer">Influenciador</option>
              <option value="band">Banda</option>
              <option value="tv_radio">TV/Rádio</option>
            </Select>

            <div className="grid grid-cols-2 gap-2">
              <Input
                type="text"
                name="city"
                placeholder="Cidade"
                value={formData.city}
                onChange={handleChange}
              />
              <Input
                type="text"
                name="state"
                placeholder="Estado"
                value={formData.state}
                onChange={handleChange}
              />
            </div>

            <Input
              type="password"
              name="password"
              placeholder="Senha"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirme a senha"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Criando...' : 'Criar Conta'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-dark-400">
            Já tem conta?{' '}
            <Link href="/auth/login" className="text-primary-500 hover:underline">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
