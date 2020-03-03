const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "172.31.23.253",
  user: "root",
  password: "1235012350",
  database: "db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

  pool.getConnection(err => {
    if (err) throw err;
    console.log("My database is connected!");
    pool.query('db');
    // connection.release();
  });
  
  module.exports = pool;