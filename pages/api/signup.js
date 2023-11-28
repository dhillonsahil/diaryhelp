import pool from "@/lib/db";
var CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      const { name, emailLower, diaryName, password, mobile } = req.body;

      pool.getConnection((error, connection) => {
        if (error) {
          return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
        }

        connection.beginTransaction((error) => {
          if (error) {
            connection.release();
            return res
              .status(500)
              .json({ success: false, message: "Internal Server Error" });
          }

          connection.query(
            `create table if not exists users(id int primary key auto_increment not null ,p_name varchar(30), d_name varchar(50) ,email varchar(60) , password varchar(30) , mobile varchar(20) , payment varchar(20) default 'trial')`,
            (error, rows) => {
              if (error) {
                connection.rollback(() => {
                  connection.release();
                  return res
                    .status(500)
                    .json({ success: false, message: "Internal Server Error" });
                });
              }

              connection.query(
                `SELECT * FROM users where email = ?`,
                [emailLower],
                (error, rows, fields) => {
                  if (error) {
                    connection.rollback(() => {
                      connection.release();
                      return res.status(400).json({
                        success: false,
                        error: "Internal server error",
                      });
                    });
                  }

                  if (rows.length > 0) {
                    connection.rollback(() => {
                      connection.release();
                      return res.status(400).json({
                        success: false,
                        error: "Account Already Exist",
                      });
                    });
                  } else {
                    connection.query(
                      `INSERT INTO users (p_name,email,d_name,password,mobile) VALUES (?,?,?,?,?)`,
                      [name, emailLower, diaryName, password, mobile],
                      (error, rows, fields) => {
                        if (error) {
                          connection.rollback(() => {
                            connection.release();
                            return res.status(500).json({
                              success: false,
                              error: "Internal server error",
                            });
                          });
                        }

                        connection.commit((error) => {
                          if (error) {
                            connection.rollback(() => {
                              connection.release();
                              return res.status(500).json({
                                success: false,
                                error: "Internal server error",
                              });
                            });
                          }

                          connection.release();

                          var token = jwt.sign(
                            { email: emailLower, name: rows[0].name },
                            "Iam@User",
                            {
                              expiresIn: "2d",
                            }
                          );

                          return res.status(200).json({
                            success: true,
                            message: "Account Created Successfully!",
                            token,
                          });
                        });
                      }
                    );
                  }
                }
              );
            }
          );
        });
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
