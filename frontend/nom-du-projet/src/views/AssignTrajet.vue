<template>
    <div>
      <div class="container mx-auto my-8 p-8 bg-white rounded shadow-md">
        <h2 class="text-2xl font-semibold mb-4">Assigner Trajet</h2>
        <div v-if="cyclistes.length && trajets.length">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Sélectionner Cycliste</label>
            <select v-model="selectedCycliste" class="w-full mt-2 p-2 border rounded-md">
              <option v-for="cycliste in cyclistes" :key="cycliste.id" :value="cycliste.id">{{ cycliste.nom }} {{ cycliste.prenom }}</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Sélectionner Trajet</label>
            <select v-model="selectedTrajet" class="w-full mt-2 p-2 border rounded-md">
              <option v-for="trajet in trajets" :key="trajet.id" :value="trajet.id">{{ trajet.nom }}</option>
            </select>
          </div>
          <button @click="assignTrajet" class="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Assigner Trajet</button>
        </div>
        <p v-else>Chargement des données...</p>
      </div>
    </div>
  </template>
  
  <script>
  
  export default {
    components: {
    },
    data() {
      return {
        cyclistes: [],
        trajets: [],
        selectedCycliste: null,
        selectedTrajet: null
      };
    },
    methods: {
      async fetchCyclistes() {
        try {
          const response = await fetch('http://localhost:3000/cyclistes', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          if (!response.ok) {
            console.error('Failed to fetch cyclistes:', response.statusText);
            return;
          }
          const data = await response.json();
          console.log('Cyclistes data:', data);
          this.cyclistes = data;
        } catch (error) {
          console.error('Error fetching cyclistes:', error);
        }
      },
      async fetchTrajets() {
        try {
          const response = await fetch('http://localhost:3000/trajets', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          if (!response.ok) {
            console.error('Failed to fetch trajets:', response.statusText);
            return;
          }
          const data = await response.json();
          console.log('Trajets data:', data);
          this.trajets = data;
        } catch (error) {
          console.error('Error fetching trajets:', error);
        }
      },
      async assignTrajet() {
        if (!this.selectedCycliste || !this.selectedTrajet) {
          alert('Veuillez sélectionner un cycliste et un trajet.');
          return;
        }
        try {
          const response = await fetch(`http://localhost:3000/cyclistes/${this.selectedCycliste}/assignTrajet`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ trajetId: this.selectedTrajet })
          });
          if (!response.ok) {
            console.error('Failed to assign trajet:', response.statusText);
            alert('Erreur lors de l\'assignement du trajet.');
            return;
          }
          alert('Trajet assigné avec succès.');
        } catch (error) {
          console.error('Error assigning trajet:', error);
          alert('Erreur lors de l\'assignement du trajet.');
        }
      }
    },
    mounted() {
      this.fetchCyclistes();
      this.fetchTrajets();
    }
  }
  </script>
  
  <style>
  .container {
    max-width: 800px;
  }
  </style>