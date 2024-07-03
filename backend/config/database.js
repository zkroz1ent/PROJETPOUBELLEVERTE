const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('poubelle_verte', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

const { Cycliste, Trajet } = require('./associations');

Cycliste.sync({ force: true })
  .then(() => {
    console.log('Table Cycliste créée');
  })
  .catch((error) => {
    console.error('Erreur lors de la création de la table Cycliste:', error);
  });

Trajet.sync({ force: true })
  .then(() => {
    console.log('Table Trajet créée');
  })
  .catch((error) => {
    console.error('Erreur lors de la création de la table Trajet:', error);
  });

sequelize.sync({ force: false })
  .then(() => {
    console.log('Base de données synchronisée');
  })
  .catch((error) => {
    console.error('Erreur lors de la synchronisation de la base de données:', error);
  });

module.exports = sequelize;
