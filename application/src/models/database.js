const mysql = require("mysql2/promise");

if(process.env.NODE_ENV == "development") {
  var pool = mysql.createPool({
    database: "captionrater",
    user: "root",
    host: "localhost",
    password: "root",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
} else {
  var pool = mysql.createPool({
    database: "captionrater",
    user: "root",
    host: "localhost",
    password: "8@Af6o96FFIk",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}



module.exports = pool;
