import CryptoJS from "crypto-js";
import pool from "@/lib/db";

const handler = async (req, res) => {
  try {
    const token = req.body.token;
    pool.query(`SELECT * FROM forgot where token = ?`,[token],(error,rows,fields)=>{
     if(rows.length>0){
        const tokenRecord = rows[0];
        const currentTime = Date.now();
        const encryptedPassword = CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString();

        // If the reset token has already expired, return an error
        if (currentTime<tokenRecord.resetTokenExpiration) {
          pool.query(`UPDATE users SET password = ? WHERE email = ?`,[encryptedPassword,tokenRecord.email],(error,rows,fields)=>{
            if(error){
              res.status(400).json({success: false, message:"Failed"})
            }
            res.status(400).json({success: true, message:"Changed password"})
            
         });   
        }else {
          // If the reset token has already expired, return an error.
          return res.status(400).json({ success: false, message: "Token has already expired." });
        }
      }else{
        return res.status(400).json({ success: false, message: "Check Your Details" });
      }
  });    

        

    return res.status(200).json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export default handler;