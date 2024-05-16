// routes/registration.js
const express = require('express');
const db = require('../dbconfig');

const router = express.Router();

router.get('/', (req, res) => {
    // SQL query to fetch all registration data with associated products
    const sql = `
        SELECT r.id, r.invoiceno, r.ownername, r.companyname, r.companyaddress, 
        r.mobile, r.date, r.paymode, r.vehiclenumber, r.drivername, r.openingbalance, p.purchase_id, p.product_name, 
        p.price, p.unit, p.quantity, p.tamount, p.gstAmount, p.totalAmountWithGST
        FROM purchase r
        LEFT JOIN purchase_products p ON r.id = p.purchase_id;
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
                    ownername: row.ownername,
                    companyname: row.companyname,
                    companyaddress: row.companyaddress,
                    mobile: row.mobile,
                    date: row.date,
                    paymode:row.paymode,
                    vehiclenumber: row.vehiclenumber,
                    drivername: row.drivername,
                    openingbalance:row.openingbalance,
                    products: [] // Initialize an array to hold products
                };
            }

            // Push product details into the products array
            if (row.product_name) {
                data[registrationId].products.push({
                    purchase_id:row.purchase_id,
                    product_name: row.product_name,
                    price: row.price,
                    unit:row.unit,
                    quantity: row.quantity,
                    tamount: row.tamount,
                    gstAmount:row.gstAmount,
                    totalAmountWithGST:row.totalAmountWithGST
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
    SELECT r.id, r.invoiceno, r.ownername, r.companyname, r.companyaddress, 
        r.mobile, r.date, r.paymode, r.vehiclenumber, r.drivername, r.openingbalance, p.purchase_id, p.product_name, 
        p.price, p.unit, p.quantity, p.tamount, p.gstAmount, p.totalAmountWithGST
        FROM purchase r
        LEFT JOIN purchase_products p ON r.id = p.purchase_id
        WHERE r.id = ?;
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
            ownername: results[0].ownername,
            companyname: results[0].companyname,
            companyaddress: results[0].companyaddress,
            mobile: results[0].mobile,
            date: results[0].date,
            paymode:results[0].paymode,
            vehiclenumber: results[0].vehiclenumber,
            drivername: results[0].drivername,
            openingbalance:results[0].openingbalance,
            products: results.map(row => ({
                purchase_id:row.purchase_id,
                product_name: row.product_name,
                price: row.price,
                unit:row.unit,
                quantity: row.quantity,
                tamount: row.tamount,
                gstAmount:row.gstAmount,
                totalAmountWithGST:row.totalAmountWithGST
            }))
        };

        res.status(200).json({ success: true, data });
    });
});

module.exports = router;
