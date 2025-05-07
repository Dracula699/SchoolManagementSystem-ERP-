var mysql = require('mysql'); // Import MySQL module

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',  // MySQL host (usually 'localhost')
  user: 'root',  // Your MySQL username
  password: 'root',  // Your MySQL password
  database: 'logincred',  // The name of the database you created
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connection Established to MySQL...');
    connection.release();
  }
});

module.exports = pool;
