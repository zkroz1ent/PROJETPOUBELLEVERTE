const settingsService = require('./settingsService');
const Settings = require('./SettingsModel');
exports.getMode = async (req, res) => {
  try {
    // Supposons qu'il n'y ait qu'un seul enregistrement Settings (paramétrage global)
    const setting = await Settings.findOne({
      where: { id: 1 } // ou autrement spécifiez la condition pertinente pour votre configuration
    });

    if (!setting) {
      return res.status(404).json({ message: "Paramètres non trouvés." });
    }

    // Convertir le booléen en une chaîne lisible
    const mode = setting.modeActuelle ? 'winter' : 'summer';

    res.status(200).json({ mode });
  } catch (error) {
    console.error('Erreur lors de l\'obtention du mode:', error.message);
    res.status(500).json({ message: 'Erreur interne du serveur. Veuillez réessayer plus tard.' });
  }
};

exports.setMode = async (req, res) => {
  try {
    const { mode } = req.body;
    if (!['winter', 'summer'].includes(mode)) {
      return res.status(400).json({ message: "Mode invalide, doit être 'winter' ou 'summer'." });
    }

    // Convertir 'summer'/'winter' en booléen
    const modeBool = mode === 'winter'; // 'winter' devient true, 'summer' devient false

    // Mettre à jour la configuration du mode dans la base de données
    await Settings.update({ modeActuelle: modeBool }, {
      where: { id: 1 } // Vérifiez la manière dont l'enregistrement de votre mode est géré. Ici, on assume qu'il y a un seul enregistrement global.
    });

    res.status(200).json({ message: `Mode mis à jour en ${mode}.` });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du mode:', error);
    res.status(500).json({ message: 'Erreur interne du serveur. Veuillez réessayer plus tard.' });
  }
};