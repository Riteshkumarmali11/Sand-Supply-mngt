// routes/registration.js
const express = require('express');
const db = require('../dbconfig');

const router = express.Router();

router.post('/', (req, res) => {
    const {
        username,
        address,
        mobile,
        altermobile,
        aadhar,
        email,
        password,
        cpassword
    } = req.body;

    // Insert registration data into the database
    const sql = 'INSERT INTO custprojectregistration (username, address, mobile, altermobile, aadhar, email, password, cpassword) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [ username, address, mobile, altermobile, aadhar, email, password, cpassword];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error registering user:', err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        console.log('User registered successfully');
        res.status(200).json({ success: true, message: 'User registered successfully' });
    });
});

// Update registration by ID
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const { username, address, mobile, altermobile, aadhar, email, password, cpassword } = req.body;

    const sql = 'UPDATE custprojectregistration SET username=?, address=?, mobile=?, altermobile=?, aadhar=?, email=?, password=? , cpassword=? WHERE id=?';
    db.query(sql, [username, address, mobile, altermobile, aadhar, email, password, cpassword, id], (err, result) => {
        if (err) {
            console.error('Error updating registration:', err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        console.log('Registration updated successfully');
        res.status(200).json({ success: true, message: 'Registration updated successfully' });
    });
});

// Delete registration by ID
router.delete('/:id', (req, res) => {
    const id = req.params.id;

    const sql = 'DELETE FROM custprojectregistration WHERE id=?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting registration:', err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        console.log('Registration deleted successfully');
        res.status(200).json({ success: true, message: 'Registration deleted successfully' });
    });
});


module.exports = router;
