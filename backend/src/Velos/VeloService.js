const Velo = require('./VeloModel');

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
exports.updateVeloPosition = async (id, latitude, longitude) => {
  console.log(`Finding velo id ${id}`);
  const velo = await Velo.findByPk(id);

  if (!velo) {
    console.error(`Velo with id ${id} not found`);
    throw new Error('Velo not found');
  }

  console.log(`Updating velo id ${id} position to lat: ${latitude}, lon: ${longitude}`);

  velo.derniere_position_lat = latitude;
  velo.derniere_position_lon = longitude;

  await velo.save();
  console.log(`Velo id ${id} position updated`);
  return velo;
};