// routes/registration.js
const express = require('express');
const db = require('../dbconfig');

const router = express.Router();

router.post('/', (req, res) => {
    const {
        id,
        invoiceno,
        selectedOwnerName,
        recievedAmount,
        dueAmount,
        paymode,
        fromdate,
        status,
        openingbal
       
    } = req.body;

    // Insert registration data into the database
    const sql = 'INSERT INTO salesinventory (id, invoiceno, selectedOwnerName, recievedAmount, dueAmount, paymode, fromdate, status, openingbal) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [id, invoiceno, selectedOwnerName, recievedAmount, dueAmount, paymode, fromdate, status, openingbal];

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
// router.put('/:id', (req, res) => {
//     const id = req.params.id;
//     const {vehicleno, vehicletype, km, owner, insurance, model} = req.body;

//     const sql = 'UPDATE vehicleregistration SET vehicleno=?, vehicletype=?, km=?, owner=?, insurance=?, model=? WHERE id=?';
//     db.query(sql, [vehicleno, vehicletype, km, owner, insurance, model, id], (err, result) => {
//         if (err) {
//             console.error('Error updating registration:', err);
//             return res.status(500).json({ success: false, message: 'Internal server error' });
//         }
//         console.log('Registration updated successfully');
//         res.status(200).json({ success: true, message: 'Registration updated successfully' });
//     });
// });

// // Delete registration by ID
// router.delete('/:id', (req, res) => {
//     const id = req.params.id;

//     const sql = 'DELETE FROM vehicleregistration WHERE id=?';
//     db.query(sql, [id], (err, result) => {
//         if (err) {
//             console.error('Error deleting registration:', err);
//             return res.status(500).json({ success: false, message: 'Internal server error' });
//         }
//         console.log('Registration deleted successfully');
//         res.status(200).json({ success: true, message: 'Registration deleted successfully' });
//     });
// });


module.exports = router;
