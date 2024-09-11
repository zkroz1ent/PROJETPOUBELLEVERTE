<template>
  <AppNavbarhome />

  <div class="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-600">
    <div class="text-center p-6 bg-white bg-opacity-90 rounded-lg shadow-lg transition transform hover:shadow-xl hover:scale-105">
      <h1 v-if="user" class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
        Welcome, {{ user.prenom }} {{ user.nom }}!
      </h1>
      <h1 v-else class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
        Welcome, Cyclist!
      </h1>
    </div>
  </div>
</template>

<script>
import AppNavbarhome from '@/components/AppNavbar.vue';
import confetti from 'canvas-confetti'; // Importation de la bibliothèque de confettis

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
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        this.user = JSON.parse(storedUser).user;
        // Vérifiez si un utilisateur est trouvé et déclenchez les confettis
        this.triggerConfetti();
      } catch (error) {
        console.error("Erreur lors de l'analyse du JSON des utilisateurs :", error);
      }
    } else {
      console.error('Aucun utilisateur trouvé dans le localStorage.');
    }
  },
  methods: {
    triggerConfetti() {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }
}
</script>

<style>
/* Les styles globaux peuvent être ajoutés ici si nécessaire */
</style>