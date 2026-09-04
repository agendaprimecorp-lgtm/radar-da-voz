import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
})

export async function createPaymentIntent(
  amount: number,
  currency: string = 'brl',
  metadata?: Record<string, string>
) {
  return stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    automatic_payment_methods: { enabled: true },
    metadata,
  })
}

export async function createSubscription(
  customerId: string,
  priceId: string,
  metadata?: Record<string, string>
) {
  return stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    metadata,
  })
}

export async function getCustomer(customerId: string) {
  return stripe.customers.retrieve(customerId)
}

export async function createCustomer(email: string, name?: string) {
  return stripe.customers.create({
    email,
    name,
  })
}

export async function cancelSubscription(subscriptionId: string) {
  return stripe.subscriptions.cancel(subscriptionId)
}
