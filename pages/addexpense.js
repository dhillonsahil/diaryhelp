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


const purchaseMilk = () => {
    const [token, setToken] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [price,setPrice] = useState('');
    const [consumerCode, setConsumerCode] = useState('');
    const [selectedConsumer, setSelectedConsumer] = useState(null);
    const [customers,setCustomers]=useState([]);
    
    const [startDate, setStartDate] = useState(new Date());
    const [selectedType,setSelectedtype]=useState('Sell')
    const [remarks,setRemarks]=  useState('');
    const [items,setItems]=useState([]);
    const router = useRouter();

    

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
        // expiryCheck();
       tok();
      } catch (error) {
        
      }
    }, []);
          
          useEffect(() => {
            if(token.length>0){
      
              const user = async(req,res)=>{
                const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/viewcustomers`,{
                  method:"POST",
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({token})
                })
                const resp = await response.json();
                setCustomers(resp.data);
              }

              // fetch items
    const fetchItems =async()=>{
        const resp = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/items`,{
          method:"POST",
          headers:{
            "Content-Type":"application/json",
          },
          body:JSON.stringify({
            token:token,
            type:"viewAll"
          })
        })
  
        const response = await resp.json();
        setItems(response.data);
      }

              user();
              
            }
          }, [token]); 

          
          // handle functions

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

              
        
              <div className="flex">
                <div className="flex-grow w-1/4 pr-2">
                  <input
                    placeholder="Price"
                    onChange={(e)=>{
                      setPrice(e.target.value);
                    //   pending
                    }}
                    value={price}
                    className="text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200 focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
                  />
                </div>
                
                <label htmlFor="date" className='px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400'>Select Date : </label>
              <DatePicker dateFormat={'dd-MM-yyyy'} className='border-black border-2 px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200 focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400' selected={startDate} onChange={handleDateChange} />

               
              </div>
             
             

   <div className="flex flex-row">
   <label htmlFor="shift" className='px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400'>Type : </label>
                            
                            <RadioGroup className=' px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ' defaultValue={selectedType} onChange={(e)=>{
                                setSelectedtype(e);
                               }}>
                              <Stack spacing={5} direction='row'>
                                <Radio colorScheme='green' value='Sell'>
                                  Debit
                                </Radio>
                                <Radio colorScheme='red' value='Buy'>
                                  Credit
                                </Radio>
                              </Stack>
                            </RadioGroup>
   </div>

  
   <label htmlFor="consumerSelect">Selected Consumer: {selectedConsumer!=null ? selectedConsumer.c_name :""}</label>

<select  onChange={handleInputChange} size={6} style= {{
width: '100%',
padding: '0.5rem',
boxSizing: 'border-box',
border:'1px solid black'
}}>
<option value={""}>Select Item</option>
    {items.map((consumer) => (
     <option className='hover:bg-green-200' key={consumer.id} value={consumer.id} defaultValue={selectedConsumer?.id === consumer.id}>
      {items.id} - {items.itemName} - {items.itemprice}
     </option>
     ))}
</select> 

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
                <button onClick={()=>{
                  
                   setPrice('');
                   setSelectedConsumer(null)
                   // setMilkRate(0);
                   setConsumerCode('')
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

export default purchaseMilk;
