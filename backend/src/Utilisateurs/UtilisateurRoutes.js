const express = require('express');
const utilisateurController = require('./UtilisateurController');
const router = express.Router();

router.get('/', utilisateurController.getAllUtilisateurs);
router.post('/', utilisateurController.createUtilisateur);
router.get('/:id', utilisateurController.getUtilisateurById);
router.put('/:id', utilisateurController.updateUtilisateur);
router.delete('/:id', utilisateurController.deleteUtilisateur);

module.exports = router;