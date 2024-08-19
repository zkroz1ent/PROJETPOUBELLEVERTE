const { Incident, Velo, Trajet, Cycliste, Arret, Rue } = require('../../config/associations');
const { calculateOptimalRoute } = require('../Itinéraires/ItineraireService');

// Déclaration d'un incident
exports.declareIncident = async (req, res) => {
  try {
    const { type, description, veloId } = req.body;

    if (!type || !description || !veloId) {
      return res.status(400).json({ error: 'Les champs type, description et veloId sont requis' });
    }

    const incident = await Incident.create({ type, description, veloId });

    // Gestion de l'incident et recalcul des trajets
    await handleIncident(incident);

    res.status(200).json(incident);
  } catch (error) {
    console.error('Erreur lors de la déclaration de l\'incident :', error);
    res.status(500).json({ error: 'Erreur lors de la déclaration de l\'incident' });
  }
};

// Résolution d'un incident
exports.resolveIncident = async (req, res) => {
  try {
    const { incidentId } = req.params;

    const incident = await Incident.findByPk(incidentId);
    if (!incident) {
      return res.status(404).json({ error: 'Incident non trouvé' });
    }

    incident.etat = 'résolu';
    await incident.save();

    res.status(200).json(incident);
  } catch (error) {
    console.error('Erreur lors de la résolution de l\'incident :', error);
    res.status(500).json({ error: 'Erreur lors de la résolution de l\'incident' });
  }
};

// Récupération des incidents en cours
exports.getIncidentsEnCours = async (req, res) => {
  try {
    const incidents = await Incident.findAll({
      where: { etat: 'en cours' },
      include: [{ model: Velo }]
    });
    res.status(200).json(incidents);
  } catch (error) {
    console.error('Erreur lors de la récupération des incidents en cours :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des incidents en cours' });
  }
};

// Gestion de l'incident et réaffectation des trajets
async function handleIncident(incident) {
  const velo = await Velo.findByPk(incident.veloId);
  const trajets = await Trajet.findAll({ where: { veloId: velo.id, statut: 'en cours' } });

  for (const trajet of trajets) {
    trajet.statut = 'réaffecté'; // Mettre à jour le statut du trajet
    await trajet.save();

    // Notifier les cyclistes et redistribuer les trajets
    await notifyCyclistesAndRecalculate(trajet);
  }
}

// Notifier les cyclistes et recalculer les trajets
async function notifyCyclistesAndRecalculate(trajet) {
  const cycliste = await Cycliste.findByPk(trajet.cyclisteId);

  // Envoyer une notification au cycliste (vous pouvez utiliser un service de notification ici)
  // Logique pour recalculer l'itinéraire
  const departArret = await trajet.getDepartArret();
  const arriveeArret = await trajet.getArriveeArret();

  const optimalPath = await calculateOptimalRoute(departArret.id, arriveeArret.id);

  // Mettre à jour le trajet avec le nouvel itinéraire
  await Promise.all(optimalPath.map(async (arretId, index) => {
    // Associer l'arret au trajet
    await trajet.addArret(arretId, { through: { ordre: index } });
  }));
}