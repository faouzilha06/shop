// Import objet Sequelize from package
const Sequelize = require("sequelize");
// Import sequelize connection db
const sequelize = require("../util/database");
// Create models order with connection pool of sequelize (order between table user/product)
// first arg= name of table, second: structure of models, JS object (attributs of models)
const Order = sequelize.define("order", {
  // attributs are define with object too
  // only id because cart belongs one user, but can have a lot of products => new models cart-item
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});
module.exports = Order;
