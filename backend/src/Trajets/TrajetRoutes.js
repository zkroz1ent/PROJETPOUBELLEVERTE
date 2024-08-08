const express = require('express');
const trajetController = require('./TrajetController');
const router = express.Router();
const { verifyToken, verifyRole } = require('../middlewares/auth.middleware');

router.get('/', trajetController.getAllTrajets);
router.post('/', trajetController.createTrajet);
router.get('/:id', trajetController.getTrajetById);
router.put('/:id', trajetController.updateTrajet);
router.delete('/:id', trajetController.deleteTrajet);

// Route pour obtenir les trajets par utilisateur connecté
router.get('/user', trajetController.getTrajetsByUserId);

module.exports = router;
