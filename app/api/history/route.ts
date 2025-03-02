import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // In a real app, you would fetch this data from your database
  // This is mock data for demonstration purposes
  
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '50')
  const method = searchParams.get('method')
  const status = searchParams.get('status')
  const search = searchParams.get('search')
  
  let requests = generateMockRequests(limit)
  
  // Apply filters if provided
  if (method && method !== 'all') {
    requests = requests.filter(req => req.method === method)
  }
  
  if (status) {
    if (status === 'success') {
      requests = requests.filter(req => req.statusCode < 400)
    } else if (status === 'error') {
      requests = requests.filter(req => req.statusCode >= 400)
    }
  }
  
  if (search) {
    const searchLower = search.toLowerCase()
    requests = requests.filter(req => 
      req.endpoint.toLowerCase().includes(searchLower) ||
      req.id.toLowerCase().includes(searchLower)
    )
  }
  
  return NextResponse.json({ requests })
}

// Helper function to generate mock request data
function generateMockRequests(count: number) {
  const endpoints = [
    '/api/data',
    '/api/users',
    '/api/products',
    '/api/orders',
    '/api/analytics'
  ]
  
  const methods = ['GET', 'POST', 'PUT', 'DELETE']
  const statusCodes = [
    { code: 200, message: 'OK' },
    { code: 201, message: 'Created' },
    { code: 400, message: 'Bad Request' },
    { code: 401, message: 'Unauthorized' },
    { code: 403, message: 'Forbidden' },
    { code: 404, message: 'Not Found' },
    { code: 500, message: 'Internal Server Error' }
  ]
  
  const requests = []
  const now = new Date()
  
  for (let i = 0; i < count; i++) {
    const date = new Date(now)
    date.setMinutes(date.getMinutes() - i * 30)
    
    const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)]
    const method = methods[Math.floor(Math.random() * methods.length)]
    const status = statusCodes[Math.floor(Math.random() * statusCodes.length)]
    const duration = Math.floor(Math.random() * 500) + 50
    
    requests.push({
      id: `req-${Date.now()}-${i}`,
      timestamp: date.toISOString(),
      endpoint: `${endpoint}/${Math.floor(Math.random() * 100)}`,
      method,
      statusCode: status.code,
      statusMessage: status.message,
      duration,
      request: {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk_test_...'
        },
        body: method !== 'GET' ? { 
          data: { 
            id: Math.floor(Math.random() * 1000),
            name: 'Test Data'
          } 
        } : null
      },
      response: {
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          success: status.code < 400,
          data: status.code < 400 ? {
            id: Math.floor(Math.random() * 1000),
            result: 'Some data here'
          } : null,
          error: status.code >= 400 ? {
            code: status.code,
            message: status.message
          } : null
        }
      }
    })
  }
  
  return requests
}