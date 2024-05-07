
const express = require('express');
const router = express.Router();
const RamassageController = require('./RamassageController');

router.post('/ramassages', RamassageController.createRamassage);
router.get('/ramassages', RamassageController.getAllRamassages);
router.get('/ramassages/:id', RamassageController.getRamassageById);
router.put('/ramassages/:id', RamassageController.updateRamassage);
router.delete('/ramassages/:id', RamassageController.deleteRamassage);

module.exports = router;
