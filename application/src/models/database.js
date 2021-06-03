const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  database: "captionrater",
  port: 3306,
  user: "root",
  host: "localhost",
  password: "!K5-,w'(ZvT5Uy=3",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
