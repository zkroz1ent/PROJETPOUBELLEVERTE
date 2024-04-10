const express = require('express');
const trajetController = require('./TrajetController');
const router = express.Router();

router.get('/', trajetController.getAllTrajets);
router.post('/', trajetController.createTrajet);
router.get('/:id', trajetController.getTrajetById);
router.put('/:id', trajetController.updateTrajet);
router.delete('/:id', trajetController.deleteTrajet);

module.exports = router;