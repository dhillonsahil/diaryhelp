import React from 'react'
import Link from 'next/link'
const HomeCard2 = () => {
  return (
<div className="flex items-center justify-center bg-gray-200">
    <div aria-label="card" className="p-8 rounded-3xl mx-2 my-3  bg-white  w-full">
      <div aria-label="header" className="flex  flex-row items-center space-x-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 shrink-0"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11"></path>
        </svg>
        <div className="space-y-0.5 flex-1">
          <h3
            className="font-medium text-lg tracking-tight text-gray-900 leading-tight"
          >
            Manage Items
          </h3>
          {/* <p className="text-sm font-normal text-gray-400 leading-none">
            Daily usage
          </p> */}
        </div>
      
      </div>
      <div aria-label="content" className="mt-9 md:grid-cols-2  lg:grid-cols-4 grid gap-2.5">
        <Link className='max-w-sm' href="/addcustomer">
          <div
            className="flex items-center space-x-4 p-3.5 rounded-full bg-gray-100"
          >
            <span
              className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full bg-white text-gray-900"
            >
            </span>
            <div className="flex flex-col flex-1">
              <h3 className="text-sm font-medium">Add Customers</h3>
             
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 shrink-0"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M9 6l6 6l-6 6"></path>
            </svg>
          </div>
        </Link>
        <Link className='max-w-sm' href="/sellmilk">
          <div
            className="flex items-center space-x-4 p-3.5 rounded-full bg-gray-100"
          >
            <span
              className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full bg-white text-gray-900"
            >
              
            </span>
            <div className="flex flex-col flex-1">
              <h3 className="text-sm font-medium">Add Milk</h3>
             
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 shrink-0"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M9 6l6 6l-6 6"></path>
            </svg>
          </div>
        </Link>
        <Link className='max-w-sm' href="/expenses">
          <div
            className="flex items-center space-x-4 p-3.5 rounded-full bg-gray-100"
          >
            <span
              className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full bg-white text-gray-900"
            >
            </span>
            <div className="flex flex-col flex-1">
              <h3 className="text-sm font-medium">Expenses</h3>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 shrink-0"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M9 6l6 6l-6 6"></path>
            </svg>
          </div>
        </Link>
        <Link className='max-w-sm' href="/overallbillcheck">
          <div
            className="flex items-center space-x-4 p-3.5 rounded-full bg-gray-100"
          >
            <span
              className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full bg-white text-gray-900"
            >
            </span>
            <div className="flex flex-col flex-1">
              <h3 className="text-sm font-medium">Bill Print</h3>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 shrink-0"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round" 
            > 
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M9 6l6 6l-6 6"></path>
            </svg>
          </div>
        </Link>
      </div>
    </div>
  </div>
  )
}

export default HomeCard2
