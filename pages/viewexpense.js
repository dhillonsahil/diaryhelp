import WithSubnavigation from '@/components/navbar';
import React, { useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import expiryCheck from '@/components/expiryCheck';


const ViewExpense = () => {
    const [token, setToken] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [consumerCode, setConsumerCode] = useState(0);
    const [selectedConsumer, setSelectedConsumer] = useState(null);
    const [customers,setCustomers]=useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [fetched,setFetched]=useState([]);
    const [ visible,setVisible ]=useState('userInput');
    const [selectedRow,setSelectedRow]=useState({});
    const [modelVisible,setModelVisible] = useState(false)
    const router = useRouter();

    let id=1;

    const handleViewAnother=()=>{
      setVisible('userInput');
      setConsumerCode(0)
      setSelectedConsumer(null);
      setSelectedRow({});
    }

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
                const response = await fetch(`https://milkmanage.in/api/viewcustomers`,{
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

          const handleStartDate = (date) => {
            setStartDate(date);
        };
        const handleEndDate = (date) => {
            setEndDate(date);
    
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


          const handleDelete =async()=>{
            setModelVisible(false);
            const resp = await fetch(`https://milkmanage.in/api/modifymilk`,{
              method:"POST",
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({token,type:'delete',mid:selectedRow.id,ptype : selectedRow.ptype,totalPrice : selectedRow.totalprice ,cuid :selectedConsumer.uid ,cid:selectedConsumer.id})
            })

            const response = await resp.json();

            if(response.success==true){
              toast.success('Deleted Successfully !', {
                position: "top-left",
                autoClose: 500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setFetched((prevFetched) => prevFetched.filter(item => item.id !== selectedRow.id));
            }else{
              toast.error('Unable to delete !', {
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

            setModelVisible(false)
          }

          // const handleDelete = async()=>{
          //   console.log("Setted row: ",selectedRow)
          // }

          

        const handleSubmit= async ()=>{
          if(consumerCode==0 ){
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
          const data={
            token:token,
            cid:selectedConsumer.id,
            startDate:formatDateForSQL(startDate),
            endDate:formatDateForSQL(endDate)
          }
          const fetchPrices= await fetch(`https://milkmanage.in/api/expense`,{
          method:"POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
          })
          const resp = await fetchPrices.json();
          setFetched(resp.data);  
          setVisible('showData');        
        }
          
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
           
            {/* User input */}

        {
          visible=='userInput' && (
            <div className={`${visible=='userInput'?'flex':''} h-screen`}>
          {/*  Get User Data Form */}
      
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
            <span className="pl-2 mx-1">Expenses Details</span>
          </button>
          <div className="mt-5 bg-white rounded-lg shadow">
            <div className="px-5 pb-5">
            <label className='text-xl font-semibold' >Customer Code: </label>
              <input
                value={consumerCode==0?'':consumerCode}
                onChange={handleInputChange}
                name='consumerCode'
                type='number'
                id='consumerCode'
                className="text-black my-1 w-full px-4 py-2.5 mt-2 transition duration-500 ease-in-out transform  rounded-lg  text-2xl font-bold ring-offset-2 border-2 border-black" required
              />
              <label className='text-xl font-semibold my-2' htmlFor="consumerSelect">Selected Consumer: {selectedConsumer!=null ? selectedConsumer.c_name :""}</label>
              

{
  consumerCode==0 && <>  <label className='text-xl font-semibold' >Search : </label>
  <input
   value={searchQuery}
   id='searchQuery'
   onChange={handleSearchChange}
   className="text-black my-1 w-full px-4 py-2.5 mt-2 transition duration-500 ease-in-out transform  rounded-lg  text-2xl font-bold ring-offset-2 border-2 border-black"
 /> <select  onChange={handleInputChange} size={6} style= {{
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
  </select> </>
  
                
}
                
              

    
             
              <div className="">
                <div className="">
                  <div className="">
                  <label htmlFor="date" className='px-4 py-2.5 mt-2 text-xl transition duration-500 ease-in-out transform border-transparent rounded-lg   ring-offset-current ring-offset-2 ring-gray-400'>From : </label>
                  </div>
               
              <DatePicker dateFormat={'dd-MM-yyyy'} className='border-black border-2 px-4 py-2.5 mt-2 transition duration-500 ease-in-out transform  rounded-lg text-xl ring-offset-current ring-offset-2 ' selected={startDate} onChange={handleStartDate} />
                </div>                
               <div className="">
                <div className="">
                <label htmlFor="date" className='px-4 py-2.5 mt-2 text-xl transition duration-500 ease-in-out transform border-transparent rounded-lg   ring-offset-current ring-offset-2 ring-gray-400'>To : </label>
                </div>
               
              <DatePicker dateFormat={'dd-MM-yyyy'}className='border-black border-2 px-4 py-2.5 mt-2 transition duration-500 ease-in-out transform  rounded-lg text-xl ring-offset-current ring-offset-2 ' selected={endDate} onChange={handleEndDate} />

               </div>
              </div>
            </div>
            
            
            <hr className="mt-4" />
            <div className="flex flex-row-reverse p-3">
              <div className="flex-initial pl-3">
                <button onClick={handleSubmit}
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
                  <span className="pl-2 mx-1">View Expenses</span>
                </button>
              </div>
              <div className="flex-initial">
                <button onClick={()=>{
                  setConsumerCode(0);
                  setSelectedConsumer(null);
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
                  <span  className="pl-2 mx-1">Delete</span>
                </button>
              </div>
            </div>
          </div>
         
        </div>
      </div>
      
     

      {/* Update Data */}

    </div>
          )
        }
    {/*  Modal to confirm delete */}
     {
      modelVisible ==true && (
        <div className="min-w-screen h-screen animated fadeIn faster  fixed  left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover"  id="modal-id">
        <div className="absolute bg-black opacity-80 inset-0 z-0"></div>
       <div className="w-full  max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg  bg-white ">
        
         <div className="">
           <div className="text-center p-5 flex-auto justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 -m-1 flex items-center text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                   </svg>
                   <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 flex items-center text-red-500 mx-auto" viewBox="0 0 20 20" fill="currentColor">
     <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
   </svg>
                           <h2 className="text-xl font-bold py-4 ">Are you sure?</h2>
                           <p className="text-sm text-gray-900 px-8">Do you really want to delete the entry?
                   This process cannot be undone</p>    
           </div>
           <div className="p-3  mt-2 text-center space-x-4 md:block">
               <button onClick={()=>{
                setModelVisible(false);
                setSelectedRow({});
               }} className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100">
                   Cancel
               </button>
               <button onClick={()=>{
                handleDelete();
               }} className="mb-2 md:mb-0 bg-red-500 border border-red-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-red-600">Delete</button>
           </div>
         </div>
       </div>
     </div>
      
      )
     }

     {/*  Update Price */}
      {/*  Show Data and Edit option form */}
      {
        visible=='showData' && ( <>
          <div className='text-2xl text-black font-bold text-center my-2 p-2 flex justify-between'>Expense Entries for {selectedConsumer.c_name} <span  className=' flex justify-center align-middle'>
  <div onClick={handleViewAnother} className="bg-pink-400 rounded-lg text-center text-lg py-3 px-4">View Another</div></span>
  
  </div>
<section className="container px-4 mx-auto">
    <div className="flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden border border-gray-200  md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200 ">
                        <thead className="bg-gray-50 ">
                            <tr>
                                <th scope="col" className="py-3.5 px-4 text-xl font-normal text-left rtl:text-right text-gray-900 ">
                                    <div className="flex items-center gap-x-3">
                                       
                                        <button className="flex items-center gap-x-2">
                                            <span>Sr No.</span>
                                        </button>
                                    </div>
                                </th>

                                <th scope="col" className="px-4 py-3.5 text-xl font-semibold text-left rtl:text-right text-gray-900 ">
                                    Date
                                </th>

                                <th scope="col" className="px-4 py-3.5 text-xl font-semibold text-left rtl:text-right text-gray-900 ">
                                Remarks
                                </th>

                                <th scope="col" className="px-4 py-3.5 text-xl font-semibold text-left rtl:text-right text-gray-900 ">
                                Weight
                                </th>

                                <th scope="col" className="px-4 py-3.5 text-xl font-semibold text-left rtl:text-right text-gray-900 ">
                                  Expense Price
                                </th>
                                <th scope="col" className="px-4 py-3.5 text-xl font-semibold text-left rtl:text-right text-gray-900 ">
                                Type
                                </th>
                                {/* <th scope="col" className="px-4 py-3.5 text-xl font-semibold text-left rtl:text-right text-gray-900 ">
                                Fat
                                </th>
                                <th scope="col" className="px-4 py-3.5 text-xl font-semibold text-left rtl:text-right text-gray-900 ">
                                Snf
                                </th> */}
                                <th scope="col" className="px-4 py-3.5 text-xl font-semibold text-left rtl:text-right text-gray-900 ">
                                Total
                                </th>

                                <th scope="col" className="relative py-3.5 px-4">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200  ">
                            { fetched &&
                              fetched.map((item,index)=>{
                                return (
                                  <tr key={index}>
                                <td className="px-4 py-4 text-xl font-medium text-black  whitespace-nowrap">
                                    <div className="inline-flex items-center gap-x-3">
                                        <span>{id++}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-xl text-black  whitespace-nowrap">{format(new Date(item.pdate), 'dd-MM-yyyy')}</td>
                                <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                    <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-emerald-100/60 ">
                                       

                                        <h2 className="text-xl font-normal">{item.remarks}</h2>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-xl text-black whitespace-nowrap">
                                    <div className="flex items-center gap-x-2">
                                        <div>
                                            <h2 className="text-xl font-medium text-black ">{item.weight}</h2>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-xl text-gray-900  whitespace-nowrap">{item.pprice}</td>
                                <td className="px-4 py-4 text-xl font-medium text-gray-700 whitespace-nowrap">
                                    <div className={`inline-flex items-center px-3 py-1 rounded-full gap-x-2 ${item.ptype=='Buy'?'bg-emerald-300/60':'bg-red-300/60'} `}>
                                       

                                        <h2 className="text-xl font-normal">{item.ptype}</h2>
                                    </div>
                                </td>
                                {/* <td className="px-4 py-4 text-sm text-gray-900  whitespace-nowrap">{item.fat}</td>
                                <td className="px-4 py-4 text-sm text-gray-900  whitespace-nowrap">{item.snf}</td> */}
                                <td className="px-4 py-4 text-xl text-gray-900  whitespace-nowrap">{item.totalprice}</td>
                                <td className="px-4 py-4 text-xl whitespace-nowrap">
                                    <div className="flex items-center gap-x-6">
                                       

                                        <button onClick={()=>{
                                          setSelectedRow(item);
                                          setModelVisible(true);
                                        }} className="text-red-500 transition-colors duration-200  focus:outline-none">
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                                )
                              })
                            }                          
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

   
</section>

</>
        )
      }

    

     {/*  End */}
    </div>
  );
};




export default ViewExpense;
