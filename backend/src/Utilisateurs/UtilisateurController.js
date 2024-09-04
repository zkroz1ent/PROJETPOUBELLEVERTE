const Utilisateur = require('./UtilisateurModel');
const Cycliste = require('../Cyclistes/CyclisteModel');
const Trajet = require('../Trajets/TrajetModel');
const Arret = require('../Arrêts/ArretModel');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    const utilisateur = await Utilisateur.create({
      nom: req.body.nom,
      email: req.body.email,
      hash_mot_de_passe: hashedPassword,
      role: req.body.role,
    });

    if (req.body.role == 'cycliste') {

      // Cycliste.find({where { email: req.body.email},  returning: true });
      console.log("ddzdezdzdzzdzdz");
      console.log(req.body);



      try {
        const test = await Cycliste.create({
          nom: req.body.nom,
          prenom: req.body.prenom,

          email: req.body.email,
          hash_mot_de_passe: hashedPassword,
          // telephone: req.body.telephone,
          statut: 'actif',
          role: req.body.role,
        });



      } catch (error) {
        console.log("guuuuuuuuuuuuuuuuuuuuu")
        res.status(500).json({ message: error.message });

        console.log(error);
      }





    }
    res.status(201).json(utilisateur);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findOne({ where: { email: req.body.email } });
    let cyclist
    if (utilisateur.role == "cycliste") {
      cyclist = await Cycliste.findOne({ where: { email: req.body.email } });
    }
    console.log();
    if (!utilisateur) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordIsValid = bcrypt.compareSync(req.body.password, utilisateur.hash_mot_de_passe);
    if (!passwordIsValid) {
      return res.status(401).json({ token: null, message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: utilisateur.id, role: utilisateur.role },
      process.env.JWT_SECRET,
      { expiresIn: '86400s' } // 24 hours
    );

    let user = {
      id: utilisateur.id,
      nom: utilisateur.nom,
      email: utilisateur.email,
      role: utilisateur.role
    };

    if (utilisateur.role === 'cycliste') {
      user.cyclisteID = cyclist.dataValues.id || '';
    }

    res.status(200).json({
      user: user,
      token: token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.profile = async (req, res) => {
  res.status(200).json(req.utilisateur);
};

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

exports.getUtilisateurById = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findByPk(req.params.id);
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
    res.json(utilisateur);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.updateUtilisateurStatus = async (req, res) => {
  try {
    const { id, newStatus } = req.body;

    const utilisateur = await Utilisateur.findByPk(id);
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    utilisateur.status = newStatus;
    await utilisateur.save();

    // Si l'utilisateur est marqué comme malade, modifiez ses trajets et arrêts
    if (newStatus === 'maladie') {
      // Supprimez les trajets et mettez à jour les arrêts attribués
      const trajets = await Trajet.findAll({ where: { cyclisteId: id } });

      for (const trajet of trajets) {
        // Marquez les arrêts de départ et d'arrivée comme non attribués
        const departArret = await Arret.findByPk(trajet.depart);
        const arriveeArret = await Arret.findByPk(trajet.arrivee);

        if (departArret) {
          departArret.attribuer = false;
          await departArret.save();
        }
        if (arriveeArret) {
          arriveeArret.attribuer = false;
          await arriveeArret.save();
        }

        // Supprimez le trajet
        await trajet.destroy();
      }

      res.status(200).json({ message: 'Statut de l\'utilisateur mis à jour, trajets supprimés et arrêts réinitialisés.' });
    } else {
      res.status(200).json({ message: 'Statut de l\'utilisateur mis à jour avec succès.' });
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du statut de l\'utilisateur.' });
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


