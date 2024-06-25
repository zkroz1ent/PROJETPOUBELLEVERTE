const express = require('express');
const rueController = require('../Rues/RueController');
const { verifyToken, verifyRole } = require('../middlewares/auth.middleware');
const router = express.Router();

router.get('/', verifyToken, verifyRole(['admin']), rueController.getAllRues);
router.post('/', verifyToken, verifyRole(['admin']), rueController.createRue);
router.get('/:id', verifyToken, verifyRole(['admin']), rueController.getRueById);
router.put('/:id', verifyToken, verifyRole(['admin']), rueController.updateRue);
router.delete('/:id', verifyToken, verifyRole(['admin']), rueController.deleteRue);

module.exports = router;