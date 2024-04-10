const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const Velo = sequelize.define('Velo', {
  statut: {
    type: DataTypes.ENUM,
    values: ['disponible', 'en_course', 'maintenance', 'indisponible'],
    allowNull: false
  },
  derniere_position_latitude: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  derniere_position_longitude: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  autonomie_restante: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'velos',
  timestamps: false
});

module.exports = Velo;