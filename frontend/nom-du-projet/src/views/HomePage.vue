<template>
  <AppNavbarhome />

  <div>
    <div class="container mx-auto my-8 p-8 bg-white rounded shadow-md">
      <h2 class="text-2xl font-semibold mb-4">Home Page</h2>
      <div v-if="user">
        <p>Welcome, {{ user.user.nom }} {{ user.user.prenom }}!</p>
        <p>Email: {{ user.user.email }}</p>
        <p>Status: {{ user.user.statut }}</p>
      </div>
      <p v-else>Aucun utilisateur trouvé. Veuillez vous connecter.</p>
    </div>
  </div>
</template>

<script>
import AppNavbarhome from '@/components/AppNavbar.vue';

export default {
  components: {
    AppNavbarhome,

  },
  data() {
    return {
      user: null
    };
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.user = user;
    } else {
      console.error('Aucun utilisateur trouvé dans le localStorage.');
    }
  }
}
</script>

<style>
.container {
  max-width: 800px;
}
</style>