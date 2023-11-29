import pool from "@/lib/db";
const jwt = require('jsonwebtoken')

const handler = async (req, res) => {
  const { type, token } = req.body;
  let key = "Iam@User";
  const username = jwt.verify(token, key).email.split('@')[0];
  try {
    if (type == 'tcustomers') {
      var totalCust = 0;
      var snf = 0;
      var fat = 0;
      var regular = 0;
      pool.getConnection((err, connection) => {
        if (err) {
          return res.status(400).json({ success: false, message: 'Unable to retrieve' });
        }
        connection.query(`select * from ${username}_customers`, (error, rows) => {
          if (error) {
            connection.release();
            return res.status(400).json({ success: false, message: 'Unable to retrieve' });
          }
          totalCust = rows.length;

          // get milk prices
          connection.query(`select * from ${username}_milkprice where mtype='regular'`, (error, rows) => {
            regular = rows[0].price;
            connection.query(`select * from ${username}_milkprice where mtype='buffalofat'`, (error, rows) => {
              fat = rows[0].price;
              connection.query(`select * from ${username}_milkprice where mtype='cowsnf'`, (error, rows) => {
                snf = rows[0].price;
                connection.release();
                return res.status(200).json({ success: true, totalCust, snf, fat, regular });
              });
            });
          });
        });
      });
    } else if (type == 'getcalc') {
      pool.getConnection((err, connection) => {
        if (err) {
          return res.status(400).json({ success: false, message: 'Unable to retrieve' });
        }
        connection.query(`select * from ${username}_totalcalc`, (error, rows) => {
          if (error) {
            connection.release();
            return res.status(400).json({ success: false, message: 'Unable to retrieve' });
          }
          connection.release();
          return res.status(200).json({ success: true, data: rows });
        });
      });
    } else if (type == 'todaysale') {
      const { tdate } = req.body;
      pool.getConnection((err, connection) => {
        if (err) {
          return res.status(400).json({ success: false, message: 'Unable to retrieve' });
        }
        connection.query(`select * from ${username}_milk where pdate=?`, [tdate], (error, rows) => {
          if (error) {
            connection.release();
            console.log(error);
            return res.status(400).json({ success: false, message: 'Unable to retrieve' });
          }
          let sale = 0, purchase = 0;
          let eventingSale=0,eveingPurchase=0;
          let milkcollected=0,milksold=0;
          rows.forEach(item => {
            if (item.ptype == "Buy") {
              if(item.pshift=='Morning'){
                purchase += item.totalprice;
              }else{
                eveingPurchase+= item.totalprice;
              }
              milkcollected+=item.weight;
            } else {
              if(item.pshift=='Morning'){
                sale += item.totalprice;
              }else{
                eventingSale+=item.totalprice;
              }
              milksold+=item.weight;
            }
          });
          connection.release();
          return res.status(200).json({ success: true, message: "Data fetched successfully", sale, milkcollected,milksold,purchase,eveingPurchase,eventingSale });
        });
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Add data to check dashboard" });
  }
}

export default handler;
