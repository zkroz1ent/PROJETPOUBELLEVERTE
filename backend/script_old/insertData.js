const fs = require('fs');
const path = require('path');
const Arret = require('../src/Arrêts/ArretModel');
const Rue = require('../src/Rues/RueModel');
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
}

module.exports = insertData;