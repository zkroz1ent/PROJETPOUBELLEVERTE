const express = require('express');
const veloController = require('./VeloController');

const router = express.Router();

router.get('/velos', veloController.getAllVelos);
router.post('/velos', veloController.createVelo);
router.get('/velos/:id', veloController.getVeloById);
router.put('/velos/:id', veloController.updateVelo);
router.delete('/velos/:id', veloController.deleteVelo);

module.exports = router;