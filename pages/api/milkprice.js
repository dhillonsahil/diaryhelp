import pool from "@/lib/db";

const handler = async(req,res)=>{
    try {
        const {type, username}= req.body;
        // if inserting price
        if(type=='insert'){
            console.log("trying it")
            const {mtype,price,ctype} = req.body;
            if(mtype=='Regular'){
                if(ctype==''){
                    console.log(type + " "+ ctype + " "+username + " "+price+ " "+mtype +" ")
                    pool.query(`CREATE table if not exists ${username}_milkprice(id int auto_increment primary key,mtype varchar(20) unique,price float)`,(error,rows,fields)=>{
                        if(error){
                            console.log('error', error)
                            return res.status(400).json({success:false,message:'Unable to insert '})
                        }
                        pool.query(`Insert into ${username}_milkprice (mtype,price) values('regular',?)`,[price],(error,rows,fields)=>{
                            if(error){
                                return res.status(400).json({success:false,message:'Unable to insert '})
                            }
                            return res.status(200).json({success:true,message:'Data inserted successfully'})
                        })
                    })
                }else{
                    console.log('Cow')
                    pool.query(`CREATE table if not exists ${username}_milkprice(id int auto_increment primary key,mtype varchar(20) unique,price float)`,(error,rows,fields)=>{
                            if(error){
                                return res.status(400).json({success:false,message:'Unable to insert '})
                            }
                            pool.query(`Insert into ${username}_milkprice (mtype,price) values(?,?)`,[`cowregular`,price],(error,rows,fields)=>{
                                if(error){
                                    return res.status(400).json({success:false,message:'Unable to insert '})
                                }
                                return res.status(200).json({success:true,message:'Data inserted successfully'})
                            })
                    })
                    
                }
            } else if(mtype=='Fat'){
                    pool.query(`CREATE table if not exists ${username}_milkprice(id int auto_increment primary key,mtype varchar(20) unique,price float)`,(error,rows,fields)=>{
                        if(error){
                            return res.status(400).json({success:false,message:'Unable to insert '})
                        }
                        pool.query(`Insert into ${username}_milkprice (mtype,price) values(?,?)`,[`${ctype==''?'buffalo':ctype.toLowerCase()}fat`,price],(error,rows,fields)=>{
                            if(error){
                                return res.status(400).json({success:false,message:'Unable to insert '})
                            }
                            return res.status(200).json({success:true,message:'Data inserted successfully'})
                        })
                    })  
            }else if(mtype=='Snf'){
                    pool.query(`CREATE table if not exists ${username}_milkprice(id int auto_increment primary key,mtype varchar(20) unique,price float)`,(error,rows,fields)=>{
                        if(error){
                            return res.status(400).json({success:false,message:'Unable to insert '})
                        }
                        pool.query(`Insert into ${username}_milkprice (mtype,price) values(?,?)`,[`${ctype==''?'buffalo':ctype.toLowerCase()}snf`,price],(error,rows,fields)=>{
                            if(error){
                                return res.status(400).json({success:false,message:'Unable to insert '})
                            }
                            return res.status(200).json({success:true,message:'Data inserted successfully'})
                        })
                    })  
            }
        }
        // else if type == update price
        else if(type=='update') {
            const {updateType,price}= req.body;
            pool.query(`update ${username}_milkprice set price=? where mtype=?`,[price,updateType],(error,rows,fields)=>{
                if(error){
                    return res.status(400).json({success:false,message:'Unable to update '})
                }
                return res.status(200).json({success:true,message:'Data inserted successfully'})
            })
        }else if(type=='view'){
            pool.query(`select * from ${username}_milkprice`,(error,rows,fields)=>{
                if(error){
                    console.log(error)
                    return res.status(400).json({success:false,message:'Unable to insert '})
                }
                return res.status(200).json({success:true,message:'Data Fetched successfully',data:rows})
            })
        }else if(type=='specific'){
            const {stype}=req.body;
            pool.query(`select * from ${username}_milkprice where mtype=?`,[stype],(error,rows,fields)=>{
                if(error){
                    console.log(error)
                    return res.status(400).json({success:false,message:'Unable to insert '})
                }
                return res.status(200).json({success:true,message:'Data Fetched successfully',data:rows})
            })
        }
    } catch (error) {
        return res.status(500).json({success:false, message:"Internal Server error"})
    }
}

export default handler;