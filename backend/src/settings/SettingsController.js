const settingsService = require('./settingsService');

exports.getMode = async (req, res) => {
  try {
    const mode = await settingsService.getMode();
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
    await settingsService.setMode(mode);
    res.status(200).json({ message: `Mode mis à jour en ${mode}.` });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du mode:', error);
    res.status(500).json({ message: 'Erreur interne du serveur. Veuillez réessayer plus tard.' });
  }
};