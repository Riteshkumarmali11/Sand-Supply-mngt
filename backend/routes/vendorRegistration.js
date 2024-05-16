// routes/registration.js
const express = require('express');
const db = require('../dbconfig');

const router = express.Router();

router.post('/', (req, res) => {
    const {
        companyname,
        companyaddress,
        ownername,
        username,
        mobile,
        altermobile,
        email,
        panno,
        gstno,
        bankname,
        ifsccode,
        accountno,
        openingbalance
    } = req.body;

    // Insert registration data into the database
    const sql = 'INSERT INTO vendorregistration (companyname, companyaddress,ownername, username, mobile, altermobile, email, panno, gstno, bankname, ifsccode, accountno, openingbalance) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [ companyname, companyaddress,ownername, username, mobile, altermobile, email, panno, gstno, bankname, ifsccode, accountno, openingbalance];

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
    const { companyname, companyaddress,ownername, username, mobile, altermobile, email, panno, gstno, bankname, ifsccode, accountno, openingbalance } = req.body;

    const sql = 'UPDATE vendorregistration SET companyname=?, companyaddress=?,ownername=?, username=?, mobile=?, altermobile=?, email=?,panno=?, gstno=?, bankname=?, ifsccode=?, accountno=?, openingbalance=?  WHERE id=?';
    db.query(sql, [companyname, companyaddress,ownername, username, mobile, altermobile, email, panno, gstno, bankname, ifsccode, accountno, openingbalance, id], (err, result) => {
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

    const sql = 'DELETE FROM vendorregistration WHERE id=?';
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
