import React, { useEffect, useRef, useState } from 'react'
import WithSubnavigation from '@/components/navbar';
import { FormControl, FormLabel, Input, Stack } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link'
import { useRouter } from 'next/navigation/';
import expiryCheck from '@/components/expiryCheck';
// import  from 'jsonwebtoken'

const addcustomer = () => {

  const [name, setName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [token, setToken] = useState('');
  const router = useRouter();
  const fnameRef=useRef(null);
  const mobileRef=useRef(null);
  const addressRef=useRef(null);

  const handleKeyDown = (e, nextInputRef) => {
    if (e.key === 'Enter' && nextInputRef && nextInputRef.current) {
      e.preventDefault();
      nextInputRef.current.focus();
    }
  };
  
  const onchange = (e) => {
    if (e.target.name == 'name') {
      setName(e.target.value)
    } else if (e.target.name == 'fatherName') {
      setFatherName(e.target.value)
    } else if (e.target.name == 'mobile') {
      setMobile(e.target.value)
    } else if (e.target.name == 'address') {
      setAddress(e.target.value)
    }
  }

  function generateUniqueString() {
    const uniqueString = Math.random().toString(36).substr(2, 8);
    return uniqueString;
  }

  const handleReset = () => {
    setName('');
    setFatherName('');
    setMobile('');
    setAddress('');
  }

   useEffect(() => {
    const tok =async()=>{
      let store = JSON.parse(localStorage.getItem('myUser'));
      if(store && store.token){
        setToken(store.token)
      }else{
        router.push('/')
      }
    }
    try {
      tok();
      expiryCheck()
    } catch (error) {
      
    }
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(name.length>0 && mobile.length>0 && address.length>0 && fatherName.length>0){
    const generatedString = generateUniqueString();

    const data = {
      name: name,
      fatherName: fatherName,
      mobile: mobile,
      address: address,
      token: token,
      generatedString:generatedString
    }


    const response = await fetch(`http://localhost:3000/api/addcustomer`,{
      method:"POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    let resp = await response.json()

    if(resp.success==true){
      toast.success('Customer Added!', {
        position: "top-left",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });

    handleReset();

    }else{
      toast.error('An Error occurred !', {
          position: "top-left",
          autoClose: 500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
      });
  }
}else{
  toast.error('Enter Details', {
    position: "top-left",
    autoClose: 500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
});
}
  }

  return (
    <div className='w-full h-full min-h-full'>
      <ToastContainer
                position="top-left"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
      {/* Navbar */}
      <WithSubnavigation />
      <div className="flex flex-row my-3 mx-2">
        <Link href={'/addcustomer'}>
        <span className='p-3 rounded-lg text-xl font-semibold mx-1 bg-red-300'>Add Customers</span></Link>
        <Link href={'/viewcustomers'}><span className='p-3 rounded-lg mx-1 hover:bg-green-300'>View Customers</span></Link>
      </div>
      {/*  Form */}
      <div className="lg:mx-16 mx-3 mt-4">
        <form onSubmit={handleSubmit} >
          {/* Name */}
          <div className='my-2 mx-2'>
            <FormControl isRequired>
              <FormLabel>Full name</FormLabel>
              <Input onKeyDown={(e) => handleKeyDown(e, fnameRef)} borderColor={'black'} size={'lg'} value={name} name='name' id='name' onChange={onchange}  />
            </FormControl>
          </div>
          {/* Father Name */}
          <div className='my-2 mx-2'>
            <FormControl isRequired>
              <FormLabel>Father name</FormLabel>
              <Input onKeyDown={(e) => handleKeyDown(e, mobileRef)} ref={fnameRef} borderColor={'black'} size={'lg'}  value={fatherName} name='fatherName' id='fatherName' onChange={onchange} />
            </FormControl>
          </div>
          {/* Mobile */}
          <div className='my-2 mx-2'>
            <FormControl isRequired>
              <FormLabel>Mobile Number</FormLabel>
              <Input ref={mobileRef} onKeyDown={(e) => handleKeyDown(e, addressRef)} borderColor={'black'} size={'lg'} value={mobile} name='mobile' id='mobile' onChange={onchange}  />
            </FormControl>
          </div>
          {/* Address */}
          <div className='my-2 mx-2'>
            <FormControl isRequired>
              <FormLabel>Address</FormLabel>
              <Input ref={addressRef} borderColor={'black'} size={'lg'}  value={address} name='address' id='address' onChange={onchange}  />
              <Stack spacing={4} direction='row' mt={3} align='center'>

                <button className="bg-pink-500 text-gray-100 p-4 w-full rounded-full tracking-wide
               font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-indigo-600
               shadow-lg">Save button</button>
                <Button onClick={handleReset} colorScheme='teal' size='lg'>
                  Reset
                </Button>
              </Stack>
            </FormControl>
          </div>
        </form>
      </div>


    </div>
  )
}

export default addcustomer
