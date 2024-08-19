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

exports.assignVelo = async (req, res) => {
  try {
    const { tourId } = req.params;
    const { veloId } = req.body;

    const trajet = await Trajet.findByPk(tourId, {
      include: [
        { model: Cycliste, as: 'Cycliste' },
        { model: Arret, as: 'DepartArret' },
        { model: Arret, as: 'ArriveeArret' }
      ]
    });
    const velo = await Velo.findByPk(veloId);

    if (!trajet || !velo) {
      return res.status(404).json({ message: 'Trajet ou vélo non trouvé.' });
    }

    trajet.veloId = velo.id;
    velo.statut = 'en_course';

    await trajet.save();
    await velo.save();

    res.status(200).json(trajet);
  } catch (error) {
    res.status(500).json({ message: error.message });
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