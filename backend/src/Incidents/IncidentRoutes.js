const express = require('express');
const incidentController = require('./IncidentController');
const router = express.Router();

router.get('/', incidentController.getAllIncidents);
router.post('/', incidentController.createIncident);
router.get('/:id', incidentController.getIncidentById);
router.put('/:id', incidentController.updateIncident);
router.delete('/:id', incidentController.deleteIncident);

module.exports = router;