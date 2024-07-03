const trajetService = require('./TrajetService');

exports.getCyclistes = async (req, res) => {
  try {
    const cyclistes = await Cycliste.findAll({
      attributes: ['id', 'nom', 'prenom'],
      order: [['id', 'ASC']]
    });
    res.json(cyclistes);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des cyclistes' });
  }
};

exports.getArrets = async (req, res) => {
  try {
    const arrets = await Arret.findAll({
      attributes: ['id', 'nom', 'rueid'],
      order: [['id', 'ASC']]
    });
    res.json(arrets);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des arrêts' });
  }
};

exports.getAllTrajets = async (req, res) => {
  try {
    const trajets = await trajetService.getAllTrajets();
    res.json(trajets);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.createTrajet = async (req, res) => {
  const { cyclisteId, heure_debut, depart, arrivee } = req.body;
  try {
    const trajet = await Trajet.create({
      cyclisteId,
      heure_debut,
      depart,
      arrivee,
      statut: 'planifié'
    });
    res.status(201).json(trajet);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du trajet' });
  }
};
exports.getTrajetsByUserId = async (req, res) => {
  try {
    const userId = req.userId;  // Assurez-vous que le middleware d'authentification définit userId
    const trajets = await trajetService.getTrajetsByUserId(userId);
    res.json(trajets);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
exports.getTrajetById = async (req, res) => {
  try {
    const trajet = await trajetService.getTrajetById(req.params.id);
    if (trajet) {
      res.json(trajet);
    } else {
      res.status(404).send('Trajet not found.');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.updateTrajet = async (req, res) => {
  try {
    const updatedTrajet = await trajetService.updateTrajet(req.params.id, req.body);
    res.json(updatedTrajet);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.deleteTrajet = async (req, res) => {
  try {
    await trajetService.deleteTrajet(req.params.id);
    res.status(200).send('Trajet deleted successfully.');
  } catch (error) {
    res.status(500).send(error.message);
  }
};