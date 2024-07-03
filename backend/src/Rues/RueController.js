const Rue = require('../Rues/RueModel');

exports.getAllRues = async (req, res) => {
  try {
    const rues = await Rue.findAll();
    res.json(rues);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des rues' });
  }
};

exports.createRue = async (req, res) => {
  try {
    const newRue = await Rue.create(req.body);
    res.status(201).json(newRue);
  } catch (error) {
    console.error('Erreur lors de la création de la rue:', error);
    res.status(400).send(error.message);
  }
};

exports.getRueById = async (req, res) => {
  try {
    const rue = await Rue.findByPk(req.params.id);
    if (rue) {
      res.json(rue);
    } else {
      res.status(404).send('Rue non trouvée');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de la rue:', error);
    res.status(500).send(error.message);
  }
};

exports.updateRue = async (req, res) => {
  try {
    const rue = await Rue.findByPk(req.params.id);
    if (rue) {
      await rue.update(req.body);
      res.json(rue);
    } else {
      res.status(404).send('Rue non trouvée');
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la rue:', error);
    res.status(400).send(error.message);
  }
};

exports.deleteRue = async (req, res) => {
  try {
    const rue = await Rue.findByPk(req.params.id);
    if (rue) {
      await rue.destroy();
      res.status(200).send('Rue supprimée avec succès');
    } else {
      res.status(404).send('Rue non trouvée');
    }
  } catch (error) {
    console.error('Erreur lors de la suppression de la rue:', error);
    res.status(500).send(error.message);
  }
};