const express = require('express');
const arretController = require('../Arrêts/ArretController');
const { verifyToken, verifyRole } = require('../middlewares/auth.middleware');
const router = express.Router();

router.get('/', verifyToken, arretController.getAllArrets);
router.post('/', verifyToken, arretController.createArret);
router.get('/:id', verifyToken, verifyRole(['admin']), arretController.getArretById);
router.put('/:id', verifyToken, verifyRole(['admin']), arretController.updateArret);
router.delete('/:id', verifyToken, verifyRole(['admin']), arretController.deleteArret);

module.exports = router;