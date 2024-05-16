// routes/registration.js
const express = require('express');
const db = require('../dbconfig');
const router = express.Router();

// GET route to fetch all registration data
router.get('/', (req, res) => {
    db.query('SELECT * FROM imageupload', (err, results) => {
        if (err) {
            console.error('Error retrieving data:', err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        res.status(200).json({ success: true, data: results });
    });
});

module.exports = router;
