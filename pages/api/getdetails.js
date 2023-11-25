import pool from "@/lib/db";
const jwt=require('jsonwebtoken')

const handler = async(req,res)=>{
    const {token,type}= req.body;
   
    let key = process.env.JWT_SECRET;
    console.log(key)
    const email = jwt.verify(token,key).email;
    
    try {
        if(type=="add"){
            const {name,dName,mobile,address}=req.body;
            pool.query(`create table if not exists diarydetails(id int auto_increment primary key , c_name varchar(100) , d_name varchar(100) , email varchar(100) ,mobile varchar(100) , address varchar(200) )`,(error,rows)=>{
                if(error){
                    console.log(error)
                    return res.status(400).json({success:false,message:'An error occurred'})
                }
                // insert
                pool.query(`insert into diarydetails (c_name, d_name, email, mobile, address) values (?, ?, ?, ?, ?)
                `,[name,dName,email,mobile,address],(error,rows)=>{
                    if(error){
                        console.log(error)
                        return res.status(400).json({success:false,message:'An error occurred'})
                    }
                    return res.status(200).json({success:true,message:'Data Inserted successfully'})
                })
            })
        }else if(type=='view'){
            pool.query(`SHOW TABLES LIKE 'diarydetails'`, (error, rows) => { 
                if(error){
                    console.log(error)
                    return res.status(400).json({success:false,message:'Unable to insert '})
                }
                console.log('rows')
                    if (rows.length == 0) {
                        console.log("No data")
                        // Table does not exist, return empty array
                        return res.status(200).json({ success: false, message: 'Table does not exist', data: [] });
                    }
                    pool.query(`select * from diarydetails where email=?`,[email],(error,rows)=>{
                        if(error){
                            return res.status(400).json({success:false,message:'Unable to insert '})
                        }
                        if(rows.length==0){
                            return res.status(400).json({success:false,message:'No data found'})
                        }
                        return res.status(200).json({success:true,message:'Data fetched successfully',data:rows[0]})
                    })

             })
            // pool.query(`select * from diarydetails where email=?`,[email],(error,rows)=>{
            // })
        }else if(type=='verify'){
            pool.query(`SHOW TABLES LIKE diarydetails`, (error, rows) => { 
                if(error.success==true){
                    return res.status(500).json({success: false,message:'An Error Occurred',data:rows})
                }
                // 
                if (rows.length == 0) {
                    // Table does not exist, return empty array
                    return res.status(200).json({ success: false, message: 'Table does not exist', data: [] });
                }
                pool.query(`select * from diarydetails where email=?`,[email],(error,rows)=>{
                    if(error){
                        return res.status(400).json({success:false,message:'Unable to insert '})
                    }
                    if(rows.length==0){
                        return res.status(400).json({success:false,message:'No data found'})
                    }
                    return res.status(200).json({success:true,message:'Data fetched successfully'})
                })

            })
        }
    } catch (error) {
        console.log(error)
    }
}
export default handler;