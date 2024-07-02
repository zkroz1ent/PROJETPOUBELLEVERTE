const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Velo = sequelize.define('Velo', {
  statut: {
    type: DataTypes.ENUM,
    values: ['disponible', 'en_course', 'maintenance', 'indisponible'],
    allowNull: false
  },
  derniere_position_lat: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  derniere_position_lon: {
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