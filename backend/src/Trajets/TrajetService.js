const Trajet = require('./TrajetModel');
const { Arret, Cycliste ,Rue} = require('../../config/associations');
const itineraryService = require('../Itinéraires/ItineraireService');
exports.getAllTrajets = async () => {
  return await Trajet.findAll();
};

exports.createTrajet = async (trajetData) => {
  console.log(trajetData);

  if (!trajetData) {
    console.error('Validation des données échouée', trajetData);
    return;
  }
  let trajetbyuser = await Trajet.findAll({ where: { cyclisteId: trajetData.cyclisteId } });
  console.log("trajetbyusertrajetbyusertrajetbyusertrajetbyusertrajetbyusertrajetbyuser");

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
      { model: Arret, as: 'departs' },
      { model: Arret, as: 'arrivees' }
    ]
  });
};

exports.updateTrajet = async (id, trajetData) => {
  await Trajet.update(trajetData, {
    where: { id: id }
  });
  return await Trajet.findByPk(id);
};

exports.deleteTrajet = async (id) => {
  return await Trajet.destroy({
    where: { id: id }
  });
};
exports.getTrajetsByUserId = async (userId) => {
  return await Trajet.findAll({ where: { utilisateurId: userId } });
};
exports.getTrajetsParCycliste = async (cyclisteId) => {
  try {
    console.log(`Fetching trajets for cyclisteId: ${cyclisteId}`);

    const trajets = await Trajet.findAll({
      where: { cyclisteId },
      include: [
        { model: Arret, as: 'DepartArret' },
        { model: Arret, as: 'ArriveeArret' }
      ],
      order: [
        ['heure_debut', 'ASC']
      ]
    });

    if (trajets.length === 0) {
      console.log('Aucun trajet trouvé pour ce cycliste');
      return [];
    }

    const departId = trajets[0].depart;
    const arriveeId = trajets[trajets.length - 1].arrivee;
    console.log(`Depart ID: ${departId}, Arrivee ID: ${arriveeId}`);

    const optimalPath = await itineraryService.calculateOptimalRoute(departId, arriveeId);

    // Récupération des noms des arrêts et des rues
    const arretDetails = await Arret.findAll({
      where: { id: optimalPath },
      include: [{ model: Rue, as: 'rue' }]
    });

    const optimalPathDetails = optimalPath.map(id => {
      const arret = arretDetails.find(a => a.id === parseInt(id));
      return {
        arretId: arret.id,
        arretNom: arret.nom,
        rueId: arret.rue.id,
        rueNom: arret.rue.name
      };
    });

    return optimalPathDetails;
  } catch (error) {
    console.error('Erreur lors de la récupération des trajets:', error);
    throw new Error('Erreur lors de la récupération des trajets');
  }
};



exports.optimiserTrajetsSuiteIncident = async (incidentId) => {
  const incident = await IncidentModel.findById(incidentId);

  // Identifier tous les trajets qui peuvent être affectés par l'incident
  const trajetsAffectes = await TrajetModel.findAffectedByIncident(incident);

  // Pour chaque trajet affecté...
  for (const trajet of trajetsAffectes) {
    const velo = await VeloModel.findById(trajet.veloId);
    const nouveauTrajet = await RoutingLibrary.recalculateRoute(
      velo.positionActuelle,
      trajet.destination,
      { avoid: incident.position }
    );

    // Sauvegarder les modifications du trajet dans la base de données
    trajet.updateWithNewRoute(nouveauTrajet);
  }

  // Retourner les trajets optimisés
  return trajetsAffectes;
};