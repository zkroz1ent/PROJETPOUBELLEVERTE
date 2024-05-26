const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');


const Rue = sequelize.define('Rue', {
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'rues',
  timestamps: false
});

module.exports = Rue;