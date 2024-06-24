const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Trajet = require('../Trajets/TrajetModel'); // Assurez-vous que le chemin est correct

const Cycliste = sequelize.define('Cycliste', {
  // autres attributs
  nom: DataTypes.STRING,
  prenom: DataTypes.STRING,
  email: DataTypes.STRING,
  numero_telephone: DataTypes.STRING,
  hash_mot_de_passe: DataTypes.STRING,
  statut: DataTypes.ENUM('actif', 'inactif', 'en pause', 'en congé'),
  date_embauche: DataTypes.DATE
}, {
  tableName: 'cyclistes',
  timestamps: false
});

// Relation entre Cycliste et Trajet
Cycliste.hasMany(Trajet, { foreignKey: 'cyclisteId' });
Trajet.belongsTo(Cycliste, { foreignKey: 'cyclisteId' });

module.exports = Cycliste;