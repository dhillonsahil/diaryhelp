import WithSubnavigation from '@/components/navbar';
import React, { useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jwt from 'jsonwebtoken'
import { RadioGroup, Stack, Radio } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

const sellMilk = () => {
    const [username, setUsername] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [price,setPrice] = useState('');
    const [consumerCode, setConsumerCode] = useState('');
    const [selectedConsumer, setSelectedConsumer] = useState(null);
    const [customers,setCustomers]=useState([]);
    const [weight,setWeight] = useState('');
    const [fat,setFat]=useState('');
    const [snf,setSnf]=useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [selectedShift, setselectedShift] = useState('Morning');
    const [selectedType,setSelectedtype]=useState('Sell')
    const [priceType,setPriceType]=useState('Regular')
    const [fetchedPrice,setFetchedPrice] = useState([]);
    const [milkrate,setMilkRate]=useState(0);
    const [totalPrice,setTotalPrice]=useState(0);
    const [remarks,setRemarks]=  useState('');
    const router = useRouter();

        // get All Customers of MilkMan and milk prices
        useEffect(() => {
          const tok =async()=>{
            let store = JSON.parse(localStorage.getItem('myUser'));
            if(store && store.token){
              let key = process.env.NEXT_PUBLIC_JWT_SECRET
              if(key ){
                jwt.verify(store.token, key, function(err, decoded) {
                 setUsername(decoded.email.toLowerCase().split('@')[0]);
                });
                
              }
            }else{
              router.push('/')
            }
          }
          try {
           tok();
          } catch (error) {
            
          }
        }, []);
          
          useEffect(() => {
            if(username.length>0){
      
              const user = async(req,res)=>{
                const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/viewcustomers`,{
                  method:"POST",
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({username:username})
                })
                const resp = await response.json();
                setCustomers(resp.data);
              }
              user();
              handlePrice();
              
            }
          }, [username]); 

          
          // handle functions

        const handleInputChange = (e) => {
            setConsumerCode(e.target.value);
            const selected = customers.find((consumer) => consumer.id === parseInt(e.target.value));
            setSelectedConsumer(selected);
          };

          const handleSearchChange = (e) => {
            setSearchQuery(e.target.value);

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

          const handlSnfFatPrice = async(wt)=>{
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
              father_name.toLowerCase().includes(query) ||
              mobile.includes(query) ||
              id.toString().includes(query)
            );
          });

          const getPrices =async (stype)=>{
                
            const data={
              type:'specific',
              username:username.toLowerCase(),
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
            setFetchedPrice(resp.data)
          }

          const priceFetcher =async (stype)=>{
                
            const data={
              type:'specific',
              username:username.toLowerCase(),
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
          }else if(priceType!='Regular'){ 
          }
        }
    
        useEffect(()=>{
          if(fetchedPrice.length>0){
            const price = fetchedPrice[0];
            setMilkRate(price.price);
          }
        },[fetchedPrice])
          
  return (
    <div>
        <WithSubnavigation />
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
            <div className="flex">
              {/* <div className="flex-1 py-5 pl-5 overflow-hidden">
                <svg
                  className="inline align-text-top"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#000000"
                >
                  <g>
                    <path
                      d="m4.88889,2.07407l14.22222,0l0,20l-14.22222,0l0,-20z"
                      fill="none"
                      id="svg_1"
                      stroke="null"
                    ></path>
                    <path
                      d="m7.07935,0.05664c-3.87,0 -7,3.13 -7,7c0,5.25 7,13 7,13s7,-7.75 7,-13c0,-3.87 -3.13,-7 -7,-7zm-5,7c0,-2.76 2.24,-5 5,-5s5,2.24 5,5c0,2.88 -2.88,7.19 -5,9.88c-2.08,-2.67 -5,-7.03 -5,-9.88z"
                      id="svg_2"
                    ></path>
                    <circle
                      cx="7.04807"
                      cy="6.97256"
                      r="2.5"
                      id="svg_3"
                    ></circle>
                  </g>
                </svg>
                <h1 className="inline text-2xl font-semibold leading-none">
                  Sender
                </h1>
              </div> */}
            </div>
            <div className="px-5 pb-5">
 <div className="flex flex-row">           <label htmlFor="shift" className='px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400'>Price Type : </label>
                            
                            <RadioGroup className='px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ' defaultValue={priceType} onChange={(e)=>{
                                setPriceType(e);
                                handlePrice();

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
                placeholder="Customer Code"
                value={consumerCode}
                onChange={handleInputChange}
                name='consumerCode'
                id='consumerCode'
                className="text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200 focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
              />
               <input
                placeholder="Search Customer"
                value={searchQuery}
                id='searchQuery'
                onChange={handleSearchChange}
                className="text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200 focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
              />

                
              <label htmlFor="consumerSelect">Selected Consumer: {selectedConsumer!=null ? selectedConsumer.c_name :""}</label>

     <select  onChange={handleInputChange} size={6} style= {{
  width: '100%',
  padding: '0.5rem',
  boxSizing: 'border-box',
  border:'1px solid black'
}}>
     <option value={""}>Select Consumers</option>
         {filteredConsumers.map((consumer) => (
          <option className='hover:bg-green-200' key={consumer.id} value={consumer.id} defaultValue={selectedConsumer?.id === consumer.id}>
           {consumer.id} - {consumer.c_name} - {consumer.father_name}
          </option>
          ))}
</select> 

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
                    // if( Number(snf) >10 && Number( e.target.value)>10){
                    //   handlSnfFatPrice(Number(weight));
                    // }
                  }}
                  value={fat}
                  className="mr-2 text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200 focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
                />
                 <input
                  placeholder="Snf"
                  onChange={(e)=>{
                    {
                      setSnf(e.target.value)
                      // if(Number(fat)>10 && Number(e.target.value)>10){
                      //   // alert("weight "+weight + "snf "+e.target.value + "fat "+fat)
                      //   handlSnfFatPrice(Number(weight))
                      // }
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
                    }}
                    value={price}
                    className="text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200 focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
                  />
                </div>
                
                <label htmlFor="date" className='px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400'>Select Date : </label>
              <DatePicker className='border-black border-2 px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200 focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400' selected={startDate} onChange={(date) => setStartDate(date)} />

               
              </div>
             {
              fat>10 && snf >10 && handlSnfFatPrice(weight) && (
               <>
                <label htmlFor="milkrate" className='text-green-500 mx-3'>Milk Rate :{price==''?milkrate:price}</label>
                <label htmlFor="price" className='text-red-500 mx-3'>Total Price :{totalPrice}</label></>
              )
             }
              {
              fat>45 && handlSnfFatPrice(weight) && (
               <>
                <label htmlFor="milkrate" className='text-green-500 mx-3'>Milk Rate :{price==''?milkrate:price}</label>
                <label htmlFor="price" className='text-red-500 mx-3'>Total Price :{totalPrice}</label></>
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
                <button
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
                  <span className="pl-2 mx-1">Delete</span>
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

export default sellMilk;
