// routes/registration.js
const express = require('express');
const db = require('../dbconfig');

const router = express.Router();

router.get('/', (req, res) => {
    // SQL query to fetch all registration data with associated products
    const sql = `
    SELECT r.id, r.invoiceno, r.date, r.buildername, r.sitename, r.siteaddress, 
    r.mobile, r.gstno, r.vehiclenumber, r.drivername, r.latitude, r.longitude, r.openingbal, r.recievedAmount, r.dueAmount, r.paymode, r.fromdate, r.status, p.sale_id, p.product_name, 
    p.hsncode, p.gst, p.price, p.quantity, p.tamount, p.gstAmount, p.totalAmountWithGST
    FROM sales r
    LEFT JOIN sales_products p ON r.id = p.sale_id
    ORDER BY r.date DESC;
`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        // Organize the data into a suitable format (e.g., nested objects)
        const data = {};

        results.forEach(row => {
            const registrationId = row.id;
            if (!data[registrationId]) {
                // Initialize a new object for this registration if not already present
                data[registrationId] = {
                    id: registrationId,
                    invoiceno: row.invoiceno,
                    date: row.date,
                    buildername: row.buildername,
                    sitename: row.sitename,
                    siteaddress: row.siteaddress,
                    mobile: row.mobile,
                    gstno: row.gstno,
                    vehiclenumber: row.vehiclenumber,
                    drivername: row.drivername,
                    latitude: row.latitude,
                    longitude: row.longitude,
                    openingbal:row.openingbal,
                    recievedAmount: row.recievedAmount,
                    dueAmount: row.dueAmount,
                    paymode: row.paymode,
                    fromdate: row.fromdate,
                    status: row.status,
                    products: [] // Initialize an array to hold products
                };
            }

            // Push product details into the products array
            if (row.product_name) {
                data[registrationId].products.push({
                    sale_id:row.sale_id,
                    product_name: row.product_name,
                    hsncode: row.hsncode,
                    gst: row.gst,
                    price: row.price,
                    quantity: row.quantity,
                    tamount: row.tamount,
                    gstAmount: row.gstAmount,
                    totalAmountWithGST: row.totalAmountWithGST
                });
            }
        });

        // Convert the data object into an array of registrations
        const registrationsArray = Object.values(data);

        res.status(200).json({ success: true, data: registrationsArray });
    });
});

// Route to fetch a single registration by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;

    // SQL query to fetch a single registration by ID
    const sql = `
    SELECT r.id, r.invoiceno, r.date, r.buildername, r.sitename, r.siteaddress, 
    r.mobile, r.gstno, r.vehiclenumber, r.drivername, r.latitude, r.longitude, r.openingbal, p.sale_id, p.product_name, 
    p.hsncode, p.gst, p.price, p.quantity, p.tamount, p.gstAmount, p.totalAmountWithGST
    FROM sales r
    LEFT JOIN sales_products p ON r.id = p.sale_id
        WHERE r.id = ?
        ORDER BY r.date DESC;
    `;

    db.query(sql, [id], (err, results) => {
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
            latitude: results[0].latitude,
            longitude: results[0].longitude,
            openingbal:results[0].openingbal,
            products: results.map(row => ({
                sale_id:row.sale_id,
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
