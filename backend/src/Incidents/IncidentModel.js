const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Incident = sequelize.define('Incident', {
  type: {
    type: DataTypes.ENUM('accident', 'blocage', 'retard', 'panne', 'autre'),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  heure_signalement: {
    type: DataTypes.DATE,
    allowNull: false
  },
  // Clé étrangère (association) à définir dans associations.js
}, {
  tableName: 'incidents',
  timestamps: false
});

module.exports = Incident;