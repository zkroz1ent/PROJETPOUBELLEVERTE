const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Rue = sequelize.define('Rue', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'rues',
  timestamps: false
});

module.exports = Rue;