const mysql = require('mysql2');

// // create the connection to database
// const connection = mysql.createConnection({
//   host: process.env.MYSQL_HOST,
//   port: process.env.MYSQL_PORT,
//   user: process.env.MYSQL_USER,
//   database: process.env.MYSQL_DATABASE,
//   password:process.env.MYSQL_PASSWORD
// });


const pool = mysql.createPool({
  // host: process.env.MYSQL_HOST,
  // port: process.env.MYSQL_PORT,
  // user: process.env.MYSQL_USER,
  // database: process.env.MYSQL_DATABASE,
  // password:process.env.MYSQL_PASSWORD,
  host: "localhost",
  port: 3306,
  user: "root",
  database: "diaryhelp",
  password:"1492",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
export default pool;