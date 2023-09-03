// import constructor fonction
const Sequelize = require("sequelize");
// import module to connect db
const sequelize = require("../util/database");
// Create models product with connection pool of sequelize
// first arg= name of table, second: structure of models, JS object (attributs of models)
const Product = sequelize.define("product", {
  // attributs are define with object too
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING,
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
});
module.exports = Product;
