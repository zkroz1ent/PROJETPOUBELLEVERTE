const incidentService = require('../services/IncidentService');

exports.getAllIncidents = async (req, res) => {
  try {
    const incidents = await incidentService.getAllIncidents();
    res.status(200).json(incidents);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.createIncident = async (req, res) => {
  try {
    const incident = await incidentService.createIncident(req.body);
    res.status(201).json(incident);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.getIncidentById = async (req, res) => {
  try {
    const incident = await incidentService.getIncidentById(req.params.id);
    if (incident) {
      res.status(200).json(incident);
    } else {
      res.status(404).send('Incident not found.');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.updateIncident = async (req, res) => {
  try {
    const updatedIncident = await incidentService.updateIncident(req.params.id, req.body);
    res.status(200).json(updatedIncident);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.deleteIncident = async (req, res) => {
  try {
    await incidentService.deleteIncident(req.params.id);
    res.status(200).send('Incident deleted successfully.');
  } catch (error) {
    res.status(500).send(error.message);
  }
};