import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_your_key', {
  apiVersion: '2023-08-16',
})

// This is your Stripe webhook secret for testing your endpoint locally
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_your_webhook_secret'

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    // Retrieve the credits from the metadata
    const credits = session.metadata?.credits
    const userId = session.metadata?.userId

    if (credits && userId) {
      // In a real application, you would:
      // 1. Verify the payment status
      // 2. Add the credits to the user's account in your database
      console.log(`Adding ${credits} credits to user ${userId}`)
      
      // Here you would update your database
      // Example: await db.users.update({ id: userId }, { $inc: { credits: parseInt(credits) } })
    }
  }

  return NextResponse.json({ received: true })
}