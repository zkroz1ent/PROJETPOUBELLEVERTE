// Import des modèles
const Cycliste = require('../src/Cyclistes/CyclisteModel');
const Trajet = require('../src/Trajets/TrajetModel');
const Arret = require('../src/Arrêts/ArretModel');
const Utilisateur = require('../src/Utilisateurs/UtilisateurModel');
const Velo = require('../src/Velos/VeloModel');
const Incident = require('../src/Incidents/IncidentModel');
const Rue = require('../src/Rues/RueModel');

// Définir l'association entre Cycliste et Trajet
Cycliste.hasMany(Trajet, { foreignKey: 'cyclisteId' });
Trajet.belongsTo(Cycliste, { foreignKey: 'cyclisteId', as: 'Cycliste' });

// Associations pour Arret (départ et arrivée)
Arret.hasMany(Trajet, { foreignKey: 'depart', as: 'DepartTrajets' });
Arret.hasMany(Trajet, { foreignKey: 'arrivee', as: 'ArriveeTrajets' });
Trajet.belongsTo(Arret, { as: 'DepartArret', foreignKey: 'depart' });
Trajet.belongsTo(Arret, { as: 'ArriveeArret', foreignKey: 'arrivee' });

// Associations pour Rue et Arret
Rue.hasMany(Arret, { foreignKey: 'rueId', as: 'RueArrets' });
Arret.belongsTo(Rue, { foreignKey: 'rueId', as: 'RueAssoc' });

// Association entre Utilisateur et Cycliste
Utilisateur.hasMany(Cycliste, { foreignKey: 'id_user', onDelete: 'CASCADE' });
Cycliste.belongsTo(Utilisateur, { foreignKey: 'id_user', onDelete: 'CASCADE' });

// Association entre Velo et Trajet
Velo.hasMany(Trajet, { foreignKey: 'veloId', as: 'Trajets' });
Trajet.belongsTo(Velo, { foreignKey: 'veloId', as: 'Velo' });

// Association entre Velo et Incident
Velo.hasMany(Incident, { foreignKey: 'veloId' });
Incident.belongsTo(Velo, { foreignKey: 'veloId' });

module.exports = { Cycliste, Trajet, Arret, Rue, Utilisateur, Velo, Incident };