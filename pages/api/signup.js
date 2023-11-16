import pool from "@/lib/db";
//  Create table using this syntax

// create table users(id int primary key auto_increment not null ,p_name varchar(30), d_name varchar(50) ,email varchar(60) , password varchar(30) , mobile varchar(20) , payment varchar(20) default 'trial');


const handler = async (req, res) => {
    if (req.method === "POST") {
      try {
        const {name,emailLower,diaryName,password,mobile}=req.body;
        pool.query(`SELECT * FROM users where email = ?`,[emailLower],(error,rows,fields)=>{
          // if user EXISTS already
            if(rows.length>0){
                return res.status(400).json({success:false,error:"Account Already Exist"})
            }else{
              // if user does not exist
                pool.query(`INSERT INTO users (p_name,email,d_name,password,mobile) VALUES (?,?,?,?,?)`,[name,emailLower,diaryName,password,mobile],(error,rows,fields)=>{
                    if(error){
                        return res.status(500).json({success:false,error:"Internal server error"})
                    }else{
                        return res.status(200).json({success:true,message:"Account Created Successfully!"})
                    }
                })
            }
        });    
      } catch (error) {
        // Handle any errors that might occur during the database operation
        return res.status(500).json({ success: false, error: "Internal server error" });
      }
    } else {
      return res.status(400).json({ success: false, error: "Bad request" });
    }

  };
  
  export default handler;