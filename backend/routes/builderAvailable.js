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

// Update builderAvailable.js route to handle products array
router.post('/', upload.single('image'), (req, res) => {
    const formData = req.body;

    const dataToInsert = {
        date: formData.date,
        time: formData.time,
        buildername: formData.buildername,
        sitename: formData.sitename,
        siteaddress: formData.siteaddress,
        mobile: formData.mobile,
        supervisorname: formData.supervisorname,
        supervisormobile: formData.supervisormobile,
        openingbal:formData.openingbal,
        image: req.file ? req.file.filename : ''
    };

    db.query('INSERT INTO registrations SET ?', dataToInsert, (err, result) => {
        if (err) {
            console.error('Error registering data:', err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        // Insert products associated with the registration
        let products = [];
        if (formData.products) {
            try {
                console.log("Pro",formData.products);
                products = JSON.parse(formData.products);
            } catch (error) {
                console.error('Error parsing products JSON:', error);
                // Handle the parsing error, such as setting products to an empty array
                // products = [];
            }
        }
        products.forEach(product => {
            db.query('INSERT INTO products (registration_id, product_name, price, quantity, tamount, image) VALUES (?, ?, ?, ?, ?, ?)',
                [result.insertId, product.product_name, product.price, product.quantity, product.tamount, req.file ? req.file.filename : ''],
                (err, result) => {
                    if (err) {
                        console.error('Error inserting product:', err);
                        return res.status(500).json({ success: false, message: 'Internal server error' });
                    }
                });
        });

        console.log('Registration and products inserted successfully');
        res.status(200).json({ success: true, message: 'Registration and products inserted successfully' });
    });         
});

router.put('/:id', (req, res) => {
    const id = req.params.id;
    const { date, time, buildername, sitename, siteaddress, mobile, supervisorname, supervisormobile, openingbal, products } = req.body;

    const sql = 'UPDATE registrations SET date=?, time=?, buildername=?, sitename=?, siteaddress=?, mobile=?, supervisorname=?, supervisormobile=?, openingbal=? WHERE id=?';
    db.query(sql, [date, time, buildername, sitename, siteaddress, mobile, supervisorname, supervisormobile, openingbal, id], (err, result) => {
        if (err) {
            console.error('Error updating registration:', err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        // Update products associated with the registration
        if (products && products.length > 0) {
            db.query('DELETE FROM products WHERE registration_id = ?', [id], (err, result) => {
                if (err) {
                    console.error('Error deleting products:', err);
                    return res.status(500).json({ success: false, message: 'Internal server error' });
                }
                
                products.forEach(product => {
                    db.query('INSERT INTO products (registration_id, product_name, price, quantity, tamount) VALUES (?, ?, ?, ?, ?)',
                        [id, product.product_name, product.price, product.quantity, product.tamount],
                        (err, result) => {
                            if (err) {
                                console.error('Error inserting product:', err);
                                return res.status(500).json({ success: false, message: 'Internal server error' });
                            }
                        });
                });

                console.log('Registration and products updated successfully');
                res.status(200).json({ success: true, message: 'Registration and products updated successfully' });
            });
        } else {
            console.log('Registration updated successfully');
            res.status(200).json({ success: true, message: 'Registration updated successfully' });
        }
    });
});



// Delete registration by ID
// Delete registration by ID
router.delete('/:id', (req, res) => {
    const id = req.params.id;

    // First, delete associated products
    db.query('DELETE FROM products WHERE registration_id=?', [id], (err, result) => {
        if (err) {
            console.error('Error deleting associated products:', err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        // Once associated products are deleted, delete the registration
        db.query('DELETE FROM registrations WHERE id=?', [id], (err, result) => {
            if (err) {
                console.error('Error deleting registration:', err);
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }
            console.log('Registration and associated products deleted successfully');
            res.status(200).json({ success: true, message: 'Registration and associated products deleted successfully' });
        });
    });
});


module.exports = router;
