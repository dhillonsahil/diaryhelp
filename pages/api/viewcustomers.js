// import pool from "@/lib/db";
// import jwt from 'jsonwebtoken'

// const handler = async (req, res) => {
//   try {
//     const { token } = req.body;
//     let key = "Iam@User";
    
//     if (key && token) {
//       jwt.verify(token, key, function(err, decoded) {
//         const username = decoded.email.split('@')[0].toLowerCase();
        
//         pool.getConnection(function(err, connection) {
//           if (err) {
//             console.log(err)
//             return res.status(500).json({ success: false, message: "Error occurred while getting a database connection" });
//           }
          
//           connection.query(`SHOW TABLES LIKE '${username}_customers'`, (error, rows) => {
//             if (error) {
//               connection.release();
//               return res.status(400).json({ success: false, message: 'Unable to check table existence' });
//             }
            
//             if (rows.length == 0) {
//               connection.release();
//               return res.status(200).json({ success: true, message: 'Table does not exist', data: [] });
//             }
            
//             connection.query(`SELECT * FROM ${username}_customers`, (error, rows, fields) => {
//               connection.release();
              
//               if (error) {
//                 console.log("Error ", error);
//                 return res.status(500).json({ success: false, message: "Error occurred while fetching customers" });
//               }
              
//               return res.status(200).json({ success: true, data: rows });
//             });
//           });
//         });
//       });
//     } else {
//       console.log("Error",);
//       return res.status(500).json({ success: false, message: "Error occurred while adding a customer" });
//     }
//   } catch (error) {
//     console.log("Error", error);
//     return res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// }

// export default handler;
import pool from "@/lib/db";
import jwt from 'jsonwebtoken'

const handler = async (req, res) => {
  try {
    const { token } = req.body;
    let key = "Iam@User";
    
    if (key && token) {
      jwt.verify(token, key, async function(err, decoded) {
        const username = decoded.email.split('@')[0].toLowerCase();
        
        try {
          const connection =await pool.promise().getConnection();
          
          try {
            const [rows] = await connection.query(`SHOW TABLES LIKE '${username}_customers'`);
            
            if (rows.length == 0) {
              return res.status(200).json({ success: true, message: 'Table does not exist', data: [] });
            }
            
            const [customers] = await connection.query(`SELECT * FROM ${username}_customers`);
            
            return res.status(200).json({ success: true, data: customers });
          } catch (error) {
            console.log("Error ", error);
            return res.status(500).json({ success: false, message: "Error occurred while fetching customers" });
          } finally {
            connection.release();
          }
        } catch (error) {
          console.log(err)
          return res.status(500).json({ success: false, message: "Error occurred while getting a database connection" });
        }
      });
    } else {
      console.log("Error");
      return res.status(500).json({ success: false, message: "Error occurred while adding a customer" });
    }
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export default handler;
