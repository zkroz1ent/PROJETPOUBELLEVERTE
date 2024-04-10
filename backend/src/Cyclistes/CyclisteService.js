const Cycliste = require('./CyclisteModel');

exports.getAllCyclistes = async () => {
  return await Cycliste.findAll();
};

exports.createCycliste = async (cyclisteData) => {
  return await Cycliste.create(cyclisteData);
};

exports.getCyclisteById = async (id) => {
  return await Cycliste.findByPk(id);
};

exports.updateCycliste = async (id, cyclisteData) => {
  await Cycliste.update(cyclisteData, {
    where: { id: id }
  });
  return await Cycliste.findByPk(id);
};

exports.deleteCycliste = async (id) => {
  return await Cycliste.destroy({
    where: { id: id }
  });
};