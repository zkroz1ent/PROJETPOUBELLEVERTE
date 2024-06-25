const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('../config/database'); // Assurez-vous que le chemin est correct
const insertData = require('./services/InsertService');  // Chemin correct pour l'import
require('dotenv').config();

// Routes
const cyclisteRoutes = require('./Cyclistes/CyclisteRoutes');
const veloRoutes = require('./Velos/VeloRoutes');
const trajetRoutes = require('./Trajets/TrajetRoutes');
const incidentRoutes = require('./Incidents/IncidentRoutes');
const utilisateurRoutes = require('./Utilisateurs/UtilisateurRoutes');
const arretRoutes = require('./Arrêts/ArretRoutes');
const ramassageRoutes = require('./ramassages/ramassageRoutes');

const app = express();

// Utiliser bodyParser pour parser les requêtes entrantes en JSON
app.use(bodyParser.json());

// Configurer CORS pour permettre des requêtes cross-origin
app.use(cors({
  origin: '*', // Permet les requêtes de toutes les origines. Pour des raisons de sécurité, restreignez à votre domaine en production.
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true  // Si vos requêtes nécessitent des informations d'identification
}));

// Ajouter les routes à l'application et appliquer le middleware de vérification des tokens et des rôles
app.use('/cyclistes', cyclisteRoutes);
app.use('/velos', veloRoutes);
app.use('/trajets', trajetRoutes);
app.use('/incidents', incidentRoutes);
app.use('/utilisateurs', utilisateurRoutes);
app.use('/arrets', arretRoutes);
app.use('/ramassage', ramassageRoutes);

// Middleware global pour la gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Synchroniser les modèles Sequelize avec la base de données et insérer les données initiales
// sequelize.sync({ force: true }).then(async () => {
//   console.log("Database synced.");
//   await insertData();  // Insérer les données initiales
// }).catch(error => {
//   console.error("Erreur lors de la synchronisation de la base de données :", error);
// });

// Configurer le serveur pour écouter sur le port spécifié
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});