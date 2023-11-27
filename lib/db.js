const mysql = require('mysql2');


const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "dfhqnfsw_diaryhelper",
  database: "dfhqnfsw_diaryhelp",
  password:"&dF}p6p?qStM",
  waitForConnections: true,
  connectionLimit: 1000,
  queueLimit: 100,
});


export default pool;