const mysql = require('mysql');

const dbconfig = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'ccbm'
});

// Connect to database
dbconfig.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

module.exports = dbconfig;
