class Graph {
    constructor() {
      this.nodes = {};
    }
  
    addNode(node) {
      if (!this.nodes[node]) {
        this.nodes[node] = {};
      }
    }
  
    addEdge(node1, node2, weight) {
      if (!this.nodes[node1]) {
        this.addNode(node1);
      }
      if (!this.nodes[node2]) {
        this.addNode(node2);
      }
      this.nodes[node1][node2] = weight;
      this.nodes[node2][node1] = weight; // Assuming it's an undirected graph
    }
  
    getNodes() {
      return this.nodes;
    }
  }
  
  module.exports = Graph;