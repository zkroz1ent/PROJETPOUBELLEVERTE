const Trajet = require('./TrajetModel');

exports.getAllTrajets = async () => {
  return await Trajet.findAll();
};

exports.createTrajet = async (trajetData) => {
  return await Trajet.create(trajetData);
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