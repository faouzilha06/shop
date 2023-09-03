const Sequelize = require("sequelize"); //import de sequelize/interagir/BD MySQL

const sequelize = new Sequelize("shop", "root", "root", {
  //instance/param/connect/nom BD/nom util/mp
  dialect: "mysql", //type BD
  host: "localhost", //adresse hébergélocal/ou se trouve la BD
});

module.exports = sequelize;
