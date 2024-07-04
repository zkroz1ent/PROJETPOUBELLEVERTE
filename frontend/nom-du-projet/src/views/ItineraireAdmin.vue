<template>
  <AppNavbarhome />

    <div class="container mx-auto">
      <h1 class="text-3xl font-bold mb-4">Gestion des Itinéraires</h1>
      <form @submit.prevent="assignerItineraire">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Cycliste</label>
          <select v-model="form.cyclisteId" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            <option v-for="cycliste in cyclistes" :key="cycliste.id" :value="cycliste.id">{{ cycliste.nom }}</option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Itinéraire</label>
          <select v-model="form.itineraireId" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            <option v-for="itineraire in itineraires" :key="itineraire.id" :value="itineraire.id">{{ itineraire.nom }}</option>
          </select>
        </div>
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none">
          Assigner Itinéraire
        </button>
      </form>
  
      <h2 class="text-2xl font-bold mt-8 mb-4">Itinéraires</h2>
      <ul>
        <li v-for="itineraire in itineraires" :key="itineraire.id">
          {{ itineraire.nom }} - {{ itineraire.statut }}
          <button @click="optimiser(itineraire.id)" class="ml-4 text-blue-600">Optimiser</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { mapGetters, mapActions } from 'vuex';
import AppNavbarhome from '@/components/AppNavbar.vue';
  
  export default {
    name: 'ItineraireAdmin',
    data() {
      return {
        form: {
          cyclisteId: '',
          itineraireId: ''
        }
      };
    },
    components: {
    AppNavbarhome,
  },
    computed: {
      ...mapGetters(['itineraires', 'cyclistes'])
    },
    methods: {
      ...mapActions(['fetchItineraires', 'fetchCyclistes']),
      async assignerItineraire() {
        try {
          await axios.post('http://localhost:3000/itineraires/assigner', this.form, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : ''}`
            }
          });
          this.fetchItineraires();
        } catch (error) {
          console.error("Erreur lors de l'affectation de l'itinéraire:", error);
        }
      },
      async optimiser(itineraireId) {
        try {
          await axios.put(`http://localhost:3000/itineraires/optimiser/${itineraireId}`, {}, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : ''}`
            }
          });
          this.fetchItineraires();
        } catch (error) {
          console.error("Erreur lors de l'optimisation de l'itinéraire:", error);
        }
      }
    },
    async created() {
      this.fetchItineraires();
      this.fetchCyclistes();
    }
  };
  </script>
  
  <style>
  /* Ajoutez des styles pour Tailwind CSS */
  </style>