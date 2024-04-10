const utilisateurService = require('./UtilisateurService');

exports.getAllUtilisateurs = async (req, res) => {
  try {
    const utilisateurs = await utilisateurService.getAllUtilisateurs();
    res.json(utilisateurs);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.createUtilisateur = async (req, res) => {
  try {
    const utilisateur = await utilisateurService.createUtilisateur(req.body);
    res.status(201).json(utilisateur);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.getUtilisateurById = async (req, res) => {
  try {
    const utilisateur = await utilisateurService.getUtilisateurById(req.params.id);
    if (utilisateur) {
      res.json(utilisateur);
    } else {
      res.status(404).send('Utilisateur not found.');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.updateUtilisateur = async (req, res) => {
  try {
    const updatedUtilisateur = await utilisateurService.updateUtilisateur(req.params.id, req.body);
    res.json(updatedUtilisateur);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.deleteUtilisateur = async (req, res) => {
  try {
    await utilisateurService.deleteUtilisateur(req.params.id);
    res.status(200).send('Utilisateur deleted successfully.');
  } catch (error) {
    res.status(500).send(error.message);
  }
};