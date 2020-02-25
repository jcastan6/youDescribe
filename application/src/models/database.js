const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    database: "db",
    user: "admin",
    password: "1235012350",
    host: "database.cuy2nc7vo3ve.us-west-1.rds.amazonaws.com",
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