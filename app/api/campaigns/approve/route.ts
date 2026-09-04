import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { submission_id, approve } = body

    if (!submission_id) {
      return NextResponse.json({ error: 'Missing submission_id' }, { status: 400 })
    }

    const status = approve ? 'approved' : 'rejected'

    // Update submission status
    const { data: submission, error: updateError } = await supabase
      .from('campaign_submissions')
      .update({ status })
      .eq('id', submission_id)
      .select('*, influencer:users(id, email)')
      .single()

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 })
    }

    // Se aprovado, criar pagamento automático
    if (approve && submission.commission_amount) {
      try {
        // Criar transação de pagamento
        await supabase.from('transactions').insert({
          user_id: submission.influencer_id,
          type: 'commission',
          amount: submission.commission_amount,
          status: 'completed',
          payment_method: 'stripe',
          reference_id: submission_id,
          description: `Campaign commission for submission ${submission_id}`,
        })

        // TODO: Integrar com Stripe para pagamento real
        // Aqui seria: await stripe.transfers.create(...)
      } catch (paymentError) {
        console.error('Payment processing failed:', paymentError)
      }
    }

    return NextResponse.json(
      { submission, status, commission_amount: submission.commission_amount },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
