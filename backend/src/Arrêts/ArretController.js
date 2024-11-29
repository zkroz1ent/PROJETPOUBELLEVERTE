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

exports.getAllRuesEtArrets = async (req, res) => {
  try {
    const rues = await Rue.findAll({
      include: [{ model: Arret, as: 'arrets' }]
    });
    res.status(200).json(rues);
  } catch (error) {
    console.error('Erreur lors de la récupération des rues et des arrêts:', error);
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
exports.updateArretQuantiteDechets = async (req, res) => {
  try {
    const { arretId } = req.params;
    const { quantite_dechets } = req.body;

    if (quantite_dechets === undefined) {
      return res.status(400).json({ error: 'Le champ quantite_dechets est requis' });
    }

    const arret = await Arret.findByPk(arretId);
    if (!arret) {
      return res.status(404).json({ error: 'Arrêt non trouvé' });
    }

    arret.quantite_dechets = quantite_dechets;

    console.log(`Mise à jour de l'arrêt ${arretId}: quantite_dechets à ${quantite_dechets}`);
    await arret.save();

    res.status(200).json(arret);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la quantité de déchets de l\'arrêt :', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la quantité de déchets de l\'arrêt' });
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
exports.getUnassignedArrets = async (req, res) => {
  try {
    // Requérez tous les arrêts qui ne sont pas attribués (attribuer = false)
    const arretsNonAttribues = await Arret.findAll({
      where: { attribuer: false }
    });

    res.json(arretsNonAttribues);
  } catch (error) {
    console.error('Erreur lors de la récupération des arrêts non attribués :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des arrêts non attribués.' });
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
exports.updateArretquantitedechet = async (req, res) => {
  console.log("req");
  console.log(req.body);

  try {
    const arret = await Arret.findByPk(req.body.id);
    if (arret) {
      // Mise à jour de la quantité de déchets
      await arret.update({ quantite_dechets: req.body.quantite_dechets });
      res.status(200).send('Quantité de déchets mise à jour avec succès');
    } else {
      res.status(404).send('Arrêt non trouvé');
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'arrêt:', error);
    res.status(400).send(error.message);
  }
};

exports.updateArretStatus = async (req, res) => {

  console.log("dazdzadaz");
  console.log(res.req.params);
  const arretId = res.req.params.arretId;

  try {
    // Rechercher l'arrêt spécifique par son ID
    const arret = await Arret.findByPk(arretId);

    // Vérifier si l'arrêt existe
    if (!arret) {
      return res.status(404).json({ message: "Arrêt non trouvé" });
    }

    // Vérifier si l'arrêt n'est pas déjà attribué
    if (!arret.desservable) {
      console.log("dzadzad");
      await arret.update({ desservable: true });
      return res.json({
        message: "Arrêt mis à jour avec succès",
        arret: arret
      });
    }

    // Mettre à jour le statut de l'arrêt
    await arret.update({ desservable: false });

    res.json({
      message: "Arrêt mis à jour avec succès",
      arret: arret
    });

  } catch (error) {
    console.log(error);
    console.error('Erreur lors de la mise à jour de l\'arrêt :', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'arrêt' });
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