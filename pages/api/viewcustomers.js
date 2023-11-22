import pool from "@/lib/db";
import jwt from 'jsonwebtoken'
const handler = async(req,res)=>{
    try {
        const {token}=req.body;
        let key = process.env.JWT_SECRET;
        if(key && token ){
          jwt.verify(token, key, function(err, decoded) {
           const username =decoded.email.split('@')[0].toLowerCase();
           pool.query(`select * from ${username}_customers`,(error , rows,fields)=>{
            if(error){
                console.log("error ",error)
                return res.status(500).json({ success: false, message: "Error occurred while adding a customer" });
            }
            return res.status(200).json({ success: true, data: rows });
        })
          });
          
        }else{
            console.log("Error")
            return res.status(500).json({ success: false, message: "Error occurred while adding a customer" });
        }
    } catch (error) {
        console.log("Error",error)
        return res.status(500).json({success:false, message:"Internal Server Error"})
    }
}

export default handler;