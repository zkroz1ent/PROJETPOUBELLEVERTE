const rueService = require('../services/RueService');

exports.getAllRues = async (req, res) => {
  const rues = await rueService.getAllRues();
  res.json(rues);
};

exports.createRue = async (req, res) => {
  const newRue = await rueService.createRue(req.body);
  res.status(201).json(newRue);
};

exports.getRueById = async (req, res) => {
  const rue = await rueService.getRueById(req.params.id);
  res.json(rue);
};

exports.updateRue = async (req, res) => {
  const updatedRue = await rueService.updateRue(req.params.id, req.body);
  res.json(updatedRue);
};

exports.deleteRue = async (req, res) => {
  await rueService.deleteRue(req.params.id);
  res.status(200).send();
};