'use client'


import AppHeader from '@/components/appheader'
import Link from 'next/link'
import Footer from '@/components/footer'
import HeroSection from '@/components/herosection'
import Features from '@/components/Features'
import Stats from '@/components/Stats'
import CallToAction from '@/components/CallToAction'
import AppFooter from '@/components/appfooter'
const Home =()=>{
  return (
    <>
    <AppHeader />
    <HeroSection />
    <Features />
    <Stats />
    <CallToAction />
    <AppFooter />
    </>
  )
}



export default Home