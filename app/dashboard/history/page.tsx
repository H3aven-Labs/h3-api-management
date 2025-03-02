'use client'

import { useState } from 'react'
import {
  Box,
  Heading,
  Text,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Code,
  useColorModeValue
} from '@chakra-ui/react'
import { FiSearch, FiEye, FiDownload, FiFilter } from 'react-icons/fi'

// Generate mock request data
const generateMockRequests = (count: number) => {
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

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [methodFilter, setMethodFilter] = useState('all')
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  
  const { isOpen, onOpen, onClose } = useDisclosure()
  const tableBg = useColorModeValue('white', 'gray.800')
  
  // Generate mock data
  const allRequests = generateMockRequests(50)
  
  // Apply filters
  const filteredRequests = allRequests.filter(req => {
    const matchesSearch = 
      searchQuery === '' || 
      req.endpoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.id.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'success' && req.statusCode < 400) ||
      (statusFilter === 'error' && req.statusCode >= 400)
    
    const matchesMethod = 
      methodFilter === 'all' || 
      req.method === methodFilter
    
    return matchesSearch && matchesStatus && matchesMethod
  })
  
  const handleViewRequest = (request: any) => {
    setSelectedRequest(request)
    onOpen()
  }
  
  const getStatusColor = (statusCode: number) => {
    if (statusCode < 300) return 'green'
    if (statusCode < 400) return 'blue'
    if (statusCode < 500) return 'orange'
    return 'red'
  }
  
  return (
    <Box>
      <Heading mb={2}>Request History</Heading>
      <Text mb={6} color="gray.600">View and analyze your past API requests</Text>
      
      <Flex 
        direction={{ base: 'column', md: 'row' }} 
        gap={4} 
        mb={6}
        align={{ base: 'stretch', md: 'center' }}
      >
        <InputGroup maxW={{ md: '400px' }}>
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray.300" />
          </InputLeftElement>
          <Input 
            placeholder="Search by endpoint or request ID" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
        
        <Flex gap={4} flex="1">
          <Select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            maxW="150px"
            icon={<FiFilter />}
          >
            <option value="all">All Status</option>
            <option value="success">Success</option>
            <option value="error">Error</option>
          </Select>
          
          <Select 
            value={methodFilter} 
            onChange={(e) => setMethodFilter(e.target.value)}
            maxW="150px"
            icon={<FiFilter />}
          >
            <option value="all">All Methods</option>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </Select>
          
          <Button 
            leftIcon={<FiDownload />} 
            variant="outline"
            ml={{ md: 'auto' }}
          >
            Export
          </Button>
        </Flex>
      </Flex>
      
      <Box overflowX="auto" bg={tableBg} borderRadius="md" boxShadow="sm">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Timestamp</Th>
              <Th>Method</Th>
              <Th>Endpoint</Th>
              <Th>Status</Th>
              <Th>Duration</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredRequests.map((request) => (
              <Tr key={request.id}>
                <Td whiteSpace="nowrap">
                  {new Date(request.timestamp).toLocaleString()}
                </Td>
                <Td>
                  <Badge
                    colorScheme={
                      request.method === 'GET' ? 'blue' :
                      request.method === 'POST' ? 'green' :
                      request.method === 'PUT' ? 'orange' :
                      'red'
                    }
                  >
                    {request.method}
                  </Badge>
                </Td>
                <Td maxW="300px" isTruncated>{request.endpoint}</Td>
                <Td>
                  <Badge colorScheme={getStatusColor(request.statusCode)}>
                    {request.statusCode} {request.statusMessage}
                  </Badge>
                </Td>
                <Td>{request.duration} ms</Td>
                <Td>
                  <IconButton
                    aria-label="View request details"
                    icon={<FiEye />}
                    size="sm"
                    onClick={() => handleViewRequest(request)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      
      {/* Request Details Modal */}
      {selectedRequest && (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              Request Details
              <Text fontSize="sm" fontWeight="normal" mt={1}>
                {selectedRequest.id}
              </Text>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex mb={4} wrap="wrap" gap={2}>
                <Badge colorScheme={
                  selectedRequest.method === 'GET' ? 'blue' :
                  selectedRequest.method === 'POST' ? 'green' :
                  selectedRequest.method === 'PUT' ? 'orange' :
                  'red'
                }>
                  {selectedRequest.method}
                </Badge>
                <Badge colorScheme={getStatusColor(selectedRequest.statusCode)}>
                  {selectedRequest.statusCode} {selectedRequest.statusMessage}
                </Badge>
                <Badge colorScheme="purple">{selectedRequest.duration} ms</Badge>
                <Text ml="auto" fontSize="sm" color="gray.500">
                  {new Date(selectedRequest.timestamp).toLocaleString()}
                </Text>
              </Flex>
              
              <Text fontWeight="bold" mb={2}>Endpoint</Text>
              <Code p={2} mb={4} display="block">
                {selectedRequest.endpoint}
              </Code>
              
              <Heading size="sm" mb={2}>Request</Heading>
              <Box mb={4}>
                <Text fontWeight="bold" fontSize="sm">Headers</Text>
                <Code p={2} display="block" mb={2} fontSize="sm">
                  {JSON.stringify(selectedRequest.request.headers, null, 2)}
                </Code>
                
                {selectedRequest.request.body && (
                  <>
                    <Text fontWeight="bold" fontSize="sm">Body</Text>
                    <Code p={2} display="block" fontSize="sm">
                      {JSON.stringify(selectedRequest.request.body, null, 2)}
                    </Code>
                  </>
                )}
              </Box>
              
              <Heading size="sm" mb={2}>Response</Heading>
              <Box>
                <Text fontWeight="bold" fontSize="sm">Headers</Text>
                <Code p={2} display="block" mb={2} fontSize="sm">
                  {JSON.stringify(selectedRequest.response.headers, null, 2)}
                </Code>
                
                <Text fontWeight="bold" fontSize="sm">Body</Text>
                <Code p={2} display="block" fontSize="sm" maxH="300px" overflow="auto">
                  {JSON.stringify(selectedRequest.response.body, null, 2)}
                </Code>
              </Box>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button variant="outline">
                Download
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  )
}