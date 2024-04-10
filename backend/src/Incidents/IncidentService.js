const Incident = require('../models/IncidentModel');

exports.getAllIncidents = async () => {
  return await Incident.findAll();
};

exports.createIncident = async (incidentData) => {
  return await Incident.create(incidentData);
};

exports.getIncidentById = async (id) => {
  return await Incident.findByPk(id);
};

exports.updateIncident = async (id, incidentData) => {
  await Incident.update(incidentData, {
    where: { id: id }
  });
  return await Incident.findByPk(id);
};

exports.deleteIncident = async (id) => {
  return await Incident.destroy({
    where: { id: id }
  });
};