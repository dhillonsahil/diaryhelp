import pool from "@/lib/db";
const jwt = require('jsonwebtoken')

const handler = (req, res) => {
    const { token } = req.body;
    let key = "Iam@User";
    const username = jwt.verify(token, key).email.split('@')[0];
    try {
        const { startDate, endDate, cid } = req.body;
        // Check if table exists
        pool.query(`SHOW TABLES LIKE '${username}_milk'`, (error, rows) => {
            if (error) {
                return res.status(400).json({ success: false, message: 'Unable to check table existence' });
            }
            if (rows.length == 0) {
                // Table does not exist, return empty array
                return res.status(200).json({ success: true, message: 'Table does not exist', data: [] });
            }

            pool.getConnection((err, connection) => {
                if (err) {
                    return res.status(500).json({ error: err.message, success: false });
                }
                connection.beginTransaction((err) => {
                    if (err) {
                        connection.release();
                        return res.status(500).json({ error: err.message, success: false });
                    }
                    connection.query(`select * from ${username}_milk where cid=? and pshift!='' and pdate>=? and pdate <=? ORDER BY pdate ASC`, [cid, startDate, endDate], (error, rows) => {
                        if (error) {
                            connection.rollback(() => {
                                connection.release();
                                res.status(500).json({ error: error.message, success: false });
                            });
                        } else {
                            connection.commit((err) => {
                                if (err) {
                                    connection.rollback(() => {
                                        connection.release();
                                        res.status(500).json({ error: err.message, success: false });
                                    });
                                } else {
                                    connection.release();
                                    res.status(200).json({ success: true, data: rows });
                                }
                            });
                        }
                    });
                });
            });
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export default handler;
