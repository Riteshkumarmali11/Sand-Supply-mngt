// routes/registration.js
const express = require('express');
const db = require('../dbconfig');

const router = express.Router();

router.get('/', (req, res) => {
    // Fetch registration data from the database
    const sql = 'SELECT * FROM masterregistration';
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching registrations:', err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        console.log('Registrations fetched successfully');
        res.status(200).json({ success: true, data: results });
    });
});

module.exports = router;
