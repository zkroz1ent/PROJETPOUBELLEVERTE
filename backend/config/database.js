const Sequelize = require('sequelize');

const sequelize = new Sequelize('poubelle_verte', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

module.exports = sequelize;