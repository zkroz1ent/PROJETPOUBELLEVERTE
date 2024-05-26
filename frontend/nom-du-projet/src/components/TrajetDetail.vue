<template>
    <div class="p-4 bg-white rounded shadow-md">
      <h2 class="text-lg font-bold">{{ trajet.name }}</h2>
      <p class="text-sm">{{ trajet.description }}</p>
      <p class="text-sm">Date: {{ trajet.date }}</p>
      <p class="text-sm">Statut: {{ trajet.statut }}</p>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      trajet: {
        type: Object,
        required: true
      }
    }
  };
  </script>