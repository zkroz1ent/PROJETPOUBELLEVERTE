const ItineraireService = require('./ItineraireService');

exports.optimiserItineraire = async (req, res) => {
  try {
    const itineraire = await ItineraireService.optimiserItineraire(req.params.id);
    res.json(itineraire);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.assignerItineraire = async (req, res) => {
  try {
    const itineraire = await ItineraireService.assignerItineraire(req.body.cyclisteId, req.body.itineraireId);
    res.json(itineraire);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllItineraires = async (req, res) => {
  try {
    const itineraires = await ItineraireService.getAllItineraires();
    res.json(itineraires);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};