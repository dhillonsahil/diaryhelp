import React, { useEffect, useState } from 'react'
import { format } from 'date-fns';
const TotalResults = (props) => {

    const [fecthedUser,setFetchedUsers]=useState(props.fetchedUser || []);
    const [currentPage, setCurrentPage] = useState(1);
    const [sale,setSale]=useState(0);
    const [evenSale,setEvenSale]=useState(0);
    const [evenPurchase,setEvenPurchase]=useState(0);
    const [milkcollected,setMilkCollected]=useState(0);
    const [milkSold,setMilkSold]=useState(0);
    const [purchase,setPurchase] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const token=props.token;
    const entriesPerPage = 10;
    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
      };
    
      const handlePrevPage = () => {
        if (currentPage > 1) {
          setCurrentPage((prevPage) => prevPage - 1);
        }
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
            setMilkCollected(response.milkcollected)
            setMilkSold(response.milksold)
        }
    
  }

  useEffect(()=>{
    if(token.length>0){
        getCalcs();
        getDaily();
    }
  },[token])

  return (
    <div>
        <div className="flex m-2 flex-col lg:flex-row">
            <div className="lg:w-1/6 mx-2 rounded-lg text-black px-6 py-4 font-semibold bg-gray-100 w-full m-2"> Morning Sale : ₹{sale.toFixed(2)}</div>
            <div className="lg:w-1/6 mx-2 rounded-lg text-black font-semibold px-6 py-4 bg-gray-100 w-full m-2">Morning Purchase : ₹{purchase.toFixed(2)}</div>
            <div className="lg:w-1/6 mx-2 rounded-lg text-black px-6 py-4 font-semibold bg-gray-100 w-full m-2"> Evening Sale : ₹{evenSale.toFixed(2)}</div>
            <div className="lg:w-1/6 mx-2 rounded-lg text-black font-semibold px-6 py-4 bg-gray-100 w-full m-2">Evening Purchase : ₹{evenPurchase.toFixed(2)}</div>
            <div className="lg:w-1/6 mx-2 rounded-lg text-black px-6 py-4 font-semibold bg-gray-100 w-full m-2">Total Milk Collected : {milkcollected.toFixed(2)}</div>
            <div className="lg:w-1/6 mx-2 rounded-lg text-black font-semibold px-6 py-4 bg-gray-100 w-full m-2">Total Milk Sold : {milkSold.toFixed(2)} </div>
        </div>
      <div className='text-center text-xl font-semibold' >Customer's Details</div>
      <div className="">
<div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
  <label htmlFor="search"className='font-semibold p-2 my-2'>Search Customer</label>
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
                         <td className={`p-2${item.amountDue>item.amountReceived?'text-red-500':'text-green-600'}`} >₹ {Math.round(item.amountReceived)-Math.round(item.amountDue)}</td>
                   
                    
                   
                    <th className="flex gap-3 p-2 font-normal text-gray-900">  
                      <div className="text-sm">
                        <div className="font-medium text-gray-700"></div>
                      </div>
                    </th>
            
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
    </div>
  )
}

export default TotalResults
