import React, { useEffect, useState } from 'react'
import { format } from 'date-fns';
const TotalResults = (props) => {

    const [fecthedUser,setFetchedUsers]=useState(props.fetchedUser || []);
    const [currentPage, setCurrentPage] = useState(1);
    const [sale,setSale]=useState(0);
    const [purchase,setPurchase] = useState(0);
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

  const getCalcs=async()=>{
    const resp  =await fetch(`https://diaryhelp.myrangolidesign.com/api/home`,{
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


  const getDaily=async()=>{
    
        const resp  =await fetch(`https://diaryhelp.myrangolidesign.com/api/home`,{
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
        }
        console.log(response.data)
    
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
            <div className="lg:w-1/3 mx-auto rounded-lg text-black px-6 py-4 font-semibold bg-gray-100 w-full m-2">Total Sale : {sale}</div>
            <div className="lg:w-1/3 mx-auto rounded-lg text-black font-semibold px-6 py-4 bg-gray-100 w-full m-2">Total Purchase : {purchase}</div>
        </div>
      <div className='text-center text-xl font-semibold' >Customer's Details</div>
      <div className="">
<div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
  <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
    <thead className="bg-gray-50">
      <tr>
        <th scope="col" className="px-6 py-4 font-medium text-gray-900">Id</th>
        <th scope="col" className="px-6 py-4 font-medium text-gray-900">Name</th>
        <th scope="col" className="px-6 py-4 font-medium text-gray-900">Amount Received</th>
        <th scope="col" className="px-6 py-4 font-medium text-gray-900">Amount Due</th>
        <th scope="col" className="px-6 py-4 font-medium text-gray-900">Over All</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-100 border-t border-gray-100">
        {
            fecthedUser && fecthedUser.slice(
                (currentPage - 1) * entriesPerPage,
                currentPage * entriesPerPage
              ).map((item,i)=>{
                return (
                    <tr key={i} className="text-black font-semibold hover:bg-gray-50">
                         <td class="px-6 py-4">{item.cid}</td>
                         <td class="px-6 py-4">{item.cname} S/d/w {item.fname}</td>
                         <td class="px-6 py-4">{Math.round(item.amountReceived)}</td>
                         <td class="px-6 py-4">{Math.round(item.amountDue)}</td>
                         <td class="px-6 py-4">{Math.round(item.amountReceived)-Math.round(item.amountDue)}</td>
                   
                    
                   
                    <th className="flex gap-3 px-6 py-4 font-normal text-gray-900">  
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
