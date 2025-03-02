import { NextResponse } from 'next/server'
import crypto from 'crypto'

// In a real application, you would store API keys in a database
// This is a simplified example for demonstration purposes
const apiKeys = new Map()

export async function GET(request: Request) {
  // In a real app, you would authenticate the user and return their API keys
  return NextResponse.json({
    keys: Array.from(apiKeys.values())
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name } = body

    if (!name) {
      return NextResponse.json(
        { error: 'API key name is required' },
        { status: 400 }
      )
    }

    // Generate a new API key
    const key = `sk_${crypto.randomBytes(24).toString('hex')}`
    const id = crypto.randomBytes(16).toString('hex')
    
    const apiKey = {
      id,
      name,
      key,
      created: new Date().toISOString(),
      lastUsed: null,
      status: 'active'
    }

    // In a real app, you would save this to a database
    apiKeys.set(id, apiKey)

    return NextResponse.json({ apiKey })
  } catch (error) {
    console.error('Error creating API key:', error)
    return NextResponse.json(
      { error: 'Failed to create API key' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'API key ID is required' },
        { status: 400 }
      )
    }

    // In a real app, you would mark the key as revoked in your database
    if (apiKeys.has(id)) {
      const key = apiKeys.get(id)
      key.status = 'inactive'
      apiKeys.set(id, key)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error revoking API key:', error)
    return NextResponse.json(
      { error: 'Failed to revoke API key' },
      { status: 500 }
    )
  }
}