<template>
    <div>
      <div class="container mx-auto my-8 p-8 bg-white rounded shadow-md">
        <h2 class="text-2xl font-semibold mb-4">Plan Métro des Arrêts</h2>
        <div class="line w-full h-2 bg-gray-900 relative mb-6">
          <div v-for="arret in arrets" :key="arret.id" :class="getMarkerClass(arret)" :style="{ left: `${arret.position * 10}px` }" class="marker">
            <span class="tooltip">{{ arret.nom }}</span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  
  export default {
    components: {
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
   
          const token = localStorage.getItem('token');
          console.log('Token:', token);  // Ajoutez ce log pour déboguer
          if (!token) {
            throw new Error('No token found');
          }
  
          const response = await fetch('http://localhost:3000/arrets', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          console.log('Response:', response);  // Ajoutez ce log pour déboguer
          if (!response.ok) {
            throw new Error(`Failed to fetch arrets: ${response.statusText}`);
          }
          this.arrets = await response.json();
      
      },
      getMarkerClass() {
        return {
          'marker bg-red-500 h-4 w-4 rounded-full absolute transform -translate-x-1/2': true
        };
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
    height: 2px;
    background-color: #333;
  }
  .marker {
    position: absolute;
    bottom: -8px;
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