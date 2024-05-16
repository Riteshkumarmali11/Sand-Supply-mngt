// routes/registration.js
const express = require('express');
const db = require('../dbconfig');

const router = express.Router();

router.post('/', (req, res) => {
    const {
        registrationname,
        mobile,
        email,
        address,
        nation,
        state,
        city,
        village,
        pincode,
        password,
        cpassword,
        profiletype,
        altermobile,
        remarks,
        status,
        empcd
    } = req.body;

    // Check if password and confirm password match
    if (password !== cpassword) {
        return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    // Insert registration data into the database
    const sql = 'INSERT INTO masterregistration (registrationname, mobile, email, address, nation, state, city, village, pincode, password, cpassword,profiletype, altermobile, remarks, status, empcd) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [registrationname, mobile, email, address, nation, state, city, village, pincode, password, cpassword, profiletype, altermobile, remarks, status, empcd];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error registering user:', err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        console.log('User registered successfully');
        res.status(200).json({ success: true, message: 'User registered successfully' });
    });
});

module.exports = router;
