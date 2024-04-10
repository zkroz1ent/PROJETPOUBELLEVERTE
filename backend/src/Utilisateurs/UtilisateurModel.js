const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Utilisateur = sequelize.define('Utilisateur', {
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  hash_mot_de_passe: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('gestionnaire', 'cycliste', 'RH', 'administrateur'),
    allowNull: false
  },
}, {
  tableName: 'utilisateurs',
  timestamps: false
});

module.exports = Utilisateur;