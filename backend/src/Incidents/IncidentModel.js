const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Velo = require('../Velos/VeloModel');

const Incident = sequelize.define('Incident', {
  type: {
    type: DataTypes.ENUM('panne', 'accident', 'autre'),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  etat: {
    type: DataTypes.ENUM('en cours', 'résolu'),
    allowNull: false,
    defaultValue: 'en cours'
  }
});

Velo.hasMany(Incident, { foreignKey: 'veloId' });
Incident.belongsTo(Velo, { foreignKey: 'veloId' });

module.exports = Incident;