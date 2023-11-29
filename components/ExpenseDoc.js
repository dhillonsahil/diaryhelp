import React, { forwardRef, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

const ExpenseDoc = forwardRef((props, ref) => {
  const [fetched, setFetched] = useState(props.fetched);
  const [totalDue,setTotalDue]=useState(0);
  const [totalReceived,setTotalReceived]=useState(0);
  const [token,setToken]=useState(props.token);
  const [diary,setDiary]=useState({});
  const consumer=props.selectedConsumer;
  const startDate=props.startDate
  const endDate=props.endDate;

  const router = useRouter();
  
  const fdate = (date) => {
    return format(date, 'dd-MM-yyyy');
  };
  let id = 1;

  useEffect(()=>{
    try {
        var due =0;
        var received=0;
        fetched.forEach(item => {
            if(item.ptype=="Sell"){
                due+=item.totalprice;
            }else{
                received+=item.totalprice;
            }
        });

        setTotalDue(due);
        setTotalReceived(received);
    } catch (error) {
        
    }
  },[fetched])

  
  useEffect(()=>{
   if(token.length>0){
    try {
        const getDt =async()=>{
            const resp = await fetch(`http://localhost:3000/api/getdetails`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },body:JSON.stringify({token:token,type:'view'})
            })

            const response = await resp.json();
          if(response.data.length==0){
            router.push('/diarydetails')
          }else{
            setDiary(response.data)
          }
        }
        getDt();
    } catch (error) {
        
    }
   }
  },[token])
  

  return (
    <div className='mx-1 p-1 my-2' ref={ref}>
       <div id='diarydetails' className="border-2 border-black">
       <div className="text-center text-2xl font-bold">{diary.d_name}</div>
       <div className="text-center text-xl font-medium">{diary.address}</div>
       <div className="flex flex-row justify-between mx-2 py-1 ">
       <div className="text-center text-xl font-medium">{diary.c_name}</div>
       <div className="text-center text-xl font-medium">{diary.mobile}</div>
       </div>
       </div>
       <div id='customerDetails' className="border-2 border-black">
        <div className="flex flex-row justify-between font-semibold mx-2">
        <div className="">Customer Name: {consumer.c_name} S/d/w {consumer.father_name}</div>
        <div className="">Address : {consumer.address}</div>
        </div>
        <div className="flex flex-row justify-between font-semibold mx-2">
        <div className="">Mobile : {consumer.mobile}</div>
        <div className="">Customer Code : {consumer.id}</div>
        </div>
        <div className=" mx-2 font-semibold">Bill Date : {String(fdate(startDate))} to {String(fdate(endDate))}</div>
       </div>
     <table
          className="min-w-full border border-black text-center text-sm font-light "
          style={{ fontSize: '0.75rem' }} >
          <thead className="border-b  ">
            <tr>
              <th
                scope="col"
                className="border-r   ">
                Sr.
              </th>
              <th
                scope="col"
                className="border-r   ">
                Date 
              </th>
              <th
                scope="col"
                className="border-r   ">
                Quantity
              </th>
              
              <th
                scope="col"
                className="border-r   ">
                Item Price
              </th>
              <th
                scope="col"
                className="border-r   ">
                <div className="flex flex-col">
                  <div className="">Credit</div>
                  {/* <div className="text-xs">(दूध वाले ने खरीदा)</div> */}
                </div>
              </th>
              <th
                scope="col"
                className="border-r  ">
                <div className="flex flex-col">
                  <div className="">Debit</div>
                  {/* <div className="text-xs">(दूध वाले ने बेचा)</div> */}
                </div>
              </th>
              <th
                scope="col"
                className="border-r   ">
                Remarks
              </th>
            </tr>
          </thead>
          <tbody>
           {
             fetched.map((item,i)=>{
              return (
                <tr key={i} className="text-black border-b font-semibold">
                <td
                  className="whitespace-nowrap border-r   font-medium ">
                  {id++}
                </td>
                <td
                  className="whitespace-nowrap text-black border-r  ">
                  {String(fdate(new Date(item.pdate)))}
                </td>
                <td
                  className="whitespace-nowrap border-r   ">
                  {item.weight}
                </td>
                <td
                  className="whitespace-nowrap border-r   ">
                  {item.pprice}
                </td>
                <td
                  className="text-green-500 whitespace-nowrap border-r   ">
                  {item.ptype=="Buy"?item.totalprice:"-"}
                </td>
                <td
                  className="text-red-500 whitespace-nowrap border-r   ">
                  {item.ptype=="Sell"?item.totalprice:"-"}
                </td>
                <td
                  className="whitespace-nowrap border-r   ">
                  {item.remarks}
                </td>
              </tr>
              )
            })
           }
          
            
          </tbody>
        </table>
        <div className='flex border-2 border-black flex-row justify-between'>
          <div className="whitespace-nowrap px-6 py-4 text-black font-bold text-sm">Total Purchase : {Math.round(totalReceived)}</div>
          <div className="whitespace-nowrap px-6 py-4 text-black font-bold text-sm">Total Sell : {Math.round(totalDue)}</div>
          <div  className={`whitespace-nowrap px-6 py-4  text-black font-bold text-sm ${Math.round(totalReceived)>Math.round(totalDue)?'text-green-500':'text-red-500'}`}> Overall : ₹{Math.round(totalReceived-totalDue)}</div>
        </div>
    </div>
  );
});

export default ExpenseDoc;
