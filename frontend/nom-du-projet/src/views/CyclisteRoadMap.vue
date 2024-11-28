<template>
  <div>
    <!-- Header Section -->
    <AppNavbarhome />

    <!-- Global Time Section -->
    <div class="bg-blue-600 text-white p-6 text-center">
      <h1 class="text-4xl">Itinéraires du Cycliste</h1>
      <p class="text-2xl mt-4">Temps Total: {{ formatTimeDisplay(totalTime) }}</p>

      <p class="text-4xl mt-4">Temps restant: {{ formatTimeDisplay(remainingTime) }}</p>
    </div>

    <!-- Navigation Buttons -->
    <div class="p-6 text-center sticky-navigation">
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
    <div class="fixed bottom-5 right-5 transition-opacity duration-300 z-50"
      :class="{ 'opacity-0': !isScrolled, 'opacity-100': isScrolled }">
      <div class="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg font-medium">
        Temps restant: {{ formatTimeDisplay(remainingTime) }}
      </div>
    </div>
    <!-- Progress Section -->
    <div class="p-6">
      <h2 class="text-2xl font-semibold mb-4 text-center">Votre Itinéraire</h2>
      <div class="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="relative pb-10" v-for="(trajet, index) in trajetsComplets" :key="trajet.arretId + index">
          <div class="relative w-full h-full mx-auto bg-white shadow-lg rounded-lg p-6 text-center z-10" :class="{
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
              :class="trajet.action === 'trajet principal' ? 'bg-green-200' : 'bg-orange-200'">
              {{ trajet.action }}
            </p>
            <button @click="marquerArretNonDesservi(trajet.arretId)"
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
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7">
              </path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import axios from 'axios';
import { useToast } from 'vue-toastification';
import AppNavbarhome from '@/components/AppNavbar.vue';

export default {
  components: {
    AppNavbarhome,
  },
  data() {
    return {
      trajetsComplets: [],
      params: {},
      message: '',
      veloId: 0,
      totalTime: 0,
      currentStopIndex: 0,
      remainingTime: 0,
      isScrolled: false,
    };
  },

  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },

  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  async created() {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user.user.cyclisteID;

    await axios.get(`http://localhost:3000/trajets/cyclistes/${userId}/trajets`)
      .then(response => {
        // Pour l'exemple, utiliser seulement le premier trajet pour les params


        if (response.data.length > 0) {
          const firstTrajet = response.data[0];
          this.params = {
            departId: firstTrajet.DepartArret.id,
            arriveeId: firstTrajet.ArriveeArret.id,
            veloId: firstTrajet.veloId,
            cyclisteId: userId,
            isWinter: false,
          };
          this.veloId = firstTrajet.veloId; ddqwddwd
          this.initiateTrajets(response.data, userId);
        }
      })
      .catch(error => console.error('Erreur lors de la vérification des trajets:', error));

    this.verifyTrajets();
  },
  methods: {
    initiateTrajets(trajets, userId) {
      // Traiter plusieurs trajets ici si besoin (ex: concaténer les listes d'arrets, etc.)
    },
    formatTimeDisplay(minutes) {
      const hours = Math.floor(minutes / 60);
      const mins = Math.round(minutes % 60);
      return `${hours}h${mins.toString().padStart(2, '0')}min`;
    },





    mergeIntermediateStops(trajets) {
      const mergedTrajets = [];
      let i = 0;

      while (i < trajets.length) {
        const currentTrajet = trajets[i];
        let j = i + 1;
        let nextPrincipalIndex = -1;

        // Chercher le prochain arrêt principal avec le même nom
        while (j < trajets.length && trajets[j].arretNom === currentTrajet.arretNom) {
          if (trajets[j].action === 'trajet principal') {
            nextPrincipalIndex = j;
            break;
          }
          j++;
        }

        if (currentTrajet.action === 'trajet principal' && nextPrincipalIndex !== -1) {
          // Garder seulement le premier arrêt principal
          mergedTrajets.push({
            ...currentTrajet,
            timeTaken: currentTrajet.timeTaken, // Garder le temps original
            remainingAutonomy: trajets[nextPrincipalIndex].remainingAutonomy,
            remainingCapacity: trajets[nextPrincipalIndex].remainingCapacity,
            action: 'trajet principal'
          });
          i = nextPrincipalIndex + 1;
        } else if (currentTrajet.action !== 'trajet principal' &&
          i > 0 &&
          trajets[i - 1].arretNom === currentTrajet.arretNom &&
          trajets[i - 1].action !== 'trajet principal') {
          // Ignorer les arrêts intermédiaires consécutifs avec le même nom
          i++;
        } else {
          // Garder l'arrêt tel quel
          mergedTrajets.push(currentTrajet);
          i++;
        }
      }
      return mergedTrajets;
    },



    // Modifier la méthode verifyTrajets
    async verifyTrajets() {
      await axios.post('http://localhost:3000/trajets/verify', this.params)
        .then(response => {
          // Fusionner les arrêts intermédiaires avant d'assigner
          this.trajetsComplets = this.mergeIntermediateStops(response.data.trajetsComplets);
          this.message = response.data.message;
          this.totalTime = parseFloat(response.data.totalTime);
          this.remainingTime = this.totalTime;
        })
        .catch(error => console.error('Erreur lors de la vérification des trajets:', error));
    },

    // Mettre à jour goToNextStop pour tenir compte des trajets fusionnés
    async goToNextStop() {
      if (this.currentStopIndex < this.trajetsComplets.length - 1) {
        const currentTrajet = this.trajetsComplets[this.currentStopIndex];
        const timeInMinutes = parseFloat(currentTrajet.timeTaken) * 60;
        this.remainingTime = Math.max(0, this.remainingTime - timeInMinutes);
        this.currentStopIndex++;
        await this.updateVeloPosition(0);
      }
    },

    // Mettre à jour goToPreviousStop pour tenir compte des trajets fusionnés
    async goToPreviousStop() {
      if (this.currentStopIndex > 0) {
        this.currentStopIndex--;
        const currentTrajet = this.trajetsComplets[this.currentStopIndex];
        const timeInMinutes = parseFloat(currentTrajet.timeTaken) * 60;
        this.remainingTime = Math.min(this.totalTime, this.remainingTime + timeInMinutes);
        await this.updateVeloPosition(50);
      }
    },



    async marquerArretNonDesservi(arretId) {
      const toast = useToast();
      try {
        await axios.put(`http://localhost:3000/arrets/${arretId}/desservable`, { desservable: false });
        toast.success('L\'arrêt a été marqué comme non desservi.');
        this.fetchTrajets();
      } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'arrêt:', error);
        toast.error('Erreur lors de la mise à jour de l\'arrêt.');
      }
    },
    handleScroll() {
      this.isScrolled = window.scrollY > 300;
    },

    async fetchTrajets() {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user.user.cyclisteID;

      await axios.get(`http://localhost:3000/trajets/cyclistes/${userId}/trajets`)
        .then(response => {
          if (response.data.length > 0) {
            // Logique pour traiter une liste de trajets
          }
        })
        .catch(error => console.error('Erreur lors de la récupération des trajets:', error));
    },
    isCurrentStop(index) {
      return index === this.currentStopIndex;
    },
    isNextStop(index) {
      return index === this.currentStopIndex + 1;
    },
    parseTimeToDecimal(timeString) {
      if (!timeString) return 0;
      return parseFloat(timeString);
    },

    formatTime(timeInHours) {
      // const hours = Math.floor(timeInHours);
      // const minutes = Math.round((timeInHours - hours) / 60);
      // return `${hours}h${minutes.toString().padStart(2, '0')}min`;
    },

    async goToNextStop() {
      if (this.currentStopIndex < this.trajetsComplets.length - 1) {
        const currentTrajet = this.trajetsComplets[this.currentStopIndex];
        // Convertir le temps en minutes
        const timeInMinutes = parseFloat(currentTrajet.timeTaken) * 60;
        this.remainingTime = Math.max(0, this.remainingTime - timeInMinutes);
        this.currentStopIndex++;
        await this.updateVeloPosition(0);
      }
    },


    async goToPreviousStop() {
      if (this.currentStopIndex > 0) {
        this.currentStopIndex--;
        const currentTrajet = this.trajetsComplets[this.currentStopIndex];
        // Convertir le temps en minutes
        const timeInMinutes = parseFloat(currentTrajet.timeTaken) * 60;
        this.remainingTime = Math.min(this.totalTime, this.remainingTime + timeInMinutes);
        await this.updateVeloPosition(50);
      }
    },
    async updateVeloPosition(quantitedechet) {
      const currentTrajet = this.trajetsComplets[this.currentStopIndex];
      try {
        await axios.put(`http://localhost:3000/velos/${this.veloId}/position`, {
          latitude: currentTrajet.lat,
          longitude: currentTrajet.lon,
          quantitedechet1: quantitedechet
        });
        if (currentTrajet.action === 'trajet principal') {
          await axios.post(`http://localhost:3000/arrets/dechetupdate`, {
            id: currentTrajet.arretId,
            quantite_dechets: quantitedechet
          });
        } else {
          console.log('L\'action de mise à jour de la quantité de déchets a été ignorée en raison du statut du trajet.');
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la position du vélo:', error);
      }
    }
  }
};
</script>

<style scoped>
.sticky-navigation {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1000;
}
</style>