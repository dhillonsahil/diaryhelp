import React, { useEffect, useState } from 'react'
import WithSubnavigation from '@/components/navbar'
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken'
import expiryCheck from '@/components/expiryCheck';
import HomeCard2 from '@/components/HomeCard2';
import TotalCustomers from '@/components/TotalCustomers';
import TotalResults from '@/components/TotalResults';
import CowRateList from '@/components/CowRateList';
import BuffaloRateList from '@/components/BuffalloRateList';
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
      tok();
      expiryCheck();
    } catch (error) {
      
    }
  }, []);

  useEffect(()=>{
    try {
      if(token.length>0){
        getData();
      }
    } catch (error) {
      console.log(error)
    }
  },[token])

  const getData =async()=>{
    const resp  =await fetch(`http://localhost:3000/api/home`,{
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
     {token.length>0 && <TotalResults token={token} />} 
     {token.length>0 && <CowRateList token={token} snfRate={custprice.snf} />} 
     {token.length>0 && <BuffaloRateList token={token} snfRate={custprice.snf} />} 
     
    </div>
  )
}

export default dashboard
