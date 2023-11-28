import pool from "@/lib/db";
const jwt=require('jsonwebtoken')

const handler = async (req, res) => {
    const { type, token } = req.body;
    let key = "Iam@User";
    const username = jwt.verify(token, key).email.split('@')[0];
    try {
        if (type == 'add') {
            pool.getConnection((err, connection) => {
                if (err) {
                    console.log(err);
                    return res.status(400).json({ success: false, message: 'Unable to get connection' });
                }
                connection.beginTransaction((err) => {
                    if (err) {
                        console.log(err);
                        return res.status(400).json({ success: false, message: 'Unable to begin transaction' });
                    }
                    const { price, quant, itemName } = req.body;
                    connection.query(`INSERT INTO ${username}_itemstock (itemName, itemquantity, itemprice) VALUES (?, ?, ?)`, [itemName, quant, price], (error, rows) => {
                        if (error) {
                            connection.rollback(() => {
                                console.log(error);
                                return res.status(400).json({ success: false, message: 'Unable to insert' });
                            });
                        }
                        connection.commit((err) => {
                            if (err) {
                                connection.rollback(() => {
                                    console.log(err);
                                    return res.status(400).json({ success: false, message: 'Unable to commit transaction' });
                                });
                            }
                            connection.release();
                            return res.status(200).json({ success: true, message: 'Data inserted successfully' });
                        });
                    });
                });
            });
        } else if (type == 'viewAll') {
            pool.query(`SHOW TABLES LIKE '${username}_itemstock'`, (error, rows) => {
                if (error) {
                    return res.status(400).json({ success: false, message: 'Unable to check table existence' });
                }

                if (rows.length == 0) {
                    // Table does not exist, return empty array
                    return res.status(200).json({ success: true, message: 'Table does not exist', data: [] });
                }

                // Table exists, fetch data
                pool.query(`SELECT * FROM ${username}_itemstock`, (error, rows) => {
                    if (error) {
                        return res.status(400).json({ success: false, message: 'Unable to fetch data' });
                    }

                    return res.status(200).json({ success: true, message: 'Data fetched successfully', data: rows });
                });
            });
        } else if (type == 'updatePrice') {
            const { newPrice, id } = req.body;
            pool.query(`UPDATE ${username}_itemstock SET itemprice=? WHERE id=?`, [newPrice, id], (error, rows) => {
                if (error) {
                    return res.status(400).json({ success: false, message: 'Unable to update' });
                }
                return res.status(200).json({ success: true, message: 'Data updated successfully' });
            });
        } else if (type == 'updateStock') {
            const { newStock, id } = req.body;
            pool.query(`UPDATE ${username}_itemstock SET itemquantity=? WHERE id=?`, [newStock, id], (error, rows) => {
                if (error) {
                    return res.status(400).json({ success: false, message: 'Unable to update' });
                }
                return res.status(200).json({ success: true, message: 'Data updated successfully' });
            });
        }
    } catch (error) {
        console.log(error);
    }
}

export default handler
