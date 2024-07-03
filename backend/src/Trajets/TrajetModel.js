const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Cycliste = require('../Cyclistes/CyclisteModel');
const Arret = require('../Arrêts/ArretModel');

const Trajet = sequelize.define('Trajet', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  heure_debut: {
    type: DataTypes.DATE,
    allowNull: true
  },
  depart: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Arret,
      key: 'rueid'
    }
  },
  arrivee: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Arret,
      key: 'rueid'
    }
  },
  statut: {
    type: DataTypes.ENUM,
    values: ['planifié', 'en_cours', 'terminé', 'annulé'],
    allowNull: false
  },
  cyclisteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Cycliste,
      key: 'id'
    }
  }
}, {
  tableName: 'trajets',
  timestamps: false
});

module.exports = Trajet;
