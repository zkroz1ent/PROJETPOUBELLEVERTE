<template>
    <div>
      <AppNavbar />
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
  import AppNavbar from '@/components/AppNavbar.vue';
  
  export default {
    components: {
      AppNavbar
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
        const response = await fetch('/api/cyclistes', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          this.cyclistes = await response.json();
        } else {
          console.error('Erreur lors de la récupération des cyclistes.');
        }
      },
      async fetchTrajets() {
        const response = await fetch('/api/trajets', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          this.trajets = await response.json();
        } else {
          console.error('Erreur lors de la récupération des trajets.');
        }
      },
      async assignTrajet() {
        if (!this.selectedCycliste || !this.selectedTrajet) {
          alert('Veuillez sélectionner un cycliste et un trajet.');
          return;
        }
        const response = await fetch(`/api/cyclistes/${this.selectedCycliste}/assignTrajet`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ trajetId: this.selectedTrajet })
        });
        if (response.ok) {
          alert('Trajet assigné avec succès.');
        } else {
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