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
            pool.query(`create table if not exists ${username}_milk(id int primary key auto_increment ,ptype varchar(10) , cid int , pdate date , pprice float, pshift varchar(10),totalprice float,cuid varchar(8) , cname varchar(100) , fname varchar(100), fat int , snf int,weight float , remarks varchar(100),foreign key(cname) references ${username}_customers(c_name) , foreign key(fname) references ${username}_customers(father_name), foreign key(cid) references ${username}_customers (id), foreign key (cuid) references ${username}_customers(uid) )`,(error,rows,fields)=>{
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

                // create table for overall calculations if not exists
                pool.query(`create table ${username}_totalcalc(id int auto_increment primary key , cname varchar(100) , fname varchar(100) , cid int , cuid varchar(8) , amountDue int , amountReceived int  , foreign key (cname) references ${username}_customers(c_name) , foreign key (fname) references ${username}_customers(father_name) ,foreign key(cid) references ${username}_customers(id) , foreign key(cuid) references ${username}_customers(uid) )`,(error,rows,fields)=>{
                    if(error){
                        // if unable to resolve create table or insert delete from milk entries
                        // pool.query(`delete from ${username}_milk where ptype=? and cid=? and cuid=? and pprice=? and pshift=? and pdate=? and totalprice=?` ,[ptype,cid,cuid,pprice,pshift,pdate,totalprice],(error,rows,fields)=>{
                        //     if(error){
                        //         console.log(error)
                        //         return res.status(500).json({success:false,message:"An Error Occured"})
                        //     }
                        // })
                    }

                    // if no error insert or update into table

                    // if user already exists update its data else create new entry
                    pool.query(`select * from ${username}_totalcalc where cuid=? and cid=?`,[cuid,cid],(error,rows,fields)=>{
                        if(rows.length>0){
                            // update if already exists
                            if(ptype=='Sell'){
                                const amount=rows[0].amountDue + totalprice;
                                pool.query(`update ${username}_totalcalc set amountDue=? where cuid=? and cid=?`,[amount,cuid,cid],(error,rows,fields)=>{
                                    // if(error){
                                    //     // if unable to resolve update delete from milk entry
                                    //     pool.query(`delete from ${username}_milk where ptype=? and cid=? and cuid=? and pprice=? and pshift=? and pdate=? and totalprice=?` ,[ptype,cid,cuid,pprice,pshift,pdate,totalprice],(error,rows,fields)=>{
                                    //         if(error){
                                    //             console.log(error)
                                    //             return res.status(500).json({success:false,message:"An Error Occured"})
                                    //         }
                                    //     })
                                    // }
                                })
                            }else if(ptype=="Buy") {
                                const amount=rows[0].amountReceived + totalprice;
                                pool.query(`update ${username}_totalcalc set amountReceived=? where cuid=? and cid=?`,[amount,cuid,cid],(error,rows,fields)=>{
                                    // if(error){
                                    //     // if unable to resolve update delete from milk entry
                                    //     pool.query(`delete from ${username}_milk where ptype=? and cid=? and cuid=? and pprice=? and pshift=? and pdate=? and totalprice=?` ,[ptype,cid,cuid,pprice,pshift,pdate,totalprice],(error,rows,fields)=>{
                                    //         if(error){
                                    //             console.log(error)
                                    //             return res.status(500).json({success:false,message:"An Error Occured"})
                                    //         }
                                    //     })
                                    // }
                                })
                            }
                        }else {
                           if(ptype=="Sell"){
                            pool.query(`insert into ${username}_totalcalc (cname,fname,cid,cuid,amountDue,amountReceived) values (?,?,?,?,?,0)`,[cname,fname,cid,cuid,totalprice],(error,rows,fields)=>{
                                // if unable to insert remove entry from milk
                                // if(error){
                                   
                                //     pool.query(`delete from ${username}_milk where ptype=? and cid=? and cuid=? and pprice=? and pshift=? and pdate=? and totalprice=?` ,[ptype,cid,cuid,pprice,pshift,pdate,totalprice],(error,rows,fields)=>{
                                //         if(error){
                                //             console.log(error)
                                //             return res.status(500).json({success:false,message:"An Error Occured"})
                                //         }
                                //     })
                                // }

                                return res.status(200).json({success:true,message:"Successfully Saved"})
                            })
                           }else if(ptype=="Buy"){
                            pool.query(`insert into ${username}_totalcalc (cname,fname,cid,cuid,amountDue,amountReceived) values (?,?,?,?,0,?)`,[cname,fname,cid,cuid,totalprice],(error,rows,fields)=>{
                                // if unable to insert remove entry from milk
                                // if(error){
                                   
                                //     pool.query(`delete from ${username}_milk where ptype=? and cid=? and cuid=? and pprice=? and pshift=? and pdate=? and totalprice=?` ,[ptype,cid,cuid,pprice,pshift,pdate,totalprice],(error,rows,fields)=>{
                                //         if(error){
                                //             console.log(error)
                                //             return res.status(500).json({success:false,message:"An Error Occured"})
                                //         }
                                //     })
                                // }

                                return res.status(200).json({success:true,message:"Successfully Saved"})
                            })
                           }
                        }
                    })
                })

                return res.status(200).json({success:true,message:"Successfully Saved"})
               })

               
            })
        }
        
    } catch (error) {
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}
export default handler;