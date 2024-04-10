const Arret = require('../models/ArretModel');

exports.getAllArrets = async () => {
  return await Arret.findAll();
};

exports.createArret = async (arretData) => {
  return await Arret.create(arretData);
};

exports.getArretById = async (id) => {
  return await Arret.findByPk(id);
};

exports.updateArret = async (id, arretData) => {
  await Arret.update(arretData, {
    where: { id: id }
  });
  return await Arret.findByPk(id);
};

exports.deleteArret = async (id) => {
  return await Arret.destroy({
    where: { id: id }
  });
};