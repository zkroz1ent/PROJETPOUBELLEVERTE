<template>
    <div>
      <AppNavbar />
      <TrajetsList />
    </div>
  </template>
  
  <script>
  import AppNavbar from '@/components/AppNavbar.vue';
  import TrajetsList from '@/components/TrajetsList.vue';
  
  export default {
    components: {
      AppNavbar,
      TrajetsList
    }
  };
  </script>