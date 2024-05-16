// routes/salesPage.js
const express = require('express');
const db = require('../dbconfig');

const router = express.Router();

router.get('/', (req, res) => {
    // SQL query to fetch sales data along with associated product details
    const sql = `
    SELECT s.tid, s.id, s.invoiceno, s.selectedOwnerName, p.sale_id, p.product_name, p.price
    FROM salesinventory s
    LEFT JOIN sales_products p ON s.id = p.sale_id
    WHERE s.id = p.sale_id;
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching sales data:', err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        // Organize the fetched data into a suitable format
        const data = {};

        results.forEach(row => {
            const registrationId = row.id;
            if (!data[registrationId]) {
                // Initialize a new object for this registration if not already present
                data[registrationId] = {
                    id: registrationId,
                    invoiceno: row.invoiceno,
                    selectedOwnerName: row.selectedOwnerName,
                    products: [] // Initialize an array to hold products
                };
            }

            // Push product details into the products array
            if (row.product_name) {
                data[registrationId].products.push({
                    product_name: row.product_name,
                    price: row.price,
                });
            }
        });

        // Convert the data object into an array of registrations
        const salesData = Object.values(data);

        // Render the sales page template with fetched data
        res.render('salesPage', { salesData });
    });
});

module.exports = router;
