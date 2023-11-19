import pool from "@/lib/db";
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const handler = async (req, res) => {
    if (req.method === "POST") {
      try {
        const {emailLower,password}=req.body;
        pool.query(`SELECT * FROM users where email = ?`,[emailLower],(error,rows,fields)=>{
            
            if(rows.length>0){
              const bytes  = CryptoJS.AES.decrypt(rows[0].password, process.env.SECRET_KEY);
              const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
                if(decryptedData === password){
                  var token = jwt.sign({email:emailLower,name:rows[0].name},process.env.JWT_SECRET,{
                    expiresIn:"2d"
                  })
                    return res.status(200).json({ success: true, token,email:emailLower });
                }else{
                  return res.status(400).json({ success: false, error: "Invalid password" });
                }
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