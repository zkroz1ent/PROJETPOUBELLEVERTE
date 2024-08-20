const Trajet = require('./TrajetModel');
const { Arret, Cycliste, Rue, Velo } = require('../../config/associations');
const itineraryService = require('../Itinéraires/ItineraireService');

exports.getAllTrajets = async () => {
  return await Trajet.findAll({
    include: [
      { model: Arret, as: 'DepartArret' },
      { model: Arret, as: 'ArriveeArret' },
      { model: Cycliste, as: 'Cycliste' },
      { model: Velo, as: 'Velo' }
    ]
  });
};

exports.createTrajet = async (trajetData) => {
  console.log(trajetData);

  if (!trajetData) {
    console.error('Validation des données échouée', trajetData);
    return;
  }

  let trajetbyuser = await Trajet.findAll({ where: { cyclisteId: trajetData.cyclisteId } });
  console.log(trajetbyuser);

  try {
    console.log('Données reçues pour création:', trajetData);
    return await Trajet.create(trajetData);
  } catch (error) {
    console.error('Erreur lors de la création du trajet:', error);
  }
};

exports.getTrajetById = async (id) => {
  return await Trajet.findByPk(id, {
    include: [
      { model: Arret, as: 'DepartArret' },
      { model: Arret, as: 'ArriveeArret' },
      { model: Cycliste, as: 'Cycliste' },
      { model: Velo, as: 'Velo' }
    ]
  });
};

exports.updateTrajet = async (id, trajetData) => {
  await Trajet.update(trajetData, {
    where: { id: id }
  });
  return await Trajet.findByPk(id, {
    include: [
      { model: Arret, as: 'DepartArret' },
      { model: Arret, as: 'ArriveeArret' },
      { model: Cycliste, as: 'Cycliste' },
      { model: Velo, as: 'Velo' }
    ]
  });
};

exports.deleteTrajet = async (id) => {
  return await Trajet.destroy({
    where: { id: id }
  });
};

exports.getTrajetsByUserId = async (userId) => {
  return await Trajet.findAll({
    where: { cyclisteId: userId },
    include: [
      { model: Arret, as: 'DepartArret' },
      { model: Arret, as: 'ArriveeArret' },
      { model: Cycliste, as: 'Cycliste' },
      { model: Velo, as: 'Velo' }
    ]
  });
};

exports.getTrajetsParCycliste = async (cyclisteId) => {
  try {
    const trajets = await Trajet.findAll({
      where: { cyclisteId },
      include: [
        { model: Arret, as: 'DepartArret' },
        { model: Arret, as: 'ArriveeArret' }
      ],
      order: [['heure_debut', 'ASC']]
    });

    if (trajets.length === 0) {
      return [];
    }

    const departId = trajets[0].DepartArret.id;
    const arriveeId = trajets[trajets.length - 1].ArriveeArret.id;

    const optimalPath = await itineraryService.calculateOptimalRoute(departId, arriveeId);

    // Récupération des noms des arrêts et des rues
    const arretDetails = await Arret.findAll({
      where: { id: optimalPath },
      include: [{ model: Rue, as: 'RueAssoc' }]
    });

    const optimalPathDetails = optimalPath.map(id => {
      const arret = arretDetails.find(a => a.id === parseInt(id));
      return {
        arretId: arret.id,
        arretNom: arret.nom,
        rueId: arret.RueAssoc.id,
        rueNom: arret.RueAssoc.name
      };
    });

    return optimalPathDetails;
  } catch (error) {
    console.error('Erreur lors de la récupération des trajets:', error);
    throw new Error('Erreur lors de la récupération des trajets');
  }
};

exports.optimiserTrajetsSuiteIncident = async (incidentId) => {
  const incident = await Incident.findByPk(incidentId);

  const trajetsAffectes = await Trajet.findAll({
    where: { incidentId }
  });

  for (const trajet of trajetsAffectes) {
    const velo = await Velo.findByPk(trajet.veloId);
    const nouveauTrajet = await RoutingLibrary.recalculateRoute(
      velo.positionActuelle,
      trajet.destination,
      { avoid: incident.position }
    );

    trajet.updateWithNewRoute(nouveauTrajet);
  }

  return trajetsAffectes;
};