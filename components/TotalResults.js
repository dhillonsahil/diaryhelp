import React, { useEffect, useState } from 'react'
import { format } from 'date-fns';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TotalResults = (props) => {
  const [startDate, setStartDate] = useState(new Date());
  const [milkentriesDate, setMilkEntriesDate] = useState(new Date());
    const [fecthedUser,setFetchedUsers]=useState(props.fetchedUser || []);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentMilkPage, setCurrentMilkPage] = useState(1);
    const [sale,setSale]=useState(0);
    const [evenSale,setEvenSale]=useState(0);
    const [evenPurchase,setEvenPurchase]=useState(0);
    const [purchase,setPurchase] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchQuery2, setSearchQuery2] = useState('');
    const [milkData,setMilkData] = useState([])
    const token=props.token;
    const entriesPerPage = 10;
    const milkEntriesperPage = 25;
    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
      };
    
      const handlePrevPage = () => {
        if (currentPage > 1) {
          setCurrentPage((prevPage) => prevPage - 1);
        }
      };

      const handleNextMilkPage = () => {
        setCurrentMilkPage((prevPage) => prevPage + 1);
      };
    
      const handlePrevMilkPage = () => {
        if (currentMilkPage > 1) {
          setCurrentMilkPage((prevPage) => prevPage - 1);
        }
      };

      const handleStartDate = (date) => {
        setStartDate(date);
        
    };
      const handleEntriesDate = (date) => {
        setMilkEntriesDate(date);
        totalEntries(date)
        
    };
      const formatDateForSQL = (date) => {
        return format(date, "yyyy-MM-dd");
    };

     const filteredConsumers = fecthedUser.filter((consumer) => {
            const { cname, cid } = consumer;
            const query = searchQuery.toLowerCase();
            return (
              cname.toLowerCase().includes(query) ||
              // father_name.toLowerCase().includes(query) ||
              // mobile.includes(query) ||
              cid.toString().includes(query)
            );
          });

          const filteredConsumers2 = milkData.filter((consumer) => {
            const { cname, cid } = consumer;
            const query = searchQuery2.toLowerCase();
            return (
              cname.toLowerCase().includes(query) ||
              // father_name.toLowerCase().includes(query) ||
              // mobile.includes(query) ||
              cid.toString().includes(query)
            );
          });


  const getCalcs=async()=>{
    const resp  =await fetch(`http://localhost:3000/api/home`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },body:JSON.stringify({
        token:token,
        type:"getcalc"
      })
    })
    const response = await resp.json();
    if(response.success==true){
       
        setFetchedUsers(response.data);
    }
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);

  };

  const handleSearchChange2 = (e) => {
    setSearchQuery2(e.target.value);

  };
  const totalEntries=async(date)=>{
    
    const resp  =await fetch(`http://localhost:3000/api/home`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },body:JSON.stringify({
        token:token,
        cdate:formatDateForSQL(date) ,
        type:"todayentries"
      })
    })
    const response = await resp.json();
    if(response.success==true){
        setMilkData(response.data)
    }

}

  const getDaily=async()=>{
    
        const resp  =await fetch(`http://localhost:3000/api/home`,{
          method:"POST",
          headers:{
            "Content-Type":"application/json",
          },body:JSON.stringify({
            token:token,
            tdate:formatDateForSQL(new Date()) ,
            type:"todaysale"
          })
        })
        const response = await resp.json();
        if(response.success==true){
            setSale(response.sale);
            setPurchase(response.purchase);
            setEvenSale(response.eventingSale);
            setEvenPurchase(response.eveingPurchase);
        }
    
  }

  let id=1;
  useEffect(()=>{
    if(token.length>0){
        getCalcs();
        getDaily();
        totalEntries(new Date());
    }
  },[token])

  return (
    <div>
        <div className="flex m-2 flex-col lg:flex-row">
            <div className="lg:w-1/6 mx-2 rounded-lg text-black px-6 py-4 font-semibold bg-gray-100 w-full m-2"> Morning Sale : ₹{sale.toFixed(2)}</div>
            <div className="lg:w-1/6 mx-2 rounded-lg text-black font-semibold px-6 py-4 bg-gray-100 w-full m-2">Morning Purchase : ₹{purchase.toFixed(2)}</div>
            <div className={`lg:w-1/6 mx-2 rounded-lg text-black px-6 py-4 font-semibold bg-gray-100 w-full m-2 ${purchase>sale?'text-green-800':'text-red-500'}`}>Morning Overall : ₹{Math.round(purchase-sale)}</div>
            <div className="lg:w-1/6 mx-2 rounded-lg text-black px-6 py-4 font-semibold bg-gray-100 w-full m-2"> Evening Sale : ₹{evenSale.toFixed(2)}</div>
            <div className="lg:w-1/6 mx-2 rounded-lg text-black font-semibold px-6 py-4 bg-gray-100 w-full m-2">Evening Purchase : ₹{evenPurchase.toFixed(2)}</div>
            <div className={`lg:w-1/6 mx-2 rounded-lg text-black px-6 py-4 font-semibold bg-gray-100 w-full m-2 ${evenPurchase>evenSale?'text-green-800':'text-red-500'}`}>Evening Overall : ₹{Math.round(evenPurchase-evenSale)}</div>
        </div>
      <div className='text-center text-xl font-semibold' >Customer's OverAll Balance</div>
      <div className="">
<div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
  <div className="">
  <DatePicker dateFormat={'dd-MM-yyyy'} className="text-black w-full px-4 py-2.5 mt-2 transition duration-500 ease-in-out transform  rounded-lg  text-2xl font-bold ring-offset-2 border-2 border-black" selected={startDate} onChange={handleStartDate} />
  <div className="">

  <label htmlFor="searchQuery"className='font-semibold p-2 my-2'>Search Customer</label>
  </div>
  </div>
      <input 
                value={searchQuery}
                id='searchQuery'
                onChange={handleSearchChange}
                className="text-black my-1 mx-2 w-full px-4 py-2.5 mt-2 transition duration-500 ease-in-out transform  rounded-lg  text-2xl font-bold ring-offset-2 border-2 border-black"
              />
 
<div className="flex flex-col">
  <div className="overflow-x-auto sm:mx-0.5 lg:mx-0.5">
    <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
      <div className="overflow-hidden">
        <table className="min-w-full">
        <thead className="bg-gray-50">
      <tr>
        <th  className="p-2 font-medium text-gray-900">Id</th>
        <th className="p-2 font-medium text-gray-900">Name</th>
        <th  className="p-2 font-medium text-gray-900">Credit</th>
        <th  className="p-2 font-medium text-gray-900">Debit</th>
        <th  className="p-2 font-medium text-gray-900">Over All</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-100 border-t border-gray-100">
        {
            fecthedUser && filteredConsumers.slice(
                (currentPage - 1) * entriesPerPage,
                currentPage * entriesPerPage
              ).map((item,i)=>{
                return (
                    <tr key={i} className="text-black font-semibold hover:bg-gray-50">
                         <td className="p-2">{item.cid}</td>
                         <td className="p-2">{item.cname} S/d/w {item.fname}</td>
                         <td className="p-2 text-green-600 font-semibold">{Math.round(item.amountReceived)}</td>
                         <td className="p-2 text-red-500 font-semibold">{Math.round(item.amountDue)}</td>
                         <td className={`p-2 ${Number(item.amountDue)>Number(item.amountReceived)?'text-red-500':'text-green-600'}`} >₹ {Math.round(item.amountReceived)-Math.round(item.amountDue)}</td>
                   
                    
                   
                    {/* <th className="flex gap-3 p-2 font-normal text-gray-900">  
                      <div className="text-sm">
                        <div className="font-medium text-gray-700"></div>
                      </div>
                    </th> */}
            
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
                currentPage * entriesPerPage >= fecthedUser.length
              }
              className="flex items-center px-3 py-2 font-medium text-black capitalize rounded-md hover:bg-gray-200 focus:outline-none transition duration-300 transform active:scale-95 ease-in-out"
            >
              Next
            </button>
    </div>

</div>
      </div>
      {/*  Total Collection according to date */}
      <section className="container px-4 mx-auto">
        <div className="text-xl text-center my-2 font-bold">Today's Collection</div>
        <div className="">
  <DatePicker dateFormat={'dd-MM-yyyy'} className="text-black w-full px-4 py-2.5 mt-2 transition duration-500 ease-in-out transform  rounded-lg  text-2xl font-bold ring-offset-2 border-2 border-black" selected={milkentriesDate} onChange={handleEntriesDate} />
  <div className="">

  <label htmlFor="searchQuery1" className='font-semibold p-2 my-2'>Search Customer</label>
  </div>
  </div>
      <input 
                value={searchQuery2}
                id='searchQuery2'
                onChange={handleSearchChange2}
                className="text-black my-1 mx-2 w-full px-4 py-2.5 mt-2 transition duration-500 ease-in-out transform  rounded-lg  text-2xl font-bold ring-offset-2 border-2 border-black"
              />
    <div className="flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden border border-gray-200  md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200 ">
                        <thead className="bg-gray-50 ">
                            <tr>
                                <th scope="col" className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-900 ">
                                    <div className="flex items-center gap-x-3">
                                       
                                        <button className="flex items-center gap-x-2">
                                            <span>Cid</span>
                                        </button>
                                    </div>
                                </th>

                                <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-900 ">
                                    Name 
                                </th>
                                <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-900 ">
                                    Date
                                </th>

                                <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-900 ">
                                Shift
                                </th>

                                <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-900 ">
                                Weight
                                </th>

                                <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-900 ">
                                Fat
                                </th>
                                <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-900 ">
                                Snf
                                </th>
                                <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-900 ">
                                  Milk Rate
                                </th>
                               
                               
                               
                                <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-900 ">
                                Total
                                </th>

                                
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 ">
                            { milkData && 
                              filteredConsumers2.slice(
                                (currentMilkPage - 1) * milkEntriesperPage,
                                currentMilkPage * milkEntriesperPage
                              ).map((item,index)=>{
                                return (
                                  <tr key={index}>
                                <td className="px-4 py-4 text-lg font-medium text-black  whitespace-nowrap">
                                    <div className="inline-flex items-center gap-x-3">
                                        <span>{item.cid}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-xl text-black  whitespace-nowrap">{item.cname} s/d/w {item.fname}</td>
                                <td className="px-4 py-4 text-xl text-black  whitespace-nowrap">{format(new Date(item.pdate), 'dd-MM-yyyy')}</td>
                                <td className="px-4 py-4 text-lg font-medium text-gray-700 whitespace-nowrap">
                                    <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-emerald-100/60 ">
                                       

                                        <h2 className="text-lg font-normal">{item.pshift=='Morning'?'M':"E"}</h2>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-lg text-black whitespace-nowrap">
                                    <div className="flex items-center gap-x-2">
                                        <div>
                                            <h2 className="text-lg font-medium text-black  ">{item.weight}</h2>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-lg text-gray-900  whitespace-nowrap">{item.fat}</td>
                                <td className="px-4 py-4 text-lg text-gray-900  whitespace-nowrap">{item.snf}</td>
                                <td className="px-4 py-4 text-lg text-gray-900  whitespace-nowrap">{item.pprice}</td>
                              
                                <td className={`px-4 py-4 text-sm font-semibold text-gray-900  whitespace-nowrap ${item.ptype=='Buy'?'text-green-600':'text-red-500'}`}>{item.totalprice}</td>
                               
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

   
    <div className="flex mx-4 justify-between p-3">
            <button
              onClick={handlePrevMilkPage}
              disabled={currentMilkPage === 1}
              className="flex items-center px-3 py-2 font-medium text-black capitalize rounded-md hover:bg-gray-200 focus:outline-none transition duration-300 transform active:scale-95 ease-in-out"
            >
              Previous
            </button>
            <button
              onClick={handleNextMilkPage}
              disabled={
                currentMilkPage * milkEntriesperPage >= milkData.length
              }
              className="flex items-center px-3 py-2 font-medium text-black capitalize rounded-md hover:bg-gray-200 focus:outline-none transition duration-300 transform active:scale-95 ease-in-out"
            >
              Next
            </button>
    </div>

</section>


    </div>
  )
}

export default TotalResults
