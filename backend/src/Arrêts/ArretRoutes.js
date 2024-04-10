const express = require('express');
const arretController = require('./ArretController');
const router = express.Router();

router.get('/arret', arretController.getAllArrets);
router.post('/arret', arretController.createArret);
router.get('/arret/:id', arretController.getArretById);
router.put('/arret/:id', arretController.updateArret);
router.delete('/arret/:id', arretController.deleteArret);

module.exports = router;