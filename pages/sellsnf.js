import WithSubnavigation from '@/components/navbar';
import React, { useEffect, useRef, useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import { RadioGroup, Stack, Radio } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import expiryCheck from '@/components/expiryCheck';


const SellMilk = () => {
    const [token, setToken] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [price,setPrice] = useState(0);
    const [consumerCode, setConsumerCode] = useState(0);
    const [selectedConsumer, setSelectedConsumer] = useState(null);
    const [customers,setCustomers]=useState([]);
    const [weight,setWeight] = useState(0);
    const [fat,setFat]=useState(0);
    const [snf,setSnf]=useState(0);
    const [startDate, setStartDate] = useState(new Date());
    const [selectedShift, setselectedShift] = useState('Morning');
    const [selectedType,setSelectedtype]=useState('Sell')
    const [priceType,setPriceType]=useState('FatSnf')
    const [milkrate,setMilkRate]=useState(0);
    const [totalPrice,setTotalPrice]=useState(0);
    const [remarks,setRemarks]=  useState('');
    const router = useRouter();
    const weightRef = useRef(null);
    const fatRef = useRef(null);
    const snfRef = useRef(null);
    const saveref=useRef(null);
    const consumerCodeRef = useRef(null);
    const priceRef = useRef(null);
    

    useEffect(() => {
      const tok =async()=>{
        let store = JSON.parse(localStorage.getItem('myUser'));
        if(store && store.token){
          setToken(store.token);
        }else{
          router.push('/')
        }
      }
      try {
        tok();
        expiryCheck();
      } catch (error) {
        
      }
    }, []);
          
          useEffect(() => {
            if(token.length>0){
      
              const user = async(req,res)=>{
                const response = await fetch(`http://localhost:3000/api/viewcustomers`,{
                  method:"POST",
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({token})
                })
                const resp = await response.json();
                setCustomers(resp.data);
              }
              user();
              handlePrice();
              
            }
          }, [token]); 

          
          // handle functions
          const handleKeyDown = (e, nextInputRef) => {
            
            if (e.key === 'Enter' && nextInputRef && nextInputRef.current) {
              e.preventDefault();
              nextInputRef.current.focus();
              // scroll down
              nextInputRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
            }
          };
          

        const handleInputChange = (e) => {
            setConsumerCode(e.target.value);
            const selected = customers.find((consumer) => consumer.id === parseInt(e.target.value));
            setSelectedConsumer(selected);
          };

          const handleSearchChange = (e) => {
            setSearchQuery(e.target.value);

          };

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

          const filteredConsumers = customers.filter((consumer) => {
            const { c_name, father_name, mobile, id } = consumer;
            const query = searchQuery.toLowerCase();
            return (
              c_name.toLowerCase().includes(query) ||
              // father_name.toLowerCase().includes(query) ||
              // mobile.includes(query) ||
              id.toString().includes(query)
            );
          });

          const getPrices =async (stype)=>{
                
            const data={
              type:'specific',
              token:token,
              stype:stype
            }
            
            const fetchPrices= await fetch(`http://localhost:3000/api/milkprice`,{
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
            
            const fetchPrices= await fetch(`http://localhost:3000/api/milkprice`,{
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


        const handleSave= async ()=>{
          try {
            // data

            if(
              weight == 0 || selectedConsumer == null || totalPrice==0  ||
              (selectedType == 'FatSnf' &&   (fat==0 || (fat>45 && snf==0)))
            ){
              toast.error('Enter Data!', {
                position: "top-left",
                autoClose: 500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            }); 
            return;           
          }

            const data ={
              type:"BuySell",
              token:token,
              ptype:selectedType,
              cid:selectedConsumer.id,
              pdate:formatDateForSQL(startDate),
              pprice:milkrate,
              pshift:selectedShift,
              totalprice:totalPrice.toFixed(2),
              cuid:selectedConsumer.uid,
              cname:selectedConsumer.c_name,
              fname:selectedConsumer.father_name,
              fat:Number(fat),
              snf:Number(snf),
              remarks:remarks,
              weight:Number(weight)
            }

            const resp  =await fetch(`http://localhost:3000/api/milkconsume`,{
              method:"POST",
              headers:{
                'Content-Type': 'application/json'
              },body:JSON.stringify(data)
            })

            const response = await resp.json();
            if(response.success==true){
              toast.success('Inserted Entry!', {
                position: "top-left",
                autoClose: 500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setWeight(0);
            setFat(0);
            setSnf(0);
            setPrice(0);
            setTotalPrice(0);
            setSelectedConsumer(null)
            // setMilkRate(0);
            setConsumerCode(0)
            if (consumerCodeRef.current) {
              consumerCodeRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
              consumerCodeRef.current.focus();
            }
            }else if(response.success=='duplicate'){
              toast.error('Already Inserted', {
                position: "top-left",
                autoClose: 500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setWeight(0);
            setFat(0);
            setSnf(0);
            setPrice(0);
            setTotalPrice(0);
            setSelectedConsumer(null)
            // setMilkRate(0);
            setConsumerCode(0)
            if (consumerCodeRef.current) {
              consumerCodeRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
              consumerCodeRef.current.focus();
            }
            }
            else{
              toast.error('Oops ! Try again Or Contact Us', {
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
          } catch (error) {
            console.log("An Error Occurred")
          }
        }
    
        // useEffect(()=>{
        //   if(fetchedPrice.length>0){
        //     const price = fetchedPrice[0];
        //     setMilkRate(price.price);
        //   }
        // },[fetchedPrice])
          
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
            <span className="pl-2 mx-1">Consumer's Details</span>
          </button>
          <div className="mt-5 bg-white rounded-lg shadow">
            <div className="px-5 pb-5">
 <div className="flex flex-row">           <label htmlFor="shift" className='px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg  focus:border-blueGray-500 focus:bg-white  focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400'>Price Type : </label>
                            
                            <RadioGroup className='px-4 py-2.5 mt-2 text-xl transition duration-500 ease-in-out transform border-transparent rounded-lg  focus:border-blueGray-500 focus:bg-white  focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ' defaultValue={priceType} onChange={(e)=>{
                                setPriceType(e);
                              if(e=="Regular"){
                                getPrices('regular')
                                setFat(0);
                                setSnf(0);
                                setWeight(0)
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
                            <label htmlFor="customercode" className='font-semobild text-lg'>Customer Code</label>
             
              <input 
                type='number'
                ref={consumerCodeRef}
                onWheel={(e) => e.target.blur()}
                value={consumerCode==0?'':consumerCode}
                onChange={handleInputChange}
                name='consumerCode'
                onKeyDown={(e) => {
                  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                    e.preventDefault();
                  }
                  handleKeyDown(e, weightRef)
                }}
                id='consumerCode'
                className="text-black w-full px-4 py-2.5 mt-2 transition duration-500 ease-in-out transform  rounded-lg  text-2xl font-bold ring-offset-2 border-2 border-black"
              />
               <label className='text-lg font-semibold' htmlFor="consumerSelect">Customer: {selectedConsumer!=null ? selectedConsumer.c_name :""}</label>
{
  consumerCode==0 && <>
  <input 
                value={searchQuery}
                id='searchQuery'
                onKeyDown={(e) => handleKeyDown(e, weightRef)}
                onChange={handleSearchChange}
                className="text-black my-1 w-full px-4 py-2.5 mt-2 transition duration-500 ease-in-out transform  rounded-lg  text-2xl font-bold ring-offset-2 border-2 border-black"
              />
              
     <select  onChange={handleInputChange} size={6} style= {{
  width: '100%',
  padding: '0.5rem',
  boxSizing: 'border-box',
  border:'1px solid black'
}}>
     <option value={""}>Select Consumers</option>
         {filteredConsumers.map((consumer) => (
          <option className='hover:bg-green-200 text-2xl' key={consumer.id} value={consumer.id} defaultValue={selectedConsumer?.id === consumer.id}>
           {consumer.id} - {consumer.c_name} - {consumer.father_name}
          </option>
          ))}
</select> 
  </>
}
               


<div className=""><label className='text-lg my-2 font-semibold' htmlFor="consumerSelect"> Weight :</label></div>
              <input
              onWheel={(e) => e.target.blur()}
                type='number'
                onChange={handleWeight}
                ref={weightRef}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                    e.preventDefault();
                  }
                  handleKeyDown(e, priceType!='Regular'?fatRef:priceRef)
                }}
                value={weight==0?'':weight}
                className="text-black my-1 w-full px-4 py-2.5 mt-2 transition duration-500 ease-in-out transform  rounded-lg  text-2xl font-bold ring-offset-2 border-2 border-black"
              />
             {
              priceType!='Regular' && (
                <div className="">
                   <label className='text-lg my-2 font-semibold' htmlFor="consumerSelect"> Fat :</label>
                <input
                type='number'
                  onChange={(e)=>{
                    setFat(e.target.value);
                    
                  }}
                  onWheel={(e) => e.target.blur()}
                  ref={fatRef}
                  onKeyDown={(e) => 
                    {
                      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                        e.preventDefault();
                      }
                      handleKeyDown(e, snfRef)}
                    }
                  value={fat==0?'':fat}
                  className="text-black my-1 w-full px-4 py-2.5 mt-2 transition duration-500 ease-in-out transform  rounded-lg  text-xl font-bold ring-offset-2 border-2 border-black"
                />
                 <label className='text-lg my-2 font-semibold' htmlFor="consumerSelect"> Snf :</label>
                 <input
                  type='number'
                  onWheel={(e) => e.target.blur()}
                  onChange={(e)=>{
                    {
                      setSnf(e.target.value)
                    
                    }
                  }}
                  ref={snfRef}
                  value={snf==0?'':snf}
                  onKeyDown={(e) =>
                    {
                      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                        e.preventDefault();
                      }
                     handleKeyDown(e, saveref)}
                  }  
                  className="text-black my-1 w-full px-4 py-2.5 mt-2 transition duration-500 ease-in-out transform  rounded-lg  text-xl font-bold ring-offset-2 border-2 border-black"/>
                </div>
              )
             }
              <div className="">
                <div className="">
                <label className='text-lg my-2 font-semibold' htmlFor="consumerSelect"> Price :</label>
                  <input
                    type='number'
                    onChange={(e)=>{
                      setPrice(e.target.value)
                      if(e.target.value!=0){
                        setTotalPrice(Number(weight)*e.target.value)
                      }else{
                        setTotalPrice(milkrate*Number(weight))
                      }
                    }}
                    onKeyDown={(e)=>{
                      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                        e.preventDefault();
                      }
                      handleKeyDown(e, saveref)
                    }}
                    ref={priceRef}
                    value={price==0?'':price}
                    className="text-black my-1 w-full px-4 py-2.5 mt-2 transition duration-500 ease-in-out transform  rounded-lg  text-xl font-bold ring-offset-2 border-2 border-black"
                  />
                </div>
                
                <label htmlFor="date" className='px-4 py-2.5 mt-2 text-xl transition duration-500 ease-in-out transform border-transparent rounded-lg   ring-offset-current ring-offset-2 ring-gray-400'>Select Date : </label>
              <DatePicker dateFormat={'dd-MM-yyyy'} className='border-black border-2 px-4 py-2.5 mt-2 transition duration-500 ease-in-out transform  rounded-lg text-xl ring-offset-current ring-offset-2 ' selected={startDate} onChange={handleDateChange} />

               
              </div>
             {
              fat>10 && fat<=45 && snf >10 && handleSnfFatPrice(weight) && (
               <>
                <label htmlFor="milkrate" className={`${selectedType=='Sell'?'text-red-500':"text-green-500"} text-lg mx-3`}>Milk Rate :{milkrate}</label>
                <label htmlFor="price" className={`${selectedType=='Sell'?'text-red-500':"text-green-500"} text-lg mx-3`}>Total Price :{totalPrice.toFixed(2)}</label></>
              )
             }
              {
              fat>45 && handleSnfFatPrice(weight) && (
               <>
                <label htmlFor="milkrate" className={`${selectedType=='Sell'?'text-red-500':"text-green-500"} text-lg mx-3`}>Milk Rate :{milkrate}</label>
                <label htmlFor="price" className={`${selectedType=='Sell'?'text-red-500':"text-green-500"} text-lg mx-3`}>Total Price :{totalPrice.toFixed(2)}</label></>
              )
             }
             {
              priceType=="Regular"  && (
               <>
                <label htmlFor="milkrate" className={`${selectedType=='Sell'?'text-red-500':"text-green-500"} text-lg mx-3`}>Milk Rate :{price==''?milkrate:price}</label>
                <label htmlFor="price" className={`${selectedType=='Sell'?'text-red-500':"text-green-500"} text-lg mx-3`}>Total Price :{totalPrice.toFixed(2)}</label></>
              )
             }
              <div className="flex flex-row"><label htmlFor="shift" className='px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg  focus:border-blueGray-500 focus:bg-white  focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400'>Select Shift : </label>
              
              
              <RadioGroup className=' px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg  focus:border-blueGray-500 focus:bg-white  focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ' defaultValue={selectedShift} onChange={(e)=>{
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
   <label htmlFor="shift" className='px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg  focus:border-blueGray-500 focus:bg-white  focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400'>Type : </label>
                            
                            <RadioGroup className=' px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg  focus:border-blueGray-500 focus:bg-white  focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ' defaultValue={selectedType} onChange={(e)=>{
                                setSelectedtype(e);
                                handlePrice();
                               }}>
                              <Stack spacing={5} direction='row'>
                                <Radio colorScheme='red' value='Sell'>
                                  Sell
                                </Radio>
                                <Radio colorScheme='green' value='Buy'>
                                  Purchase
                                </Radio>
                              </Stack>
                            </RadioGroup>
   </div>
   {/* label */}
   
   <label className='text-lg my-2 font-semibold' htmlFor="consumerSelect">Remarks (if any) :</label>
   <input
                onChange={(e)=>setRemarks(e.target.value)}
                value={remarks}
                className="text-black my-1 w-full px-4 py-2.5 mt-2 transition duration-500 ease-in-out transform  rounded-lg  text-xl font-bold ring-offset-2 border-2 border-black"
              />
            </div>
            
            
            <hr className="mt-4" />
            <div className="flex flex-row-reverse p-3">
              <div className="flex-initial pl-3">
                <button onClick={handleSave}
                ref={saveref}
                  type="button"
                  className="flex items-center px-5 py-2.5 font-medium tracking-wide text-white capitalize bg-green-600 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-gray-900 transition duration-300 transform active:scale-95 ease-in-out"
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
                   setWeight(0);
                   setFat(0);
                   setSnf(0);
                   setPrice(0);
                   setTotalPrice(0);
                   setSelectedConsumer(null)
                   // setMilkRate(0);
                   setConsumerCode(0)
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
                  <span className="pl-2 mx-1">Clear</span>
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

export default SellMilk;
