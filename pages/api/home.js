import pool from "@/lib/db";
const jwt = require('jsonwebtoken')

const handler = async( req,res)=>{
    const {type, token}= req.body;
    let key = process.env.JWT_SECRET;
    const username = jwt.verify(token,key).email.split('@')[0];
   try {
    if(type=='tcustomers'){
        var totalCust=0;
        var snf=0;
        var fat=0;
        var regular=0;
        pool.query(`select * from ${username}_customers`,(error,rows)=>{
            if(error){
                return res.status(400).json({success:false,message:'Unable to retrieve'})
            }
            totalCust=rows.length;

            // get milk prices
            pool.query(`select * from ${username}_milkprice where mtype='regular'`,(error,rows)=>{
                regular=rows[0].price
                pool.query(`select * from ${username}_milkprice where mtype='buffalofat'`,(error,rows)=>{
                    fat=rows[0].price;
                    pool.query(`select * from ${username}_milkprice where mtype='cowsnf'`,(error,rows)=>{
                        snf=rows[0].price;
                        return res.status(200).json({success:true,totalCust , snf,fat,regular})
                    })
                })
            })
            


        })
    }
   } catch (error) {
    return res.status(500).json({success:false,message:"Add data to check dashboard"})
   }

}

export default handler;