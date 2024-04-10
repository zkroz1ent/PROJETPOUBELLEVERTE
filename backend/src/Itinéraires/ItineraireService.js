const Itineraire = require('../models/ItineraireModel');

exports.getAllItineraires = async () => {
  return await Itineraire.findAll();
};

exports.createItineraire = async (itineraireData) => {
  return await Itineraire.create(itineraireData);
};

exports.getItineraireById = async (id) => {
  return await Itineraire.findByPk(id);
};

exports.updateItineraire = async (id, itineraireData) => {
  await Itineraire.update(itineraireData, {
    where: { id: id }
  });
  return await Itineraire.findByPk(id);
};

exports.deleteItineraire = async (id) => {
  await Itineraire.destroy({
    where: { id: id }
  });
};