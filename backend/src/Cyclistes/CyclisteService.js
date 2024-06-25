const Cycliste = require('../Cyclistes/CyclisteModel');
const Trajet = require('../Trajets/TrajetModel');

exports.getAllCyclistes = async () => {
  return await Cycliste.findAll({ include: [Trajet] });
};

exports.getAllTrajetsWithCyclistes = async () => {
  return await Trajet.findAll({ include: [Cycliste] });
};

exports.createCycliste = async (data) => {
  return await Cycliste.create(data);
};

exports.getCyclisteById = async (id) => {
  return await Cycliste.findByPk(id, { include: [Trajet] });
};

exports.updateCycliste = async (id, data) => {
  const cycliste = await Cycliste.findByPk(id);
  if (cycliste) {
    return await cycliste.update(data);
  }
  return null;
};

exports.deleteCycliste = async (id) => {
  const cycliste = await Cycliste.findByPk(id);
  if (cycliste) {
    await cycliste.destroy();
    return cycliste;
  }
  return null;
};

exports.findByPk = async (id) => {
  const cycliste = await Cycliste.findByPk(id, { include: [Trajet] });
  console.log(`Cycliste trouvé pour findByPk avec id ${id}:`, cycliste);
  return cycliste;
};