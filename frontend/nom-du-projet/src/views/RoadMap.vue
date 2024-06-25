<template>
    <div>
      <div class="container mx-auto my-8 p-8 bg-white rounded shadow-md">
        <h2 class="text-2xl font-semibold mb-4">Your Road Map</h2>
        <SimpleMap :itinerary="itinerary" />
      </div>
    </div>
  </template>
  
  <script>
  import SimpleMap from '@/components/SimpleMap.vue';
  
  export default {
    components: {
      SimpleMap
    },
    data() {
      return {
        itinerary: {
          name: 'Sample Itinerary',
          points: [
            { id: 1, name: 'Point A', position: 0, distance: 1 },
            { id: 2, name: 'Point B', position: 1, distance: 2 },
            { id: 3, name: 'Point C', position: 3, distance: 2 },
            // Add more points as needed
          ]
        }
      };
    },
    mounted() {
      fetch('http://localhost:3000/itineraires', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(response => response.json())
        .then(data => {
          this.itinerary = data;
        });
    }
  }
  </script>
  
  <style>
  .container {
    max-width: 800px;
  }
  </style>