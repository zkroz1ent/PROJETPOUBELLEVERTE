<template>
  <div>
    <!-- Navbar Component -->
    <AppNavbarhome />

    <!-- Header Section -->
    <div class="bg-blue-500 text-white p-4">
      <h1 class="text-3xl font-bold">Gestionnaire de Réseau</h1>
    </div>

    <!-- Section Définir le nombre de vélos disponibles -->
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

    <!-- Section Gérer des tournées -->
    <div class="p-6">
      <h2 class="text-2xl font-semibold mb-4">Gérer les Tournées</h2>
      <div class="overflow-x-auto">
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
                <select v-model="tour.veloId" @change="assignVelo(tour.id, tour.veloId)" class="border border-gray-300 rounded">
                  <option :value="null">Non Assigné</option>
                  <option v-for="velo in velos" :key="velo.id" :value="velo.id">{{ velo.statut }}</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Section Optiomisation des tournées -->
    <div class="p-6">
      <h2 class="text-2xl font-semibold mb-4">Optimiser les tournées</h2>
      <button @click="optimizeTours" class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200">
        Optimiser Tournées
      </button>
    </div>

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
    <div class="p-6">
      <h2 class="text-2xl font-semibold mb-4">Visualiser les Rues et Arrêts</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="bg-white p-4 shadow rounded">
          <h3 class="text-xl font-bold">Rues Traitées</h3>
          <ul>
            <li v-for="rue in ruesTraitees" :key="rue.id">{{ rue.nom }}</li>
          </ul>
        </div>
        <div class="bg-white p-4 shadow rounded">
          <h3 class="text-xl font-bold">Rues Non Traitées</h3>
          <ul>
            <li v-for="rue in ruesNonTraitees" :key="rue.id">{{ rue.nom }}</li>
          </ul>
        </div>
        <div class="bg-white p-4 shadow rounded">
          <h3 class="text-xl font-bold">Arrêts</h3>
          <ul>
            <li v-for="arret in arrets" :key="arret.id">{{ arret.nom }}</li>
          </ul>
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
      nombreVelos: 0,
      velos: [],
      tours: [],
      incidentType: '',
      incidentDescription: '',
      incidentVeloId: null,
      ruesTraitees: [],
      ruesNonTraitees: [],
      arrets: []
    };
  },
  async created() {
    await this.fetchVelos();
    await this.fetchTours();
    await this.fetchRues();
    await this.fetchArrets();
  },
  methods: {
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
        console.error('Erreur lors de la récupération des tournées:', error);
      }
    },
    async fetchRues() {
      try {
        const response = await axios.get('http://localhost:3000/gestionnaire/streets');
        // Diviser les rues en traitées et non traitées
        this.ruesTraitees = response.data.filter(rue => rue.statut === 'traitee');
        this.ruesNonTraitees = response.data.filter(rue => rue.statut !== 'traitee');
      } catch (error) {
        console.error('Erreur lors de la récupération des rues:', error);
      }
    },
    async fetchArrets() {
      try {
        const response = await axios.get('http://localhost:3000/gestionnaire/stops');
        this.arrets = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des arrêts:', error);
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
    async assignVelo(tourId, veloId) {
      const toast = useToast();
      try {
        await axios.post(`http://localhost:3000/gestionnaire/tours/${tourId}/assignVelo`, { veloId });
        toast.success('Vélo assigné avec succès.');
        await this.fetchTours();
      } catch (error) {
        console.error('Erreur lors de l\'attribution du vélo:', error);
        toast.error('Erreur lors de l\'attribution du vélo.');
      }
    },
    async optimizeTours() {
      const toast = useToast();
      try {
        await axios.post('http://localhost:3000/gestionnaire/optimize');
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
    statusClass(statut) {
      return {
        'text-green-500': statut === 'disponible',
        'text-red-500': statut === 'en_course' || statut === 'maintenance' || statut === 'indisponible'
      };
    }
  }
}
</script>

<style scoped>
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