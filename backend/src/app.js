const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('../config/database'); // Assurez-vous que le chemin est correct

// Routes
const cyclisteRoutes = require('./Cyclistes/CyclisteRoutes');
const veloRoutes = require('./Velos/VeloRoutes');
const trajetRoutes = require('./Trajets/TrajetRoutes');
const incidentRoutes = require('./Incidents/IncidentRoutes');
const utilisateurRoutes = require('./Utilisateurs/UtilisateurRoutes');
const arretRoutes = require('./Arrêts/ArretRoutes');

const app = express();

// Utiliser bodyParser pour parser les requêtes entrantes en JSON
app.use(bodyParser.json());

// Configurer CORS pour permettre des requêtes cross-origin
app.use(cors());

// Ajouter les routes à l'application
app.use('/cyclistes', cyclisteRoutes);
app.use('/velos', veloRoutes);
app.use('/trajets', trajetRoutes);
app.use('/incidents', incidentRoutes);
app.use('/utilisateurs', utilisateurRoutes);
app.use('/arrets', arretRoutes);

// Synchroniser les modèles Sequelize avec la base de données
sequelize.sync().then(() => {
  console.log("Database synced");
}).catch((error) => {
  console.log("Error syncing database: ", error);
});

// Configurer le serveur pour écouter sur le port spécifié
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});