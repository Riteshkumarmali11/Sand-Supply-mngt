// routes/registration.js
const express = require('express');
const db = require('../dbconfig');

const router = express.Router();

// Update builderAvailable.js route to handle products array
router.post('/', (req, res) => {
    const formData = req.body;

    const dataToInsert = {
        invoiceno: formData.invoiceno,
        date:formData.date,
        buildername: formData.buildername,
        sitename: formData.sitename,
        siteaddress: formData.siteaddress,
        mobile: formData.mobile,
        gstno: formData.gstno,
        vehiclenumber: formData.vehiclenumber,
        drivername: formData.drivername,
        latitude:formData.latitude,
        longitude:formData.longitude,
        openingbal:formData.openingbal,

    };

    db.query('INSERT INTO sales SET ?', dataToInsert, (err, result) => {
        if (err) {
            console.error('Error registering data:', err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        // Insert products associated with the registration
        let products = [];
        if (formData.products) {
            try {
                console.log("Pro", formData.products);
                products = JSON.parse(formData.products);
            } catch (error) {
                console.error('Error parsing products JSON:', error);
               
            }
        }
        products.forEach(product => {
            db.query('INSERT INTO sales_products (sale_id, product_name,hsncode,gst, price, quantity, tamount, gstAmount, totalAmountWithGST) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [result.insertId, product.product_name, product.hsncode, product.gst, product.price, product.quantity, product.tamount, product.gstAmount, product.totalAmountWithGST],
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
    const { invoiceno, date, buildername, sitename, siteaddress, mobile, gstno, vehiclenumber, drivername, latitude, longitude, openingbal, recievedAmount, dueAmount, paymode, fromdate, status, products } = req.body;

    const sql = 'UPDATE sales SET  invoiceno=?, date=?, buildername=?, sitename=?, siteaddress=?, mobile=?, gstno=?, vehiclenumber=?, drivername=?, latitude=?, longitude=?, openingbal=?, recievedAmount=?, dueAmount=?, paymode=?, fromdate=?, status=?  WHERE id=?';
    db.query(sql, [invoiceno, date, buildername, sitename, siteaddress, mobile, gstno, vehiclenumber, drivername, latitude, longitude, openingbal, recievedAmount, dueAmount, paymode, fromdate, status, id], (err, result) => {
        if (err) {
            console.error('Error updating registration:', err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        // Update products associated with the registration
        if (products && products.length > 0) {
            db.query('DELETE FROM sales_products WHERE sale_id = ?', [id], (err, result) => {
                if (err) {
                    console.error('Error deleting products:', err);
                    return res.status(500).json({ success: false, message: 'Internal server error' });
                }

                products.forEach(product => {
                    db.query('INSERT INTO sales_products (sale_id, product_name, hsncode, gst, price, quantity, tamount, gstAmount, totalAmountWithGST) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                        [id, product.product_name, product.price, product.hsncode, product.gst, product.quantity, product.tamount, product.gstAmount, product.totalAmountWithGST],
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

router.delete('/:id', (req, res) => {
    const id = req.params.id;

    // First, delete associated products
    db.query('DELETE FROM sales_products WHERE sale_id=?', [id], (err, result) => {
        if (err) {
            console.error('Error deleting associated products:', err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        // Once associated products are deleted, delete the registration
        db.query('DELETE FROM sales WHERE id=?', [id], (err, result) => {
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
