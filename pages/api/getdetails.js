import pool from "@/lib/db";
const jwt=require('jsonwebtoken')

const handler = async(req,res)=>{
    const {token,type}= req.body;
   
    let key = "Iam@User";
    const email = jwt.verify(token,key).email;
    
    try {
        if(type=="add"){
            const {name,dName,mobile,address}=req.body;
            pool.getConnection((error, connection) => {
                if (error) {
                    console.log(error);
                    return res.status(400).json({success:false,message:'An error occurred'});
                }
                connection.beginTransaction((error) => {
                    if (error) {
                        console.log(error);
                        return res.status(400).json({success:false,message:'An error occurred'});
                    }
                    connection.query(`create table if not exists diarydetails(id int auto_increment primary key , c_name varchar(100) , d_name varchar(100) , email varchar(100) ,mobile varchar(100) , address varchar(200) )`,(error,rows)=>{
                        if(error){
                            console.log(error);
                            connection.rollback(() => {
                                connection.release();
                                return res.status(400).json({success:false,message:'An error occurred'});
                            });
                        }
                        connection.query(`insert into diarydetails (c_name, d_name, email, mobile, address) values (?, ?, ?, ?, ?)`,[name,dName,email,mobile,address],(error,rows)=>{
                            if(error){
                                console.log(error);
                                connection.rollback(() => {
                                    connection.release();
                                    return res.status(400).json({success:false,message:'An error occurred'});
                                });
                            }
                            connection.commit((error) => {
                                if (error) {
                                    console.log(error);
                                    connection.rollback(() => {
                                        connection.release();
                                        return res.status(400).json({success:false,message:'An error occurred'});
                                    });
                                }
                                connection.release();
                                return res.status(200).json({success:true,message:'Data Inserted successfully'});
                            });
                        });
                    });
                });
            });
        }else if(type=='view'){
            pool.getConnection((error, connection) => {
                if (error) {
                    console.log(error);
                    return res.status(400).json({success:false,message:'An error occurred'});
                }
                connection.query(`SHOW TABLES LIKE 'diarydetails'`, (error, rows) => { 
                    if(error){
                        console.log(error);
                        connection.release();
                        return res.status(400).json({success:false,message:'Unable to insert '});
                    }
                    if (rows.length == 0) {
                        console.log("No data");
                        connection.release();
                        return res.status(200).json({ success: false, message: 'Table does not exist', data: [] });
                    }
                    connection.query(`select * from diarydetails where email=?`,[email],(error,rows)=>{
                        if(error){
                            console.log(error);
                            connection.release();
                            return res.status(400).json({success:false,message:'Unable to insert '});
                        }
                        if(rows.length==0){
                            connection.release();
                            return res.status(400).json({success:false,message:'No data found'});
                        }
                        connection.release();
                        return res.status(200).json({success:true,message:'Data fetched successfully',data:rows[0]});
                    });
                });
            });
        }else if(type=='verify'){
            pool.getConnection((error, connection) => {
                if (error) {
                    console.log(error);
                    return res.status(400).json({success:false,message:'An error occurred'});
                }
                connection.query(`SHOW TABLES LIKE diarydetails`, (error, rows) => { 
                    if(error.success==true){
                        console.log(error);
                        connection.release();
                        return res.status(500).json({success: false,message:'An Error Occurred',data:rows});
                    }
                    if (rows.length == 0) {
                        connection.release();
                        return res.status(200).json({ success: false, message: 'Table does not exist', data: [] });
                    }
                    connection.query(`select * from diarydetails where email=?`,[email],(error,rows)=>{
                        if(error){
                            console.log(error);
                            connection.release();
                            return res.status(400).json({success:false,message:'Unable to insert '});
                        }
                        if(rows.length==0){
                            connection.release();
                            return res.status(400).json({success:false,message:'No data found'});
                        }
                        connection.release();
                        return res.status(200).json({success:true,message:'Data fetched successfully'});
                    });
                });
            });
        }
    } catch (error) {
        console.log(error);
    }
}
export default handler;
