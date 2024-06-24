<template>
    <div>
     
      <div class="container mx-auto my-8 p-8 bg-white rounded shadow-md">
        <h2 class="text-2xl font-semibold mb-4">Your Road Map</h2>
        <SimpleMap v-if="itinerary" :itinerary="itinerary" />
        <p v-else>Loading your itinerary...</p>
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
        itinerary: null
      };
    },
    mounted() {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.user && user.user.id) {
        fetch(`/api/cyclistes/${user.user.id}/trajet`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
          .then(response => response.json())
          .then(data => {
            this.itinerary = {
              name: 'Assigned Trajet',
              points: data.points // Assuming API response includes an array of points
            };
          })
          .catch(error => {
            console.error('Error fetching itinerary:', error);
          });
      } else {
        console.error('User not found or user ID is undefined');
      }
    }
  }
  </script>
  
  <style>
  .container {
    max-width: 800px;
  }
  </style>