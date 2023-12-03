// import pool from "@/lib/db";
// import jwt from 'jsonwebtoken'

// const handler = async (req, res) => {
//     const {name,fatherName,mobile,address,token,generatedString}= req.body;
//     let username=''
//     try {
//         let key = "Iam@User"
//         if(key ){
//             jwt.verify(token, key, function(err, decoded) {
//                 username=decoded.email.toLowerCase().split('@')[0].toLowerCase();
//             });          
//         }
//         if(username.length>0){
//             pool.getConnection((err, connection) => {
//                 if (err) {
//                     console.log("error ",error)
//                     return res.status(500).json({ success: false, message: "Error occurred while adding a customer" });
//                 }
//                 connection.query(`create table if not exists ${username}_customers( id int auto_increment primary key ,c_name varchar(50),father_name varchar(50),mobile varchar(10) , address varchar(200), uid varchar(8) unique ,INDEX(c_name),
//                 INDEX(father_name),
//                 INDEX(id),
//                 INDEX(uid) );
//                 `,(error,rows,fields)=>{
//                     if(error){
//                         console.log("error ",error)
//                         connection.release();
//                         return res.status(500).json({ success: false, message: "Error occurred while adding a customer" });
//                     }
//                     connection.query(`Insert into ${username}_customers (c_name,father_name,mobile,address,uid) values (?,?,?,?,?)`,[name,fatherName,mobile,address,generatedString],(error,rows,fields)=>{
//                         if (error) {
//                             console.log("error ",error)
//                             connection.release();
//                             return res.status(500).json({ success: false, message: "Error occurred while adding a customer" });
//                         }
//                         connection.release();
//                         return res.status(200).json({ success: true, message: "Customer added successfully" });
//                     })
//                 });
//             });
//         }
//     } catch (error) {
//         return res.status(500).json({ success: false, message: "Internal Server Error"});
//     }    
// };
  
// export default handler;

import pool from "@/lib/db";
import jwt from 'jsonwebtoken'

const handler = async (req, res) => {
    const {name,fatherName,mobile,address,token,generatedString}= req.body;
    let username=''
    try {
        let key = "Iam@User"
        if(key ){
            jwt.verify(token, key, function(err, decoded) {
                username=decoded.email.toLowerCase().split('@')[0].toLowerCase();
            });          
        }
        if(username.length>0){
            const connection = await pool.promise().getConnection();
            try {
                await connection.query(`create table if not exists ${username}_customers( id int auto_increment primary key ,c_name varchar(50),father_name varchar(50),mobile varchar(10) , address varchar(200), uid varchar(8) unique ,INDEX(c_name),
                INDEX(father_name),
                INDEX(id),
                INDEX(uid) );
                `);
                await connection.query(`Insert into ${username}_customers (c_name,father_name,mobile,address,uid) values (?,?,?,?,?)`,[name,fatherName,mobile,address,generatedString]);
                return res.status(200).json({ success: true, message: "Customer added successfully" });
            } catch (error) {
                console.log("error ",error)
                return res.status(500).json({ success: false, message: "Error occurred while adding a customer" });
            } finally {
                connection.release();
            }
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error"});
    }    
};
  
export default handler;
