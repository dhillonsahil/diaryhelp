import pool from "@/lib/db";
const jwt = require('jsonwebtoken')

const handler =async(req,res)=>{
    const {token}= req.body;
    let key = process.env.JWT_SECRET;
    const username = jwt.verify(token,key).email.split('@')[0];
    try {
        const {startDate,endDate,cid} =req.body;
        pool.query(`select * from ${username}_milk where cid=? and pdate>=? and pdate <=? ORDER BY pdate ASC`,[cid,startDate,endDate],(error,rows)=>{
            if(error){
                res.status(500).json({error:error.message,success:false})
            }else{
                res.status(200).json({success:true,data:rows})
            }
        })
    } catch (error) {
        
    }
}

export default handler;