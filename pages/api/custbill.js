import pool from "@/lib/db";
const jwt=require('jsonwebtoken')
const handler = async(req,res)=>{
    const {num}=req.body;
    try {
        console.log(num);
        pool.query('select * from users where mobile=?',[num],(error,rows)=>{
            if(error){
                console.log(error);
                return res.status(500).json({success:false,message:"Internal Server Error"});
            }
            if(rows.length==0){
                console.log(rows);
                return res.status(200).json({success:false,message:"User not found",data:[]});
            }
            const username=rows[0].email.split('@')[0].toLowerCase();
            const email=rows[0].email;
            pool.query(`select * from ${username}_customers`,(error,rows)=>{
                if(error){
                    console.log(error);
                    return res.status(500).json({success:false,message:"Internal Server Error"});
                }
                var token = jwt.sign({email:email.toLowerCase()},"Iam@User",{
                    expiresIn:"2d"
                  })
                return res.status(200).json({success:true,data:rows,token:token})
            })
        })
    } catch (error) {
        console.log(error);
    }
}
export default handler;