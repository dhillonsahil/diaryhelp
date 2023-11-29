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
import { useRouter as uR } from 'next/router';

const purchaseMilk = () => {
    const [token, setToken] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [price,setPrice] = useState(0);
    const [consumerCode, setConsumerCode] = useState(0);
    const [selectedConsumer, setSelectedConsumer] = useState(null);
    const [customers,setCustomers]=useState([]);
    const [selecteditem,setSelectedItem]=useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [selectedType,setSelectedtype]=useState('Sell')
    const [remarks,setRemarks]=  useState('');
    const [items,setItems]=useState([]);
    const router = useRouter();
    const [quant,setQuant]=useState(1)
    const rtr = uR();
    
    
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
    
    useEffect(()=>{
      const {amount,cid,mtype}=rtr.query;
      if(amount && cid  && mtype){
        console.log(amount,cid,mtype)
        setPrice(amount);
       
        setTimeout(()=>{
          handleCust(Number(cid))
        },500)
        if (mtype === 'Cash') {
          setRemarks('Cash');
          // Assuming there is an item in your items array representing Cash
          const cashItem = items.find((item) => item.itemName === 'Cash');
          setSelectedItem(cashItem);
        }
      }
    },[customers])

    

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

              // fetch items
    

              user();
              fetchItems();
              
            }
          }, [token]); 

          const fetchItems =async()=>{
            const resp = await fetch(`http://localhost:3000/api/items`,{
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


          const handleSubmit=async()=>{
            if(selectedConsumer!=null && Number(quant)!=0 && (Number(price)!=0 || selecteditem.itemprice!=0)){
              const data={
                token:token,
                type:"BuySell",
                ptype:selectedType
                , cid:selectedConsumer.id,
                 pdate:formatDateForSQL(startDate), 
                 pprice : Number(price)==0?selecteditem.itemprice:price, 
                 pshift:"", 
                 totalprice : Number(quant)*(Number(price)==0?selecteditem.itemprice:price),
                  cuid : selectedConsumer.uid, 
                  cname : selectedConsumer.c_name, fname : selectedConsumer.father_name, fat:0, snf:0, weight:quant, 
                  remarks:remarks
              }

              const resp = await fetch(`http://localhost:3000/api/milkconsume`,{
                method:"POST",
                headers:{
                  "Content-Type":"application/json",
                },
                body:JSON.stringify(data)
              })

              const response = await resp.json();
              if(response.success==true && !remarks.toLowerCase().includes('cash')){
                // update stock
                if(selecteditem){
                  const dt={
                    type:'updateStock',
                    newStock:selectedType=='Sell'?selecteditem.itemquantity-Number(quant):selecteditem.itemquantity+Number(quant),
                    id:selecteditem.id,
                    token:token
                  };
  
                  const resp=  await fetch(`http://localhost:3000/api/items`,{
                    method:"POST",
                    headers:{
                      "Content-Type":"application/json",
                    },
                    body:JSON.stringify(dt)
                  });
  
                  const response = await resp.json();
                  if(response.success==true){
                    toast.success('Added Successfully !', {
                      position: "top-left",
                      autoClose: 500,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "light",
                  });
                  // router.refresh();
                  setConsumerCode(0);
                  setSelectedConsumer(null);
                  setSelectedItem(null);
                  setSelectedtype('Sell')
                  setRemarks('')
                  const updatedItems = items.map((item) => {
                    if (item.id === selecteditem.id) {
                      // Update the quantity for the selected item
                      return {
                        ...item,
                        itemquantity: selectedType === 'Sell' ? item.itemquantity - Number(quant) : item.itemquantity + Number(quant),
                      };
                    }
                    return item;
                  });
            
                  // Set the updated items state
                  setItems(updatedItems);
                  }else{
                    toast.error('An Error occurred !', {
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
                }else{
                  toast.success('Expense Added Successfully!', {
                    position: "top-left",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                setConsumerCode(0);
                  setSelectedConsumer(null);
                  setSelectedItem(null);
                  setSelectedtype('Sell');
                  setRemarks('');
                }
               

              }else if(response.success==true){
                toast.success('Added Successfully !', {
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
              else if(response.success=='duplicate'){
                toast.error('Inserted Already', {
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
              else{
                toast.error('An Error occurred !', {
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
            }
          }
          
        
          const handleCust = (e) => {
            setConsumerCode(e);
            const selected = customers.find((consumer) => consumer.id === parseInt(e));
            setSelectedConsumer(selected);
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
    
        const handleItemChange = (e) => {
          if(e.target.value=='Cash'){
            setSelectedItem({ amount:price,itemName:"Cash"  })
            setRemarks('Cash');
            return;
          }
          const itemId = e.target.value;
          const selected = items.find((item) => item.id === parseInt(itemId));
          setSelectedItem(selected);
          setRemarks(selected.itemName)
        };

        
    const filteredConsumers = customers ?customers.filter((consumer) => {
      const { c_name, father_name, mobile, id } = consumer;
      const query = searchQuery.toLowerCase();
      return (
        c_name.toLowerCase().includes(query) ||
        father_name.toLowerCase().includes(query) ||
        mobile.includes(query) ||
        id.toString().includes(query)
      );
    }):[];

        


          
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
            <span className="pl-2 mx-1">Add Expense</span>
          </button>
          <div className="mt-5 bg-white rounded-lg shadow">
            <div className="px-5 pb-5">
            <label className='text-lg my-2 font-semibold' htmlFor="consumerSelect">Customer Code :</label>
              <input
              onWheel={(e)=>e.target.blur()}
                value={consumerCode==0?'':consumerCode}
                onChange={handleInputChange}
                type='number'
                name='consumerCode'
                id='consumerCode'
                className="text-black my-1 w-full px-4 py-2.5 mt-2 transition duration-500 ease-in-out transform  rounded-lg  text-xl font-bold ring-offset-2 border-2 border-black" required
              />
              {
                consumerCode==0 && <>
                
                <label className='text-lg my-2 font-semibold' htmlFor="consumerSelect">Search Customer :</label>
                <input
                value={searchQuery}
                id='searchQuery'
                onChange={handleSearchChange}
                className="text-black my-1 w-full px-4 py-2.5 mt-2 transition duration-500 ease-in-out transform  rounded-lg  text-xl font-bold ring-offset-2 border-2 border-black"
              />
                 <select  onChange={handleInputChange} size={6} style= {{
  width: '100%',
  padding: '0.5rem',
  boxSizing: 'border-box',
  border:'1px solid black'
}}>
     <option value={""}>Select Consumers</option>
     
         {filteredConsumers.map((consumer) => (
          <option className='hover:bg-green-200 text-xl' key={consumer.id} value={consumer.id} defaultValue={selectedConsumer?.id === consumer.id}>
           {consumer.id} - {consumer.c_name} - {consumer.father_name}
          </option>
          ))}
</select> 

                </>
              }
              

                
              <label htmlFor="consumerSelect" className='text-lg font-semibold'>Selected Consumer: {selectedConsumer!=null ? selectedConsumer.c_name :""}</label>

  
              
        
              <div className="">
                <div className="">
              <label  className='text-lg font-normal'>Price : </label>
                  <input
                  onWheel={(e)=>e.target.blur()}
                    type='number'
                    onChange={(e)=>{
                      setPrice(e.target.value);
                    //   pending
                    }}
                    value={price==0?'':price}
                    className="text-black my-1 w-full px-4 py-2.5 mt-2 transition duration-500 ease-in-out transform  rounded-lg  text-xl font-bold ring-offset-2 border-2 border-black"
                  />
                </div>
                
                <label htmlFor="date" className='px-4 py-2.5 mt-2 text-lg transition duration-500 ease-in-out transform border-transparent rounded-lg  focus:border-blueGray-500 focus:bg-white  focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400'>Select Date : </label>
              <DatePicker dateFormat={'dd-MM-yyyy'}  className='border-black border-2 px-4 py-2.5 mt-2 transition duration-500 ease-in-out transform  rounded-lg text-xl ring-offset-current ring-offset-2 ' selected={startDate} onChange={handleDateChange} />

               
              </div>
             
             

   <div className="">
   <label className='text-lg my-2 font-semibold' htmlFor="consumerSelect">Debit or Credit Type :</label>
                            
                            <RadioGroup className=' px-4 py-2.5 mt-2 text-lg transition duration-500 ease-in-out transform border-transparent rounded-lg  focus:border-blueGray-500 focus:bg-white  focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ' defaultValue={selectedType} onChange={(e)=>{
                                setSelectedtype(e);
                               }}>
                              <Stack spacing={5} direction='row'>
                                <Radio colorScheme='red' value='Sell'>
                                  Debit (बेचा)
                                </Radio>
                                <Radio colorScheme='green' value='Buy'>
                                  Credit (लिया)
                                </Radio>
                              </Stack>
                            </RadioGroup>
   </div>

  
   <label className='text-lg font-semibold'>Selected Item: {selecteditem!=null ? selecteditem.itemName :""}</label>

<select  onChange={handleItemChange} size={5} style= {{
width: '100%',
padding: '0.5rem',
boxSizing: 'border-box',
border:'1px solid black'
}}>
<option value={"Cash"}>Cash</option>
    {items.map((item) => (
     <option className='hover:bg-green-200 text-lg' key={item.id} value={item.id} defaultValue={selecteditem?.id === item.id}>
      {item.id} - {item.itemName} - ₹{item.itemprice} - Left Quantity : {item.itemquantity}
     </option>
     ))}
</select> 


{
  !remarks.toLowerCase().includes('cash') &&
  <>
<label className='text-lg font-semibold'>Enter quantity (default 1): {selecteditem!=null ? selecteditem.itemName :""}</label>
  
  <input
   onChange={(e)=>setQuant(e.target.value)}
   value={quant==0?'':quant}
   className="text-black my-1 w-full px-4 py-2.5 mt-2 transition duration-500 ease-in-out transform  rounded-lg  text-xl font-bold ring-offset-2 border-2 border-black"
 /></>
}
              <label className='text-lg font-semibold'>Remarks (if any) : </label>
   <input
                onChange={(e)=>setRemarks(e.target.value)}
                value={remarks}
                className="text-black my-1 w-full px-4 py-2.5 mt-2 transition duration-500 ease-in-out transform  rounded-lg  text-xl font-bold ring-offset-2 border-2 border-black"
              />
            </div>
            
            
            <hr className="mt-4" />
            <div className="flex flex-row-reverse p-3">
              <div className="flex-initial pl-3">
                <button 
                  type="button"
                  onClick={handleSubmit}
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
                  
                   setPrice(0);
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
