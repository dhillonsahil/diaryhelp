import WithSubnavigation from '@/components/navbar';
import React, { useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import { RadioGroup, Stack, Radio } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import expiryCheck from '@/components/expiryCheck';


const UpdateMilk = (props) => {
    const [token, setToken] = useState('');
    const [price,setPrice] = useState('');
    const [consumerCode,setConsumerCode]=useState(props.cid)
    const [weight,setWeight] = useState(props.weight);
    const [fat,setFat]=useState(props.fat==0?'':String(props.fat));
    const [snf,setSnf]=useState(props.snf==0?'':String(props.snf));
    const [startDate, setStartDate] = useState(new Date(props.pdate));
    const [selectedShift, setselectedShift] = useState(props.pshift);
    const [selectedType,setSelectedtype]=useState(props.ptype)
    const [priceType,setPriceType]=useState(props.fat==0?'Regular':'FatSnf')
    const [milkrate,setMilkRate]=useState(props.pprice);
    const [totalPrice,setTotalPrice]=useState(props.totalprice);
    const [previousPrice,setPreviousPrice]=useState(props.totalprice)
    const [remarks,setRemarks]=  useState(props.remarks);
    const router = useRouter();
    

    useEffect(() => {
      
      try {
        // expiryCheck();
       tok();
    //    alert("Fetched")
      } catch (error) {
        alert("Error")
      }
    }, []);
      
    const tok =async()=>{
        let store = JSON.parse(localStorage.getItem('myUser'));
        if(store && store.token){
          setToken(store.token);
        }else{
          router.push('/')
        }
      }
          
          // handle functions

      
         

          const handleDateChange = (date) => {
            setStartDate(date);
    
        };

          const formatDateForSQL = (date) => {
            return format(date, "yyyy-MM-dd");
        };
    

          const handleWeight =(e)=>{
            setWeight(e.target.value);
           if(priceType=='Regular'){
            if(price==0){
              setTotalPrice(milkrate*Number(e.target.value));
            }else{
              setTotalPrice(Number(price)*Number(e.target.value));
            }
           }
          }

          const handleSnfFatPrice = async(wt)=>{
              const fattype = (Number(fat) >= 30 && Number(fat) <= 45) ? 'cowfat' : 'buffalofat';
              const snftype = (Number(fat) >= 30 && Number(fat) <= 45) ? 'cowsnf' : 'buffalosnf';
              const fatmilk = await priceFetcher(fattype);
              const snfmilk = await priceFetcher(snftype);
              
             if(fatmilk && snfmilk){
                const cprice = price == '' ? (fattype === 'cowfat' ? snfmilk[0].price : fatmilk[0].price) : Number(price);
                let fatrate, snfrate, fatprice;
      if (fattype === 'cowfat') {
          fatrate =await fatmilk[0].price;
          snfrate =await cprice === '' ? snfmilk[0].price : cprice;
          fatprice = ((snfrate + (Number(fat) - 30) * fatrate) * Number(snf)) / 85;
          setMilkRate(Math.round((fatprice + Number.EPSILON) * 100) / 100     )
          let roundedValue=Math.round((fatprice + Number.EPSILON) * 100) / 100  ;
          let calcPrice = roundedValue *Number(wt);
          setTotalPrice(calcPrice)
      } else if (fattype === 'buffalofat') {
          fatrate = cprice === '' ? fatmilk[0].price : cprice;
          snfrate = snfmilk[0].price;
          fatprice = ((fatrate + ((snf==''?90:Number(snf)) - 90) * snfrate) * Number(fat)) / 100;
          setMilkRate(Math.round((fatprice + Number.EPSILON) * 100) / 100        )
          let roundedValue=Math.round((fatprice + Number.EPSILON) * 100) / 100     ;
          const calcPrice = roundedValue *Number(wt);
          setTotalPrice(calcPrice)
      }
             }
            
          }

         
          const getPrices =async (stype)=>{
                
            const data={
              type:'specific',
              token:token,
              stype:stype
            }
            
            const fetchPrices= await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/milkprice`,{
            method:"POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
            })
            const resp = await fetchPrices.json();
            setMilkRate(resp.data[0].price)
          }

          const priceFetcher =async (stype)=>{
                
            const data={
              type:'specific',
              token:token,
              stype:stype
            }
            
            const fetchPrices= await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/milkprice`,{
            method:"POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
            })
            const resp = await fetchPrices.json();
            return resp.data;
          }

        


        const handlePrice=()=>{
          if(priceType=='Regular'){
            getPrices('regular');
          }
        }



        const handleUpdate =async()=>{

          try {
            const resp = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/modifymilk`,{
              method:"PUT",
              headers:{
                'Content-Type': 'application/json'
              },body:JSON.stringify({
                token:token,
                type:"update",
                tid:props.tid,
                cid:consumerCode,
                utype:selectedType,
                uprice:milkrate,
                upshift:selectedShift,
                ufat:Number(fat),
                usnf:Number(snf),
                utotalprice:totalPrice,
                update:formatDateForSQL(startDate),
                uweight:Number(weight),
                uremarks:remarks

              })
,            })

          const response = await resp.json();

          if(response.success==true){
            toast.success('Updated Successfully !', {
              position: "top-left",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
          });
          
          router.refresh();

          }else{
            toast.error('An Error Occurred !', {
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


          } catch (error) {
            
          }
        }
          
  return (
    <div>
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
        <div className="flex h-screen bg-gray-100">
      <div className="m-auto">
        <div>
          <button
            type="button"
            className="relative w-full flex justify-center items-center px-5 py-2.5 font-medium tracking-wide text-white capitalize bg-black rounded-md hover:bg-gray-900 focus:outline-none transition duration-300 transform active:scale-95 ease-in-out"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              enableBackground="new 0 0 24 24"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="#FFFFFF"
            >
              <g>
                <rect fill="none" height="24" width="24"></rect>
              </g>
              <g>
                <g>
                  <path d="M19,13h-6v6h-2v-6H5v-2h6V5h2v6h6V13z"></path>
                </g>
              </g>
            </svg>
            <span className="pl-2 mx-1">Update Milk Entry</span>
          </button>
          <div className="mt-5 bg-white rounded-lg shadow">
            <div className="px-5 pb-5">
 <div className="flex flex-row">           <label htmlFor="shift" className='px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400'>Price Type : </label>
                            
                            <RadioGroup className='px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ' defaultValue={priceType} onChange={(e)=>{
                                setPriceType(e);
                              if(e=="Regular"){
                                getPrices('regular')
                                setFat('');
                                setSnf('');
                                setWeight('')
                                setTotalPrice(0)
                              }
;                               }}>
                              <Stack spacing={5} direction='row'>
                                <Radio colorScheme='green' value='Regular'>
                                  Regular
                                </Radio>
                                <Radio colorScheme='red' value='FatSnf'>
                                  Fat/Snf
                                </Radio>
                              </Stack>
                            </RadioGroup></div>
              
                
              
              <input
                placeholder="Weight"
                onChange={handleWeight}
                value={weight}
                className="text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200 focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
              />
             {
              priceType!='Regular' && (
                <div className="flex flex-row">
                <input
                  placeholder="Fat"
                  onChange={(e)=>{
                    setFat(e.target.value);
                    
                  }}
                  value={fat}
                  className="mr-2 text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200 focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
                />
                 <input
                  placeholder="Snf"
                  onChange={(e)=>{
                    {
                      setSnf(e.target.value)
                    
                    }
                  }}
                  value={snf}
                  className="ml-2 text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200 focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
                />
                </div>
              )
             }
              <div className="flex">
                <div className="flex-grow w-1/4 pr-2">
                  <input
                    placeholder="Price"
                    onChange={(e)=>{
                      setPrice(e.target.value)
                      if(e.target.value!=0){
                        setTotalPrice(Number(weight)*e.target.value)
                      }else{
                        
                        setTotalPrice(milkrate*Number(weight))
                      }
                    }}
                    value={price}
                    className="text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200 focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
                  />
                </div>
                
                <label htmlFor="date" className='px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400'>Select Date : </label>
              <DatePicker dateFormat={'dd-MM-yyyy'} className='border-black border-2 px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200 focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400' selected={startDate} onChange={handleDateChange} />

               
              </div>
             {
              fat>10 && fat<=45 && snf >10 && handleSnfFatPrice(weight==''?props.weight:Number(weight)) && (
               <>
                <label htmlFor="milkrate" className='text-green-500 mx-3'>Milk Rate :{milkrate}</label>
                <label htmlFor="price" className='text-red-500 mx-3'>Saved Price :{previousPrice}</label>
                <label htmlFor="price" className='text-red-500 mx-3'>Total Price :{totalPrice}</label></>
              )
             }
              {
              fat>45 && handleSnfFatPrice(weight==''?props.weight:Number(weight)) && (
               <>
                <label htmlFor="milkrate" className='text-green-500 mx-3'>Milk Rate :{milkrate}</label>
                <label htmlFor="price" className='text-red-500 mx-3'>Saved Price :{previousPrice}</label>
                <label htmlFor="price" className='text-red-500 mx-3'>Total Price :{totalPrice}
                </label></>
              )
             }
             {
              priceType=="Regular"  && (
               <>
                <label htmlFor="milkrate" className='text-green-500 mx-3'>Milk Rate :{price==''?milkrate:price}</label>
                <label htmlFor="price" className='text-red-500 mx-3'>Total Price :{totalPrice}</label></>
              )
             }
              <div className="flex flex-row"><label htmlFor="shift" className='px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400'>Select Shift : </label>
              
              
              <RadioGroup className=' px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ' defaultValue={selectedShift} onChange={(e)=>{
               setselectedShift(e);
              }}>
             <Stack spacing={5} direction='row'>
               <Radio colorScheme='green' value='Morning'>
                 Morning
               </Radio>
               <Radio colorScheme='red' value='Evening'>
                 Evening
               </Radio>
             </Stack>
           </RadioGroup></div>

   <div className="flex flex-row">
   <label htmlFor="shift" className='px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400'>Type : </label>
                            
                            <RadioGroup className=' px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ' defaultValue={selectedType} onChange={(e)=>{
                                setSelectedtype(e);
                                handlePrice();
                               }}>
                              <Stack spacing={5} direction='row'>
                                <Radio colorScheme='green' value='Sell'>
                                  Sell
                                </Radio>
                                <Radio colorScheme='red' value='Buy'>
                                  Buy
                                </Radio>
                              </Stack>
                            </RadioGroup>
   </div>
   <input
                placeholder="Remarks"
                onChange={(e)=>setRemarks(e.target.value)}
                value={remarks}
                className="text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200 focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
              />
            </div>
            
            
            <hr className="mt-4" />
            <div className="flex flex-row-reverse p-3">
              <div className="flex-initial pl-3">
                <button 
                // onClick={handleSave}
                onClick={handleUpdate}
                  type="button"
                  className="flex items-center px-5 py-2.5 font-medium tracking-wide text-white capitalize bg-black rounded-md hover:bg-gray-800 focus:outline-none focus:bg-gray-900 transition duration-300 transform active:scale-95 ease-in-out"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 0 24 24"
                    width="24px"
                    fill="#FFFFFF"
                  >
                    <path d="M0 0h24v24H0V0z" fill="none"></path>
                    <path d="M5 5v14h14V7.83L16.17 5H5zm7 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-8H6V6h9v4z" opacity=".3"></path>
                    <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm2 16H5V5h11.17L19 7.83V19zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM6 6h9v4H6z"></path>
                  </svg>
                  <span className="pl-2 mx-1">Save</span>
                </button>
              </div>
              <div className="flex-initial">
                <button onClick={()=>{
                   router.refresh();
                }}
                  type="button"
                  className="flex items-center px-5 py-2.5 font-medium tracking-wide text-black capitalize rounded-md hover:bg-red-200 hover:fill-current hover:text-red-600 focus:outline-none transition duration-300 transform active:scale-95 ease-in-out"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 0 24 24"
                    width="24px"
                  >
                    <path d="M0 0h24v24H0V0z" fill="none"></path>
                    <path d="M8 9h8v10H8z" opacity=".3"></path>
                    <path d="M15.5 4l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9z"></path>
                  </svg>
                  <span className="pl-2 mx-1">Cancel</span>
                </button>
              </div>
            </div>
          </div>
         
        </div>
      </div>
    </div>
    </div>
  );
};

export default UpdateMilk;