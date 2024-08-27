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
    const usedStops = new Set(); // Set pour suivre les arrêts déjà attribués

    for (const cycliste of cyclistes) {
      const stopsForCycliste = arrets.slice(); // Clone initial des arrêts restants pour ce cycliste

      let index = 0;
      while (index < stopsForCycliste.length) {
        const arretDepart = stopsForCycliste[index];
        if (!usedStops.has(arretDepart.id)) {
          // Chercher le prochain arrêt non attribué
          const arriveeIndex = stopsForCycliste.findIndex((arret, idx) => 
            idx > index && !usedStops.has(arret.id)
          );

          if (arriveeIndex !== -1) {
            const arretArrivee = stopsForCycliste[arriveeIndex];

            // Créer le trajet
            await Trajet.create({
              cyclisteId: cycliste.id,
              depart: arretDepart.id,
              arrivee: arretArrivee.id,
              statut: 'planifié'
            });

            // Marquer les arrêts comme attribués
            usedStops.add(arretDepart.id);
            usedStops.add(arretArrivee.id);

            // Mettre à jour les arrêts en base de données
            await Arret.update({ attribuer: true }, { where: { id: arretDepart.id } });
            await Arret.update({ attribuer: true }, { where: { id: arretArrivee.id } });

            // Supprimer l'arrêt d'arrivée de la liste
            stopsForCycliste.splice(arriveeIndex, 1);
          }
        }
        index++;
      }
    }

    res.status(200).json({ message: 'Les trajets ont été programmés avec succès.' });

  } catch (error) {
    console.error('Erreur lors de la programmation des ramassages:', error);
    res.status(500).json({ error: 'Erreur lors de la programmation des ramassages.' });
  }
};
exports.verifyTrajet = async (req, res) => {
  try {
    const { veloId, cyclisteId, isWinter = false } = req.body;

    // Récupération des trajets associés au cycliste
    const trajets = await Trajet.findAll({
      where: { cyclisteId },
      include: [
        { model: Arret, as: 'DepartArret' },
        { model: Arret, as: 'ArriveeArret' }
      ],
      order: [['heure_debut', 'ASC']]
    });

    if (trajets.length === 0) {
      return res.status(400).json({ message: 'Aucun trajet trouvé pour ce cycliste.' });
    }

    // Récupération du vélo
    const velo = await Velo.findByPk(veloId, { attributes: ['id', 'autonomie_restante'] });
    if (!velo) {
      return res.status(400).json({ message: 'Vélo invalide.' });
    }

    let remainingAutonomy = velo.autonomie_restante !== null ? velo.autonomie_restante : AUTONOMIE_INITIALE;
    let remainingCapacity = CAPACITY_VELO;
    let totalTime = 0;

    if (isWinter) {
      remainingAutonomy *= AUTONOMIE_HIVER;
    }

    const trajetsComplets = [];
    const visitesDecheterie = [];

    const addPathToTrajets = async (path, labelAction) => {
      for (const arretId of path) {
        const arret = await Arret.findByPk(arretId);
        if (!arret) {
          console.error(`Arrêt indisponible pour l'ID: ${arretId}`);
          continue;
        }

        const coordinates = JSON.parse(arret.coordinates);
        const distance = DISTANCE_ENTRE_ARRETS;
        const feuxPerdus = Math.floor(distance * FEUX_PAR_ARRET / 20);
        const timeTaken = calculateTime(distance, labelAction.includes('ramassage') ? 'ramassage' : 'route');

        trajetsComplets.push({
          arretId: arret.id,
          arretNom: arret.nom,
          lat: coordinates.lat,
          lon: coordinates.lon,
          remainingAutonomy: Math.max(0, remainingAutonomy - distance - feuxPerdus),
          remainingCapacity: Math.max(0, remainingCapacity - DECHETS_PAR_ARRET),
          timeTaken,
          action: labelAction
        });

        remainingAutonomy -= distance + feuxPerdus;
        remainingCapacity -= DECHETS_PAR_ARRET;
        totalTime += timeTaken;

        if (remainingAutonomy <= 0 || remainingCapacity <= 0) {
          console.log('Nécessité de se rendre à la déchèterie pour recharge et déchargement.');
          visitesDecheterie.push({
            point: arret.id,
            action: 'Nécessité de se rendre à la déchèterie'
          });
          await addPathToDecheterie(arret.id);
          remainingAutonomy = AUTONOMIE_INITIALE;
          remainingCapacity = CAPACITY_VELO;
        }
      }
    };

    const addPathToDecheterie = async (arretId) => {
      const trajetrecyclage = await itineraryService.calculateOptimalRoute(arretId, 300); // '300' est Porte d'Ivry
      const toRecyclage = trajetrecyclage || [];
      const fromRecyclage = [...toRecyclage].reverse();

      // Vers la déchèterie
      if (toRecyclage && Array.isArray(toRecyclage)) {
        for (const id of toRecyclage) {
          const arret = await Arret.findByPk(id);
          if (arret) {
            const coordinates = JSON.parse(arret.coordinates);
            const distance = DISTANCE_ENTRE_ARRETS;
            const feuxPerdus = Math.floor(distance * FEUX_PAR_ARRET / 20);
            const timeTaken = calculateTime(distance, 'route');

            trajetsComplets.push({
              arretId: arret.id,
              arretNom: arret.nom,
              lat: coordinates.lat,
              lon: coordinates.lon,
              remainingAutonomy: Math.max(0, remainingAutonomy - distance - feuxPerdus),
              remainingCapacity,
              timeTaken,
              action: 'à la déchèterie'
            });

            remainingAutonomy -= distance + feuxPerdus;
            totalTime += timeTaken;
          }
        }
      }

      remainingAutonomy = AUTONOMIE_INITIALE;
      remainingCapacity = CAPACITY_VELO;

      // Retour de la déchèterie
      if (fromRecyclage && Array.isArray(fromRecyclage)) {
        for (const id of fromRecyclage) {
          const arret = await Arret.findByPk(id);
          if (arret) {
            const coordinates = JSON.parse(arret.coordinates);
            const distance = DISTANCE_ENTRE_ARRETS;
            const feuxPerdus = Math.floor(distance * FEUX_PAR_ARRET / 20);
            const timeTaken = calculateTime(distance, 'route');

            trajetsComplets.push({
              arretId: arret.id,
              arretNom: arret.nom,
              lat: coordinates.lat,
              lon: coordinates.lon,
              remainingAutonomy: Math.max(0, remainingAutonomy - distance - feuxPerdus),
              remainingCapacity,
              timeTaken,
              action: 'revenir de la déchèterie'
            });

            remainingAutonomy -= distance + feuxPerdus;
            totalTime += timeTaken;
          }
        }
      }
    };

    const addPathToDecheterieStart = async (arretId) => {
      const trajetrecyclage = await itineraryService.calculateOptimalRoute(300, arretId);
      if (trajetrecyclage && Array.isArray(trajetrecyclage)) {
        for (const id of trajetrecyclage) {
          const arret = await Arret.findByPk(id);
          if (arret) {
            const coordinates = JSON.parse(arret.coordinates);
            const distance = DISTANCE_ENTRE_ARRETS;
            const feuxPerdus = Math.floor(distance * FEUX_PAR_ARRET / 20);
            const timeTaken = calculateTime(distance, 'route');

            trajetsComplets.push({
              arretId: arret.id,
              arretNom: arret.nom,
              lat: coordinates.lat,
              lon: coordinates.lon,
              remainingAutonomy: Math.max(0, remainingAutonomy - distance - feuxPerdus),
              remainingCapacity,
              timeTaken,
              action: 'Aller vers le premier point'
            });

            remainingAutonomy -= distance + feuxPerdus;
            totalTime += timeTaken;
          }
        }
      }
    };

    const addPathToDecheterieEnd = async (arretId) => {
      const trajetrecyclage = await itineraryService.calculateOptimalRoute(arretId, 300);

      if (trajetrecyclage && Array.isArray(trajetrecyclage)) {
        for (const id of trajetrecyclage) {
          const arret = await Arret.findByPk(id);
          if (arret) {
            const coordinates = JSON.parse(arret.coordinates);
            const distance = DISTANCE_ENTRE_ARRETS;
            const feuxPerdus = Math.floor(distance * FEUX_PAR_ARRET / 20);
            const timeTaken = calculateTime(distance, 'route');

            trajetsComplets.push({
              arretId: arret.id,
              arretNom: arret.nom,
              lat: coordinates.lat,
              lon: coordinates.lon,
              remainingAutonomy: Math.max(0, remainingAutonomy - distance - feuxPerdus),
              remainingCapacity,
              timeTaken,
              action: 'Retour à la déchèterie'
            });

            remainingAutonomy -= distance + feuxPerdus;
            totalTime += timeTaken;
          }
        }
      }
    };

    await addPathToDecheterieStart(trajets[0].DepartArret.id); // Aller de Porte d'Ivry vers le premier arrêt

    for (const trajet of trajets) {
      const departArretId = trajet.DepartArret.id;
      const arriveeArretId = trajet.ArriveeArret.id;
      await addPathToTrajets([departArretId, arriveeArretId], 'trajet principal');
    }

    const dernierArriveeArretId = trajets[trajets.length - 1].ArriveeArret.id;

    await addPathToDecheterieEnd(dernierArriveeArretId); // Retour à la déchèterie de Porte d'Ivry après tous les trajets

    res.status(200).json({
      message: "Le trajet cumulé est réalisable avec l'autonomie et la capacité actuelles du vélo.",
      trajetsComplets,
      visitesDecheterie,
      velo,
      totalTime
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