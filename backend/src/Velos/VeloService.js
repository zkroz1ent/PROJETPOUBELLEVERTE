const Velo = require('../models/VeloModel');

exports.getAllVelos = async () => {
  return await Velo.findAll();
};

exports.createVelo = async (veloData) => {
  return await Velo.create(veloData);
};

exports.getVeloById = async (id) => {
  return await Velo.findByPk(id);
};

exports.updateVelo = async (id, veloData) => {
  await Velo.update(veloData, {
    where: { id: id }
  });
  return await Velo.findByPk(id);
};

exports.deleteVelo = async (id) => {
  await Velo.destroy({
    where: { id: id }
  });
};