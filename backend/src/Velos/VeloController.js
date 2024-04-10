const veloService = require('../services/VeloService');

exports.getAllVelos = async (req, res) => {
  try {
    const velos = await veloService.getAllVelos();
    res.json(velos);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.createVelo = async (req, res) => {
  try {
    const velo = await veloService.createVelo(req.body);
    res.status(201).json(velo);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.getVeloById = async (req, res) => {
  try {
    const velo = await veloService.getVeloById(req.params.id);
    if (velo) {
      res.json(velo);
    } else {
      res.status(404).send('Velo not found.');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.updateVelo = async (req, res) => {
  try {
    const updatedVelo = await veloService.updateVelo(req.params.id, req.body);
    res.json(updatedVelo);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.deleteVelo = async (req, res) => {
  try {
    await veloService.deleteVelo(req.params.id);
    res.status(200).send('Velo deleted successfully.');
  } catch (error) {
    res.status(500).send(error.message);
  }
};