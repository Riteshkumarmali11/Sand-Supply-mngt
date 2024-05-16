// routes/registration.js
const express = require('express');
const db = require('../dbconfig');

const router = express.Router();

router.get('/', (req, res) => {
    // SQL query to fetch all registration data with associated products
    const sql = `
        SELECT r.id, r.date, r.time, r.buildername, r.sitename, r.siteaddress, 
        r.mobile, r.supervisorname, r.supervisormobile, r.quotation, r.openingbal, p.product_name, 
        p.price, p.quantity, p.tamount, p.image
        FROM registrations r
        LEFT JOIN products p ON r.id = p.registration_id;
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
                    date: row.date,
                    time: row.time,
                    buildername: row.buildername,
                    sitename: row.sitename,
                    siteaddress: row.siteaddress,
                    mobile: row.mobile,
                    supervisorname: row.supervisorname,
                    supervisormobile: row.supervisormobile,
                    quotation: row.quotation,
                    openingbal:row.openingbal,
                    products: [] // Initialize an array to hold products
                };
            }

            // Push product details into the products array
            if (row.product_name) {
                data[registrationId].products.push({
                    product_name: row.product_name,
                    price: row.price,
                    quantity: row.quantity,
                    tamount: row.tamount,
                    image: row.image
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
        SELECT r.id, r.date, r.time, r.buildername, r.sitename, r.siteaddress, 
        r.mobile, r.supervisorname, r.supervisormobile, r.quotation, r.openingbal, p.product_name, 
        p.price, p.quantity, p.tamount, p.image
        FROM registrations r
        LEFT JOIN products p ON r.id = p.registration_id
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
            date: results[0].date,
            time: results[0].time,
            buildername: results[0].buildername,
            sitename: results[0].sitename,
            siteaddress: results[0].siteaddress,
            mobile: results[0].mobile,
            supervisorname: results[0].supervisorname,
            supervisormobile: results[0].supervisormobile,
            quotation: results[0].quotation,
            openingbal:results[0].openingbal,
            products: results.map(row => ({
                product_name: row.product_name,
                price: row.price,
                quantity: row.quantity,
                tamount: row.tamount,
                image: row.image
            }))
        };

        res.status(200).json({ success: true, data });
    });
});



module.exports = router;
