'use client'

import { useState } from 'react'
import {
  Box,
  Heading,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Flex,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useToast,
  useClipboard,
  Code,
  useColorModeValue
} from '@chakra-ui/react'
import { FiCopy, FiEye, FiEyeOff, FiTrash2, FiRefreshCw } from 'react-icons/fi'

interface ApiKey {
  id: string
  name: string
  key: string
  created: string
  lastUsed: string | null
  status: 'active' | 'inactive'
}

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Production API Key',
      key: 'sk_prod_2023abcdefghijklmnopqrstuvwxyz',
      created: '2023-08-15T10:30:00Z',
      lastUsed: '2023-09-01T14:22:10Z',
      status: 'active'
    },
    {
      id: '2',
      name: 'Development API Key',
      key: 'sk_dev_2023zyxwvutsrqponmlkjihgfedcba',
      created: '2023-08-20T15:45:00Z',
      lastUsed: null,
      status: 'active'
    }
  ])
  
  const [newKeyName, setNewKeyName] = useState('')
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({})
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null)
  
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { 
    isOpen: isCreateOpen, 
    onOpen: onCreateOpen, 
    onClose: onCreateClose 
  } = useDisclosure()
  
  const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null)
  const toast = useToast()
  
  const { hasCopied, onCopy } = useClipboard(newlyCreatedKey || '')
  const tableBg = useColorModeValue('white', 'gray.800')
  
  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }
  
  const handleCreateKey = () => {
    if (!newKeyName.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a name for your API key',
        status: 'error',
        duration: 3000,
      })
      return
    }
    
    // Generate a mock API key
    const newKey = `sk_${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}`
    
    const newApiKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: newKey,
      created: new Date().toISOString(),
      lastUsed: null,
      status: 'active'
    }
    
    setApiKeys(prev => [...prev, newApiKey])
    setNewlyCreatedKey(newKey)
    setNewKeyName('')
    onCreateClose()
    
    // Open the modal to show the newly created key
    onOpen()
    
    toast({
      title: 'API Key Created',
      description: 'Your new API key has been created successfully',
      status: 'success',
      duration: 5000,
    })
  }
  
  const handleRevokeKey = (key: ApiKey) => {
    setSelectedKey(key)
    onOpen()
  }
  
  const confirmRevokeKey = () => {
    if (selectedKey) {
      setApiKeys(prev => 
        prev.map(key => 
          key.id === selectedKey.id 
            ? { ...key, status: 'inactive' } 
            : key
        )
      )
      
      toast({
        title: 'API Key Revoked',
        description: `The API key "${selectedKey.name}" has been revoked`,
        status: 'info',
        duration: 5000,
      })
      
      onClose()
      setSelectedKey(null)
    }
  }
  
  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading mb={2}>API Keys</Heading>
          <Text color="gray.600">Manage your API keys for authentication</Text>
        </Box>
        <Button colorScheme="blue" onClick={onCreateOpen}>
          Create New API Key
        </Button>
      </Flex>
      
      <Box overflowX="auto" bg={tableBg} borderRadius="md" boxShadow="sm">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>API Key</Th>
              <Th>Created</Th>
              <Th>Last Used</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {apiKeys.map(key => (
              <Tr key={key.id}>
                <Td fontWeight="medium">{key.name}</Td>
                <Td>
                  <Flex align="center">
                    <Code maxW="260px" isTruncated>
                      {visibleKeys[key.id] ? key.key : '••••••••••••••••••••••••••••••••'}
                    </Code>
                    <IconButton
                      aria-label={visibleKeys[key.id] ? 'Hide API key' : 'Show API key'}
                      icon={visibleKeys[key.id] ? <FiEyeOff /> : <FiEye />}
                      size="sm"
                      variant="ghost"
                      ml={2}
                      onClick={() => toggleKeyVisibility(key.id)}
                    />
                    <IconButton
                      aria-label="Copy API key"
                      icon={<FiCopy />}
                      size="sm"
                      variant="ghost"
                      ml={1}
                      onClick={() => {
                        navigator.clipboard.writeText(key.key)
                        toast({
                          title: 'Copied',
                          description: 'API key copied to clipboard',
                          status: 'success',
                          duration: 2000,
                        })
                      }}
                    />
                  </Flex>
                </Td>
                <Td>{new Date(key.created).toLocaleDateString()}</Td>
                <Td>
                  {key.lastUsed 
                    ? new Date(key.lastUsed).toLocaleDateString() 
                    : 'Never used'}
                </Td>
                <Td>
                  <Badge 
                    colorScheme={key.status === 'active' ? 'green' : 'red'}
                    borderRadius="full"
                    px={2}
                    py={1}
                  >
                    {key.status}
                  </Badge>
                </Td>
                <Td>
                  <Flex>
                    {key.status === 'active' ? (
                      <IconButton
                        aria-label="Revoke API key"
                        icon={<FiTrash2 />}
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleRevokeKey(key)}
                      />
                    ) : (
                      <IconButton
                        aria-label="Regenerate API key"
                        icon={<FiRefreshCw />}
                        colorScheme="blue"
                        variant="ghost"
                        onClick={() => {
                          toast({
                            title: 'Not Implemented',
                            description: 'Key regeneration would be implemented here',
                            status: 'info',
                            duration: 3000,
                          })
                        }}
                      />
                    )}
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      
      {/* Create New API Key Modal */}
      <Modal isOpen={isCreateOpen} onClose={onCreateClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New API Key</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>API Key Name</FormLabel>
              <Input 
                placeholder="e.g., Production API Key" 
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
            </FormControl>
            <Text mt={4} fontSize="sm" color="gray.500">
              This will generate a new API key for authenticating requests to our API.
              Make sure to copy your API key as it will only be shown once.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCreateClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleCreateKey}>
              Create API Key
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Revoke API Key Confirmation Modal */}
      {selectedKey && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Revoke API Key</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>
                Are you sure you want to revoke the API key &quot;{selectedKey.name}&quot;?
              </Text>
              <Text mt={2} fontWeight="bold" color="red.500">
                This action cannot be undone and any applications using this key will stop working.
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmRevokeKey}>
                Revoke Key
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      
      {/* Show New API Key Modal */}
      {newlyCreatedKey && (
        <Modal 
          isOpen={isOpen} 
          onClose={() => {
            onClose()
            setNewlyCreatedKey(null)
          }}
          closeOnOverlayClick={false}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Your New API Key</ModalHeader>
            <ModalBody>
              <Text mb={4} fontWeight="bold" color="orange.500">
                Make sure to copy your API key now. You won&apos;t be able to see it again!
              </Text>
              <Box 
                p={3} 
                bg="gray.50" 
                borderRadius="md" 
                borderWidth="1px" 
                fontFamily="mono"
                mb={4}
                position="relative"
              >
                {newlyCreatedKey}
                <IconButton
                  aria-label="Copy API key"
                  icon={<FiCopy />}
                  size="sm"
                  position="absolute"
                  top={2}
                  right={2}
                  onClick={onCopy}
                />
              </Box>
              {hasCopied && (
                <Badge colorScheme="green" mb={4}>
                  Copied to clipboard
                </Badge>
              )}
              <Text fontSize="sm">
                Use this key to authenticate your API requests. Include it in the Authorization header of your requests:
              </Text>
              <Code p={2} mt={2} display="block" whiteSpace="pre">
                Authorization: Bearer {newlyCreatedKey}
              </Code>
            </ModalBody>
            <ModalFooter>
              <Button 
                colorScheme="blue" 
                onClick={() => {
                  onClose()
                  setNewlyCreatedKey(null)
                }}
              >
                I&apos;ve Copied My Key
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  )
}