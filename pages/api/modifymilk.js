import pool from "@/lib/db";
const jwt = require('jsonwebtoken')

const handler = async(req,res)=>{
    const {token,type}= req.body;
    let key = process.env.JWT_SECRET;
    const username = jwt.verify(token,key).email.split('@')[0];
    try {
        if(type=='delete'){
            const {mid,ptype,totalPrice,cuid,cid} =req.body;
            pool.query(`delete from ${username}_milk where id=?`,[mid],(error,rows)=>{
                if(error){
                    res.status(500).json({error:error.message,success:false})
                }else{
                    // remove from total transaction
                   // udpdate
                   pool.query(`select * from ${username}_totalcalc where cid=?`,[cid],(error,rows)=>{
                    if(error){
                        return res.status(500).json({success:false});
                    }

                    
                    // if ptype sell then we have to reduce amountDue
                    if(ptype=='Sell'){
                        pool.query(`update ${username}_totalcalc set amountDue=? where cuid=? and cid=?`,[rows[0].amountDue-totalPrice,cuid,cid],(error,rows)=>{
                            if(error){
                                res.status(500).json({error:error.message,success:false})
                            }else{
                                res.status(200).json({success:true})
                            }
                        })
                      }else{
                        // if ptype buy then we have to reduce amountReceived
                        // console.log("Rows",rows)
                        pool.query(`update ${username}_totalcalc set amountReceived=? where cuid=? and cid=?`,[rows[0].amountReceived-totalPrice,cuid,cid],(error,rows)=>{
                            if(error){
                                res.status(500).json({error:error.message,success:false})
                            }else{
                                res.status(200).json({success:true})
                            }
                        })
                      }
                   })
                  
                }
            })
        } else if (type=='update'){
            // console.log("Update")
            const {tid,cid,utype,uprice,upshift,ufat,usnf,update,utotalprice,uweight,uremarks }=req.body;
            // console.log(tid,cid,utype,uprice,upshift)
            pool.getConnection((err, connection)=>{
                if (err) {
                    console.log(err);
                    return res.status(500).json({ success: false, message: "An error occurred" });
                }

                // start transaction
                connection.beginTransaction((err) => {
                    if (err) {
                        console.log(err);
                        connection.release();
                        return res.status(500).json({ success: false, message: "An error occurred" });
                    } 
                
                
                // RUN QUERY IF
                connection.query(`select * from ${username}_milk where id=? and cid=?`,[tid,cid],(error,rows)=>{
                    if (error) {
                        console.log(error);
                        connection.rollback(() => {
                            connection.release();
                            return res.status(500).json({ success: false, message: "An error occurred" });
                        });
                    }

                    const prevprice = rows[0].totalprice;
                    const oldptype=rows[0].ptype
                    if(oldptype=="Buy"){
                        // if same new ptype
                      if(utype=="Buy"){
                        connection.query(`update ${username}_totalcalc set amountReceived=amountReceived-?+? where cid=?`,[prevprice,utotalprice,cid],(error,rows)=>{
                            if (error) {
                                console.log(error);
                                connection.rollback(() => {
                                    connection.release();
                                    return res.status(500).json({ success: false, message: "An error occurred" });
                                });
                            }
                            
                           // update in milk table
                           connection.query(`update ${username}_milk set ptype=? ,pdate=? , pprice=? ,pshift=? , totalprice=? , fat=? , snf=? , weight=?, remarks = ? where id=? `,[utype,update,uprice,upshift,utotalprice,ufat,usnf,uweight,uremarks,tid],(error,rows)=>{

                            if (error) {
                                console.log(error);
                                connection.rollback(() => {
                                    connection.release();
                                    return res.status(500).json({ success: false, message: "An error occurred" });
                                });
                            }

                            connection.commit((err) => {
                                if (err) {
                                    console.log(err);
                                    connection.rollback(() => {
                                        connection.release();
                                        return res.status(500).json({ success: false, message: "An error occurred" });
                                    });
                                }
                                // Release the connection
                                connection.release();
                                return res.status(200).json({ success: true, message: "Successfully Saved" });
                            });

                           })
                            
                        })
                      }else{
                        // if changed purchase type
                        connection.query(`update ${username}_totalcalc set amountReceived=amountReceived-? , amountDue=amountDue+? where cid=?`,[prevprice,utotalprice,cid],(error,rows)=>{
                            if (error) {
                                console.log(error);
                                connection.rollback(() => {
                                    connection.release();
                                    return res.status(500).json({ success: false, message: "An error occurred" });
                                });
                            }
                            
                           // update in milk table
                           connection.query(`update ${username}_milk set ptype=? ,pdate=? , pprice=? ,pshift=? , totalprice=? , fat=? , snf=? , weight=?, remarks = ? where id=? `,[utype,update,uprice,upshift,utotalprice,ufat,usnf,uweight,uremarks,tid],(error,rows)=>{

                            if (error) {
                                console.log(error);
                                connection.rollback(() => {
                                    connection.release();
                                    return res.status(500).json({ success: false, message: "An error occurred" });
                                });
                            }

                            connection.commit((err) => {
                                if (err) {
                                    console.log(err);
                                    connection.rollback(() => {
                                        connection.release();
                                        return res.status(500).json({ success: false, message: "An error occurred" });
                                    });
                                }
                                // Release the connection
                                connection.release();
                                return res.status(200).json({ success: true, message: "Successfully Saved" });
                            });

                           })
                            
                        })
                      }
                    }else if(oldptype=="Sell"){
                        // 
                        if(utype=="Sell"){
                            connection.query(`update ${username}_totalcalc set amountDue=amountDue-?+? where cid=?`,[prevprice,utotalprice,cid],(error,rows)=>{
                                if (error) {
                                    console.log(error);
                                    connection.rollback(() => {
                                        connection.release();
                                        return res.status(500).json({ success: false, message: "An error occurred" });
                                    });
                                }
                                
                               // update in milk table
                               connection.query(`update ${username}_milk set ptype=? ,pdate=? , pprice=? ,pshift=? , totalprice=? , fat=? , snf=? , weight=?, remarks = ? where id=? `,[utype,update,uprice,upshift,utotalprice,ufat,usnf,uweight,uremarks,tid],(error,rows)=>{
    
                                if (error) {
                                    console.log(error);
                                    connection.rollback(() => {
                                        connection.release();
                                        return res.status(500).json({ success: false, message: "An error occurred" });
                                    });
                                }
    
                                connection.commit((err) => {
                                    if (err) {
                                        console.log(err);
                                        connection.rollback(() => {
                                            connection.release();
                                            return res.status(500).json({ success: false, message: "An error occurred" });
                                        });
                                    }
                                    // Release the connection
                                    connection.release();
                                    return res.status(200).json({ success: true, message: "Successfully Saved" });
                                });
    
                               })
                                
                            })
                        }else{
                            connection.query(`update ${username}_totalcalc set amountDue=amountDue-? ,amountReceived=amountReceived+? where cid=?`,[prevprice,utotalprice,cid],(error,rows)=>{
                                if (error) {
                                    console.log(error);
                                    connection.rollback(() => {
                                        connection.release();
                                        return res.status(500).json({ success: false, message: "An error occurred" });
                                    });
                                }
                                
                               // update in milk table
                               connection.query(`update ${username}_milk set ptype=? ,pdate=? , pprice=? ,pshift=? , totalprice=? , fat=? , snf=? , weight=?, remarks = ? where id=? `,[utype,update,uprice,upshift,utotalprice,ufat,usnf,uweight,uremarks,tid],(error,rows)=>{
    
                                if (error) {
                                    console.log(error);
                                    connection.rollback(() => {
                                        connection.release();
                                        return res.status(500).json({ success: false, message: "An error occurred" });
                                    });
                                }
    
                                connection.commit((err) => {
                                    if (err) {
                                        console.log(err);
                                        connection.rollback(() => {
                                            connection.release();
                                            return res.status(500).json({ success: false, message: "An error occurred" });
                                        });
                                    }
                                    // Release the connection
                                    connection.release();
                                    return res.status(200).json({ success: true, message: "Successfully Saved" });
                                });
    
                               })
                                
                            })
                        }
                    }
                })

                });
            })
        }
    } catch (error) {
        return res.status(500).json({success:false,message:'Internal Server Error'})
    }
}
export default handler;