const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Settings = sequelize.define('Settings', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  modeActuelle: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false // Par exemple, false pour 'été' et true pour 'hiver'
  }
}, {
  tableName: 'settings',
  timestamps: false
});

module.exports = Settings;