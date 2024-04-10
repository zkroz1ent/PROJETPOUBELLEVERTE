const express = require('express');
const trajetController = require('./TrajetController');
const router = express.Router();

router.get('/trajets', trajetController.getAllTrajets);
router.post('/trajets', trajetController.createTrajet);
router.get('/trajets/:id', trajetController.getTrajetById);
router.put('/trajets/:id', trajetController.updateTrajet);
router.delete('/trajets/:id', trajetController.deleteTrajet);

module.exports = router;