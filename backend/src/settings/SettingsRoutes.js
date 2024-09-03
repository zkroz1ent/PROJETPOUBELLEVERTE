const express = require('express');
const router = express.Router();
const settingsController = require('./SettingsController');

// Route pour obtenir le mode actuel
router.get('/mode', settingsController.getMode);

// Route pour mettre à jour le mode actuel
router.post('/mode', settingsController.setMode);

module.exports = router;