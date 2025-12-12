const { Sequelize } = require('sequelize');
require('dotenv').config(); // This line loads the .env file variables

// Create a new Sequelize instance, using the variables from our .env file
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql'
  }
);

module.exports = sequelize;
