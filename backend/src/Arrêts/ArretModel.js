const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Rue = require('../Rues/RueModel'); 

const Arret = sequelize.define('Arret', {
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  coordinates: {
    type: DataTypes.JSON,
    allowNull: false
  },
  rueId: {
    type: DataTypes.INTEGER,
    references: {
      model: Rue,
      key: 'id'
    }
  },
  desservable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'arrets',
  timestamps: false
});

Rue.hasMany(Arret, { foreignKey: 'rueId', as: 'arrets' });
Arret.belongsTo(Rue, { foreignKey: 'rueId', as: 'rue' });

module.exports = Arret;