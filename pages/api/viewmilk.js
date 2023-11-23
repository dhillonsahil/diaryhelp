import pool from "@/lib/db";

const handler =async(req,res)=>{
    const {token}= req.body;
    let key = process.env.JWT_SECRET;
    const username = jwt.verify(token,key).email.split('@')[0];

    try {
        
    } catch (error) {
        
    }
}

export default handler;