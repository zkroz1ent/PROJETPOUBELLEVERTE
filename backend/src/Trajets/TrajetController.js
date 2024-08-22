const trajetService = require('./TrajetService');
const { Cycliste, Arret, Velo } = require('../../config/associations');
const itineraryService = require('../Itinéraires/ItineraireService');

const PORTE_DE_IVRY_LAT = 48.82123;
const PORTE_DE_IVRY_LON = 2.36775;
const DISTANCE_ENTRE_ARRETS = 0.5; // 500 mètres
const AUTONOMIE_INITIALE = 50; // en km
const AUTONOMIE_HIVER = 0.90; // Réduction de 10% en hiver
const CAPACITY_VELO = 200; // en kg
const DECHETS_PAR_ARRET = 50; // en kg

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // Rayon de la Terre en km;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLon / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance en km
}

exports.verifyTrajet = async (req, res) => {
  try {
    const { departId, arriveeId, veloId, cyclisteId, isWinter = false } = req.body;

    const departArret = await Arret.findByPk(departId, { attributes: ['id', 'nom', 'coordinates'] });
    const arriveeArret = await Arret.findByPk(arriveeId, { attributes: ['id', 'nom', 'coordinates'] });
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
      remainingAutonomy *= AUTONOMIE_HIVER;
      console.log(`Autonomie ajustée pour l'hiver: ${remainingAutonomy} km`);
    }

    const trajetsComplets = [];
    const visitesDecheterie = [];  // Variable pour stocker les moments où il faut aller à la déchèterie

    const addPathToTrajets = async (path, labelAction) => {
      if (!path || !Array.isArray(path) || path.length === 0) {
        console.error('Path invalide fourni:', path);
        return;
      }

      for (let i = 0; i < path.length; i++) {
        const arretId = path[i];
        const arret = await Arret.findByPk(arretId);

        if (!arret) {
          console.error(`Arrêt indisponible pour l'ID: ${arretId}`);
          continue;
        }

        const coordinates = JSON.parse(arret.coordinates);
        trajetsComplets.push({
          arretId: arret.id,
          arretNom: arret.nom,
          lat: coordinates.lat,
          lon: coordinates.lon,
          remainingAutonomy: remainingAutonomy - (i + 1) * DISTANCE_ENTRE_ARRETS,
          remainingCapacity: remainingCapacity - (i + 1) * DECHETS_PAR_ARRET,
          action: labelAction
        });

        if (remainingAutonomy - (i + 1) * DISTANCE_ENTRE_ARRETS <= 0 || remainingCapacity - (i + 1) * DECHETS_PAR_ARRET <= 0) {
          console.log('Nécessité de se rendre à la déchèterie pour recharge et déchargement');

          // Ajout d'une entrée dans le tableau des visites de déchèterie
          visitesDecheterie.push({
            point: arret.id,
            action: 'Nécessité de se rendre à la déchèterie'
          });

          await addPathToDecheterie(arretId); // Appel de la nouvelle fonction
        }
      }
    };

    const addPathToDecheterie = async (arretId) => {
      const trajetrecyclage = await itineraryService.calculateOptimalRoute(arretId, 300); // '300' represents Porte d'Ivry
      const toRecyclage = trajetrecyclage;
      const fromRecyclage = [...trajetrecyclage].reverse();  // Inversez le tableau pour le retour

      if (toRecyclage && Array.isArray(toRecyclage)) {
        for (let i = 0; i < toRecyclage.length; i++) {
          const arret = await Arret.findByPk(toRecyclage[i]);
          if (arret) {
            const coordinates = JSON.parse(arret.coordinates);
            trajetsComplets.push({
              arretId: arret.id,
              arretNom: arret.nom,
              lat: coordinates.lat,
              lon: coordinates.lon,
              remainingAutonomy,
              remainingCapacity,
              action: 'à la déchèterie'
            });
          }
        }
      }

      // Reset autonomy and capacity after reaching the recycling center
      remainingAutonomy = AUTONOMIE_INITIALE;
      remainingCapacity = CAPACITY_VELO;

      if (fromRecyclage && Array.isArray(fromRecyclage)) {
        for (let i = 0; i < fromRecyclage.length; i++) {
          const arret = await Arret.findByPk(fromRecyclage[i]);
          if (arret) {
            const coordinates = JSON.parse(arret.coordinates);
            trajetsComplets.push({
              arretId: arret.id,
              arretNom: arret.nom,
              lat: coordinates.lat,
              lon: coordinates.lon,
              remainingAutonomy,
              remainingCapacity,
              action: 'revenir de la déchèterie'
            });
          }
        }
      }
    };

    const optimalPath = await itineraryService.calculateOptimalRoute(departId, arriveeId);

    await addPathToTrajets(optimalPath, 'trajet principal');

    trajetsComplets.push({
      arretId: arriveeArret.id,
      arretNom: arriveeArret.nom,
      lat: arriveeCoordinates.lat,
      lon: arriveeCoordinates.lon,
      remainingAutonomy,
      remainingCapacity
    });

    res.status(200).json({
      message: 'Le trajet est réalisable avec l\'autonomie et la capacité actuelles du vélo.',
      trajetsComplets,
      visitesDecheterie,  // Inclure visitesDecheterie dans la réponse
      velo,
      cycliste
    });
  } catch (error) {
    console.error('Erreur lors de la vérification du trajet :', error);
    res.status(500).json({ message: 'Erreur lors de la vérification du trajet', error });
  }
};
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