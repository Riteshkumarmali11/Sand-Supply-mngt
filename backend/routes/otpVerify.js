// routes/registration.js
const express = require('express');
const db = require('../dbconfig');
const otpGenerator = require('otp-generator');
const bodyParser = require('body-parser');
const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/', (req, res) => {
    const { username, otp } = req.body;
  
    db.query('SELECT * FROM users WHERE username = ? AND otp = ? AND otp_expires_at > NOW()', [username, otp], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error verifying OTP");
      } else {
        if (result.length > 0) {
          res.status(200).send("OTP verified successfully");
        } else {
          res.status(400).send("Invalid OTP or OTP expired");
        }
      }
    });
  });
  
  
module.exports = router;
