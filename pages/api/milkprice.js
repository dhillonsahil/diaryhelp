import pool from "@/lib/db";

const handler = async(req,res)=>{
    try {
        const {type, username}= req.body;
        // if inserting price
        if(type=='insert'){
            const {mtype,price,ctype} = req.body;
            if(mtype=='Regular'){
                if(ctype==''){
                    pool.query(`CREATE table if not exists ${username}_milkprice(id int auto_increment primary key,type unique varchar(20) ,price float)`,(error,row,fields)=>{
                        if(error){
                            return res.status(400).json({success:false,message:'Unable to insert '})
                        }
                        pool.query(`Insert into ${username}_milkprice (type,price) values('regular',?)`,[price],(error,row,fields)=>{
                            if(error){
                                return res.status(400).json({success:false,message:'Unable to insert '})
                            }
                            return res.staus(200).json({success:true,message:'Data inserted successfully'})
                        })
                    })
                }else{
                    pool.query(`CREATE table if not exists ${username}_milkprice(id int auto_increment primary key,type unique varchar(20) ,price float)`,(error,row,fields)=>{
                        if(error){
                            return res.status(400).json({success:false,message:'Unable to insert '})
                        }
                        pool.query(`Insert into ${username}_milkprice (type,price) values(?,?)`,[`${ctype.toLowerCase()}regular`,price],(error,row,fields)=>{
                            if(error){
                                return res.status(400).json({success:false,message:'Unable to insert '})
                            }
                            return res.staus(200).json({success:true,message:'Data inserted successfully'})
                        })
                    })
                }
            } else if(mtype=='Fat'){
                    pool.query(`CREATE table if not exists ${username}_milkprice(id int auto_increment primary key,type unique varchar(20) ,price float)`,(error,row,fields)=>{
                        if(error){
                            return res.status(400).json({success:false,message:'Unable to insert '})
                        }
                        pool.query(`Insert into ${username}_milkprice (type,price) values(?,?)`,[`${ctype.toLowerCase()}fat`,price],(error,row,fields)=>{
                            if(error){
                                return res.status(400).json({success:false,message:'Unable to insert '})
                            }
                            return res.staus(200).json({success:true,message:'Data inserted successfully'})
                        })
                    })  
            }else if(mtype=='Snf'){
                    pool.query(`CREATE table if not exists ${username}_milkprice(id int auto_increment primary key,type unique varchar(20) ,price float)`,(error,row,fields)=>{
                        if(error){
                            return res.status(400).json({success:false,message:'Unable to insert '})
                        }
                        pool.query(`Insert into ${username}_milkprice (type,price) values(?,?)`,[`${ctype.toLowerCase()}snf`,price],(error,row,fields)=>{
                            if(error){
                                return res.status(400).json({success:false,message:'Unable to insert '})
                            }
                            return res.staus(200).json({success:true,message:'Data inserted successfully'})
                        })
                    })  
            }
        }
        // else if type == update price
        else if(type=='update') {
            const {updateType}= req.body;
            pool.query(`update ${username}_milkprice set price=? where type=?`,[price,updateType],(error,row,fields)=>{
                if(error){
                    return res.status(400).json({success:false,message:'Unable to insert '})
                }
                return res.staus(200).json({success:true,message:'Data inserted successfully'})
            })
        }else if(type=='view'){
            pool.query(`select * ${username}_milkprice`,(error,row,fields)=>{
                if(error){
                    return res.status(400).json({success:false,message:'Unable to insert '})
                }
                return res.staus(200).json({success:true,message:'Data Fetched successfully'})
            })
        }
    } catch (error) {
        return res.status(500).json({success:false, message:"Internal Server error"})
    }
}

export default handler;