const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Itineraire = sequelize.define('Itineraire', {
  ordre_passage: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  heure_passage_prevue: {
    type: DataTypes.DATE,
    allowNull: true
  },
  heure_passage_reelle: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Clés étrangères (associations) à définir dans associations.js
}, {
  tableName: 'itinéraires',
  timestamps: false
});

module.exports = Itineraire;