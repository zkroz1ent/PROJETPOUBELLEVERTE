const express = require('express');
const utilisateurController = require('./UtilisateurController');
const router = express.Router();

router.get('/utilisateurs', utilisateurController.getAllUtilisateurs);
router.post('/utilisateurs', utilisateurController.createUtilisateur);
router.get('/utilisateurs/:id', utilisateurController.getUtilisateurById);
router.put('/utilisateurs/:id', utilisateurController.updateUtilisateur);
router.delete('/utilisateurs/:id', utilisateurController.deleteUtilisateur);

module.exports = router;