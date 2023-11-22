import React, { useEffect, useState } from 'react'
import WithSubnavigation from '@/components/navbar'
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken'
const dashboard = () => {
  const router = useRouter();
  const [username,setUsername]=useState('')

  useEffect(() => {
    const tok =async()=>{
      let store = JSON.parse(localStorage.getItem('myUser'));
      if(store && store.token){
        let key = process.env.NEXT_PUBLIC_JWT_SECRET
        if(key ){
          jwt.verify(store.token, key, function(err, decoded) {
           setUsername(decoded.email.toLowerCase().split('@')[0]);
          });
          
        }
      }else{
        router.push('/')
      }
    }
    try {
     tok();
    } catch (error) {
      
    }
  }, []);
  
  return (
    <div>
      {/* Navbar */}
      <WithSubnavigation/>
     
    </div>
  )
}

export default dashboard
