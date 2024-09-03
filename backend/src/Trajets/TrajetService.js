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
exports.removealltrajet = async (req, res) => {
  try {
    // Supprimer tous les trajets
    await Trajet.destroy({ where: {} });

    // Réinitialiser tous les arrêts à non attribués
    await Arret.update({ attribuer: false }, { where: {} });

    res.status(200).json({ message: 'Tous les trajets et arrêts ont été supprimés avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression de tous les trajets :', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de tous les trajets.' });
  }
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

    return trajets;




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