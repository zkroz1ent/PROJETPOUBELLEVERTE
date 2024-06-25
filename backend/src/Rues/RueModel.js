const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Rue = sequelize.define('Rue', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  start_position: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  end_position: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  distance: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  tableName: 'rues',
  timestamps: false
});

module.exports = Rue;