// routes/registration.js
const express = require('express');
const db = require('../dbconfig');
const otpGenerator = require('otp-generator');
const bodyParser = require('body-parser');
const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/', (req, res) => {
    const { username } = req.body;
  
    db.query('SELECT * FROM users WHERE username = ?', username, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error generating OTP");
      } else {
        if (result.length > 0) {
          const user = result[0];
          const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
          const otpExpiresAt = new Date(Date.now() + 600000); // OTP expires in 10 minutes
  
          // Update user record with new OTP and expiry time
          db.query('UPDATE users SET otp = ?, otp_expires_at = ? WHERE id = ?', [otp, otpExpiresAt, user.id], (updateErr, updateResult) => {
            if (updateErr) {
              console.log(updateErr);
              res.status(500).send("Error generating OTP");
            } else {
              // Code to send OTP to user's mobile number
              console.log("OTP:", otp);
              res.status(200).send("OTP generated and sent to registered mobile number");
            }
          });
        } else {
          res.status(400).send("User not registered");
        }
      }
    });
  });
  
  
module.exports = router;
