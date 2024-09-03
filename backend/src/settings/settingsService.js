const Settings = require('./settingsModel');

exports.getMode = async () => {
  try {
    const setting = await Settings.findOne({ where: { id: 1 } });
    if (!setting) {
      throw new Error('No settings found for ID: 1');
    }
    return setting.modeActuelle;
  } catch (error) {
    console.error('Erreur lors de la récupération du mode:', error);
    // Relance l’erreur pour être attrapée dans le contrôleur
    throw error;
  }
};

exports.setMode = async (isWinterMode) => {
    try {
  
      console.log(isWinterMode);
  
      const [setting, created] = await Settings.findOrCreate({
        where: { id: 1 },
        defaults: { modeActuelle: isWinterMode }
      });
  
      if (!created) {
        setting.modeActuelle = isWinterMode;
        await setting.save();
      }
  
      return true;
    } catch (error) {
      // console.error('Erreur lors de la mise à jour du mode:', error.log);
      // throw error;
    }
  };