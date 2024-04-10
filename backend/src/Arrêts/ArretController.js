const arretService = require('./ArretService');

exports.getAllArrets = async (req, res) => {
  try {
    const arrets = await arretService.getAllArrets();
    res.status(200).json(arrets);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.createArret = async (req, res) => {
  try {
    const newArret = await arretService.createArret(req.body);
    res.status(201).json(newArret);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.getArretById = async (req, res) => {
  try {
    const arret = await arretService.getArretById(req.params.id);
    if (arret) {
      res.status(200).json(arret);
    } else {
      res.status(404).send('Arrêt introuvable');
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.updateArret = async (req, res) => {
  try {
    const updatedArret = await arretService.updateArret(req.params.id, req.body);
    res.status(200).json(updatedArret);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.deleteArret = async (req, res) => {
  try {
    await arretService.deleteArret(req.params.id);
    res.status(200).send('Arrêt supprimé avec succès');
  } catch (error) {
    res.status(400).send(error.message);
  }
};