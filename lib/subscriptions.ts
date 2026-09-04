import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

export type SubscriptionPlan = 'free' | 'pro' | 'enterprise'
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing'

export interface Plan {
  id: string
  name: string
  plan_type: SubscriptionPlan
  price_monthly: number
  price_annual: number | null
  max_job_postings: number
  max_campaigns: number
  features: string[]
}

export interface Subscription {
  id: string
  user_id: string
  plan_id: string
  status: SubscriptionStatus
  current_period_end: string
  billing_cycle: 'monthly' | 'annual'
}

// Obter planos
export async function getPlans(): Promise<Plan[]> {
  const { data, error } = await supabase.from('plans').select('*')

  if (error) throw new Error(error.message)
  return data || []
}

// Obter plano por tipo
export async function getPlanByType(planType: SubscriptionPlan): Promise<Plan | null> {
  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .eq('plan_type', planType)
    .single()

  if (error && error.code !== 'PGRST116') throw new Error(error.message)
  return data || null
}

// Obter subscription do usuário
export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') throw new Error(error.message)
  return data || null
}

// Criar subscription via Stripe
export async function createSubscription(
  userId: string,
  planType: SubscriptionPlan,
  billingCycle: 'monthly' | 'annual'
) {
  // 1. Obter plano
  const plan = await getPlanByType(planType)
  if (!plan) throw new Error('Plano não encontrado')

  // 2. Obter ou criar customer no Stripe
  const { data: userData } = await supabase
    .from('users')
    .select('email')
    .eq('id', userId)
    .single()

  if (!userData) throw new Error('Usuário não encontrado')

  let customerId: string
  const existing = await stripe.customers.list({ email: userData.email, limit: 1 })

  if (existing.data.length > 0) {
    customerId = existing.data[0].id
  } else {
    const customer = await stripe.customers.create({
      email: userData.email,
      metadata: { user_id: userId },
    })
    customerId = customer.id
  }

  // 3. Obter Stripe price ID (seria armazenado em variáveis de env)
  const priceId =
    billingCycle === 'monthly'
      ? process.env[`STRIPE_PRICE_${planType.toUpperCase()}_MONTHLY`]
      : process.env[`STRIPE_PRICE_${planType.toUpperCase()}_ANNUAL`]

  if (!priceId) throw new Error('Preço não configurado')

  // 4. Criar subscription no Stripe
  const stripeSubscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    trial_period_days: plan.trial_days,
    payment_behavior: 'default_incomplete',
    payment_settings: {
      save_default_payment_method: 'on_subscription',
    },
  })

  // 5. Salvar no banco de dados
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .insert({
      user_id: userId,
      plan_id: plan.id,
      status: plan.trial_days > 0 ? 'trialing' : 'active',
      stripe_subscription_id: stripeSubscription.id,
      stripe_customer_id: customerId,
      current_period_start: new Date(stripeSubscription.current_period_start * 1000),
      current_period_end: new Date(stripeSubscription.current_period_end * 1000),
      trial_end: stripeSubscription.trial_end
        ? new Date(stripeSubscription.trial_end * 1000)
        : null,
      billing_cycle: billingCycle,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return subscription
}

// Cancelar subscription
export async function cancelSubscription(userId: string) {
  // 1. Obter subscription
  const subscription = await getUserSubscription(userId)
  if (!subscription) throw new Error('Nenhuma subscription encontrada')

  // 2. Cancelar no Stripe
  await stripe.subscriptions.del(subscription.stripe_subscription_id)

  // 3. Atualizar no banco
  const { data, error } = await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      canceled_at: new Date(),
      auto_renew: false,
    })
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

// Upgradar plano
export async function upgradeSubscription(
  userId: string,
  newPlanType: SubscriptionPlan,
  billingCycle: 'monthly' | 'annual'
) {
  // 1. Cancelar subscription atual
  const currentSubscription = await getUserSubscription(userId)
  if (!currentSubscription) throw new Error('Nenhuma subscription encontrada')

  // 2. Criar nova subscription
  const newSubscription = await createSubscription(userId, newPlanType, billingCycle)

  // 3. Cancelar a antiga no Stripe
  if (currentSubscription.stripe_subscription_id) {
    await stripe.subscriptions.del(currentSubscription.stripe_subscription_id)
  }

  return newSubscription
}

// Verificar limite de features
export async function checkFeatureLimit(
  userId: string,
  feature: 'job_postings' | 'campaigns'
): Promise<boolean> {
  // 1. Obter subscription
  const subscription = await getUserSubscription(userId)
  if (!subscription) return false

  // 2. Obter plano
  const { data: plan } = await supabase
    .from('plans')
    .select('*')
    .eq('id', subscription.plan_id)
    .single()

  if (!plan) return false

  // 3. Contar uso atual
  const table = feature === 'job_postings' ? 'job_postings' : 'ad_campaigns'
  const { count } = await supabase
    .from(table)
    .select('*', { count: 'exact' })
    .eq('company_id', userId)

  // 4. Verificar limite
  const fieldName = feature === 'job_postings' ? 'max_job_postings' : 'max_campaigns'
  const limit = plan[fieldName]

  // -1 significa ilimitado
  if (limit === -1) return true
  return (count || 0) < limit
}
