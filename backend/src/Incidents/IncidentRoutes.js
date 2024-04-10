const express = require('express');
const incidentController = require('./IncidentController');
const router = express.Router();

router.get('/incidents', incidentController.getAllIncidents);
router.post('/incidents', incidentController.createIncident);
router.get('/incidents/:id', incidentController.getIncidentById);
router.put('/incidents/:id', incidentController.updateIncident);
router.delete('/incidents/:id', incidentController.deleteIncident);

module.exports = router;