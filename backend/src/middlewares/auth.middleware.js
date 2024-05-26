const jwt = require('jsonwebtoken');
const Utilisateur = require('../Utilisateurs/UtilisateurModel');

const verifyToken = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    const utilisateur = await Utilisateur.findByPk(req.userId);
    if (!utilisateur) {
      return res.status(404).json({ message: 'User not found' });
    }
    req.utilisateur = utilisateur;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

const verifyRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.utilisateur.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient rights' });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  verifyRole
};