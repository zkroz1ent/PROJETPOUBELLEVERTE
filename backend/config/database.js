const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('poubelle_verte', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

const { Cycliste, Trajet } = require('./associations');

// Synchronisation des associations
sequelize.sync({ force: false })
  .then(() => {
    console.log('Base de données synchronisée');
  })
  .catch((error) => {
    console.error('Erreur lors de la synchronisation de la base de données:', error);
  });

module.exports = sequelize;