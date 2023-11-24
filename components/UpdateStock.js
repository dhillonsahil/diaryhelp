import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';


const UpdateStock = (props) => {
    const router= useRouter();
    const [updatedStock,setUpdatedStock]=useState(0);
    const itemId=props.id;
    const token=props.token;
    const itemName=props.itemname;

    const handleUpdate =async()=>{
        if(updatedStock<=0){
          toast.error('stock cannot be zero', {
            position: "top-left",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light"
          })
        }else{
          const resp = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/items`,{
            method:'POST',
            headers:{
              'Content-Type':'application/json'
            },
            body:JSON.stringify({
              id:itemId,
              newStock:updatedStock,
              type:'updateStock',
              token:token
            })
          })
  
          const response = await resp.json();
          if(response.success==true){
            toast.success('Stock Updated!', {
              position: "top-left",
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
          });
          router.refresh();
        }else{
            toast.error("Unable to Update", {
              position: "top-left",
              autoClose: 1500,
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
  

  return (
    <div className="relative flex min-h-screen text-gray-800 antialiased flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12">
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
      <div className="relative py-3 sm:w-96 mx-auto text-center">
        <span className="text-2xl font-light">Update Stock : {itemName}</span>
        <div className="mt-4 bg-white shadow-md rounded-lg text-left">
          <div className="h-2 bg-purple-400 rounded-t-md"></div>
          <div className="px-8 py-6">
            <label className="block font-semibold">New Stock</label>
            <input type="text" placeholder="Stock" value={updatedStock==0?'':updatedStock} onChange={(e)=>setUpdatedStock(e.target.value)} className="border w-full h-5 px-3 py-5 mt-2 hover:outline-none focus:outline-none focus:ring-indigo-500 focus:ring-1 rounded-md" />
            
            <div className="flex justify-between items-baseline">
              <button onClick={()=>{
                handleUpdate();
              }} type="submit" className="mt-4 bg-purple-500 text-white py-2 px-6 rounded-md hover:bg-purple-600">Update Stock</button>
              <button onClick={()=>{
                props.setVisible('ViewItems') 
                props.setSelectedItem([]);
              }}  type="submit" className="mt-4 bg-purple-500 text-white py-2 px-6 rounded-md hover:bg-purple-600">Cancel</button>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdateStock
