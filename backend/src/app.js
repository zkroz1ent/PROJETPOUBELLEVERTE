const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('../config/database'); // Assurez-vous que le chemin est correct
const insertData = require('./services/InsertService');  // Import correct
require('dotenv').config();

// Routes
const cyclisteRoutes = require('./Cyclistes/CyclisteRoutes');
const veloRoutes = require('./Velos/VeloRoutes');
const trajetRoutes = require('./Trajets/TrajetRoutes');
const incidentRoutes = require('./Incidents/IncidentRoutes');
const utilisateurRoutes = require('./Utilisateurs/UtilisateurRoutes');
const arretRoutes = require('./Arrêts/ArretRoutes');
const ramassageRoutes=require('./ramassages/ramassageRoutes');

const app = express();

// Utiliser bodyParser pour parser les requêtes entrantes en JSON
app.use(bodyParser.json());

// Configurer CORS pour permettre des requêtes cross-origin
app.use(cors({
  origin: '*', // Permettre à toutes les origines d'envoyer des requêtes
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Permettre toutes les méthodes
  preflightContinue: false, // Pas besoin de continuer la chaîne de middleware après
  optionsSuccessStatus: 204 // Le statut retourné sur les requêtes de pré-vérification (preflight)
}));

// Ajouter les routes à l'application
app.use('/cyclistes', cyclisteRoutes);
app.use('/velos', veloRoutes);
app.use('/trajets', trajetRoutes);
app.use('/incidents', incidentRoutes);
app.use('/utilisateurs', utilisateurRoutes);
app.use('/arrets', arretRoutes);
app.use('/ramassage', ramassageRoutes);

// Middleware global pour la gestion des erreurs
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Synchroniser les modèles Sequelize avec la base de données et insérer les données initiales
sequelize.sync({ force: true }).then(async () => {
  console.log("Database synced.");
  await insertData();  // Insérer les données initiales
}).catch(error => {
  console.error("Erreur lors de la synchronisation de la base de données :", error);
});

// Configurer le serveur pour écouter sur le port spécifié
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});