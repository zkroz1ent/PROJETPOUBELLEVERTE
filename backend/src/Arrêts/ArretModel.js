const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Rue = require('../Rues/RueModel');  // Assurez-vous que le chemin est correct

const Arret = sequelize.define('Arret', {
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  coordinates: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rueId: {
    type: DataTypes.INTEGER,
    references: {
      model: Rue,
      key: 'id'
    }
  }
}, {
  tableName: 'arrets',
  timestamps: false
});

Rue.hasMany(Arret, { foreignKey: 'rueId' });
Arret.belongsTo(Rue, { foreignKey: 'rueId' });

module.exports = Arret;