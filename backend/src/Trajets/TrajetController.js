const trajetService = require('./TrajetService');
const { Cycliste, Arret, Velo } = require('../../config/associations');
const { calculateOptimalRoute } = require('../Itinéraires/ItineraireService');

const PORTE_DE_IVRY_LAT = 48.82123; // Latitude de la déchèterie
const PORTE_DE_IVRY_LON = 2.36775; // Longitude de la déchèterie
const DISTANCE_ENTRE_ARRETS = 0.5; // 500 mètres
const AUTONOMIE_INITIALE = 50; // en km
const AUTONOMIE_HIVER = 0.90; // Réduction de 10% en hiver
const CAPACITY_VELO = 200; // en kg
const DECHETS_PAR_ARRET = 50; // en kg
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLon / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance en km
}
exports.getCyclistes = async (req, res) => {
  try {
    const cyclistes = await Cycliste.findAll({
      attributes: ['id', 'nom', 'prenom'],
      order: [['id', 'ASC']]
    });
    res.json(cyclistes);
  } catch (error) {
    console.error('Erreur lors de la récupération des cyclistes:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des cyclistes' });
  }
};

exports.getArrets = async (req, res) => {
  try {
    const arrets = await Arret.findAll({
      attributes: ['id', 'nom', 'rueId', 'coordinates'],
      order: [['id', 'ASC']]
    });
    res.json(arrets);
  } catch (error) {
    console.error('Erreur lors de la récupération des arrêts:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des arrêts' });
  }
};

exports.getAllTrajets = async (req, res) => {
  try {
    const trajets = await trajetService.getAllTrajets();
    res.json(trajets);
  } catch (error) {
    console.error('Erreur lors de la récupération des trajets:', error);
    res.status(500).send(error.message);
  }
};

exports.createTrajet = async (req, res) => {
  try {
    const { cyclisteId, heure_debut, depart, arrivee, statut } = req.body;

    const departArret = await Arret.findByPk(depart);
    const arriveeArret = await Arret.findByPk(arrivee);

    if (!departArret || !arriveeArret) {
      return res.status(400).json({ message: 'Arrêt de départ ou d\'arrivée non trouvé.' });
    }

    const trajet = await trajetService.createTrajet({
      cyclisteId, heure_debut, depart, arrivee, statut
    });
    res.status(201).json(trajet);
  } catch (error) {
    console.error('Erreur lors de la création des trajets:', error);
    res.status(500).send(error.message);
  }
};

exports.getTrajetsByUserId = async (req, res) => {
  try {
    const userId = req.userId;
    const trajets = await trajetService.getTrajetsByUserId(userId);
    res.json(trajets);
  } catch (error) {
    console.error('Erreur lors de la récupération des trajets pour l\'utilisateur:', error);
    res.status(500).send(error.message);
  }
};

exports.verifyTrajet = async (req, res) => {
  try {
    const { departId, arriveeId, veloId, cyclisteId, isWinter = false } = req.body;

    const departArret = await Arret.findByPk(departId, { attributes: ['id', 'coordinates'] });
    const arriveeArret = await Arret.findByPk(arriveeId, { attributes: ['id', 'coordinates'] });
    const velo = await Velo.findByPk(veloId, { attributes: ['id', 'autonomie_restante'] });
    const cycliste = await Cycliste.findByPk(cyclisteId, { attributes: ['id', 'nom', 'prenom'] });

    if (!departArret || !arriveeArret || !velo || !cycliste) {
      return res.status(400).json({ message: 'Invalid depart, arrivee, velo, or cycliste information' });
    }

    const departCoordinates = JSON.parse(departArret.coordinates);
    const arriveeCoordinates = JSON.parse(arriveeArret.coordinates);

    console.log(`Départ: ${departCoordinates.lat}, ${departCoordinates.lon}`);
    console.log(`Arrivée: ${arriveeCoordinates.lat}, ${arriveeCoordinates.lon}`);
    console.log(`Autonomie vélo: ${velo.autonomie_restante} km`);

    let remainingAutonomy = velo.autonomie_restante !== null ? velo.autonomie_restante : AUTONOMIE_INITIALE;
    let remainingCapacity = CAPACITY_VELO;
    if (isWinter) {
      remainingAutonomy = remainingAutonomy * AUTONOMIE_HIVER;
      console.log(`Autonomie ajustée pour l'hiver: ${remainingAutonomy} km`);
    }

    const trajetsComplets = [];

    let currentLat = departCoordinates.lat;
    let currentLon = departCoordinates.lon;
    const numberOfStops = Math.ceil(haversine(departCoordinates.lat, departCoordinates.lon, arriveeCoordinates.lat, arriveeCoordinates.lon) / DISTANCE_ENTRE_ARRETS);

    const arretDetails = await Arret.findAll();
    const mapArrets = {};
    arretDetails.forEach(arret => {
      const coord = JSON.parse(arret.coordinates);
      mapArrets[arret.id] = { ...coord, id: arret.id, name: arret.nom };
    });

    for (let i = 0; i < numberOfStops; i++) {
      remainingAutonomy -= DISTANCE_ENTRE_ARRETS;
      remainingCapacity -= DECHETS_PAR_ARRET;

      trajetsComplets.push({
        lat: currentLat,
        lon: currentLon,
        remainingAutonomy,
        remainingCapacity
      });

      if (remainingAutonomy < DISTANCE_ENTRE_ARRETS || remainingCapacity <= 0) {
        const { pathToRecyclage, distanceToRecyclage, pathFromRecyclage, distanceFromRecyclage } = await calculateOptimalRoute(
          { lat: currentLat, lon: currentLon },
          { lat: PORTE_DE_IVRY_LAT, lon: PORTE_DE_IVRY_LON }
        );

        // Ajouter chaque arrêt intermédiaire pour aller à la déchèterie
        if (pathToRecyclage) {
          pathToRecyclage.forEach((arretId, index) => {
            const arret = mapArrets[arretId];
            if (arret) {
              trajetsComplets.push({
                action: `aller à la déchèterie, étape ${index + 1}`,
                lat: arret.lat,
                lon: arret.lon,
                remainingAutonomy: remainingAutonomy - (index + 1) * DISTANCE_ENTRE_ARRETS,
                remainingCapacity // Capacité actuelle, pas de collecte de déchets dans ce segment
              });
            }
          });
        }

        // À la déchèterie
        trajetsComplets.push({
          action: 'à la déchèterie',
          lat: PORTE_DE_IVRY_LAT,
          lon: PORTE_DE_IVRY_LON,
          remainingAutonomy: remainingAutonomy - distanceToRecyclage,
          remainingCapacity: CAPACITY_VELO // Capacité réinitialisée
        });

        // Revenir de la déchèterie
        if (pathFromRecyclage) {
          pathFromRecyclage.forEach((arretId, index) => {
            const arret = mapArrets[arretId];
            if (arret) {
              trajetsComplets.push({
                action: `revenir de la déchèterie, étape ${index + 1}`,
                lat: arret.lat,
                lon: arret.lon,
                remainingAutonomy: remainingAutonomy - distanceToRecyclage - (index + 1) * DISTANCE_ENTRE_ARRETS,
                remainingCapacity: CAPACITY_VELO
              });
            }
          });
        }

        remainingAutonomy = AUTONOMIE_INITIALE;
        remainingCapacity = CAPACITY_VELO;
        currentLat = PORTE_DE_IVRY_LAT;
        currentLon = PORTE_DE_IVRY_LON;

        console.log(`Retour à la déchèterie pour recharger et décharger. Nouvelle autonomie: ${remainingAutonomy} km, Nouvelle capacité: ${remainingCapacity} kg`);
      } else {
        const deltaLat = (arriveeCoordinates.lat - currentLat) / numberOfStops;
        const deltaLon = (arriveeCoordinates.lon - currentLon) / numberOfStops;
        currentLat += deltaLat;
        currentLon += deltaLon;
      }
    }

    trajetsComplets.push({
      lat: arriveeCoordinates.lat,
      lon: arriveeCoordinates.lon,
      remainingAutonomy,
      remainingCapacity
    });

    res.status(200).json({
      message: 'Le trajet est réalisable avec l\'autonomie et la capacité actuelles du vélo.',
      trajetsComplets,
      velo,
      cycliste
    });
  } catch (error) {
    console.error('Erreur lors de la vérification du trajet :', error);
    res.status(500).json({ message: 'Erreur lors de la vérification du trajet', error });
  }
};

exports.getTrajetById = async (req, res) => {
  try {
    const trajet = await trajetService.getTrajetById(req.params.id);
    if (trajet) {
      res.json(trajet);
    } else {
      res.status(404).send('Trajet non trouvé.');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du trajet:', error);
    res.status(500).send(error.message);
  }
};

exports.updateTrajet = async (req, res) => {
  try {
    const { cyclisteId, heure_debut, depart, arrivee } = req.body;

    if (!cyclisteId || !heure_debut || !depart || !arrivee) {
      res.status(400).json({ error: 'Tous les champs sont requis.' });
      return;
    }

    const updatedTrajet = await trajetService.updateTrajet(req.params.id, req.body);
    res.json(updatedTrajet);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du trajet:', error);
    res.status(400).send(error.message);
  }
};

exports.deleteTrajet = async (req, res) => {
  try {
    await trajetService.deleteTrajet(req.params.id);
    res.status(200).send('Trajet supprimé avec succès.');
  } catch (error) {
    console.error('Erreur lors de la suppression du trajet:', error);
    res.status(500).send(error.message);
  }
};

exports.getTrajetsParCycliste = async (req, res) => {
  try {
    const { cyclisteId } = req.params;
    const optimalPath = await trajetService.getTrajetsParCycliste(cyclisteId);
    res.status(200).json(optimalPath);
  } catch (error) {
    console.error('Erreur lors de la récupération des trajets:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des trajets' });
  }
};