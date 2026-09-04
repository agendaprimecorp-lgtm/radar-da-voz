'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function PricingPage() {
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBilling, setSelectedBilling] = useState<'monthly' | 'annual'>('monthly')

  useEffect(() => {
    loadPlans()
  }, [])

  const loadPlans = async () => {
    try {
      const response = await fetch('/api/plans')
      if (!response.ok) throw new Error('Falha ao carregar planos')

      const data = await response.json()
      setPlans(data.plans || [])
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async (planType: string) => {
    try {
      const response = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planType,
          billingCycle: selectedBilling,
        }),
      })

      if (!response.ok) throw new Error('Erro ao criar subscription')

      const data = await response.json()
      // Redirecionar para Stripe checkout
      window.location.href = data.checkoutUrl
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 p-8 flex items-center justify-center">
        <p className="text-dark-400">Carregando planos...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">💳 Planos e Preços</h1>
          <p className="text-xl text-dark-400 mb-8">Escolha o plano perfeito para você</p>

          {/* Billing toggle */}
          <div className="flex justify-center gap-4 mb-12">
            <Button
              onClick={() => setSelectedBilling('monthly')}
              variant={selectedBilling === 'monthly' ? 'primary' : 'outline'}
              className={selectedBilling === 'monthly' ? 'bg-primary-500' : ''}
            >
              📅 Mensal
            </Button>
            <Button
              onClick={() => setSelectedBilling('annual')}
              variant={selectedBilling === 'annual' ? 'primary' : 'outline'}
              className={selectedBilling === 'annual' ? 'bg-primary-500' : ''}
            >
              ✨ Anual (economize 15%)
            </Button>
          </div>
        </div>

        {/* Planos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`card relative flex flex-col ${
                plan.plan_type === 'pro'
                  ? 'ring-2 ring-primary-500 md:scale-105'
                  : ''
              }`}
            >
              {plan.plan_type === 'pro' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Mais Popular
                </div>
              )}

              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-dark-400 text-sm mb-6">{plan.description}</p>

              {/* Preço */}
              <div className="mb-6">
                {plan.price_monthly === 0 ? (
                  <div>
                    <span className="text-4xl font-bold text-primary-500">Grátis</span>
                  </div>
                ) : (
                  <div>
                    <span className="text-4xl font-bold text-primary-500">
                      R$ {
                        selectedBilling === 'monthly'
                          ? plan.price_monthly
                          : plan.price_annual
                      }
                    </span>
                    <span className="text-dark-400 text-sm">
                      /{selectedBilling === 'monthly' ? 'mês' : 'ano'}
                    </span>
                  </div>
                )}
              </div>

              {/* Features */}
              <ul className="mb-8 flex-grow space-y-3 text-sm">
                {plan.features.map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-primary-500">✓</span>
                    <span className="text-dark-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Limites */}
              <div className="mb-6 p-4 bg-dark-800 rounded text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-dark-400">Vagas</span>
                  <span className="font-semibold">
                    {plan.max_job_postings === -1 ? '∞' : plan.max_job_postings}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-400">Campanhas</span>
                  <span className="font-semibold">
                    {plan.max_campaigns === -1 ? '∞' : plan.max_campaigns}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-400">Storage</span>
                  <span className="font-semibold">{plan.max_storage_gb}GB</span>
                </div>
              </div>

              {/* CTA */}
              {plan.plan_type === 'free' ? (
                <Link href="/auth/signup">
                  <Button variant="outline" className="w-full">
                    Começar Grátis
                  </Button>
                </Link>
              ) : plan.plan_type === 'enterprise' ? (
                <a href="mailto:sales@radardevoz.com">
                  <Button variant="outline" className="w-full">
                    Falar com Sales
                  </Button>
                </a>
              ) : (
                <Button
                  onClick={() => handleSubscribe(plan.plan_type)}
                  className="w-full bg-primary-500"
                >
                  Começar Teste Grátis
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-center mb-8">❓ Perguntas Frequentes</h2>

          <div className="card">
            <h4 className="font-semibold mb-2">Posso mudar de plano?</h4>
            <p className="text-dark-400 text-sm">
              Sim! Você pode fazer upgrade ou downgrade a qualquer momento. A mudança entra em
              vigor imediatamente.
            </p>
          </div>

          <div className="card">
            <h4 className="font-semibold mb-2">Há período de teste?</h4>
            <p className="text-dark-400 text-sm">
              Sim! Os planos Pro e Enterprise vêm com 7-14 dias de teste grátis. Cancelar é fácil
              a qualquer momento.
            </p>
          </div>

          <div className="card">
            <h4 className="font-semibold mb-2">Como funciona o pagamento?</h4>
            <p className="text-dark-400 text-sm">
              Usamos Stripe para processar pagamentos com segurança. Você pode pagar com cartão
              de crédito ou débito.
            </p>
          </div>

          <div className="card">
            <h4 className="font-semibold mb-2">Oferece reembolso?</h4>
            <p className="text-dark-400 text-sm">
              Oferecemos reembolso em 7 dias se não estiver satisfeito. Sem perguntas feitas.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
