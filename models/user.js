// import constructor fonction
const Sequelize = require("sequelize");
// import module to connect db
const sequelize = require("../util/database");
// Create models product with connection pool of sequelize
// first arg= name of table, second: structure of models, JS object (attributs of models)
const User = sequelize.define("user", {
  // attributs are define with object too
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  // Only if user sent a req to reset password
  resetToken: {
    type: Sequelize.STRING,
  },
  resetTokenExpiration: {
    type: Sequelize.DATE,
  },
});
module.exports = User;
