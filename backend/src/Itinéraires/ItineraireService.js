const Graph = require('../../structures/graph');
const dijkstra = require('../../utils/dijkstra');
const { Arret, Rue } = require('../../config/associations');

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

exports.calculateOptimalRoute = async (depart, arrivee) => {
  try {
    const graph = new Graph();
    const arrets = await Arret.findAll({ where: { desservable: true } });
    const rues = await Rue.findAll();

    // Identifier l'arrêt "Porte d'Ivry"
    const recyclage = arrets.find(arret => arret.id === 300 || arret.id === 50 );
    if (!recyclage) {
      throw new Error('Arret Porte d\'Ivry non trouvé.');
    }
    console.log(recyclage);
    
    const recyclageCoordinates = JSON.parse(recyclage.coordinates);

    console.log("Start Coordinates: ", depart);
    console.log("End Coordinates: ", arrivee);
    console.log("Recyclage Coordinates (Porte d'Ivry):", recyclageCoordinates);

    const mapArrets = {};
    arrets.forEach(arret => {
      const coord = JSON.parse(arret.coordinates);
      mapArrets[arret.id] = { ...coord, id: arret.id, name: arret.nom, rueId: arret.rueId };
    });

    // Ajouter les intersections basées sur les arrêts et rues
    rues.forEach(rue => {
      const arretsRue = arrets.filter(arret => arret.rueId === rue.id).map(arret => arret.id);
      for (let i = 0; i < arretsRue.length - 1; i++) {
        const arret1 = mapArrets[arretsRue[i]];
        const arret2 = mapArrets[arretsRue[i + 1]];
        const distance = haversine(arret1.lat, arret1.lon, arret2.lat, arret2.lon);

        if (distance > 0 && !isNaN(distance)) {
          // console.log(`Adding edge between Arret ${arret1.id} and Arret ${arret2.id} with distance ${distance}`);
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
            // console.log(`Adding intersection edge between Arret ${arret1.id} and Arret ${arret2.id} with distance ${distance}`);
            graph.addEdge(arret1.id, arret2.id, distance);
          }
        }
      }
    });

    // Ajouter les noeuds virtuels pour les coordonnées entrées directement
    const departId = 'depart';
    const arriveeId = 'arrivee';
    const recyclageId = 'recyclage';

    graph.addNode(departId);
    graph.addNode(arriveeId);
    graph.addNode(recyclageId);

    // Ajouter les distances vers et depuis le point de recyclage
    arrets.forEach(arret => {
      const coord = JSON.parse(arret.coordinates);
      const distanceStart = haversine(depart.lat, depart.lon, coord.lat, coord.lon);
      const distanceEnd = haversine(arrivee.lat, arrivee.lon, coord.lat, coord.lon);
      const distanceRecyclage = haversine(recyclageCoordinates.lat, recyclageCoordinates.lon, coord.lat, coord.lon);

      if (distanceStart > 0 && !isNaN(distanceStart)) {
        graph.addEdge(departId, arret.id, distanceStart);
      }
      if (distanceEnd > 0 && !isNaN(distanceEnd)) {
        graph.addEdge(arret.id, arriveeId, distanceEnd);
      }
      if (distanceRecyclage > 0 && !isNaN(distanceRecyclage)) {
        graph.addEdge(recyclageId, arret.id, distanceRecyclage);
        graph.addEdge(arret.id, recyclageId, distanceRecyclage);
      }
    });

    // Algorithme pour trouver le chemin le plus court vers et depuis la déchèterie
    const pathToRecyclage = dijkstra(graph, departId, recyclageId);
    const pathFromRecyclage = dijkstra(graph, recyclageId, arriveeId);

    console.log("Shortest Path to Recyclage:", pathToRecyclage);
    console.log("Shortest Path from Recyclage:", pathFromRecyclage);

    return { toRecyclage: pathToRecyclage, fromRecyclage: pathFromRecyclage };
  } catch (error) {
    console.error('Erreur lors du calcul de l\'itinéraire :', error);
    throw new Error('Erreur lors du calcul de l\'itinéraire');
  }
};