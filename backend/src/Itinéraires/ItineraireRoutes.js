const express = require('express');
const itineraireController = require('../controllers/ItineraireController');

const router = express.Router();

router.get('/itineraires', itineraireController.getAllItineraires);
router.post('/itineraires', itineraireController.createItineraire);
router.get('/itineraires/:id', itineraireController.getItineraireById);
router.put('/itineraires/:id', itineraireController.updateItineraire);
router.delete('/itineraires/:id', itineraireController.deleteItineraire);

module.exports = router;