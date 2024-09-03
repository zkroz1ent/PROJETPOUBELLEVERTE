<template>
  <div>
    <!-- Navbar Component -->
    <AppNavbarhome />

    <!-- Header Section -->
    <div class="bg-blue-500 text-white p-4">
      <h1 class="text-3xl font-bold">Gestionnaire de Réseau</h1>
    </div>
    
    <!-- Section Définir le nombre de vélos disponibles -->
    <!-- Section de bascule du Mode -->
    <div class="p-6 flex justify-center space-x-4">
      <label class="inline-flex items-center space-x-2 text-lg font-medium">
        <span>Mode Été</span>
        <div class="relative">
          <input type="checkbox" v-model="isWinterMode" @change="toggleMode"
            class="appearance-none bg-gray-300 checked:bg-blue-500 w-14 h-7 rounded-full shadow-inner transition duration-200 focus:outline-none" />
          <span
            class="absolute left-0.5 top-0.5 w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-200"
            :class="isWinterMode ? 'translate-x-7' : ''"></span>
        </div>
        <span>Mode Hiver</span>
      </label>
    </div>
    <div class="p-6">
      <h2 class="text-2xl font-semibold mb-4">Définir le nombre de vélos disponibles</h2>
      <form @submit.prevent="defineVelos" class="space-y-4">
        <div>
          <label class="block text-gray-700 font-medium">Nombre de vélos :</label>
          <input v-model="nombreVelos" type="number" class="w-full p-2 border border-gray-300 rounded" />
        </div>
        <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
          Mettre à jour
        </button>
      </form>
    </div>
    <!-- Section Visualiser les flottes de vélos -->
    <div class="overflow-x-auto" style="max-height: 400px; overflow-y: auto;">
      <div class="p-6">
        <h2 class="text-2xl font-semibold mb-4">Visualiser les flottes de vélos</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="velo in velos" :key="velo.id" class="bg-white p-4 shadow rounded">
            <h3 class="text-xl font-bold">Vélo {{ velo.statut }}</h3>
            <p>Statut: <span :class="statusClass(velo.statut)">{{ velo.statut }}</span></p>
            <p>Autonomie: {{ velo.autonomie_restante }}%</p>
          </div>
        </div>
      </div>
    </div>

    <div class="p-6">
      <h2 class="text-2xl font-semibold mb-4">Supprimer tous les trajets</h2>
      <button @click="removeAllTrajets"
        class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200">
        Supprimer tous les trajets
      </button>
    </div>
    <!-- Section Gérer des tournées -->
    <div class="p-6">
      <h2 class="text-2xl font-semibold mb-4">Gérer les Tournées</h2>
      <div class="overflow-x-auto" style="max-height: 400px; overflow-y: auto;">
        <table class="min-w-full bg-white shadow-md rounded-lg">
          <thead class="bg-gray-200">
            <tr>
              <th class="py-2 px-4 text-left">ID</th>
              <th class="py-2 px-4 text-left">Cycliste</th>
              <th class="py-2 px-4 text-left">Départ</th>
              <th class="py-2 px-4 text-left">Arrivée</th>
              <th class="py-2 px-4 text-left">Statut</th>
              <th class="py-2 px-4 text-left">Vélo</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tour in tours" :key="tour.id" class="border-b hover:bg-gray-100">
              <td class="py-2 px-4">{{ tour.id }}</td>
              <td class="py-2 px-4">{{ tour.Cycliste.nom }}</td>
              <td class="py-2 px-4">{{ tour.DepartArret.nom }}</td>
              <td class="py-2 px-4">{{ tour.ArriveeArret.nom }}</td>
              <td class="py-2 px-4">{{ tour.statut }}</td>
              <td class="py-2 px-4">
                <select v-model="tour.veloId" @change="assignVelo(tour.Cycliste.id, tour.veloId)"
                  class="border border-gray-300 rounded">
                  <option :value="null">Non Assigné</option>
                  <option v-for="velo in velos" :key="velo.id" :value="velo.id">{{ velo.statut }}</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="p-6">
      <h2 class="text-2xl font-semibold mb-4">Generer toute les tournées</h2>
      <button @click="optimizeTours"
        class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200">
        Optimiser Tournées
      </button>
    </div>
    <div class="p-6">
      <h2 class="text-2xl font-semibold mb-4">Arret non attribuer</h2>
      <div class="overflow-x-auto" style="max-height: 400px; overflow-y: auto;">
        <table class="min-w-full bg-white shadow-md rounded-lg">
          <thead class="bg-gray-200">
            <tr>
              <th class="py-2 px-4 text-left">ID</th>
              <th class="py-2 px-4 text-left">Cycliste</th>
              <th class="py-2 px-4 text-left">Départ</th>
              <th class="py-2 px-4 text-left">Arrivée</th>
              <th class="py-2 px-4 text-left">Statut</th>
              <th class="py-2 px-4 text-left">Vélo</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tour in tours" :key="tour.id" class="border-b hover:bg-gray-100">
              <td class="py-2 px-4">{{ tour.id }}</td>
              <td class="py-2 px-4">{{ tour.Cycliste.nom }}</td>
              <td class="py-2 px-4">{{ tour.DepartArret.nom }}</td>
              <td class="py-2 px-4">{{ tour.ArriveeArret.nom }}</td>
              <td class="py-2 px-4">{{ tour.statut }}</td>
              <td class="py-2 px-4">
                <select v-model="tour.veloId" @change="assignVelo(tour.Cycliste.id, tour.veloId)"
                  class="border border-gray-300 rounded">
                  <option :value="null">Non Assigné</option>
                  <option v-for="velo in velos" :key="velo.id" :value="velo.id">{{ velo.statut }}</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- Section Optimisation des tournées -->


    <!-- Section Ajout d'incidents -->
    <div class="p-6">
      <h2 class="text-2xl font-semibold mb-4">Ajouter un Incident</h2>
      <form @submit.prevent="addIncident" class="space-y-4">
        <div>
          <label class="block text-gray-700 font-medium">Type d'incident :</label>
          <select v-model="incidentType" class="w-full p-2 border border-gray-300 rounded">
            <option value="panne">Panne</option>
            <option value="accident">Accident</option>
            <option value="autre">Autre</option>
          </select>
        </div>
        <div>
          <label class="block text-gray-700 font-medium">Description :</label>
          <textarea v-model="incidentDescription" class="w-full p-2 border border-gray-300 rounded"></textarea>
        </div>
        <div>
          <label class="block text-gray-700 font-medium">ID du Vélo :</label>
          <input v-model="incidentVeloId" type="number" class="w-full p-2 border border-gray-300 rounded" />
        </div>
        <button type="submit" class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200">
          Ajouter Incident
        </button>
      </form>
    </div>

    <!-- Section Visualiser les rues et arrêts -->
    <div class="overflow-x-auto" style="max-height: 800px; overflow-y: auto;">

      <div class="p-6">
        <h2 class="text-2xl font-semibold mb-4">Visualiser les Rues et Arrêts</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Arrêts Non Traités -->
          <div class="bg-white p-4 shadow rounded mb-4">
            <h3 class="text-xl font-bold">Arrêts Non Traités (50kg)</h3>
            <div v-for="rue in filteredRuesNonTraites" :key="rue.id" class="mb-4">
              <h4 class="text-lg font-semibold">{{ rue.nom }}</h4>
              <ul>
                <li v-for="arret in rue.arrets.filter(arret => arret.quantite_dechets === 50)" :key="arret.id">
                  {{ arret.nom }} - {{ arret.quantite_dechets }} kg
                  <button @click="updateArretQuantiteDechets(arret.id, 0)"
                    class="ml-4 bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 transition duration-200 text-xs">
                    Marquer comme traité
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <!-- Arrêts Traités -->
          <div class="bg-white p-4 shadow rounded mb-4">
            <h3 class="text-xl font-bold">Arrêts Traités (0kg)</h3>
            <div v-for="rue in filteredRuesTraites" :key="rue.id" class="mb-4">
              <h4 class="text-lg font-semibold">{{ rue.nom }}</h4>
              <ul>
                <li v-for="arret in rue.arrets.filter(arret => arret.quantite_dechets === 0)" :key="arret.id">
                  {{ arret.nom }} - {{ arret.quantite_dechets }} kg
                  <button @click="updateArretQuantiteDechets(arret.id, 50)"
                    class="ml-4 bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 transition duration-200 text-xs">
                    Marquer comme non traité
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import axios from 'axios';
import AppNavbarhome from '@/components/AppNavbar.vue';
import { useToast } from "vue-toastification";

export default {
  components: {
    AppNavbarhome
  },
  data() {
    return {
      isWinterMode: false,
      nombreVelos: 0,
      velos: [],
      tours: [],
      incidentType: '',
      incidentDescription: '',
      incidentVeloId: null,
      rues: [], // variable pour stocker les rues et les arrêts
      intervalId: null, // ID de l'intervalle pour arrêter l'actualisation
      isLoading: false
    };
  },
  async created() {
    await this.fetchData();
    this.startAutoRefresh();
    await this.fetchCurrentMode(); // Récupérer le mode actuel lors de la création

  },
  beforeUnmount() { // Utilisez beforeUnmount à la place de beforeDestroy
    this.stopAutoRefresh();
  },
  computed: {
    filteredRuesNonTraites() {
      return this.rues.filter(rue => rue.arrets.some(arret => arret.quantite_dechets === 50));
    },
    filteredRuesTraites() {
      return this.rues.filter(rue => rue.arrets.some(arret => arret.quantite_dechets === 0));
    }
  },
  methods: {
    async fetchCurrentMode() {
      try {
        const response = await axios.get('http://localhost:3000/settings/mode');
        this.isWinterMode = response.data.mode === 'winter';
      } catch (error) {
        console.error('Erreur lors de la récupération du mode:', error);
      }
    },
    async toggleMode() {
      const toast = useToast();
      try {
        const newMode = this.isWinterMode ? 'winter' : 'summer';
        await axios.post('http://localhost:3000/settings/mode', { mode: newMode });
        toast.success(`Mode mis à jour en ${newMode}`);
      } catch (error) {
        console.error('Erreur lors de la mise à jour du mode:', error);
        toast.error('Erreur lors de la mise à jour du mode.');
      }
    },
    async removeAllTrajets() {
      const toast = useToast();
      try {
        await axios.delete('http://localhost:3000/trajets/delete/removealltrajet');
        toast.success('Tous les trajets ont été supprimés avec succès.');
        await this.fetchTours(); // Met à jour les données après suppression
      } catch (error) {
        console.error('Erreur lors de la suppression de tous les trajets :', error);
        toast.error('Erreur lors de la suppression de tous les trajets.');
      }
    },


    async fetchData() {
      this.isLoading = true;
      await this.fetchVelos();
      await this.fetchTours();
      await this.fetchRuesEtArrets();
      this.isLoading = false;
    },
    async fetchVelos() {
      try {
        const response = await axios.get('http://localhost:3000/gestionnaire/fleets');
        this.velos = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des flottes de vélos:', error);
      }
    },
    async fetchTours() {
      try {
        const response = await axios.get('http://localhost:3000/gestionnaire/tours');
        this.tours = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des tournées :', error);
      }
    },
    async fetchRuesEtArrets() {
      try {
        const response = await axios.get('http://localhost:3000/arrets/ruesetarrets/ruesetarrets');
        this.rues = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des rues et des arrêts:', error);
      }
    },
    async defineVelos() {
      const toast = useToast();
      try {
        await axios.put('http://localhost:3000/gestionnaire/velos', { nombre: this.nombreVelos });
        toast.success('Nombre de vélos mis à jour avec succès.');
        await this.fetchVelos();
      } catch (error) {
        console.error('Erreur lors de la mise à jour du nombre de vélos:', error);
        toast.error('Erreur lors de la mise à jour du nombre de vélos.');
      }
    },
    async assignVelo(cyclisteId, veloId) {
      const toast = useToast();
      try {
        await axios.post(`http://localhost:3000/gestionnaire/assignVeloToAll/${cyclisteId}`, { veloId });
        toast.success('Vélo attribué à toutes les tournées du cycliste.');
        await this.fetchTours(); // Met à jour les données après l'assignation
      } catch (error) {
        console.error('Erreur lors de l\'attribution du vélo à toutes les tournées:', error);
        toast.error('Erreur lors de l\'attribution du vélo à toutes les tournées.');
      }
    },
    async optimizeTours() {
      const toast = useToast();
      try {
        await axios.post('http://localhost:3000/trajets/programme-ramassage');
        toast.success('Tournées optimisées avec succès.');
        await this.fetchTours();
      } catch (error) {
        console.error('Erreur lors de l\'optimisation des tournées:', error);
        toast.error('Erreur lors de l\'optimisation des tournées.');
      }
    },
    async addIncident() {
      const toast = useToast();
      try {
        await axios.post('http://localhost:3000/gestionnaire/incidents', {
          type: this.incidentType,
          description: this.incidentDescription,
          veloId: this.incidentVeloId
        });
        toast.success('Incident ajouté avec succès.');
        this.incidentType = '';
        this.incidentDescription = '';
        this.incidentVeloId = null;
      } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'incident:', error);
        toast.error('Erreur lors de l\'ajout de l\'incident.');
      }
    },
    async updateArretQuantiteDechets(arretId, quantite_dechets) {
      const toast = useToast();
      try {
        await axios.put(`http://localhost:3000/arrets/${arretId}/quantite_dechets`, {
          quantite_dechets: quantite_dechets
        });
        toast.success(`Quantité de déchets mise à jour avec succès.`);
        await this.fetchRuesEtArrets(); // Met à jour l'affichage après l'opération de mise à jour
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la quantité de déchets:', error);
        toast.error('Erreur lors de la mise à jour de la quantité de déchets.');
      }
    },

    statusClass(statut) {
      return {
        'text-green-500': statut === 'disponible',
        'text-red-500': statut === 'en_course' || statut === 'maintenance' || statut === 'indisponible'
      };
    },
    startAutoRefresh() {
      this.intervalId = setInterval(this.fetchData, 5000); // Actualise toutes les 5 secondes
    },
    stopAutoRefresh() {
      clearInterval(this.intervalId);
    }
  }
};
</script>
<style scoped>
.loader {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #09f;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.bg-blue-500 {
  background-color: #3b82f6;
}

.text-white {
  color: white;
}

.p-4 {
  padding: 1rem;
}

.p-6 {
  padding: 1.5rem;
}

.bg-red-500:hover {
  background-color: #ef4444;
}

.bg-red-600 {
  background-color: #dc2626;
}

.bg-green-500:hover {
  background-color: #10b981;
}

.bg-green-600 {
  background-color: #059669;
}

.bg-gray-200 {
  background-color: #e5e7eb;
}

.text-green-500 {
  color: #10b981;
}

.text-red-500 {
  color: #ef4444;
}
</style>