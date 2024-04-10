const cyclisteService = require('./CyclisteService');

exports.getAllCyclistes = async (req, res) => {
  try {
    const cyclistes = await cyclisteService.getAllCyclistes();
    res.json(cyclistes);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.createCycliste = async (req, res) => {
  try {
    const newCycliste = await cyclisteService.createCycliste(req.body);
    res.status(201).json(newCycliste);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.getCyclisteById = async (req, res) => {
  try {
    const cycliste = await cyclisteService.getCyclisteById(req.params.id);
    if (cycliste) {
      res.json(cycliste);
    } else {
      res.status(404).send('Cycliste not found');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.updateCycliste = async (req, res) => {
  try {
    const updatedCycliste = await cyclisteService.updateCycliste(req.params.id, req.body);
    res.json(updatedCycliste);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.deleteCycliste = async (req, res) => {
  try {
    await cyclisteService.deleteCycliste(req.params.id);
    res.status(200).send('Cycliste deleted successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
};