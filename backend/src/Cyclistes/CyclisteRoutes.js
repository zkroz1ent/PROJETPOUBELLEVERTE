const express = require('express');
const cyclisteController = require('./CyclisteController');
const router = express.Router();
router.get('/', cyclisteController.getAllCyclistes);
router.post('/', cyclisteController.createCycliste);
router.get('/:id', cyclisteController.getCyclisteById);
router.put('/:id', cyclisteController.updateCycliste);
router.delete('/:id', cyclisteController.deleteCycliste);

// Route pour assigner un trajet à un cycliste
router.post('/:id/assignTrajet', cyclisteController.assignTrajet);

// Route pour obtenir le trajet assigné au cycliste
router.get('/:id/trajet', cyclisteController.getCyclisteTrajet);

module.exports = router;