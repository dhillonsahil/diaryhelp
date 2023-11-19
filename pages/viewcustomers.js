import WithSubnavigation from '@/components/navbar'
import React, { useEffect, useState } from 'react'
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
  } from '@chakra-ui/react'
import { SearchBar } from '@/components/seachbar';
import Link from 'next/link'
const viewcustomers = () => {
    const [username, setUsername] = useState('');
    const [customers,setCustomers]=useState([]);
    const [searchInput,setSearchInput]=useState('');

  

    // get All Customers of MilkMan
    useEffect(() => {
      const user = localStorage.getItem('myUser');
      setUsername(JSON.parse(user).username);
    }, []);
    
    useEffect(() => {
      if(username.length>0){

        const user = async(req,res)=>{
          const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/viewcustomers`,{
            method:"POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({username:username})
          })
          const resp = await response.json();
          setCustomers(resp.data);
        }
        user();
      }
    }, [username]); 

    useEffect(()=>{
      
      console.log(customers)
    },[customers])


  return (
    <div className=''>
        {/* Navbar */}
      <WithSubnavigation />
      <div className="flex flex-row my-3 mx-2">
        <Link href={'/addcustomer'}>
        <span className='p-3 rounded-lg mx-1 hover:bg-green-300'>Add Customers</span></Link>
        <Link href={'/viewcustomers'}><span className='p-3 rounded-lg mx-1 bg-red-300'>View Customers</span></Link>
      </div>
     <div className="flex mx-4 justify-center items-center align-middle">
        <h1 className='text-xl my-4'>All Added Customers</h1>
     </div>
      {/* Table Data */}

     <div className="">
      <SearchBar searchInput={searchInput} setSearchInput={setSearchInput} />
     </div>
      <TableContainer>
  <Table variant='striped' colorScheme='teal'>
    <TableCaption>Customers Record</TableCaption>
    <Thead>
      <Tr>
        <Th>#</Th>
        <Th>Unique Id</Th>
        <Th>Name</Th>
        <Th>Fathers Name</Th>
        <Th>Address</Th>
        {/* <Th>Options</Th> */}
      </Tr>
    </Thead>
    <Tbody>
    {
  customers.map((customer, index) => {
    const searchInputLower = searchInput.toLowerCase(); // Convert search input to lowercase for case-insensitive comparison

    const match =
      String(customer.id).includes(searchInputLower) ||
      customer.c_name.toLowerCase().includes(searchInputLower) ||
      customer.father_name.toLowerCase().includes(searchInputLower) ||
      customer.uid.toLowerCase().includes(searchInputLower) ||
      customer.address.toLowerCase().includes(searchInputLower) ||
      customer.mobile.includes(searchInputLower);

    if (match) {
      return (
        <Tr key={index}>
          <Td>{customer.id}</Td>
          <Td>{customer.uid}</Td>
          <Td>{customer.c_name}</Td>
          <Td>{customer.father_name}</Td>
          <Td>{customer.address}</Td>
          {/* Add other columns as needed */}
        </Tr>
      );
    }

    return null; // Do not render anything if the customer does not match the search
  })
}

    </Tbody>
    {/* <Tfoot>
      <Tr>
        <Th>To convert</Th>
        <Th>into</Th>
        <Th isNumeric>multiply by</Th>
      </Tr>
    </Tfoot> */}
  </Table>
</TableContainer>
      
    </div>
  )
}

export default viewcustomers
