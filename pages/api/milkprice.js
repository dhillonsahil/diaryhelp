import pool from "@/lib/db";
const jwt = require('jsonwebtoken')
const handler = async(req,res)=>{
    try {
        const {type, token}= req.body;
        let key = "Iam@User";
        const username = jwt.verify(token,key).email.split('@')[0];
        // if inserting price
        if(type=='insert'){
            const {mtype,price,ctype} = req.body;
            if(mtype=='Regular'){
                if(ctype==''){
                    pool.getConnection((error, connection) => {
                        if (error) {
                            console.log('error', error)
                            return res.status(400).json({success:false,message:'Unable to insert '})
                        }
                        connection.beginTransaction((error) => {
                            if (error) {
                                console.log('error', error)
                                return res.status(400).json({success:false,message:'Unable to insert '})
                            }
                            connection.query(`CREATE table if not exists ${username}_milkprice(id int auto_increment primary key,mtype varchar(20) unique,price float)`,(error,rows,fields)=>{
                                if(error){
                                    console.log('error', error)
                                    return res.status(400).json({success:false,message:'Unable to insert '})
                                }
                                connection.query(`Insert into ${username}_milkprice (mtype,price) values('regular',?)`,[price],(error,rows,fields)=>{
                                    if(error){
                                        return connection.rollback(() => {
                                            return res.status(400).json({success:false,message:'Unable to insert '})
                                        });
                                    }
                                    connection.commit((error) => {
                                        if (error) {
                                            return connection.rollback(() => {
                                                return res.status(400).json({success:false,message:'Unable to insert '})
                                            });
                                        }
                                        connection.release();
                                        return res.status(200).json({success:true,message:'Data inserted successfully'})
                                    });
                                });
                            });
                        });
                    });
                }else{
                    pool.getConnection((error, connection) => {
                        if (error) {
                            console.log('error', error)
                            return res.status(400).json({success:false,message:'Unable to insert '})
                        }
                        connection.beginTransaction((error) => {
                            if (error) {
                                console.log('error', error)
                                return res.status(400).json({success:false,message:'Unable to insert '})
                            }
                            connection.query(`CREATE table if not exists ${username}_milkprice(id int auto_increment primary key,mtype varchar(20) unique,price float)`,(error,rows,fields)=>{
                                if(error){
                                    console.log('error', error)
                                    return res.status(400).json({success:false,message:'Unable to insert '})
                                }
                                connection.query(`Insert into ${username}_milkprice (mtype,price) values(?,?)`,[`cowregular`,price],(error,rows,fields)=>{
                                    if(error){
                                        return connection.rollback(() => {
                                            return res.status(400).json({success:false,message:'Unable to insert '})
                                        });
                                    }
                                    connection.commit((error) => {
                                        if (error) {
                                            return connection.rollback(() => {
                                                return res.status(400).json({success:false,message:'Unable to insert '})
                                            });
                                        }
                                        connection.release();
                                        return res.status(200).json({success:true,message:'Data inserted successfully'})
                                    });
                                });
                            });
                        });
                    });
                }
            } else if(mtype=='Fat'){
                pool.getConnection((error, connection) => {
                    if (error) {
                        console.log('error', error)
                        return res.status(400).json({success:false,message:'Unable to insert '})
                    }
                    connection.beginTransaction((error) => {
                        if (error) {
                            console.log('error', error)
                            return res.status(400).json({success:false,message:'Unable to insert '})
                        }
                        connection.query(`CREATE table if not exists ${username}_milkprice(id int auto_increment primary key,mtype varchar(20) unique,price float)`,(error,rows,fields)=>{
                            if(error){
                                console.log('error', error)
                                return res.status(400).json({success:false,message:'Unable to insert '})
                            }
                            connection.query(`Insert into ${username}_milkprice (mtype,price) values(?,?)`,[`${ctype==''?'buffalo':ctype.toLowerCase()}fat`,price],(error,rows,fields)=>{
                                if(error){
                                    return connection.rollback(() => {
                                        return res.status(400).json({success:false,message:'Unable to insert '})
                                    });
                                }
                                connection.commit((error) => {
                                    if (error) {
                                        return connection.rollback(() => {
                                            return res.status(400).json({success:false,message:'Unable to insert '})
                                        });
                                    }
                                    connection.release();
                                    return res.status(200).json({success:true,message:'Data inserted successfully'})
                                });
                            });
                        });
                    });
                });
            }else if(mtype=='Snf'){
                pool.getConnection((error, connection) => {
                    if (error) {
                        console.log('error', error)
                        return res.status(400).json({success:false,message:'Unable to insert '})
                    }
                    connection.beginTransaction((error) => {
                        if (error) {
                            console.log('error', error)
                            return res.status(400).json({success:false,message:'Unable to insert '})
                        }
                        connection.query(`CREATE table if not exists ${username}_milkprice(id int auto_increment primary key,mtype varchar(20) unique,price float)`,(error,rows,fields)=>{
                            if(error){
                                console.log('error', error)
                                return res.status(400).json({success:false,message:'Unable to insert '})
                            }
                            connection.query(`Insert into ${username}_milkprice (mtype,price) values(?,?)`,[`${ctype==''?'buffalo':ctype.toLowerCase()}snf`,price],(error,rows,fields)=>{
                                if(error){
                                    return connection.rollback(() => {
                                        return res.status(400).json({success:false,message:'Unable to insert '})
                                    });
                                }
                                connection.commit((error) => {
                                    if (error) {
                                        return connection.rollback(() => {
                                            return res.status(400).json({success:false,message:'Unable to insert '})
                                        });
                                    }
                                    connection.release();
                                    return res.status(200).json({success:true,message:'Data inserted successfully'})
                                });
                            });
                        });
                    });
                });
            }
        }
        // else if type == update price
        else if(type=='update') {
            const {updateType,price}= req.body;
            pool.getConnection((error, connection) => {
                if (error) {
                    console.log('error', error)
                    return res.status(400).json({success:false,message:'Unable to update '})
                }
                connection.beginTransaction((error) => {
                    if (error) {
                        console.log('error', error)
                        return res.status(400).json({success:false,message:'Unable to update '})
                    }
                    connection.query(`update ${username}_milkprice set price=? where mtype=?`,[price,updateType],(error,rows,fields)=>{
                        if(error){
                            return connection.rollback(() => {
                                return res.status(400).json({success:false,message:'Unable to update '})
                            });
                        }
                        connection.commit((error) => {
                            if (error) {
                                return connection.rollback(() => {
                                    return res.status(400).json({success:false,message:'Unable to update '})
                                });
                            }
                            connection.release();
                            return res.status(200).json({success:true,message:'Data inserted successfully'})
                        });
                    });
                });
            });
        }else if(type=='view'){
            pool.getConnection((error, connection) => {
                if (error) {
                    console.log('error', error)
                    return res.status(400).json({success:false,message:'Unable to insert '})
                }
                connection.query(`select * from ${username}_milkprice`,(error,rows,fields)=>{
                    if(error){
                        console.log(error)
                        return res.status(400).json({success:false,message:'Unable to insert '})
                    }
                    connection.release();
                    return res.status(200).json({success:true,message:'Data Fetched successfully',data:rows})
                });
            });
        }else if(type=='specific'){
            const {stype}=req.body;
            pool.getConnection((error, connection) => {
                if (error) {
                    console.log('error', error)
                    return res.status(400).json({success:false,message:'Unable to insert '})
                }
                connection.query(`select * from ${username}_milkprice where mtype=?`,[stype],(error,rows,fields)=>{
                    if(error){
                        console.log(error)
                        return res.status(400).json({success:false,message:'Unable to insert '})
                    }
                    connection.release();
                    return res.status(200).json({success:true,message:'Data Fetched successfully',data:rows})
                });
            });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false, message:"Internal Server error"})
    }
}

export default handler;