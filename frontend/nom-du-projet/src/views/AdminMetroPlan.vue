<template>
    <div>
      <AppNavbar />
      <div class="container mx-auto my-8 p-8 bg-white rounded shadow-md">
        <h2 class="text-2xl font-semibold mb-4">Plan Métro des Arrêts</h2>
        <div class="line w-full h-2 bg-gray-900 relative mb-6">
          <div v-for="(arret, index) in arrets" :key="arret.id" :class="getMarkerClass()" :style="{ left: `${index * (100 / (arrets.length - 1))}%` }" class="marker">
            <span class="tooltip">{{ arret.nom }}</span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    components: {
      AppNavbar: () => import('@/components/AppNavbar.vue')
    },
    data() {
      return {
        arrets: []
      };
    },
    mounted() {
      this.fetchArrets();
    },
    methods: {
      async fetchArrets() {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('No token found');
          }
  
          const response = await axios.get('http://localhost:3000/arrets', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
  
          if (response.status !== 200) {
            throw new Error(`Failed to fetch arrets: ${response.statusText}`);
          }
  
          this.arrets = response.data;
          console.log('Arrêts:', this.arrets);
        } catch (error) {
          console.error('Error fetching arrets:', error);
        }
      },
      getMarkerClass() {
        return 'marker bg-red-500 h-4 w-4 rounded-full absolute transform -translate-x-1/2';
      }
    }
  }
  </script>
  
  <style scoped>
  .container {
    max-width: 800px;
  }
  .line {
    position: relative;
    height: 4px;
    background-color: #333;
  }
  .marker {
    position: absolute;
    bottom: -12px;
  }
  .marker .tooltip {
    position: absolute;
    bottom: 150%;
    left: 50%;
    transform: translateX(-50%);
    padding: 6px 8px;
    background: #333;
    color: white;
    border-radius: 4px;
    font-size: 0.875rem;
    white-space: nowrap;
  }
  </style>