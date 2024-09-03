const express = require('express');
const { verifyToken, verifyRole } = require('../middlewares/auth.middleware');
const {
  defineVelos, getFleets, getTours, assignVelo, optimizeTours,
  addIncident, visualizeStreets, visualizeStops,assignVeloToAllToursOfCyclist
} = require('./GestionnaireController');

const router = express.Router();

// Authentification gestionnaire

// Définir le nombre de vélos disponibles
router.put('/velos', defineVelos);

// Visualiser les flottes de vélos
router.get('/fleets', getFleets);

// Gérer des tournées
router.get('/tours', getTours);
router.post('/assignVeloToAll/:cyclisteId', assignVeloToAllToursOfCyclist);
// Optimiser les tournées
router.post('/optimize', optimizeTours);

// Ajouter des incidents
router.post('/incidents', addIncident);

// Visualiser les rues et arrêts
router.get('/streets', visualizeStreets);
router.get('/stops', visualizeStops);

module.exports = router;