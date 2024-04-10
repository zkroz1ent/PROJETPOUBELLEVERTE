const express = require('express');
const rueController = require('../controllers/RueController');

const router = express.Router();

router.get('/', rueController.getAllRues);
router.post('/', rueController.createRue);
router.get('/:id', rueController.getRueById);
router.put('/:id', rueController.updateRue);
router.delete('/:id', rueController.deleteRue);

module.exports = router;