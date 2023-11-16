import pool from "@/lib/db";

const handler = async (req, res) => {
    if (req.method === "POST") {
      try {
        const {emailLower,password}=req.body;
        pool.query(`SELECT * FROM users where email = ?`,[emailLower],(error,rows,fields)=>{
            console.log(rows)
            if(rows.length>0){
                if(rows[0].password === password){
                    return res.status(200).json({ success: true, user: rows[0] ,msg :"User Authenticated" });
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