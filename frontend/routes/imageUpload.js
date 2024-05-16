// routes/registration.js
const express = require('express');
const db = require('../dbconfig');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '..', 'routes'); // Define upload directory path
        cb(null, uploadDir); // Save files to the 'uploads' directory
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use the original file name
    }
});

const upload = multer({ storage: storage });

// Update the route to handle each image separately
router.post('/', upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }]), (req, res) => {
    console.log("Images Uploaded", req.files);
    const formData = req.body;

    const dataToInsert = {
        invoiceno: formData.invoiceno,
        status: formData.status,
        drivername: formData.drivername, // Add drivername from request body
        submissionDate: formData.submissionDate,
        image1: req.files['image1'] ? req.files['image1'][0].filename : '',
        image2: req.files['image2'] ? req.files['image2'][0].filename : '',
        image3: req.files['image3'] ? req.files['image3'][0].filename : ''
    };

    db.query('INSERT INTO imageupload SET ?', dataToInsert, (err, result) => {
        if (err) {
            console.error('Error registering data:', err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        console.log('Registration and products inserted successfully');
        res.status(200).json({ success: true, message: 'Registration and products inserted successfully', invoiceno: formData.invoiceno });
    });
});

module.exports = router;
