import React from 'react'
import Link from 'next/link'
const HeroSection = () => {
  return (
    <div className="relative" id="home">
     <div aria-hidden="true" className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 ">
        <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400 "></div>
        <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 "></div>
    </div>
    <div className="max-w-7xl mx-auto px-6 md:px-12 xl:px-6">
    <div className="relative pt-36 ml-auto">
            <div className="lg:w-2/3 text-center mx-auto">
                <h1 className="text-gray-900  font-bold text-5xl md:text-6xl xl:text-7xl">Milk Management got easy with <span className="text-primary text-blue-500">Milk Manage.</span></h1>
                <p className="mt-8 text-gray-700 ">Spending all the time on too much milk calculations. In Milk Manage enter your data while buying or selling then no need for calculations. Bill can be generated in seconds.</p>
                <div className="mt-16 flex flex-wrap justify-center gap-y-4 gap-x-6">
                    <Link
                      href="/signup"
                      className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"
                    >
                      <span className="relative text-base font-semibold text-white"
                        >Get started</span
                      >
                    </Link>
                    <Link
                      href="/login"
                      className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:border before:border-transparent before:bg-primary/10 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95  sm:w-max"
                    >
                      <span
                        className="relative text-base font-semibold text-primary "
                        >Sign In</span
                      >
                    </Link>
                </div>
                <div className="hidden py-8 mt-16 border-y border-gray-100  sm:flex justify-between">
                    <div className="text-left">
                        <h6 className="text-lg font-semibold text-gray-700 ">The lowest price</h6>
                        <p className="mt-2 text-gray-500">₹599</p>
                    </div>
                    <div className="text-left">
                        <h6 className="text-lg font-semibold text-gray-700 ">The fastest on the market</h6>
                        <p className="mt-2 text-gray-500">Save data in less than a second</p>
                    </div>
                    <div className="text-left">
                        <h6 className="text-lg font-semibold text-gray-700 ">The most loved</h6>
                        <p className="mt-2 text-gray-500">by every milk man</p>
                    </div>
                </div>
            </div>
           </div>
    </div>
    </div>
  )
}

export default HeroSection
