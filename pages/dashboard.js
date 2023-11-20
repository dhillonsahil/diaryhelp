import React, { useEffect } from 'react'
import WithSubnavigation from '@/components/navbar'
import { useRouter } from 'next/navigation';

const dashboard = () => {
  const router = useRouter();

  useEffect(()=>{
    if(!localStorage.getItem('myUser')){
      router.push('/')
    }
  },[])
  return (
    <div>
      {/* Navbar */}
      <WithSubnavigation/>
     
    </div>
  )
}

export default dashboard
