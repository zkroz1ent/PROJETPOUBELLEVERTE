<template>
    <div>
      <h2 class="text-2xl font-bold text-center my-4">Mes Trajets</h2>
      <ul class="space-y-4">
        <li v-for="trajet in trajets" :key="trajet.id" class="p-4 bg-white rounded shadow">
          <TrajetDetail :trajet="trajet" />
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import TrajetDetail from './TrajetDetail.vue';
  
  export default {
    components: {
      TrajetDetail
    },
    data() {
      return {
        trajets: []
      };
    },
    async created() {
      try {
        const response = await axios.get('http://localhost:3000/trajets/user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : ''}`
          }
        });
        this.trajets = response.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des trajets :", error);
      }
    }
  };
  </script>