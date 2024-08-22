<template>
  <div>
    <!-- Header Section -->
    <AppNavbarhome />

    <!-- Global Time Section -->
    <div class="bg-blue-600 text-white p-6 text-center">
      <h1 class="text-4xl">Itinéraire du Cycliste</h1>
      <p class="text-2xl mt-4">Temps Total: {{ totalTime }} heures</p>
    </div>

    <!-- Navigation Buttons -->
    <div class="p-6 text-center">
      <button @click="goToPreviousStop" 
              class="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-200 text-sm mr-4"
              :disabled="currentStopIndex === 0">
        Arrêt Précédent
      </button>
      <button @click="goToNextStop" 
              class="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-200 text-sm"
              :disabled="currentStopIndex === trajetsComplets.length - 1">
        Arrêt Suivant
      </button>
    </div>

    <!-- Progress Section -->
    <div class="p-6">
      <h2 class="text-2xl font-semibold mb-4 text-center">Votre itinéraire</h2>
      <div class="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="relative pb-10"
             v-for="(trajet, index) in trajetsComplets"
             :key="trajet.arretId + index">
          <div class="relative w-full h-full mx-auto bg-white shadow-lg rounded-lg p-6 text-center z-10"
               :class="{
                  'bg-green-100': trajet.action === 'trajet principal',
                  'bg-orange-100': trajet.action !== 'trajet principal',
                  'border-4 border-blue-600': isCurrentStop(index),
                  'border-4 border-yellow-400': isNextStop(index)
                }">
            <h2 class="text-xl font-semibold">{{ trajet.arretNom }}</h2>
            <p class="text-gray-700 text-sm mt-2">Autonomie Restante : {{ trajet.remainingAutonomy }} km</p>
            <p class="text-gray-700 text-sm">Capacité Restante : {{ trajet.remainingCapacity }} kg</p>
            <p class="text-gray-700 text-sm">Durée : {{ trajet.timeTaken }} h</p>
            <p class="text-gray-700 text-sm py-2 rounded-full"
               :class="trajet.action === 'trajet principal' ? 'bg-green-200' : 'bg-orange-200'">{{ trajet.action }}</p>
            <button
              @click="marquerArretNonDesservi(trajet.arretId)"
              class="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200 text-sm">
              Arrêt non desservi
            </button>
            <!-- Current Stop Indication -->
            <div v-if="isCurrentStop(index)" 
                 class="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-bl-lg">
              Arrêt Actuel
            </div>
          </div>
          <div v-if="index < trajetsComplets.length - 1" 
               class="absolute top-1/2 left-full transform -translate-y-1/2 -translate-x-1/2 z-0">
            <svg class="w-8 h-8 text-blue-600"
                 fill="none" 
                 stroke="currentColor" 
                 viewBox="0 0 24 24" 
                 xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </div>
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
      trajetsComplets: [],
      message: '',
      totalTime: 0,
      currentStopIndex: 0, // Assumant que l'itinéraire commence au premier arrêt
    };
  },
  async created() {
    let user = localStorage.getItem('user');
    user = JSON.parse(user);
    const userId = user.user.cyclisteID;
    console.log(userId);

    const params = {
      departId: 1,
      arriveeId: 5,
      veloId: 2,
      cyclisteId: userId,
      isWinter: false,
    };

    await axios.post('http://localhost:3000/trajets/verify', params)
      .then(response => {
        this.trajetsComplets = response.data.trajetsComplets;
        this.message = response.data.message;
        this.totalTime = response.data.totalTime;
        console.log(response);
      })
      .catch(error => {
        console.error('Erreur lors de la vérification des trajets:', error);
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

      const params = {
        departId: 1,
        arriveeId: 5,
        veloId: 2,
        cyclisteId: userId,
        isWinter: false,
      };

      await axios.post('http://localhost:3000/trajets/verify', params)
        .then(response => {
          this.trajetsComplets = response.data.trajetsComplets;
          this.message = response.data.message;
          this.totalTime = response.data.totalTime;
          console.log(response);
        })
        .catch(error => {
          console.error('Erreur lors de la vérification des trajets:', error);
        });
    },
    isCurrentStop(index) {
      return index === this.currentStopIndex;
    },
    isNextStop(index) {
      return index === this.currentStopIndex + 1;
    },
    goToPreviousStop() {
      if (this.currentStopIndex > 0) {
        this.currentStopIndex--;
      }
    },
    goToNextStop() {
      if (this.currentStopIndex < this.trajetsComplets.length - 1) {
        this.currentStopIndex++;
      }
    }
  }
};
</script>