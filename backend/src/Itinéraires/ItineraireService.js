const Itineraire = require('.ItineraireModel');
const Trajet = require('../Trajets/TrajetModel');
const arrets = require('./arrets.json'); // Importez les arrêts avec leurs coordonnées.

const getAllItineraires = async () => {
  return await Itineraire.findAll({
    include: [/* Modèles liés, par exemple `Trajet` ou `Utilisateur` */]
  });
};

const optimiserItineraire = async (itineraireId) => {
  const itineraire = await Itineraire.findByPk(itineraireId);
  if (!itineraire) {
    throw new Error('Itinéraire non trouvé');
  }
  // Logique de l'optimisation, par exemple recalculer les trajets
  const optimizedPoints = optimizeRoute(itineraire.points); 
  itineraire.points = optimizedPoints;
  itineraire.statut = 'optimisé';
  await itineraire.save();
  return itineraire;
};

const assignerItineraire = async (cyclisteId, itineraireId) => {
  const itineraire = await Itineraire.findByPk(itineraireId);
  if (!itineraire) {
    throw new Error('Itinéraire non trouvé');
  }
  itineraire.utilisateurId = cyclisteId;
  await itineraire.save();
  return itineraire;
};

const optimizeRoute = (points) => {
  // Implémentez la logique d'optimisation ici,
  // par exemple, utilisez un algorithme de chemin le plus court
  return points; // retournez les points optimisés
};
module.exports = { optimiserItineraire, assignerItineraire };