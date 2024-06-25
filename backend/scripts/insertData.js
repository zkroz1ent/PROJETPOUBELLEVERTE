const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');
const Arret = require('../src/Arrêts/ArretModel');
const Rue = require('../src/Rues/RueModel');
const initialData = require('./initialData.json');

sequelize.sync().then(async () => {
  console.log('Base de données synchronisée');

  // Insérer les arrêts
  for (const stop of initialData.stops) {
    console.log('Inserting stop:', stop);  // Ajoutez cette ligne pour débogage
    try {
      const createdArret = await Arret.create({
        nom: stop.name,
        rueId: stop.rue_id ? stop.rue_id : null
      });
      console.log('Created Arret:', createdArret);
    } catch (error) {
      console.error('Erreur lors de l\'insertion de l\'arrêt:', stop, error);
    }
  }

  // Insérer les rues
  for (const route of initialData.routes) {
    console.log('Inserting route:', route);  // Ajoutez cette ligne pour débogage
    try {
      const rue = await Rue.create({
        name: `Rue ${route.id}`,
        start_position: route.start_stop_id,
        end_position: route.end_stop_id,
        distance: route.distance
      });
      console.log('Created Rue:', rue);

      // Mise à jour, le champ `rueId` de `Arret` après que Rue est crée
      for (const stop of initialData.stops) {
        if (stop.position >= route.start_stop_id && stop.position <= route.end_stop_id) {
          stop.rue_id = rue.id;
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'insertion de la rue:', route, error);
    }
  }

}).then(() => {
  console.log('Données initiales insérées');
}).catch(error => {
  console.error('Erreur lors de l\'insertion des données :', error);
});