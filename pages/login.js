import React, { useState,useEffect } from 'react'
import Link from 'next/link'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()

    const onchange = (e) => {
        if (e.target.name == 'password') {
            setPassword(e.target.value)
        } else if (e.target.name == 'email') {
            setEmail(e.target.value)
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        const emailLower=email.toLowerCase()
        const data = { emailLower, password }
        let res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/login`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })

        let response = await res.json()
        if(response.success==true){
            localStorage.setItem("myUser",JSON.stringify({token : response.token , email:response.email,username:emailLower.split('@')[0]}))
            toast.success('Logged In!', {
                position: "top-left",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            router.push("/dashboard")
        }else if(response.success=="Check Your Credentials"){
            toast.error('Check Your Credentials !', {
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
            toast.error('An Error occurred !', {
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

    setEmail('')
    setPassword('')
    }

    useEffect(() => {
        if(localStorage.getItem("myUser")){
            router.push('/dashboard')
        }
    },[])
    

    return (
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
            <div className="min-h-screen md:min-h-0 bg-white-500 pb-16 flex flex-col justify-center sm:py-12">
                <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-blue-300 to-pink-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
                    </div>
                    <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                        <h1 className="text-center text-2xl font-semibold">Sign in to your account</h1>
                        <div className="mt-12">
                            <form onSubmit={handleSubmit} method='POST'>
                                <div>
                                    <div className="text-sm font-bold text-gray-700 tracking-wide">Email Address</div>
                                    <input value={email} onChange={onchange} id='email' name='email' className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500" type="email" placeholder="mike@gmail.com" />
                                </div>
                                <div className="mt-8">
                                    <div className="flex justify-between items-center">
                                        <div className="text-sm font-bold text-gray-700 tracking-wide">
                                            Password
                                        </div>
                                        <div>
                                            <Link href="forgot" className="text-xs font-display font-semibold text-indigo-600 hover:text-indigo-800
                                        cursor-pointer">
                                                Forgot Password?
                                            </Link>
                                        </div>
                                    </div>
                                    <input name='password' id='password' value={password} onChange={onchange} className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500" type="password" placeholder="Enter your password" />
                                </div>
                                <div className="m-10">
                                    <button className="bg-pink-500 text-gray-100 p-4 w-full rounded-full tracking-wide
                                font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-indigo-600
                                shadow-lg">
                                        Log In
                                    </button>
                                </div>
                            </form>
                            <div className="mt-10 text-sm font-display font-semibold text-gray-700 text-center"><span className='mx-1'>{`Don't have an account ?`}</span><Link href={'/signup'} className="mx-2 cursor-pointer  hover:text-indigo-800"><span className='text-pink-600'>Sign Up</span></Link></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}