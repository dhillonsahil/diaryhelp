'use client'

import {
  Box,
  Stack,
  HStack,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  List,
  ListItem,
  ListIcon,
  Button,
} from '@chakra-ui/react'
import { FaCheckCircle } from 'react-icons/fa'
import { IoIosCloseCircle } from "react-icons/io";
import Link from 'next/link'
import NavHome from '@/components/navHome';
import AppHeader from '@/components/appheader';
function PriceWrapper(props) {
  const { children } = props

  return (
    <Box
      mb={4}
      shadow="base"
      borderWidth="1px"
      alignSelf={{ base: 'center', lg: 'flex-start' }}
      borderColor={useColorModeValue('gray.200', 'gray.500')}
      borderRadius={'xl'}>
      {children}
    </Box>
  )
}

export default function ThreeTierPricing() {
  return (
    <>
    <AppHeader />
    <Box py={12}>
      <VStack spacing={2} textAlign="center">
        <Heading as="h1" fontSize="4xl">
          Plans that fit your need
        </Heading>
        <Text fontSize="lg" color={'gray.800'}>
          Start with 3-days free trial. No credit card needed. 
          Contact Us to get subscription. <span className='text-blue-500'><Link href="/contact">Click Here</Link></span>
        </Text>
      </VStack>
      <Stack
        direction={{ base: 'column', md: 'row' }}
        textAlign="center"
        justify="center"
        spacing={{ base: 4, lg: 10 }}
        py={10}>
        <PriceWrapper>
          <Box py={4} px={12}>
            <Text fontWeight="500" fontSize="2xl">
              Monthly
            </Text>
            <HStack justifyContent="center">
              <Text fontSize="3xl" fontWeight="600">
                ₹
              </Text>
              <Text fontSize="5xl" fontWeight="900">
                599
              </Text>
              <Text fontSize="3xl" color="gray.500">
                /month
              </Text>
            </HStack>
          </Box>
          <VStack
            bg={useColorModeValue('gray.50', 'gray.700')}
            py={4}
            borderBottomRadius={'xl'}>
            <List spacing={3} textAlign="start" px={12}>
            
            <ListItem>
                  <ListIcon as={FaCheckCircle} color="green.500" />
                 Add / View Customers
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="green.500" />
                  Sell / Purchase Milk
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="green.500" />
                  Add Expense
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="green.500" />
                  Generate Bill Pdf
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="green.500" />
                  Cutsomer Can Bill Check Online
                </ListItem>
                
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="green.500" />
                 9 to 9 Support
                </ListItem>
                <ListItem>
                  <ListIcon as={IoIosCloseCircle} color="red.500" />
                 Features According to your need
                </ListItem>
            </List>
            <Box w="80%" pt={7}>
            <Link href={'/signup'}>
              <Button w="full" colorScheme="red" variant="outline">
                Start trial
              </Button>
              </Link>
            </Box>
          </VStack>
        </PriceWrapper>

        <PriceWrapper>
          <Box position="relative">
            <Box
              position="absolute"
              top="-16px"
              left="50%"
              style={{ transform: 'translate(-50%)' }}>
              <Text
                textTransform="uppercase"
                bg={useColorModeValue('red.300', 'red.700')}
                px={3}
                py={1}
                color={useColorModeValue('gray.900', 'gray.300')}
                fontSize="sm"
                fontWeight="600"
                rounded="xl">
                Most Popular
              </Text>
            </Box>
            <Box py={4} px={12}>
              <Text fontWeight="500" fontSize="2xl">
                Yearly 
              </Text>
              <HStack justifyContent="center">
                <Text fontSize="3xl" fontWeight="600">
                ₹
                </Text>
                <Text fontSize="5xl" fontWeight="900">
                  5000
                </Text>
                <Text fontSize="3xl" color="gray.500">
                  /year
                </Text>
              </HStack>
            </Box>
            <VStack
              bg={useColorModeValue('gray.50', 'gray.700')}
              py={4}
              borderBottomRadius={'xl'}>
              <List spacing={3} textAlign="start" px={12}>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="green.500" />
                 Add / View Customers
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="green.500" />
                  Sell / Purchase Milk
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="green.500" />
                  Add Expense
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="green.500" />
                  Generate Bill Pdf
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="green.500" />
                  Cutsomer Can Bill Check Online
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="green.500" />
                  24*7 support
                </ListItem>
                <ListItem>
                  <ListIcon as={IoIosCloseCircle} color="red.500" />
                  Features According to your need
                </ListItem>
              </List>
              <Box w="80%" pt={7}>
              <Link href={'/signup'}>
                <Button w="full" colorScheme="red">
                  Start trial
                </Button>
                </Link>
              </Box>
            </VStack>
          </Box>
        </PriceWrapper>
        <PriceWrapper>
          <Box py={4} px={12}>
            <Text fontWeight="500" fontSize="2xl">
              Custom Features
            </Text>
            <HStack justifyContent="center">
              <Text fontSize="3xl" fontWeight="600">
                ₹
              </Text>
              <Text fontSize="5xl" fontWeight="900">
                6000
              </Text>
              <Text fontSize="3xl" color="gray.500">
                /year 
              </Text>
            </HStack>
          </Box>
          <VStack
            bg={useColorModeValue('gray.50', 'gray.700')}
            py={4}
            borderBottomRadius={'xl'}>
            <List spacing={3} textAlign="start" px={12}>
            
            <ListItem>
                  <ListIcon as={FaCheckCircle} color="green.500" />
                 Add / View Customers
                </ListItem>
                
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="green.500" />
                  Sell / Purchase Milk
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="green.500" />
                  Add Expense
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="green.500" />
                  Generate Bill Pdf
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="green.500" />
                  Cutsomer Can Bill Check Online
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="green.500" />
                 24*7 support
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="green.500" />
                  Features According to your need
                </ListItem>
            </List>
            <Box w="80%" pt={7}>
                <Link href={'/signup'}>
              <Button w="full" colorScheme="red" variant="outline">
                Start trial
              </Button>
              </Link>
            </Box>
          </VStack>
        </PriceWrapper>
      </Stack>
    </Box></>
  )
}