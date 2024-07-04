<template>
  <AppNavbarhome />

    <div>
      <TrajetsList />
    </div>
  </template>
  
  <script>
  import TrajetsList from '@/components/TrajetsList.vue';
import AppNavbarhome from '@/components/AppNavbar.vue';
  
  export default {
    components: {
      TrajetsList,
    AppNavbarhome,

    }
  };
  </script>