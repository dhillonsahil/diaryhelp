import pool from "@/lib/db";
const jwt = require('jsonwebtoken')

const handler = async(req,res)=>{
    const {token,type}= req.body;
    let key = process.env.JWT_SECRET;
    const username = jwt.verify(token,key).email.split('@')[0];
    try {
        if(type=='delete'){
            const {mid,ptype,totalPrice,cuid,cid} =req.body;
            pool.query(`delete from ${username}_milk where id=?`,[mid],(error,rows)=>{
                if(error){
                    res.status(500).json({error:error.message,success:false})
                }else{
                    // remove from total transaction
                   // udpdate
                   pool.query(`select * from ${username}_totalcalc where cid=?`,[cid],(error,rows)=>{
                    if(error){
                        return res.status(500).json({success:false});
                    }

                    
                    // if ptype sell then we have to reduce amountDue
                    if(ptype=='Sell'){
                        pool.query(`update ${username}_totalcalc set amountDue=? where cuid=? and cid=?`,[rows[0].amountDue-totalPrice,cuid,cid],(error,rows)=>{
                            if(error){
                                res.status(500).json({error:error.message,success:false})
                            }else{
                                res.status(200).json({success:true})
                            }
                        })
                      }else{
                        // if ptype buy then we have to reduce amountReceived
                        console.log("Rows",rows)
                        pool.query(`update ${username}_totalcalc set amountReceived=? where cuid=? and cid=?`,[rows[0].amountReceived-totalPrice,cuid,cid],(error,rows)=>{
                            if(error){
                                res.status(500).json({error:error.message,success:false})
                            }else{
                                res.status(200).json({success:true})
                            }
                        })
                      }
                   })
                  
                }
            })
        }
    } catch (error) {
        return res.status(500).json({success:false,message:'Internal Server Error'})
    }
}
export default handler;