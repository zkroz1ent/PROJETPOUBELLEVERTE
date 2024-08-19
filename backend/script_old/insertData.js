const fs = require('fs');
const path = require('path');
const { Cycliste, Arret, Rue } = require('../config/associations');
const dataDir = path.join(__dirname, '../scripts/'); // Assurez-vous d'avoir le répertoire data avec les fichiers JSON

async function insertData() {
  try {
    const files = fs.readdirSync(dataDir);

    for (const file of files) {
      // Lire et parser le fichier JSON
      const filePath = path.join(dataDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      // Créer la rue
      const rue = await Rue.create({ name: data.rue });
      console.log(`Rue '${data.rue}' créée avec succès.`);

      // Créer les arrêts associés
      for (const arretData of data.stops) {
        await Arret.create({
          nom: arretData.name,
          coordinates: arretData.coordinates,
          position: arretData.position,
          rueId: rue.id
        });
      }

      console.log(`Arrêts insérés avec succès pour la rue '${data.rue}'.`);
    }
  } catch (error) {
    console.error('Erreur lors de l\'insertion des données :', error);
  }

  // try {
  //   await Cycliste.bulkCreate([
  //     {
  //       id: 1,
  //       nom: 'dutertre',
  //       prenom: 'damien',
  //       email: 'damien@test.com',
  //       hash_mot_de_passe: 'zbi',
  //       statut: 'inactif'
  //     },
  //     {
  //       id: 2,
  //       nom: 'dutertre',
  //       prenom: 'mario',
  //       email: 'mario@test.com',
  //       hash_mot_de_passe: 'zbi2',
  //       statut: 'inactif'
  //     }
  //   ]);
  //   console.log('Cyclistes insérés avec succès.');
  // } catch (error) {
  //   console.error('Erreur lors de l\'insertion des cyclistes:', error);
  // }
}

module.exports = insertData;
