const trajetService = require('./TrajetService');

exports.getAllTrajets = async (req, res) => {
  try {
    const trajets = await trajetService.getAllTrajets();
    res.json(trajets);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.createTrajet = async (req, res) => {
  try {
    const newTrajet = await trajetService.createTrajet(req.body);
    res.status(201).json(newTrajet);
  } catch (error) {
    res.status(400).send(error.message);
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