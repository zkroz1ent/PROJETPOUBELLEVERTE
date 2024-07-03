const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Cycliste = sequelize.define('Cycliste', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  prenom: {
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
  statut: {
    type: DataTypes.ENUM,
    values: ['actif', 'inactif', 'en pause', 'en congé'],
    allowNull: false
  }
}, {
  tableName: 'cyclistes',
  timestamps: false
});

module.exports = Cycliste;
