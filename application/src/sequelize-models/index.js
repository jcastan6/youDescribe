const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const mysql = require("mysql2/promise");
const mysqldump = require("mysqldump");

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(`../config/config.json`)[env];
const db = {};

let dbConnection;

mysql
  .createConnection({
    host: config.host,
    user: config.username,
    password: config.password,
  })
  .then((connection) => {
    dbConnection = connection;
    db.check();
  });

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  var sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
      host: "54.177.22.144",
      dialect: "mysql",
    }
  );
}

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.backup = () => {
  mysqldump({
    connection: {
      host: "localhost",
      user: config.username,
      password: config.password,
      database: config.database,
    },
    dumpToFile: "./dump.sql",
  });
};

db.check = async () => {
  await dbConnection
    .query(
      "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'vending';"
    )
    .then(async (result) => {
      if (result[0].length === 0) {
        await dbConnection.query("CREATE DATABASE IF NOT EXISTS vending;");
        await sequelize.sync();
      } else {
        await sequelize.sync();
      }
    });
};
module.exports = db;
