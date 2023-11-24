import React, { useEffect, useState } from 'react'
import WithSubnavigation from '@/components/navbar'
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken'
import expiryCheck from '@/components/expiryCheck';
import HomeCard2 from '@/components/HomeCard2';
import TotalCustomers from '@/components/TotalCustomers';
const dashboard = () => {
  const router = useRouter();
  const [token,setToken]=useState('')
  const [custprice,setCustPrice] = useState({});

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
      expiryCheck();
     tok();
    } catch (error) {
      
    }
  }, []);

  useEffect(()=>{
    try {
      getData();
    } catch (error) {
      console.log(error)
    }
  },[token])

  const getData =async()=>{
    const resp  =await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/home`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },body:JSON.stringify({
        token:token,
        type:"tcustomers"
      })
    })
    const response = await resp.json();
    if(response.success==true){
      setCustPrice(response);
    }
  }
  
  return (
    <div>
      {/* Navbar */}
      <WithSubnavigation/>
     <HomeCard2 />
     <TotalCustomers  totalCust={custprice.totalCust} fatRate={custprice.fat} snfRate={custprice.snf} regularPrice={custprice.regular} />
    </div>
  )
}

export default dashboard
