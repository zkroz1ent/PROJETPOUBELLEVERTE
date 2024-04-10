const Rue = require('../models/RueModel');

exports.getAllRues = async () => {
  return await Rue.findAll();
};

exports.createRue = async (rueData) => {
  return await Rue.create(rueData);
};

exports.getRueById = async (id) => {
  return await Rue.findByPk(id);
};

exports.updateRue = async (id, rueData) => {
  await Rue.update(rueData, {
    where: { id: id }
  });
  return await Rue.findByPk(id);
};

exports.deleteRue = async (id) => {
  await Rue.destroy({
    where: { id: id }
  });
};