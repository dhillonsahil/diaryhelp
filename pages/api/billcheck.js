import pool from "@/lib/db";
const jwt = require('jsonwebtoken');

const handler = async(req,res)=>{
    const {token}= req.body;
    let key = "Iam@User";
    const username = jwt.verify(token,key).email.split('@')[0];

    try {
       const {type}=req.body;
       const {startDate,endDate,cid} =req.body;
       if(type=='overall'){
        //  if table exists
        pool.getConnection((error, connection) => {
            if (error) {
                return res.status(400).json({ success: false, message: 'Unable to get database connection' });
            }
            connection.query(`SHOW TABLES LIKE '${username}_milk'`, (error, rows) => {
                if (error) {
                    connection.release();
                    return res.status(400).json({ success: false, message: 'Unable to check table existence' });
                }
                if (rows.length == 0) {
                    connection.release();
                    // Table does not exist, return empty array
                    return res.status(200).json({ success: true, message: 'Table does not exist', data: [] });
                }

                connection.query(`select * from ${username}_milk where cid=? and pdate>=? and pdate <=? ORDER BY pdate ASC`,[cid,startDate,endDate],(error,rows)=>{
                    connection.release();
                    if(error){
                        res.status(500).json({error:error.message,success:false})
                    }else{
                        res.status(200).json({success:true,data:rows})
                    }
                })
            })
        })
       }else if(type=="Buy"){
        pool.getConnection((error, connection) => {
            if (error) {
                return res.status(400).json({ success: false, message: 'Unable to get database connection' });
            }
            connection.query(`SHOW TABLES LIKE '${username}_milk'`, (error, rows) => {
                if (error) {
                    connection.release();
                    return res.status(400).json({ success: false, message: 'Unable to check table existence' });
                }
                if (rows.length == 0) {
                    connection.release();
                    // Table does not exist, return empty array
                    return res.status(200).json({ success: true, message: 'Table does not exist', data: [] });
                }

                connection.query(`select * from ${username}_milk where cid=? and ptype='Buy' and pdate>=? and pdate <=? ORDER BY pdate ASC`,[cid,startDate,endDate],(error,rows)=>{
                    connection.release();
                    if(error){
                        res.status(500).json({error:error.message,success:false})
                    }else{
                        res.status(200).json({success:true,data:rows})
                    }
                })
            })
        })
       }else if(type=="Sell"){
        pool.getConnection((error, connection) => {
            if (error) {
                return res.status(400).json({ success: false, message: 'Unable to get database connection' });
            }
            connection.query(`SHOW TABLES LIKE '${username}_milk'`, (error, rows) => {
                if (error) {
                    connection.release();
                    return res.status(400).json({ success: false, message: 'Unable to check table existence' });
                }
                if (rows.length == 0) {
                    connection.release();
                    // Table does not exist, return empty array
                    return res.status(200).json({ success: true, message: 'Table does not exist', data: [] });
                }

                connection.query(`select * from ${username}_milk where cid=? and ptype='Sell' and pdate>=? and pdate <=? ORDER BY pdate ASC`,[cid,startDate,endDate],(error,rows)=>{
                    connection.release();
                    if(error){
                        res.status(500).json({error:error.message,success:false})
                    }else{
                        res.status(200).json({success:true,data:rows})
                    }
                })
            })
        })
       }else if(type=='expense'){
        pool.getConnection((error, connection) => {
            if (error) {
                return res.status(400).json({ success: false, message: 'Unable to get database connection' });
            }
            connection.query(`SHOW TABLES LIKE '${username}_milk'`, (error, rows) => {
                if (error) {
                    connection.release();
                    return res.status(400).json({ success: false, message: 'Unable to check table existence' });
                }
                if (rows.length == 0) {
                    connection.release();
                    // Table does not exist, return empty array
                    return res.status(200).json({ success: true, message: 'Table does not exist', data: [] });
                }

                connection.query(`select * from ${username}_milk where cid=? and pshift=""  and pdate>=? and pdate <=? ORDER BY pdate ASC`,[cid,startDate,endDate],(error,rows)=>{
                    connection.release();
                    if(error){
                        res.status(500).json({error:error.message,success:false})
                    }else{
                        res.status(200).json({success:true,data:rows})
                    }
                })
            })
        })
       }
        
        
    } catch (error) {
        console.log("An error occurred")
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }

}

export default handler;
