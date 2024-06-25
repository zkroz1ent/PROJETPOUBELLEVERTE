const express = require('express');
const cyclisteController = require('./CyclisteController');
const router = express.Router();

router.get('/', cyclisteController.getAllCyclistes);
router.post('/', cyclisteController.createCycliste);
router.get('/:id', cyclisteController.getCyclisteById);
router.put('/:id', cyclisteController.updateCycliste);
router.delete('/:id', cyclisteController.deleteCycliste);
router.post('/:id/assignTrajet', cyclisteController.assignTrajet);
router.get('/:id/trajet', cyclisteController.getCyclisteTrajet);
router.get('/allTrajetsWithCyclistes', cyclisteController.getAllTrajetsWithCyclistes); // Nouvelle route

module.exports = router;