const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('poubelle_verte', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

const Cycliste = sequelize.define('Cycliste', {
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
  numero_telephone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  hash_mot_de_passe: {
    type: DataTypes.STRING,
    allowNull: false
  },
  statut: {
    type: DataTypes.ENUM,
    values: ['actif', 'inactif', 'en pause', 'en congé'],
    allowNull: false
  },
  date_embauche: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'cyclistes',
  timestamps: false
});

module.exports = Cycliste;