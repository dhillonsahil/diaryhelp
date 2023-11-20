import React, { useEffect, useState } from 'react'
import { Radio, RadioGroup , Stack } from '@chakra-ui/react'
import WithSubnavigation from '@/components/navbar'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const DialyPrice = () => {
  const [value, setValue] = useState('Regular')
  const [cattle,setCattle]= useState('Buffalo')
  const [price,setPrice]= useState('');
  const [IV,setIV]= useState('Edit')
  const [username,setUsername]= useState('')

  const reset =()=>{
    setValue('Regular')
    setCattle('Buffalo')
    setPrice('');
  }

  const handleInsert =async()=>{
    // data
    const data = {
      type:'insert',
      mtype:value,
      ctype:cattle=='Cow'?'cow':'',
      price:Number(price),
      username:username.toLowerCase()
    }

    const resp = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/milkprice`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const response = await resp.json();

    if(response.success==true){
      toast.success('Inserted Successfully', {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
    reset()

    }else{
      toast.error('Oops ! An Error Occurred', {
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

  useEffect(() => {
    const user = localStorage.getItem('myUser');
    setUsername(JSON.parse(user).username.toLowerCase());
  }, []);
  
  return (
    <div>
      <WithSubnavigation />
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
      <RadioGroup className='text-black' onChange={setIV} value={IV}>
      <Stack direction='row'>
        <Radio borderColor={'GrayText'} colorScheme={'red'} value='Insert'>Add Price</Radio>
        <Radio borderColor={'GrayText'} colorScheme={'green'} value='Edit'>View / Update Price</Radio>
      </Stack>
    </RadioGroup>
      {
        IV=="Insert" && <InsertPrice handleInsert={handleInsert} title='Insert Milk' price={price} setPrice={setPrice} reset={reset} cattle={cattle} setCattle={setCattle} value={value} setValue={setValue} />
      }
      {
        IV=='Edit' && <ViewPrice />
      }
    </div>
  )
}

const InsertPrice = ({value,setValue,cattle,setCattle,reset,price,setPrice,title,handleInsert})=>{
    return (
<section className="py-40 bg-gray-100  bg-opacity-50 h-screen">
      <div className="mx-auto container max-w-2xl md:w-3/4 shadow-md">
        <div className="bg-gray-100 p-4 border-t-2 bg-opacity-5 border-indigo-400 rounded-t">
          <div className="max-w-sm mx-auto md:w-full md:mx-0">
            <div className="inline-flex items-center space-x-4">
                           <h1 className="text-black">{title}</h1>
            </div>
          </div>
        </div>
        <div className="bg-white space-y-6">
        
          <div className="md:inline-flex  space-y-4 md:space-y-0  w-full p-4 text-gray-500 items-center">
            <h2 className="md:w-1/3 mx-auto max-w-sm text-black">Price Detail's</h2>
            <div className="md:w-2/3 mx-auto max-w-sm space-y-5">
              <div>
                <label className="text-sm text-black">Price</label>
                <div className="w-full inline-flex border">
                  <div className="w-1/12 pt-2 bg-gray-100">
                  <span className='text-lg text-black mx-3'>₹</span>
                  </div>
                  <input
                    type="text"
                    value={price}
                    onChange={(e)=>setPrice(e.target.value)}
                    className="w-11/12  text-black placeholder:text-gray-500 p-2"
                    placeholder="Example 50"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-black">Type</label>
                
                <RadioGroup className='text-black' onChange={setValue} value={value}>
      <Stack direction='row'>
        <Radio borderColor={'GrayText'} colorScheme={'red'} value='Regular'>Regular</Radio>
        <Radio borderColor={'GrayText'} colorScheme={'green'} value='Fat'>Fat</Radio>
        <Radio borderColor={'GrayText'} colorScheme='red' value='Snf'>Snf</Radio>
        {/* <Radio borderColor={'GrayText'} colorScheme='green' value='Company'>Company</Radio> */}
      </Stack>
    </RadioGroup>
              </div>
              <div>
                <label className="text-sm text-black">Cattle Type</label>
                
                <RadioGroup className='text-black' onChange={setCattle} value={cattle}>
      <Stack direction='row'>
        <Radio borderColor={'GrayText'} colorScheme={'red'} value='Cow'>Cow</Radio>
        <Radio borderColor={'GrayText'} colorScheme='green' value='Buffalo'>Buffalo</Radio>
      </Stack>
    </RadioGroup>
              </div>
            </div>
          </div>

          <hr />
          <div className="md:inline-flex w-full space-y-4 md:space-y-0 p-8 text-gray-500 items-center">
                       
            <div className="md:w-3/12 lg:w-9/12 text-center md:pl-6 flex-row flex">
              <button onClick={handleInsert} className="mx-2 text-white w-full  max-w-sm rounded-md text-center bg-indigo-400 py-2 px-4 inline-flex items-center focus:outline-none md:float-right">
                <svg
                  fill="none"
                  className="w-4 text-white mr-2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Save Details
              </button>
              <button onClick={reset} className="mx-2 text-white w-full max-w-sm rounded-md text-center bg-red-400 py-2 px-4 inline-flex items-center focus:outline-none md:float-right">
              <svg
                fill="none"
                className="w-4 mr-2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
                Reset Details
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
    )
}

const ViewPrice = ({title})=>{
  return (
    <>
 

<div className="relative overflow-x-auto shadow-md sm:rounded-lg mx-2">
  <h2 className='w-full text-center text-xl font-bold py-4'>View or Update Prices</h2>
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200 ">
            <tr>
                
                <th scope="col" className="px-6 py-3">
                    Sr. No.
                </th>
                <th scope="col" className="px-6 py-3">
                    Type
                </th>
                <th scope="col" className="px-6 py-3">
                    Price
                </th>
                <th scope="col" className="px-6 py-3">
                    Action
                </th>
            </tr>
        </thead>
        <tbody>
            <tr className="bg-white border-b hover:bg-gray-50 text-black">
               
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    1
                </th>
                <td className="px-6 py-4">
                    Cowfat
                </td>
                <td className="px-6 py-4">
                    $2999
                </td>
                <td className="px-6 py-4">
                    <a href="#" className="font-medium text-blue-600 hover:underline mx-2">Edit</a>
                    <a href="#" className="font-medium text-red-600  hover:underline mx-2">Delete</a>
                </td>
            </tr>
        </tbody>
    </table>
</div>


</>

  )
}



export default DialyPrice;
