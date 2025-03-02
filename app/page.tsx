'use client'

import { Box, Container, Flex, Heading, Text, Button } from '@chakra-ui/react'
import Link from 'next/link'

export default function Home() {
  return (
    <Container maxW="container.xl" py={10}>
      <Flex direction="column" align="center" textAlign="center" gap={6}>
        <Heading as="h1" size="2xl" mb={4}>
          API Usage Dashboard
        </Heading>
        <Text fontSize="xl" maxW="container.md" mb={6}>
          Manage your API usage, purchase credits, view your API keys, and monitor your requests.
        </Text>
        <Button 
          as={Link} 
          href="/dashboard" 
          size="lg" 
          colorScheme="blue" 
          px={8}
        >
          Go to Dashboard
        </Button>
      </Flex>
    </Container>
  )
}