const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('poubelle_verte', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});
const Cycliste = require('../Cyclistes/CyclisteModel');

const Trajet = sequelize.define('Trajet', {
  heure_debut: {
    type: DataTypes.DATE,
    allowNull: true
  },
  heure_fin_prevue: {
    type: DataTypes.DATE,
    allowNull: true
  },
  heure_fin_reelle: {
    type: DataTypes.DATE,
    allowNull: true
  },
  statut: {
    type: DataTypes.ENUM,
    values: ['planifié', 'en_cours', 'terminé', 'annulé'],
    allowNull: false
  }
}, {
  tableName: 'trajets',
  timestamps: false
});

// Association entre Trajet et Cycliste
Trajet.belongsTo(Cycliste, { foreignKey: 'cyclisteId' });

module.exports = Trajet;