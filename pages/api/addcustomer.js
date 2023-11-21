import pool from "@/lib/db";

const handler = async (req, res) => {
    const {name,fatherName,mobile,address,username,generatedString}= req.body;
    try {
        pool.query(`create table if not exists ${username}_customers( id int auto_increment primary key ,c_name varchar(50),father_name varchar(50),mobile varchar(10) , address varchar(200), uid varchar(8) unique ,INDEX(c_name),
        INDEX(father_name),
        INDEX(id),
        INDEX(uid) );
        `,(error,rows,fields)=>{
            if(error){
                console.log("error ",error)
                return res.status(500).json({ success: false, message: "Error occurred while adding a customer" });
            }
           pool.query(`Insert into ${username}_customers (c_name,father_name,mobile,address,uid) values (?,?,?,?,?)`,[name,fatherName,mobile,address,generatedString],(error,rows,fields)=>{
            if (error) {
                console.log("error ",error)
                // Handle the error, and possibly send an error response
                return res.status(500).json({ success: false, message: "Error occurred while adding a customer" });
            }
            // If there is no error, assume the insertion was successful
            return res.status(200).json({ success: true, message: "Customer added successfully" });

           })
        });  
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error"});
    }    

};
  
  export default handler;