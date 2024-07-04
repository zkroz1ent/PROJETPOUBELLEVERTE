const Cycliste = require('../src/Cyclistes/CyclisteModel');
const Trajet = require('../src/Trajets/TrajetModel');
const Arret = require('../src/Arrêts/ArretModel');
const Rue = require('../src/Rues/RueModel');
const Utilisateur = require('../src/Utilisateurs/UtilisateurModel');

// Définir l'association entre Cycliste et Trajet
Cycliste.hasMany(Trajet, { foreignKey: 'cyclisteId' });
Trajet.belongsTo(Cycliste, { foreignKey: 'cyclisteId' });

// Associations pour Arret (départ et arrivée)
Arret.hasMany(Trajet, { foreignKey: 'depart' });
Arret.hasMany(Trajet, { foreignKey: 'arrivee' });
Trajet.belongsTo(Arret, { as: 'Depart', foreignKey: 'depart' });
Trajet.belongsTo(Arret, { as: 'Arrivee', foreignKey: 'arrivee' });
Utilisateur.hasMany(Cycliste, { foreignKey: 'id_user' });
Cycliste.belongsTo(Utilisateur, { foreignKey: 'id_user' });

module.exports = { Cycliste, Trajet, Arret, Rue, Cycliste, Utilisateur };
