import React, { useEffect, useRef, useState } from 'react'

const CowRateList = (props) => {
    const snfValues=[70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100];
    const fatValues=[30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45];
    const [snfrate,setSnfRate] =useState(0)  // replace with your actual snfrate value
    const token= props.token;
    const [fatrate,setFatrate]=useState(0)
    // const snfrate = 30; // replace with your actual snfrate value
    // const fatrate = 0.80;
    // const token= props.token||'';
    const componentRef = useRef(null);


    useEffect(()=>{
        if(token.length>0){
            const data={
                type:'specific',
                stype:'cowfat',
                token:token
            }
            getVal(data);
            getVal2()
        }
    },[token])

    const handleDownloadPDF = () => {
      if (componentRef.current) {
            const  html2pdf  =require('html2pdf.js')
        // Specify the filename in the options
        const options = {
          filename: 'cowratelist.pdf',
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


    const getVal =async(data)=>{
        const resp= await fetch(`https://milkmanage.in/api/milkprice`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify(data)
        });

        const response = await resp.json();
        if(response.success){
            setFatrate(response.data[0].price)
        }
    }
    const getVal2 =async()=>{
        const data={
            type:'specific',
            stype:'cowsnf',
            token:token
        }
        const resp= await fetch(`https://milkmanage.in/api/milkprice`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify(data)
        });

        const response = await resp.json();
        if(response.success){
            setSnfRate(response.data[0].price)
        }
    }

    const calculateFatPrice = (fat, snf) => {
        return ((snfrate + (Number(fat) - 30) * fatrate) * Number(snf)) / 85;
      };



  return (
    <div>
        <div className="flex flex-wrap -mx-3 mb-5">
  <div className="w-full max-w-full  mb-6  mx-auto">
    <div className="relative flex-[1_auto] flex flex-col break-words min-w-0 bg-clip-border rounded-[.95rem] bg-white ">
      <div className="relative flex flex-col min-w-0 break-words border border-solid bg-clip-border rounded-2xl border-stone-200 bg-light/30">
      
        <div className="px-9 pt-5 flex justify-between items-stretch flex-wrap min-h-[70px] pb-0 bg-transparent">
          <h3 className="flex flex-col items-start justify-center m-2 ml-0 font-medium text-xl/tight text-dark">
            {/* <span className=" font-semibold text-dark">Cow Milk Rate</span> */}
            <span className=" font-normal text-lg text-dark">All Price Details</span>
            <button onClick={handleDownloadPDF} className='bg-red-500 text-white p-3 rounded-lg' >

            <span className=" font-normal text-lg text-dark">Download Pdf</span>
            </button>
          </h3>
        </div>
        <div className="flex-auto block py-8 pt-6 px-9">
          <div  ref={(el) => (componentRef.current = el)}  className="overflow-x-auto">
          <span className=" font-semibold text-dark">Cow Milk Rate</span>
            <table className="w-full my-0 align-middle text-dark border-neutral-500">
              <thead className="align-bottom">
                <tr className=" text-[0.5rem] text-secondary-dark">
                  <th className="border-black border-solid border-2 p-1 text-start">Fat/Snf</th>
                  {
              snfValues.map((item,i)=>{
                  return (
                      <th className="text-end text-sm border-black border-solid border-2" key={i}>{item/10}   </th>
                  )
              })
      }
                 
                </tr>
              </thead>
              <tbody className='border-2 border-solid border-black'>
               
                {
          fatValues.map((item,i)=>{
              return (

                // start here
<tr key={i} className="border-black border-solid border-2">
                  <td className="  border-black border-solid border-2">
                      
                      <div className="flex flex-col justify-start ">
                        <div  className="mb-1  font-semibold transition-colors duration-200 ease-in-out text-sm text-secondary-inverse hover:text-primary"> {item/10} </div>
                      </div>
                  </td>
                  {
                          snfValues.map((item2,i2)=>{
                              return (
                                <td key={i2} className="  border-black border-solid border-2">
                      
                                <div className="flex flex-col justify-start">
                                  <div  className="mb-1 font-semibold transition-colors duration-200 ease-in-out text-sm text-secondary-inverse hover:text-primary"> {calculateFatPrice(item, item2).toFixed(2) } </div>
                                </div>
                            </td>
                                  
                              )
                          })
                      }
                </tr>
                // end here

               
              )
          })
      }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
    </div>
  )
}

export default CowRateList
