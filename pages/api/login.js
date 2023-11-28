import pool from "@/lib/db";
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      const { emailLower, password } = req.body;
      pool.getConnection((error, connection) => {
        if (error) {
          return res
            .status(500)
            .json({ success: false, error: "Internal server error" });
        }
        connection.query(
          `SELECT * FROM users where email = ?`,
          [emailLower],
          (error, rows, fields) => {
            connection.release();
            if (error) {
              return res
                .status(500)
                .json({ success: false, error: "Internal server error" });
            }
            if (rows.length > 0) {
              if (rows[0].password === password) {
                var token = jwt.sign(
                  { email: emailLower, name: rows[0].name },
                  "Iam@User",
                  {
                    expiresIn: "2d",
                  }
                );
                return res.status(200).json({ success: true, token });
              } else {
                return res
                  .status(400)
                  .json({ success: false, error: "Invalid password" });
              }
            }
          }
        );
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, error: "Internal server error" });
    }
  } else {
    return res.status(400).json({ success: false, error: "Bad request" });
  }
};

export default handler;
