const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Arret = sequelize.define('Arret', {
  nom: {
    type: DataTypes.STRING,
    allowNull: true
  },
  position_latitude: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  position_longitude: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('simple', 'croisement'),
    allowNull: false
  },
  // Clé étrangère (association) à définir dans associations.js
}, {
  tableName: 'arrêts',
  timestamps: false
});

module.exports = Arret;