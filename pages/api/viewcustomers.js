import pool from "@/lib/db";

const handler = async(req,res)=>{
    try {
        const {username}=req.body;
        pool.query(`select * from ${username}_customers`,(error , rows,fields)=>{
            if(error){
                console.log("error ",error)
                return res.status(500).json({ success: false, message: "Error occurred while adding a customer" });
            }
            return res.status(200).json({ success: true, data: rows });
        })
    } catch (error) {
        return res.status(500).json({success:false, message:"Internal Server Error"})
    }
}

export default handler;