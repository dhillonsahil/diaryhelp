import pool from "@/lib/db";
const jwt = require('jsonwebtoken')

const handler = async (req, res) => {
    const { token } = req.body;
    let key = "Iam@User";
    const username = jwt.verify(token, key).email.split('@')[0];
    try {
        const { startDate, endDate, cid } = req.body;
        // Check if table exists
        pool.query(`SHOW TABLES LIKE '${username}_milk'`, (error, rows) => {
            if (error) {
                console.log("Error occurred while checking table existence");
                return res.status(400).json({ success: false, message: 'Unable to check table existence' });
            }
            if (rows.length == 0) {
                // Table does not exist, return empty array
                console.log("Table does not exist");
                return res.status(200).json({ success: true, message: 'Table does not exist', data: [] });
            }

            pool.query(`SELECT * FROM ${username}_milk WHERE cid=? AND pshift='' AND pdate>=? AND pdate <=? ORDER BY pdate ASC`, [cid, startDate, endDate], (error, rows) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({ error: error.message, success: false });
                } else {
                    res.status(200).json({ success: true, data: rows });
                }
            });
        });
    } catch (error) {
        console.log(error);
    }
}

export default handler;
