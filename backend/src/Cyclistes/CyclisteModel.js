const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Utilisateur = require('../Utilisateurs/UtilisateurModel');

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
  telephone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  statut: {
    type: DataTypes.ENUM,
    values: ['actif', 'inactif', 'en pause', 'en congé'],
    allowNull: true
  },
  id_user: {
    type: DataTypes.INTEGER,
    references: {
      model: Utilisateur,
      key: 'id'
    }
  }
}, {
  tableName: 'cyclistes',
  timestamps: false
});

// Définir la relation entre Cycliste et Utilisateur
Cycliste.belongsTo(Utilisateur, { foreignKey: 'id_user' });

module.exports = Cycliste;
