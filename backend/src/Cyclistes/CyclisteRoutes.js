const express = require('express');
const cyclisteController = require('../controllers/CyclisteController');

const router = express.Router();

router.get('/cycliste', cyclisteController.getAllCyclistes);
router.post('/cycliste', cyclisteController.createCycliste);
router.get('/cycliste/:id', cyclisteController.getCyclisteById);
router.put('/cycliste/:id', cyclisteController.updateCycliste);
router.delete('/cycliste/:id', cyclisteController.deleteCycliste);

module.exports = router;