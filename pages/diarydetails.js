import React from 'react'
import { useState,useEffect} from 'react'
import Link from 'next/link'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';

export default function Signup() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address,setAddress]=useState('');
  const [diaryName, setDiaryName] = useState('');
  const [mobile,setMobile]=useState('');
  const [token, setToken] = useState('');

  const onchange = (e) => {
    if (e.target.name == 'name') {
      setName(e.target.value)
    } else if (e.target.name == 'email') {
      setEmail(e.target.value)
    }else if (e.target.name == 'diaryName') {
      setDiaryName(e.target.value)
    }
    else if (e.target.name =='mobile') {
      setMobile(e.target.value)
    }else if(e.target.name=='address'){
        setAddress(e.target.value)
    }
  }

  useEffect(() => {
    const tok =async()=>{
      let store = JSON.parse(localStorage.getItem('myUser'));
      if(store && store.token){
        setToken(store.token) 
        console.log(store.token)         
      }else{
        router.push('/')
      }
    }
    try {
     tok();
    } catch (error) {
      console.log(error)
    }
  }, []);

  const handleSave =async(e)=>{
    e.preventDefault();
    if(token.length>0 && name.length>0 && address.length>0 && mobile.length>9 && diaryName.length>0){
            const response = await fetch(`https://diaryhelp.myrangolidesign.com/api/getdetails`,{
              method:"POST",
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({name:name, type:'add',address:address,dName:diaryName,mobile:mobile,token})
            })
            const resp = await response.json();
            if(resp.success==true){
                toast.success('Inserted successfully', {
                    position: "top-left",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    });
                router.push('/dashboard')
            }else{
                toast.error('An error occurred', {
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
      
    }else{
      toast.error('Enter Data', {
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

  return (
    <>
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

              <h1 className="text-center text-2xl font-semibold">Details to be printed on Bill</h1>
              <div className="mt-8">
                <form onSubmit={handleSave}  method='POST'>
                  <div className="mt-8">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-bold text-gray-700 tracking-wide">
                        Diary Members Name
                      </div>

                    </div>
                    <input value={name} onChange={onchange} name="name" className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500" id='name' type="text" placeholder="SAHIL MOHIT" />
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
                        Member's mobile Number
                      </div>

                    </div>
                    <input value={mobile} onChange={onchange} name="mobile" className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500" id='mobile' type="text" placeholder="9998887776  8877997788" />
                  </div>
                  <div>
                    <div className="text-sm font-bold mt-4 text-gray-700 tracking-wide">Diary Address</div>
                    <input value={address} onChange={onchange} name="address" className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500" type="address" id="address" placeholder="PABRA HISAR" />
                  </div>

                  <div className="m-6">
                    <button className="bg-pink-500 text-gray-100 p-4 w-full rounded-full tracking-wide
                                font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-indigo-600
                                shadow-lg">
                      Save Details
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}