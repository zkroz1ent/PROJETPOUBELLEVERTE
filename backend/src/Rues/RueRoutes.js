const express = require('express');
const rueController = require('../controllers/RueController');

const router = express.Router();

router.get('/rues', rueController.getAllRues);
router.post('/rues', rueController.createRue);
router.get('/rues/:id', rueController.getRueById);
router.put('/rues/:id', rueController.updateRue);
router.delete('/rues/:id', rueController.deleteRue);

module.exports = router;