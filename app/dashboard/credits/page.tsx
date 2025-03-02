'use client'

import { useState } from 'react'
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Flex,
  Badge,
  Divider,
  useToast,
  useColorModeValue
} from '@chakra-ui/react'

// Mock function to simulate Stripe checkout
// In a real app, this would call your API endpoint that creates a Stripe checkout session
const initiateStripeCheckout = async (amount: number, credits: number) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // In a real app, this would redirect to Stripe checkout
  return {
    success: true,
    message: `Redirecting to Stripe checkout for $${amount}...`
  }
}

interface CreditPackage {
  id: string
  name: string
  credits: number
  price: number
  popular?: boolean
}

export default function CreditsPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const toast = useToast()
  const cardBg = useColorModeValue('white', 'gray.800')
  
  // Mock data - in a real app, this would come from your API
  const currentCredits = 750
  const creditPackages: CreditPackage[] = [
    { id: 'basic', name: 'Basic', credits: 1000, price: 10 },
    { id: 'pro', name: 'Professional', credits: 5000, price: 45, popular: true },
    { id: 'business', name: 'Business', credits: 20000, price: 160 },
    { id: 'enterprise', name: 'Enterprise', credits: 100000, price: 700 }
  ]
  
  const handlePurchase = async (pkg: CreditPackage) => {
    setIsLoading(pkg.id)
    try {
      const result = await initiateStripeCheckout(pkg.price, pkg.credits)
      if (result.success) {
        toast({
          title: 'Redirecting to checkout',
          description: result.message,
          status: 'info',
          duration: 5000,
          isClosable: true,
        })
        // In a real app, this would redirect to Stripe
        console.log('Redirecting to Stripe...')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to initiate checkout. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(null)
    }
  }
  
  return (
    <Box>
      <Heading mb={2}>Buy API Credits</Heading>
      <Text mb={6} color="gray.600">Purchase credits to make API requests based on your needs</Text>
      
      <Card bg={cardBg} mb={8}>
        <CardBody>
          <Stat>
            <StatLabel fontSize="lg">Current Credit Balance</StatLabel>
            <StatNumber fontSize="4xl">{currentCredits}</StatNumber>
            <StatHelpText>Each API request consumes 1 credit</StatHelpText>
          </Stat>
        </CardBody>
      </Card>
      
      <Heading size="md" mb={4}>Select a Credit Package</Heading>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        {creditPackages.map((pkg) => (
          <Card 
            key={pkg.id} 
            bg={cardBg}
            borderWidth={pkg.popular ? '2px' : '1px'}
            borderColor={pkg.popular ? 'blue.400' : 'gray.200'}
            position="relative"
          >
            {pkg.popular && (
              <Badge 
                colorScheme="blue" 
                position="absolute" 
                top="-10px" 
                right="50%" 
                transform="translateX(50%)"
                px={3}
                py={1}
                borderRadius="full"
              >
                Most Popular
              </Badge>
            )}
            
            <CardHeader pb={0}>
              <Heading size="md">{pkg.name}</Heading>
            </CardHeader>
            
            <CardBody>
              <Flex direction="column" gap={2}>
                <Text fontSize="3xl" fontWeight="bold">
                  ${pkg.price}
                </Text>
                <Text>
                  {pkg.credits.toLocaleString()} credits
                </Text>
                <Text fontSize="sm" color="gray.500">
                  ${(pkg.price / pkg.credits * 1000).toFixed(2)} per 1,000 requests
                </Text>
              </Flex>
            </CardBody>
            
            <Divider />
            
            <CardFooter>
              <Button 
                colorScheme="blue" 
                width="full"
                isLoading={isLoading === pkg.id}
                onClick={() => handlePurchase(pkg)}
              >
                Purchase
              </Button>
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>
      
      <Box mt={8} p={4} borderWidth="1px" borderRadius="md" bg={cardBg}>
        <Heading size="sm" mb={2}>Need a Custom Package?</Heading>
        <Text mb={4}>Contact our sales team for volume discounts and custom pricing options.</Text>
        <Button colorScheme="gray">Contact Sales</Button>
      </Box>
    </Box>
  )
}