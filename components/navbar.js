import React from 'react';
import { Box, VStack ,Flex, Spacer, Text, Button, Menu, MenuButton, MenuList, MenuItem, IconButton, useDisclosure } from '@chakra-ui/react';
import { ChevronDownIcon, HamburgerIcon } from '@chakra-ui/icons';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const router = useRouter();
  return (
    <Box bg="gray.800" py={4} px={8}>
      <Flex alignItems="center">
        <Link href={'/dashboard'} >
        <Text color="white" fontSize="xl" fontWeight="bold">
          Home
        </Text>
        </Link>
        <Spacer />
        <Flex alignItems="center">
          {/* Hamburger icon for mobile */}
          <Box display={{ base: 'block', md: 'none' }}>
            <IconButton
              icon={<HamburgerIcon />}
              size="md"
              fontSize="lg"
              aria-label="Open Menu"
              colorScheme="whiteAlpha"
              variant="ghost"
              onClick={onToggle}
            />
          </Box>

          {/* Navigation links for larger screens */}
          <Box display={{ base: 'none', md: 'flex' }}>
                <Link  href={'/dailyprice'}>
            <Button colorScheme="blackAplha" variant="solid" mr={4}>
              Daily Price
            </Button></Link>
            <Menu>
              <MenuButton  as={Button} rightIcon={<ChevronDownIcon />} colorScheme="blackAplha" variant="solid">
                Milk
              </MenuButton>
              <MenuList>
                <Link href={'/sellmilk'}>

                <MenuItem>Sell Milk</MenuItem>
                </Link>
                <Link href={'/sellsnf'}>

                <MenuItem>Sell Fat Snf</MenuItem>
                </Link>
                <Link href={'/purchasemilk'}>

                <MenuItem>Purchase Milk</MenuItem>
                </Link>
                <Link href={'/viewmilk'}>
                <MenuItem>View Milk</MenuItem>
                </Link>
              </MenuList>
            </Menu>
            <Menu>
              <MenuButton  as={Button} rightIcon={<ChevronDownIcon />} colorScheme="blackAplha" variant="solid">
              Expenses
              </MenuButton>
              <MenuList>
                <Link href={'/addexpense'}>

                <MenuItem>Add Expenses</MenuItem>
                </Link>
                <Link href={'/viewexpense'}>

                <MenuItem>View Expenses</MenuItem>
                </Link>
                <Link href={'/manageitems'}>
                <MenuItem>Manage Items</MenuItem>
                </Link>
              </MenuList>
            </Menu>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="blackAplha" variant="solid">
                Customers
              </MenuButton>
              <MenuList>
                <Link href={'/addcustomer'}>
                <MenuItem>Add Customers</MenuItem>
                </Link>
                <Link href={'/viewcustomers'}>
                <MenuItem>View Customers</MenuItem>
                </Link>
              </MenuList>
            </Menu>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="blackAplha" variant="solid">
                Bill Check
              </MenuButton>
              <MenuList>
                <Link href={'/sellbillcheck'}>
                <MenuItem>Sales Bill Check</MenuItem>
                </Link>
                <Link href={'/purchasebillcheck'}>
                <MenuItem>Purchase Bill Check</MenuItem>
                </Link>
                <Link href={'/overallbillcheck'}>
                <MenuItem>Overall Bill Check</MenuItem>
                </Link>
                <Link href={'/expensebillcheck'}>
                <MenuItem>Expense Bill Check</MenuItem>
                </Link>
              </MenuList>
                <Button onClick={()=>{
                    localStorage.removeItem('myUser');
                    router.push('/login')
                }} colorScheme="blackAlpha" variant="solid">
              Log Out
            </Button>
            </Menu>
            
          </Box>
        </Flex>
      </Flex>

      {/* Mobile menu */}
      {isOpen && (
        <Box pb={4} display={{ md: 'none' }}>
          <VStack spacing={4}>
          <Link  href={'/dailyprice'}>
            <Button colorScheme="blackAplha" variant="solid" mr={4}>
              Daily Price
            </Button></Link>
            <Menu>
              <MenuButton  as={Button} rightIcon={<ChevronDownIcon />} colorScheme="blackAplha" variant="solid">
                Milk
              </MenuButton>
              <MenuList>
                <Link href={'/sellmilk'}>

                <MenuItem>Sell Milk</MenuItem>
                </Link>
                <Link href={'/sellsnf'}>

                <MenuItem>Sell Fat Snf</MenuItem>
                </Link>
                <Link href={'/purchasemilk'}>

                <MenuItem>Purchase Milk</MenuItem>
                </Link>
                <Link href={'/viewmilk'}>
                <MenuItem>View Milk</MenuItem>
                </Link>
              </MenuList>
            </Menu>
            <Menu>
              <MenuButton  as={Button} rightIcon={<ChevronDownIcon />} colorScheme="blackAplha" variant="solid">
              Expenses
              </MenuButton>
              <MenuList>
                <Link href={'/addexpense'}>

                <MenuItem>Add Expenses</MenuItem>
                </Link>
                <Link href={'/viewexpense'}>

                <MenuItem>View Expenses</MenuItem>
                </Link>
                <Link href={'/manageitems'}>
                <MenuItem>Manage Items</MenuItem>
                </Link>
              </MenuList>
            </Menu>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="blackAplha" variant="solid">
                Customers
              </MenuButton>
              <MenuList>
                <Link href={'/addcustomer'}>
                <MenuItem>Add Customers</MenuItem>
                </Link>
                <Link href={'/viewcustomers'}>
                <MenuItem>View Customers</MenuItem>
                </Link>
              </MenuList>
            </Menu>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="blackAplha" variant="solid">
                Bill Check
              </MenuButton>
              <MenuList>
                <Link href={'/sellbillcheck'}>
                <MenuItem>Sales Bill Check</MenuItem>
                </Link>
                <Link href={'/purchasebillcheck'}>
                <MenuItem>Purchase Bill Check</MenuItem>
                </Link>
                <Link href={'/overallbillcheck'}>
                <MenuItem>Overall Bill Check</MenuItem>
                </Link>
                <Link href={'/expensebillcheck'}>
                <MenuItem>Expense Bill Check</MenuItem>
                </Link>
              </MenuList>
            </Menu>
            <Button onClick={()=>{
                    localStorage.removeItem('myUser');
                    router.push('/login')
                }} colorScheme="blackAplha" variant="solid">
              Log Out
            </Button>
          </VStack>
        </Box>
      )}
    </Box>
  );
};

export default Navbar;
