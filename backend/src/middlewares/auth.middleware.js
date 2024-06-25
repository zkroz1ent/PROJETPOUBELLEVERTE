const jwt = require('jsonwebtoken');
const Utilisateur = require('../Utilisateurs/UtilisateurModel');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;  // Inclure le rôle de l'utilisateur
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
  console.log("roles");
  console.log(roles);

  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({ message: 'Forbidden: insufficient rights' });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  verifyRole
};