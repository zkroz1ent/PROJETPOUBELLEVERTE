const Trajet = require('./TrajetModel');

exports.getAllTrajets = async () => {
  return await Trajet.findAll();
};

exports.createTrajet = async (trajetData) => {
  return await Trajet.create(trajetData);
};

exports.getTrajetById = async (id) => {
  return await Trajet.findByPk(id);
};

exports.updateTrajet = async (id, trajetData) => {
  await Trajet.update(trajetData, {
    where: { id: id }
  });
  return await Trajet.findByPk(id);
};

exports.deleteTrajet = async (id) => {
  return await Trajet.destroy({
    where: { id: id }
  });
};