const itineraireService = require('../services/ItineraireService');

exports.getAllItineraires = async (req, res) => {
  const itineraires = await itineraireService.getAllItineraires();
  res.json(itineraires);
};

exports.createItineraire = async (req, res) => {
  const newItineraire = await itineraireService.createItineraire(req.body);
  res.status(201).json(newItineraire);
};

exports.getItineraireById = async (req, res) => {
  const itineraire = await itineraireService.getItineraireById(req.params.id);
  res.json(itineraire);
};

exports.updateItineraire = async (req, res) => {
  const updatedItineraire = await itineraireService.updateItineraire(req.params.id, req.body);
  res.json(updatedItineraire);
};

exports.deleteItineraire = async (req, res) => {
  await itineraireService.deleteItineraire(req.params.id);
  res.status(200).send();
};