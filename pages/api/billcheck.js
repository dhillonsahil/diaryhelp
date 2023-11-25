import pool from "@/lib/db";
const jwt = require('jsonwebtoken');

const handler = async(req,res)=>{
    const {token}= req.body;
    let key = process.env.JWT_SECRET;
    const username = jwt.verify(token,key).email.split('@')[0];

    try {
       const {type}=req.body;
       const {startDate,endDate,cid} =req.body;
       if(type=='overall'){
        //  if table exists
        pool.query(`SHOW TABLES LIKE '${username}_milk'`, (error, rows) => {
            if (error) {
                return res.status(400).json({ success: false, message: 'Unable to check table existence' });
            }
            if (rows.length == 0) {
                // Table does not exist, return empty array
                return res.status(200).json({ success: true, message: 'Table does not exist', data: [] });
            }

            pool.query(`select * from ${username}_milk where cid=? and pdate>=? and pdate <=? ORDER BY pdate ASC`,[cid,startDate,endDate],(error,rows)=>{
                if(error){
                    res.status(500).json({error:error.message,success:false})
                }else{
                    res.status(200).json({success:true,data:rows})
                }
            })
        })
       }else if(type=="Buy"){
        pool.query(`SHOW TABLES LIKE '${username}_milk'`, (error, rows) => {
            if (error) {
                return res.status(400).json({ success: false, message: 'Unable to check table existence' });
            }
            if (rows.length == 0) {
                // Table does not exist, return empty array
                return res.status(200).json({ success: true, message: 'Table does not exist', data: [] });
            }

            pool.query(`select * from ${username}_milk where cid=? and ptype='Buy' and pdate>=? and pdate <=? ORDER BY pdate ASC`,[cid,startDate,endDate],(error,rows)=>{
                if(error){
                    res.status(500).json({error:error.message,success:false})
                }else{
                    res.status(200).json({success:true,data:rows})
                }
            })
        })
       }else if(type=="Sell"){
        pool.query(`SHOW TABLES LIKE '${username}_milk'`, (error, rows) => {
            if (error) {
                return res.status(400).json({ success: false, message: 'Unable to check table existence' });
            }
            if (rows.length == 0) {
                // Table does not exist, return empty array
                return res.status(200).json({ success: true, message: 'Table does not exist', data: [] });
            }

            pool.query(`select * from ${username}_milk where cid=? and ptype='Sell' and pdate>=? and pdate <=? ORDER BY pdate ASC`,[cid,startDate,endDate],(error,rows)=>{
                if(error){
                    res.status(500).json({error:error.message,success:false})
                }else{
                    res.status(200).json({success:true,data:rows})
                }
            })
        })
       }
        
        
    } catch (error) {
        console.log("An error occurred")
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }

}

export default handler;