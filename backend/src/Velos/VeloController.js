const veloService = require('./VeloService');

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
exports.updateVeloPosition = async (req, res) => {
  const { id } = req.params;
  const { latitude, longitude } = req.body;

  console.log(`Updating position for velo id ${id} to lat: ${latitude}, lon: ${longitude}`);

  try {
    const updatedVelo = await veloService.updateVeloPosition(id, latitude, longitude);
    res.status(200).send(updatedVelo);
  } catch (error) {
    console.error(`Error updating position for velo id ${id}:`, error);
    res.status(500).send({ error: error.message });
  }
};