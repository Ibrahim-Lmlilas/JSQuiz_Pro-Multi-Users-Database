const mysql = require("mysql");
const { Sequelize } = require("sequelize");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "quiz",
});

connection.connect();

const sequelize = new Sequelize("quiz", "root", "", {
  host: "localhost",
  dialect: "mysql",
  port: 3306
});

module.exports = { connection, sequelize };
