import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

import { useRouter } from 'next/router';
import AppHeader from '@/components/appheader';
export default function Forgot() {
  const router = useRouter()
  const { id } = router.query
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [cpass, setCpass] = useState('')
  useEffect(() => {
    if (localStorage.getItem("myUser")) {
      router.push('/')
    }
  }, [id, router])


  const handleChange = (e) => {
    if (e.target.name === 'password') {
      setPass(e.target.value)
    } else if (e.target.name === 'cpassword') {
      setCpass(e.target.value)
    } else if (e.target.name === 'email') {
      setEmail(e.target.value)
    }
  }

  const sendLink = async (e) => {
    const customerMail =email.toLowerCase()
    e.preventDefault();
    let sent = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/forgot`, {
      method: "POST",
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({customerMail})
    })

    let res = await sent.json()
    if (res.success) {
      toast.success('Link sent Successfully', {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    } else {
      toast.error(res.error, {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    }
  }
  const handleUpate = async (e) => {
    e.preventDefault();
    if(pass!=cpass){
      toast.error('Password and Confirm Password are different', {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    }else{
      let updt= await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/resetpass`,{
        method:"POST",
        headers:{
          'Content-type':'application/json'
        },body:JSON.stringify({
          token:id,
          password:pass
        })
      })

      let res= await updt.json()
      if(res.success){
        toast.success('Password Updated successfully', {
          position: "top-left",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
      }else{
        toast.error(res.error, {
          position: "top-left",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
      }
    }
  }
  return (

    <>
    <AppHeader />
    <div className='px-4'>
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
      {id === undefined ? <div className="min-h-screen md:min-h-0 bg-white-500 pb-16 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div
            className="absolute inset-0 bg-gradient-to-r from-blue-300 to-pink-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
          </div>
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <h1 className="text-center text-2xl font-semibold">Fogot Password</h1>
            <div className="mt-12">
              <form onSubmit={sendLink} method='POST'>
                <div>
                  <div className="text-sm font-bold text-gray-700 tracking-wide">Email Address</div>
                  <input name='email' value={email} onChange={handleChange} className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500" type="" placeholder="mike@gmail.com" />
                </div>
                <div className="m-10">
                  <button className="bg-pink-500 text-gray-100 p-4 w-full rounded-full tracking-wide
                                font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-indigo-600
                                shadow-lg">
                    Continue
                  </button>
                </div>
              </form>
              <div className="mt-10 text-sm font-display font-semibold text-gray-700 text-center"><span className='mx-2'>{`Remember Password ?`}</span><Link href={'/login'} className="mx-1 cursor-pointer  hover:text-indigo-800"><span className='text-pink-600'>login</span></Link></div>
            </div>
          </div>
        </div>
      </div> : <div className="min-h-screen md:min-h-0 bg-white-500 pb-16 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div
            className="absolute inset-0 bg-gradient-to-r from-blue-300 to-pink-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
          </div>
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <h1 className="text-center text-2xl font-semibold">Update Password</h1>
            <div className="mt-12">
              <form>
                <div>
                  <div className="text-sm font-bold text-gray-700 tracking-wide">Password</div>
                  <input name='password' value={pass} onChange={handleChange} className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500" type="" placeholder="Password" />
                </div>
                <div className='my-1'>
                  <div className="text-sm font-bold text-gray-700 tracking-wide">Confirm Password</div>
                  <input name='cpassword' value={cpass} onChange={handleChange} className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500" type="" placeholder="Password" />
                </div>
                <div className="m-10">
                  <button onClick={handleUpate} className="bg-pink-500 text-gray-100 p-4 w-full rounded-full tracking-wide
                                font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-indigo-600
                                shadow-lg">
                    Update
                  </button>
                </div>

              </form>
              <div className="mt-10 text-sm font-display font-semibold text-gray-700 text-center"><span className='mx-2'>{`Remember Password ?`}</span><Link href={'/login'} className="mx-1 cursor-pointer  hover:text-indigo-800"><span className='text-pink-600'>login</span></Link></div>
            </div>
          </div>
        </div>
      </div>}
    </div>
    </>
  )
}