const Graph = require('../../structures/graph');
const dijkstra = require('../../utils/dijkstra');
const { Arret, Rue, Velo } = require('../../config/associations');

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLon / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance en km
  return distance;
}

exports.calculateOptimalRoute = async (departId, arriveeId) => {
  try {
    const graph = new Graph();
    const arrets = await Arret.findAll({ where: { desservable: true } });
    const rues = await Rue.findAll();

    console.log("Arrets:", arrets.map(arret => ({ id: arret.id, coordinates: arret.coordinates })));
    console.log("Rues:", rues);

    const mapArrets = {};
    arrets.forEach(arret => {
      const coord = JSON.parse(arret.coordinates);
      mapArrets[arret.id] = { ...coord, id: arret.id, name: arret.nom, rueId: arret.rueId };
    });

    // Ajouter les intersections sur la base des arrêts et rues
    rues.forEach(rue => {
      const arretsRue = arrets.filter(arret => arret.rueId === rue.id).map(arret => arret.id);
      for (let i = 0; i < arretsRue.length - 1; i++) {
        const arret1 = mapArrets[arretsRue[i]];
        const arret2 = mapArrets[arretsRue[i + 1]];
        const distance = haversine(arret1.lat, arret1.lon, arret2.lat, arret2.lon);

        if (distance > 0 && !isNaN(distance)) {
          console.log(`Adding edge between Arret ${arret1.id} and Arret ${arret2.id} with distance ${distance}`);
          graph.addEdge(arret1.id, arret2.id, distance);
        }
      }
    });

    // Traiter les intersections (points où les arrêts partagent le même nom)
    const intersections = {};
    arrets.forEach(arret => {
      if (!intersections[arret.nom]) {
        intersections[arret.nom] = [];
      }
      intersections[arret.nom].push(arret.id);
    });

    Object.values(intersections).forEach(ids => {
      for (let i = 0; i < ids.length - 1; i++) {
        for (let j = i + 1; j < ids.length; j++) {
          const arret1 = mapArrets[ids[i]];
          const arret2 = mapArrets[ids[j]];
          if (arret1 && arret2) {
            const distance = haversine(arret1.lat, arret1.lon, arret2.lat, arret2.lon);
            console.log(`Adding intersection edge between Arret ${arret1.id} and Arret ${arret2.id} with distance ${distance}`);
            graph.addEdge(arret1.id, arret2.id, distance);
          }
        }
      }
    });

    const optimalPath = dijkstra(graph, String(departId), String(arriveeId));
    console.log("Optimal Path:", optimalPath);

    return optimalPath;
  } catch (error) {
    console.error('Erreur lors du calcul de l\'itinéraire :', error);
    throw new Error('Erreur lors du calcul de l\'itinéraire');
  }
};

// Vérification de l'autonomie et redirection éventuelle vers la déchèterie
exports.verifyAndRedirect = async (trajet) => {
  try {
    const { depart, arrivee, veloId } = trajet;
    const departArret = await Arret.findByPk(depart);
    const arriveeArret = await Arret.findByPk(arrivee);
    const velo = await Velo.findByPk(veloId);

    if (!departArret || !arriveeArret || !velo) {
      throw new Error('Informations de départ, d\'arrivée ou de vélo incorrectes.');
    }

    const distance = haversine(departArret.lat, departArret.lon, arriveeArret.lat, arriveeArret.lon);

    if (velo.autonomie_restante < distance) {
      // Recalculer le trajet pour retourner à la déchèterie
      const recyclageX = 48.8566; // Lat of Recyclage (Paris exemple)
      const recyclageY = 2.3522;  // Lon of Recyclage (Paris exemple)
      const distanceRetour = haversine(departArret.lat, departArret.lon, recyclageX, recyclageY);
      const distanceAller = haversine(recyclageX, recyclageY, arriveeArret.lat, arriveeArret.lon);
      const newDistanceTotal = distanceRetour + distanceAller;

      if (velo.autonomie_restante < newDistanceTotal) {
        throw new Error(`L'autonomie restante du vélo (${velo.autonomie_restante}km) est insuffisante pour parcourir la distance totale (${newDistanceTotal}km). Veuillez recharger ou changer de vélo.`);
      }

      // Mettre à jour les coordonnées de départ et d'arrivée
      trajet.depart = depart;
      trajet.departX = recyclageX;
      trajet.departY = recyclageY;
      trajet.arrivee = arrivee;
      trajet.arriveeX = recyclageX;
      trajet.arriveeY = recyclageY;
    }

    return true;
  } catch (error) {
    console.error('Erreur lors du calcul de l\'itinéraire :', error);
    throw new Error('Erreur lors de la vérification des trajets');
  }
};