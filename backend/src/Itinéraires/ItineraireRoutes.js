const express = require('express');
const itineraireController = require('../controllers/ItineraireController');

const router = express.Router();

router.get('/', itineraireController.getAllItineraires);
router.post('/', itineraireController.createItineraire);
router.get('/:id', itineraireController.getItineraireById);
router.put(':id', itineraireController.updateItineraire);
router.delete(':id', itineraireController.deleteItineraire);

module.exports = router;