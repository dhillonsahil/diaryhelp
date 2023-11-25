import pool from "@/lib/db";

const handler = async (req, res) => {
  try {
    const { uname, mobile, message } = req.body;
    pool.query(
      `create table if not exists contact(id INTEGER PRIMARY KEY auto_increment , uname varchar(255) , mobile varchar(255) ,message varchar(800) )`,
      (error, rows) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
        pool.query(
          `insert into contact(uname,mobile,message) values(?,?,?)`,
          [uname, mobile, message],
          (error, rows) => {
            if (error) {
              console.log(error);
              return res.status(500).json({ success: false, message: "Internal Server Error" });
            }
            return res.status(200).json({ success: true, message: "Message Sent Successfully" });
          }
        );
      }
    );
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export default handler;
