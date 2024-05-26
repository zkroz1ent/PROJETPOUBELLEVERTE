const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Trajet = require('./TrajetModel');

const Itineraire = sequelize.define('Itineraire', {
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  statut: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'planifié'
  }
}, {
  tableName: 'itineraires',
  timestamps: true
});

Trajet.hasMany(Itineraire, { foreignKey: 'trajetId' });
Itineraire.belongsTo(Trajet, { foreignKey: 'trajetId' });

module.exports = Itineraire;