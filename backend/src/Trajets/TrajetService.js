const Trajet = require('./TrajetModel');

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
  return await Trajet.findByPk(id);
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