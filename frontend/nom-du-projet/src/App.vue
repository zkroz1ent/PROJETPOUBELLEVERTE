<template>
  <div id="app" class="min-h-screen bg-gray-100">
    <!-- AppNavbar sur toute la largeur en haut de la page -->
    <AppNavbarhome />

    <!-- Contenu principal de la page -->
    <router-view />
  </div>
</template>

<script>
// Importation de la AppNavbar
import AppNavbarhome from './components/AppNavbar.vue';

export default {
  name: 'App',
  components: {
    // Inscription de la AppNavbar dans les composants globaux
    AppNavbarhome,
  }
};
</script>

<style>
/* Ajouter des styles globaux ici si nécessaire */
</style>