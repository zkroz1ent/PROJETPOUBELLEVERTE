<template>
  <div class="container mx-auto py-8">
    <h1 class="text-4xl font-bold mb-4">Bienvenue {{ currentUser.user.nom }},</h1>
    <p class="mb-4">Vous êtes connecté en tant que {{ currentUser.user.role }}</p>

    <div v-if="isAdmin">
      <h2 class="text-2xl font-bold mb-2">Administration</h2>
      <ul class="list-disc pl-8 mb-6">
        <li><router-link to="/itineraire-admin" class="text-blue-600 hover:underline">Gestion des itinéraires</router-link></li>
        <li><router-link to="/utilisateur-admin" class="text-blue-600 hover:underline">Gestion des utilisateurs</router-link></li>
        <!-- Ajoutez d'autres liens ici -->
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'HomePage',
  computed: {
    ...mapGetters(['currentUser', 'isAdmin'])
  }
};
</script>

<style scoped>
/* Ajoutez des styles spécifiques */
</style>