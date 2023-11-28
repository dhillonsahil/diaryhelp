import pool from "@/lib/db";
import jwt from 'jsonwebtoken';

const handler = async (req, res) => {
    try {
        const { type, token } = req.body;
        let key = "Iam@User";
        const username = jwt.verify(token, key).email.split('@')[0].toLowerCase();

        if (type === 'BuySell') {
            // console.log(username);

            // Start a transaction
            pool.getConnection((err, connection) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ success: false, message: "An error occurred" });
                }

                connection.beginTransaction((err) => {
                    if (err) {
                        console.log(err);
                        connection.release();
                        return res.status(500).json({ success: false, message: "An error occurred" });
                    }

                    // Change: Added a space before ellipsis to improve readability
                    // Create or update ${username}_milk table
                    connection.query(`create table if not exists ${username}_milk(id int primary key auto_increment ,ptype varchar(10) , cid int , pdate date , pprice float, pshift varchar(10),totalprice float,cuid varchar(8) , cname varchar(100) , fname varchar(100), fat int , snf int,weight float , remarks varchar(100),foreign key(cname) references ${username}_customers(c_name) , foreign key(fname) references ${username}_customers(father_name), foreign key(cid) references ${username}_customers (id), foreign key (cuid) references ${username}_customers(uid) )`, (error, rows, fields) => {
                        if (error) {
                            console.log(error);
                            connection.rollback(() => {
                                connection.release();
                                return res.status(500).json({ success: false, message: "An error occurred" });
                            });
                        }

                        // Insert data into ${username}_milk
                        const { ptype, cid, pdate, pprice, pshift, totalprice, cuid, cname, fname, fat, snf, weight, remarks } = req.body;
                        // check entry if already exists
                        const priceTolerance = 0.1; // Adjust this based on your requirements
                        const weightTolerance = 0.01; 
                        connection.query( `SELECT * FROM ${username}_milk WHERE 
                        ptype=? AND cid=? AND pdate=? AND 
                        ABS(pprice - ?) < ? AND 
                        pshift=? AND 
                        ABS(totalprice - ?) < ? AND 
                        fat=? AND snf=? AND 
                        ABS(weight - ?) < ?`,
                        [ptype, cid, pdate, pprice, priceTolerance, pshift, totalprice, priceTolerance, fat, snf, weight, weightTolerance],(error,rows)=>{
                        // connection.query(`select * from ${username}_milk where ptype=? and cid=? and pdate=? and pprice=? and pshift=? and totalprice=?  and fat=? and snf=? and weight=?`,[ptype,cid,pdate,pprice,pshift,totalprice,fat,snf,weight],(error,rows)=>{
                            if (error) {
                                console.log(error);
                                connection.rollback(() => {
                                    connection.release();
                                    return res.status(500).json({ success: false, message: "An error occurred" });
                                });
                            }
                            // check if already present
                            if(rows && rows.length>0){
                                connection.rollback(() => {
                                    connection.release();
                                    return res.status(400).json({success:'duplicate',message:'data already present'});
                                    // return res.status(400).json({ success: false, message: "Duplicate entry. This record already exists." });
                                });
                            }else{
// Change: Added a space before ellipsis to improve readability
connection.query(`insert into ${username}_milk (ptype,cid,pdate,pprice,pshift,totalprice,cuid,cname,fname,fat,snf,weight,remarks) values(?,?,?,?,?,?,?,?,?,?,?,?,?)`, [ptype,cid,pdate,pprice,pshift,totalprice,cuid,cname,fname,fat,snf,weight,remarks], (error, rows, fields) => {
    if (error) {
        console.log(error);
        connection.rollback(() => {
            connection.release();
            return res.status(500).json({ success: false, message: "An error occurred" });
        });
    }

    
    // Change: Added a space before ellipsis to improve readability
    // Create or update ${username}_totalcalc table
    connection.query(`create table if not exists ${username}_totalcalc(id int auto_increment primary key , cname varchar(100) , fname varchar(100) , cid int , cuid varchar(8) , amountDue float , amountReceived float  , foreign key (cname) references ${username}_customers(c_name) , foreign key (fname) references ${username}_customers(father_name) ,foreign key(cid) references ${username}_customers(id) , foreign key(cuid) references ${username}_customers(uid) )`, (error, rows, fields) => {
        if (error) {
            console.log(error);
            connection.rollback(() => {
                connection.release();
                return res.status(500).json({ success: false, message: "An error occurred" });
            });
        }

       // if user already exists update its data else create new entry
        connection.query(`select * from ${username}_totalcalc where cuid=? and cid=?`,[cuid,cid], (error, rows, fields) => {
            // if error
            if (error) {
                console.log(error);
                connection.rollback(() => {
                    connection.release();
                    return res.status(500).json({ success: false, message: "An error occurred" });
                });
            }

            if(rows.length>0){
                // udpdate
                if(ptype.toLowerCase()=="sell"){
                    const amount=rows[0].amountDue + totalprice;
                    connection.query(`update ${username}_totalcalc set amountDue=? where cuid=? and cid=?`,[amount,cuid,cid], (error, rows, fields) => {
                        // if error
                        if (error) {
                            console.log(error);
                            connection.rollback(() => {
                                connection.release();
                                return res.status(500).json({ success: false, message: "An error occurred" });
                            });
                    }
                    // else commit (save )
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
                    });
                } else if(ptype.toLowerCase()=="buy"){
                    const amount=rows[0].amountReceived + totalprice;
                    connection.query(`update ${username}_totalcalc set amountReceived=? where cuid=? and cid=?`,[amount,cuid,cid], (error, rows, fields) => {
                        // if error
                        if (error) {
                            console.log(error);
                            connection.rollback(() => {
                                connection.release();
                                return res.status(500).json({ success: false, message: "An error occurred" });
                            });
                    }
                    // else commit (save )
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
                    });
                }
            }else{
                // insert
                if(ptype.toLowerCase()=="sell"){
                    connection.query(`insert into ${username}_totalcalc (cname,fname,cid,cuid,amountDue,amountReceived) values (?,?,?,?,?,0)`,[cname,fname,cid,cuid,totalprice], (error, rows, fields) => {
                        // if error
                        if (error) {
                            console.log(error);
                            connection.rollback(() => {
                                connection.release();
                                return res.status(500).json({ success: false, message: "An error occurred" });
                            });
                        }
                        // commit
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
                    });
                } else if(ptype.toLowerCase()=="buy"){
                    connection.query(`insert into ${username}_totalcalc (cname,fname,cid,cuid,amountDue,amountReceived) values (?,?,?,?,0,?)`,[cname,fname,cid,cuid,totalprice], (error, rows, fields) => {
                        // if error
                        if (error) {
                            console.log(error);
                            connection.rollback(() => {
                                connection.release();
                                return res.status(500).json({ success: false, message: "An error occurred" });
                            });
                        }
                        // commit
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
                    });
                }
            }

        });
    });
});
                            }
                        })

                        
                        
                    });
                });
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export default handler;
