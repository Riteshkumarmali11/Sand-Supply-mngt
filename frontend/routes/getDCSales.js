
const express = require('express');
const db = require('../dbconfig');

const router = express.Router();

router.get('/:invoiceno', (req, res) => {
    const { invoiceno } = req.params;

    // SQL query to fetch a single registration by ID
    const sql = `
    SELECT r.id, r.invoiceno, r.date, r.buildername, r.sitename, r.siteaddress, 
    r.mobile, r.gstno, r.vehiclenumber, r.drivername, r.latitude, r.longitude, p.product_name, 
    p.hsncode, p.gst, p.price, p.quantity, p.tamount, p.gstAmount, p.totalAmountWithGST
    FROM sales r
    LEFT JOIN sales_products p ON r.id = p.sale_id
        WHERE r.id = ?;
    `;

    db.query(sql, [invoiceno], (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        // Process the fetched data and handle errors
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Registration not found' });
        }

        // Organize the data into a suitable format (e.g., nested objects)
        const data = {
            id: results[0].id,
            invoiceno: results[0].invoiceno,
            date: results[0].date,
            buildername: results[0].buildername,
            sitename: results[0].sitename,
            siteaddress: results[0].siteaddress,
            mobile: results[0].mobile,
            gstno: results[0].gstno,
            vehiclenumber: results[0].vehiclenumber,
            drivername: results[0].drivername,
            latitude:results[0].latitude,
            longitude:results[0].longitude,
            products: results.map(row => ({
                product_name: row.product_name,
                hsncode: row.hsncode,
                gst: row.gst,
                price: row.price,
                quantity: row.quantity,
                tamount: row.tamount,
                gstAmount: row.gstAmount,
                totalAmountWithGST: row.totalAmountWithGST
            }))
        };

        res.status(200).json({ success: true, data });
    });
});

module.exports = router;