import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// Initialize Stripe with your secret key
// In production, you would use an environment variable
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_your_key', {
  apiVersion: '2023-08-16',
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { priceId, credits } = body

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${credits} API Credits`,
              description: `Purchase of ${credits} API credits for making API requests`,
            },
            unit_amount: body.amount * 100, // amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard/credits?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard/credits?canceled=true`,
      metadata: {
        credits: credits.toString(),
        userId: 'user_123', // In a real app, this would be the authenticated user's ID
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}