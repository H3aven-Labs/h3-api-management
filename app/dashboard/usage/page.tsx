'use client'

import { useState } from 'react'
import {
  Box,
  Heading,
  Text,
  Flex,
  Select,
  Card,
  CardBody,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue
} from '@chakra-ui/react'

// Mock data - in a real app, this would come from your API
const generateMockData = (days: number) => {
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
  
  return data
}

export default function UsagePage() {
  const [timeRange, setTimeRange] = useState('7')
  const cardBg = useColorModeValue('white', 'gray.800')
  
  // Generate mock data based on selected time range
  const usageData = generateMockData(parseInt(timeRange))
  
  // Calculate totals and averages
  const totalRequests = usageData.reduce((sum, day) => sum + day.requests, 0)
  const totalCredits = usageData.reduce((sum, day) => sum + day.credits, 0)
  const avgSuccessRate = usageData.reduce((sum, day) => sum + day.successRate, 0) / usageData.length
  const avgResponseTime = usageData.reduce((sum, day) => sum + day.avgResponseTime, 0) / usageData.length
  
  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading mb={2}>Usage Statistics</Heading>
          <Text color="gray.600">Monitor your API usage and performance metrics</Text>
        </Box>
        <Select 
          width="200px" 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="7">Last 7 days</option>
          <option value="14">Last 14 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </Select>
      </Flex>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <StatLabel>Total Requests</StatLabel>
              <StatNumber>{totalRequests.toLocaleString()}</StatNumber>
              <StatHelpText>Last {timeRange} days</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <StatLabel>Credits Used</StatLabel>
              <StatNumber>{totalCredits.toLocaleString()}</StatNumber>
              <StatHelpText>Last {timeRange} days</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <StatLabel>Success Rate</StatLabel>
              <StatNumber>{avgSuccessRate.toFixed(2)}%</StatNumber>
              <StatHelpText>Average over period</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <StatLabel>Avg Response Time</StatLabel>
              <StatNumber>{avgResponseTime.toFixed(0)} ms</StatNumber>
              <StatHelpText>Average over period</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>
      
      <Card bg={cardBg} mb={8}>
        <CardBody>
          <Heading size="md" mb={4}>Daily Usage Breakdown</Heading>
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Date</Th>
                  <Th isNumeric>Requests</Th>
                  <Th isNumeric>Credits Used</Th>
                  <Th isNumeric>Success Rate</Th>
                  <Th isNumeric>Avg Response Time</Th>
                </Tr>
              </Thead>
              <Tbody>
                {usageData.map((day) => (
                  <Tr key={day.date}>
                    <Td>{day.date}</Td>
                    <Td isNumeric>{day.requests.toLocaleString()}</Td>
                    <Td isNumeric>{day.credits.toLocaleString()}</Td>
                    <Td isNumeric>{day.successRate.toFixed(2)}%</Td>
                    <Td isNumeric>{day.avgResponseTime} ms</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </CardBody>
      </Card>
      
      <Card bg={cardBg}>
        <CardBody>
          <Heading size="md" mb={4}>Usage Tips</Heading>
          <Text mb={3}>
            Based on your usage patterns, here are some recommendations to optimize your API usage:
          </Text>
          <Divider my={3} />
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <Box>
              <Text fontWeight="bold">Implement Caching</Text>
              <Text fontSize="sm">
                Consider caching frequently accessed data to reduce API calls and save credits.
              </Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Batch Requests</Text>
              <Text fontSize="sm">
                Use batch endpoints to combine multiple operations into a single API call.
              </Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Optimize Query Parameters</Text>
              <Text fontSize="sm">
                Only request the data you need by using field selection and filtering.
              </Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Monitor Rate Limits</Text>
              <Text fontSize="sm">
                Stay within rate limits to avoid throttling and ensure consistent performance.
              </Text>
            </Box>
          </SimpleGrid>
        </CardBody>
      </Card>
    </Box>
  )
}