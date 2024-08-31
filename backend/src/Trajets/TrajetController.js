const trajetService = require('./TrajetService');
const { Cycliste, Arret, Velo } = require('../../config/associations');
const itineraryService = require('../Itinéraires/ItineraireService');
const Trajet = require('./TrajetModel');
const { Sequelize, Op } = require('sequelize');
const PORTE_DE_IVRY_LAT = 48.82123;
const PORTE_DE_IVRY_LON = 2.36775;
const DISTANCE_ENTRE_ARRETS = 0.5; // 500 mètres
const AUTONOMIE_INITIALE = 50; // en km
const AUTONOMIE_HIVER = 0.90; // Réduction de 10% en hiver
const CAPACITY_VELO = 200; // en kg
const DECHETS_PAR_ARRET = 50; // en kg
const VITESSE_RAMASSAGE = 5; // en km/h
const VITESSE_ROUTE = 20; // en km/h
const FEUX_PAR_ARRET = 20; // Nombre de feux par km
const INTERSECTION_PENALTY = 0.5; // Penalty distance in km for intersections
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

function calculateTime(distance, mode) {
  if (mode === 'ramassage') {
    return distance / VITESSE_RAMASSAGE;
  } else if (mode === 'route') {
    return distance / VITESSE_ROUTE;
  } else {
    return 0;
  }
}
function intersectionDetector(lat1, lon1, lat2, lon2) {
  // Implémentez ici votre logique pour détecter les intersections
  // Ceci est un stub, remplacez avec la vraie logique de détection basée sur vos données
  return false;
}
exports.programmeRamassage = async (req, res) => {
  try {
    const cyclistes = await Cycliste.findAll({ where: { statut: 'actif' } });

    // Récupérer tous les arrêts non attribués avec des déchets
    let arrets = await Arret.findAll({
      where: {
        desservable: true,
        attribuer: false,
        quantite_dechets: { [Op.gt]: 0 }
      }
    });

    if (cyclistes.length === 0 || arrets.length === 0) {
      return res.status(400).json({ message: 'Aucun cycliste actif ou arrêt desservable avec déchets.' });
    }

    const stopsPerCycliste = Math.ceil(arrets.length / cyclistes.length);
    let index = 0; // Index pour parcours de tous les arrets

    for (const cycliste of cyclistes) {
      const assignedArrets = arrets.slice(index, index + stopsPerCycliste); // Prendre une portion pour le cycliste
      if (assignedArrets.length === 0) break; // Si plus d'arrêts à assigner, quitter.

      for (let i = 0; i < assignedArrets.length; i++) {
        const depart = assignedArrets[i];

        // Assurer que l'arrivée n'excède pas la portion actuelle et continuer la dernière pour relier au suivant
        const arrivee = assignedArrets[i + 1] || arrets[index + stopsPerCycliste];

        if (arrivee) {
          await Trajet.create({
            cyclisteId: cycliste.id,
            depart: depart.id,
            arrivee: arrivee.id,
            statut: 'planifié'
          });

          // Mettre à jour l'état 'attribué' de chaque arrêt impliqué
          await Arret.update({ attribuer: true }, { where: { id: [depart.id, arrivee.id] } });
        } else {
          // Aucun arrêt suivant, marquer seulement le départ
          await Arret.update({ attribuer: true }, { where: { id: depart.id } });
        }

        index++;
      }
    }

    // Vérification finale pour garantir que tous les arrêts ont été attribués
    await Arret.update({ attribuer: true }, {
      where: {
        attribuer: false
      }
    });

    res.status(200).json({ message: 'Les trajets ont été programmés avec succès.' });

  } catch (error) {
    console.error('Erreur lors de la programmation des ramassages:', error);
    res.status(500).json({ error: 'Erreur lors de la programmation des ramassages.' });
  }
};




exports.verifyTrajet = async (req, res) => {
  try {
    const { veloId, cyclisteId, isWinter = false } = req.body;

    const trajets = await Trajet.findAll({
      where: { cyclisteId },
      include: [
        { model: Arret, as: 'DepartArret' },
        { model: Arret, as: 'ArriveeArret' }
      ],
      order: [['heure_debut', 'ASC']]
    });

    if (trajets.length === 0) {
      console.log("Aucun trajet trouvé pour ce cycliste.");
      return res.status(400).json({ message: 'Aucun trajet trouvé pour ce cycliste.' });
    }

    const velo = await Velo.findByPk(veloId, { attributes: ['id', 'autonomie_restante'] });
    if (!velo) {
      console.log("Aucun velo trouvé pour ce cycliste.");
      return res.status(400).json({ message: 'Vélo invalide.' });
    }

    const AUTONOMIE_INITIALE = 50; // en km
    const AUTONOMIE_HIVER = 0.9;
    const VITESSE_RAMASSAGE = 5; // en km/h
    const VITESSE_ROUTE = 20; // en km/h
    const CAPACITY_VELO = 200; // en kg
    const DISTANCE_ARRET = 0.5; // en km

    let remainingAutonomy = velo.autonomie_restante !== null ? velo.autonomie_restante : AUTONOMIE_INITIALE;
    if (isWinter) {
      remainingAutonomy *= AUTONOMIE_HIVER;
    }

    let remainingCapacity = CAPACITY_VELO;
    let totalTime = 0;

    const trajetsComplets = [];
    const visitesDecheterie = [];

    const calculateTime = (mode) => {
      const speed = mode === 'ramassage' ? VITESSE_RAMASSAGE : VITESSE_ROUTE;
      return speed > 0 ? DISTANCE_ARRET / speed : 0;
    };

    const addRouteWithIntermediates = async (startId, endId, action, visitedNodes = new Set()) => {
      if (action == 'trajet principal') {
        console.log(`Calculating route from ${startId} to ${endId}`);
        const path = await itineraryService.calculateOptimalRoute(startId, endId);

        if (!path || path.length === 0) {
          console.error(`No path found from ${startId} to ${endId}`);
          return;
        }

        for (const arretId of path) {
          if (visitedNodes.has(arretId)) {
            console.warn(`Arret ${arretId} already visited, skipping to avoid infinite loop.`);
            continue;
          }

          visitedNodes.add(arretId);

          const arret = await Arret.findByPk(arretId);
          if (arret) {
            const coordinates = JSON.parse(arret.coordinates);
            const lat = coordinates.lat;
            const lon = coordinates.lon;
            const timeTaken = calculateTime(action.includes('ramassage') ? 'ramassage' : 'route');

            if (startId == arret.id) {
              remainingCapacity -= 50;
              trajetsComplets.push({
                arretId: arret.id,
                arretNom: arret.nom,
                lat: lat,
                lon: lon,
                remainingAutonomy: Math.max(0, remainingAutonomy - DISTANCE_ARRET).toFixed(2),
                remainingCapacity: remainingCapacity.toFixed(2),
                timeTaken: timeTaken.toFixed(2),
                action
              });
            } else if (endId == arret.id) {
              remainingCapacity -= 50;
              trajetsComplets.push({
                arretId: arret.id,
                arretNom: arret.nom,
                lat: lat,
                lon: lon,
                remainingAutonomy: Math.max(0, remainingAutonomy - DISTANCE_ARRET).toFixed(2),
                remainingCapacity: remainingCapacity.toFixed(2),
                timeTaken: timeTaken.toFixed(2),
                action
              });
            } else {
              trajetsComplets.push({
                arretId: arret.id,
                arretNom: arret.nom,
                lat: lat,
                lon: lon,
                remainingAutonomy: Math.max(0, remainingAutonomy - DISTANCE_ARRET).toFixed(2),
                remainingCapacity: remainingCapacity.toFixed(2),
                timeTaken: timeTaken.toFixed(2),
                action: 'trajet intermerdiaire'
              });
            }
            remainingAutonomy -= DISTANCE_ARRET;
            totalTime += timeTaken;

            // Vérifiez la nécessité de la déchèterie
            if (remainingAutonomy <= 0 || remainingCapacity <= 0) {
              console.log('Nécessité de se rendre à la déchèterie pour recharge et déchargement.');
              visitesDecheterie.push({
                point: arret.id,
                action: 'Nécessité de se rendre à la déchèterie'
              });
              await addRouteWithIntermediates(arret.id, 300, 'à la déchèterie et reprise', visitedNodes);
              remainingAutonomy = AUTONOMIE_INITIALE;
              remainingCapacity = CAPACITY_VELO;
            }
          }
        }
      } else {
        console.log(`Calculating route from ${startId} to ${endId}`);
        const path = await itineraryService.calculateOptimalRoute(startId, endId);

        if (!path || path.length === 0) {
          console.error(`No path found from ${startId} to ${endId}`);
          return;
        }

        for (const arretId of path) {
          if (visitedNodes.has(arretId)) {
            console.warn(`Arret ${arretId} already visited, skipping to avoid infinite loop.`);
            continue;
          }

          visitedNodes.add(arretId);

          const arret = await Arret.findByPk(arretId);
          if (arret) {
            const coordinates = JSON.parse(arret.coordinates);
            const lat = coordinates.lat;
            const lon = coordinates.lon;
            const timeTaken = calculateTime(action.includes('ramassage') ? 'ramassage' : 'route');

            trajetsComplets.push({
              arretId: arret.id,
              arretNom: arret.nom,
              lat: lat,
              lon: lon,
              remainingAutonomy: Math.max(0, remainingAutonomy - DISTANCE_ARRET).toFixed(2),
              remainingCapacity: remainingCapacity.toFixed(2),
              timeTaken: timeTaken.toFixed(2),
              action
            });

            remainingAutonomy -= DISTANCE_ARRET;
            totalTime += timeTaken;

            // Vérifiez la nécessité de la déchèterie
            if (remainingAutonomy <= 0 || remainingCapacity <= 0) {
              console.log('Nécessité de se rendre à la déchèterie pour recharge et déchargement.');
              visitesDecheterie.push({
                point: arret.id,
                action: 'Nécessité de se rendre à la déchèterie'
              });
              await addRouteWithIntermediates(arret.id, 300, 'à la déchèterie et reprise', visitedNodes);
              remainingAutonomy = AUTONOMIE_INITIALE;
              remainingCapacity = CAPACITY_VELO;
            }
          }
        }
      }
    };

    let currentStartId = 300; // Commence à la déchèterie de départ

    for (const trajet of trajets) {
      await addRouteWithIntermediates(currentStartId, trajet.DepartArret.id, 'Aller vers le premier point');
      await addRouteWithIntermediates(trajet.DepartArret.id, trajet.ArriveeArret.id, 'trajet principal');
      currentStartId = trajet.ArriveeArret.id; // Met à jour le point de départ pour le prochain trajet
    }

    await addRouteWithIntermediates(currentStartId, 300, 'Retour à la déchèterie finale'); // Retour à la déchèterie finale lorsque tous les trajets sont terminés

    console.log('totalTime');
    console.log(totalTime);

    res.status(200).json({
      message: `Le trajet cumulé est réalisable avec l'autonomie et la capacité actuelles du vélo. Durée totale : ${totalTime.toFixed(2)} heures.`,
      trajetsComplets,
      visitesDecheterie,
      velo,
      totalTime
    });
  } catch (error) {
    console.log(error);
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