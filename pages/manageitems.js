import WithSubnavigation from '@/components/navbar'
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { Card, CardHeader, CardBody, CardFooter ,Stack,Heading,Divider,ButtonGroup,Button ,Text} from '@chakra-ui/react'
import UpdatePrice from '@/components/UpdatePrice';
import UpdateStock from '@/components/UpdateStock';
import expiryCheck from '@/components/expiryCheck';

const ManageItems = () => {
    const [itemName,setItemName]=useState('');
    const [price,setPrice]=useState(0);
    const [quantity,setQuantity]=useState(0);
    const [token,setToken]=useState('')
    const [visible,setVisible]=useState('ViewItems');
    const [fetched,setFetched]=useState([]);
    const [selectedItem,setSelectedItem]=useState([])
    

    useEffect(() => {
      const tok =async()=>{
        let store = JSON.parse(localStorage.getItem('myUser'));
        if(store && store.token){
          setToken(store.token)
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
      if(token.length>0){
        fetchItems();
      }
    },[token])

    // fetch items
    const fetchItems =async()=>{
      const resp = await fetch(`https://diaryhelp.myrangolidesign.com/api/items`,{
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
      setFetched(response.data);
    }

    
    // handle add item
    const handleAdd =async(e)=>{
      e.preventDefault();
      const resp = await fetch(`https://diaryhelp.myrangolidesign.com/api/items`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          itemName:itemName,
          price:Number(price),
          quant:Number(quantity),
          type:'add',
          token:token
        })
      })

     

      const response = await resp.json();
      if(response.success==true){
        toast.success('Item Added !', {
          position: "top-left",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
      });

      setItemName('');
      setPrice('');
      setQuantity(0);

      }else{
        toast.error('An Error occurred !', {
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
        {
          (visible=="AddItem" || visible=="ViewItems") && (
            <div className='flex flex-row justify-center'>
          <div onClick={()=>setVisible('AddItem')} className="p-4 rounded-lg bg-black text-white hover:bg-primary m-2">Add Item</div>
          <div onClick={()=>setVisible('ViewItems')} className="p-4 rounded-lg bg-blue-400 hover:bg-primary m-2">View Items</div>
        </div>
          ) 
        }
        {
          visible=='AddItem' && (
            <>
            <div className="flex items-center justify-center p-12">
  <div className="mx-auto w-full max-w-[550px]">
    
      <div className="-mx-3 flex flex-wrap">
        <div className="w-full px-3 sm:w-1/2">
          <div className="mb-5">
            <label
              htmlFor="fName"
              className="mb-3 block text-base font-medium text-[#07074D]"
            >
              Item Name
            </label>
            <input
              type="text"
              name="fName"
              id="fName"
              value={itemName}
              onChange={(e)=>setItemName(e.target.value)}
              placeholder="Ghee / Khal"
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" required
            />
          </div>
        </div>
        <div className="w-full px-3 sm:w-1/2">
          <div className="mb-5">
            <label
              htmlFor="lName"
              className="mb-3 block text-base font-medium text-[#07074D]"
            >
              Stock Value 
            </label>
            <input
              type="numberez"
              name="lName"
              id="lName"
              value={quantity==0?'':quantity}
              onChange={(e)=>setQuantity(e.target.value)}
              placeholder="100"
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" required
            />
          </div>
        </div>
      </div>
      <div className="mb-5">
        <label
          htmlFor="guest"
          className="mb-3 block text-base font-medium text-[#07074D]"
        >
          Enter item Price
        </label>
        <input 
          type="number"
          name="guest"
          id="guest"
          placeholder="650"
          value={price==0?'':price}
          onChange={(e)=>setPrice(e.target.value)}
          min="0"
          className="w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" required
        />
      </div>

      <div>
        <button onClick={(e)=>handleAdd(e)}
          className="hover:shadow-form rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none"
        >
          Submit
        </button>
      </div>
    
  </div>
</div></>
          )
        }
        {/*  Manage Items */}
       {
        fetched.length>0 && visible=="ViewItems" && (
          <>
           <div className="mx-2 lg:flex-row lg:flex">
       {
        fetched.map((item,i)=>{
          return (
            <Card className='mx-2' key={i} maxW='sm'>
            <CardBody>
             
              <Stack mt='4' spacing='3'>
                <Heading size='md'>{item.itemName}</Heading>
                
                <Text color='blue.600' fontSize='2xl'>
                 Price:  {item.itemprice}
                </Text>
                <Text color='blue.600' fontSize='2xl'>
                 Remaining :  {item.itemquantity}
                </Text>
              </Stack>
            </CardBody>
            <Divider />
            <CardFooter>
              <ButtonGroup spacing='2'>
                <Button onClick={()=>{
                  setSelectedItem(item)
                  setVisible('UpdatePrice')
                }} variant='solid' colorScheme='blue'>
                  Update Price
                </Button>
                <Button onClick={()=>{
                  setSelectedItem(item);
                  setVisible('UpdateStock');

                }} variant='solid' colorScheme='blue'>
                  Update Stock
                </Button>
              </ButtonGroup>
            </CardFooter>
          </Card>
          
          )
        })
       }
        </div></>
        )
       }

       {
        fetched.length==0 && visible=='ViewItems' && (
          <div className='text-xl text-red-600 text-center'> No Data Inserted Please Enter an item Data
          </div>
        )
       }
       {
        visible=='UpdatePrice' && (
          <>
          <UpdatePrice setVisible={setVisible} setSelectedItem={setSelectedItem} itemname={selectedItem.itemName} id={selectedItem.id} token={token} />
          </>
        )
       }
       {
        visible=='UpdateStock' && (
          <>
          <UpdateStock  setVisible={setVisible} setSelectedItem={setSelectedItem} itemname={selectedItem.itemName} id={selectedItem.id} token={token} />
          </>
        )
       }
    </div>
  )
}

export default ManageItems
