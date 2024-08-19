const Arret = require('./ArretModel');
const Rue = require('../Rues/RueModel');

exports.getAllArrets = async (req, res) => {
  try {
    const arrets = await Arret.findAll();
    res.json(arrets);
  } catch (error) {
    console.error('Erreur lors de la récupération des arrêts:', error);
    res.status(500).send(error.message);
  }
};
exports.getNonDesservisArrets = async (req, res) => {
  try {
    const arrets = await Arret.findAll({
      where: { desservable: false },
      include: [{ model: Rue, as: 'Rue' }]  // Assurez-vous que l'alias 'Rue' est correct
    });
    res.status(200).json(arrets);
  } catch (error) {
    console.error('Erreur lors de la récupération des arrêts non desservis :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des arrêts non desservis' });
  }
};
exports.updateArretStatus = async (req, res) => {
  try {
    const { arretId } = req.params;
    const { desservable } = req.body;

    if (desservable === undefined) {
      return res.status(400).json({ error: 'Le champ desservable est requis' });
    }

    const arret = await Arret.findByPk(arretId);
    if (!arret) {
      return res.status(404).json({ error: 'Arrêt non trouvé' });
    }

    arret.desservable = desservable;

    // Ajout de logs pour le débogage
    console.log(`Mise à jour de l'arrêt ${arretId} à desservable: ${desservable}`);

    await arret.save();

    res.status(200).json(arret);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'arrêt :', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'arrêt' });
  }
};
exports.createArret = async (req, res) => {
  try {
    const newArret = await Arret.create(req.body);
    res.status(201).json(newArret);
  } catch (error) {
    console.error('Erreur lors de la création de l\'arrêt:', error);
    res.status(400).send(error.message);
  }
};

exports.getArretById = async (req, res) => {
  try {
    const arret = await Arret.findByPk(req.params.id);
    if (arret) {
      res.json(arret);
    } else {
      res.status(404).send('Arrêt non trouvé');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'arrêt:', error);
    res.status(500).send(error.message);
  }
};

exports.updateArret = async (req, res) => {
  try {
    const arret = await Arret.findByPk(req.params.id);
    if (arret) {
      await arret.update(req.body);
      res.json(arret);
    } else {
      res.status(404).send('Arrêt non trouvé');
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'arrêt:', error);
    res.status(400).send(error.message);
  }
};

exports.deleteArret = async (req, res) => {
  try {
    const arret = await Arret.findByPk(req.params.id);
    if (arret) {
      await arret.destroy();
      res.status(200).send('Arrêt supprimé avec succès');
    } else {
      res.status(404).send('Arrêt non trouvé');
    }
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'arrêt:', error);
    res.status(500).send(error.message);
  }
};