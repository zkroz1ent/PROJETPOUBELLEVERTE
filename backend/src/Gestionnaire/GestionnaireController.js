const { Velo, Trajet, Incident, Arret, Rue, Cycliste } = require('../../config/associations');

// Définir le nombre de vélos disponibles
exports.defineVelos = async (req, res) => {
  try {
    const { nombre } = req.body;
    let velos = await Velo.findAll();

    if (nombre > velos.length) {
      const diff = nombre - velos.length;
      for (let i = 0; diff > 0 && i < diff; i++) {
        await Velo.create({ statut: 'disponible' });
      }
    } else if (nombre < velos.length) {
      const diff = velos.length - nombre;
      const velosToDelete = velos.slice(-diff);
      for (const velo of velosToDelete) {
        await velo.destroy();
      }
    }

    velos = await Velo.findAll();
    res.status(200).json(velos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Visualiser les flottes de vélos sur un plan de la ville
exports.getFleets = async (req, res) => {
  try {
    const velos = await Velo.findAll();
    res.status(200).json(velos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Gérer des tournées
exports.getTours = async (req, res) => {
  try {
    const trajets = await Trajet.findAll({
      include: [
        { model: Cycliste, as: 'Cycliste' },
        { model: Arret, as: 'DepartArret' },
        { model: Arret, as: 'ArriveeArret' }
      ]
    });
    res.status(200).json(trajets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.assignVeloToAllToursOfCyclist = async (req, res) => {
  try {
    const { cyclisteId } = req.params;
    const { veloId } = req.body;

    // Vérifiez si le vélo existe
    const velo = await Velo.findByPk(veloId);
    if (!velo) {
      return res.status(404).json({ message: 'Vélo non trouvé.' });
    }

    // Mettre à jour le vélo pour tous les trajets de ce cycliste
    const [updated] = await Trajet.update({ veloId }, {
      where: { cyclisteId }
    });

    if (!updated) {
      return res.status(404).json({ message: 'Aucun trajet trouvé pour le cycliste.' });
    }

    velo.statut = 'en_course';
    await velo.save();

    res.status(200).json({ message: `Vélo ${veloId} assigné à tous les trajets du cycliste ${cyclisteId}.` });
  } catch (error) {
    console.error('Erreur lors de l\'attribution du vélo à tous les trajets:', error);
    res.status(500).json({ message: 'Erreur lors de l\'attribution du vélo.' });
  }
};

// Optimiser les tournées
exports.optimizeTours = async (req, res) => {
  try {
    // Implémenter la logique d'optimisation des trajets en fonction des incidents ou des problèmes de ressources
    res.status(200).json({ message: 'Optimisation des tournées.' });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'optimisation des tournées." });
  }
};

// Ajouter des incidents
exports.addIncident = async (req, res) => {
  try {
    const { type, description, veloId } = req.body;
    const incident = await Incident.create({ type, description, veloId });
    res.status(201).json(incident);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'ajout de l'incident." });
  }
};

// Visualiser les rues traitées ou non, liste des arrêts
exports.visualizeStreets = async (req, res) => {
  try {
    const rues = await Rue.findAll();
    res.status(200).json(rues);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la visualisation des rues." });
  }
};

exports.visualizeStops = async (req, res) => {
  try {
    const arrets = await Arret.findAll();
    res.status(200).json(arrets);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la visualisation des arrêts." });
  }
};