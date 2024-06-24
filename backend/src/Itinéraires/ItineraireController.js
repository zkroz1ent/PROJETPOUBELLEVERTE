const Cycliste = require('./CyclisteModel');
const Trajet = require('../Trajets/TrajetModel');

exports.getAllCyclistes = async (req, res) => {
  try {
    const cyclistes = await Cycliste.findAll();
    res.json(cyclistes);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.createCycliste = async (req, res) => {
  try {
    const cycliste = await Cycliste.create(req.body);
    res.json(cycliste);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getCyclisteById = async (req, res) => {
  try {
    const cycliste = await Cycliste.findByPk(req.params.id, {
      include: [Trajet]  // Inclure les trajets
    });
    res.json(cycliste);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.updateCycliste = async (req, res) => {
  try {
    const cycliste = await Cycliste.findByPk(req.params.id);
    if (cycliste) {
      await cycliste.update(req.body);
      res.json(cycliste);
    } else {
      res.status(404).send('Cycliste not found');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.deleteCycliste = async (req, res) => {
  try {
    const cycliste = await Cycliste.findByPk(req.params.id);
    if (cycliste) {
      await cycliste.destroy();
      res.send('Cycliste deleted');
    } else {
      res.status(404).send('Cycliste not found');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Nouvelle méthode pour assigner un trajet
exports.assignTrajet = async (req, res) => {
  try {
    const cycliste = await Cycliste.findByPk(req.params.id);
    if (cycliste) {
      const trajet = await Trajet.findByPk(req.body.trajetId);
      if (trajet) {
        await trajet.update({ cyclisteId: req.params.id });
        res.json(trajet);
      } else {
        res.status(404).send('Trajet not found');
      }
    } else {
      res.status(404).send('Cycliste not found');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};