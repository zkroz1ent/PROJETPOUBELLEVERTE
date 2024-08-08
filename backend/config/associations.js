const Cycliste = require('../src/Cyclistes/CyclisteModel');
const Trajet = require('../src/Trajets/TrajetModel');
const Arret = require('../src/Arrêts/ArretModel');
const Rue = require('../src/Rues/RueModel');
const Utilisateur = require('../src/Utilisateurs/UtilisateurModel');

// Définir l'association entre Cycliste et Trajet
Cycliste.hasMany(Trajet, { foreignKey: 'cyclisteId' });
Trajet.belongsTo(Cycliste, { foreignKey: 'cyclisteId' });

// Associations pour Arret (départ et arrivée) avec des alias distincts
Arret.hasMany(Trajet, { foreignKey: 'depart', as: 'departs' });
Arret.hasMany(Trajet, { foreignKey: 'arrivee', as: 'arrivees' });
Trajet.belongsTo(Arret, { as: 'DepartArret', foreignKey: 'depart' });
Trajet.belongsTo(Arret, { as: 'ArriveeArret', foreignKey: 'arrivee' });

// Association entre Utilisateur et Cycliste
Utilisateur.hasMany(Cycliste, { foreignKey: 'id_user' });
Cycliste.belongsTo(Utilisateur, { foreignKey: 'id_user' });

module.exports = { Cycliste, Trajet, Arret, Rue, Utilisateur };