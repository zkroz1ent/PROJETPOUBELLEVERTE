const fs = require('fs');
const path = require('path');
const { Cycliste, Arret, Rue, Utilisateur } = require('../config/associations');
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

  try {
    await Utilisateur.bulkCreate([
      {
        id: 1,
        nom: 'dutertre',
        prenom: 'damien',
        email: 'admin1@admin.com',
        hash_mot_de_passe: '$2a$08$ShmGl9yuRuTDVsxPsgw1n.mDy9yjNt.ch5wOph.CzxB8dFmSzkpwG',
        role: 'administrateur',
        statut: 'actif'
      },
      {
        id: 2,
        nom: 'dutertre',
        prenom: 'damien',
        email: 'cycliste1@admin.com',
        hash_mot_de_passe: '$2a$08$ShmGl9yuRuTDVsxPsgw1n.mDy9yjNt.ch5wOph.CzxB8dFmSzkpwG',
        role: 'cycliste',
        statut: 'actif'
      },
      {
        id: 3,
        nom: 'dutertre',
        prenom: 'damien',
        email: 'rh@admin.com',
        hash_mot_de_passe: '$2a$08$ShmGl9yuRuTDVsxPsgw1n.mDy9yjNt.ch5wOph.CzxB8dFmSzkpwG',
        role: 'RH',
        statut: 'actif'
      }, 
      {
        id: 4,
        nom: 'dutertre',
        prenom: 'damien',
        email: 'gestionnaire1@admin.com',
        hash_mot_de_passe: '$2a$08$ShmGl9yuRuTDVsxPsgw1n.mDy9yjNt.ch5wOph.CzxB8dFmSzkpwG',
        role: 'gestionnaire',
        statut: 'actif'
      },
    ]);
    console.log('utilisateur insérés avec succès.');
  } catch (error) {
    console.error('Erreur lors de l\'insertion des utilisateur:', error);
  }
  try {
    await Cycliste.bulkCreate([
      {
        id: 2,
        nom: 'dutertre',
        prenom: 'damien',
        email: 'cycliste1@admin.com',
        hash_mot_de_passe: '$2a$08$ShmGl9yuRuTDVsxPsgw1n.mDy9yjNt.ch5wOph.CzxB8dFmSzkpwG',
        id_user: '2',
        statut: 'actif'
      },

    ]);
    console.log('utilisateur insérés avec succès.');
  } catch (error) {
    console.error('Erreur lors de l\'insertion des utilisateur:', error);
  }


}

module.exports = insertData;
