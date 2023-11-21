import pool from "@/lib/db";

const handler = async(req,res)=>{
    try {
        const {type,username}=req.body;
        if(type=='BuySell'){
            
            // create table if not exists
            pool.query(`create table if not exists ${username}_milk(id int primary key auto_increment ,ptype varchar(10) , cid int , pdate date , pprice int, pshift varchar(10),totalprice int,cuid varchar(8) , cname varchar(100) , fname varchar(100), foreign key(cname) references ${username}_customers(c_name) , foreign key(fname) references ${username}_customers(father_name), foreign key(cid) references ${username}_customers (id), foreign key (cuid) references ${username}_customers(uid) )`,[],(error,rows,fields)=>{
                if(error){
                    return res.status(500).json({success:false,message:"An Error Occured"})
                }
               
                // get data to be inserted into database
                const {ptype,cid,pdate,pprice,pshift,totalprice,cuid,cname,fname} =req.body;

                // insert
               pool.query(`insert into ${username}_milk (ptype,cid,pdate,pprice,pshift,totalprice,cuid,cname,fname) values(?,?,?,?,?,?,?,?,?)`,[ptype,cid,pdate,pprice,pshift,totalprice,cuid,cname,fname],(error,rows,fields)=>{
                if(error){
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