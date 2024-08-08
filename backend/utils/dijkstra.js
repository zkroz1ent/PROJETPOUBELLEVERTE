const PriorityQueue = require('./priorityQueue.js');
const dijkstra = (graph, startNode, endNode) => {
    console.log(`Running Dijkstra from ${startNode} to ${endNode}`);
  
    const nodes = graph.getNodes();
    const distances = {};
    const previous = {};
    const pq = new PriorityQueue();
  
    // Initialisation des distances et de la file de priorité
    for (let node in nodes) {
      if (node === String(startNode)) {
        distances[node] = 0;
        pq.enqueue([node, 0]);
      } else {
        distances[node] = Infinity;
      }
      previous[node] = null;
    }
  
    while (!pq.isEmpty()) {
      const [currentNode, currentDistance] = pq.dequeue();
      console.log(`Visiting node ${currentNode} with current distance ${currentDistance}`);
  
      // Si l'on arrive au nœud de destination
      if (currentNode === String(endNode)) {
        const path = [];
        let tempNode = currentNode;
        while (previous[tempNode]) {
          path.push(tempNode);
          tempNode = previous[tempNode];
        }
        path.push(String(startNode));
        return path.reverse();
      }
  
      // Mise à jour des distances des voisins
      for (let neighbour in nodes[currentNode]) {
        const alt = distances[currentNode] + nodes[currentNode][neighbour];
  
        if (alt < distances[neighbour]) {
          distances[neighbour] = alt;
          previous[neighbour] = currentNode;
          pq.enqueue([neighbour, alt]);
        }
      }
      console.log(`Current distances: ${JSON.stringify(distances)}`);
      console.log(`Current previous nodes: ${JSON.stringify(previous)}`);
    }
  
    console.log('No path found');
    return [];
  };
  
  module.exports = dijkstra;