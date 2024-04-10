const express = require('express');
const cyclisteController = require('./CyclisteController');

const router = express.Router();

router.get('/', cyclisteController.getAllCyclistes);
router.post('/', cyclisteController.createCycliste);
router.get('/:id', cyclisteController.getCyclisteById);
router.put('/:id', cyclisteController.updateCycliste);
router.delete('/:id', cyclisteController.deleteCycliste);

module.exports = router;