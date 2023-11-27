import pool from "@/lib/db";
const jwt=require('jsonwebtoken')

const handler =async(req,res)=>{
    const {type, token}= req.body;
    let key = "Iam@User";
    const username = jwt.verify(token,key).email.split('@')[0];
    try {
        if(type=='add'){
            pool.query(`create table if not exists ${username}_itemstock(id int primary key auto_increment , itemName varchar(100) unique, itemquantity int , itemprice int)`,(error,rows)=>{
                if(error){
                console.log(error)
                    return res.status(400).json({success:false,message:'Unable to insert '})
                }
                // insert
                const {price,quant,itemName}=req.body;
            
                pool.query(`insert into ${username}_itemstock (itemName,itemquantity,itemprice) values(?,?,?)`,[itemName,quant,price],(error,rows)=>{
                    if(error){
                        return res.status(400).json({success:false,message:'Unable to insert '})
                    }
                    return res.status(200).json({success:true,message:'Data inserted successfully'})
                })
            })
        }else if(type=='viewAll'){
            // pool.query(`select * from ${username}_itemstock`,(error,rows)=>{
            //     if(error){
            //         return res.status(400).json({success:false,message:'Unable to insert '})
            //     }
            //     return res.status(200).json({success:true,message:'Data Fetched successfully',data:rows})
            // })
            pool.query(`SHOW TABLES LIKE '${username}_itemstock'`, (error, rows) => {
                if (error) {
                    return res.status(400).json({ success: false, message: 'Unable to check table existence' });
                }

                if (rows.length == 0) {
                    // Table does not exist, return empty array
                    return res.status(200).json({ success: true, message: 'Table does not exist', data: [] });
                }

                // Table exists, fetch data
                pool.query(`SELECT * FROM ${username}_itemstock`, (error, rows) => {
                    if (error) {
                        return res.status(400).json({ success: false, message: 'Unable to fetch data' });
                    }

                    return res.status(200).json({ success: true, message: 'Data fetched successfully', data: rows });
                });
            });
        }else if(type=='updatePrice'){
            const {newPrice,id}=req.body;
            pool.query(`update ${username}_itemstock set itemprice=? where id=?`,[newPrice,id],(error,rows)=>{
                if(error){
                    return res.status(400).json({success:false,message:'Unable to update '})
                }
                return res.status(200).json({success:true,message:'Data updated successfully'})
            });
        }else if(type=='updateStock'){
            const {newStock,id}=req.body;
            pool.query(`update ${username}_itemstock set itemquantity=? where id=?`,[newStock,id],(error,rows)=>{
                if(error){
                    return res.status(400).json({success:false,message:'Unable to update '})
                }
                return res.status(200).json({success:true,message:'Data updated successfully'})
            });
        }
    } catch (error) {
        
    }
}

export default handler