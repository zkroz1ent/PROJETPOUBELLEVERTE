const { DataTypes } = require('sequelize');
const sequelize = require('./database');
const Cycliste = require('./Cycliste');
const Velo = require('./Velo');

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

Trajet.belongsTo(Cycliste, { foreignKey: { allowNull: false } });
Trajet.belongsTo(Velo, { foreignKey: { allowNull: false } });

module.exports = Trajet;