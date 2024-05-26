const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Utilisateur = require('./UtilisateurModel');

exports.register = async (req, res) => {
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    const utilisateur = await Utilisateur.create({
      nom: req.body.nom,
      email: req.body.email,
      hash_mot_de_passe: hashedPassword,
      role: req.body.role,
    });
    res.status(201).json(utilisateur);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {

  console.log(req.body);

  // console.log(res);

  try {
    const utilisateur = await Utilisateur.findOne({ where: { email: req.body.email } });
    console.log(utilisateur);
    if (!utilisateur) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordIsValid = bcrypt.compareSync(req.body.password, utilisateur.hash_mot_de_passe);
    if (!passwordIsValid) {
      return res.status(401).json({ token: null, message: 'Invalid password' });
    }

    const token = jwt.sign({ id: utilisateur.id }, process.env.JWT_SECRET, {
      expiresIn: 86400 // 24 hours
    });

    res.status(200).json({
      user: {
        id: utilisateur.id,
        nom: utilisateur.nom,
        email: utilisateur.email,
        role: utilisateur.role
      },
      token: token
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
exports.getAllCyclistes = async (req, res) => {
  try {
    const cyclistes = await Utilisateur.findAll({
      where: { role: 'cycliste' }
    });
    res.json(cyclistes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.profile = async (req, res) => {
  res.status(200).json(req.utilisateur);
};

// Ajouter les fonctions de contrôleur spécifiques avec des vérifications de rôle
exports.adminPanel = async (req, res) => {
  res.status(200).json({ message: 'Welcome to admin panel' });
};


exports.getAllUtilisateurs = async (req, res) => {
  try {
    const utilisateurs = await Utilisateur.findAll();
    res.json(utilisateurs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createUtilisateur = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.create(req.body);
    res.status(201).json(utilisateur);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateUtilisateur = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.update(req.body, {
      where: { id: req.params.id }
    });
    res.json(utilisateur);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteUtilisateur = async (req, res) => {
  try {
    await Utilisateur.destroy({
      where: { id: req.params.id }
    });
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};