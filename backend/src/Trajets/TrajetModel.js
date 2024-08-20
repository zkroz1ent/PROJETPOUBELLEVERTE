const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Cycliste = require('../Cyclistes/CyclisteModel');
const Arret = require('../Arrêts/ArretModel');
const Velo = require('../Velos/VeloModel');

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
  heure_fin_prevue: {
    type: DataTypes.DATE,
    allowNull: true
  },
  heure_fin_reelle: {
    type: DataTypes.DATE,
    allowNull: true
  },
  depart: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Arret,
      key: 'id'
    }
  },
  arrivee: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Arret,
      key: 'id'
    }
  },
  statut: {
    type: DataTypes.ENUM('planifié', 'en_cours', 'terminé', 'annulé'),
    allowNull: false
  },
  cyclisteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Cycliste,
      key: 'id'
    }
  },
  veloId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Velo,
      key: 'id'
    }
  }
}, {
  tableName: 'trajets',
  timestamps: false
});

module.exports = Trajet;