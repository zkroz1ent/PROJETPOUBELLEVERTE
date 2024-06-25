const express = require('express');
const router = express.Router();
const utilisateurController = require('./UtilisateurController');
const { verifyToken, verifyRole } = require('../middlewares/auth.middleware');

// Routes existantes
router.post('/register', utilisateurController.register);
router.post('/login', utilisateurController.login);
router.get('/profile', verifyToken, verifyRole(['cycliste', 'gestionnaire', 'RH', 'administrateur']), utilisateurController.profile);
router.get('/admin', verifyToken, verifyRole(['administrateur']), utilisateurController.adminPanel);

// Routes CRUD pour les utilisateurs
router.get('/', verifyToken, verifyRole(['administrateur']), utilisateurController.getAllUtilisateurs);
router.get('/:id', verifyToken, verifyRole(['administrateur']), utilisateurController.getUtilisateurById);  // Assurez-vous que cette fonction est définie dans le contrôleur
router.post('/', verifyToken, verifyRole(['administrateur']), utilisateurController.createUtilisateur);
router.put('/:id', verifyToken, verifyRole(['administrateur']), utilisateurController.updateUtilisateur);
router.delete('/:id', verifyToken, verifyRole(['administrateur']), utilisateurController.deleteUtilisateur);

module.exports = router;