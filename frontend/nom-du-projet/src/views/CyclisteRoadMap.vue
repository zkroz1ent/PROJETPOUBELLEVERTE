<template>
  <div>
    <!-- Header Section -->
    <AppNavbarhome />

    <div class="bg-blue-500 text-white p-4">
      <h1 class="text-3xl">Itinéraire du Cycliste</h1>
    </div>
    <!-- Body Section with a list of Trajets -->
    <div class="p-6">
      <div v-if="trajets && trajets.length">
        <div v-for="trajet in trajets" :key="trajet.arretId"
          class="bg-white rounded-lg shadow-md p-4 mb-4 hover:bg-blue-50 transition duration-200">
          <h2 class="text-xl font-semibold">
            <svg class="w-6 h-6 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 14l6.16-3.422A12.083 12.083 0 0112 6.08a12.083 12.083 0 01-6.16 4.498L12 14z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14v8"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 14L1.578 17.695A12.083 12.083 0 0112 16.92a12.083 12.083 0 0110.422 1.775L12 14z"></path>
            </svg>
            {{ trajet.arretNom }}
          </h2>
          <p class="text-gray-700">
            <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
            Rue : {{ trajet.rueNom }}
          </p>
          <!-- Bouton pour marquer comme non desservi -->
          <button 
            @click="marquerArretNonDesservi(trajet.arretId)" 
            class="mt-2 bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 transition duration-200"
          >
            Arrêt non desservi
          </button>
        </div>
      </div>
      <div v-else>
        <p class="text-gray-700">Aucun trajet trouvé</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useToast } from "vue-toastification";
import AppNavbarhome from '@/components/AppNavbar.vue';

export default {
  components: {
    AppNavbarhome,
  },
  name: 'TrajetList',
  data() {
    return {
      trajets: []
    };
  },
  async created() {
    let user = localStorage.getItem('user');
    user = JSON.parse(user);
    const userId = user.user.cyclisteID;
    console.log(userId);

    await axios.get('http://localhost:3000/trajets/cyclistes/' + userId + '/trajets')
      .then(response => {
        this.trajets = response.data;
        console.log(response);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des trajets:', error);
      });
  },
  methods: {
    async marquerArretNonDesservi(arretId) {
      const toast = useToast();
      try {
        await axios.put(`http://localhost:3000/arrets/${arretId}/desservable`, { desservable: false });
        toast.success('L\'arrêt a été marqué comme non desservi.');
        this.fetchTrajets(); // Recalculer l'itinéraire si nécessaire
      } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'arrêt:', error);
        toast.error('Erreur lors de la mise à jour de l\'arrêt.');
      }
    },
    async fetchTrajets() {
      let user = localStorage.getItem('user');
      user = JSON.parse(user);
      const userId = user.user.cyclisteID;

      await axios.get('http://localhost:3000/trajets/cyclistes/' + userId + '/trajets')
        .then(response => {
          this.trajets = response.data;
          console.log(response);
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des trajets:', error);
        });
    }
  }
};
</script>

<style scoped>
.bg-blue-50:hover {
  background-color: #e0f2fe;
}
.mt-2 {
  margin-top: 0.5rem;
}
.py-1 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}
.px-2 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
.rounded {
  border-radius: 0.25rem;
}
.hover\:bg-red-600:hover {
  background-color: #e3342f;
}
.transition {
  transition: all 0.2s ease-in-out;
}
</style>