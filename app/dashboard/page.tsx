'use client'

import { 
  Box, 
  Flex, 
  Heading, 
  Text, 
  Stat, 
  StatLabel, 
  StatNumber, 
  StatHelpText, 
  SimpleGrid, 
  Card, 
  CardBody,
  Progress,
  Button,
  Icon,
  useColorModeValue
} from '@chakra-ui/react'
import { FiCreditCard, FiKey, FiActivity, FiList } from 'react-icons/fi'
import Link from 'next/link'

export default function Dashboard() {
  // Mock data - in a real app, this would come from your API
  const credits = 750
  const totalCredits = 1000
  const apiKeys = 2
  const requestsToday = 145
  const requestsThisMonth = 3267

  const cardBg = useColorModeValue('white', 'gray.800')
  
  return (
    <Box>
      <Heading mb={6}>Dashboard Overview</Heading>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <Flex align="center" mb={2}>
                <Icon as={FiCreditCard} mr={2} color="blue.500" />
                <StatLabel>Credits Balance</StatLabel>
              </Flex>
              <StatNumber>{credits}</StatNumber>
              <Progress value={(credits / totalCredits) * 100} colorScheme="blue" mt={2} />
              <StatHelpText>{Math.round((credits / totalCredits) * 100)}% of total</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <Flex align="center" mb={2}>
                <Icon as={FiKey} mr={2} color="purple.500" />
                <StatLabel>Active API Keys</StatLabel>
              </Flex>
              <StatNumber>{apiKeys}</StatNumber>
              <StatHelpText>Manage your API keys</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <Flex align="center" mb={2}>
                <Icon as={FiActivity} mr={2} color="green.500" />
                <StatLabel>Requests Today</StatLabel>
              </Flex>
              <StatNumber>{requestsToday}</StatNumber>
              <StatHelpText>API calls in the last 24h</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <Flex align="center" mb={2}>
                <Icon as={FiList} mr={2} color="orange.500" />
                <StatLabel>Monthly Usage</StatLabel>
              </Flex>
              <StatNumber>{requestsThisMonth}</StatNumber>
              <StatHelpText>API calls this month</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>
      
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <Card bg={cardBg}>
          <CardBody>
            <Heading size="md" mb={4}>Quick Actions</Heading>
            <Flex direction="column" gap={3}>
              <Button as={Link} href="/dashboard/credits" colorScheme="blue" leftIcon={<Icon as={FiCreditCard} />}>
                Buy More Credits
              </Button>
              <Button as={Link} href="/dashboard/api-keys" colorScheme="purple" leftIcon={<Icon as={FiKey} />}>
                Manage API Keys
              </Button>
              <Button as={Link} href="/dashboard/usage" colorScheme="green" leftIcon={<Icon as={FiActivity} />}>
                View Usage Statistics
              </Button>
              <Button as={Link} href="/dashboard/history" colorScheme="orange" leftIcon={<Icon as={FiList} />}>
                View Request History
              </Button>
            </Flex>
          </CardBody>
        </Card>
        
        <Card bg={cardBg}>
          <CardBody>
            <Heading size="md" mb={4}>Recent Activity</Heading>
            <Flex direction="column" gap={4}>
              {[1, 2, 3].map((i) => (
                <Box key={i} p={3} borderWidth="1px" borderRadius="md">
                  <Text fontWeight="bold">API Request #{Math.floor(Math.random() * 10000)}</Text>
                  <Text fontSize="sm" color="gray.500">{new Date(Date.now() - i * 3600000).toLocaleString()}</Text>
                  <Text mt={1}>GET /api/data/{Math.floor(Math.random() * 100)}</Text>
                  <Text fontSize="sm" color="green.500">Status: 200 OK</Text>
                </Box>
              ))}
              <Button as={Link} href="/dashboard/history" variant="outline" size="sm" alignSelf="flex-end">
                View All Activity
              </Button>
            </Flex>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  )
}