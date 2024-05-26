const express = require('express');
const router = express.Router();
const itineraireController = require('./ItineraireController');
const { verifyToken, verifyRole } = require('../middlewares/auth.middleware');

router.put('/optimiser/:id', verifyToken, verifyRole(['administrateur', 'gestionnaire']), itineraireController.optimiserItineraire);
router.post('/assigner', verifyToken, verifyRole(['administrateur', 'gestionnaire']), itineraireController.assignerItineraire);
router.get('/user/:userId', verifyToken, itineraireController.getItinerairesByUserId);

module.exports = router;