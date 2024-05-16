// routes/SampleProduct.js
const express = require('express');
const db = require('../dbconfig');
const router = express.Router();

// SampleProduct.js
// SampleProduct.js
router.post('/:userId/add', (req, res) => {
    const userId = req.params.userId;
    const { name, price } = req.body;
  
    // Check if userId is provided and is a valid number
    if (!userId || isNaN(userId)) {
      return res.status(400).send('Invalid userId');
    }
  
    // Check if name and price are provided
    if (!name || !price) {
      return res.status(400).send('Name and price are required');
    }
  
    // Check if userId exists in the users table
    const userCheckQuery = 'SELECT id FROM users WHERE id = ?';
    db.query(userCheckQuery, userId, (userCheckErr, userCheckResults) => {
      if (userCheckErr) {
        console.error('Error checking user:', userCheckErr);
        return res.status(500).send('Error checking user');
      }
      
      if (userCheckResults.length === 0) {
        console.error('User does not exist');
        return res.status(404).send('User does not exist');
      }
  
      // userId exists, proceed with product insertion
      const insertQuery = 'INSERT INTO products (name, price, userId) VALUES (?, ?, ?)';
      db.query(insertQuery, [name, price, userId], (insertErr, insertResults) => {
        if (insertErr) {
          console.error('Error adding product:', insertErr);
          return res.status(500).send('Error adding product');
        }
        
        res.send('Product added successfully');
      });
    });
  });
  
  
module.exports = router;
