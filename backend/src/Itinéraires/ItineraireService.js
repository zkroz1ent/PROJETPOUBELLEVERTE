const Graph = require('../../structures/graph');
const dijkstra = require('../../utils/dijkstra');
const { Arret, Rue } = require('../../config/associations');

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lat2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLon / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

exports.calculateOptimalRoute = async (departId, arriveeId) => {
  try {
    const graph = new Graph();
    const arrets = await Arret.findAll();
    const rues = await Rue.findAll();

    // Mise en tableau des arrêts avec les rues (uniquement les desservables)
    const mapArrets = {};
    arrets.forEach(arret => {
      if (arret.desservable) {  // On ne prend que les arrêts desservables
        const coord = JSON.parse(arret.coordinates);
        mapArrets[arret.id] = { ...coord, id: arret.id, name: arret.nom, rueId: arret.rueId };
      }
    });

    // Connecter les arrêts séquentiellement par la rue
    rues.forEach(rue => {
      const arretsRue = arrets.filter(arret => 
        arret.rueId === rue.id && arret.desservable)  // Filtrer les arrêts desservables
        .sort((a, b) => a.id - b.id);
      
      for (let i = 0; i < arretsRue.length - 1; i++) {
        const arret1 = mapArrets[arretsRue[i].id];
        const arret2 = mapArrets[arretsRue[i + 1].id];
        const distance = haversine(arret1.lat, arret1.lon, arret2.lat, arret2.lon);
        graph.addEdge(arret1.id, arret2.id, distance);
      }
    });

    // Ajouter des connexions aux points d'intersection
    const intersections = {};
    arrets.forEach(arret => {
      if (arret.desservable) {  // Ne considérer que les arrêts desservables
        if (!intersections[arret.nom]) {
          intersections[arret.nom] = [];
        }
        intersections[arret.nom].push(arret.id);
      }
    });

    Object.values(intersections).forEach(ids => {
      for (let i = 0; i < ids.length - 1; i++) {
        for (let j = i + 1; j < ids.length; j++) {
          const arret1 = mapArrets[ids[i]];
          const arret2 = mapArrets[ids[j]];
          if (arret1 && arret2) {
            const distance = haversine(arret1.lat, arret1.lon, arret2.lat, arret2.lon);
            graph.addEdge(arret1.id, arret2.id, distance);
          }
        }
      }
    });

    const optimalPath = dijkstra(graph, String(departId), String(arriveeId));

    if (optimalPath.length === 0) {
      console.error('No path found');
    } else {
      console.log(`Itinéraire optimal trouvé de ${departId} à ${arriveeId}: ${optimalPath.join(' -> ')}`);
    }

    return optimalPath;
  } catch (error) {
    console.error('Erreur lors du calcul de l\'itinéraire :', error);
    throw new Error('Erreur lors du calcul de l\'itinéraire');
  }
};