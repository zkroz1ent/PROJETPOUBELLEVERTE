const express = require('express');
const {
  register,
  login,
  profile,
  adminPanel,
  getAllUtilisateurs,
  getUtilisateurById,
  createUtilisateur,
  updateUtilisateur,
  deleteUtilisateur
} = require('./utilisateurController');
const { verifyToken, verifyRole } = require('../middlewares/auth.middleware');

const router = express.Router();

// Routes d'authentification
router.post('/register', register);
router.post('/login', login);
router.get('/profile', verifyToken, verifyRole(['cycliste', 'gestionnaire', 'RH', 'administrateur']), profile);
router.get('/admin', verifyToken, verifyRole(['administrateur']), adminPanel);

// Routes CRUD pour les utilisateurs
router.get('/', getAllUtilisateurs);
router.get('/:id', verifyToken, verifyRole(['administrateur']), getUtilisateurById);
router.post('/', verifyToken, verifyRole(['administrateur']), createUtilisateur);
router.put('/:id', verifyToken, verifyRole(['administrateur']), updateUtilisateur);
router.delete('/:id', deleteUtilisateur);

module.exports = router;