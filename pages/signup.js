import React from 'react'
import { useState,useEffect} from 'react'
import Link from 'next/link'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import AppHeader from '@/components/appheader';

export default function Signup() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [diaryName, setDiaryName] = useState('');
  const [mobile,setMobile]=useState('');

  const onchange = (e) => {
    if (e.target.name == 'name') {
      setName(e.target.value)
    } else if (e.target.name == 'password') {
      setPassword(e.target.value)
    } else if (e.target.name == 'email') {
      setEmail(e.target.value)
    }else if (e.target.name == 'diaryName') {
      setDiaryName(e.target.value)
    }
    else if (e.target.name =='mobile') {
      setMobile(e.target.value)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const emailLower = email.toLowerCase()
    const data = { name, emailLower, password , diaryName,mobile }
    let res = await fetch(`https://diaryhelp.myrangolidesign.com/api/signup`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    let response = await res.json()
     if(response.success==true){
      toast.success('Account Created Successfully!', {
        position: "top-left",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
       localStorage.setItem("myUser",JSON.stringify({token : response.token }));
       router.push('/diarydetails')
      }else if(response.message=="Account Already Exist"){
        toast.error('Account Already Exist', {
          position: "top-left",
          autoClose: 500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
          
        }else{
        toast.error('An error occurred', {
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

    setEmail('')
    setName('')
    setMobile('')
    setDiaryName('')
    setPassword('')

  }
  useEffect(() => {
    if(localStorage.getItem("myUser")){
        router.push('/dashboard')
    }
},[])

  
  return (
    <>
    <AppHeader />
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
      <div className='px-4'>
        <div className="min-h-screen md:min-h-0 bg-white-500 pb-16 flex flex-col justify-center sm:py-12">
          <div className="relative py-3 sm:max-w-xl sm:mx-auto">
            <div
              className="absolute inset-0 bg-gradient-to-r from-blue-300 to-pink-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
            </div>

            <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">

              <h1 className="text-center text-2xl font-semibold">Sign up for an Account</h1>
              <div className="mt-8">
                <form onSubmit={handleSubmit} method='POST'>
                  <div className="mt-8">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-bold text-gray-700 tracking-wide">
                        Name
                      </div>

                    </div>
                    <input value={name} onChange={onchange} name="name" className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500" id='name' type="text" placeholder="Enter your name" />
                  </div>
                  <div className="m-2">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-bold text-gray-700 tracking-wide">
                        Diary Name
                      </div>

                    </div>
                    <input value={diaryName} onChange={onchange} name="diaryName" className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500" id='diaryName' type="text" placeholder="Enter your name" />
                  </div>
                  <div className="m-2">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-bold text-gray-700 tracking-wide">
                        Mobile Number
                      </div>

                    </div>
                    <input value={mobile} onChange={onchange} name="mobile" className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500" id='mobile' type="text" placeholder="Enter your mobile" />
                  </div>
                  <div>
                    <div className="text-sm font-bold mt-4 text-gray-700 tracking-wide">Email Address</div>
                    <input value={email} onChange={onchange} name="email" className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500" type="email" id="email" placeholder="purcharsefrom@getmybook.com" />
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-bold text-gray-700 tracking-wide">
                        Password
                      </div>

                    </div>
                    <input value={password} onChange={onchange} className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500" type="password" id="password" name="password" placeholder="Enter your password" />
                  </div>
                  <div className="m-6">
                    <button className="bg-pink-500 text-gray-100 p-4 w-full rounded-full tracking-wide
                                font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-indigo-600
                                shadow-lg">
                      SignUp
                    </button>
                  </div>
                </form>
                <div className="mt-6 text-sm font-display font-semibold text-gray-700 text-center"><span className='mx-2'>{`Already have an account ?`}</span><Link href={'/login'} className="mx-1 cursor-pointer  hover:text-indigo-800"><span className='text-pink-600'>Login</span></Link></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}