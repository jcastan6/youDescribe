const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  database: "captionrater",
  user: "root",
  host: "54.177.22.144",
  password: "csc648database",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
