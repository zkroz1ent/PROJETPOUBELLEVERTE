const express = require('express');
const arretController = require('./ArretController');
const router = express.Router();

router.get('/', arretController.getAllArrets);
router.post('/', arretController.createArret);
router.get('/:id', arretController.getArretById);
router.put('/:id', arretController.updateArret);
router.delete('/:id', arretController.deleteArret);

module.exports = router;