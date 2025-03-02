import { NextResponse } from 'next/server'

// In a real application, you would store this in a database
let userCredits = 750

export async function GET(request: Request) {
  // In a real app, you would authenticate the user and return their credit balance
  return NextResponse.json({ credits: userCredits })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount } = body

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid credit amount' },
        { status: 400 }
      )
    }

    // In a real app, you would update the user's credit balance in your database
    userCredits += amount

    return NextResponse.json({ 
      success: true,
      credits: userCredits
    })
  } catch (error) {
    console.error('Error adding credits:', error)
    return NextResponse.json(
      { error: 'Failed to add credits' },
      { status: 500 }
    )
  }
}