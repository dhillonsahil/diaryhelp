import pool from "@/lib/db";
import jwt from 'jsonwebtoken'

const handler = async(req,res)=>{
    const { type, token } = req.body;
    let key = process.env.JWT_SECRET;
    const username = jwt.verify(token, key).email.split('@')[0].toLowerCase();
    try {
        const {ptype,cid, pdate, pprice,totalprice, cuid, cname, fname,quant}=req.body;
        pool.getConnection((err, connection) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: "An error occurred" });
            }

            // transaction begins;
            connection.beginTransaction((err) => {
                if (err) {
                    console.log(err);
                    connection.release();
                    return res.status(500).json({ success: false, message: "An error occurred" });
                }

                // query area
                connection.query(`create table if not exists ${username}_milk(id int primary key auto_increment ,ptype varchar(10) , cid int , pdate date , pprice float, pshift varchar(10),totalprice float,cuid varchar(8) , cname varchar(100) , fname varchar(100), fat int , snf int,weight float , remarks varchar(100),foreign key(cname) references ${username}_customers(c_name) , foreign key(fname) references ${username}_customers(father_name), foreign key(cid) references ${username}_customers (id), foreign key (cuid) references ${username}_customers(uid) )`, (error, rows, fields) => {
                    if (error) {
                        console.log(error);
                        connection.rollback(() => {
                            connection.release();
                            return res.status(500).json({ success: false, message: "An error occurred" });
                        });
                    }
                    // now inserting data

                })

            })
        })
    } catch (error) {
        
    }
}

export default handler;