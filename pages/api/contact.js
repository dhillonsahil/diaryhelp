import pool from "@/lib/db";

const handler = (req, res) => {
  try {
    const { uname, mobile, message } = req.body;
    pool.getConnection((error, connection) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
      }
      connection.beginTransaction((error) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
        connection.query(
          `create table if not exists contact(id INTEGER PRIMARY KEY auto_increment , uname varchar(255) , mobile varchar(255) ,message varchar(800) )`,
          (error) => {
            if (error) {
              console.log(error);
              return res.status(500).json({ success: false, message: "Internal Server Error" });
            }
            connection.query(
              `insert into contact(uname,mobile,message) values(?,?,?)`,
              [uname, mobile, message],
              (error) => {
                if (error) {
                  console.log(error);
                  return res.status(500).json({ success: false, message: "Internal Server Error" });
                }
                connection.commit((error) => {
                  if (error) {
                    console.log(error);
                    return res.status(500).json({ success: false, message: "Internal Server Error" });
                  }
                  connection.release();
                  return res.status(200).json({ success: true, message: "Message Sent Successfully" });
                });
              }
            );
          }
        );
      });
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export default handler;
