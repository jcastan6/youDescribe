const mysql = require('mysql');
let fs = require('fs');

// const pool = mysql.createPool({
//     host: "ec2-54-215-243-196.us-west-1.compute.amazonaws.com",
//     user: "admin",
//     password: "1235012350",
//     database: "database.cuy2nc7vo3ve.us-west-1.rds.amazonaws.com",
//     ssl      : {
//         ca   : fs.readFileSync('application/src/models/AWS_key.pem') // should be enough for AWS
        
//   }
//   });
// const pool = mysql.createPool({
//     host: "142.44.170.121",
//     user: "root",
//     password: "6&rFzI70oM*",
//     database: "team11_db",
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
//   });
// const pool = mysql.createPool({
//     host: "ec2-54-215-243-196.us-west-1.compute.amazonaws.com",
//     user: "root",
//     password: "",
//     database: "mydatabase",
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
//   });
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
    //pool.query('test_raya');
    // connection.release();
  });
  
  module.exports = pool;