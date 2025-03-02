'use client'

import { Box, Flex, Container, VStack, HStack, Heading, Text, Icon, useColorModeValue } from '@chakra-ui/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  FiHome, 
  FiCreditCard, 
  FiKey, 
  FiActivity, 
  FiList
} from 'react-icons/fi'

interface NavItemProps {
  icon: any
  children: React.ReactNode
  href: string
  isActive: boolean
}

function NavItem({ icon, children, href, isActive }: NavItemProps) {
  const activeBg = useColorModeValue('blue.50', 'blue.900')
  const activeColor = useColorModeValue('blue.700', 'blue.200')
  const hoverBg = useColorModeValue('gray.100', 'gray.700')

  return (
    <Link href={href} passHref>
      <Flex
        align="center"
        px="4"
        py="3"
        cursor="pointer"
        role="group"
        fontWeight={isActive ? "semibold" : "medium"}
        color={isActive ? activeColor : undefined}
        bg={isActive ? activeBg : undefined}
        rounded="md"
        _hover={{
          bg: isActive ? activeBg : hoverBg,
        }}
      >
        <Icon
          mr="3"
          fontSize="16"
          as={icon}
          color={isActive ? activeColor : undefined}
          _groupHover={{
            color: isActive ? activeColor : undefined,
          }}
        />
        {children}
      </Flex>
    </Link>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navItems = [
    { name: 'Dashboard', icon: FiHome, href: '/dashboard' },
    { name: 'Buy Credits', icon: FiCreditCard, href: '/dashboard/credits' },
    { name: 'API Keys', icon: FiKey, href: '/dashboard/api-keys' },
    { name: 'Usage Stats', icon: FiActivity, href: '/dashboard/usage' },
    { name: 'Request History', icon: FiList, href: '/dashboard/history' },
  ]

  return (
    <Container maxW="container.xl" p={0}>
      <Flex h="100vh" py={5}>
        <Box
          w="250px"
          bg={useColorModeValue('white', 'gray.900')}
          borderRight="1px"
          borderRightColor={useColorModeValue('gray.200', 'gray.700')}
          pos="fixed"
          h="full"
          pt={5}
        >
          <Flex px="4" py="5" align="center">
            <Heading size="lg" fontWeight="bold">
              API Dashboard
            </Heading>
          </Flex>
          <Flex
            direction="column"
            as="nav"
            fontSize="sm"
            color="gray.600"
            aria-label="Main Navigation"
            mt={8}
          >
            {navItems.map((item) => (
              <NavItem 
                key={item.name} 
                icon={item.icon} 
                href={item.href}
                isActive={pathname === item.href}
              >
                {item.name}
              </NavItem>
            ))}
          </Flex>
        </Box>
        <Box ml="250px" w="calc(100% - 250px)" p={5}>
          {children}
        </Box>
      </Flex>
    </Container>
  )
}