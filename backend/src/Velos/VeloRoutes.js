const express = require('express');
const veloController = require('./VeloController');

const router = express.Router();

router.get('/', veloController.getAllVelos);
router.post('/', veloController.createVelo);
router.get('/:id', veloController.getVeloById);
router.put('/:id', veloController.updateVelo);
router.delete('/:id', veloController.deleteVelo);
router.put('/:id/position', veloController.updateVeloPosition);
router.get('/coordinates/all', veloController.getAllVeloCoordinates);
module.exports = router;