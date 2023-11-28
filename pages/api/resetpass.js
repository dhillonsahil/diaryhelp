import CryptoJS from "crypto-js";
import pool from "@/lib/db";

const handler = async (req, res) => {
  try {
    const token = req.body.token;
    pool.getConnection((error, connection) => {
      if (error) {
        console.error("Error getting database connection:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
      }
      
      connection.query(`SELECT * FROM forgot WHERE token = ?`, [token], (error, rows, fields) => {
        connection.release(); // Release the connection after the query is executed
        
        if (error) {
          console.error("Error executing SELECT query:", error);
          return res.status(500).json({ success: false, message: "Internal server error." });
        }
        
        if (rows.length > 0) {
          const tokenRecord = rows[0];
          const currentTime = Date.now();
          
          if (currentTime < tokenRecord.resetTokenExpiration) {
            pool.getConnection((error, connection) => {
              if (error) {
                console.error("Error getting database connection:", error);
                return res.status(500).json({ success: false, message: "Internal server error." });
              }
              
              connection.query(`UPDATE users SET password = ? WHERE email = ?`, [req.body.password, tokenRecord.email], (error, rows, fields) => {
                connection.release(); // Release the connection after the query is executed
                
                if (error) {
                  console.error("Error executing UPDATE query:", error);
                  return res.status(500).json({ success: false, message: "Internal server error." });
                }
                
                return res.status(200).json({ success: true, message: "Password updated successfully." });
              });
            });
          } else {
            return res.status(400).json({ success: false, message: "Token has already expired." });
          }
        } else {
          return res.status(400).json({ success: false, message: "Check your details." });
        }
      });
    });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export default handler;
