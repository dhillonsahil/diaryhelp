import pool from "@/lib/db";
import jwt from 'jsonwebtoken'

const handler = async(req,res)=>{
    try {
        const {type,token}=req.body;
        let key = process.env.JWT_SECRET;
        const username = jwt.verify(token,key).email.split('@')[0].toLowerCase();
        if(type=='BuySell'){
            console.log(username)
            // create table if not exists
            pool.query(`create table if not exists ${username}_milk(id int primary key auto_increment ,ptype varchar(10) , cid int , pdate date , pprice float, pshift varchar(10),totalprice float,cuid varchar(8) , cname varchar(100) , fname varchar(100), fat int , snf int,weight float , remarks varchar(100),foreign key(cname) references ${username}_customers(c_name) , foreign key(fname) references ${username}_customers(father_name), foreign key(cid) references ${username}_customers (id), foreign key (cuid) references ${username}_customers(uid) )`,[],(error,rows,fields)=>{
                if(error){
                    console.log(error)
                    return res.status(500).json({success:false,message:"An Error Occured"})
                }
               
                // get data to be inserted into database
                const {ptype,cid,pdate,pprice,pshift,totalprice,cuid,cname,fname,fat,snf,weight,remarks} =req.body;

                // insert
               pool.query(`insert into ${username}_milk (ptype,cid,pdate,pprice,pshift,totalprice,cuid,cname,fname,fat,snf,weight,remarks) values(?,?,?,?,?,?,?,?,?,?,?,?,?)`,[ptype,cid,pdate,pprice,pshift,totalprice,cuid,cname,fname,fat,snf,weight,remarks],(error,rows,fields)=>{
                if(error){
                    console.log(error)
                    return res.status(500).json({success:false,message:"An Error Occured"})
                }
                return res.status(200).json({success:true,message:"Successfully Saved"})
               })

               // update total price
               pool.query(`c`,[],(error,rows,fields)=>{
                if(error){
                    console.log(error)
                    return res.status(500).json({success:false,message:"An Error Occured"})
                }
                return res.status(200).json({success:true,message:"Successfully Saved"})
               })
            })
        }
        
    } catch (error) {
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}
export default handler;