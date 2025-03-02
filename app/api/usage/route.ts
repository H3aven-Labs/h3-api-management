import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // In a real app, you would fetch this data from your database
  // This is mock data for demonstration purposes
  
  const { searchParams } = new URL(request.url)
  const days = parseInt(searchParams.get('days') || '7')
  
  const usageData = generateMockUsageData(days)
  
  return NextResponse.json(usageData)
}

// Helper function to generate mock usage data
function generateMockUsageData(days: number) {
  const data = []
  const today = new Date()
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    data.push({
      date: date.toISOString().split('T')[0],
      requests: Math.floor(Math.random() * 200) + 50,
      successRate: 95 + Math.random() * 5,
      avgResponseTime: Math.floor(Math.random() * 100) + 50,
      credits: Math.floor(Math.random() * 200) + 50,
    })
  }
  
  // Calculate totals and averages
  const totalRequests = data.reduce((sum, day) => sum + day.requests, 0)
  const totalCredits = data.reduce((sum, day) => sum + day.credits, 0)
  const avgSuccessRate = data.reduce((sum, day) => sum + day.successRate, 0) / data.length
  const avgResponseTime = data.reduce((sum, day) => sum + day.avgResponseTime, 0) / data.length
  
  return {
    daily: data,
    summary: {
      totalRequests,
      totalCredits,
      avgSuccessRate,
      avgResponseTime
    }
  }
}