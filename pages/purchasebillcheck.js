import WithSubnavigation from '@/components/navbar';
import React, { useEffect, useRef, useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import expiryCheck from '@/components/expiryCheck';
import { useReactToPrint } from 'react-to-print';


import PrintDoc from '@/components/PrintDoc';
import PurchaseDoc from '@/components/PurchasePrint';

const PurchaseBill = () => {
    const [token, setToken] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [consumerCode, setConsumerCode] = useState('');
    const [selectedConsumer, setSelectedConsumer] = useState(null);
    const [customers,setCustomers]=useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [fetched,setFetched]=useState([]);
    // const [ visible,setVisible ]=useState('userInput');
    const [selectedRow,setSelectedRow]=useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 10;
  
    const router = useRouter();

    // useEffect(() => {
    // }, [fetched]);
    
    const componentRef = useRef(null);

    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
    });
  
    let id=1;
    const handleNextPage = () => {
      setCurrentPage((prevPage) => prevPage + 1);
    };
  
    const handlePrevPage = () => {
      if (currentPage > 1) {
        setCurrentPage((prevPage) => prevPage - 1);
      }
    };

   
    const handleDownloadPDF = () => {
      if (fetched && componentRef.current) {
            const  html2pdf  =require('html2pdf.js')
        // Specify the filename in the options
        const options = {
          filename: 'Purchasebill.pdf',
          // margin: { top: 2, right: 2, bottom: 2, left: 2 },
          margin: [1,2,2,2],
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        };
    
        // Use html2pdf with options
        html2pdf().from(componentRef.current).set(options).save();
      }
    };

  
    

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
        expiryCheck();
       tok();
      } catch (error) {
        console.log("Error: " , error)
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
            setFetched(null)
            setStartDate(date);
        };
        const handleEndDate = (date) => {
          setFetched(null)
            setEndDate(date);
    
        };
        

        const formatDateForSQL = (date) => {
          return format(date, "yyyy-MM-dd");
      };
        const fdate = (date) => {
          return format(date, "dd-MM-yyyy");
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


          

        const handleSubmit= async ()=>{
          

          if(consumerCode!=''){
          const data={
            token:token,
            cid:selectedConsumer.id,
            startDate:formatDateForSQL(startDate),
            endDate:formatDateForSQL(endDate),
            type:'Buy'
          }

          const resp = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/billcheck`,{
            method:"POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          })

          const response = await resp.json();
          if(response.success){
            setFetched(response.data)
            // setVisible('Entries')
          }
        }else{
          toast.error('Select Customer!', {
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

       
            <div className={``}>
          {/*  Get User Data Form */}
      
         <div className="m-auto lg:mx-6">
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
            <span className="pl-2 mx-1">Purchase Bill Check</span>
          </button>
          <div className="mt-5 bg-white rounded-lg shadow">
            <div className="px-5 pb-5">

              <input
                placeholder="Customer Code"
                value={consumerCode}
                onChange={handleInputChange}
                name='consumerCode'
                id='consumerCode'
                className="text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200 focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400" required
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
                <div className="flex-grow w-1/2 pr-2">
                <label htmlFor="date" className='px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400'>From : </label>
              <DatePicker dateFormat={'dd-MM-yyyy'} className='border-black border-2 px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200 focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400' selected={startDate} onChange={handleStartDate} />
                </div>                
               <div className="flex-grow w-1/2 pr-2">
               <label htmlFor="date" className='px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400'>To : </label>
              <DatePicker dateFormat={'dd-MM-yyyy'} className='border-black border-2 px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200 focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400' selected={endDate} onChange={handleEndDate} />

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
                  <span className="pl-2 mx-1">Bill Check</span>
                </button>
              </div>
              <div className="flex-initial">
                <button onClick={()=>{
                  setConsumerCode('');
                  setSelectedConsumer(null);
                  setFetched(null)
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
         
         {/* Entries */}
         {
          fetched && (
            <>
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
            <span className="pl-2 mx-1">All Milk Entries</span>
          </button>
          <div className="flex flex-col">
  <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
      <div className="overflow-hidden">
        <table
          className="min-w-full border text-center text-sm font-light dark:border-neutral-500">
          <thead className="border-b font-medium dark:border-neutral-500">
            <tr>
              <th
                scope="col"
                className="border-r px-6 py-4 dark:border-neutral-500">
                Sr No.
              </th>
              <th
                scope="col"
                className="border-r px-6 py-4 dark:border-neutral-500">
                Date & Shift
              </th>
              <th
                scope="col"
                className="border-r px-6 py-4 dark:border-neutral-500">
                Weight
              </th>
              <th
                scope="col"
                className="border-r px-6 py-4 dark:border-neutral-500">
                Fat
              </th>
              <th
                scope="col"
                className="border-r px-6 py-4 dark:border-neutral-500">
                Snf
              </th>
              <th
                scope="col"
                className="border-r px-6 py-4 dark:border-neutral-500">
                Milk Rate
              </th>
              <th
                scope="col"
                className="border-r px-2 py-4 dark:border-neutral-500">
                <div className="flex flex-col">
                  <div className="">Credit</div>
                  <div className="text-sm">(दूध वाले ने खरीदा)</div>
                </div>
              </th>
              <th
                scope="col"
                className="border-r px-2 py-4 dark:border-neutral-500">
                <div className="flex flex-col">
                  <div className="">Debit</div>
                  <div className="text-sm">(दूध वाले ने बेचा)</div>
                </div>
              </th>
              <th
                scope="col"
                className="border-r px-6 py-4 dark:border-neutral-500">
                Remarks
              </th>
            </tr>
          </thead>
          <tbody>
           {
            fetched && fetched.slice(
              (currentPage - 1) * entriesPerPage,
              currentPage * entriesPerPage
            )
.map((item)=>{
              return (
                <tr className="text-black border-b font-bold">
                <td
                  className="whitespace-nowrap border-r px-6 py-4 font-medium ">
                  {id++}
                </td>
                <td
                  className="whitespace-nowrap text-black border-r px-6 py-4">
                  {String(fdate(new Date(item.pdate)))} {item.pshift!=""?"-":''} {item.pshift=="Morning"?"M":""} {item.pshift=="Evening"?"E":""}
                </td>
                <td
                  className="whitespace-nowrap border-r px-6 py-4 dark:border-neutral-500">
                  {item.weight}
                </td>
                <td
                  className="whitespace-nowrap border-r px-6 py-4 dark:border-neutral-500">
                  {item.fat}
                </td>
                <td
                  className="whitespace-nowrap border-r px-6 py-4 dark:border-neutral-500">
                  {item.snf}
                </td>
                <td
                  className="whitespace-nowrap border-r px-6 py-4 dark:border-neutral-500">
                  {item.pprice}
                </td>
                <td
                  className="whitespace-nowrap border-r px-6 py-4 dark:border-neutral-500">
                  {item.ptype=="Buy"?item.totalprice:"-"}
                </td>
                <td
                  className="whitespace-nowrap border-r px-6 py-4 dark:border-neutral-500">
                  {item.ptype=="Sell"?item.totalprice:"-"}
                </td>
                <td
                  className="whitespace-nowrap border-r px-6 py-4 dark:border-neutral-500">
                  {item.remarks}
                </td>
              </tr>
              )
            })
           }
            
          </tbody>
        </table>
            <div className="flex mx-4 justify-between p-3">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="flex items-center px-3 py-2 font-medium text-black capitalize rounded-md hover:bg-gray-200 focus:outline-none transition duration-300 transform active:scale-95 ease-in-out"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={
                currentPage * entriesPerPage >= fetched.length
              }
              className="flex items-center px-3 py-2 font-medium text-black capitalize rounded-md hover:bg-gray-200 focus:outline-none transition duration-300 transform active:scale-95 ease-in-out"
            >
              Next
            </button>
          </div>
          <button className='bg-black p-4 text-center text-white rounded-lg m-2 w-[95vw] mx-4' onClick={() => setTimeout(() => handlePrint(), 100)}>Print Bill</button>
          <button className='bg-red-600 p-4 text-center text-white rounded-lg m-2 w-[95vw] mx-4' onClick={handleDownloadPDF}
            >Download Pdf</button>
          {/* {fetched.length>0 && <PrintDoc fetched={fetched}  ref={componentRef} /> } */}
          {fetched.length>0 && <PurchaseDoc  selectedConsumer={selectedConsumer} startDate={startDate} endDate={endDate} token={token} fetched={fetched} ref={(el) => (componentRef.current = el)} />}
          
      </div>
    </div>
  </div>
</div>
</>
          )
         }

     {/*  End */}
    </div>
  );
};




export default PurchaseBill;