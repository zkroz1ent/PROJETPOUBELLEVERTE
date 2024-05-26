const express = require('express');
const router = express.Router();
const utilisateurController = require('./UtilisateurController');
const { verifyToken, verifyRole } = require('../middlewares/auth.middleware');

router.post('/register', utilisateurController.register);
router.post('/login', utilisateurController.login);
router.get('/profile', verifyToken, verifyRole(['cycliste', 'gestionnaire', 'RH', 'administrateur']), utilisateurController.profile);
router.get('/cyclistes', utilisateurController.getAllCyclistes);
// Ajouter des routes spécifiques avec des vérifications de rôle
router.get('/admin', verifyToken, verifyRole(['administrateur']), utilisateurController.adminPanel);

module.exports = router;