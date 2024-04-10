const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rue = sequelize.define('Rue', {
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  longueur: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  arrêts_obligatoires: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  impasse: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  carrefours: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  feux_tricolores: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'rues',
  timestamps: false
});

module.exports = Rue;