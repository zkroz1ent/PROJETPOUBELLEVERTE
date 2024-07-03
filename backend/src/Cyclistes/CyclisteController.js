const cyclisteService = require('./CyclisteService');
const Cycliste = require('../Cyclistes/CyclisteModel');

exports.getAllCyclistes = async (req, res) => {
  try {
    const cyclistes = await Cycliste.findAll();
    res.json(cyclistes);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des cyclistes' });
  }
};

exports.getAllTrajetsWithCyclistes = async (req, res) => {
  try {
    const trajets = await cyclisteService.getAllTrajetsWithCyclistes();
    res.json(trajets);
  } catch (error) {
    console.error('Erreur lors de la récupération des trajets et des cyclistes:', error);
    res.status(500).send(error.message);
  }
};

exports.createCycliste = async (req, res) => {
  try {
    const newCycliste = await cyclisteService.createCycliste(req.body);
    res.status(201).json(newCycliste);
  } catch (error) {
    console.error('Erreur lors de la création du cycliste:', error);
    res.status(400).send(error.message);
  }
};

exports.getCyclisteById = async (req, res) => {
  try {
    const cycliste = await cyclisteService.getCyclisteById(req.params.id);
    if (cycliste) {
      res.json(cycliste);
    } else {
      res.status(404).send('Cycliste non trouvé');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du cycliste:', error);
    res.status(500).send(error.message);
  }
};

exports.updateCycliste = async (req, res) => {
  try {
    const updatedCycliste = await cyclisteService.updateCycliste(req.params.id, req.body);
    if (updatedCycliste) {
      res.json(updatedCycliste);
    } else {
      res.status(404).send('Cycliste non trouvé');
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du cycliste:', error);
    res.status(400).send(error.message);
  }
};

exports.getCyclisteTrajet = async (req, res) => {
  try {
    const cycliste = await cyclisteService.findByPk(req.params.id);
    if (cycliste && cycliste.Trajets.length > 0) {
      res.json(cycliste.Trajets[0]);
    } else {
      console.error('Aucun trajet trouvé pour ce cycliste:', cycliste);
      res.status(404).send('Aucun trajet trouvé pour ce cycliste');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du trajet pour le cycliste:', error);
    res.status(500).send(error.message);
  }
};

exports.assignTrajet = async (req, res) => {
  try {
    const cycliste = await cyclisteService.findByPk(req.params.id);
    if (cycliste) {
      const trajet = await Trajet.findByPk(req.body.trajetId);
      if (trajet) {
        await trajet.update({ cyclisteId: req.params.id });
        res.json(trajet);
      } else {
        console.error('Trajet non trouvé:', req.body.trajetId);
        res.status(404).send('Trajet non trouvé');
      }
    } else {
      console.error('Cycliste non trouvé:', req.params.id);
      res.status(404).send('Cycliste non trouvé');
    }
  } catch (error) {
    console.error('Erreur lors de l\'assignation du trajet:', error);
    res.status(500).send(error.message);
  }
};

exports.deleteCycliste = async (req, res) => {
  try {
    const deletedCycliste = await cyclisteService.deleteCycliste(req.params.id);
    if (deletedCycliste) {
      res.status(200).send('Cycliste supprimé avec succès');
    } else {
      res.status(404).send('Cycliste non trouvé');
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du cycliste:', error);
    res.status(500).send(error.message);
  }
};