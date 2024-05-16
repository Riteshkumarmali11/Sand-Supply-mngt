// routes/getSampleProduct.js
const express = require('express');
const db = require('../dbconfig');
const router = express.Router();

router.get('/:userId', (req, res) => {
  const userId = req.params.userId;
  const sql = `SELECT * FROM products WHERE userId = ?`;
  db.query(sql, userId, (err, result) => {
    if (err) {
      console.error('Error fetching products:', err);
      res.status(500).send('Error fetching products');
    } else {
      res.send(result);
    }
  });
});

module.exports = router;
