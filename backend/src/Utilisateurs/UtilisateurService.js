const Utilisateur = require('../models/UtilisateurModel');

exports.getAllUtilisateurs = async () => {
  return await Utilisateur.findAll();
};

exports.createUtilisateur = async (utilisateurData) => {
  // Ici, vous pouvez ajouter du code pour hacher le mot de passe avant de le stocker
  return await Utilisateur.create(utilisateurData);
};

exports.getUtilisateurById = async (id) => {
  return await Utilisateur.findByPk(id);
};

exports.updateUtilisateur = async (id, utilisateurData) => {
  // Ici, vous pouvez gérer la mise à jour du mot de passe, si nécessaire
  await Utilisateur.update(utilisateurData, {
    where: { id: id }
  });
  return await Utilisateur.findByPk(id);
};

exports.deleteUtilisateur = async (id) => {
  await Utilisateur.destroy({
    where: { id: id }
  });
};