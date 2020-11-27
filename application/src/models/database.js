const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  database: "db",
  user: "ubuntu",
  port: 3306,
  password: "n3WPass!",
  host: "localhost",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection(err => {
  if (err) throw err;
  console.log("My database is connected!");
  pool.query("db");
  // connection.release();
});

module.exports = pool;
