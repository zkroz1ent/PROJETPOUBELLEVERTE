const Cycliste = require('../src/Cyclistes/CyclisteModel');
const Trajet = require('../src/Trajets/TrajetModel');
const Arret = require('../src/Arrêts/ArretModel');
const Rue = require('../src/Rues/RueModel');

// Définir l'association entre Cycliste et Trajet
Cycliste.hasMany(Trajet, { foreignKey: 'cyclisteId' });
Trajet.belongsTo(Cycliste, { foreignKey: 'cyclisteId' });

// Associations pour Arret (départ et arrivée)
Arret.hasMany(Trajet, { foreignKey: 'depart' });
Arret.hasMany(Trajet, { foreignKey: 'arrivee' });
Trajet.belongsTo(Arret, { as: 'Depart', foreignKey: 'depart' });
Trajet.belongsTo(Arret, { as: 'Arrivee', foreignKey: 'arrivee' });

module.exports = { Cycliste, Trajet, Arret, Rue };
