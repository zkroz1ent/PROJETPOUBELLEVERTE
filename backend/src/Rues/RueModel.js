const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Rue = sequelize.define('Rue', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'rues',
  timestamps: false
});

module.exports = Rue;
