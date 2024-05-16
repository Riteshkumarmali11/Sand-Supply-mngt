const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../dbconfig');

const router = express.Router();

// Authentication route
router.post('/', (req, res) => {
  const { mobile, password } = req.body;

  // Fetch user from the database based on username and profile type
  db.query('SELECT mobile, username, password FROM custprojectregistration WHERE mobile = ? AND password = ?', [mobile, password], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ success: false, message: 'Internal server error' });
      return;
    }

    if (results.length === 0) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const user = results[0];

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, username: user.username }, 'your_secret_key', { expiresIn: '1h' });
    const {username, mobile} = user;
    res.json({ success: true, token, username, mobile });
  });
});

module.exports = router;
