<template>
  <AppNavbarhome />

  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="container mx-auto my-8 p-8 bg-white rounded-lg shadow-xl hover:shadow-2xl transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105">
      <h2 class="text-3xl font-bold text-center text-blue-700 mb-6">Bienvenue sur le site des cyclistes de Malyraic</h2>
      <div v-if="user" class="text-center">
        <p class="text-lg mb-4">Bonjour, <span class="font-semibold">{{ user.user.nom }} {{ user.user.prenom }}</span>!</p>
        <p class="text-gray-700">Email: <span class="font-bold">{{ user.user.email }}</span></p>
        <p class="text-gray-500 mb-4">Statut: <span class="italic">{{ user.user.statut }}</span></p>
        <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50">
          Découvrir plus
        </button>
      </div>
      <div v-else class="text-center">
        <p class="text-xl text-gray-600 mb-4">Veuillez vous connecter.</p>
        
      </div>
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